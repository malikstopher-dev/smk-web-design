"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./signal-panels.module.css"

/* ═══════════════════════════════════════════════════════
   TESTIMONIAL CAROUSEL — quote cards with a decorative
   gold quotation mark, auto-advancing with dot indicators,
   swipe support. Entrance: fade + rise on view.
   Reduced motion: no auto-advance, instant entrance.
   ═══════════════════════════════════════════════════════ */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const ADVANCE_MS = 7000

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: { quote: string; name: string; role: string }[]
}) {
  const [index, setIndex] = useState(0)
  const [entered, setEntered] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const cardRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<number | null>(null)
  const count = testimonials.length

  /* Entrance on view. */
  useEffect(() => {
    const el = cardRef.current
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

  /* Auto-advance, paused on hover/focus and reduced motion. */
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (
      paused ||
      !entered ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return
    }
    const t = window.setTimeout(
      () => setIndex((i) => (i + 1) % count),
      ADVANCE_MS,
    )
    return () => clearTimeout(t)
  }, [index, paused, entered, count])

  /* Swipe. */
  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(dx) < 40) return
    setIndex((i) =>
      dx < 0 ? (i + 1) % count : (i - 1 + count) % count,
    )
  }

  const active = testimonials[index]

  return (
    <div
      ref={cardRef}
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "none" : "translateY(24px)",
        transition: entered
          ? `opacity 600ms ${EASE}, transform 600ms ${EASE}`
          : "none",
      }}
    >
      <figure className={`${styles.quote} relative overflow-hidden p-8 sm:p-12`}>
        {/* Decorative gold quote mark, behind the text */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 left-4 select-none font-display text-[9rem] leading-none text-[#e8b04b]"
          style={{ opacity: 0.14 }}
        >
          &ldquo;
        </span>
        <blockquote className="relative">
          <p className="max-w-3xl font-display text-2xl leading-relaxed text-white sm:text-3xl">
            &ldquo;{active.quote}&rdquo;
          </p>
          <figcaption className="mt-7 flex flex-wrap items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#e8b04b]"
            />
            <span className="text-sm font-semibold text-white">
              {active.name}
            </span>
            <span className="text-white/25">&middot;</span>
            <span className="text-sm text-white">{active.role}</span>
          </figcaption>
        </blockquote>
      </figure>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            ><span aria-hidden className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: i === index ? "#e8b04b" : "#ffffff55", background: i === index ? "#e8b04b" : "transparent" }} /></button>
          ))}
        </div>
      )}
    </div>
  )
}
