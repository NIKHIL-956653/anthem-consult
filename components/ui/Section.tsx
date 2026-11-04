import type { ReactNode } from 'react';

type Align = 'left' | 'right' | 'center';

interface SectionProps {
  /** Matches a station id in lib/stations.ts. */
  station: string;
  id?: string;
  /** Which side of the screen the copy occupies on desktop; the field fills the other side. */
  align?: Align;
  /** Tall sections keep their content at the top so sticky children can work. */
  tall?: boolean;
  /** Accessible name for the section (the heading's id). */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

const alignClass: Record<Align, string> = {
  left: 'md:col-span-6 lg:col-span-5',
  right: 'md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8',
  center: 'md:col-span-8 md:col-start-3 text-center justify-self-center',
};

/**
 * One camera station. The section fills the viewport; its copy sits in a
 * grid column so the 3D field stays visible on the other side on desktop.
 * On phones the field sits behind the copy.
 */
export function Section({ station, id, align = 'left', tall = false, labelledBy, className = '', children }: SectionProps) {
  return (
    <section
      data-station={station}
      id={id}
      aria-labelledby={labelledBy}
      className={`station ${tall ? 'station--tall' : ''} ${className}`}
    >
      <div className="mx-auto grid w-full max-w-site grid-cols-1 gap-8 px-5 sm:px-8 md:grid-cols-12">
        <div className={alignClass[align]}>{children}</div>
      </div>
    </section>
  );
}

/** A wider section for content that needs the whole row (forms, grids of cards). */
export function WideSection({
  station,
  id,
  tall = false,
  labelledBy,
  className = '',
  children,
}: Omit<SectionProps, 'align'>) {
  return (
    <section
      data-station={station}
      id={id}
      aria-labelledby={labelledBy}
      className={`station ${tall ? 'station--tall' : ''} ${className}`}
    >
      <div className="mx-auto w-full max-w-site px-5 sm:px-8">{children}</div>
    </section>
  );
}
