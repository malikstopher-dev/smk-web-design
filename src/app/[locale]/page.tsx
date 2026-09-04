import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { GlobeSection } from "@/components/globe-section"
import { Magnetic } from "@/components/magnetic"
import { HomeServicesList } from "@/components/home-services-list"
import {
  JsonLd,
  localBusinessSchema,
  personSchema,
  SITE_URL,
  websiteSchema,
} from "@/components/json-ld"
import { HeroIn, HoverButton } from "@/components/motion"
import { CtaBand } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { RevealHeading } from "@/components/text-reveal"
import { WorkBoard } from "@/components/work-board"
import { WordmarkBanner } from "@/components/wordmark-banner"
import { HTML_LANG } from "@/i18n/config"
import { getDict } from "@/i18n/index"
import { FEATURED_PROJECTS } from "@/lib/projects"
import { SERVICES, SITE } from "@/lib/site"

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
    alternates: { canonical: `/${locale}` },
    openGraph: { url: `${SITE_URL}/${locale}` },
  }
}

function OrbitRings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <span className="absolute rounded-full border border-white/[0.06]" style={{ width: "116%", height: "116%" }} />
      <span className="absolute hidden rounded-full border border-white/[0.04] sm:block" style={{ width: "134%", height: "134%" }} />
      <span className="orbit-spin absolute hidden rounded-full border border-dashed border-white/[0.08] sm:block" style={{ width: "154%", height: "154%" }}>
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

      {/* ═══ HERO — Cinematic fullscreen with globe ═══ */}
      <section className="relative isolate flex min-h-[100dvh] flex-col items-center overflow-hidden px-6 pb-12 pt-20 text-center sm:pt-28">
        {/* Coordinate labels */}
        <HeroIn delay={0.8}>
          <span className="coord-label absolute left-6 top-6 hidden sm:block">
            {SITE.location.lat}°S {SITE.location.lng}°E
          </span>
        </HeroIn>
        <HeroIn delay={0.9}>
          <span className="coord-label absolute right-6 top-6 hidden sm:block">
            Portfolio {new Date().getFullYear()}
          </span>
        </HeroIn>

        {/* Eyebrow */}
        <HeroIn>
          <p className="tech-label">
            {d.hero.eyebrowRole} · {d.hero.eyebrowLocation}
          </p>
        </HeroIn>

        {/* Name — editorial scale */}
        <HeroIn delay={0.1}>
          <h1 className="display-xl mt-6 text-white">
            Stopher Malik
          </h1>
        </HeroIn>

        {/* Globe — centered hero element, clear of the heading */}
        <HeroIn delay={0.2} className="relative mt-10 w-full max-w-md">
          <OrbitRings />
          <div className="relative z-10">
            <GlobeSection globe={d.globe} />
          </div>
        </HeroIn>

        {/* Tagline */}
        <HeroIn delay={0.3}>
          <p className="display-md mt-10 max-w-2xl text-white/80">
            {d.hero.tagline}
          </p>
        </HeroIn>

        {/* Bio */}
        <HeroIn delay={0.4}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
            {d.hero.bio}
          </p>
        </HeroIn>

        {/* CTAs */}
        <HeroIn delay={0.5}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <HoverButton
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white bg-white px-8 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
            >
              <MessageCircle className="h-4 w-4" />
              {d.hero.quoteCta}
            </HoverButton>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={lp("/work")}
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {d.hero.workCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </HeroIn>

        {/* Scroll hint */}
        <HeroIn delay={0.7}>
          <div className="mt-16 flex flex-col items-center gap-3">
            <p className="tech-label">{d.hero.scroll}</p>
            <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </HeroIn>
      </section>

      {/* ═══ FEATURED WORK — Draggable scattered board ═══ */}
      <section aria-labelledby="featured-heading" className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-16" />
        <WorkBoard
          projects={FEATURED_PROJECTS}
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
        <Reveal>
          <p className="tech-label">
            {d.home.servicesEyebrow}
          </p>
          <RevealHeading
            id="services-heading"
            as="h2"
            className="display-lg mt-4 text-white"
          >
            {d.home.servicesTitle}
          </RevealHeading>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="md:pl-0">
            <HomeServicesList
              items={serviceItems}
              viewServiceLabel={d.servicesPage.discuss}
              locale={locale}
            />
          </div>
        </Reveal>
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
