import type { Metadata } from "next"
import { JsonLd, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand } from "@/components/page-hero"
import { InnerHero } from "@/components/inner-hero"
import { getDict } from "@/i18n/index"
import { FilterableWorkGrid } from "@/components/work-grid"
import { WorkExplorer } from "@/components/work-explorer"
import { PROJECTS } from "@/lib/projects"
import { siteAlternates, siteOpenGraph } from "@/lib/seo"

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
    alternates: siteAlternates(`/${locale}/work`),
    openGraph: siteOpenGraph({ locale, path: `/${locale}/work` }),
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

      <InnerHero eyebrow={d.nav.work} heading={d.workPage.title.replace("{n}", String(PROJECTS.length))} subtext={d.workPage.lede} scene="work" controls={d.sceneControls} link={{ href: "#work-explorer-heading", label: d.workPage.explorer.title }} />

      <WorkExplorer projects={PROJECTS} locale={locale} dict={d} />

      <section aria-labelledby="all-projects-heading" className="mx-auto mt-24 max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-12" />
        <h2 id="all-projects-heading" className="display-md mb-8 text-white">
          {d.home.allProjects}
        </h2>
        <FilterableWorkGrid locale={locale} dict={d} />
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
