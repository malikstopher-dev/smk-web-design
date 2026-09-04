"use client"

import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   TERMINAL SNIPPET — multi-line typewriter
   Types each line at 28ms/char, 250ms pause between
   lines. Triggered once on scroll into view (threshold
   0.3), never restarts. Reduced motion renders all
   lines instantly.
   ═══════════════════════════════════════════════════════ */

export type TerminalLine = {
  text: string
  checked?: boolean
}

const TYPE_MS = 28
const PAUSE_MS = 250

export function TerminalTypewriter({
  lines,
}: {
  lines: TerminalLine[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  // typed = [lineCount, charCount] — how far the reveal has run.
  const [typed, setTyped] = useState<[number, number]>(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
      : [0, 0],
  )
  const reduced =
    typed[0] === Number.MAX_SAFE_INTEGER

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      let lineIdx = 0
      let charIdx = 0
      const tick = () => {
        const line = lines[lineIdx]
        if (!line) return
        if (charIdx < line.text.length) {
          charIdx += 1
          setTyped([lineIdx + 1, charIdx])
          timer = setTimeout(tick, TYPE_MS)
        } else if (lineIdx < lines.length - 1) {
          // Line finished: keep it fully rendered through the
          // pause by recording completion, then advance.
          setTyped([lineIdx + 1, line.text.length])
          const nextIdx = lineIdx + 1
          timer = setTimeout(() => {
            lineIdx = nextIdx
            charIdx = 0
            setTyped([nextIdx + 1, 0])
            timer = setTimeout(tick, TYPE_MS)
          }, PAUSE_MS)
        }
        // Last line fully typed: stop. Runs once per load.
      }
      timer = setTimeout(tick, TYPE_MS)
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
  }, [])

  const [typedLines, typedChars] = typed
  const instant = reduced

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-white/10 bg-black font-mono text-[13px] leading-relaxed"
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] uppercase tracking-widest text-white/30">
          smk@edge
        </span>
      </div>
      <div className="px-4 py-4">
        {lines.map((line, i) => {
          if (instant) {
            return (
              <div key={i} className="flex h-5 items-center text-[#e8b04b]">
                {line.checked && (
                  <span className="mr-2 shrink-0 text-white/50">✓</span>
                )}
                <span>{line.text}</span>
              </div>
            )
          }
          const currentLineIdx = typedLines - 1
          if (i > currentLineIdx) {
            return <div key={i} className="h-5" aria-hidden />
          }
          const isCurrent = i === currentLineIdx
          const fullLength = line.text.length
          const charsShown = isCurrent ? typedChars : fullLength
          const typing = isCurrent && charsShown < fullLength
          const text = line.text.slice(0, charsShown)
          return (
            <div key={i} className="flex h-5 items-center text-[#e8b04b]">
              {line.checked && (
                <span className="mr-2 shrink-0 text-white/50">✓</span>
              )}
              <span>{text}</span>
              {typing && (
                <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-[#e8b04b]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
