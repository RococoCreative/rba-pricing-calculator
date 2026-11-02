/* Small, shared presentational primitives used across steps.
 * Kept dependency-free and styled with the brand Tailwind tokens. */

/** Eyebrow label above a step heading. */
export function Eyebrow({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ink">
      {children}
    </p>
  );
}

/** Step heading + optional subtitle. */
export function StepHeading({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 max-w-xl text-ink-muted">{subtitle}</p>}
    </div>
  );
}

/** Primary accent button. */
export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded bg-accent px-7 py-3.5 text-sm font-bold tracking-wide text-on-accent transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Secondary / ghost button. */
export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded border border-line px-6 py-3.5 text-sm font-bold tracking-wide text-ink transition hover:border-accent hover:text-accent-ink ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Resolve a /public asset path so it works under any base path or embed. */
export const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

/** Round check badge shown on a selected option. */
function CheckBadge({ selected }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition duration-300 ease-premium ${
        selected
          ? 'scale-100 border-accent bg-accent text-on-accent'
          : 'scale-90 border-white/70 bg-black/20 text-transparent'
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const optionRing = (selected) =>
  selected
    ? 'border-accent ring-2 ring-accent'
    : 'border-line hover:border-ink-muted';

/**
 * Photo option card: full-bleed image, label over a dark gradient.
 * `aspectClass` sets the photo shape; `compact` = smaller label, no description
 * (used for the must-haves grid); `tightMobile` hides the description on phones
 * when cards sit two-up.
 */
export function ImageOption({
  option,
  selected,
  onSelect,
  aspectClass = 'aspect-[4/3]',
  compact = false,
  tightMobile = false,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative w-full overflow-hidden rounded-xl2 border bg-surface-2 text-left transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink ${optionRing(selected)}`}
    >
      <div className={aspectClass}>
        <img
          src={assetUrl(option.image)}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
          className="h-full w-full object-cover transition duration-700 ease-premium group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute right-3 top-3">
        <CheckBadge selected={selected} />
      </div>
      <div className={`absolute inset-x-0 bottom-0 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
        <span
          className={`block font-display font-bold leading-tight text-white ${
            compact ? 'text-sm sm:text-[1rem]' : 'text-lg sm:text-xl'
          }`}
        >
          {option.label}
        </span>
        {!compact && option.description && (
          <span
            className={`mt-1 text-sm leading-snug text-white/80 ${
              tightMobile ? 'hidden sm:block' : 'block'
            }`}
          >
            {option.description}
          </span>
        )}
      </div>
    </button>
  );
}

/** House glyph whose size grows with `level` (0-based) for the size question. */
function HouseGlyph({ level }) {
  const size = 28 + level * 10;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 22L24 7l18 15" strokeLinecap="round" />
      <path d="M11 19v22h26V19" />
      <path d="M20 41V29h8v12" />
    </svg>
  );
}

/** Size option card: growing house icon, tier name, range, and hint. */
export function ScaleOption({ option, selected, onSelect, level }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex w-full flex-col items-center rounded-xl2 border bg-surface px-3 pb-5 pt-6 sm:px-4 text-center transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink ${optionRing(selected)} ${
        selected ? 'bg-surface-2' : ''
      }`}
    >
      <span
        className={`flex h-20 items-end transition duration-300 ${
          selected ? 'text-accent-ink' : 'text-ink-muted group-hover:text-ink'
        }`}
      >
        <HouseGlyph level={level} />
      </span>
      <span className="mt-4 font-display text-lg font-bold text-ink">{option.label}</span>
      <span className="mt-1 whitespace-nowrap text-xs font-medium text-ink sm:text-sm">
        {option.range}
      </span>
      <span className="mt-1 text-xs text-ink-muted">{option.hint}</span>
    </button>
  );
}

/** Simple text option card (location, lot, timeline). */
export function TextOption({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between gap-4 rounded-xl2 border px-5 py-4 text-left transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ink ${optionRing(selected)} ${
        selected ? 'bg-surface-2' : 'bg-surface'
      }`}
    >
      <span>
        <span className="block font-bold text-ink">{option.label}</span>
        {option.description && (
          <span className="mt-0.5 block text-sm text-ink-muted">{option.description}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`h-5 w-5 flex-shrink-0 rounded-full border-2 transition ${
          selected ? 'border-accent bg-accent shadow-[inset_0_0_0_3px_rgb(var(--color-surface-2))]' : 'border-line'
        }`}
      />
    </button>
  );
}

/** Field label for form inputs. */
export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-ink-muted"
    >
      {children}
    </label>
  );
}

/** Styled text input. */
export function TextInput({ invalid, className = '', ...props }) {
  return (
    <input
      className={`w-full rounded border bg-surface px-4 py-3 text-ink placeholder-ink-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent ${
        invalid ? 'border-red-500/70' : 'border-line'
      } ${className}`}
      {...props}
    />
  );
}
