/**
 * Enquiry form model and validation, shared by the client form and the API route.
 * No framework imports: this file must run in both the browser and the Node runtime.
 */

import { services, type ServiceId } from './siteConfig';

export const serviceIds = services.map((s) => s.id) as ServiceId[];

export interface EnquiryInput {
  name: string;
  organization: string;
  email: string;
  phone: string;
  services: ServiceId[];
  message: string;
  /** Honeypot: must stay empty. Bots that fill every field are rejected silently. */
  website?: string;
}

export type EnquiryField = 'name' | 'organization' | 'email' | 'phone' | 'services' | 'message';

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const LIMITS = {
  name: 80,
  organization: 120,
  email: 160,
  phone: 32,
  message: 2000,
  messageMin: 20,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{6,32}$/;

function text(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Coerce an unknown payload (form state or JSON body) into a well-typed input. */
export function normalizeEnquiry(raw: unknown): EnquiryInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const rawServices = Array.isArray(r.services) ? r.services : [];
  const picked = rawServices.filter(
    (s): s is ServiceId => typeof s === 'string' && (serviceIds as string[]).includes(s),
  );
  return {
    name: text(r.name, LIMITS.name),
    organization: text(r.organization, LIMITS.organization),
    email: text(r.email, LIMITS.email).toLowerCase(),
    phone: text(r.phone, LIMITS.phone),
    services: Array.from(new Set(picked)),
    message: typeof r.message === 'string' ? r.message.trim().slice(0, LIMITS.message) : '',
    website: typeof r.website === 'string' ? r.website : '',
  };
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (input.name.length < 2) errors.name = 'Please tell us your name.';
  if (!EMAIL_RE.test(input.email)) errors.email = 'Please enter a valid email address.';
  if (input.phone && !PHONE_RE.test(input.phone)) errors.phone = 'Please enter a valid phone number.';
  if (input.organization.length > LIMITS.organization) errors.organization = 'That organization name is too long.';
  if (input.services.length === 0) errors.services = 'Choose at least one service of interest.';
  if (input.message.length < LIMITS.messageMin)
    errors.message = `Please write at least ${LIMITS.messageMin} characters so we can help properly.`;
  return errors;
}

export function isValidEnquiry(errors: EnquiryErrors): boolean {
  return Object.keys(errors).length === 0;
}

/** Reference codes look like AC-251104-7K3Q: date plus four unambiguous characters. */
export function makeReference(date = new Date(), random: () => number = Math.random): string {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i += 1) suffix += alphabet[Math.floor(random() * alphabet.length)];
  return `AC-${yy}${mm}${dd}-${suffix}`;
}

export interface EnquiryResponse {
  ok: boolean;
  reference?: string;
  errors?: EnquiryErrors;
  message?: string;
}
