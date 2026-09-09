"use client"

import dynamic from "next/dynamic"
import { useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { InnerHeroSceneName } from "@/components/inner-hero-scene"

const InteractiveHeroScene = dynamic(
  () =>
    import("@/components/inner-hero-scene").then(
      (module) => module.InnerHeroScene,
    ),
  { ssr: false },
)

/* ═══════════════════════════════════════════════════════
   INNER HERO — shared template for all five inner pages.
   Eyebrow (pulsing gold dot) fades in first, then the
   heading types out character by character (34ms/char)
   with the Contact-page gold caret (900ms step-end
   blink). The caret vanishes ~1.5s after the last
   character; only then does the subtext rise in, and the
   hero scene mounts — so no heavy WebGL initialisation
   ever runs inside the typing window. Reduced motion:
   full text everywhere, no caret, no retype on re-entry.
   The h1 keeps its full text for SSR, SEO, and screen
   readers; the typed layer is purely visual.
   ═══════════════════════════════════════════════════════ */

const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const TYPE_MS = 34
const EYEBROW_LEAD_MS = 150
const SUBTEXT_MS = 500
const CARET_LINGER_MS = 1500

export function InnerHero({
  eyebrow,
  heading,
  subtext,
  id,
  scene,
}: {
  eyebrow: string
  heading: string
  subtext: string
  id?: string
  scene?: InnerHeroSceneName
}) {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion() ?? false
  /* 0 → nothing typed; 1..len → typing; len+1 → caret gone
     (final settle). SSR and reduced motion jump to len+1. */
  const [typed, setTyped] = useState(heading.length + 1)
  const typedRef = useRef(typed)
  typedRef.current = typed
  /* The eyebrow fades in the moment the hero enters view;
     typing begins EYEBROW_LEAD_MS after it. */
  const [armed, setArmed] = useState(false)

  /* Motion-OK clients start from zero after mount so the
     SSR text never flashes before the reveal. The typewriter
     effect reads the reset through typedRef, so it does not
     depend on the changing `typed` value itself. */
  useEffect(() => {
    const sync = () => {
      if (!reduced) setTyped(0)
    }
    sync()
  }, [reduced])

  /* Typewriter — IO threshold 0.2 (the page standard), one
     shot. The whole schedule (eyebrow lead → char ticks →
     caret fade) is owned by this effect. */
  useEffect(() => {
    if (reduced) return
    const el = headingRef.current
    if (!el) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const total = heading.length

    const finish = () => {
      timer = setTimeout(() => {
        if (!cancelled) setTyped(total + 1)
      }, CARET_LINGER_MS)
    }
    const tick = (count: number) => {
      if (cancelled) return
      const next = count + 1
      typedRef.current = next
      setTyped(next)
      if (next < total) {
        timer = setTimeout(() => tick(next), TYPE_MS)
      } else {
        finish()
      }
    }

    const start = () => {
      setArmed(true)
      // If a reset to zero has not landed yet, wait for it;
      // the reveal always begins from a blank line.
      timer = setTimeout(function arm() {
        if (cancelled) return
        if (typedRef.current === 0) {
          tick(0)
          return
        }
        // SSR value still showing — wait one more frame.
        timer = setTimeout(arm, 50)
      }, EYEBROW_LEAD_MS)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        start()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [reduced, heading])

  /* showAll gates the eyebrow only. The subtext now waits
     for the caret to fully vanish (typed > heading.length)
     — an actual completion state, not a clock — so a slow
     type or a stalled frame can never leak it early. */
  const showAll = armed || reduced
  const typing = typed > 0 && typed <= heading.length
  const caretFading = typed === heading.length
  const settled = typed > heading.length
  /* The hero scene mounts only after the caret is gone:
     three.js eval, particle build, and shader compile are
     heavy main-thread work that would otherwise stall the
     typewriter mid-sentence. */
  const sceneReady = settled || reduced

  /* Belt-and-suspenders: if sceneReady is true but the scene
     DOM element is absent 1s later (e.g. React concurrent
     render bailed after a main-thread stall), force a
     re-render to mount it. */
  useEffect(() => {
    if (!sceneReady || !scene) return
    const id = setTimeout(() => {
      if (!document.querySelector('[data-hero-scene]')) {
        setTyped((t) => t) // force re-render
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [sceneReady, scene])

  /* Mouse parallax on the settled heading — arms only once
     the caret has fully faded. */
  useEffect(() => {
    if (reduced || !settled || scene) return
    const hero = heroRef.current
    const heading = headingRef.current
    if (!hero || !heading) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const loop = () => {
      raf = requestAnimationFrame(loop)
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      heading.style.transform = `rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg)`
    }
    const onMove = (e: PointerEvent) => {
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

    hero.addEventListener("pointermove", onMove, { passive: true })
    hero.addEventListener("pointerleave", onLeave, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      hero.removeEventListener("pointermove", onMove)
      hero.removeEventListener("pointerleave", onLeave)
    }
  }, [reduced, settled, scene])

  return (
    <div
      ref={heroRef}
      className="relative isolate"
    >
      {scene && sceneReady && <InteractiveHeroScene scene={scene} />}
      <div
        className={`relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-28 sm:px-10 sm:pt-36 ${
          scene ? "pointer-events-none" : ""
        }`}
      >
      {/* Eyebrow — pulsing gold dot + label, first in */}
      <p
        className="relative flex items-center gap-2.5"
        style={{
          opacity: showAll ? 1 : 0,
          transition: showAll ? `opacity 400ms ${ENTER_EASE}` : "none",
        }}
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8b04b] motion-reduce:animate-none"
          style={{ animationDuration: "2.4s" }}
        />
        <span className="tech-label">{eyebrow}</span>
      </p>

      {/* Heading — the full text stays in the h1 (and the
          accessibility tree via sr-only during the reveal)
          for SEO, screen readers, SSR, and reduced motion.
          The typed layer is purely visual and covers it
          until the reveal completes. */}
      <h1
        ref={headingRef}
        id={id}
        className="display-lg relative mt-5 max-w-3xl text-white"
      >
        <span
          className={!reduced && !settled ? "sr-only" : undefined}
        >
          {heading}
        </span>
        {!reduced && !settled && (
          <span
            aria-hidden
            className="absolute inset-0 whitespace-pre-wrap"
          >
            {heading.slice(0, typed)}
            <span
              className="ml-0.5 inline-block h-[1.05em] w-[9px] translate-y-[0.15em] bg-[#e8b04b]"
              style={{
                animation: "caretBlink 900ms step-end infinite",
                opacity: typing || caretFading ? 1 : 0,
                transition: "opacity 500ms ease",
              }}
            />
          </span>
        )}
      </h1>

      {/* Subtext — waits for the caret to fully vanish
          (the completion state), then fades and rises. */}
      <p
        className="relative mt-6 max-w-2xl text-base leading-relaxed text-white sm:text-lg"
        style={{
          opacity: settled ? 1 : 0,
          transform: settled ? "none" : "translateY(16px)",
          transition: settled
            ? `opacity ${SUBTEXT_MS}ms ${ENTER_EASE}, transform ${SUBTEXT_MS}ms ${ENTER_EASE}`
            : "none",
        }}
      >
        {subtext}
      </p>
      </div>
    </div>
  )
}
