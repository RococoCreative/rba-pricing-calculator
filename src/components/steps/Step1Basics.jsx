import { Eyebrow, StepHeading, SelectCard, Label } from '../ui.jsx';
import {
  locationOptions,
  storiesOptions,
  squareFootageRange,
} from '../../config/pricingConfig.js';

/* Step 1 — Project Basics: square footage slider, location dropdown, stories toggle. */
export default function Step1Basics({ selections, update }) {
  const { min, max, step } = squareFootageRange;

  return (
    <div className="animate-fadeInUp">
      <Eyebrow>Project Basics</Eyebrow>
      <StepHeading
        title="Let's start with the essentials"
        subtitle="A few details about size and location set the foundation for your estimate."
      />

      {/* Square footage slider */}
      <div className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <Label>Square Footage</Label>
          <span className="font-display text-2xl font-semibold text-accent">
            {selections.squareFootage.toLocaleString()} sqft
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={selections.squareFootage}
          onChange={(e) => update({ squareFootage: Number(e.target.value) })}
          aria-label="Square footage"
        />
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>{min.toLocaleString()} sqft</span>
          <span>{max.toLocaleString()} sqft</span>
        </div>
      </div>

      {/* Location dropdown */}
      <div className="mb-10">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <select
            id="location"
            value={selections.location}
            onChange={(e) => update({ location: e.target.value })}
            className="w-full appearance-none rounded-lg border border-line bg-surface px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {locationOptions.map((opt) => (
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

      {/* Stories toggle */}
      <div>
        <Label>Number of Storeys</Label>
        <div className="grid grid-cols-3 gap-3">
          {storiesOptions.map((opt) => (
            <SelectCard
              key={opt.key}
              selected={selections.stories === opt.key}
              onClick={() => update({ stories: opt.key })}
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
