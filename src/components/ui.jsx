/* Small, shared presentational primitives used across steps.
 * Kept dependency-free and styled with the brand Tailwind tokens. */

/** Eyebrow label above a step heading. */
export function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
      {children}
    </p>
  );
}

/** Step heading + optional subtitle. */
export function StepHeading({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
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
      className={`inline-flex items-center justify-center gap-2 rounded bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-on-accent transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 rounded border border-line px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:border-accent hover:text-accent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * A selectable card/tile used for toggles and visual selectors.
 * `selected` drives the accent border + ring.
 */
export function SelectCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full rounded-xl2 border p-5 text-left transition duration-300 ease-premium ${
        selected
          ? 'border-accent bg-surface-2 ring-1 ring-accent'
          : 'border-line bg-surface hover:border-ink-muted'
      } ${className}`}
    >
      {children}
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
      className={`w-full rounded-lg border bg-surface px-4 py-3 text-ink placeholder-ink-muted/60 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent ${
        invalid ? 'border-red-500/70' : 'border-line'
      } ${className}`}
      {...props}
    />
  );
}
