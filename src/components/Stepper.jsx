/* Progress indicator shown at the top of the calculator.
 * Renders one segment per step and fills completed/active segments. */

export default function Stepper({ steps, current }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
          Step {current + 1} of {steps.length}
        </p>
        <p className="text-xs font-medium text-accent">{steps[current]}</p>
      </div>
      <div className="mt-3 flex gap-1.5">
        {steps.map((label, i) => (
          <div
            key={label}
            className="h-1 flex-1 overflow-hidden rounded-full bg-line"
            aria-current={i === current ? 'step' : undefined}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-premium"
              style={{ width: i <= current ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
