/**
 * priceService.js
 * ----------------
 * Fetches the Al Nojoom Club WooCommerce product page, extracts the membership
 * price for each gender variation (man / woman), and keeps them in an in-memory
 * cache.
 *
 * The product is a WooCommerce variable product with a `gender` attribute
 * (man / woman). Each variation carries its own price, so we read them from the
 * embedded variations JSON rather than scraping the visible price text.
 *
 * Cache strategy:
 *   - Fetched once on startup (see start()) so the cache is warm immediately.
 *   - Refreshed automatically every PRICE_REFRESH_MS (7 days).
 *   - The cache is ONLY replaced on a successful fetch + parse. Any failure
 *     (network error, page change, no price found) is caught and logged, and
 *     the previous _priceCache is left untouched — so we keep serving the last
 *     successfully fetched prices instead of regressing to null.
 */

const PRODUCT_URL = "https://everlastwellness.store/product/alnojoom-club/";
const PRICE_REFRESH_MS = 7 * 24 * 60 * 60 * 1000; // refresh cadence (2 min for testing; use 7 days in prod)

// In-memory cache. Shape: { man: string|null, woman: string|null }.
let _priceCache = { man: null, woman: null };
let _refreshTimer = null;

// Decode the HTML entities WooCommerce uses when embedding JSON in an attribute.
const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

// Normalise a WooCommerce price to a plain integer string.
//   - Numbers (from variation JSON, e.g. 6999)        -> "6999"
//   - European text (e.g. "6.999,00 AED")             -> "6999"
//     ("." = thousands, "," = decimal; both are dropped along with decimals)
function normalizePrice(value) {
  if (value == null) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(Math.round(value)) : null;
  }
  const m = String(value).match(/([\d.,]+)/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
  return Number.isFinite(num) ? String(Math.round(num)) : null;
}

/**
 * Primary parser: read per-gender prices from WooCommerce's embedded
 * `data-product_variations` JSON. Returns { man, woman } or null if absent.
 */
function parseVariationPrices(html) {
  const m = html.match(/data-product_variations="([\s\S]*?)"/);
  if (!m) return null;

  let variations;
  try {
    variations = JSON.parse(decodeEntities(m[1]));
  } catch {
    return null;
  }
  if (!Array.isArray(variations)) return null;

  const prices = { man: null, woman: null };
  for (const v of variations) {
    // Find the gender among this variation's attribute values (key name can vary).
    const gender = Object.values(v.attributes || {})
      .map((x) => String(x).toLowerCase())
      .find((x) => x === "man" || x === "woman");
    // display_price is the current (sale-adjusted) price.
    const price = normalizePrice(v.display_price);
    if (gender && price) prices[gender] = price;
  }

  return prices.man || prices.woman ? prices : null;
}

/**
 * Fallback parser: if the variations JSON is missing, read the single visible
 * product price from <p class="price"> (ignoring related products, and the
 * struck-through original price of on-sale items) and apply it to both genders.
 */
function parseVisiblePrice(html) {
  const priceSectionRe =
    /<p[^>]*\bclass="[^"]*\bprice\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g;
  let priceSection = null;
  let psm;``
  while ((psm = priceSectionRe.exec(html)) !== null) {
    if (psm[1].includes("woocommerce-Price-amount")) {
      priceSection = psm[1];
      break;
    }
  }
  if (!priceSection) return null;

  // Drop the <del> "was" price so on-sale items use the current price.
  const source = priceSection.replace(/<del[\s\S]*?<\/del>/gi, "");
  const m = source.match(
    /class="woocommerce-Price-amount[^"]*"[^>]*>([\s\S]*?)<\/span>/
  );
  if (!m) return null;
  const price = normalizePrice(m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " "));
  if (!price) return null;
  return { man: price, woman: price };
}

export async function fetchAndCachePrice() {
  // Cache-busting: a unique query param + no-cache headers defeat any full-page
  // / edge cache (Cloudflare, LiteSpeed, WP Rocket) that could otherwise return
  // stale HTML and make refreshes look like they "aren't working".
  const url = `${PRODUCT_URL}?t=${Date.now()}`;
  console.log(`[price] ── refresh start @ ${new Date().toISOString()}`);
  console.log(`[price] GET ${url}`);
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AlnojoomBot/1.0)",
        Accept: "text/html",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // Surface whether an upstream cache served this response.
    const edgeCache =
      r.headers.get("cf-cache-status") ||
      r.headers.get("x-cache") || 
      r.headers.get("x-litespeed-cache") ||
      "n/a";
    const age = r.headers.get("age") || "n/a";
    console.log(
      `[price] HTTP ${r.status} | edge-cache: ${edgeCache} | age: ${age}`
    );

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();

    // Prefer per-gender variation prices; fall back to the single visible price.
    const prices = parseVariationPrices(html) || parseVisiblePrice(html);

    if (!prices) {
      console.warn("[price] Could not parse price from store page (cache unchanged)");
      return; // keep existing cache
    }

    console.log("[price] parsed prices:", JSON.stringify(prices));
    const before = JSON.stringify(_priceCache);
    _priceCache = { man: prices.man ?? null, woman: prices.woman ?? null };
    const after = JSON.stringify(_priceCache);
    console.log(
      before === after
        ? `[price] cache unchanged: ${after}`
        : `[price] cache UPDATED: ${before} -> ${after}`
    );
  } catch (err) {
    // Failure path: leave _priceCache as-is (last good prices).
    console.error("[price] Fetch/parse error (cache unchanged):", err.message);
  }
}

/** Current cached price: { man, woman }. */
export function getPrice() {
  return _priceCache;
}

/** Fetch once immediately, then refresh on the configured interval. */
export async function start() {
  await fetchAndCachePrice();
  if (!_refreshTimer) {
    _refreshTimer = setInterval(fetchAndCachePrice, PRICE_REFRESH_MS);
    // unref() lets the process exit if nothing else is running, but does NOT
    // stop the timer from firing while the HTTP server keeps the loop alive.
    if (typeof _refreshTimer.unref === "function") _refreshTimer.unref();
    console.log(
      `[price] auto-refresh scheduled every ${PRICE_REFRESH_MS / 1000}s`
    );
  }
  return _priceCache;
}
