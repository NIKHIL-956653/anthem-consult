'use client';

import { methodology } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** The ten step names; hovering one lights that step of the staircase. */
export function StepsTeaser() {
  const { bind } = useHoverIndex();

  return (
    <ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2" aria-label="Recruitment methodology steps">
      {methodology.steps.map((step, index) => (
        <li
          key={step.name}
          {...bind(index)}
          tabIndex={0}
          className="group flex items-baseline gap-4 border-b border-line py-3 outline-none transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold"
        >
          <span className="font-label tabular w-7 shrink-0 text-gold/80">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-serif text-lg text-ivory/90 transition-colors group-hover:text-gold-hot">{step.name}</span>
        </li>
      ))}
    </ol>
  );
}
