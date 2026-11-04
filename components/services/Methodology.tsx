'use client';

import { useRef } from 'react';
import { methodology, services, servicesPage } from '@/lib/siteConfig';
import { useScrollActive } from '@/lib/useStations';
import { useSceneStore } from '@/lib/useSceneStore';
import { WideSection } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

const service = services.find((s) => s.id === 'outsourcing');

/**
 * Outsourcing: the ten-step recruitment methodology as a staircase.
 * The left panel is sticky and shows the current step; the active step of the
 * staircase follows the step nearest the viewport centre.
 */
export function Methodology() {
  const listRef = useRef<HTMLOListElement>(null);
  useScrollActive(listRef, '[data-step]');
  const scrollActive = useSceneStore((s) => s.scrollActive);
  const current = scrollActive >= 0 ? scrollActive : 0;
  const step = methodology.steps[current];
  const total = methodology.steps.length;

  return (
    <WideSection station="outsourcing" id="outsourcing" tall labelledBy="outsourcing-heading" className="scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)]">
            <Reveal className="flex flex-col gap-6">
              <Eyebrow>
                <span className="tabular">03</span> · Service
              </Eyebrow>
              <h2 id="outsourcing-heading" className="heading-lg">
                {service?.title ?? 'Outsourcing'}
              </h2>
              <p className="lead text-ivory/85">{service?.intro}</p>
              <p className="text-base leading-relaxed text-muted">{service?.paragraphs[0]}</p>
            </Reveal>

            <div className="panel mt-8 hidden p-6 md:block" aria-live="polite">
              <p className="font-label">{methodology.title}</p>
              <p className="tabular mt-4 font-serif text-6xl text-gold-hot">
                {String(current + 1).padStart(2, '0')}
                <span className="text-2xl text-muted"> / {String(total).padStart(2, '0')}</span>
              </p>
              <p className="heading-md mt-3">{step.name}</p>
              <div className="mt-5 flex gap-1" aria-hidden="true">
                {methodology.steps.map((s, i) => (
                  <span
                    key={s.name}
                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                      i < current ? 'bg-gold/45' : i === current ? 'bg-gold-hot' : 'bg-line'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h3 className="font-label mb-4 md:hidden">{methodology.title}</h3>
          <ol ref={listRef} className="flex flex-col" aria-label={methodology.title}>
            {methodology.steps.map((s, i) => {
              const active = i === current;
              return (
                <li
                  key={s.name}
                  data-step
                  className={`flex min-h-[38svh] flex-col justify-center gap-3 border-b border-line py-8 transition-opacity duration-500 ${
                    active ? 'opacity-100' : 'opacity-55'
                  }`}
                >
                  <span className={`font-label tabular ${active ? 'text-gold-hot' : ''}`}>
                    Step {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="heading-md">{s.name}</span>
                  <p className="max-w-md text-base leading-relaxed text-muted">{s.text}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-14">
            <h3 className="font-label mb-4">{servicesPage.outsourcing.sectorsHeading}</h3>
            <ul className="flex flex-wrap gap-2" role="list">
              {methodology.sectors.map((sector) => (
                <li key={sector} className="chip">
                  {sector}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </WideSection>
  );
}
