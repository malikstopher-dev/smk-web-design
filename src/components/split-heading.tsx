"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

/* Deterministic pseudo-random per word so SSR and client agree
   and repeats of the same word animate identically. */
function wordRandom(seed: number, index: number) {
  const x = Math.sin(seed * 97.13 + index * 41.77) * 10000
  return x - Math.floor(x)
}

const EASE = "cubic-bezier(0.2, 1.4, 0.3, 1)"

type WordState = {
  x: number
  y: number
  rotate: number
}

export function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  id,
  style,
}: {
  text: string
  as?: "h1" | "h2" | "h3"
  className?: string
  id?: string
  style?: CSSProperties
}) {
  const [triggered, setTriggered] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? true
      : false,
  )
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || triggered) return
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
  }, [triggered])

  const words = text.split(" ")

  return (
    <Tag className={className} style={style} id={id}>
      {words.map((word, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const y = 70 + wordRandom(1, i) * 50 // 70..120
        const rot = (10 + wordRandom(2, i) * 10) * side // 10..20 toward x
        const hidden: WordState = { x: side * 40, y, rotate: rot }
        const final = triggered
        const transition = final
          ? `opacity 800ms ${EASE} ${i * 55}ms, transform 800ms ${EASE} ${i * 55}ms`
          : "none"
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden
            style={{
              display: "inline-block",
              opacity: final ? 1 : 0,
              transform: final
                ? "none"
                : `translate(${hidden.x}px, ${hidden.y}px) rotate(${hidden.rotate}deg) scale(0.6)`,
              transformOrigin: "center bottom",
              transition,
              willChange: "opacity, transform",
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        )
      })}
    </Tag>
  )
}
