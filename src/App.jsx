import { useEffect, useMemo, useRef, useState } from 'react';
import Stepper from './components/Stepper.jsx';
import { PrimaryButton, GhostButton, assetUrl } from './components/ui.jsx';
import QuestionStep from './components/QuestionStep.jsx';
import Welcome from './components/steps/Welcome.jsx';
import LeadGate from './components/steps/LeadGate.jsx';
import Results from './components/steps/Results.jsx';
import { questions } from './config/questions.js';
import { calculateEstimate, formatMaskedRange } from './lib/calculateEstimate.js';
import { buildLeadPayload, postLead } from './lib/buildLeadPayload.js';

/* Screen order: welcome → one screen per question → lead gate → results.
 * `step` indexes this list: 0 = welcome, 1..N = questions, N+1 = gate, N+2 = results. */
const Q = questions.length;
const GATE = Q + 1;
const RESULTS = Q + 2;

// Pause after a single-choice tap so the selection registers before advancing.
const AUTO_ADVANCE_MS = 320;

// Every answer starts empty, so the user actively picks each one.
const EMPTY_SELECTIONS = Object.fromEntries(
  questions.map((q) => [q.field, q.type === 'multi' ? [] : null])
);

export default function App() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState(EMPTY_SELECTIONS);
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [leadError, setLeadError] = useState(''); // shown on results if POST failed
  const advanceTimer = useRef(null);
  const topRef = useRef(null);

  const updateContact = (patch) => setContact((c) => ({ ...c, ...patch }));

  // ---- LIVE estimate: recomputed on every selection change ----
  const estimate = useMemo(() => calculateEstimate(selections), [selections]);

  // Blurred displays get a decoy figure so the real range stays behind the gate.
  const maskedRange = useMemo(
    () => formatMaskedRange(estimate.low, estimate.high),
    [estimate]
  );

  const goTo = (s) => {
    clearTimeout(advanceTimer.current);
    setStep(Math.max(0, Math.min(s, RESULTS)));
  };
  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  // Keep the top of the calculator in view when the screen changes (matters
  // on phones and inside an iframe embed).
  useEffect(() => {
    if (step > 0) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Warm the cache for every option photo once the welcome screen is up, so
  // each question appears with its images ready.
  useEffect(() => {
    const id = setTimeout(() => {
      questions.forEach((q) =>
        q.options.forEach((o) => {
          if (o.image) new Image().src = assetUrl(o.image);
        })
      );
    }, 600);
    return () => clearTimeout(id);
  }, []);

  const question = step >= 1 && step <= Q ? questions[step - 1] : null;

  const handleAnswer = (key) => {
    const { field, type } = question;
    if (type === 'multi') {
      setSelections((s) => ({
        ...s,
        [field]: s[field].includes(key) ? s[field].filter((k) => k !== key) : [...s[field], key],
      }));
      return;
    }
    setSelections((s) => ({ ...s, [field]: key }));
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep((s) => s + 1), AUTO_ADVANCE_MS);
  };

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
      goTo(RESULTS); // advance to results regardless of POST outcome
    }
  };

  const renderStep = () => {
    if (step === 0) return <Welcome questionCount={Q} onStart={next} />;
    if (question)
      return (
        <QuestionStep
          key={question.field}
          question={question}
          value={selections[question.field]}
          onAnswer={handleAnswer}
        />
      );
    if (step === GATE)
      return (
        <LeadGate
          contact={contact}
          update={updateContact}
          onReveal={handleReveal}
          submitting={submitting}
          maskedRange={maskedRange}
        />
      );
    return (
      <Results selections={selections} contact={contact} estimate={estimate} leadError={leadError} />
    );
  };

  // Footer nav on question screens. Single-choice questions advance on tap, so
  // "Continue" only appears once they have an answer (e.g. after going Back).
  const answered = question
    ? question.type === 'multi' || selections[question.field] !== null
    : false;
  const continueLabel =
    question?.type === 'multi' && selections[question.field].length === 0
      ? 'Skip'
      : 'Continue';

  return (
    <div ref={topRef} className="flex min-h-full items-start justify-center px-4 py-8 sm:items-center sm:py-12">
      <div className="w-full max-w-3xl">
        <header className="mb-6 text-center">
          <p className="font-display text-lg font-bold tracking-wide text-ink">Custom Home Build</p>
          <p className="text-sm text-ink-muted">Instant Estimate Calculator</p>
        </header>

        <div className="overflow-hidden rounded-xl2 border border-line bg-surface/40 p-6 backdrop-blur sm:p-10">
          {step >= 1 && step <= GATE && (
            <Stepper
              current={step - 1}
              total={Q + 1}
              label={question ? question.eyebrow : 'Your Details'}
            />
          )}

          {renderStep()}

          {(question || step === GATE) && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <GhostButton onClick={back}>Back</GhostButton>
              {question &&
                (answered ? (
                  <PrimaryButton onClick={next}>{continueLabel}</PrimaryButton>
                ) : (
                  <p className="text-sm text-ink-muted">Tap an option to continue</p>
                ))}
            </div>
          )}

          {/* Live (blurred) estimate ticker on question screens, for credibility. */}
          {question && (
            <div className="mt-8 border-t border-line pt-5 text-center">
              <p className="text-xs uppercase tracking-widest text-ink-muted">Live Estimate</p>
              <p
                className="estimate-blur mt-1 font-display text-2xl font-bold text-accent"
                aria-hidden="true"
              >
                {maskedRange}
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
