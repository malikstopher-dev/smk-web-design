import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react"
import { GlobeSection } from "@/components/globe-section"
import { HeroDepthScene } from "@/components/hero-depth-scene"
import { Magnetic } from "@/components/magnetic"
import { HomeServicesList } from "@/components/home-services-list"
import {
  JsonLd,
  localBusinessSchema,
  personSchema,
  websiteSchema,
} from "@/components/json-ld"
import { HeroIn, HoverButton } from "@/components/motion"
import { CtaBand } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { RevealHeading } from "@/components/text-reveal"
import { WordmarkBanner } from "@/components/wordmark-banner"
import { ProjectCard } from "@/components/work-grid"
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
  }
}

function OrbitRings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    >
      <span className="absolute rounded-full border border-white/[0.07]" style={{ width: "116%", height: "116%" }} />
      <span className="absolute hidden rounded-full border border-white/[0.05] sm:block" style={{ width: "134%", height: "134%" }} />
      <span className="orbit-spin absolute hidden rounded-full border border-dashed border-white/[0.10] sm:block" style={{ width: "154%", height: "154%" }}>
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_8px_2px_rgba(255,255,255,0.35)]" />
      </span>
      <span className="ambient-drift absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-white/50" />
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

      <section className="relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden px-6 pb-8 pt-10 text-center sm:pt-20">
        <HeroDepthScene />
        <HeroIn>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            {d.hero.eyebrowRole} · {d.hero.eyebrowLocation}
          </p>
        </HeroIn>

        <HeroIn delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-gray-900 sm:text-7xl dark:text-white">
            Stopher Malik
          </h1>
        </HeroIn>

        <HeroIn delay={0.2} className="relative mt-2 w-full max-w-md">
          <OrbitRings />
          <div className="relative z-10">
            <GlobeSection globe={d.globe} />
          </div>
        </HeroIn>

        <HeroIn delay={0.3}>
          <p className="mt-8 font-display text-xl italic text-gray-600 sm:text-2xl dark:text-gray-400">
            {d.hero.tagline}
          </p>
        </HeroIn>

        <HeroIn delay={0.4}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
            {d.hero.bio}
          </p>
        </HeroIn>

        <HeroIn delay={0.5}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <HoverButton
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
            >
              <MessageCircle className="h-4 w-4" />
              {d.hero.quoteCta}
            </HoverButton>
            <Magnetic strength={0.25} maxShift={4}>
              <Link
                href={lp("/work")}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-700 px-7 text-sm font-medium text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {d.hero.workCta}
                <ArrowDown className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </HeroIn>

        <HeroIn delay={0.7}>
          <p className="mt-12 text-[11px] uppercase tracking-[0.35em] text-gray-600">
            {d.hero.scroll}
          </p>
        </HeroIn>
      </section>

      <section aria-labelledby="featured-heading" className="mx-auto mt-16 max-w-6xl px-6 sm:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                {d.home.featuredEyebrow}
              </p>
              <RevealHeading
                id="featured-heading"
                as="h2"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
              >
                {d.home.featuredTitle}
              </RevealHeading>
            </div>
            <Link
              href={lp("/work")}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-gray-900 underline-offset-4 hover:underline sm:inline-flex dark:text-white"
            >
              {d.home.allProjects}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURED_PROJECTS.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.09}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <ProjectCard p={p} wide={i === 0} locale={locale} dict={d} />
            </Reveal>
          ))}
        </div>
      </section>

      <WordmarkBanner text={d.home.bannerText} className="mt-16" />

      <section aria-labelledby="services-heading" className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            {d.home.servicesEyebrow}
          </p>
          <RevealHeading
            id="services-heading"
            as="h2"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
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
