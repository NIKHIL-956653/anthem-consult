'use client';

import { analyses } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** The twelve analyses as a 4 × 3 grid; hovering one lights the matching tile. */
export function AnalysesGrid() {
  const { bind } = useHoverIndex();

  return (
    <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="list">
      {analyses.map((name, index) => (
        <li
          key={name}
          {...bind(index)}
          tabIndex={0}
          className="panel group flex min-h-[7.5rem] flex-col justify-between gap-3 p-4 outline-none transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold"
        >
          <span className="font-label tabular text-gold/80">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-serif text-base leading-snug text-ivory/90 transition-colors group-hover:text-gold-hot sm:text-lg">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
