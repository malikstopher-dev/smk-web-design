"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/projects"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"
import { SplitHeading } from "@/components/split-heading"

/* ═══════════════════════════════════════════════════════
   WORK BOARD — scattered, draggable, idle-floating cards
   Fixed per-card values (set once, never re-randomised):
   rotation -3..+3°, top/left %, float phase.
   Idle float: sine y (amp 6px, ~1400ms), cosine x
   (amp 4px, ~1800ms) via rAF. Drag via pointer events.
   Return: 600ms cubic-bezier(0.34, 1.56, 0.64, 1).
   Disabled under 700px width and reduced-motion.
   ═══════════════════════════════════════════════════════ */

const RETURN_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"
const MAX_TILT = 4
const MOBILE_QUERY = "(max-width: 699px)"

type Placed = {
  project: Project
  rotation: number
  top: number // percent of board height
  left: number // percent of board width
  width: number // percent
  height: number // percent of board height
  phase: number
  zIndex: number
  recede: number // 1 front; lower = further back
}

/* Fixed placements — a loose board with a consistent corner
   tuck: each back card slides under its neighbour by roughly
   15-20% of its width, vertical offsets keep the rest clear.
   Card 1 (featured) sits front and fully readable; the back
   cards recede with a slight opacity drop. Heights are fixed
   so the board contains every card — nothing spills. */
const PLACEMENTS: Omit<Placed, "project">[] = [
  { rotation: -2.4, top: 0, left: 3, width: 45, height: 46, phase: 0.0, zIndex: 4, recede: 1 },
  { rotation: 1.8, top: 16, left: 41, width: 42, height: 45, phase: 1.9, zIndex: 3, recede: 0.95 },
  { rotation: -1.2, top: 49, left: 5, width: 40, height: 44, phase: 3.7, zIndex: 2, recede: 0.92 },
  { rotation: 2.6, top: 56, left: 58, width: 42, height: 44, phase: 5.1, zIndex: 1, recede: 0.9 },
]

type DragState = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}

type BoardCardProps = {
  placed: Placed
  index: number
  locale: string
  dict: Dict
  onTop: () => void
}

