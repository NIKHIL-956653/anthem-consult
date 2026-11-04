import type { ReactNode } from 'react';
import type { Service } from '@/lib/siteConfig';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

interface ServiceSectionProps {
  service: Service;
  align?: 'left' | 'right';
  children?: ReactNode;
}

/** One service, one station. The matching pillar is lit while the section is on screen. */
export function ServiceSection({ service, align = 'left', children }: ServiceSectionProps) {
  const headingId = `${service.id}-heading`;
  return (
    <Section station={service.id} id={service.id} align={align} labelledBy={headingId} className="scroll-mt-24">
      <Reveal className="flex flex-col gap-6">
        <Eyebrow>
          <span className="tabular">{service.index}</span> · Service
        </Eyebrow>
        <h2 id={headingId} className="heading-lg">
          {service.title}
        </h2>
        <p className="lead text-ivory/85">{service.intro}</p>
        <div className="prose-anthem text-base leading-relaxed text-muted">
          {service.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {service.bullets ? (
          <div className="panel p-5">
            <h3 className="font-label mb-3">{service.bullets.heading}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {service.bullets.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-sm text-ivory/85">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {children}
      </Reveal>
    </Section>
  );
}
