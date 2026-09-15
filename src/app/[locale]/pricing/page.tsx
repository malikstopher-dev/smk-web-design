import type { Metadata } from "next"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { InnerHero } from "@/components/inner-hero"
import { Reveal } from "@/components/reveal"
import { PricingCards } from "@/components/pricing-cards"
import { getDict } from "@/i18n/index"
import { SITE } from "@/lib/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    title: d.pricingPage.metaTitle,
    description: d.pricingPage.metaDesc,
    alternates: { canonical: `/${locale}/pricing` },
    openGraph: { url: `${SITE_URL}/${locale}/pricing` },
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const d = getDict(locale)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: d.nav.home, path: `/${locale}` },
          { name: d.nav.pricing, path: `/${locale}/pricing` },
        ])}
      />

      <InnerHero
        eyebrow={d.nav.pricing}
        heading={d.pricingPage.title}
        subtext={d.pricingPage.lede}
        scene="pricing"
      />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-12" />
        <PricingCards pricing={d.pricingPage} />
        <Reveal delay={140}>
          <p className="mt-8 text-center text-sm text-white">
            {d.pricingPage.notSurePrefix}{" "}
            <a
              href={SITE.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline-offset-4 transition-colors hover:text-white/70 hover:underline"
            >
              {SITE.whatsapp.label}
            </a>{" "}
            {d.pricingPage.notSureSuffix}
          </p>
        </Reveal>
      </section>
    </>
  )
}
