import Link from "next/link"
import { Instagram, Linkedin, Twitter } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Dict } from "@/i18n/types"
import type { Locale } from "@/i18n/config"
import { SITE } from "@/lib/site"

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dict }) {
  const lp = (path: string) => `/${locale}${path === "/" ? "" : path}`
  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/services", label: dict.nav.services },
    { href: "/work", label: dict.nav.work },
    { href: "/pricing", label: dict.nav.pricing },
    { href: "/blog", label: dict.nav.blog },
    { href: "/contact", label: dict.nav.contact },
  ]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 mt-32">
      <div className="smk-container flex flex-col gap-8 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>© {year}</span>
          <span aria-hidden>·</span>
          <span className="text-white">{SITE.business}</span>
        </div>

        <nav aria-label="Footer" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="text-gray-500 transition-colors hover:text-white"
              >
                {s.name === "Instagram" && <Instagram className="h-4 w-4" />}
                {s.name === "X" && <Twitter className="h-4 w-4" />}
                {s.name === "LinkedIn" && <Linkedin className="h-4 w-4" />}
              </a>
            ))}
          </div>
          <span aria-hidden>·</span>
          <LanguageSwitcher
            locale={locale}
            ariaLabel={dict.langSwitcher.aria}
            variant="inline"
          />
        </div>
      </div>

      <div className="smk-container border-t border-white/10 py-5 text-xs text-gray-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.location.street}, {SITE.location.city} · {SITE.email}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}
