import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HoverLift } from "@/components/motion"
import { SpotlightCard } from "@/components/spotlight-card"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
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
        <div className="grid gap-6 lg:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.slug}
              delay={(i % 2) * 0.09}
              className={i % 2 === 1 ? "lg:mt-14" : ""}
            >
              <HoverLift className="h-full">
                <SpotlightCard className="h-full">
                  <article
                    id={s.slug}
                    className="flex h-full scroll-mt-24 flex-col border border-white/[0.06] p-8 transition-colors duration-300 hover:border-white/[0.12]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="project-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="tech-label">0{i + 1}_</span>
                    </div>
                    <h2 className="mt-5 display-md text-white">
                      {d.servicesPage.items[i].title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-white/45">
                      {d.servicesPage.items[i].description}
                    </p>
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {d.servicesPage.items[i].points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm text-white/50"
                        >
                          <span
                            aria-hidden
                            className="mt-px font-mono text-xs leading-5 text-white/25"
                          >
                            +
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`${lp("/contact")}?service=${encodeURIComponent(d.servicesPage.items[i].title)}`}
                      className="group mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {d.servicesPage.discuss}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                </SpotlightCard>
              </HoverLift>
            </Reveal>
          ))}
        </div>
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
