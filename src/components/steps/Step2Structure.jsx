import { Eyebrow, StepHeading, SelectCard, Label } from '../ui.jsx';
import { foundationOptions, garageOptions } from '../../config/pricingConfig.js';

/* Step 2 — Structure: foundation type dropdown, garage type toggle. */
export default function Step2Structure({ selections, update }) {
  return (
    <div className="animate-fadeInUp">
      <Eyebrow>Structure</Eyebrow>
      <StepHeading
        title="The bones of your home"
        subtitle="Foundation and garage choices shape both the build and the budget."
      />

      {/* Foundation dropdown */}
      <div className="mb-10">
        <Label htmlFor="foundation">Foundation Type</Label>
        <div className="relative">
          <select
            id="foundation"
            value={selections.foundation}
            onChange={(e) => update({ foundation: e.target.value })}
            className="w-full appearance-none rounded-lg border border-line bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {foundationOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted">
            ▾
          </span>
        </div>
      </div>

      {/* Garage toggle */}
      <div>
        <Label>Garage</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {garageOptions.map((opt) => (
            <SelectCard
              key={opt.key}
              selected={selections.garage === opt.key}
              onClick={() => update({ garage: opt.key })}
              className="text-center"
            >
              <span className="block text-sm font-semibold text-ink">
                {opt.label}
              </span>
            </SelectCard>
          ))}
        </div>
      </div>
    </div>
  );
}
