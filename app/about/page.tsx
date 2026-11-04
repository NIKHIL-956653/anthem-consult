import type { Metadata } from 'next';
import { about, pageMeta } from '@/lib/siteConfig';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCta } from '@/components/ui/ClosingCta';
import { Timeline } from '@/components/about/Timeline';

export const metadata: Metadata = {
  title: { absolute: pageMeta['/about'].title },
  description: pageMeta['/about'].description,
};

export default function AboutPage() {
  return (
    <>
      <Section station="hero" align="left" labelledBy="about-heading">
        <Reveal className="flex flex-col gap-7">
          <Eyebrow>{about.hero.eyebrow}</Eyebrow>
          <h1 id="about-heading" className="heading-xl">
            {about.hero.heading}
          </h1>
          <div className="prose-anthem lead">
            {about.hero.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section station="vision" align="right" labelledBy="vision-heading">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>{about.vision.eyebrow}</Eyebrow>
          <h2 id="vision-heading" className="heading-lg">
            {about.vision.heading}
          </h2>
        </Reveal>
      </Section>

      <Section station="mission" align="left" labelledBy="mission-heading">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow>{about.mission.eyebrow}</Eyebrow>
          <h2 id="mission-heading" className="heading-md !font-normal !text-[clamp(1.6rem,2.8vw,2.4rem)]">
            {about.mission.heading}
          </h2>
          <p className="lead">{about.mission.text}</p>
        </Reveal>
      </Section>

      <Section station="timeline" align="center" tall labelledBy="timeline-heading" className="!items-start">
        <div className="text-left">
          <Reveal className="mb-6 flex flex-col gap-5">
            <Eyebrow>{about.timeline.eyebrow}</Eyebrow>
            <h2 id="timeline-heading" className="heading-lg">
              {about.timeline.heading}
            </h2>
          </Reveal>
          <Timeline />
        </div>
      </Section>

      <ClosingCta
        station="principle"
        heading={about.principle.heading}
        text={about.principle.text}
      />
    </>
  );
}
