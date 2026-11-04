import { cta } from '@/lib/siteConfig';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import { Section } from './Section';
import { Reveal } from './Reveal';

interface ClosingCtaProps {
  station?: string;
  heading: string;
  text?: string;
  /** Render the heading as a quotation. */
  quote?: boolean;
  buttonLabel?: string;
  buttonHref?: string;
}

/** The `pin` station that closes a page: one bright spike, one clear ask. */
export function ClosingCta({
  station = 'closing',
  heading,
  text,
  quote = false,
  buttonLabel = cta.consultation.label,
  buttonHref = cta.consultation.href,
}: ClosingCtaProps) {
  const headingId = `${station}-heading`;
  return (
    <Section station={station} align="center" labelledBy={headingId} className="station--end">
      <Reveal className="flex flex-col items-center gap-8">
        {quote ? (
          <blockquote>
            <p id={headingId} className="heading-lg mx-auto max-w-3xl">
              <span className="text-gold" aria-hidden="true">
                “
              </span>
              {heading}
              <span className="text-gold" aria-hidden="true">
                ”
              </span>
            </p>
          </blockquote>
        ) : (
          <h2 id={headingId} className="heading-lg mx-auto max-w-3xl">
            {heading}
          </h2>
        )}
        {text ? <p className="lead mx-auto text-center">{text}</p> : null}
        <TransitionLink href={buttonHref} className="btn-gold">
          {buttonLabel}
          <span aria-hidden="true">→</span>
        </TransitionLink>
      </Reveal>
    </Section>
  );
}
