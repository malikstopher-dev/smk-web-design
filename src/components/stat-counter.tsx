"use client"

import { useEffect, useRef, useState } from "react"

function parseValue(value: string) {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/)
  if (!m) return null
  const num = Number.parseInt(m[2].replace(/,/g, ""), 10)
  if (Number.isNaN(num)) return null
  return { prefix: m[1], digits: m[2], suffix: m[3], num }
}

export function StatCounter({
  value,
  className = "",
}: {
  value: string
  className?: string
}) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const parsed = parseValue(value)
    if (!parsed) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const el = ref.current
    if (!el || reduce) return

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        const DURATION = 700
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(
            `${parsed.prefix}${Math.round(eased * parsed.num).toLocaleString("en-US")}${parsed.suffix}`,
          )
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
