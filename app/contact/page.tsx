import type { Metadata } from 'next';
import { contactPage, pageMeta, site } from '@/lib/siteConfig';
import { WideSection } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { EnquiryForm } from '@/components/contact/EnquiryForm';

export const metadata: Metadata = {
  title: { absolute: pageMeta['/contact'].title },
  description: pageMeta['/contact'].description,
};

export default function ContactPage() {
  return (
    <WideSection station="hero" tall labelledBy="contact-heading">
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="flex flex-col gap-7 md:col-span-5">
          <Eyebrow>{contactPage.eyebrow}</Eyebrow>
          <h1 id="contact-heading" className="heading-xl">
            {contactPage.heading}
          </h1>
          <p className="lead">{contactPage.lead}</p>

          <dl className="panel grid gap-6 p-6">
            <div>
              <dt className="font-label mb-2">{contactPage.details.addressLabel}</dt>
              <dd>
                <address className="not-italic text-sm leading-relaxed text-ivory/85">
                  {site.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-hot"
                >
                  {contactPage.details.mapsLabel}
                  <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-label mb-2">{contactPage.details.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${site.contact.email}`} className="text-sm text-ivory/85 transition-colors hover:text-gold-hot">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-label mb-2">{contactPage.details.phoneLabel}</dt>
                <dd>
                  <a href={site.contact.phoneHref} className="tabular text-sm text-ivory/85 transition-colors hover:text-gold-hot">
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div>
              <dt className="sr-only">Coordinates</dt>
              <dd className="font-label">
                {site.location.label} · {site.location.coords}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="md:col-span-7 lg:col-span-6 lg:col-start-7" delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </WideSection>
  );
}
