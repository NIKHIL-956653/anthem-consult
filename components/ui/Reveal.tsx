'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { sceneStore } from '@/lib/sceneStore';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Reveal direct children one after another. */
  stagger?: boolean;
}

/**
 * Fades and lifts content into view the first time it scrolls in.
 * Only inner elements are transformed, never the pinned sections.
 * Does nothing (content stays visible) when the user prefers reduced motion.
 */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : [el];
    if (sceneStore.state.reducedMotion) {
      targets.forEach((t) => t.classList.remove('reveal-pending'));
      el.classList.remove('reveal-pending');
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 22 });
      el.classList.remove('reveal-pending');
      targets.forEach((t) => t.classList.remove('reveal-pending'));
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={`reveal-pending ${className}`}>
      {children}
    </Tag>
  );
}
