'use client';

import { industries } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

interface IndustriesListProps {
  /** Two columns on wide screens (home) or three (industries page). */
  columns?: 2 | 3;
}

/** The twelve industries; hovering one lights the matching tower on the ring. */
export function IndustriesList({ columns = 2 }: IndustriesListProps) {
  const { bind } = useHoverIndex();
  const colClass = columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <ul className={`grid gap-x-8 gap-y-1 ${colClass}`} role="list">
      {industries.map((name, index) => (
        <li
          key={name}
          {...bind(index)}
          tabIndex={0}
          className="group flex items-baseline gap-4 border-b border-line py-3 outline-none transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold"
        >
          <span className="font-label tabular w-7 shrink-0 text-gold/80">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-serif text-lg text-ivory/90 transition-colors group-hover:text-gold-hot">{name}</span>
        </li>
      ))}
    </ul>
  );
}
