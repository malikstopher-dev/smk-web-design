import type { Metadata } from "next"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { InnerHero } from "@/components/inner-hero"
import { Reveal } from "@/components/reveal"
import { PricingCards } from "@/components/pricing-cards"
import { getDict } from "@/i18n/index"

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
        centerpiece="growth"
      />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="editorial-divider mb-12" />
        <PricingCards pricing={d.pricingPage} />
        <Reveal delay={140}>
          <p className="mt-8 text-center text-sm text-white">
            {d.pricingPage.notSurePrefix}{" "}
            <a
              href="https://wa.me/27825100050"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline-offset-4 transition-colors hover:text-white/70 hover:underline"
            >
              +27 82 510 0050
            </a>{" "}
            {d.pricingPage.notSureSuffix}
          </p>
        </Reveal>
      </section>
    </>
  )
}
