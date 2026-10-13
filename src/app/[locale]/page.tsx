import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { GlobeSection } from "@/components/globe-section"
import { HomeDepth } from "@/components/home-depth"
import {
  JsonLd,
  localBusinessSchema,
  personSchema,
  websiteSchema,
} from "@/components/json-ld"
import { CtaBand } from "@/components/page-hero"
import { SplitHeading } from "@/components/split-heading"
import { HomeServicesGrid } from "@/components/home-services-grid"
import { WorkBoard } from "@/components/work-board"
import { WordmarkBanner } from "@/components/wordmark-banner"
import { HTML_LANG } from "@/i18n/config"
import { getDict } from "@/i18n/index"
import { FEATURED_PROJECTS, PROJECTS } from "@/lib/projects"
import { SERVICES, SITE } from "@/lib/site"
import { siteAlternates, siteOpenGraph } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: { absolute: d.meta.homeTitle },
    description: d.meta.homeDesc,
    alternates: siteAlternates(`/${locale}`),
    openGraph: siteOpenGraph({ locale, path: `/${locale}` }),
  }
}

function OrbitRings() {
  return (
    <div
      aria-hidden
      data-depth-orbits
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <span className="absolute rounded-full border border-white/[0.06]" style={{ width: "116%", height: "116%" }} />
      <span className="absolute hidden rounded-full border border-white/[0.04] sm:block" style={{ width: "134%", height: "134%" }} />
      <span className="absolute hidden rounded-full border border-dashed border-white/[0.08] sm:block" style={{ width: "154%", height: "154%" }}>
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_8px_2px_rgba(255,255,255,0.35)]" />
      </span>
    </div>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path === "/" ? "" : path}`
  const serviceItems = SERVICES.map((s, i) => ({
    slug: s.slug,
    title: d.servicesPage.items[i].title,
    short: d.servicesPage.items[i].short,
  }))

  return (
    <>
      <JsonLd data={websiteSchema(HTML_LANG[locale as keyof typeof HTML_LANG] ?? "en-ZA")} />
      <JsonLd data={personSchema(d.jsonld.personDesc)} />
      <JsonLd data={localBusinessSchema(d.jsonld.businessDesc)} />

      <HomeDepth className="relative isolate flex min-h-[100svh] items-center px-6 pb-16 pt-28 sm:px-10 lg:pt-24">
        <div data-hero-layout className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-4">
          <div data-hero-copy className="relative z-20 max-w-2xl">
            <p className="tech-label flex items-center gap-3">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#e8b04b]" />
              {d.hero.eyebrowRole} · {d.hero.eyebrowLocation}
            </p>
            <h1 data-depth-title className="display-xl mt-6 text-white">
              Stopher Malik
            </h1>
            <p data-depth-tagline className="mt-7 max-w-xl font-display text-3xl leading-[1.12] text-[#ececea] sm:text-4xl lg:text-[3.4rem]">
              {d.hero.tagline}
            </p>
            <p data-depth-intro className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {d.hero.bio}
            </p>
            <div data-hero-actions className="mt-9 flex flex-wrap gap-3">
              <a
                href={SITE.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#ececea] bg-[#ececea] px-7 text-sm font-medium text-[#141719] transition-colors duration-200 hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
              >
                <MessageCircle className="h-4 w-4" />
                {d.hero.quoteCta}
              </a>
              <Link
                href={lp("/work")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-medium text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {d.hero.workCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="tech-label mt-12 hidden items-center gap-3 lg:flex">
              <span className="h-px w-10 bg-[#e8b04b]/70" />
              {d.hero.scroll}
            </p>
          </div>

          <div data-depth-sphere data-hero-globe className="relative z-10 mx-auto w-full max-w-[38rem] lg:max-w-none">
            <OrbitRings />
            <div className="relative z-10">
              <GlobeSection globe={d.globe} />
            </div>
          </div>
        </div>
      </HomeDepth>

      {/* ═══ FEATURED WORK — Spatial project board ═══ */}
      <section aria-labelledby="featured-heading" className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-16" />
        <WorkBoard
          projects={FEATURED_PROJECTS}
          rotationPool={PROJECTS}
          heading={d.home.featuredTitle}
          eyebrow={d.home.featuredEyebrow}
          allLabel={d.home.allProjects}
          allHref={lp("/work")}
          locale={locale}
          dict={d}
        />
      </section>

      <WordmarkBanner text={d.home.bannerText} className="mt-20" />

      {/* ═══ SERVICES — Hairline list ═══ */}
      <section aria-labelledby="services-heading" className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-16" />
        <p className="tech-label">
          {d.home.servicesEyebrow}
        </p>
        <SplitHeading
          id="services-heading"
          as="h2"
          className="display-lg mt-4 text-[#ececea]"
          text={d.home.servicesTitle}
        />
        <div className="mt-12">
          <HomeServicesGrid
            items={serviceItems}
            viewLabel={d.servicesPage.discuss}
            locale={locale}
          />
        </div>
      </section>

      <CtaBand
        title={d.home.ctaTitle}
        body={d.home.ctaBody}
        secondaryHref={lp("/work")}
        secondaryLabel={d.hero.workCta}
        primaryLabel={d.hero.quoteCta}
      />
    </>
  )
}
