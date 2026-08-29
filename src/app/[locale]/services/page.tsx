import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
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

      <section className="smk-container">
        <ol className="border-t border-white/10">
          {SERVICES.map((s, i) => (
            <li
              key={s.slug}
              id={s.slug}
              className="border-b border-white/10 scroll-mt-24"
            >
              <Reveal delay={i * 50}>
                <article className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-4 py-10 sm:grid-cols-12">
                  <span className="text-xs uppercase tracking-[0.14em] text-gray-500 sm:col-span-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="sm:col-span-6">
                    <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {d.servicesPage.items[i].title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-gray-400">
                      {d.servicesPage.items[i].description}
                    </p>
                  </div>
                  <div className="sm:col-span-4">
                    <ul className="space-y-1.5 text-sm text-gray-300">
                      {d.servicesPage.items[i].points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5"
                        >
                          <span
                            aria-hidden
                            className="mt-0.5 text-gray-500"
                          >
                            +
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`${lp("/contact")}?service=${encodeURIComponent(
                        d.servicesPage.items[i].title,
                      )}`}
                      className="smk-link mt-4 inline-flex items-center gap-1.5 text-sm text-white"
                    >
                      {d.servicesPage.discuss}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
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
