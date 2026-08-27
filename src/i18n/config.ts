export const LOCALES = ["en", "fr", "pt"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

export const HTML_LANG: Record<Locale, string> = {
  en: "en-ZA",
  fr: "fr-CD",
  pt: "pt-MZ",
}

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_ZA",
  fr: "fr_CD",
  pt: "pt_MZ",
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function localeFromPathname(pathname: string): Locale | null {
  const seg = pathname.split("/")[1]
  return seg && isLocale(seg) ? seg : null
}

export function localizedPath(pathname: string, locale: Locale): string {
  const withoutLocale = localeFromPathname(pathname)
    ? pathname.split("/").slice(2).join("/")
    : pathname.replace(/^\//, "")
  const safe = withoutLocale.replace(/\.\.+/g, "").replace(/\/+/g, "/")
  return `/${locale}${safe ? `/${safe}` : ""}`
}
