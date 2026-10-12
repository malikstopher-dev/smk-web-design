"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/projects"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"
import styles from "./work-board.module.css"
import { SCENE_MOTION, subscribeScene } from "@/lib/scene-runtime"

// Layout controls placement; transforms only control depth. Text and image
// heights are intrinsic, so translated descriptions cannot collapse the media.
function BoardCard({ project: p, locale, dict }: { project: Project; locale: string; dict: Dict }) {
  const card = useRef<HTMLElement>(null)
  const unsubscribe = useRef<(() => void) | null>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => () => unsubscribe.current?.(), [])

  function settlePointer() {
    if (unsubscribe.current) return
    unsubscribe.current = subscribeScene(s => {
      const el = card.current
      if (!el) return
      const damping = s.reduced ? 1 : 1 - Math.exp(-8 * s.delta)
      current.current.x += (pointer.current.x - current.current.x) * damping
      current.current.y += (pointer.current.y - current.current.y) * damping
      const x = s.reduced ? 0 : current.current.x
      const y = s.reduced ? 0 : current.current.y
      el.style.setProperty("--rx", `${-y * SCENE_MOTION.projectTilt}deg`)
      el.style.setProperty("--ry", `${x * SCENE_MOTION.projectTilt}deg`)
      if (Math.abs(pointer.current.x - x) + Math.abs(pointer.current.y - y) < 0.002 || s.reduced) {
        unsubscribe.current?.()
        unsubscribe.current = null
      }
    })
  }

  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return
    // Measure the untransformed slot to avoid tilt feedback at the card edges.
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2)),
    }
    settlePointer()
  }

  function reset() {
    pointer.current = { x: 0, y: 0 }
    settlePointer()
  }

  const content = <>
    <div className={styles.media}>
      <Image
        src={p.image}
        alt={dict.workPage.cardAlt.replace("{name}", p.name)}
        fill
        sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 144px), 500px"
        className={styles.image}
      />
      {p.url && <span className={styles.visit} aria-hidden="true">
        <ArrowUpRight className="h-3.5 w-3.5" />{dict.viewProject}
      </span>}
    </div>
    <div className={styles.caption}>
      <div className="flex flex-wrap gap-1.5">
        {p.tags.map(tag => <span key={tag} className="border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/65">{tagLabel(locale, tag)}</span>)}
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight text-white">{p.name}</h3>
      <p className="text-sm leading-relaxed text-white/85">{projectDesc(locale, p.slug, p.description)}</p>
    </div>
  </>

  return <div className={styles.slot} onPointerMove={move} onPointerLeave={reset}>
    <article ref={card} data-board-card className={styles.card}>
      {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.link}>{content}</a> : content}
    </article>
  </div>
}

export function WorkBoard({ projects, rotationPool, heading, eyebrow, allLabel, allHref, locale, dict }: {
  projects: Project[]
  rotationPool?: Project[]
  heading: string
  eyebrow: string
  allLabel?: string
  allHref?: string
  locale: string
  dict: Dict
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const [visibleProjects, setVisibleProjects] = useState(() => projects.slice(0, 4))
  const [autoState, setAutoState] = useState<"idle" | "out" | "in">("idle")
  const [paused, setPaused] = useState(false)
  const orderedProjects = useMemo(() => {
    const seen = new Set(projects.map(project => project.slug))
    return [...projects, ...(rotationPool ?? []).filter(project => !seen.has(project.slug))]
  }, [projects, rotationPool])

  useEffect(() => {
    if (orderedProjects.length <= 4 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let inView = false
    let timer = 0
    let settleTimer = 0
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting })
    if (boardRef.current) observer.observe(boardRef.current)

    const tick = () => {
      if (cancelled) return
      if (paused || !inView) {
        timer = window.setTimeout(tick, 1400)
        return
      }
      setAutoState("out")
      timer = window.setTimeout(() => {
        if (cancelled) return
        positionRef.current = (positionRef.current + 4) % orderedProjects.length
        const next = Array.from({ length: Math.min(4, orderedProjects.length) }, (_, index) =>
          orderedProjects[(positionRef.current + index) % orderedProjects.length],
        )
        setVisibleProjects(next)
        setAutoState("in")
        settleTimer = window.setTimeout(() => setAutoState("idle"), 620)
        timer = window.setTimeout(tick, 7600)
      }, 360)
    }

    timer = window.setTimeout(tick, 7600)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.clearTimeout(settleTimer)
      observer.disconnect()
    }
  }, [orderedProjects, paused])

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="tech-label">{eyebrow}</p>
        <h2 id="featured-heading" className="display-lg mt-4 text-white">{heading}</h2>
      </div>
      {allLabel && allHref && <Link href={allHref} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        {allLabel}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>}
    </div>
    <div
      ref={boardRef}
      className={styles.board}
      data-auto-state={autoState}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      {visibleProjects.map((project, index) => <div
        key={project.slug}
        className={styles.placement}
        style={{ "--rest-angle": `${[-2.4, 1.8, -1.2, 2.6][index]}deg` } as CSSProperties}
      ><BoardCard project={project} locale={locale} dict={dict} /></div>)}
    </div>
  </div>
}
