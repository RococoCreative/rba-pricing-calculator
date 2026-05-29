import { Eyebrow, StepHeading, SelectCard } from '../ui.jsx';
import { addOnOptions } from '../../config/pricingConfig.js';
import { formatCurrency } from '../../lib/calculateEstimate.js';

/* Step 4 — Add-Ons: checkbox cards, each showing its add-on cost. */
export default function Step4AddOns({ selections, update }) {
  const selected = selections.selectedAddOns;

  const toggle = (key) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    update({ selectedAddOns: next });
  };

  return (
    <div className="animate-fadeInUp">
      <Eyebrow>Add-Ons</Eyebrow>
      <StepHeading
        title="Tailor it to your lifestyle"
        subtitle="Select any features you'd like included. You can change these anytime."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {addOnOptions.map((opt) => {
          const isOn = selected.includes(opt.key);
          return (
            <SelectCard key={opt.key} selected={isOn} onClick={() => toggle(opt.key)}>
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border text-[10px] ${
                    isOn
                      ? 'border-accent bg-accent text-base'
                      : 'border-line text-transparent'
                  }`}
                >
                  ✓
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-ink">{opt.label}</span>
                    <span className="flex-shrink-0 text-sm font-semibold text-accent">
                      +{formatCurrency(opt.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {opt.description}
                  </p>
                </div>
              </div>
            </SelectCard>
          );
        })}
      </div>
    </div>
  );
}
