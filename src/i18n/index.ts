import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"
import en from "@/i18n/messages/en"
import fr from "@/i18n/messages/fr"
import pt from "@/i18n/messages/pt"
import type { Dict } from "@/i18n/types"

const MESSAGES: Record<Locale, Dict> = { en, fr, pt }

export function getDict(locale: string): Dict {
  return isLocale(locale) ? MESSAGES[locale] : MESSAGES[DEFAULT_LOCALE]
}

export function projectDesc(locale: string, slug: string, fallback: string): string {
  const d = getDict(locale)
  return d.workPage.descs[slug] ?? fallback
}

export function tagLabel(locale: string, tag: string): string {
  const d = getDict(locale)
  return d.workPage.tagLabels[tag] ?? tag
}

export type { Dict }
