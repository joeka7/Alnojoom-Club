/**
 * Al Nojoom symbol set.
 *
 * These are drawn for this brand rather than pulled from a UI icon library.
 * A few construction rules keep them editorial instead of dashboard-generic:
 *
 *   · 32-unit grid, not the 24 of every stock set — finer detail per glyph.
 *   · Hairline 1.1 stroke with butt caps and mitre joins. Stock icons are
 *     1.5–2 with round caps, which is most of why they read as "web UI".
 *   · Open, asymmetric forms. Lines are allowed to end in space rather than
 *     closing into a tidy container shape.
 *   · Botanical, celestial and contour motifs over literal pictograms — no
 *     shields, clocks, calendars or rounded hearts.
 *
 * The interface icons (arrows, menu, close, check) stay plain and quiet by
 * design: they are wayfinding, not art direction, and shouldn't compete.
 *
 * Brand marks — social logos, app-store badges — are filled glyphs owned by
 * other companies and deliberately live outside this system.
 */

/** Shared sizing scale. Call sites pass `size={ICON_SIZE.md}`, not raw px. */
export const ICON_SIZE = {
  xxs: 12, // eyebrow/badge accents, alongside mono capitals
  xs: 14, // inline with small/mono text
  sm: 16, // inline with body text, buttons
  md: 20, // meta rows, contact tiles
  lg: 26, // card signatures — a touch larger than stock, they carry detail
  xl: 34, // section-level focal marks (used sparingly)
}

/** Hairline weight for the symbol set. */
const HAIRLINE = 1.1

/** Slightly heavier weight for small interface marks, which need to hold up. */
const UI_STROKE = 1.4

/**
 * Editorial symbol shell — 32 grid, hairline, butt caps, mitre joins.
 * Strokes inherit `currentColor` so a symbol takes the colour of its context.
 */
export function Symbol({
  size = ICON_SIZE.lg,
  color = 'currentColor',
  strokeWidth = HAIRLINE,
  children,
  ...rest
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/**
 * Plain interface shell for wayfinding marks (arrows, menu, close, check).
 * 24 grid and a slightly heavier stroke: these need to stay legible at 14–16px
 * and are intentionally unremarkable so the symbols above carry the character.
 */
export function Icon({
  size = ICON_SIZE.sm,
  color = 'currentColor',
  strokeWidth = UI_STROKE,
  children,
  ...rest
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ── Interface: wayfinding only ─────────────────────────────────────────── */

/** Rightward arrow — inline links and CTAs. */
export function ArrowRight({ size = ICON_SIZE.sm, ...rest }) {
  return (
    <Icon size={size} {...rest}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  )
}

/** Diagonal arrow — outbound links. */
export function ArrowDiag({ size = ICON_SIZE.sm, ...rest }) {
  return (
    <Icon size={size} {...rest}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Icon>
  )
}

/** Menu control. Three rules, the middle one short — a small editorial tell. */
export function MenuIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Icon size={size} {...rest}>
      <path d="M3 6h18M3 12h12M3 18h18" />
    </Icon>
  )
}

/** Close control. */
export function CloseIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Icon size={size} {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  )
}

/** Checkmark for benefit lists. `light` tints it for dark backgrounds. */
export function CheckIcon({ size = ICON_SIZE.sm, light = false, ...rest }) {
  return (
    <Icon
      size={size}
      color={light ? 'var(--aln-wine-soft)' : 'var(--aln-wine)'}
      {...rest}
    >
      <path d="m5 12 5 5L20 7" />
    </Icon>
  )
}

/* ── Contact & information ──────────────────────────────────────────────── */

/**
 * Location — a fine pin drawn as a tapering arc over a point, rather than the
 * solid teardrop-with-a-hole of every map UI.
 */
export function LocationIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M16 29c0-6.6 7-9.8 7-15.8A7 7 0 0 0 9 13.2C9 19.2 16 22.4 16 29Z" />
      <circle cx={16} cy={13} r={2.4} />
    </Symbol>
  )
}

