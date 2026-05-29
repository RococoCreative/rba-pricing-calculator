import { Eyebrow, StepHeading } from '../ui.jsx';
import { formatRange } from '../../lib/calculateEstimate.js';

/* Step 5 — Estimate Preview: the live range shown BLURRED with an unlock CTA. */
export default function Step5Preview({ estimate }) {
  return (
    <div className="animate-fadeInUp text-center">
      <Eyebrow>Your Estimate</Eyebrow>
      <StepHeading title="Your estimate is ready" />

      <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl2 border border-line bg-surface p-10">
        {/* Blurred figure — credible but unreadable until the gate is passed. */}
        <div className="estimate-blur">
          <p className="text-sm font-medium uppercase tracking-widest text-ink-muted">
            Estimated Cost Range
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-accent sm:text-5xl">
            {formatRange(estimate.low, estimate.high)}
          </p>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-base/60 text-accent">
            {/* lock glyph */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md text-ink-muted">
        Enter your details on the next step to reveal your full estimated cost
        range and a breakdown of your selections.
      </p>
    </div>
  );
}
