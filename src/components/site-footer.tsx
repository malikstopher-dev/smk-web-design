import Link from "next/link"
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react"
import { WordmarkBanner } from "@/components/wordmark-banner"
import type { Dict } from "@/i18n/types"
import type { Locale } from "@/i18n/config"
import { SITE } from "@/lib/site"

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 1 1-2.31-2.84V9.35a6.35 6.35 0 1 0 5.76 6.28V8.75a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.18Z" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
  X: <Twitter className="h-4 w-4" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
}

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
    <footer className="relative mt-20 border-t border-white/[0.06]">
      <WordmarkBanner text="Stopher Malik" className="pb-2 pt-14 sm:pt-20" />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-8 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-base font-semibold tracking-tight text-white">
            {SITE.business}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/35">
            {dict.footer.blurb}
          </p>
          <p className="tech-label mt-6">
            {dict.footer.followUs}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SITE.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} — ${s.handle}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {SOCIAL_ICONS[s.name]}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label={`${dict.footer.pages} (footer)`}>
          <p className="tech-label">
            {dict.footer.pages}
          </p>
          <ul className="mt-4 space-y-2.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="text-sm text-white/35 transition-colors hover:text-white/70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={lp("/contact")}
                className="text-sm text-white/35 transition-colors hover:text-white/70"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={`${dict.footer.servicesCol} (footer)`}>
          <p className="tech-label">
            {dict.footer.servicesCol}
          </p>
          <ul className="mt-4 space-y-2.5">
            {dict.servicesPage.items.map((s, i) => (
              <li key={SITE_SERVICES_SLUGS[i]}>
                <Link
                  href={lp(`/services#${SITE_SERVICES_SLUGS[i]}`)}
                  className="text-sm text-white/35 transition-colors hover:text-white/70"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="tech-label">
            {dict.footer.contactCol}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/35">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {SITE.location.street}, {SITE.location.city}
              </span>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white/70"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white/70"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {SITE.phoneLabel}
              </a>
            </li>
            <li>
              <a
                href={SITE.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 transition-colors hover:text-white/70"
              >
                <span className="pulse-soft flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <span>
                  WhatsApp {SITE.whatsapp.label}
                  <span className="block text-xs text-white/25 transition-colors group-hover:text-white/40">
                    {dict.footer.fastestReply}
                  </span>
                </span>
              </a>
            </li>
            <li className="pt-1 text-xs text-white/25">{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/25 sm:flex-row sm:px-10">
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
