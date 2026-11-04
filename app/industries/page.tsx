import type { Metadata } from 'next';
import { industriesPage, pageMeta } from '@/lib/siteConfig';
import { Section, WideSection } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCta } from '@/components/ui/ClosingCta';
import { IndustriesList } from '@/components/home/IndustriesList';
import { Offerings } from '@/components/industries/Offerings';

export const metadata: Metadata = {
  title: { absolute: pageMeta['/industries'].title },
  description: pageMeta['/industries'].description,
};

export default function IndustriesPage() {
  return (
    <>
      <Section station="hero" align="left" labelledBy="industries-page-heading">
        <Reveal className="flex flex-col gap-7">
          <Eyebrow>{industriesPage.hero.eyebrow}</Eyebrow>
          <h1 id="industries-page-heading" className="heading-xl">
            {industriesPage.hero.heading}
          </h1>
          <p className="lead">{industriesPage.hero.lead}</p>
        </Reveal>
      </Section>

      <WideSection station="ring" labelledBy="ring-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="flex flex-col gap-5 md:col-span-4 md:col-start-9">
            <Eyebrow>{industriesPage.ring.eyebrow}</Eyebrow>
            <h2 id="ring-heading" className="heading-lg">
              {industriesPage.ring.heading}
            </h2>
            <p className="lead">{industriesPage.ring.lead}</p>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6" delay={0.1}>
            <IndustriesList columns={2} />
          </Reveal>
        </div>
      </WideSection>

      <WideSection station="offerings" labelledBy="offerings-heading">
        <div className="grid gap-10 md:grid-cols-12">
          <Reveal className="flex flex-col gap-5 md:col-span-5">
            <Eyebrow>{industriesPage.offerings.eyebrow}</Eyebrow>
            <h2 id="offerings-heading" className="heading-lg">
              {industriesPage.offerings.heading}
            </h2>
          </Reveal>
          <Reveal className="md:col-span-12" delay={0.1}>
            <Offerings />
          </Reveal>
        </div>
      </WideSection>

      <ClosingCta heading={industriesPage.closing.heading} text={industriesPage.closing.text} />
    </>
  );
}
