"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { Dict } from "@/i18n/types"
import type { ServiceItem } from "@/lib/site"
import { TerminalTypewriter, type TerminalLine } from "@/components/terminal-typewriter"

/* ═══════════════════════════════════════════════════════
   SERVICES BOARD — asymmetric grid, featured full-stack
   card with terminal snippet, staggered rise entrance,
   4° cursor tilt, gold hover glow.
   Reduced motion: instant final state, instant hovers.
   ═══════════════════════════════════════════════════════ */

const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const MAX_TILT = 4

const TERMINAL_LINES: TerminalLine[] = [
  { text: "$ next build" },
  { text: "compiled in 1.2s", checked: true },
  { text: "$ deploy --prod" },
  { text: "live in 14 days", checked: true },
]

function ServiceCard({
  index,
  title,
  description,
  points,
  discussLabel,
  contactHref,
  featured = false,
  entered,
}: {
  index: number
  title: string
  description: string
  points: string[]
  discussLabel: string
  contactHref: string
  featured?: boolean
  entered: boolean
}) {
  const tiltRef = useRef<HTMLDivElement>(null)

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tiltRef.current
    if (!el) return
    // Tilt is mouse-only; touch cards keep native scroll and
    // get the active-state scale feedback below.
    if (e.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `translateY(-6px) rotateX(${-py * MAX_TILT * 2}deg) rotateY(${px * MAX_TILT * 2}deg)`
    el.style.borderColor = "rgba(232, 176, 75, 0.5)"
    el.style.boxShadow = "0 0 24px rgba(250, 204, 21, 0.18)"
  }

  function onPointerLeave() {
    const el = tiltRef.current
    if (!el) return
    el.style.transform = ""
    el.style.borderColor = ""
    el.style.boxShadow = ""
  }

  return (
    <div
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? undefined : "translateY(30px)",
        transition: entered
          ? undefined
          : `opacity 600ms ${ENTER_EASE} ${index * 90}ms, transform 600ms ${ENTER_EASE} ${index * 90}ms`,
      }}
      className="h-full will-change-transform"
    >
      <div
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="flex h-full flex-col border border-white/[0.06] bg-[#03070f]/60 p-8 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out will-change-transform motion-reduce:transition-none active:scale-[0.98] [@media(hover:hover)]:active:scale-100 motion-reduce:active:scale-100"
      >
        <div className="flex items-start justify-between">
          <span className="project-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="tech-label">0{index + 1}_</span>
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white">
          {description}
        </p>
        <ul className="mt-6 grid gap-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-white">
              <span aria-hidden className="mt-px font-mono text-xs leading-5 text-white/40">
                +
              </span>
              {p}
            </li>
          ))}
        </ul>
        {featured && (
          <div className="mt-7">
            <TerminalTypewriter lines={TERMINAL_LINES} />
          </div>
        )}
        <Link
          href={contactHref}
          className="group mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {discussLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

/* One observer for the whole board: each card is "entered"
   once the board region is 0.2 visible, staggered by index. */
function useEnterObserver() {
  const [entered, setEntered] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const boardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = boardRef.current
    if (!el || entered) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          setEntered(true)
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [entered])
  return { boardRef, entered }
}

export function ServicesBoard({
  eyebrow,
  services,
  dict,
  locale,
}: {
  eyebrow: string
  services: ServiceItem[]
  dict: Dict
  locale: string
}) {
  const { boardRef, entered } = useEnterObserver()
  const featuredIdx = services.findIndex(
    (s) => s.slug === "full-stack-development",
  )
  const featured = featuredIdx >= 0 ? services[featuredIdx] : null
  const rest = services.filter((_, i) => i !== featuredIdx)

  return (
    <div ref={boardRef}>
      <p className="tech-label">{eyebrow}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured && (
          <div className="h-full md:col-span-2 md:row-span-2">
            <div id={featured.slug} className="scroll-mt-24 h-full">
            <ServiceCard
              index={featuredIdx}
              title={dict.servicesPage.items[featuredIdx].title}
              description={dict.servicesPage.items[featuredIdx].description}
              points={dict.servicesPage.items[featuredIdx].points}
              discussLabel={dict.servicesPage.discuss}
              contactHref={`/${locale}/contact?service=${encodeURIComponent(dict.servicesPage.items[featuredIdx].title)}`}
              featured
              entered={entered}
            />
            </div>
          </div>
        )}
        {rest.map((s) => {
          const idx = services.indexOf(s)
          const item = dict.servicesPage.items[idx]
          return (
            <div key={s.slug} id={s.slug} className="scroll-mt-24">
              <ServiceCard
                index={idx}
                title={item.title}
                description={item.description}
                points={item.points}
                discussLabel={dict.servicesPage.discuss}
                contactHref={`/${locale}/contact?service=${encodeURIComponent(item.title)}`}
                entered={entered}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
