import { useMemo, useState } from 'react';
import Stepper from './components/Stepper.jsx';
import { PrimaryButton, GhostButton } from './components/ui.jsx';
import Step1Basics from './components/steps/Step1Basics.jsx';
import Step2Structure from './components/steps/Step2Structure.jsx';
import Step3Finish from './components/steps/Step3Finish.jsx';
import Step4AddOns from './components/steps/Step4AddOns.jsx';
import Step5Preview from './components/steps/Step5Preview.jsx';
import Step6Gate from './components/steps/Step6Gate.jsx';
import Step7Results from './components/steps/Step7Results.jsx';
import { calculateEstimate, formatRange } from './lib/calculateEstimate.js';
import { buildLeadPayload, postLead } from './lib/buildLeadPayload.js';
import { squareFootageRange } from './config/pricingConfig.js';

// Step labels drive the progress indicator and flow length.
const STEP_LABELS = [
  'Basics',
  'Structure',
  'Finish',
  'Add-Ons',
  'Preview',
  'Details',
  'Results',
];

export default function App() {
  const [step, setStep] = useState(0);

  // ---- All user selections (internal keys; labels resolved at the edges) ----
  const [selections, setSelections] = useState({
    squareFootage: squareFootageRange.default,
    location: 'gtaCore',
    stories: 'two',
    foundation: 'unfinishedBasement',
    garage: 'attached2',
    finish: 'ultraLuxury',
    selectedAddOns: [],
  });

  // ---- Lead contact info ----
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [leadError, setLeadError] = useState(''); // shown on results if POST failed

  const updateSelections = (patch) => setSelections((s) => ({ ...s, ...patch }));
  const updateContact = (patch) => setContact((c) => ({ ...c, ...patch }));

  // ---- LIVE estimate: recomputed on every selection change ----
  const estimate = useMemo(() => calculateEstimate(selections), [selections]);

  const isLast = step === STEP_LABELS.length - 1;
  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // ---- Gate submit: POST the lead, then ALWAYS reveal results ----
  const handleReveal = async () => {
    setSubmitting(true);
    setLeadError('');
    try {
      const payload = buildLeadPayload({ contact, selections, estimate });
      await postLead(payload);
    } catch (err) {
      // Don't block the user on a webhook hiccup — surface a soft notice on
      // the results page instead.
      console.error('Lead POST failed:', err);
      setLeadError(err.message || 'Failed to submit lead.');
    } finally {
      setSubmitting(false);
      next(); // advance to results regardless of POST outcome
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step1Basics selections={selections} update={updateSelections} />;
      case 1:
        return <Step2Structure selections={selections} update={updateSelections} />;
      case 2:
        return <Step3Finish selections={selections} update={updateSelections} />;
      case 3:
        return <Step4AddOns selections={selections} update={updateSelections} />;
      case 4:
        return <Step5Preview estimate={estimate} />;
      case 5:
        return (
          <Step6Gate
            contact={contact}
            update={updateContact}
            onReveal={handleReveal}
            submitting={submitting}
          />
        );
      case 6:
        return (
          <Step7Results
            selections={selections}
            contact={contact}
            estimate={estimate}
            leadError={leadError}
          />
        );
      default:
        return null;
    }
  };

  // Navigation visibility: the gate (5) and results (6) manage their own CTAs.
  const showFooterNav = step < 5;
  const isPreview = step === 4;

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Brand header */}
        <header className="mb-8 text-center">
          <p className="font-display text-lg font-semibold tracking-wide text-ink">
            Custom Home Build
          </p>
          <p className="text-sm text-ink-muted">Instant Estimate Calculator</p>
        </header>

        <div className="rounded-xl2 border border-line bg-surface/40 p-6 backdrop-blur sm:p-10">
          {!isLast && <Stepper steps={STEP_LABELS} current={step} />}

          {renderStep()}

          {/* Footer navigation for steps 1–5 */}
          {showFooterNav && (
            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 0 ? (
                <GhostButton onClick={back}>Back</GhostButton>
              ) : (
                <span />
              )}
              <PrimaryButton onClick={next}>
                {isPreview ? 'Unlock My Estimate' : 'Continue'}
              </PrimaryButton>
            </div>
          )}

          {/* Live (blurred) estimate ticker on the input steps, for credibility. */}
          {step < 4 && (
            <div className="mt-8 border-t border-line pt-5 text-center">
              <p className="text-xs uppercase tracking-widest text-ink-muted">
                Live Estimate
              </p>
              <p className="estimate-blur mt-1 font-display text-2xl font-semibold text-accent">
                {formatRange(estimate.low, estimate.high)}
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          Estimates are indicative and subject to a full scope review.
        </p>
      </div>
    </div>
  );
}
