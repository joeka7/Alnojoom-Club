/**
 * mailer.js
 * ---------
 * Sends contact-form enquiries over SMTP.
 *
 * Host, port and TLS mode are configuration, not code, so this works with any
 * provider — the clinic's own mail host, Gmail, or a transactional service —
 * without edits here. See .env.example for the variables.
 *
 * If SMTP_HOST is Gmail, note that Gmail rejects a normal account password over
 * SMTP: SMTP_PASS must then be a 16-character App Password, which requires
 * 2-Step Verification on the account.
 *
 * Credentials live only in the server environment. Nothing in this file is
 * reachable from the browser bundle: Vite only inlines variables prefixed
 * VITE_, and these deliberately are not.
 *
 * The transport is created lazily and reused. Creating it at module load would
 * read process.env before index.js has called loadEnvFile(), so the credentials
 * would always be empty — the same trap turnstile.js documents.
 */

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* The logo travels with the message as an inline attachment rather than a
   remote <img src="https://...">. Mail clients block remote images by default,
   which would leave a broken placeholder in the header until the reader clicks
   "show images"; an embedded part always renders. */
/* White version of the mark: it sits on the wine header, where the dark
   original would be invisible. */
const LOGO_PATH = path.join(__dirname, "assets", "logo-light.png");
const LOGO_CID = "alnojoom-logo";

/* Two accepted names per setting. SMTP_* is the documented scheme; EMAIL_* is
   what the Railway service already has configured, and renaming variables in a
   live deployment is a needless outage. First non-empty wins. */
const env = (...names) => {
  for (const n of names) {
    const v = process.env[n];
    if (v !== undefined && v !== "") return v;
  }
  return "";
};

const cfg = () => {
  const port = Number(env("SMTP_PORT", "EMAIL_PORT")) || 465;
  const secureRaw = env("SMTP_SECURE", "EMAIL_SECURE");

  return {
    host: env("SMTP_HOST", "EMAIL_HOST"),
    port,
    /* Implicit TLS on 465; STARTTLS (which nodemailer expresses as
       secure:false) on 587. When unset, derive it from the port rather than
       defaulting blindly — a wrong pairing here fails to connect at all. */
    secure: secureRaw ? secureRaw.toLowerCase() !== "false" : port === 465,
    user: env("SMTP_USER", "EMAIL_USER"),
    pass: env("SMTP_PASS", "EMAIL_PASS"),
    to: env("CONTACT_RECEIVER_EMAIL", "EMAIL_TO"),
  };
};

export function isConfigured() {
  const { host, user, pass, to } = cfg();
  return Boolean(host && user && pass && to);
}

/** Which required variables are missing — for a precise startup message. */
export function missingVars() {
  const c = cfg();
  return [
    ["SMTP_HOST / EMAIL_HOST", c.host],
    ["SMTP_USER / EMAIL_USER", c.user],
    ["SMTP_PASS / EMAIL_PASS", c.pass],
    ["CONTACT_RECEIVER_EMAIL / EMAIL_TO", c.to],
  ]
    .filter(([, v]) => !v)
    .map(([k]) => k);
}

let transport = null;

function getTransport() {
  if (transport) return transport;
  const { host, port, secure, user, pass } = cfg();

  transport = nodemailer.createTransport({
    host,
    /* port 465 + secure:true is TLS from the first byte. Port 587 uses
       secure:false, which for nodemailer means "start plaintext, then upgrade
       via STARTTLS" — not "no encryption". */
    port,
    secure,
    auth: { user, pass },
    // Refuse to continue if the server's certificate does not validate; the
    // default already does this, but an explicit setting documents that
    // downgrading it would be a security decision, not a config tweak.
    tls: { rejectUnauthorized: true },
    // Keep one connection open across submissions instead of reconnecting and
    // re-authenticating for every enquiry.
    pool: true,
    maxConnections: 2,
  });
  return transport;
}

/* HTML-escape anything that came from the form. Without this, a message
   containing markup would be injected into the email body — and an address
   like `"><script>` would break out of the surrounding attribute. */
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* Only claim verification when it actually ran. While CONTACT_DISABLE_TURNSTILE
   is set the check is skipped, and a footer asserting otherwise would be
   telling the reader the message is more trustworthy than it is. */
function verifiedNote() {
  const off =
    String(process.env.CONTACT_DISABLE_TURNSTILE || "").toLowerCase() === "true";
  return off ? "." : " — verified by Cloudflare Turnstile.";
}

