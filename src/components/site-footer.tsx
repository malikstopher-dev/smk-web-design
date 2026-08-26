import Link from "next/link"
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Twitter } from "lucide-react"
import { WordmarkBanner } from "@/components/wordmark-banner"
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
  ]

  return (
    <footer className="relative mt-10 border-t border-white/10">
      <WordmarkBanner text="Stopher Malik" className="pb-2 pt-10 sm:pt-14" />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-6 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-white">
            {SITE.business}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
            {dict.footer.blurb}
          </p>
          <div className="mt-5 flex gap-2">
            {SITE.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {s.name === "Instagram" && <Instagram className="h-4 w-4" />}
                {s.name === "X" && <Twitter className="h-4 w-4" />}
                {s.name === "LinkedIn" && <Linkedin className="h-4 w-4" />}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label={`${dict.footer.pages} (footer)`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            {dict.footer.pages}
          </p>
          <ul className="mt-4 space-y-2.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={lp("/contact")}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={`${dict.footer.servicesCol} (footer)`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            {dict.footer.servicesCol}
          </p>
          <ul className="mt-4 space-y-2.5">
            {dict.servicesPage.items.map((s, i) => (
              <li key={SITE_SERVICES_SLUGS[i]}>
                <Link
                  href={lp(`/services#${SITE_SERVICES_SLUGS[i]}`)}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            {dict.footer.contactCol}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {SITE.location.street}, {SITE.location.city}
              </span>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <span className="pulse-soft flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span>
                  WhatsApp {SITE.whatsapp.label}
                  <span className="block text-xs text-gray-500 transition-colors group-hover:text-gray-300">
                    {dict.footer.fastestReply}
                  </span>
                </span>
              </a>
            </li>
            <li className="pt-1 text-xs text-gray-500">{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-gray-500 sm:flex-row sm:px-10">
          <p>
            © {new Date().getFullYear()} {SITE.business} · {SITE.name}
          </p>
          <p>{dict.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}

const SITE_SERVICES_SLUGS = [
  "website-design",
  "full-stack-development",
  "seo-performance",
  "cloud-deployment",
  "ui-ux-design",
  "branding-identity",
]
