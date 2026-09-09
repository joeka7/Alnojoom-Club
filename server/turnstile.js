/**
 * turnstile.js
 * ------------
 * Server-side verification for Cloudflare Turnstile.
 *
 * The widget in the browser only produces a token. That token proves nothing
 * until it is exchanged with Cloudflare here, from the server, using the secret
 * key — a bot can post straight to /api/contact and skip the widget entirely,
 * so this check is the actual protection, not the widget.
 *
 * Tokens are single-use and expire ~5 minutes after they are issued; Cloudflare
 * rejects a replay, which is what stops a captured token being reused.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/* Read lazily, not into a module-level constant: ES imports are hoisted and
   evaluated before the importing module's body runs, so a constant here would
   be captured before index.js calls loadEnvFile() — and would always be empty.
 *
 * Fail closed if the secret is missing: without it nothing can be verified, so
 * accepting submissions would mean running with no protection at all while
 * appearing to be protected. */
const secret = () => process.env.TURNSTILE_SECRET_KEY || "";

export function isConfigured() {
  return Boolean(secret());
}

/**
 * Verifies a Turnstile token.
 *
 * @param {string} token   The `cf-turnstile-response` value from the form.
 * @param {string} [ip]    The visitor's IP, if known — Cloudflare uses it as an
 *                         extra signal, but verification works without it.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function verify(token, ip) {
  const key = secret();
  if (!key) return { ok: false, error: "not-configured" };
  if (!token) return { ok: false, error: "missing-token" };

  const body = new URLSearchParams({ secret: key, response: token });
  if (ip) body.set("remoteip", ip);

  // Never let a slow verification hold a request open indefinitely.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!res.ok) return { ok: false, error: `http-${res.status}` };

    const data = await res.json();
    if (data.success) return { ok: true };

    // Cloudflare returns an array of machine-readable codes, e.g.
    // "timeout-or-duplicate" for a replayed token.
    return { ok: false, error: (data["error-codes"] || []).join(",") || "failed" };
  } catch (err) {
    // Network failure or timeout. Fail closed — see the note above.
    return { ok: false, error: err.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
