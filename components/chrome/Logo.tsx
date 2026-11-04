import { site } from '@/lib/siteConfig';

/** Wordmark with a small gold mark. Swap the SVG for the owner's logo later. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
        <rect x="1" y="12" width="3.4" height="9" rx="0.8" fill="#E3B65A" opacity="0.55" />
        <rect x="6.2" y="7" width="3.4" height="14" rx="0.8" fill="#E3B65A" opacity="0.8" />
        <rect x="11.4" y="1" width="3.4" height="20" rx="0.8" fill="#F5D38A" />
        <rect x="16.6" y="9" width="3.4" height="12" rx="0.8" fill="#E3B65A" opacity="0.7" />
      </svg>
      <span
        className={`font-mono font-medium uppercase tracking-label text-ivory ${compact ? 'text-[11px]' : 'text-xs'}`}
      >
        {site.wordmark}
      </span>
    </span>
  );
}
