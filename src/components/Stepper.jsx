/* Progress indicator: one segment per question plus the final details step. */
export default function Stepper({ current, total, label }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
          {current < total - 1 ? `Question ${current + 1} of ${total - 1}` : 'Last step'}
        </p>
        <p className="text-xs font-medium text-accent-ink">{label}</p>
      </div>
      <div
        className="mt-3 flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current + 1}
      >
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
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
