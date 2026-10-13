"use client"

import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   CONTACT ENHANCEMENTS — optional typewriter and static lighting.
   The form uses the native cursor and a stationary submit button.
   ═══════════════════════════════════════════════════════ */

/* ── Typewriter lede — 22ms/char, caret persists ── */
export function TypewriterLede({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? text.length
      : 0,
  )

  useEffect(() => {
    const el = ref.current
    if (!el || count >= text.length) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      let i = 0
      const tick = () => {
        if (i >= text.length) return
        i += 1
        setCount(i)
        timer = setTimeout(tick, 22)
      }
      timer = setTimeout(tick, 22)
    }
    // Above the fold → run on load; below → wait for view.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight) {
      start()
      return () => {
        if (timer) clearTimeout(timer)
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          start()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (timer) clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const done = count >= text.length
  return (
    <p
      ref={ref}
      className="mt-6 max-w-2xl text-base leading-relaxed text-white sm:text-lg"
    >
      <span>{text.slice(0, count)}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[1.05em] w-[9px] translate-y-[0.15em] bg-[#e8b04b]"
        style={{ animation: done ? "caretBlink 900ms step-end infinite" : "none" }}
      />
    </p>
  )
}

/* Static gold lighting keeps the contact form responsive while typing. */
export function ContactMesh() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="smk-mesh smk-mesh-a" />
      <div className="smk-mesh smk-mesh-b" />
    </div>
  )
}
