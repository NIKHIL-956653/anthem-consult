'use client';

import { services } from '@/lib/siteConfig';
import { TransitionLink } from '@/components/chrome/TransitionLink';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** Six service cards; hovering one lights the matching pillar in the field. */
export function ServiceCards() {
  const { bind } = useHoverIndex();

  return (
    <ul className="grid gap-3 sm:grid-cols-2" role="list">
      {services.map((service, index) => (
        <li key={service.id}>
          <TransitionLink
            href={`/services#${service.id}`}
            {...bind(index)}
            className="panel group flex h-full flex-col gap-3 p-5 transition-colors duration-300 hover:border-gold/50"
          >
            <span className="font-label flex items-center justify-between">
              <span className="tabular">{service.index}</span>
              <span className="text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
                →
              </span>
            </span>
            <span className="heading-sm">{service.title}</span>
            <span className="text-sm leading-relaxed text-muted">{service.short}</span>
          </TransitionLink>
        </li>
      ))}
    </ul>
  );
}