function buildHtml(f, phone) {
  /* Links get an explicit colour: left unstyled, Outlook dark mode recolours
     them to something with no contrast against the white card. */
  const link = (href, text) =>
    `<a href="${href}" style="color:#831649;text-decoration:underline;">${text}</a>`;

  const rows = [
    ["Name", esc(f.name)],
    ["Email", link(`mailto:${esc(f.email)}`, esc(f.email))],
    ["Phone", link(`tel:${esc(phone.replace(/\s/g, ""))}`, esc(phone))],
    ["Country", esc(f.country || "—")],
  ]
    .map(
      ([k, v]) =>
        `<tr>
          <td class="aln-label aln-mute" width="96" style="width:96px;padding:7px 14px 7px 0;color:#6b5a62;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;vertical-align:top;">${k}</td>
          <td class="aln-value aln-ink" style="padding:7px 0;color:#241319;font-family:Helvetica,Arial,sans-serif;font-size:14px;vertical-align:top;">${v}</td>
        </tr>`
    )
    .join("");

  /* Outlook Classic (Windows) renders through Word, not a browser. That means:
       - <div> max-width is ignored, so the layout must be nested TABLEs with
         fixed widths;
       - background-image/gradients are ignored, so solid bgcolor attributes
         (not just CSS) carry the colour;
       - dark mode force-inverts light backgrounds while leaving inline color
         alone, which turned the wine header pink and stripped the white card.
         mso-* hints plus explicit bgcolor on every cell keep it stable.
     The logo on the wine band is the white variant, so it reads whether or not
     the client inverts anything. */
  return `<!doctype html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <!-- Opt into both schemes, then pin our own colours, so a client that has
         a dark mode does not invent one for us. -->
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <!--[if mso]>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    <![endif]-->
    <style>
      /* Outlook.com / Windows Mail dark mode: stop the forced inversion of our
         panels and keep text legible on the colours we chose. */
      [data-ogsc] .aln-card { background: #ffffff !important; }
      [data-ogsc] .aln-band { background: #f7f3ed !important; }
      [data-ogsc] .aln-wine { background: #831649 !important; }
      [data-ogsc] .aln-ink  { color: #241319 !important; }
      [data-ogsc] .aln-mute { color: #6b5a62 !important; }
      [data-ogsc] .aln-onwine { color: #ffffff !important; }
      @media only screen and (max-width: 620px) {
        .aln-shell { width: 100% !important; }
        .aln-label { display: block !important; width: 100% !important; padding-bottom: 2px !important; }
        .aln-value { display: block !important; width: 100% !important; padding-bottom: 12px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f7f3ed;">
    <!-- Full-width backdrop. bgcolor as an attribute, because Word ignores the
         CSS equivalent. -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f3ed" style="background:#f7f3ed;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:24px 12px;">

          <!--[if mso]>
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"><tr><td>
          <![endif]-->
          <table role="presentation" class="aln-shell" width="560" cellpadding="0" cellspacing="0" border="0"
                 style="width:560px;max-width:560px;border-collapse:collapse;">

            <!-- Wine header with the light logo -->
            <tr>
              <td class="aln-wine" bgcolor="#831649" align="center"
                  style="background:#831649;padding:26px 24px 22px;border-radius:14px 14px 0 0;">
                <img src="cid:${LOGO_CID}" width="104" alt="Al Nojoom Club"
                     style="display:block;width:104px;max-width:104px;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto 14px;" />
                <div class="aln-onwine" style="color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:18px;line-height:1.3;font-weight:600;">
                  New contact enquiry
                </div>
              </td>
            </tr>

            <!-- Details card -->
            <tr>
              <td class="aln-card" bgcolor="#ffffff" style="background:#ffffff;padding:24px;border-left:1px solid #e7ded6;border-right:1px solid #e7ded6;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  ${rows}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:18px;">
                  <tr><td style="border-top:1px solid #ece5dc;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
                </table>

                <div class="aln-mute" style="color:#6b5a62;font-family:Helvetica,Arial,sans-serif;font-size:12px;margin:16px 0 7px;">Message</div>
                <div class="aln-ink" style="color:#241319;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(f.message)}</div>
              </td>
            </tr>

            <tr>
              <td class="aln-card" bgcolor="#ffffff" style="background:#ffffff;height:14px;font-size:0;line-height:0;border:1px solid #e7ded6;border-top:0;border-radius:0 0 14px 14px;">&nbsp;</td>
            </tr>

            <tr>
              <td align="center" style="padding:14px 12px 0;font-family:Helvetica,Arial,sans-serif;font-size:11.5px;color:#8c7a83;">
                Sent from the contact form at alnojoomclub.com${verifiedNote()}
              </td>
            </tr>
          </table>
          <!--[if mso]></td></tr></table><![endif]-->

        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* Strips CR/LF (and the quotes that would end a display name) from anything
   interpolated into a header. A name containing a newline could otherwise
   append headers of its own — "Bcc: victim@example.com" — turning the form
   into an open relay. Nodemailer guards its own encoding, but the header value
   is ours to build safely.

   Applied to header fields only. The message body is not a header: newlines
   there are legitimate and are preserved. */
const header = (s, max = 160) =>
  String(s ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/["<>]/g, "")
    .trim()
    .slice(0, max);

/* Some hosts throttle a mailbox after a burst and reject with a 5xx that reads
   permanent — everlastwellness.com answers "550 classified as SPAM" — even
   though the identical message is accepted moments later. Retrying briefly
   turns that transient rejection into a delivered message instead of an error
   the visitor sees.

   Deliberately short and bounded: two retries over ~6s, well inside the
   request the visitor is waiting on. A genuinely bad message still fails, just
   a few seconds later. */
const RETRY_DELAYS_MS = [2000, 4000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** True for failures worth retrying: throttling, greylisting, timeouts. */
function isTransient(err) {
  const code = err.responseCode;
  const text = String(err.response || err.message || "").toLowerCase();
  if (code >= 400 && code < 500) return true; // 4xx is transient by definition
  if (["ETIMEDOUT", "ECONNRESET", "ESOCKET", "ECONNECTION"].includes(err.code)) return true;
  // 5xx that are really rate limiting rather than a rejected message.
  return (
    code === 550 &&
    (text.includes("spam") || text.includes("rate") || text.includes("try again"))
  );
}

/**
 * Sends one enquiry. Throws on failure so the caller can report it.
 * @param {{name:string,email:string,phone:string,dial:string,country:string,message:string}} f
 */
export async function sendEnquiry(f) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await sendOnce(f);
    } catch (err) {
      lastErr = err;
      if (attempt === RETRY_DELAYS_MS.length || !isTransient(err)) throw err;
      console.warn(
        `[mail] send attempt ${attempt + 1} failed (${err.responseCode || err.code}); retrying…`
      );
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  throw lastErr;
}

async function sendOnce(f) {
  const { user, to } = cfg();
  const phone = `${f.dial || ""} ${f.phone || ""}`.trim();
  const name = header(f.name, 100);

  await getTransport().sendMail({
    /* From is the site's own SMTP identity, never the visitor's address:
       sending as them would fail SPF/DKIM for their domain and read as
       spoofing. The visitor goes on Reply-To, so hitting Reply in the mail
       client still answers them. */
    from: `"Website Contact Form" <${user}>`,
    to,
    replyTo: f.email ? `"${name}" <${header(f.email, 200)}>` : undefined,
    subject: `New Contact Form Submission - ${name}`,
    // Plain-text alternative for clients that do not render HTML.
    text: [
      `Name:    ${f.name}`,
      `Email:   ${f.email}`,
      `Phone:   ${phone}`,
      `Country: ${f.country || "—"}`,
      "",
      f.message,
    ].join("\n"),
    html: buildHtml(f, phone),
    /* Inline part referenced by the header's cid: URL. If the file is missing
       the mail still sends — the header just falls back to the alt text rather
       than the send failing over a decoration. */
    attachments: logoAttachment(),
  });
}

/* Read once and cached: the file does not change between sends, and re-reading
   it per enquiry is pointless I/O. */
let logoCache;

function logoAttachment() {
  if (logoCache === undefined) {
    try {
      logoCache = fs.readFileSync(LOGO_PATH);
    } catch {
      console.warn(`[mail] logo not found at ${LOGO_PATH}; sending without it`);
      logoCache = null;
    }
  }
  if (!logoCache) return [];
  return [
    {
      filename: "logo.png",
      content: logoCache,
      cid: LOGO_CID,
      /* Marks the part as inline so clients render it in place instead of
         listing it as a downloadable attachment. */
      contentDisposition: "inline",
    },
  ];
}

/** Verifies SMTP credentials without sending anything. */
export async function verifyConnection() {
  if (!isConfigured()) return { ok: false, error: "not-configured" };
  try {
    await getTransport().verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
