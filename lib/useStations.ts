'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { sceneStore, progressForScroll, stationIndexForScroll, type Station, type StationHold } from './sceneStore';
import { stationsForRoute } from './stations';

/**
 * Every `[data-station]` section on the page is one camera station.
 *
 * A station is reached when its section's top crosses 20 % of the viewport and
 * held while the section still fills the screen. A ScrollTrigger with
 * scrub: 1.2 drives a smoothed scroll value; the continuous camera progress is
 * derived from that value and the measured holds. Holds are re-measured on
 * every ScrollTrigger refresh.
 */
export function useStations(route: string) {
  useEffect(() => {
    sceneStore.setRoute(route);

    const catalogue = stationsForRoute(route);
    const byId = new Map(catalogue.map((s) => [s.id, s]));
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-station]')).filter((el) =>
      byId.has(el.dataset.station ?? ''),
    );

    const stations: Station[] = sections.map((el) => byId.get(el.dataset.station as string) as Station);
    if (stations.length === 0) stations.push(catalogue[0]);

    const measure = (): StationHold[] => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const holds = sections.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = rect.bottom + scrollY;
        const start = top - vh * 0.2;
        const end = Math.max(start, bottom - vh);
        return { start, end };
      });
      if (holds.length === 0) holds.push({ start: 0, end: 0 });
      return holds;
    };

    let holds = measure();
    sceneStore.setStations(stations, holds);
    sceneStore.setStationIndex(0);
    sceneStore.setProgress(0);

    const reduced = sceneStore.state.reducedMotion;
    const proxy = { y: 0 };
    let maxScroll = 1;

    const applyRaw = () => {
      const y = window.scrollY;
      sceneStore.setStationIndex(stationIndexForScroll(y, holds));
      sceneStore.setScrollProgress(maxScroll > 0 ? Math.min(1, y / maxScroll) : 0);
      if (reduced) sceneStore.setProgress(stationIndexForScroll(y, holds));
    };

    const refresh = () => {
      holds = measure();
      sceneStore.setHolds(holds);
      maxScroll = Math.max(1, ScrollTrigger.maxScroll(window));
      applyRaw();
    };

    // The scrubbed tween: proxy.y follows the page scroll with a 1.2 s lag.
    // The tween's own onUpdate runs on every scrubbed render, so the camera
    // progress is derived from the smoothed value, not from raw scroll events.
    const tween = gsap.to(proxy, {
      y: 1,
      ease: 'none',
      onUpdate: () => {
        if (!reduced) sceneStore.setProgress(progressForScroll(proxy.y * maxScroll, holds));
      },
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: 'max',
        scrub: reduced ? false : 1.2,
        invalidateOnRefresh: true,
        onRefresh: refresh,
        onUpdate: applyRaw,
      },
    });

    const onScroll = () => applyRaw();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Re-measure once fonts have settled (layout may have shifted).
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [route]);
}

/**
 * Drives `scrollActive` from the scroll position of a list of elements: the
 * element nearest the viewport centre becomes the active index. Used by the
 * staircase steps and the history timeline.
 */
export function useScrollActive(
  containerRef: React.RefObject<HTMLElement>,
  itemSelector: string,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    if (items.length === 0) return;

    const triggers = items.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => sceneStore.setScrollActive(i),
        onEnterBack: () => sceneStore.setScrollActive(i),
      }),
    );

    const section = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => sceneStore.setScrollActive(-1),
      onLeaveBack: () => sceneStore.setScrollActive(-1),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      section.kill();
      sceneStore.setScrollActive(-1);
    };
  }, [containerRef, itemSelector, enabled]);
}
