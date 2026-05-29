import { Eyebrow, StepHeading, SelectCard } from '../ui.jsx';
import { finishOptions } from '../../config/pricingConfig.js';

/* Step 3 — Finish Level: 3-tier visual selector, each with a short descriptor. */
export default function Step3Finish({ selections, update }) {
  return (
    <div className="animate-fadeInUp">
      <Eyebrow>Finish Level</Eyebrow>
      <StepHeading
        title="Choose your level of finish"
        subtitle="From premium to fully bespoke — this defines the character of every room."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {finishOptions.map((opt) => (
          <SelectCard
            key={opt.key}
            selected={selections.finish === opt.key}
            onClick={() => update({ finish: opt.key })}
            className="flex h-full flex-col"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-ink">
                {opt.label}
              </span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  selections.finish === opt.key
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-line text-transparent'
                }`}
              >
                ✓
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              {opt.description}
            </p>
          </SelectCard>
        ))}
      </div>
    </div>
  );
}
