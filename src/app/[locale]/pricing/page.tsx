import type { Metadata } from "next"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { PageHero } from "@/components/page-hero"
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

      <PageHero
        eyebrow={d.nav.pricing}
        title={d.pricingPage.title}
        lede={d.pricingPage.lede}
      />

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <PricingCards pricing={d.pricingPage} />
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {d.pricingPage.notSurePrefix}{" "}
            <a
              href="https://wa.me/27825100050"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white"
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
