"use client"

import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from "@/lib/projects"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"

const cardClass =
  "group relative flex h-full flex-col overflow-hidden border border-white/15 bg-[#03070f]/70 text-left transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b04b] motion-reduce:transform-none motion-reduce:transition-none"

function CardBody({
  project,
  wide,
  locale,
  dict,
}: {
  project: Project
  wide?: boolean
  locale: string
  dict: Dict
}) {
  return (
    <>
      <div className={`relative overflow-hidden bg-white/[0.03] ${wide ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
        <Image
          src={project.image}
          alt={dict.workPage.cardAlt.replace("{name}", project.name)}
          fill
          sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {project.url && (
          <span aria-hidden className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[#03070f]/85 text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
              {tagLabel(locale, tag)}
            </span>
          ))}
        </div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-white">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-white/70">
          {projectDesc(locale, project.slug, project.description)}
        </p>
        {project.url && (
          <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-white/80">
            {dict.viewLiveSite}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </>
  )
}

export function ProjectCard({
  p,
  wide,
  locale,
  dict,
}: {
  p: Project
  wide?: boolean
  locale: string
  dict: Dict
}) {
  const body = <CardBody project={p} wide={wide} locale={locale} dict={dict} />

  return p.url ? (
    <a href={p.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
    </a>
  ) : (
    <article className={cardClass}>{body}</article>
  )
}

type IndicatorRect = { x: number; y: number; w: number; h: number }

export function FilterableWorkGrid({ locale, dict }: { locale: string; dict: Dict }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all")
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const reduced = useReducedMotion()
  const visible = filter === "all" ? PROJECTS : PROJECTS.filter((project) => project.category === filter)
  const countLine = (count: number) =>
    (count === 1 ? dict.workPage.projectsCount.one : dict.workPage.projectsCount.other).replace("{n}", String(count))

  const measure = () => {
    const button = tabRefs.current.get(filter)
    const container = tabsRef.current
    if (!button || !container) return
    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    setIndicator({
      x: buttonRect.left - containerRect.left,
      y: buttonRect.top - containerRect.top,
      w: buttonRect.width,
      h: buttonRect.height,
    })
  }

  useLayoutEffect(() => {
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div>
      <div ref={tabsRef} role="group" aria-label={dict.workPage.filterAria} className="relative -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {indicator && (
          <motion.span
            aria-hidden
            initial={false}
            animate={{ x: indicator.x, y: indicator.y, width: indicator.w, height: indicator.h }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            className="pointer-events-none absolute left-0 top-0 rounded-full border border-[#e8b04b]/70 bg-[#e8b04b]/15"
          />
        )}
        {PROJECT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={filter === category.id}
            onClick={() => setFilter(category.id)}
            ref={(button) => {
              if (button) tabRefs.current.set(category.id, button)
              else tabRefs.current.delete(category.id)
            }}
            className={`relative z-10 inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8b04b] ${filter === category.id ? "border-transparent font-medium text-white" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"}`}
          >
            {dict.workPage.filters[category.id]}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-white/70">
        {countLine(visible.length)}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} p={project} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  )
}
