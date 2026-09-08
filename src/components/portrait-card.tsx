"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   PORTRAIT CARD — the About page photo. Entrance on scroll
   into view (IO threshold 0.2, one shot — same pattern as
   the rest of the page): opacity 0→1 + scale 0.92→1 over
   750ms with a left-to-right clip-path wipe layered in.
   Identical on mobile and desktop. Reduced motion, SSR,
   and no-JS: final state immediately.
   ═══════════════════════════════════════════════════════ */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const ENTRANCE_MS = 750

export function PortraitCard({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string
  alt: string
  width: number
  height: number
  caption: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const armedRef = useRef(false)
  /* SSR, reduced motion, and no-JS render the finished card.
     Motion-OK clients hide it after mount, then reveal. */
  const [entered, setEntered] = useState(true)

  /* One effect owns the whole lifecycle: detect motion pref,
     hide, observe, reveal. No cross-effect state races. */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReduced) return

    const el = wrapRef.current
    if (!el) return

    // Hide first (SSR rendered it visible for SEO/no-JS).
    setEntered(false)

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || armedRef.current) return
        armedRef.current = true
        io.disconnect()
        raf = requestAnimationFrame(() => setEntered(true))
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative overflow-hidden border border-white/[0.06]"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.92)",
          clipPath: entered ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: entered
            ? `opacity ${ENTRANCE_MS}ms ${EASE}, transform ${ENTRANCE_MS}ms ${EASE}, clip-path ${ENTRANCE_MS}ms ${EASE}`
            : "none",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
          priority
        />
      </div>
      <p
        className="mt-4 flex items-center gap-2 text-sm text-white/30"
        style={{
          opacity: entered ? 1 : 0,
          transition: entered
            ? `opacity 400ms ${EASE} ${ENTRANCE_MS}ms`
            : "none",
        }}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
        {caption}
      </p>
    </div>
  )
}
