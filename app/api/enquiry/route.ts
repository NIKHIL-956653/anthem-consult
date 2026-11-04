import { NextResponse } from 'next/server';
import {
  isValidEnquiry,
  makeReference,
  normalizeEnquiry,
  validateEnquiry,
  type EnquiryInput,
  type EnquiryResponse,
} from '@/lib/enquiry';
import { site } from '@/lib/siteConfig';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * EMAIL DELIVERY — plug your provider in here.
 *
 * This function is the single place where an enquiry leaves the server.
 * By default it logs the enquiry (so nothing is lost in development) and
 * resolves. To deliver by email, replace the body with a call to your
 * provider, for example Resend, Postmark, SendGrid or SMTP via nodemailer,
 * using credentials from environment variables (never commit them):
 *
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: 'enquiries@anthemconsult.com',
 *     to: site.contact.email,
 *     replyTo: enquiry.email,
 *     subject: `[${reference}] Enquiry from ${enquiry.name}`,
 *     text: formatEnquiry(enquiry, reference),
 *   });
 *
 * Throwing from this function makes the route answer 502 and the form falls
 * back to a mailto: link, so the visitor can still reach you.
 */
async function deliverEnquiry(enquiry: EnquiryInput, reference: string): Promise<void> {
  const body = formatEnquiry(enquiry, reference);
  console.info(`[enquiry] ${reference} → ${site.contact.email}\n${body}`);
}

function formatEnquiry(enquiry: EnquiryInput, reference: string): string {
  return [
    `Reference: ${reference}`,
    `Name: ${enquiry.name}`,
    `Organization: ${enquiry.organization || '—'}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || '—'}`,
    `Services: ${enquiry.services.join(', ')}`,
    '',
    enquiry.message,
  ].join('\n');
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    const res: EnquiryResponse = { ok: false, message: 'The request body must be JSON.' };
    return NextResponse.json(res, { status: 400 });
  }

  const enquiry = normalizeEnquiry(raw);

  // Honeypot: silently accept so bots learn nothing, but deliver nothing.
  if (enquiry.website) {
    const res: EnquiryResponse = { ok: true, reference: makeReference() };
    return NextResponse.json(res, { status: 200 });
  }

  const errors = validateEnquiry(enquiry);
  if (!isValidEnquiry(errors)) {
    const res: EnquiryResponse = { ok: false, errors, message: 'Please check the highlighted fields.' };
    return NextResponse.json(res, { status: 422 });
  }

  const reference = makeReference();
  try {
    await deliverEnquiry(enquiry, reference);
  } catch (error) {
    console.error(`[enquiry] delivery failed for ${reference}`, error);
    const res: EnquiryResponse = { ok: false, message: 'We could not deliver your enquiry right now.' };
    return NextResponse.json(res, { status: 502 });
  }

  const res: EnquiryResponse = { ok: true, reference };
  return NextResponse.json(res, { status: 200 });
}
