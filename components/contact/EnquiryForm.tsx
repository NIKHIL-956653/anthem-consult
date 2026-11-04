'use client';

import { useId, useMemo, useState, type FormEvent } from 'react';
import {
  isValidEnquiry,
  LIMITS,
  normalizeEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryResponse,
} from '@/lib/enquiry';
import { contactPage, services, site, type ServiceId } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success'; reference: string } | { kind: 'error'; mailto: string };

interface FormState {
  name: string;
  organization: string;
  email: string;
  phone: string;
  services: ServiceId[];
  message: string;
  website: string;
}

const initialState: FormState = {
  name: '',
  organization: '',
  email: '',
  phone: '',
  services: [],
  message: '',
  website: '',
};

function buildMailto(state: FormState): string {
  const picked = services.filter((s) => state.services.includes(s.id)).map((s) => s.title);
  const subject = `Enquiry from ${state.name || 'the website'}`;
  const body = [
    `Name: ${state.name}`,
    `Organization: ${state.organization}`,
    `Email: ${state.email}`,
    `Phone: ${state.phone}`,
    `Services: ${picked.join(', ')}`,
    '',
    state.message,
  ].join('\n');
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EnquiryForm() {
  const id = useId();
  const [state, setState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const { bind } = useHoverIndex();
  const labels = contactPage.form.fields;

  const fieldId = (name: string) => `${id}-${name}`;
  const errorId = (name: string) => `${id}-${name}-error`;

  const update = (field: keyof FormState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: ServiceId) => {
    setState((prev) => {
      const has = prev.services.includes(serviceId);
      const next = has ? prev.services.filter((s) => s !== serviceId) : [...prev.services, serviceId];
      return { ...prev, services: next };
    });
    setTouched((prev) => ({ ...prev, services: true }));
  };

  const validate = (next: FormState) => {
    const result = validateEnquiry(normalizeEnquiry(next));
    setErrors(result);
    return result;
  };

  const onBlur = (field: EnquiryField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(state);
  };

  const showError = (field: EnquiryField) => (touched[field] ? errors[field] : undefined);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate(state);
    setTouched({ name: true, organization: true, email: true, phone: true, services: true, message: true });
    if (!isValidEnquiry(result)) {
      const first = Object.keys(result)[0];
      document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizeEnquiry(state)),
      });
      const data = (await response.json()) as EnquiryResponse;
      if (response.ok && data.ok && data.reference) {
        setStatus({ kind: 'success', reference: data.reference });
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        setStatus({ kind: 'idle' });
        return;
      }
      setStatus({ kind: 'error', mailto: buildMailto(state) });
    } catch {
      setStatus({ kind: 'error', mailto: buildMailto(state) });
    }
  };

  const remaining = useMemo(() => LIMITS.message - state.message.length, [state.message]);

  if (status.kind === 'success') {
    return (
      <div className="panel-solid flex flex-col gap-4 p-6 sm:p-8" role="status" aria-live="polite">
        <p className="font-label text-gold">Enquiry received</p>
        <h3 className="heading-md">{contactPage.form.successHeading}</h3>
        <p className="text-base text-muted">{contactPage.form.successText}</p>
        <p className="tabular font-mono text-2xl text-gold-hot">{status.reference}</p>
        <button
          type="button"
          className="btn-ghost self-start"
          onClick={() => {
            setState(initialState);
            setErrors({});
            setTouched({});
            setStatus({ kind: 'idle' });
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="panel-solid relative flex flex-col gap-5 p-6 sm:p-8" aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`} className="heading-md">
        {contactPage.form.heading}
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId('name')} label={labels.name} error={showError('name')} errorId={errorId('name')} required>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            value={state.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={() => onBlur('name')}
            aria-invalid={showError('name') ? 'true' : undefined}
            aria-describedby={showError('name') ? errorId('name') : undefined}
            className="field-input"
          />
        </Field>
        <Field id={fieldId('organization')} label={labels.organization} error={showError('organization')} errorId={errorId('organization')}>
          <input
            id={fieldId('organization')}
            name="organization"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.organization}
            value={state.organization}
            onChange={(e) => update('organization', e.target.value)}
            onBlur={() => onBlur('organization')}
            className="field-input"
          />
        </Field>
        <Field id={fieldId('email')} label={labels.email} error={showError('email')} errorId={errorId('email')} required>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            required
            value={state.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={showError('email') ? 'true' : undefined}
            aria-describedby={showError('email') ? errorId('email') : undefined}
            className="field-input"
          />
        </Field>
        <Field id={fieldId('phone')} label={labels.phone} error={showError('phone')} errorId={errorId('phone')}>
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phone}
            value={state.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            aria-invalid={showError('phone') ? 'true' : undefined}
            aria-describedby={showError('phone') ? errorId('phone') : undefined}
            className="field-input"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="font-label mb-3">
          {labels.service} <span className="text-gold">*</span>
        </legend>
        <div className="flex flex-wrap gap-2" id={fieldId('services')} tabIndex={-1}>
          {services.map((service, index) => {
            const pressed = state.services.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                className="chip hover:border-gold/60"
                aria-pressed={pressed}
                onClick={() => toggleService(service.id)}
                {...bind(index)}
              >
                {service.title}
              </button>
            );
          })}
        </div>
        {showError('services') ? (
          <p id={errorId('services')} className="mt-2 text-sm text-[#F5A98A]" role="alert">
            {showError('services')}
          </p>
        ) : null}
      </fieldset>

      <Field id={fieldId('message')} label={labels.message} error={showError('message')} errorId={errorId('message')} required>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={6}
          maxLength={LIMITS.message}
          required
          value={state.message}
          onChange={(e) => update('message', e.target.value)}
          onBlur={() => onBlur('message')}
          aria-invalid={showError('message') ? 'true' : undefined}
          aria-describedby={showError('message') ? errorId('message') : `${id}-remaining`}
          className="field-input resize-y"
        />
        <p id={`${id}-remaining`} className="font-label tabular mt-2">
          {remaining} characters left
        </p>
      </Field>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={fieldId('website')}>Website</label>
        <input
          id={fieldId('website')}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      {status.kind === 'error' ? (
        <div className="rounded-md border border-[#F5A98A]/40 bg-[#F5A98A]/5 p-4" role="alert">
          <p className="font-medium text-ivory">{contactPage.form.errorHeading}</p>
          <p className="mt-1 text-sm text-muted">{contactPage.form.errorText}</p>
          <a href={status.mailto} className="btn-ghost mt-4">
            {contactPage.form.mailtoLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted">{contactPage.form.privacy}</p>
        <button type="submit" className="btn-gold" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? contactPage.form.sending : contactPage.form.submit}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  errorId: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ id, label, error, errorId, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-label mb-2">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[#F5A98A]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
