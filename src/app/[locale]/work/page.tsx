import type { Metadata } from "next"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"
import { FilterableWorkGrid } from "@/components/work-grid"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.workPage.metaTitle,
    description: d.workPage.metaDesc,
    alternates: { canonical: `/${locale}/work` },
    openGraph: { url: `${SITE_URL}/${locale}/work` },
  }
}

export default async function WorkPage({
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
          { name: d.nav.work, path: lp("/work") },
        ])}
      />

      <PageHero eyebrow={d.nav.work} title={d.workPage.title} lede={d.workPage.lede} />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <FilterableWorkGrid locale={locale} dict={d} />
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-16 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {d.aboutPage.factLineLead}
            </span>{" "}
            {d.aboutPage.factLineRest}
          </p>
        </Reveal>
      </section>

      <CtaBand
        title={d.workPage.ctaTitle}
        body={d.workPage.ctaBody}
        secondaryHref={lp("/contact")}
        secondaryLabel={d.ctaBand.secondaryLabel}
        primaryLabel={d.hero.quoteCta}
      />
    </>
  )
}