function BoardCard({
  placed,
  index,
  locale,
  dict,
  onTop,
}: BoardCardProps) {
  const { project: p, rotation, phase } = placed
  const cardRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const returnTimerRef = useRef<number | null>(null)
  const floatingRef = useRef(true)

  const [entered, setEntered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_QUERY)
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => {
      setIsMobile(mobileMq.matches)
      setReduced(reduceMq.matches)
    }
    apply()
    mobileMq.addEventListener("change", apply)
    reduceMq.addEventListener("change", apply)
    return () => {
      mobileMq.removeEventListener("change", apply)
      reduceMq.removeEventListener("change", apply)
    }
  }, [])

  /* Entrance: opacity 0→1, translateY 60→0, staggered by index.
     Reduced-motion users see the final state immediately. */
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (reduced) return
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
  }, [reduced])

  const composeTransform = useCallback(
    (opts: {
      x?: number
      y?: number
      scale?: number
      tiltX?: number
      tiltY?: number
    }) => {
      const { x = 0, y = 0, scale = 1, tiltX = 0, tiltY = 0 } = opts
      return `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`
    },
    [rotation],
  )

  /* Idle float loop — one rAF per card, only while floating. */
  useEffect(() => {
    if (isMobile || reduced || !entered) return
    let raf = 0
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const el = cardRef.current
      if (!el) return
      if (dragRef.current || !floatingRef.current) return
      const elapsed = t / 1000
      const y = Math.sin(elapsed * ((2 * Math.PI) / 1.4) + phase) * 6
      const x = Math.cos(elapsed * ((2 * Math.PI) / 1.8) + phase) * 4
      el.style.transform = composeTransform({ x, y })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isMobile, reduced, entered, phase, composeTransform])

  function onPointerLeave() {
    const el = cardRef.current
    if (!el || dragRef.current) return
    if (!floatingRef.current) return
    el.style.transform = composeTransform({})
  }

  /* ── Drag ── */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (isMobile || reduced) return
    if (e.button !== 0 && e.pointerType === "mouse") return
    const el = cardRef.current
    if (!el) return
    // Freeze at the current visual position: drag starts exactly
    // where the card is, no jump.
    const r = el.getBoundingClientRect()
    const base = el.parentElement?.getBoundingClientRect()
    if (!base) return
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: r.left - base.left,
      originY: r.top - base.top,
    }
    floatingRef.current = false
    if (returnTimerRef.current !== null) {
      clearTimeout(returnTimerRef.current)
      returnTimerRef.current = null
    }
    setDragging(true)
    onTop()
    el.setPointerCapture(e.pointerId)
    el.style.transition = "none"
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    const el = cardRef.current
    if (!drag || !el) return
    if (e.pointerId !== drag.pointerId) return
    dragRef.current = null
    setDragging(false)
    // Where the card visually sits right now, in board coords.
    const r = el.getBoundingClientRect()
    const base = el.parentElement?.getBoundingClientRect()
    const dropX = base ? r.left - base.left : drag.originX
    const dropY = base ? r.top - base.top : drag.originY
    // Walk home: 600ms overshoot bounce to the board origin.
    el.style.transition = "none"
    el.style.transform = `translate3d(${dropX}px, ${dropY}px, 0) rotate(${rotation}deg) scale(1.03)`
    requestAnimationFrame(() => {
      el.style.transition = `transform 600ms ${RETURN_EASE}`
      el.style.transform = `translate3d(${drag.originX}px, ${drag.originY}px, 0) rotate(${rotation}deg) scale(1)`
    })
    returnTimerRef.current = window.setTimeout(() => {
      returnTimerRef.current = null
      floatingRef.current = true
    }, 600)
  }

  /* Tilt follows cursor when not dragging; drag follows pointer
     when dragging. One handler for both. */
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current
    if (!el || isMobile || reduced) return
    const drag = dragRef.current
    if (drag) {
      if (e.pointerId !== drag.pointerId) return
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      el.style.transform = `translate3d(${drag.originX + dx}px, ${drag.originY + dy}px, 0) rotate(${rotation}deg) scale(1.03)`
      return
    }
    if (!floatingRef.current) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    const elapsed = performance.now() / 1000
    const fy = Math.sin(elapsed * ((2 * Math.PI) / 1.4) + phase) * 6
    const fx = Math.cos(elapsed * ((2 * Math.PI) / 1.8) + phase) * 4
    el.style.transform = composeTransform({
      x: fx,
      y: fy,
      tiltX: -py * MAX_TILT * 2,
      tiltY: px * MAX_TILT * 2,
    })
  }

  useEffect(() => {
    return () => {
      if (returnTimerRef.current !== null) {
        clearTimeout(returnTimerRef.current)
      }
    }
  }, [])

  const interactive = !isMobile && !reduced

  return (
    <div
      ref={cardRef}
      data-board-card
      onPointerDown={interactive ? onPointerDown : undefined}
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerUp={interactive ? endDrag : undefined}
      onPointerCancel={interactive ? endDrag : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
      style={{
        position: isMobile ? "relative" : "absolute",
        top: isMobile ? undefined : `${placed.top}%`,
        left: isMobile ? undefined : `${placed.left}%`,
        width: isMobile ? "100%" : `${placed.width}%`,
        height: isMobile ? undefined : `${placed.height}%`,
        zIndex: isMobile ? undefined : dragging ? 50 : placed.zIndex,
        transform: !entered
          ? `${composeTransform({ y: 60 })}`
          : interactive
            ? undefined
            : composeTransform({}),
        opacity: entered ? placed.recede : 0,
        transition: entered
          ? undefined
          : `opacity 650ms cubic-bezier(0.2, 1.4, 0.3, 1) ${index * 110}ms, transform 650ms cubic-bezier(0.2, 1.4, 0.3, 1) ${index * 110}ms`,
        transformStyle: "preserve-3d",
        // Only block native touch when drag is actually active
        // (desktop/fine-pointer). Mobile cards must scroll normally.
        touchAction: interactive ? "none" : "auto",
      }}
      className={`group relative flex flex-col overflow-hidden border border-white/[0.06] bg-[#03070f]/60 text-left will-change-transform hover:border-white/[0.15] ${dragging ? "cursor-grabbing" : interactive ? "cursor-grab" : ""}`}
    >
      <div className={`relative overflow-hidden bg-white/[0.03] ${isMobile ? "aspect-[16/10]" : "min-h-0 flex-1"}`}>
        <Image
          src={p.image}
          alt={dict.workPage.cardAlt.replace("{name}", p.name)}
          fill
          sizes="(max-width: 699px) 100vw, 46vw"
          className="object-cover"
        />
      </div>
      <div className="flex shrink-0 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/40"
            >
              {tagLabel(locale, t)}
            </span>
          ))}
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-white">
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {p.name}
            </a>
          ) : (
            p.name
          )}
        </h3>
        <p className="text-sm leading-relaxed text-white">
          {projectDesc(locale, p.slug, p.description)}
        </p>
      </div>
      {interactive && p.url && (
        <span className="pointer-events-none absolute right-3 top-3 inline-flex translate-y-[6px] items-center gap-1.5 border border-white/15 bg-[#03070f]/80 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-3 w-3" />
          {dict.viewProject}
        </span>
      )}
    </div>
  )
}

export function WorkBoard({
  projects,
  heading,
  eyebrow,
  allLabel,
  allHref,
  locale,
  dict,
}: {
  projects: Project[]
  heading: string
  eyebrow: string
  allLabel?: string
  allHref?: string
  locale: string
  dict: Dict
}) {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const topZRef = useRef(10)

  const onTop = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    topZRef.current += 1
    Array.from(board.querySelectorAll<HTMLElement>("[data-board-card]")).forEach(
      (el, i) => {
        el.style.zIndex = String(topZRef.current - i)
      },
    )
  }, [])

  const placed: Placed[] = projects.slice(0, 4).map((project, i) => ({
    ...PLACEMENTS[i % PLACEMENTS.length],
    project,
  }))

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="tech-label">{eyebrow}</p>
          <SplitHeading
            id="featured-heading"
            as="h2"
            className="display-lg mt-4 text-white"
            text={heading}
          />
        </div>
        {allLabel && allHref && (
          <a
            href={allHref}
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline sm:inline-flex"
          >
            {allLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <div
        ref={boardRef}
        className="relative mt-12 md:min-h-[620px]"
      >
        {placed.map((placedCard, i) => (
          <BoardCard
            key={placedCard.project.slug}
            placed={placedCard}
            index={i}
            locale={locale}
            dict={dict}
            onTop={onTop}
          />
        ))}
      </div>
    </div>
  )
}
