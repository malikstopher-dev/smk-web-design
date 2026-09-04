"use client"

import Image from "next/image"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import {
  PROJECTS,
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from "@/lib/projects"
import { projectDesc, tagLabel } from "@/i18n"
import type { Dict } from "@/i18n/types"

const cardCls =
  "group relative flex h-full flex-col overflow-hidden border border-white/[0.06] bg-[#03070f]/60 text-left transition-colors duration-300 hover:border-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"

function CardBody({
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
  return (
    <>
      <div className={`depth-card-media relative overflow-hidden bg-white/[0.03] ${wide ? "aspect-[21/9]" : "aspect-[16/9]"}`}>
        <Image
          src={p.image}
          alt={dict.workPage.cardAlt.replace("{name}", p.name)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="depth-card-content flex flex-1 flex-col gap-2 p-5">
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
          {p.name}
        </h3>
        <p className="text-sm leading-relaxed text-white/40">
          {projectDesc(locale, p.slug, p.description)}
        </p>
        {p.url && (
          <span className="mt-auto pt-3 text-sm font-medium text-white/60 underline-offset-4 transition-colors group-hover:text-white group-hover:underline">
            {dict.viewLiveSite}
            <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  )
}

const MAX_TILT = 5

const HOVER_QUERY = "(hover: hover) and (pointer: fine)"

function subscribeHover(onChange: () => void) {
  const mq = window.matchMedia(HOVER_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
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
  const ref = useRef<HTMLElement | null>(null)
  const hoverable = useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false,
  )
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 16, mass: 0.5 })
  const sry = useSpring(ry, { stiffness: 180, damping: 16, mass: 0.5 })

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current
    if (!el || !hoverable || reduce) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--sx", `${e.clientX - r.left}px`)
    el.style.setProperty("--sy", `${e.clientY - r.top}px`)
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * MAX_TILT * 2)
    rx.set(-py * MAX_TILT * 2)
  }

  function onMouseLeave() {
    rx.set(0)
    ry.set(0)
  }

  const interactionProps = {
    ref: (el: HTMLElement | null) => {
      ref.current = el
    },
    onMouseMove,
    onMouseLeave,
    style: { transformPerspective: 900, rotateX: srx, rotateY: sry },
  }

  const hoverProps =
    hoverable && !reduce
      ? {
          whileHover: { scale: 1.03, y: -4 },
          whileTap: { scale: 0.99 },
        }
      : {}

  if (p.url) {
    return (
      <motion.a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`spotlight-card depth-card ${cardCls}`}
        {...interactionProps}
        {...hoverProps}
      >
        <CardBody p={p} wide={wide} locale={locale} dict={dict} />
      </motion.a>
    )
  }
  return (
    <motion.div
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`spotlight-card depth-card ${cardCls}`}
      {...interactionProps}
      {...hoverProps}
    >
      <CardBody p={p} wide={wide} locale={locale} dict={dict} />
    </motion.div>
  )
}

interface IndicatorRect {
  x: number
  y: number
  w: number
  h: number
}

export function FilterableWorkGrid({
  locale,
  dict,
}: {
  locale: string
  dict: Dict
}) {
  const countLine = (n: number) =>
    n === 1
      ? dict.workPage.projectsCount.one.replace("{n}", String(n))
      : dict.workPage.projectsCount.other.replace("{n}", String(n))
  const [filter, setFilter] = useState<ProjectCategory | "all">("all")
  const [activeDot, setActiveDot] = useState(0)
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const reduce = useReducedMotion()
  const visible =
    filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  const measure = () => {
    const el = tabRefs.current.get(filter)
    const cont = tabsRef.current
    if (!el || !cont) return
    const er = el.getBoundingClientRect()
    const cr = cont.getBoundingClientRect()
    setIndicator({ x: er.left - cr.left, y: er.top - cr.top, w: er.width, h: er.height })
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

  function onRailScroll() {
    const el = railRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    const max = el.scrollWidth - el.clientWidth
    const idx = Math.round((el.scrollLeft / max) * (visible.length - 1))
    setActiveDot(Math.min(visible.length - 1, Math.max(0, idx)))
  }

  return (
    <div>
      <div
        ref={tabsRef}
        role="tablist"
        aria-label={dict.workPage.filterAria}
        className="relative -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {indicator && (
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              x: indicator.x,
              y: indicator.y,
              width: indicator.w,
              height: indicator.h,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 34 }
            }
            className="absolute left-0 top-0 bg-white/90 will-change-transform"
          />
        )}
        {PROJECT_CATEGORIES.map((c) => {
          const activeFilter = filter === c.id
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={activeFilter}
              onClick={() => setFilter(c.id)}
              ref={(el) => {
                if (el) tabRefs.current.set(c.id, el)
                else tabRefs.current.delete(c.id)
              }}
              className={`relative z-10 inline-flex h-9 shrink-0 items-center border px-4 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                activeFilter
                  ? "border-white/30 font-medium text-white"
                  : "border-white/10 text-white/35 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {dict.workPage.filters[c.id]}
            </button>
          )
        })}
        <span aria-live="polite" className="sr-only">
          {countLine(visible.length)}
        </span>
      </div>

      <p className="mt-4 text-sm text-white/35">
        {countLine(visible.length)}
      </p>

      <div
        ref={railRef}
        onScroll={onRailScroll}
        className="-mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {visible.map((p, i) => (
          <div
            key={`${filter}-${p.name}`}
            style={{ animationDelay: `${Math.min(i * 45, 360)}ms` }}
            className="card-enter w-[82vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
          >
            <ProjectCard p={p} locale={locale} dict={dict} />
          </div>
        ))}
      </div>

      <div className="mt-1 flex justify-center gap-1.5 sm:hidden">
        {visible.map((p, i) => (
          <span
            key={p.name}
            aria-hidden
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeDot ? "w-5 bg-white" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