/** Phone — a slim handset outline. */
export function PhoneIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M11.4 4.6c1 0 1.6.5 2 1.4l1.3 3.2c.3.9.2 1.5-.5 2.1l-1.7 1.4a15.5 15.5 0 0 0 6.8 6.8l1.4-1.7c.6-.7 1.2-.8 2.1-.5l3.2 1.3c.9.4 1.4 1 1.4 2v2.9c0 1.4-1 2.3-2.4 2.2C13.2 27 5 18.8 4.4 8c-.1-1.4.8-2.4 2.2-2.4Z" />
    </Symbol>
  )
}

/** Email — an open envelope with a fine flap line. */
export function MailIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <rect x={3.5} y={7.5} width={25} height={17} />
      <path d="m3.5 9.5 12.5 8.6L28.5 9.5" />
    </Symbol>
  )
}

/**
 * Hours — a fine dial with slender hands. Kept for contact information, where
 * the meaning has to be literal.
 */
export function HoursIcon({ size = ICON_SIZE.md, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <circle cx={16} cy={16} r={12.5} />
      <path d="M16 8v8.4l5.6 3.4" />
    </Symbol>
  )
}

/* ── Editorial symbols: the art-directed set ────────────────────────────── */

/**
 * Laurel — expertise and credentials. Two facing sprigs, open at the top:
 * the classical mark of merit, and the reason no shield is needed.
 */
export function LaurelSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M11.5 27C7.7 22.9 6.4 16.4 8.4 9.5" />
      <path d="M20.5 27c3.8-4.1 5.1-10.6 3.1-17.5" />
      <path d="M9.3 12.6c-2.4-.6-3.4-2.2-3.1-4.7 2.4.6 3.5 2.2 3.1 4.7Z" />
      <path d="M9.6 18.6c-2.4-.6-3.5-2.2-3.1-4.7 2.4.6 3.4 2.2 3.1 4.7Z" />
      <path d="M11.2 24.2c-2.3-.9-3.1-2.6-2.5-5 2.3.9 3.1 2.6 2.5 5Z" />
      <path d="M22.7 12.6c2.4-.6 3.4-2.2 3.1-4.7-2.4.6-3.5 2.2-3.1 4.7Z" />
      <path d="M22.4 18.6c2.4-.6 3.5-2.2 3.1-4.7-2.4.6-3.4 2.2-3.1 4.7Z" />
      <path d="M20.8 24.2c2.3-.9 3.1-2.6 2.5-5-2.3.9-3.1 2.6-2.5 5Z" />
    </Symbol>
  )
}

/**
 * Crescent and star — the club's celestial cue (Al Nojoom, "the stars") and
 * the idea of a journey over time.
 */
export function CrescentSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M18.4 3.6a12.7 12.7 0 1 0 2.6 24.6A15.1 15.1 0 0 1 18.4 3.6Z" />
      <path d="M25.4 5.2c.4 2.7.9 3.2 3.6 3.6-2.7.4-3.2.9-3.6 3.6-.4-2.7-.9-3.2-3.6-3.6 2.7-.4 3.2-.9 3.6-3.6Z" />
    </Symbol>
  )
}

/**
 * Botanical stem — considered, cultivated technique. Cultivation rather than
 * a settings gear or a sparkle burst.
 */
export function StemSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M16 29.5V9" />
      <path d="M16 18.5c-4.6 0-7-2.6-7-7 4.6 0 7 2.6 7 7Z" />
      <path d="M16 15c4.6 0 7-2.6 7-7-4.6 0-7 2.6-7 7Z" />
      <circle cx={16} cy={5.6} r={3.2} />
    </Symbol>
  )
}

/**
 * Profile contour — personalised care, drawn as a fine facial line. The
 * brand's own motif, and pointedly not a heart.
 */
