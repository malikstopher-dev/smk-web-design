"use client"

import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   CONTACT ENHANCEMENTS — typewriter lede, custom cursor,
   drifting gold gradient mesh. All contact-page-only.
   Reduced motion: instant text, default cursor, static mesh.
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

/* ── Custom cursor — 10px gold dot, ring on interactive ── */
export function ContactCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const dot = dotRef.current
    if (!dot) return

    document.documentElement.classList.add("smk-cursor-on")
    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty

    const loop = () => {
      raf = requestAnimationFrame(loop)
      cx += (tx - cx) * 0.3
      cy += (ty - cy) * 0.3
      dot.style.left = `${cx}px`
      dot.style.top = `${cy}px`
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const interactive = t.closest(
        "a, button, input, select, textarea, label, [role='button']",
      )
      dot.classList.toggle("smk-cursor-ring", Boolean(interactive))
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      document.documentElement.classList.remove("smk-cursor-on")
    }
  }, [])

  return <div ref={dotRef} aria-hidden className="smk-cursor-dot" />
}

/* ── Drifting gold mesh — two radial gradients, 14s loop ── */
export function ContactMesh() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="smk-mesh smk-mesh-a" />
      <div className="smk-mesh smk-mesh-b" />
    </div>
  )
}

/* ── Magnetic CTA — 0.25x/0.4x cursor pull, gold fill wipe ── */
export function MagneticCta({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
    }
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      // x at 0.25 of distance, y at 0.4 — per spec.
      tx = dx * 0.25
      ty = dy * 0.4
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    btn.addEventListener("pointermove", onMove, { passive: true })
    btn.addEventListener("pointerleave", onLeave, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      btn.removeEventListener("pointermove", onMove)
      btn.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <button
      ref={btnRef}
      className={`smk-magnetic-cta group relative overflow-hidden ${className}`}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[#e8b04b] transition-transform duration-300 ease-out [transform:translateX(-101%)] group-hover:[transform:translateX(0)] motion-reduce:transition-none"
      />
      <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[#03070f]">
        {children}
      </span>
    </button>
  )
}
