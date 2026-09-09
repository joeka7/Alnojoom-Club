import { useEffect, useState } from "react";

/**
 * Fetches the membership price from the backend API once, on mount.
 *
 * Returns:
 *   - data:    { adults: string, students: string|null } | null
 *   - loading: true until the request settles
 *   - error:   true if the fetch failed or the price is unavailable
 *
 * The component decides how to render each state; this hook only owns the
 * fetch lifecycle.
 */
export function useMembershipPrice() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/product-price", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

/** Format a plain price string ("6999") for display ("6,999"). */
export function formatPrice(value) {
  if (value == null) return null;
  return Number(value).toLocaleString("en-US");
}