export function ContourSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M22.8 2.5c-6.6 0-11.6 4.6-11.6 11 0 2.4.7 4.3 1.8 6.4.5 1 .3 1.6-.7 2.1l-2.6 1.3c-.9.5-1.1 1.1-.5 1.9l2.3 3.3" />
      <path d="M14.4 12.2c1.3-.8 2.7-.8 3.9.2" />
      <path d="M15.2 22.6c1.4.6 2.7.5 4-.4" />
    </Symbol>
  )
}

/**
 * Petal bloom — hydration and skin quality. Four petals around a still centre;
 * an abstract botanical rather than a literal water droplet.
 */
export function BloomSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M16 16c0-5 1.8-7.5 5.5-7.5C21.5 12.5 19.7 16 16 16Z" />
      <path d="M16 16c5 0 7.5 1.8 7.5 5.5C19.5 21.5 16 19.7 16 16Z" />
      <path d="M16 16c0 5-1.8 7.5-5.5 7.5C10.5 19.5 12.3 16 16 16Z" />
      <path d="M16 16c-5 0-7.5-1.8-7.5-5.5C12.5 10.5 16 12.3 16 16Z" />
    </Symbol>
  )
}

/**
 * Facet — precision and definition, as in lip enhancement. A cut-gem outline:
 * exact, faceted, quietly luxurious.
 */
export function FacetSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M16 4.5 27 13l-4.2 13.5H9.2L5 13Z" />
      <path d="M5 13h22M16 4.5 12.2 13l3.8 13.5L19.8 13Z" />
    </Symbol>
  )
}

/**
 * Radiance — a fine eight-point burst with a still centre. Deliberately not
 * the thick-rayed sun of a stock brightness control.
 */
export function RadianceSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <circle cx={16} cy={16} r={12.4} />
      <circle cx={16} cy={16} r={7.6} />
      <path d="M12.4 12.2a5.4 5.4 0 0 1 3.2-1.6" />
    </Symbol>
  )
}

/**
 * Lozenge — the unlimited, renewing membership. Nested rhombs: a quiet seal
 * of belonging, chosen over an infinity loop or a literal container.
 */
export function LozengeSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M16 3.2 28.8 16 16 28.8 3.2 16Z" />
      <path d="M16 9.6 22.4 16 16 22.4 9.6 16Z" />
    </Symbol>
  )
}

/**
 * Hourglass — priority booking and time held for the member. An editorial
 * form; a calendar grid would read straight out of a scheduling app.
 */
export function HourglassSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M8.5 3h15M8.5 29h15" />
      <path d="M10.6 3v4.6c0 3 5.4 5.7 5.4 8.4 0 2.7-5.4 5.4-5.4 8.4V29" />
      <path d="M21.4 3v4.6c0 3-5.4 5.7-5.4 8.4 0 2.7 5.4 5.4 5.4 8.4V29" />
    </Symbol>
  )
}

/**
 * Leaf — definition and shaping. A pointed oval with a centre rule; abstract
 * enough to sit with the botanical marks rather than depict a tool.
 */
export function LeafSymbol({ size = ICON_SIZE.lg, ...rest }) {
  return (
    <Symbol size={size} {...rest}>
      <path d="M4.6 16c5.2-6.4 17.6-6.4 22.8 0-5.2 6.4-17.6 6.4-22.8 0Z" />
      <path d="M11.6 16h8.8" />
    </Symbol>
  )
}

/**
 * Star — the house mark, from the club's name. Filled and elongated so it
 * reads as a typographic asterisk beside mono capitals at 12px, where a
 * hairline outline would break up.
 */
export function StarIcon({ size = ICON_SIZE.xxs, color = 'var(--aln-wine)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 .5c1.1 8.3 3.4 12.9 15.5 15.5C19.4 18.6 17.1 23.2 16 31.5c-1.1-8.3-3.4-12.9-15.5-15.5C12.6 13.4 14.9 8.8 16 .5Z" />
    </svg>
  )
}
