'use client';

import { figures } from '@/lib/siteConfig';
import { useHoverIndex } from '@/components/ui/useHoverIndex';

/** Four key figures; hovering one lights the matching bar of the chart. */
export function Figures() {
  const { bind } = useHoverIndex();

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {figures.map((figure, index) => (
        <div
          key={figure.label}
          {...bind(index)}
          tabIndex={0}
          className="panel flex flex-col gap-2 p-5 outline-none transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold"
        >
          <dd className="tabular order-1 font-serif text-4xl text-gold-hot sm:text-5xl">{figure.value}</dd>
          <dt className="font-label order-2">{figure.label}</dt>
        </div>
      ))}
    </dl>
  );
}
