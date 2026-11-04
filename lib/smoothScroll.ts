'use client';

import type Lenis from 'lenis';

/**
 * Module-level handle to the single Lenis instance (null when the user prefers
 * reduced motion, in which case native scrolling is used).
 */
let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export interface ScrollToOptions {
  immediate?: boolean;
  offset?: number;
}

/** Scroll to a target with Lenis when available, otherwise natively. */
export function scrollTo(target: number | string | HTMLElement, options: ScrollToOptions = {}) {
  const { immediate = false, offset = 0 } = options;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { immediate, offset, force: true, lock: immediate });
    return;
  }
  if (typeof window === 'undefined') return;
  let top = 0;
  if (typeof target === 'number') {
    top = target;
  } else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: top + offset, behavior: immediate ? 'auto' : 'smooth' });
}
