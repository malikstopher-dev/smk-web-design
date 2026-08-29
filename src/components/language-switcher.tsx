"use client"

import { usePathname, useRouter } from "next/navigation"
import { LOCALES, localizedPath, type Locale } from "@/i18n/config"

const LABELS: Record<Locale, string> = { en: "EN", fr: "FR", pt: "PT" }

function persistLocale(target: Locale) {
  document.cookie = `smk-lang=${target}; path=/; max-age=31536000; samesite=lax`
}

type Variant = "pill" | "inline"

export function LanguageSwitcher({
  locale,
  className = "",
  ariaLabel = "Language",
  variant = "pill",
}: {
  locale: Locale
  className?: string
  ariaLabel?: string
  variant?: Variant
}) {
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(target: Locale) {
    if (target === locale) return
    persistLocale(target)
    router.push(localizedPath(pathname, target))
  }

  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] ${className}`}
      >
        {LOCALES.map((l, i) => {
          const active = l === locale
          return (
            <span key={l} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-gray-600">/</span>}
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => switchTo(l)}
                className={`transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                  active
                    ? "text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {LABELS[l]}
              </button>
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/15 px-1.5 py-1 ${className}`}
    >
      {LOCALES.map((l, i) => {
        const active = l === locale
        return (
          <span key={l} className="inline-flex items-center gap-0.5">
            {i > 0 && (
              <span aria-hidden className="px-0.5 text-[0.55rem] text-gray-500">
                |
              </span>
            )}
            <button
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => switchTo(l)}
              className={`rounded-full px-2 py-1 font-mono text-[0.68rem] font-bold tracking-[0.1em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                active
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {LABELS[l]}
            </button>
          </span>
        )
      })}
    </div>
  )
}
