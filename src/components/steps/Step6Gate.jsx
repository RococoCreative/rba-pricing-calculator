import { useState } from 'react';
import { Eyebrow, StepHeading, PrimaryButton, Label, TextInput } from '../ui.jsx';

/* Basic but solid email format check. */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* Step 6 — Lead Gate: first name, last name, email (required); phone (optional).
 * Validates before allowing reveal. `submitting` / `error` reflect the POST. */
export default function Step6Gate({ contact, update, onReveal, submitting }) {
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
      <Eyebrow>Almost There</Eyebrow>
      <StepHeading
        title="Reveal your estimate"
        subtitle="Tell us where to send your detailed estimate. No spam — just your numbers."
      />

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
