import type { Metadata } from 'next';
import { cta, home, pageMeta } from '@/lib/siteConfig';
import { Section, WideSection } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCta } from '@/components/ui/ClosingCta';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import { ServiceCards } from '@/components/home/ServiceCards';
import { StepsTeaser } from '@/components/home/StepsTeaser';
import { IndustriesList } from '@/components/home/IndustriesList';
import { Figures } from '@/components/home/Figures';

export const metadata: Metadata = {
  title: { absolute: pageMeta['/'].title },
  description: pageMeta['/'].description,
};

export default function HomePage() {
  return (
    <>
      <Section station="hero" align="left" labelledBy="hero-heading">
        <Reveal className="flex flex-col gap-7">
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>
          <h1 id="hero-heading" className="heading-xl">
            {home.hero.headline}
          </h1>
          <p className="lead">{home.hero.lead}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <TransitionLink href={cta.consultation.href} className="btn-gold">
              {cta.consultation.label}
              <span aria-hidden="true">→</span>
            </TransitionLink>
            <TransitionLink href={cta.services.href} className="btn-ghost">
              {cta.services.label}
            </TransitionLink>
          </div>
        </Reveal>
      </Section>

      <WideSection station="services" labelledBy="services-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="flex flex-col gap-5 md:col-span-4">
            <Eyebrow>{home.services.eyebrow}</Eyebrow>
            <h2 id="services-heading" className="heading-lg">
              {home.services.heading}
            </h2>
            <p className="lead">{home.services.lead}</p>
          </Reveal>
          <Reveal className="md:col-span-8 lg:col-span-7 lg:col-start-6" delay={0.15}>
            <ServiceCards />
          </Reveal>
        </div>
      </WideSection>

      <Section station="recruit" align="right" labelledBy="recruit-heading">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>{home.recruit.eyebrow}</Eyebrow>
          <h2 id="recruit-heading" className="heading-lg">
            {home.recruit.heading}
          </h2>
          <p className="lead">{home.recruit.lead}</p>
          <StepsTeaser />
          <div>
            <TransitionLink href={home.recruit.link.href} className="btn-ghost">
              {home.recruit.link.label}
              <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
        </Reveal>
      </Section>

      <Section station="industries" align="left" labelledBy="industries-heading">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>{home.industries.eyebrow}</Eyebrow>
          <h2 id="industries-heading" className="heading-lg">
            {home.industries.heading}
          </h2>
          <p className="lead">{home.industries.lead}</p>
          <IndustriesList />
          <div>
            <TransitionLink href={home.industries.link.href} className="btn-ghost">
              {home.industries.link.label}
              <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
        </Reveal>
      </Section>

      <WideSection station="figures" labelledBy="figures-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="flex flex-col gap-5 md:col-span-5 md:col-start-8">
            <Eyebrow>{home.figures.eyebrow}</Eyebrow>
            <h2 id="figures-heading" className="heading-lg">
              {home.figures.heading}
            </h2>
          </Reveal>
          <Reveal className="md:col-span-12" delay={0.1}>
            <Figures />
          </Reveal>
        </div>
      </WideSection>

      <ClosingCta heading={home.closing.quote} text={home.closing.text} quote />
    </>
  );
}
