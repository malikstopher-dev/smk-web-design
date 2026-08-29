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
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.about, path: lp("/about") },
        ])}
      />

      <PageHero
        eyebrow={d.nav.about}
        title={d.aboutPage.title}
        lede={d.aboutPage.lede}
      />

      <section className="smk-container grid grid-cols-1 gap-12 pb-12 md:grid-cols-12 md:gap-x-[var(--gutter)]">
        <Reveal className="md:col-span-5">
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/stopher-portrait.png"
              alt={d.aboutPage.portraitAlt}
              width={640}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white" />
            Paulshof, Sandton
          </p>
        </Reveal>

        <div className="md:col-span-7">
          <Reveal>
            <p className="text-lg leading-relaxed text-gray-200 sm:text-xl">
              {d.aboutPage.intro}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-5 max-w-[var(--col-7)] text-base leading-relaxed text-gray-400">
              {d.aboutPage.body}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-9 border-t border-white/10 pt-5 text-sm leading-relaxed text-gray-400">
              <span className="font-medium text-white">
                {d.aboutPage.factLineLead}
              </span>{" "}
              {d.aboutPage.factLineRest}
            </p>
          </Reveal>

          <div className="mt-16">
            <Reveal>
              <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                {d.aboutPage.processHeading}
              </h2>
            </Reveal>
            <ol className="mt-7 border-t border-white/10">
              {d.aboutPage.process.map((step, i) => (
                <li
                  key={step.title}
                  className="border-b border-white/10"
                >
                  <Reveal delay={i * 60}>
                    <div className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[6rem_1fr] sm:gap-8">
                      <span className="text-xs uppercase tracking-[0.14em] text-gray-500">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-base font-medium text-white sm:text-lg">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-[var(--col-6)] text-sm leading-relaxed text-gray-400">
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
