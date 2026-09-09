/**
 * contactService.js
 * -----------------
 * Handles POST /api/contact: validates the submission, verifies its Turnstile
 * token, and hands the message off for delivery.
 *
 * Everything here runs before delivery, so a submission that fails validation
 * or verification never reaches the delivery step.
 */

import { verify, isConfigured } from "./turnstile.js";
import { sendEnquiry, isConfigured as mailConfigured, missingVars } from "./mailer.js";

// Enough for a long enquiry, small enough that a junk payload cannot tie up
// memory. Applied while reading, so an oversized body is dropped mid-stream
// rather than buffered in full and rejected afterwards.
const MAX_BODY_BYTES = 16 * 1024;

const LIMITS = { name: 100, phone: 32, email: 200, message: 4000, country: 2 };

/** Reads and JSON-parses a request body, refusing anything oversized. */
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    let aborted = false;

    req.on("data", (chunk) => {
      if (aborted) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        aborted = true;
        /* Stop buffering, but do NOT destroy the socket: that kills the
           connection before the 413 can be written, and the client sees a
           dropped request instead of a status code. Pause and drain instead,
           so the response still gets out. */
        req.pause();
        req.resume();
        reject(new Error("payload-too-large"));
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (aborted) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("invalid-json"));
      }
    });

    req.on("error", () => reject(new Error("read-failed")));
  });
}

/**
 * The visitor's IP. Behind a proxy or CDN the socket address is the proxy's, so
 * prefer the forwarded header when one is present.
 *
 * NOTE: X-Forwarded-For is trivially spoofed by a client talking to the server
 * directly, so this value is only trustworthy when a proxy you control sets it.
 * It is used for the rate-limit bucket and as an optional Turnstile signal —
 * never as proof of identity.
 */
function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

/* ── Rate limiting ──
   Turnstile already stops the bulk of automated abuse, but a valid token does
   not stop one person submitting the form fifty times. This caps each IP to a
   handful of submissions per window, kept in memory: a single-process server
   with no datastore, so it resets on restart and is not shared across
   instances. That is a deliberate floor, not a complete solution — put a real
   limiter at the proxy if this ever runs multi-instance. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
/* Tunable so testing does not require editing code. The default is deliberately
   low for production; raise CONTACT_RATE_MAX while testing the form.

   Read lazily, not into a constant: this module is imported before index.js
   calls loadEnvFile(), so a value captured here would ignore .env entirely. */
const rateMax = () => Number(process.env.CONTACT_RATE_MAX) || 5;
const hits = new Map(); // ip -> number[] (timestamps)

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }

  if (recent.length >= rateMax()) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/* Control characters have no place in any submitted field and are a common
   marker of an injection attempt. Tabs and newlines are kept — a message may
   legitimately contain them; headers are separately sanitised in mailer.js. */
const clean = (v, max) =>
  str(v, max).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

/** Shape-checks the submitted fields. Returns { ok, fields } or { ok, error }. */
function validate(body) {
  const fields = {
    name: clean(body.name, LIMITS.name),
    country: clean(body.country, LIMITS.country).toUpperCase(),
    dial: clean(body.dial, 8),
    phone: clean(body.phone, LIMITS.phone),
    email: clean(body.email, LIMITS.email),
    message: clean(body.message, LIMITS.message),
  };

  if (!fields.name) return { ok: false, error: "Please enter your name." };
  if (!fields.phone) return { ok: false, error: "Please enter your phone number." };
  if (!/^[\d+()\-.\s]{4,}$/.test(fields.phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  // Deliberately loose: the only address that truly validates is one that
  // receives mail, and a stricter pattern mostly rejects valid unusual ones.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!fields.message) return { ok: false, error: "Please enter a message." };

  /* The client caps these too, but a request need not come from our form, so
     the server enforces the limits rather than trusting the truncation above
     to be the only thing standing between us and a 4MB "name". */
  for (const [key, max] of Object.entries(LIMITS)) {
    if (typeof body[key] === "string" && body[key].length > max) {
      return { ok: false, error: `That ${key} is too long.` };
    }
  }

  return { ok: true, fields };
}

/** Delivers a validated enquiry by email. Throws if the send fails. */
async function deliver(fields) {
  await sendEnquiry(fields);
  // Deliberately minimal: enough to correlate a delivery with a complaint about
  // a missing enquiry, without writing the visitor's message or contact details
  // into the server log.
  console.log(`[contact] enquiry delivered for ${fields.email}`);
}

/**
 * Handles a POST /api/contact request.
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function handleContact(req) {
  /* Escape hatch for testing the mail path on its own. Set
     CONTACT_DISABLE_TURNSTILE=true in .env to skip verification.

     THIS REMOVES THE BOT PROTECTION — the endpoint will accept anything that
     posts to it. Only for local testing; never set it in production. */
  const turnstileOff =
    String(process.env.CONTACT_DISABLE_TURNSTILE || "").toLowerCase() === "true";

  // Mail is always a precondition: better to say the form is unavailable than
  // to take a message and silently drop it.
  if (!mailConfigured() || (!turnstileOff && !isConfigured())) {
    if (!turnstileOff && !isConfigured()) {
      console.error("[contact] TURNSTILE_SECRET_KEY is not set; refusing submissions.");
    }
    if (!mailConfigured()) {
      console.error(
        `[contact] mail is not configured (missing: ${missingVars().join(", ")}); refusing submissions.`
      );
    }
    return {
      status: 503,
      body: { ok: false, error: "The contact form is temporarily unavailable." },
    };
  }

  let body;
  try {
    body = await readJson(req);
  } catch (err) {
    const tooLarge = err.message === "payload-too-large";
    return {
      status: tooLarge ? 413 : 400,
      body: { ok: false, error: tooLarge ? "Message is too long." : "Malformed request." },
    };
  }

  /* Honeypot. The field is hidden from people, so anything in it came from a
     bot filling every input it found. Answer 200 rather than an error: telling
     a spammer exactly which check caught them just helps them tune. Nothing is
     sent. */
  if (str(body.company, 200)) {
    console.warn("[contact] honeypot triggered; dropping submission");
    return { status: 200, body: { ok: true } };
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    const mins = Math.ceil(RATE_WINDOW_MS / 60000);
    console.warn(`[contact] rate limit hit for ${ip}`);
    return {
      status: 429,
      body: {
        ok: false,
        error: `You've sent several messages already. Please try again in ${mins} minutes.`,
      },
    };
  }

  // Verify before validating: a bot's payload should cost us as little as
  // possible, and the token check is what tells the two apart.
  if (turnstileOff) {
    console.warn("[contact] ⚠ Turnstile DISABLED — accepting unverified submission");
  } else {
    const check = await verify(body.turnstileToken, ip);
    if (!check.ok) {
      console.warn("[contact] turnstile rejected:", check.error);
      return {
        status: 403,
        body: { ok: false, error: "Verification failed. Please try again." },
      };
    }
  }

  const result = validate(body);
  if (!result.ok) return { status: 400, body: { ok: false, error: result.error } };

  try {
    await deliver(result.fields);
  } catch (err) {
    /* Log the SMTP detail server-side — it is what makes a delivery failure
       diagnosable — but never return it: response codes and hostnames are
       exactly the internals the visitor must not see. */
    console.error(
      "[contact] delivery FAILED:",
      err.responseCode ? `${err.responseCode} ${err.response}` : err.message
    );
    return {
      status: 502,
      body: {
        ok: false,
        error:
          "We couldn't send your message right now. Please email us at " +
          "customer.service@everlastwellness.com or call +971 600551615.",
      },
    };
  }

  return { status: 200, body: { ok: true } };
}
