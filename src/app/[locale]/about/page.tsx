import type { Metadata } from "next"
import { JsonLd, breadcrumbSchema, personSchema } from "@/components/json-ld"
import { CtaBand } from "@/components/page-hero"
import { InnerHero } from "@/components/inner-hero"
import { ProcessTimeline } from "@/components/process-timeline"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"
import { siteAlternates, siteOpenGraph } from "@/lib/seo"
import styles from "@/components/signal-panels.module.css"

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
    alternates: siteAlternates(`/${locale}/about`),
    openGraph: siteOpenGraph({ locale, path: `/${locale}/about` }),
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
        controls={d.sceneControls}
        link={{ href: "#studio-process", label: d.aboutPage.processHeading }}
        portraitAlt={d.aboutPage.portraitAlt}
        portraitCaption={d.aboutPage.locationCaption}
      />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div>
          <Reveal>
            <div className={styles.aboutIntro}>
            <p>
              {d.aboutPage.intro}
            </p>
            <p>
              {d.aboutPage.body}
            </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <p className={styles.factLine}>
              <span className="font-semibold text-white">
                {d.aboutPage.factLineLead}
              </span>{" "}
              {d.aboutPage.factLineRest}
            </p>
          </Reveal>

          <div id="studio-process" className="mt-16 scroll-mt-28 border-t border-white/10 pt-10">
            <Reveal>
              <p className="mb-4 text-sm text-slate-400">{d.aboutPage.processEyebrow}</p>
              <h2 className="display-md text-white">
                {d.aboutPage.processHeading}
              </h2>
            </Reveal>
            <ProcessTimeline steps={d.aboutPage.process} controls={d.sceneControls} />
          </div>

          <div className="mt-24">
            <Reveal>
              <h2 className="display-md mb-8 text-white">{d.aboutPage.testimonialsHeading}</h2>
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
