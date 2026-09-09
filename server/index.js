/**
 * index.js — minimal zero-dependency API server.
 *
 * Responsibilities:
 *   - GET /api/product-price  -> the cached membership price as JSON.
 *   - In production, also serves the built frontend from /dist.
 *
 * The price cache lives in priceService.js; we just start it here and read
 * from it on each request.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { start, getPrice } from "./priceService.js";
import { handleContact } from "./contactService.js";
import { verifyConnection, isConfigured as mailConfigured, missingVars } from "./mailer.js";
import { isConfigured as turnstileConfigured } from "./turnstile.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* Load .env before anything reads process.env. Node has done this natively
   since v20.6, so no dotenv dependency is needed — keeping this server
   dependency-free. Missing file is fine: in production the platform usually
   injects real environment variables instead. */
try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
  // No .env present — fall through to whatever the environment already has.
}
const DIST_DIR = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 3001;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  /* Without this the manifest falls back to application/octet-stream, which
     some browsers refuse to parse — the PWA name and icons are then ignored. */
  ".webmanifest": "application/manifest+json",
};

function sendJson(res, status, body, { cors = true, headers = {} } = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    ...headers,
    "Content-Type": "application/json; charset=utf-8",
    // Allow the dev frontend (different port) to call this directly. Opt-out
    // for routes that accept writes — see /api/contact.
    ...(cors ? { "Access-Control-Allow-Origin": "*" } : {}),
    // Never let the browser/proxy cache an API response — always serve the
    // latest.
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });
  res.end(payload);
}

/** Serve a static file from /dist; returns false if it doesn't exist. */
function serveStatic(res, urlPath) {
  /* A URL pathname is percent-encoded, but the filesystem is not: an asset
     named "Lip Filler.webp" arrives here as "/assets/Lip%20Filler-<hash>.webp"
     and must be decoded before it can be found on disk. Without this, every
     such request missed, fell through to the SPA fallback, and returned
     index.html with a 200 — so the browser tried to decode HTML as an image
     and showed it as broken.

     decodeURIComponent throws on a malformed sequence (a stray "%"), which is a
     bad request rather than a crash. */
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return false;
  }

  // Default to index.html for the root / SPA routes.
  const rel = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.join(DIST_DIR, path.normalize(rel));
  /* Prevent path traversal outside /dist. Checked AFTER decoding, so an
     encoded traversal ("..%2f") cannot slip past the check and then be
     resolved by the filesystem. */
  if (!filePath.startsWith(DIST_DIR + path.sep) && filePath !== DIST_DIR) {
    return false;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;

  res.writeHead(200, {
    "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === "/api/product-price") {
    // Always returns { adults, students }. Values are null until the first
    // successful fetch populates them; the frontend handles that gracefully.
    return sendJson(res, 200, getPrice());
  }

  /* Reports WHICH configuration is missing, never any value. Without this a
     misconfigured deploy only ever says "temporarily unavailable" (503), and
     the reason is buried in logs the browser cannot reach.

     Safe to expose: it returns booleans and variable NAMES only — no host,
     user, password, or key ever appears in the response. */
  if (pathname === "/api/contact/health") {
    const turnstileOff =
      String(process.env.CONTACT_DISABLE_TURNSTILE || "").toLowerCase() === "true";
    const mailOk = mailConfigured();
    const turnstileOk = turnstileConfigured();
    return sendJson(res, 200, {
      ok: mailOk && (turnstileOk || turnstileOff),
      mail: { configured: mailOk, missing: missingVars() },
      turnstile: {
        configured: turnstileOk,
        disabled: turnstileOff,
        missing: turnstileOk || turnstileOff ? [] : ["TURNSTILE_SECRET_KEY"],
      },
    });
  }

  if (pathname === "/api/contact") {
    /* Same-origin by default: in production this server also serves the built
       frontend, and in development Vite proxies /api here, so no CORS header
       is needed either way. CONTACT_ALLOWED_ORIGIN exists for the case where
       the API is deployed on a different host from the site — set it to that
       site's exact origin. Never "*": this route accepts writes. */
    const allowed = (process.env.CONTACT_ALLOWED_ORIGIN || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    const origin = req.headers.origin;
    const corsHeaders =
      origin && allowed.includes(origin)
        ? {
            "Access-Control-Allow-Origin": origin,
            // The response varies by Origin, so a cache must not serve one
            // origin's response to another.
            Vary: "Origin",
          }
        : {};

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      return res.end();
    }

    if (req.method !== "POST") {
      return sendJson(res, 405, { ok: false, error: "Method not allowed" }, { headers: corsHeaders });
    }
    // Unlike the price route, this one is not open to any origin: it accepts
    // writes, so it is same-origin only (the dev server reaches it through
    // Vite's /api proxy, which makes it same-origin there too). A browser on
    // another site therefore cannot post to it on a visitor's behalf.
    return handleContact(req)
      .then(({ status, body }) => sendJson(res, status, body, { cors: false, headers: corsHeaders }))
      .catch((err) => {
        console.error("[contact] unhandled error:", err);
        sendJson(res, 500, { ok: false, error: "Something went wrong." }, { cors: false, headers: corsHeaders });
      });
  }

  // Static assets (production build). In dev, Vite serves the frontend and
  // proxies /api here, so this branch is mostly a no-op during development.
  if (serveStatic(res, pathname)) return;

  // SPA fallback to index.html (if a build exists).
  if (serveStatic(res, "/")) return;

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

/* Check the mail credentials at boot rather than discovering they are wrong
   when the first real enquiry fails. Never fatal: the rest of the site should
   still serve if only the contact form is misconfigured. */
function checkMail() {
  if (!mailConfigured()) {
    console.warn(
      "[mail] not configured — the contact form will refuse submissions.\n" +
        `       Missing in .env: ${missingVars().join(", ")}`
    );
    return;
  }
  verifyConnection().then(({ ok, error }) => {
    if (ok) console.log("[mail] SMTP ready");
    else console.error(`[mail] SMTP check FAILED: ${error}`);
  });
}

// Kick off the price cache (fetch once now, refresh every 7 days), then listen.
start().finally(() => {
  server.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
    checkMail();
  });
});
