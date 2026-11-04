'use client';

import { useEffect, useState } from 'react';
import { pageLabels, site, type RouteKey } from '@/lib/siteConfig';
import { useSceneStore } from '@/lib/useSceneStore';

function useIstClock() {
  const [time, setTime] = useState<string>('');
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: site.location.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Fixed, subtle mono status bar: page breadcrumb on the left, location and IST clock on the right. */
export function StatusBar() {
  const route = useSceneStore((s) => s.route);
  const stationLabel = useSceneStore((s) => s.stations[s.stationIndex]?.label ?? '');
  const time = useIstClock();
  const pageLabel = pageLabels[route as RouteKey] ?? 'Page';

  return (
    <div
      className="chrome-gradient-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 pt-6"
      role="status"
      aria-live="off"
    >
      <div className="mx-auto flex w-full max-w-site items-center justify-between gap-4 px-5 pb-3 sm:px-8">
        <p className="font-label truncate">
          <span className="text-ivory/80">{pageLabel}</span>
          {stationLabel ? (
            <>
              <span className="mx-2 text-gold/60">/</span>
              <span>{stationLabel}</span>
            </>
          ) : null}
        </p>
        <p className="font-label hidden shrink-0 items-center gap-3 sm:flex">
          <span>{site.location.label}</span>
          <span className="text-gold/60">·</span>
          <span>{site.location.coords}</span>
          <span className="text-gold/60">·</span>
          <time className="tabular text-ivory/80" suppressHydrationWarning>
            {time || '--:--:--'} {site.location.timeZoneLabel}
          </time>
        </p>
        <p className="font-label shrink-0 sm:hidden">
          <time className="tabular text-ivory/80" suppressHydrationWarning>
            {time || '--:--:--'} {site.location.timeZoneLabel}
          </time>
        </p>
      </div>
    </div>
  );
}
