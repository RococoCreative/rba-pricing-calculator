import { Eyebrow, PrimaryButton, GhostButton } from '../ui.jsx';
import { formatRange } from '../../lib/calculateEstimate.js';
import { buildBreakdown } from '../../lib/buildBreakdown.js';
import { generateEstimatePdf } from '../../lib/generateEstimatePdf.js';

/* The discovery-call destination is configurable via env (falls back to #). */
const DISCOVERY_CALL_URL = import.meta.env.VITE_DISCOVERY_CALL_URL || '#';

const DISCLAIMER =
  'This estimate is based on current regional market averages and your selected specifications. Final pricing requires a full scope review and site assessment.';

/* Step 7 — Results: unlocked range, line-item breakdown, CTAs, disclaimer.
 * `leadError` is a soft warning shown when the webhook POST failed but the
 * estimate was still revealed (UX is never blocked by a webhook hiccup). */
export default function Step7Results({ selections, contact, estimate, leadError }) {
  const breakdown = buildBreakdown(selections);

  const handleDownloadPdf = () => {
    try {
      generateEstimatePdf({ contact, estimate, breakdown });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fadeInUp text-center">
      <Eyebrow>Your Estimate</Eyebrow>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {contact.firstName ? `Here it is, ${contact.firstName}` : 'Here it is'}
      </h2>

      {/* Soft, non-blocking notice if the lead failed to send. */}
      {leadError && (
        <p className="mx-auto mt-4 max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          We couldn't save your details just now, but your estimate is ready
          below. Please reach out directly so we don't lose your project.
        </p>
      )}

      {/* Prominent unlocked range */}
      <div className="mx-auto mt-6 max-w-lg rounded-xl2 border border-accent/30 bg-surface p-10">
        <p className="text-sm font-medium uppercase tracking-widest text-ink-muted">
          Estimated Cost Range
        </p>
        <p className="mt-3 font-display text-4xl font-semibold text-accent sm:text-5xl">
          {formatRange(estimate.low, estimate.high)}
        </p>
      </div>

      {/* Line-item breakdown */}
      <div className="mx-auto mt-8 max-w-lg rounded-xl2 border border-line bg-surface p-6 text-left">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-ink-muted">
          Your Selections
        </h3>
        <dl className="divide-y divide-line">
          {breakdown.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 py-3">
              <dt className="text-sm text-ink-muted">{row.label}</dt>
              <dd className="text-right text-sm font-semibold text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton
          onClick={() => {
            if (DISCOVERY_CALL_URL !== '#') window.open(DISCOVERY_CALL_URL, '_blank', 'noopener');
          }}
        >
          Schedule a Discovery Call
        </PrimaryButton>
        <GhostButton onClick={handleDownloadPdf}>Download estimate as PDF</GhostButton>
      </div>

      {/* Disclaimer */}
      <p className="mx-auto mt-10 max-w-lg text-xs leading-relaxed text-ink-muted">
        {DISCLAIMER}
      </p>
    </div>
  );
}
