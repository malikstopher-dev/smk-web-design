import type { Metadata } from "next"
import { JsonLd, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { StatCounter } from "@/components/stat-counter"
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
          <dl className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {d.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-gray-200 px-6 py-7 text-center dark:border-gray-800"
              >
                <dd className="font-display text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  <StatCounter value={s.value} />
                </dd>
                <dt className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
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
