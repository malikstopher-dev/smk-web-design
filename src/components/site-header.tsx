"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Dict } from "@/i18n/types"
import type { Locale } from "@/i18n/config"
import { SITE } from "@/lib/site"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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
  const isActive = (href: string) => {
    const full = lp(href)
    return href === "/" ? pathname === full : pathname.startsWith(full)
  }

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-[#03070f]/60 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="smk-container flex h-14 items-center justify-between">
          <Link
            href={lp("/")}
            className="font-display text-base font-medium tracking-tight text-white"
          >
            {SITE.name}
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 md:flex"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={lp(item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-sm transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <span className="ml-2 inline-flex items-center gap-1 border-l border-white/10 pl-4">
              <LanguageSwitcher
                locale={locale}
                ariaLabel={dict.langSwitcher.aria}
              />
            </span>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="inline-flex h-9 w-9 items-center justify-center text-white md:hidden"
          >
            <span className="text-xs uppercase tracking-[0.18em]">
              {open ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menuLabel}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false)
        }}
        className={`fixed inset-0 z-40 flex flex-col bg-[#03070f]/95 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="smk-container flex h-14 items-center justify-between">
          <Link
            href={lp("/")}
            onClick={() => setOpen(false)}
            className="font-display text-base font-medium tracking-tight text-white"
          >
            {SITE.name}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={dict.nav.closeMenu}
            className="inline-flex h-9 w-9 items-center justify-center text-white"
          >
            <span className="text-xs uppercase tracking-[0.18em]">Close</span>
          </button>
        </div>
        <nav
          aria-label="Mobile"
          className="smk-container flex flex-1 flex-col justify-center gap-6"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={lp(item.href)}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`font-display text-3xl font-medium tracking-tight ${
                isActive(item.href) ? "text-white" : "text-gray-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="smk-container pb-10 pt-6">
          <LanguageSwitcher
            locale={locale}
            ariaLabel={dict.langSwitcher.aria}
          />
        </div>
      </div>
    </>
  )
}
