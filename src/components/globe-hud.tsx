"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { GlobeMarkers } from "@/components/globe-markers"
import { CLIENT_GEO } from "@/lib/markers"
import { getDict } from "@/i18n/index"
import type { Locale } from "@/i18n/config"

/* ─────────────────────────────────────────────────────────────
   SITE-WIDE GLOBE SYSTEM
   One source of truth: GlobeMarkers (cobe).

   - Home page hero: GlobeSection renders the large in-flow globe
     directly (this component returns null on "/" routes).
   - Internal pages: this component renders the small persistent
     corner globe — same materials, dots, colour and motion.

   The layout wraps every locale route, so the corner globe
   survives client-side navigation without re-initialising cobe.
   ───────────────────────────────────────────────────────────── */

function isHome(pathname: string) {
  // "/en", "/fr", "/pt" (with or without trailing slash) = home.
  const segs = pathname.split("/").filter(Boolean)
  return segs.length <= 1
}

export function GlobeHUD({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [selected, setSelected] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [nearFooter, setNearFooter] = useState(false)
  const d = getDict(locale)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1600)
    return () => clearTimeout(timer)
  }, [])

  // Fade the corner globe out near the footer so it never sits on
  // top of the closing content / payment links.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const nearBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 420
      setNearFooter((prev) => (prev === nearBottom ? prev : nearBottom))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (isHome(pathname)) return null

  const markers = CLIENT_GEO.map((m) => ({
    ...m,
    country: d.globe.markers[m.id]?.country ?? m.country,
    work: d.globe.markers[m.id]?.work ?? m.work,
  }))
  const active = markers.find((m) => m.id === selected) ?? null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 right-6 z-0 hidden lg:block"
      style={{
        opacity: visible && !nearFooter ? 0.32 : 0,
        transition:
          "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="pointer-events-auto relative h-[min(240px,20vw)] w-[min(240px,20vw)]">
        <GlobeMarkers
          markers={markers}
          onSelect={setSelected}
          speed={0.0016}
        />
        {active && (
          <div
            className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap border border-white/10 bg-[#050a14]/80 px-3.5 py-1.5 text-center backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <span className="text-[11px] font-semibold text-white">
              {active.country}
            </span>
            <span className="mx-1.5 text-white/30">·</span>
            <span className="text-[11px] text-white/50">{active.work}</span>
          </div>
        )}
      </div>
    </div>
  )
}
