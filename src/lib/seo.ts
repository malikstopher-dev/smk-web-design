import type { Metadata } from "next"
import { SITE_URL } from "@/components/json-ld"
import { OG_LOCALE, LOCALES, isLocale } from "@/i18n/config"
import { getDict } from "@/i18n/index"

type OpenGraphOptions = {
  locale: string
  path: string
  type?: "website" | "article"
  title?: string
  description?: string
  publishedTime?: string
  modifiedTime?: string
}

export function siteAlternates(
  canonicalPath: string,
): NonNullable<Metadata["alternates"]> {
  const swap = (replacement: string) =>
    canonicalPath.replace(/^\/[a-z]{2}(?=[/]|$)/, replacement)
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}${swap(`/${locale}`)}`
  }
  languages["x-default"] = `${SITE_URL}${swap("") || "/"}`
  return { canonical: canonicalPath, languages }
}

export function siteOpenGraph({
  locale,
  path,
  type = "website",
  title,
  description,
  publishedTime,
  modifiedTime,
}: OpenGraphOptions): Metadata["openGraph"] {
  const d = getDict(locale)
  const shared = {
    siteName: "SMK Web Design",
    locale: OG_LOCALE[isLocale(locale) ? locale : "en"],
    url: `${SITE_URL}${path}`,
    images: [
      {
        url: "/og-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: d.meta.ogImageAlt,
      },
    ],
  }
  const text = {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
  }
  if (type === "article") {
    return {
      type: "article",
      ...shared,
      ...text,
      ...(publishedTime !== undefined ? { publishedTime } : {}),
      ...(modifiedTime !== undefined ? { modifiedTime } : {}),
    }
  }
  return { type: "website", ...shared, ...text }
}
