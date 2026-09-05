import type { Metadata } from "next"
import Image from "next/image"
import { JsonLd, SITE_URL, breadcrumbSchema, personSchema } from "@/components/json-ld"
import { CtaBand } from "@/components/page-hero"
import { InnerHero } from "@/components/inner-hero"
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

      <InnerHero
        eyebrow={d.nav.about}
        heading={d.aboutPage.title}
        subtext={d.aboutPage.lede}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden border border-white/[0.06]">
            <Image
              src="/stopher-portrait.png"
              alt={d.aboutPage.portraitAlt}
              width={640}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/30">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
            Paulshof, Sandton
          </p>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-lg leading-relaxed text-white/55">
              {d.aboutPage.intro}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-5 leading-relaxed text-white/45">
              {d.aboutPage.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-9 border-y border-white/[0.06] py-7 text-sm leading-relaxed text-white/45">
              <span className="font-semibold text-white">
                {d.aboutPage.factLineLead}
              </span>{" "}
              {d.aboutPage.factLineRest}
            </p>
          </Reveal>

          <div className="mt-12">
            <Reveal>
              <p className="tech-label mb-4">Process</p>
              <h2 className="display-md text-white">
                {d.aboutPage.processHeading}
              </h2>
            </Reveal>
            <ol className="mt-8 divide-y divide-white/[0.06]">
              {d.aboutPage.process.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 80}>
                    <div className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:gap-8">
                      <span className="project-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-semibold text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/40">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            <Reveal>
              <p className="tech-label mb-4">{d.aboutPage.testimonialsHeading}</p>
            </Reveal>
            <div className="mt-6 space-y-6">
              {d.aboutPage.testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <blockquote className="border-l-2 border-white/10 pl-5">
                    <p className="text-sm leading-relaxed text-white/50">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-3">
                      <span className="text-xs font-semibold text-white/70">
                        {t.name}
                      </span>
                      <span className="mx-1.5 text-white/20">&middot;</span>
                      <span className="text-xs text-white/35">{t.role}</span>
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
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
