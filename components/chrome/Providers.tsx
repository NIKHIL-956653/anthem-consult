'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sceneStore } from '@/lib/sceneStore';
import { getLenis, scrollTo, setLenis } from '@/lib/smoothScroll';
import { useStations } from '@/lib/useStations';
import { useSceneStore } from '@/lib/useSceneStore';

const NARROW_QUERY = '(max-width: 767px)';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FADE_OUT = 0.35;
const FADE_IN = 0.6;

interface TransitionContextValue {
  /** Navigate with a fade (opacity only), scroll reset and hash handling. */
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => undefined });

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

declare global {
  interface Window {
    /** Debug handle to the scene store (read-only use recommended). */
    __anthemScene?: typeof sceneStore;
  }
}

/** Reads media queries into the store. */
function useEnvironment() {
  useEffect(() => {
    window.__anthemScene = sceneStore;
    const narrow = window.matchMedia(NARROW_QUERY);
    const motion = window.matchMedia(MOTION_QUERY);
    const apply = () => {
      sceneStore.setNarrow(narrow.matches);
      sceneStore.setReducedMotion(motion.matches);
    };
    apply();
    narrow.addEventListener('change', apply);
    motion.addEventListener('change', apply);
    return () => {
      narrow.removeEventListener('change', apply);
      motion.removeEventListener('change', apply);
    };
  }, []);
}

/** Lenis smooth scroll driven by gsap.ticker and feeding ScrollTrigger. Off when reduced motion is set. */
function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setLenis(null);
      return;
    }
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}

function scrollToHash(hash: string, immediate: boolean) {
  if (!hash) {
    scrollTo(0, { immediate: true });
    return;
  }
  const el = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
  if (el) {
    scrollTo(el, { immediate, offset: -24 });
  } else {
    scrollTo(0, { immediate: true });
  }
}

/** The element that fades between routes: `<div data-page-fade>` in the layout. */
const getFadeTarget = () => document.querySelector<HTMLElement>('[data-page-fade]');

/**
 * Wraps the whole chrome: media queries, Lenis, stations and route transitions.
 * Route fades touch opacity only (never transform), so pinned sections keep working.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEnvironment();
  const reducedMotion = useSceneStore((s) => s.reducedMotion);
  const pathname = usePathname();
  const router = useRouter();
  const pendingHash = useRef<string>('');

  useLenis(!reducedMotion);
  useStations(pathname);

  // Fade in on each route change and reset the scroll position (or honour a hash).
  useEffect(() => {
    const el = getFadeTarget();
    if (!el) return;
    const hash = pendingHash.current || window.location.hash;
    pendingHash.current = '';
    const reduced = sceneStore.state.reducedMotion;

    getLenis()?.start();
    scrollToHash(hash, true);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    if (reduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const tween = gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: FADE_IN, ease: 'power2.out', delay: 0.05, overwrite: 'auto' },
    );
    return () => {
      tween.kill();
    };
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.origin);
      const samePage = url.pathname === window.location.pathname;
      if (samePage) {
        scrollToHash(url.hash, false);
        if (url.hash) window.history.replaceState(null, '', url.hash);
        return;
      }
      pendingHash.current = url.hash;
      const el = getFadeTarget();
      if (!el || sceneStore.state.reducedMotion) {
        router.push(url.pathname + url.hash);
        return;
      }
      getLenis()?.stop();
      gsap.to(el, {
        opacity: 0,
        duration: FADE_OUT,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => router.push(url.pathname + url.hash),
      });
    },
    [router],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}
