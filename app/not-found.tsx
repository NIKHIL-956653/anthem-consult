import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TransitionLink } from '@/components/chrome/TransitionLink';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <Section station="hero" align="left" labelledBy="not-found-heading">
      <div className="flex flex-col gap-7">
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-heading" className="heading-xl">
          That page is not in the field.
        </h1>
        <p className="lead">The address may have changed. Start again from the home page, or write to us.</p>
        <div className="flex flex-wrap gap-3">
          <TransitionLink href="/" className="btn-gold">
            Back to home
          </TransitionLink>
          <TransitionLink href="/contact" className="btn-ghost">
            Contact us
          </TransitionLink>
        </div>
      </div>
    </Section>
  );
}
