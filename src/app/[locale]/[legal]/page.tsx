import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { LOCALES } from "@/i18n/config"
import { getDict } from "@/i18n/index"
import type { LegalSlug } from "@/i18n/types"
import { SITE } from "@/lib/site"

const LEGAL_SLUGS: LegalSlug[] = ["terms", "privacy", "refund-policy"]

function isLegalSlug(value: string): value is LegalSlug {
  return LEGAL_SLUGS.includes(value as LegalSlug)
}

export function generateStaticParams() {
  return LEGAL_SLUGS.map((legal) => ({ legal }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; legal: string }>
}): Promise<Metadata> {
  const { locale, legal } = await params
  if (!isLegalSlug(legal)) notFound()

  const document = getDict(locale).legal.documents[legal]
  const path = `/${locale}/${legal}`

  return {
    title: document.metaTitle,
    description: document.metaDesc,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        LOCALES.map((language) => [language, `/${language}/${legal}`]),
      ),
    },
    openGraph: {
      title: document.metaTitle,
      description: document.metaDesc,
      url: `${SITE_URL}${path}`,
    },
  }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; legal: string }>
}) {
  const { locale, legal } = await params
  if (!isLegalSlug(legal)) notFound()

  const d = getDict(locale)
  const document = d.legal.documents[legal]

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: document.title, path: `/${locale}/${legal}` },
        ])}
      />
      <article className="mx-auto max-w-4xl px-6 pb-12 pt-28 sm:px-10 sm:pt-36">
        <header className="border-b border-white/[0.08] pb-10">
          <p className="tech-label">{d.legal.label}</p>
          <h1 className="display-lg mt-5 break-words text-white">{document.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
            {document.lede}
          </p>
          <p className="mt-5 text-sm text-white/35">
            {d.legal.effectiveLabel}: {d.legal.effectiveDate}
          </p>
        </header>

        <div className="space-y-12 py-12">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="break-words font-display text-2xl font-semibold text-white sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-white/55">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="list-disc space-y-2 pl-5 marker:text-white/30">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside
          aria-labelledby="legal-contact-heading"
          className="border border-white/[0.08] p-6 sm:p-8"
        >
          <h2 id="legal-contact-heading" className="font-display text-2xl font-semibold text-white">
            {d.footer.contactCol}
          </h2>
          <address className="mt-4 space-y-1 text-sm not-italic leading-7 text-white/55">
            <p>{SITE.business}</p>
            <p>{SITE.name}</p>
            <p>{SITE.location.label}</p>
            <p>
              <a className="underline-offset-4 hover:text-white hover:underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
            <p>
              <a className="underline-offset-4 hover:text-white hover:underline" href={`tel:${SITE.phone}`}>
                {SITE.phoneLabel}
              </a>
            </p>
          </address>
        </aside>
      </article>
    </>
  )
}
