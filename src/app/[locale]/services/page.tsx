import type { Metadata } from "next"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { ServicesBoard } from "@/components/services-board"
import { getDict } from "@/i18n/index"
import { SERVICES } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.servicesPage.metaTitle,
    description: d.servicesPage.metaDesc,
    alternates: { canonical: `/${locale}/services` },
    openGraph: { url: `${SITE_URL}/${locale}/services` },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path}`

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.services, path: lp("/services") },
        ])}
      />

      <PageHero
        eyebrow={d.nav.services}
        title={d.servicesPage.title}
        lede={d.servicesPage.lede}
      />

      <section className="mx-auto max-w-6xl px-6 pb-12 sm:px-10">
        <div className="editorial-divider mb-12" />
        <ServicesBoard
          eyebrow={d.nav.services}
          services={SERVICES}
          dict={d}
          locale={locale}
        />
      </section>

      <CtaBand
        title={d.ctaBand.title}
        body={d.ctaBand.body}
        secondaryHref={lp("/contact")}
        secondaryLabel={d.ctaBand.secondaryLabel}
        primaryLabel={d.hero.quoteCta}
      />
    </>
  )
}
