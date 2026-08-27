import type { Metadata } from "next"
import Image from "next/image"
import { JsonLd, SITE_URL, breadcrumbSchema, personSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.aboutPage.metaTitle,
    description: d.aboutPage.metaDesc,
    alternates: { canonical: `/${locale}/about` },
    openGraph: { url: `${SITE_URL}/${locale}/about` },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)
  const lp = (path: string) => `/${locale}${path}`

  return (
    <>
      <JsonLd data={personSchema(d.jsonld.personDesc)} />
      <JsonLd
        data={breadcrumbSchema([
          {
            name: d.nav.home,
            path: `/${locale}`,
          },
          { name: d.nav.about, path: lp("/about") },
        ])}
      />

      <PageHero eyebrow={d.nav.about} title={d.aboutPage.title} lede={d.aboutPage.lede} />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gray-800 shadow-2xl shadow-black/40">
            <Image
              src="/stopher-portrait.png"
              alt={d.aboutPage.portraitAlt}
              width={640}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
            Paulshof, Sandton
          </p>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {d.aboutPage.intro}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-400">
              {d.aboutPage.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-9 border-y border-gray-800 py-7 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                {d.aboutPage.factLineLead}
              </span>{" "}
              {d.aboutPage.factLineRest}
            </p>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {d.aboutPage.processHeading}
              </h2>
            </Reveal>
            <ol className="mt-7 divide-y divide-gray-800">
              {d.aboutPage.process.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 80}>
                    <div className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:gap-8">
                      <span className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-500">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
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
