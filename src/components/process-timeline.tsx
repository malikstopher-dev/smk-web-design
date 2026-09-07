"use client"

import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   PROCESS TIMELINE — vertical line draws with scroll,
   gold nodes light up, step content slides in from the
   right. Each step enters when it actually reaches the
   viewport (IntersectionObserver, threshold 0.2 — same
   as the rest of this page), not when the line passes a
   fraction of total height. Reduced motion: full line,
   lit nodes, content in place immediately.
   ═══════════════════════════════════════════════════════ */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"

export function ProcessTimeline({
  steps,
}: {
  steps: { title: string; body: string }[]
}) {
  const lineRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  /* SSR, no-JS, and reduced motion all render the finished
     state: full line, lit nodes, content visible. Motion-OK
     clients arm the reveal once after mount. */
  const [reduced, setReduced] = useState(false)
  const [progress, setProgress] = useState(1)
  const [active, setActive] = useState<boolean[]>(() =>
    steps.map(() => true),
  )

  /* Post-mount: decide once whether to animate. */
  useEffect(() => {
    const sync = () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      setReduced(prefersReduced)
      if (prefersReduced) return
      // Motion-OK: start hidden, reveal on scroll.
      setProgress(0)
      setActive(steps.map(() => false))
    }
    sync()
  }, [steps])

  /* Line draw, tied to scroll progress through the list. */
  useEffect(() => {
    if (reduced) return
    const line = lineRef.current
    if (!line) return

    const onScroll = () => {
      const r = line.getBoundingClientRect()
      const vh = window.innerHeight
      // Draw as the timeline's own height passes 75% viewport.
      const drawn = Math.min(
        1,
        Math.max(0, (vh * 0.75 - r.top) / r.height),
      )
      setProgress(drawn)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [reduced])

  /* Steps enter when they reach the viewport — the same
     IO pattern and threshold used by the rest of the page. */
  useEffect(() => {
    if (reduced) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = stepRefs.current.indexOf(
            entry.target as HTMLLIElement,
          )
          if (index === -1) return
          io.unobserve(entry.target)
          setActive((prev) => {
            if (prev[index]) return prev
            const next = [...prev]
            next[index] = true
            return next
          })
        })
      },
      { threshold: 0.2 },
    )
    stepRefs.current.forEach((step) => {
      if (step) io.observe(step)
    })
    return () => io.disconnect()
  }, [reduced])

  const animate = !reduced

  return (
    <div className="relative mt-8 pl-10 sm:pl-14">
      {/* Track */}
      <div
        aria-hidden
        className="absolute bottom-0 left-[9px] top-0 w-px bg-white/[0.07] sm:left-[15px]"
      />
      {/* Drawn line */}
      <div
        aria-hidden
        ref={lineRef}
        className="absolute bottom-0 left-[9px] top-0 w-px origin-top bg-[#e8b04b]/70 sm:left-[15px]"
        style={{
          transform: `scaleY(${animate ? progress : 1})`,
          transition: "transform 120ms linear",
        }}
      />
      <ol className="space-y-10">
        {steps.map((step, i) => {
          const lit = active[i]
          return (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className="relative"
            >
              {/* Node */}
              <span
                aria-hidden
                className="absolute -left-10 top-0 flex h-[19px] w-[19px] items-center justify-center rounded-full border bg-[#03070f] sm:-left-14"
                style={{
                  borderColor: lit || !animate ? "#e8b04b" : "rgba(255,255,255,0.15)",
                  transition: "border-color 400ms ease, transform 400ms ease",
                  transform: lit || !animate ? "scale(1.25)" : "scale(1)",
                }}
              >
                <span
                  className="h-[7px] w-[7px] rounded-full"
                  style={{
                    background: lit || !animate ? "#e8b04b" : "rgba(255,255,255,0.2)",
                    transition: "background 400ms ease",
                  }}
                />
              </span>
              <div
                style={
                  animate
                    ? {
                        opacity: lit ? 1 : 0,
                        transform: lit ? "none" : "translateX(24px)",
                        transition: lit
                          ? `opacity 500ms ${EASE}, transform 500ms ${EASE}`
                          : "none",
                      }
                    : undefined
                }
              >
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white">
                  {step.body}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
