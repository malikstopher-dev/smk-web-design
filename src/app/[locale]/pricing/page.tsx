import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { JsonLd, SITE_URL, breadcrumbSchema } from "@/components/json-ld"
import { CtaBand, PageHero } from "@/components/page-hero"
import { Reveal } from "@/components/reveal"
import { getDict } from "@/i18n/index"
import { PRICING_PRICES, SITE } from "@/lib/site"

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
  const lp = (path: string) => `/${locale}${path}`

  function whatsappFor(tierEyebrow: string, cta: string, template: string) {
    const text = encodeURIComponent(
      template
        .replace("{package}", tierEyebrow)
        .replace("{cta}", cta),
    )
    return `${SITE.whatsapp.url}?text=${text}`
  }

  const popular = 1

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

      <section className="smk-container">
        <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 md:grid-cols-3">
          {d.pricingPage.tiers.map((tier, i) => {
            const isPopular = i === popular
            return (
              <Reveal key={tier.eyebrow} delay={i * 80}>
                <article
                  className={`flex h-full flex-col border-t pt-6 ${
                    isPopular ? "border-white" : "border-white/15"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-sm uppercase tracking-[0.14em] text-gray-300">
                      {tier.eyebrow}
                      {isPopular && (
                        <span className="ml-2 text-[10px] text-white">
                          {d.pricingPage.popular}
                        </span>
                      )}
                    </h2>
                  </div>
                  <p className="mt-5 text-3xl font-medium text-white sm:text-4xl">
                    {PRICING_PRICES[i]}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{tier.terms}</p>
                  <ul className="mt-6 space-y-2 text-sm text-gray-300">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xs leading-relaxed text-gray-500">
                    {d.pricingPage.bestForPrefix} {tier.bestFor}
                  </p>
                  <Link
                    href={whatsappFor(tier.eyebrow, tier.cta, d.pricingPage.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="smk-link mt-8 inline-flex items-center gap-1.5 text-sm text-white"
                  >
                    {tier.cta}
                  </Link>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={140}>
          <p className="mt-16 text-sm text-gray-500">
            {d.pricingPage.notSurePrefix}{" "}
            <a
              href="https://wa.me/27825100050"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white smk-link"
            >
              +27 82 510 0050
            </a>{" "}
            {d.pricingPage.notSureSuffix}
          </p>
        </Reveal>
      </section>

      <CtaBand
        title={d.ctaBand.title}
        body={d.ctaBand.body}
        secondaryHref={lp("/work")}
        secondaryLabel={d.ctaBand.secondaryLabel}
        primaryLabel={d.hero.quoteCta}
      />
    </>
  )
}
