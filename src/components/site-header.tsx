"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Magnetic } from "@/components/magnetic"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Dict } from "@/i18n/types"
import type { Locale } from "@/i18n/config"
import { SITE } from "@/lib/site"

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dict }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const openRef = useRef(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const close = useCallback((restoreFocus = true) => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    document.body.style.overflow = ""
    if (restoreFocus) {
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [])

  const openMenu = useCallback(() => {
    openRef.current = true
    setOpen(true)
    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("a, button")
      first?.focus({ preventScroll: true })
    })
  }, [])

  const toggle = useCallback(() => {
    if (openRef.current) {
      close()
    } else {
      openMenu()
    }
  }, [close, openMenu])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== "Tab") return
      const panel = panelRef.current
      if (!panel) return
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  const lp = (path: string) => `/${locale}${path === "/" ? "" : path}`
  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/services", label: dict.nav.services },
    { href: "/work", label: dict.nav.work },
    { href: "/pricing", label: dict.nav.pricing },
    { href: "/blog", label: dict.nav.blog },
  ]
  const isActive = (href: string) => {
    const full = lp(href)
    return href === "/" ? pathname === full : pathname.startsWith(full)
  }

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#03070f]/70 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-10">
          {/* Brand — left */}
          <Link
            href={lp("/")}
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="font-display text-base font-semibold tracking-tight text-white">
              {SITE.name}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 transition-colors group-hover:text-white/50 sm:inline">
              {SITE.business}
            </span>
          </Link>

          {/* Nav — center */}
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={lp(item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive(item.href)
                    ? "font-medium text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-white" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher locale={locale} ariaLabel={dict.langSwitcher.aria} />
            <Magnetic strength={0.25} maxShift={4}>
              <a
                href={SITE.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[13px] font-medium text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {dict.nav.letsTalk}
              </a>
            </Magnetic>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            ref={toggleRef}
            onClick={toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="14" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menuLabel}
        aria-hidden={!open}
        inert={!open || undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) close(false)
        }}
        className={`fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-[#03070f]/98 px-6 pb-10 pt-4 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out md:hidden motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={lp(item.href)}
              onClick={() => close(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
              className={`border-b border-white/[0.04] py-4 font-display text-3xl font-semibold tracking-tight transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none ${
                isActive(item.href)
                  ? "text-white"
                  : "text-white/30 hover:text-white"
              } ${
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href={SITE.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => close(false)}
          style={{ transitionDelay: open ? "320ms" : "0ms" }}
          className={`mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-medium text-white/70 transition-all duration-500 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none ${
            open
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp {SITE.whatsapp.label}
        </a>
        <LanguageSwitcher
          locale={locale}
          ariaLabel={dict.langSwitcher.aria}
          className="mt-5 self-start"
        />
      </div>
    </>
  )
}
