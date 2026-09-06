"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   HOME SERVICES GRID — same card language as the Services
   page board: border, dark backdrop, gold hover glow,
   -6px lift with 4-degree cursor tilt. Entrance is a
   staggered rise (30px, 600ms, 80ms per card).
   ═══════════════════════════════════════════════════════ */

const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const MAX_TILT = 4

export function HomeServicesGrid({
  items,
  viewLabel,
  locale,
}: {
  items: { slug: string; title: string; short: string }[]
  viewLabel: string
  locale: string
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <Card
          key={s.slug}
          index={i}
          slug={s.slug}
          title={s.title}
          short={s.short}
          viewLabel={viewLabel}
          locale={locale}
        />
      ))}
    </div>
  )
}

function Card({
  index,
  slug,
  title,
  short,
  viewLabel,
  locale,
}: {
  index: number
  slug: string
  title: string
  short: string
  viewLabel: string
  locale: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const el = ref.current
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

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tiltRef.current
    if (!el) return
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
      ref={ref}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? undefined : "translateY(30px)",
        transition: entered
          ? undefined
          : `opacity 600ms ${ENTER_EASE} ${index * 80}ms, transform 600ms ${ENTER_EASE} ${index * 80}ms`,
      }}
    >
      <div
        ref={tiltRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group flex h-full flex-col border border-white/[0.06] bg-[#03070f]/60 p-6 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out will-change-transform motion-reduce:transition-none"
      >
        <div className="flex items-start justify-between">
          <span className="project-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ArrowUpRight className="h-4 w-4 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-white/70" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-white">{short}</p>
        <Link
          href={`/${locale}/services#${slug}`}
          className="group/link mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {viewLabel}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
