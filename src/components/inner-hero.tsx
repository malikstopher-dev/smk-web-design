"use client"

import dynamic from "next/dynamic"
import { useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Centerpiece } from "@/components/centerpiece"
import type { InnerHeroSceneName } from "@/components/inner-hero-scene"

const InteractiveHeroScene = dynamic(
  () =>
    import("@/components/inner-hero-scene").then(
      (module) => module.InnerHeroScene,
    ),
  { ssr: false },
)

/* ═══════════════════════════════════════════════════════
   INNER HERO — shared template for all five inner pages
   One component, five routes. Eyebrow (pulsing gold dot)
   fades in first, then the heading tumbles in word by
   word in 3D (translateZ -300..-500px, rotateX 60..90deg,
   rotateY ±20deg alternating), then subtext rises in.
   After settling, the whole heading mouse-parallaxes ±3deg
   within the hero. Reduced motion: final state, no 3D.
   ═══════════════════════════════════════════════════════ */

const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const ENTER_MS = 900
const STAGGER_MS = 60
const EYEBROW_LEAD_MS = 150
const SUBTEXT_MS = 500

/* Deterministic per-word randoms — SSR and client agree. */
function wordRand(seed: number, i: number) {
  const x = Math.sin(seed * 97.13 + i * 41.77) * 10000
  return x - Math.floor(x)
}

export function InnerHero({
  eyebrow,
  heading,
  subtext,
  id,
  centerpiece,
  scene,
}: {
  eyebrow: string
  heading: string
  subtext: string
  id?: string
  centerpiece?: "globe-africa" | "gear-cluster" | "network" | "growth" | "signal"
  scene?: InnerHeroSceneName
}) {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion() ?? false
  const [isDesktop, setIsDesktop] = useState(false)
  const [triggered, setTriggered] = useState(false)

  /* One centerpiece, one breakpoint — the desktop and mobile
     wrappers never mount together, so only one canvas and
     shape module exist at a time. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const apply = () => setIsDesktop(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  /* Entrance observer — same pattern as SplitHeading. */
  useEffect(() => {
    const el = headingRef.current
    if (!el || triggered || reduced) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTriggered(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, triggered])

  /* Settle detection: entrance is done when the last word has
     finished. Only then does the parallax arm. */
  const words = heading.split(" ")
  const entranceEndsMs =
    EYEBROW_LEAD_MS + words.length * STAGGER_MS + ENTER_MS

  /* Mouse parallax on the settled heading — spring back on leave.
     Arms only after the entrance animation has fully completed. */
  useEffect(() => {
    if (reduced || !triggered || scene) return
    const hero = heroRef.current
    const heading = headingRef.current
    if (!hero || !heading) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let armed = false

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!armed) return
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      heading.style.transform = `rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg)`
    }
    const onMove = (e: PointerEvent) => {
      if (!armed) return
      const r = hero.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      tx = px * 6 // max ±3deg
      ty = -py * 6
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }

    const armTimer = window.setTimeout(() => {
      armed = true
    }, entranceEndsMs)

    hero.addEventListener("pointermove", onMove, { passive: true })
    hero.addEventListener("pointerleave", onLeave, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(armTimer)
      hero.removeEventListener("pointermove", onMove)
      hero.removeEventListener("pointerleave", onLeave)
    }
  }, [reduced, triggered, entranceEndsMs, scene])

  const wordStyle = (i: number): CSSProperties => {
    const side = i % 2 === 0 ? -1 : 1
    const z = -(300 + wordRand(3, i) * 200) // -300..-500
    const rx = 60 + wordRand(4, i) * 30 // 60..90
    const ry = side * (wordRand(5, i) * 40) // ±20
    const done = triggered || reduced
    return {
      display: "inline-block",
      opacity: done ? 1 : 0,
      transform: done
        ? "none"
        : `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
      transformOrigin: "center center",
      transition: done
        ? `opacity ${ENTER_MS}ms ${ENTER_EASE} ${EYEBROW_LEAD_MS + i * STAGGER_MS}ms, transform ${ENTER_MS}ms ${ENTER_EASE} ${EYEBROW_LEAD_MS + i * STAGGER_MS}ms`
        : "none",
      willChange: "opacity, transform",
    }
  }

  const eyebrowDelay = 0
  const subtextDelay = EYEBROW_LEAD_MS + words.length * STAGGER_MS + 240
  const showAll = triggered || reduced

  return (
    <div
      ref={heroRef}
      className="relative isolate overflow-hidden"
    >
      {scene && <InteractiveHeroScene scene={scene} />}
      <div
        className={`relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-28 sm:px-10 sm:pt-36 ${
          scene ? "pointer-events-none" : ""
        }`}
      >
      {/* Centerpiece — dot-stipple object behind the heading,
          legibility shielded by a radial dark gradient. */}
      {centerpiece && !scene && isDesktop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Centerpiece shape={centerpiece} className="max-w-[26rem]" />
          </div>
          {/* Gradient shield on the text side */}
          <div
            className="absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, #03070f 0%, rgba(3, 7, 15, 0.75) 55%, transparent 100%)",
            }}
          />
        </div>
      )}
      {/* Mobile: smaller, faint, centered behind text — mounted
          only below md so the desktop canvas never coexists. */}
      {centerpiece && !scene && !isDesktop && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 md:hidden"
        >
          <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2">
            <Centerpiece shape={centerpiece} />
          </div>
        </div>
      )}

      {/* Eyebrow — pulsing gold dot + label, first in */}
      <p
        className="relative flex items-center gap-2.5"
        style={{
          opacity: showAll ? 1 : 0,
          transition: showAll ? `opacity 400ms ${ENTER_EASE} ${eyebrowDelay}ms` : "none",
        }}
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8b04b] motion-reduce:animate-none"
          style={{ animationDuration: "2.4s" }}
        />
        <span className="tech-label">{eyebrow}</span>
      </p>

      {/* Heading — 3D tumble inside a perspective wrapper.
          The parallax transforms an inner layer so the
          perspective on the wrapper is never replaced. */}
      <div style={{ perspective: "1200px" }}>
        <h1
          ref={headingRef}
          id={id}
          className="display-lg relative mt-5 max-w-3xl text-white"
          style={{ transformStyle: "preserve-3d" }}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} aria-hidden style={wordStyle(i)}>
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h1>
      </div>
      <span className="sr-only">{heading}</span>

      {/* Subtext — fades and rises after the heading completes */}
      <p
        className="relative mt-6 max-w-2xl text-base leading-relaxed text-white sm:text-lg"
        style={{
          opacity: showAll ? 1 : 0,
          transform: showAll ? "none" : "translateY(16px)",
          transition: showAll
            ? `opacity ${SUBTEXT_MS}ms ${ENTER_EASE} ${subtextDelay}ms, transform ${SUBTEXT_MS}ms ${ENTER_EASE} ${subtextDelay}ms`
            : "none",
        }}
      >
        {subtext}
      </p>
      </div>
    </div>
  )
}
