import type { Metadata } from 'next';
import { pageMeta, services, servicesPage } from '@/lib/siteConfig';
import { Section, WideSection } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCta } from '@/components/ui/ClosingCta';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import { ServiceSection } from '@/components/services/ServiceSection';
import { Methodology } from '@/components/services/Methodology';
import { AnalysesGrid } from '@/components/services/AnalysesGrid';

export const metadata: Metadata = {
  title: { absolute: pageMeta['/services'].title },
  description: pageMeta['/services'].description,
};

const byId = Object.fromEntries(services.map((s) => [s.id, s])) as Record<(typeof services)[number]['id'], (typeof services)[number]>;

export default function ServicesPage() {
  const business = byId['business-services'];

  return (
    <>
      <Section station="hero" align="left" labelledBy="services-page-heading">
        <Reveal className="flex flex-col gap-7">
          <Eyebrow>{servicesPage.hero.eyebrow}</Eyebrow>
          <h1 id="services-page-heading" className="heading-xl">
            {servicesPage.hero.heading}
          </h1>
          <p className="lead">{servicesPage.hero.lead}</p>
          <nav aria-label="Services on this page">
            <ol className="flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.id}>
                  <TransitionLink href={`/services#${s.id}`} className="chip hover:border-gold/60 hover:text-ivory">
                    <span className="tabular mr-2 text-gold/80">{s.index}</span>
                    {s.title}
                  </TransitionLink>
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      </Section>

      <ServiceSection service={byId['software-development']} align="left" />
      <ServiceSection service={byId['web-design-development']} align="right" />

      <Methodology />

      <WideSection station="business-services" id="business-services" labelledBy="business-services-heading" className="scroll-mt-24">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="flex flex-col gap-6 md:col-span-5 md:col-start-8">
            <Eyebrow>
              <span className="tabular">{business.index}</span> · Service
            </Eyebrow>
            <h2 id="business-services-heading" className="heading-lg">
              {business.title}
            </h2>
            <p className="lead text-ivory/85">{business.intro}</p>
            <div className="prose-anthem text-base leading-relaxed text-muted">
              {business.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="flex flex-col gap-4 md:col-span-12" delay={0.1}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-label">{servicesPage.businessServices.analysesHeading}</h3>
              <p className="font-label hidden md:block">{servicesPage.businessServices.analysesLead}</p>
            </div>
            <AnalysesGrid />
          </Reveal>
        </div>
      </WideSection>

      <ServiceSection service={byId['online-trainings']} align="left" />
      <ServiceSection service={byId['corporate-training-services']} align="right" />

      <ClosingCta heading={servicesPage.closing.heading} text={servicesPage.closing.text} />
    </>
  );
}
