"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { PROJECTS, type Project } from "@/lib/projects"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"

export function ProjectCard({
  p,
  wide,
  locale = "en",
  dict,
}: {
  p: Project
  wide?: boolean
  locale?: string
  dict?: Dict
}) {
  return (
    <article className="group">
      <div className={`relative overflow-hidden bg-white/5 ${wide ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
        <Image
          src={p.image}
          alt={dict?.workPage.cardAlt.replace("{name}", p.name) ?? p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {p.tags.length > 0 && (
            <ul className="mb-2 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="text-[11px] uppercase tracking-[0.12em] text-gray-500"
                >
                  {tagLabel(locale, t)}
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-base font-medium text-white sm:text-lg">
            {p.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
            {projectDesc(locale, p.slug, p.description)}
          </p>
        </div>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} — open live site`}
            className="shrink-0 text-gray-500 transition-colors hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  )
}

export function FilterableWorkGrid({ dict }: { dict: Dict }) {
  const [filter, setFilter] = useState<string>("all")
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(
    null,
  )

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLButtonElement>(
      `[data-filter="${filter}"]`,
    )
    const cont = tabsRef.current
    if (!el || !cont) return
    const er = el.getBoundingClientRect()
    const cr = cont.getBoundingClientRect()
    setIndicator({ x: er.left - cr.left, w: er.width })
  }, [filter])

  const visible =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
  const categories: { id: string; label: string }[] = [
    { id: "all", label: dict.workPage.filters.all },
    { id: "restaurant", label: dict.workPage.filters.restaurant },
    { id: "business", label: dict.workPage.filters.business },
    { id: "construction", label: dict.workPage.filters.construction },
    { id: "ecommerce", label: dict.workPage.filters.ecommerce },
    { id: "travel", label: dict.workPage.filters.travel },
    { id: "webapp", label: dict.workPage.filters.webapp },
  ]

  return (
    <div>
      <div
        ref={tabsRef}
        role="tablist"
        aria-label={dict.workPage.filterAria}
        className="relative flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 pb-3"
      >
        {indicator && (
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-px bg-white transition-all duration-300"
            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
          />
        )}
        {categories.map((c) => {
          const active = filter === c.id
          return (
            <button
              key={c.id}
              data-filter={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(c.id)}
              className={`text-sm transition-colors ${
                active ? "text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          )
        })}
        <span aria-live="polite" className="sr-only">
          {filter === "all"
            ? dict.workPage.projectsCount.other.replace("{n}", String(visible.length))
            : dict.workPage.projectsCount.other.replace("{n}", String(visible.length))}
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {filter === "all"
          ? dict.workPage.projectsCount.other.replace("{n}", String(visible.length))
          : dict.workPage.projectsCount.other.replace("{n}", String(visible.length))}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-[var(--gutter)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={`${filter}-${p.name}`} p={p} />
        ))}
      </div>
    </div>
  )
}
