import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { LOCALES, OG_LOCALE, isLocale } from "@/i18n/config"
import { getDict } from "@/i18n/index"

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const d = getDict(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: d.meta.homeTitle,
      template: d.meta.templateSuffix,
    },
    description: d.meta.homeDesc,
    openGraph: {
      type: "website",
      siteName: "SMK Web Design",
      locale: OG_LOCALE[isLocale(locale) ? locale : "en"],
      url: `${SITE_URL}/${locale}`,
      images: [
        {
          url: "/og-image-1200x630.png",
          width: 1200,
          height: 630,
          alt: d.meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@stopher_malik",
      creator: "@stopher_malik",
      images: ["/og-image-1200x630.png"],
    },
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDict(locale)

  return (
    <>
      <SiteHeader locale={locale} dict={d} />
      <main className="flex-1 pb-14 sm:pb-24">{children}</main>
      <SiteFooter locale={locale} dict={d} />
    </>
  )
}
