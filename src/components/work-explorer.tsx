"use client"

import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { GlobeMarkers } from "@/components/globe-markers"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"
import type { Project } from "@/lib/projects"
import { useReducedMotion } from "framer-motion"
import styles from "./work-explorer.module.css"

type OrbitStyle = CSSProperties & { "--index": number; "--total": number }

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0")
}

export function WorkExplorer({
  projects,
  locale,
  dict,
}: {
  projects: Project[]
  locale: string
  dict: Dict
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [visible, setVisible] = useState(false)
  const section = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const reduced = useReducedMotion()
  const active = projects[activeIndex] ?? projects[0]
  const total = projects.length
  const activeDescription = useMemo(
    () => (active ? projectDesc(locale, active.slug, active.description) : ""),
    [active, locale],
  )

  useEffect(() => {
    if (!section.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || paused || !autoplay || !visible || total < 2) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      setActiveIndex((current) => (current + 1) % total)
    }, 6800)
    return () => window.clearInterval(timer)
  }, [paused, reduced, total, autoplay, visible])

  if (!active) return null

  const select = (index: number) => {
    setActiveIndex((index + total) % total)
    setAutoplay(false)
  }

  return (
    <section
      ref={section}
      aria-labelledby="work-explorer-heading"
      className={styles.section}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p className="eyebrow">{dict.workPage.explorer.eyebrow}</p>
          <h2 id="work-explorer-heading" className={styles.heading}>{dict.workPage.explorer.title}</h2>
        </div>
        <a className={styles.allLink} href="#all-projects-heading">
          {dict.workPage.explorer.all}
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </a>
      </div>

      <div className={styles.explorerGrid}>
        <div className={styles.orbitColumn}>
          <div className={styles.orbitStage}>
            <div aria-hidden className={styles.orbitLine} />
            <div className={styles.earthFrame}>
              <GlobeMarkers
                className={styles.globe}
                cinematic
                renderWithoutMarkers
              />
              <div className={styles.centerReadout} aria-live={autoplay ? "off" : "polite"}>
                <span>{dict.workPage.explorer.selectedLabel}</span>
                <strong>{padIndex(activeIndex)}</strong>
                <small>/{total}</small>
              </div>
            </div>
            <div className={styles.orbitButtons} role="tablist" aria-label={dict.workPage.filterAria}>
              {projects.map((project, index) => {
                const selected = index === activeIndex
                return (
                  <button
                    key={project.slug}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`project-tab-${index}`}
                    aria-controls="selected-project-preview"
                    tabIndex={selected ? 0 : -1}
                    ref={el => { tabs.current[index] = el }}
                    aria-label={`${padIndex(index)} — ${project.name}`}
                    className={`${styles.orbitButton} ${selected ? styles.orbitButtonActive : ""}`}
                    style={{ "--index": index, "--total": total } as OrbitStyle}
                    onClick={() => select(index)}
                    onKeyDown={event => {
                      const next = event.key === "Home" ? 0 : event.key === "End" ? total - 1 : ["ArrowRight", "ArrowDown"].includes(event.key) ? (index + 1) % total : ["ArrowLeft", "ArrowUp"].includes(event.key) ? (index - 1 + total) % total : null
                      if (next === null) return
                      event.preventDefault(); select(next); tabs.current[next]?.focus()
                    }}
                  >
                    {padIndex(index)}
                  </button>
                )
              })}
            </div>
          </div>
          <p className={styles.instruction}>{dict.workPage.explorer.instruction}</p>
          <div className={styles.orbitControls}>
            {!reduced && <button type="button" onClick={() => setAutoplay(value => !value)} aria-pressed={!autoplay} aria-label={autoplay ? dict.sceneControls.pause : dict.sceneControls.play}>{autoplay ? <Pause aria-hidden size={15} /> : <Play aria-hidden size={15} />}</button>}
            <button type="button" onClick={() => select(activeIndex - 1)} aria-label={dict.workPage.explorer.previous}>
              <ChevronLeft aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => { setActiveIndex(0); setPaused(true) }} aria-label={dict.workPage.explorer.reset}>
              <RotateCcw aria-hidden className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => select(activeIndex + 1)} aria-label={dict.workPage.explorer.next}>
              <ChevronRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>

        <article id="selected-project-preview" role="tabpanel" aria-labelledby={`project-tab-${activeIndex}`} className={styles.preview} aria-live={autoplay ? "off" : "polite"}>
          <div className={styles.previewMeta}>
            <span>{padIndex(activeIndex)} / {String(total).padStart(2, "0")}</span>
            <span>{tagLabel(locale, active.tags[0] ?? active.category)}</span>
          </div>
          <div className={styles.previewMedia}>
            <Image
              key={active.slug}
              src={active.image}
              alt={dict.workPage.cardAlt.replace("{name}", active.name)}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.previewImage}
            />
            <div aria-hidden className={styles.previewShade} />
            {active.url ? (
              <a className={styles.inspectButton} href={active.url} target="_blank" rel="noopener noreferrer">
                {dict.workPage.explorer.inspect}
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </a>
            ) : null}
          </div>
          <div className={styles.previewCopy}>
            <h3>{active.name}</h3>
            <p>{activeDescription}</p>
          </div>
        </article>
      </div>
    </section>
  )
}
