import type { Metadata } from "next"
import Image from "next/image"
import { JsonLd, SITE_URL, breadcrumbSchema, personSchema } from "@/components/json-ld"
import { CtaBand } from "@/components/page-hero"
import { InnerHero } from "@/components/inner-hero"
import { ProcessTimeline } from "@/components/process-timeline"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
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
        scene="about"
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
            <ProcessTimeline steps={d.aboutPage.process} />
          </div>

          <div className="mt-16">
            <Reveal>
              <p className="tech-label mb-4">{d.aboutPage.testimonialsHeading}</p>
            </Reveal>
            <div className="mt-6">
              <TestimonialCarousel testimonials={d.aboutPage.testimonials} />
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
