import type { Metadata, Viewport } from 'next';
import './globals.css';
import { pageMeta, site } from '@/lib/siteConfig';
import { SceneMount } from '@/components/scene/SceneMount';
import { Providers } from '@/components/chrome/Providers';
import { Header } from '@/components/chrome/Header';
import { StatusBar } from '@/components/chrome/StatusBar';
import { Footer } from '@/components/chrome/Footer';
import { SkipLink } from '@/components/chrome/SkipLink';

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: pageMeta['/'].title,
    template: `%s — ${site.name}`,
  },
  description: pageMeta['/'].description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: pageMeta['/'].title,
    description: pageMeta['/'].description,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    site: '@anthemconsult',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-ink">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_HREF} />
        <noscript>
          <style>{`.reveal-pending{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body className="bg-ink text-ivory">
        <SkipLink />
        <SceneMount />
        <Providers>
          <Header />
          <div data-page-fade className="relative z-10">
            <main id="main" tabIndex={-1} className="relative outline-none">
              {children}
            </main>
            <Footer />
          </div>
          <StatusBar />
        </Providers>
      </body>
    </html>
  );
}
