import { footer, services, site } from '@/lib/siteConfig';
import { TransitionLink } from './TransitionLink';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink/90 backdrop-blur-sm" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="mx-auto grid w-full max-w-site gap-10 px-5 pb-20 pt-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{footer.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-label mb-4">{footer.columns.services}</h3>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.id}>
                <TransitionLink href={`/services#${s.id}`} className="text-sm text-ivory/80 transition-colors hover:text-gold-hot">
                  {s.title}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-label mb-4">{footer.columns.contact}</h3>
          <address className="space-y-2 text-sm not-italic text-ivory/80">
            {site.contact.addressLines.map((line) => (
              <p key={line} className="text-muted">
                {line}
              </p>
            ))}
            <p>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-gold-hot">
                {site.contact.email}
              </a>
            </p>
            <p>
              <a href={site.contact.phoneHref} className="tabular transition-colors hover:text-gold-hot">
                {site.contact.phone}
              </a>
            </p>
          </address>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-label mb-4">{footer.columns.follow}</h3>
          <ul className="space-y-2">
            {site.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ivory/80 transition-colors hover:text-gold-hot"
                >
                  {s.label}
                  <span className="ml-1 text-muted" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-6 md:col-span-12 md:flex-row md:items-center md:justify-between">
          <p className="font-label">{site.copyright}</p>
          <p className="font-label">
            {site.location.label} · {site.location.coords}
          </p>
        </div>
      </div>
    </footer>
  );
}
