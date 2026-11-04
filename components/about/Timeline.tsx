'use client';

import { useRef } from 'react';
import { about } from '@/lib/siteConfig';
import { useScrollActive } from '@/lib/useStations';
import { useSceneStore } from '@/lib/useSceneStore';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** History milestones; the lit peak of the ridge follows the milestone nearest the viewport centre. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  useScrollActive(ref, '[data-milestone]');
  const scrollActive = useSceneStore((s) => s.scrollActive);
  const { bind } = useHoverIndex();

  return (
    <ol ref={ref} className="relative border-l border-line" aria-label="Company history">
      {about.timeline.milestones.map((m, index) => {
        const current = scrollActive === index;
        return (
          <li
            key={m.year}
            data-milestone
            {...bind(index)}
            className="relative flex min-h-[46svh] flex-col justify-center gap-3 py-10 pl-10 sm:pl-14"
          >
            <span
              aria-hidden="true"
              className={`absolute -left-[5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full transition-colors duration-500 ${
                current ? 'bg-gold-hot shadow-[0_0_18px_rgba(245,211,138,0.8)]' : 'bg-gold/40'
              }`}
            />
            <span className={`tabular font-serif text-5xl transition-colors duration-500 sm:text-6xl ${current ? 'text-gold-hot' : 'text-ivory/50'}`}>
              {m.year}
            </span>
            <h3 className="heading-md">{m.title}</h3>
            <p className="lead">{m.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
