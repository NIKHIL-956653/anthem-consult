'use client';

import { usePathname } from 'next/navigation';
import { cta, nav, site } from '@/lib/siteConfig';
import { TransitionLink } from './TransitionLink';
import { Logo } from './Logo';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="chrome-gradient-top fixed inset-x-0 top-0 z-40 pb-8">
      <div className="mx-auto grid w-full max-w-site grid-cols-[auto_auto] items-center gap-x-4 px-5 pt-4 sm:px-8 sm:pt-5 md:grid-cols-[1fr_auto_1fr]">
        <TransitionLink href="/" className="rounded-sm" aria-label={`${site.name} — home`}>
          <Logo />
        </TransitionLink>

        <TransitionLink
          href={cta.consultation.href}
          className="btn-gold shrink-0 justify-self-end !px-4 !py-2.5 !text-[13px] sm:!px-5 md:col-start-3"
        >
          {cta.consultation.label}
          <span aria-hidden="true">→</span>
        </TransitionLink>

        <nav
          aria-label="Primary"
          className="col-span-2 row-start-2 -mx-2 mt-2 md:col-span-1 md:col-start-2 md:row-start-1 md:mx-0 md:mt-0 md:justify-self-center"
        >
          <ul className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 pb-1 md:overflow-visible md:pb-0">
            {nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex items-center px-3 py-2 font-sans text-sm transition-colors duration-300 ${
                      active ? 'text-ivory' : 'text-muted hover:text-ivory'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-0.5 h-px bg-gold transition-opacity duration-300 ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
