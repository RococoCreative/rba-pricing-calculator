import { useState } from 'react';
import { Eyebrow, StepHeading, PrimaryButton, Label, TextInput } from '../ui.jsx';

/* Basic but solid email format check. */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* Lead Gate: the blurred estimate plus the contact form that unlocks it.
 * First name, last name, email (required); phone (optional).
 * `maskedRange` is a decoy figure (see formatMaskedRange), so the real range
 * never reaches the DOM before the form is submitted. */
export default function LeadGate({ contact, update, onReveal, submitting, maskedRange }) {
  const [touched, setTouched] = useState({});

  const emailValid = isValidEmail(contact.email);
  const firstValid = contact.firstName.trim().length > 0;
  const lastValid = contact.lastName.trim().length > 0;
  const formValid = emailValid && firstValid && lastValid;

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true });
    if (formValid && !submitting) onReveal();
  };

  return (
    <div className="animate-fadeInUp">
      <Eyebrow>Your Estimate Is Ready</Eyebrow>
      <StepHeading
        title="Where should we send it?"
        subtitle="Unlock your estimated range and a copy for your inbox. No spam, just your numbers."
      />

      {/* Locked estimate */}
      <div className="relative mb-8 overflow-hidden rounded-xl2 border border-line bg-surface px-6 py-7 text-center">
        <div className="estimate-blur" aria-hidden="true">
          <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
            Estimated Cost Range
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-accent sm:text-4xl">
            {maskedRange}
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-base/30">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 bg-base/70 text-accent-ink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <TextInput
              id="firstName"
              value={contact.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              onBlur={() => markTouched('firstName')}
              invalid={touched.firstName && !firstValid}
              placeholder="Jane"
              autoComplete="given-name"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <TextInput
              id="lastName"
              value={contact.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              onBlur={() => markTouched('lastName')}
              invalid={touched.lastName && !lastValid}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) => update({ email: e.target.value })}
            onBlur={() => markTouched('email')}
            invalid={touched.email && !emailValid}
            placeholder="jane@example.com"
            autoComplete="email"
          />
          {touched.email && !emailValid && (
            <p className="mt-1.5 text-sm text-red-400">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone <span className="text-ink-muted/60">(optional)</span></Label>
          <TextInput
            id="phone"
            type="tel"
            value={contact.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
        </div>

        <PrimaryButton type="submit" disabled={!formValid || submitting} className="w-full sm:w-auto">
          {submitting ? 'Revealing…' : 'Reveal My Estimate'}
        </PrimaryButton>

        <p className="text-xs leading-relaxed text-ink-muted">
          By submitting, you agree to be contacted about your project. We respect
          your privacy and never share your information.
        </p>
      </form>
    </div>
  );
}
