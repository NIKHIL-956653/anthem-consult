'use client';

import { offerings } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** Three lit pillars (0, 2, 4) stand for the three offerings; hovering a card lights its pillar fully. */
const PILLAR_FOR_OFFERING = [0, 2, 4];

export function Offerings() {
  const { bind } = useHoverIndex();

  return (
    <ul className="grid gap-3 md:grid-cols-3" role="list">
      {offerings.map((offering, index) => (
        <li
          key={offering.title}
          {...bind(PILLAR_FOR_OFFERING[index])}
          tabIndex={0}
          className="panel flex flex-col gap-4 p-6 outline-none transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold"
        >
          <span className="font-label tabular text-gold/80">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="heading-md">{offering.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{offering.text}</p>
        </li>
      ))}
    </ul>
  );
}
