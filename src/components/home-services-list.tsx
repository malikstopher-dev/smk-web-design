"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowUpRight, Plus } from "lucide-react"

export function ServicesRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = r.height + vh * 0.35
      const passed = vh * 0.75 - r.top
      setProgress(Math.min(1, Math.max(0, passed / total)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute left-0 top-0 hidden h-full w-px bg-white/[0.06] md:block"
      >
        <div
          className="w-px bg-white/50"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      {children}
    </div>
  )
}

function AccordionItem({
  title,
  short,
  slug,
  open,
  onToggle,
  locale,
  viewServiceLabel,
}: {
  title: string
  short: string
  slug: string
  open: boolean
  onToggle: () => void
  locale: string
  viewServiceLabel: string
}) {
  return (
    <li className="border-b border-white/[0.04] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-semibold tracking-tight text-white">
            {title}
          </span>
          <span
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <span className="overflow-hidden">
              <span className="block pt-1 text-sm text-white/35">{short}</span>
            </span>
          </span>
        </span>
        <Plus
          className={`h-5 w-5 shrink-0 text-white/25 transition-transform duration-300 ${
            open ? "rotate-45 text-white/60" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Link
            href={`/${locale}/services#${slug}`}
            className="mb-4 inline-flex items-center gap-1.5 pl-8 text-sm font-medium text-gray-400 underline-offset-4 hover:text-white hover:underline"
          >
            {viewServiceLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </li>
  )
}

export function HomeServicesList({
  items,
  viewServiceLabel,
  locale,
}: {
  items: { slug: string; title: string; short: string }[]
  viewServiceLabel: string
  locale: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <ServicesRail>
      <div className="md:hidden">
        <ul>
          {items.map((s, i) => (
            <AccordionItem
              key={s.slug}
              title={s.title}
              short={s.short}
              slug={s.slug}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              locale={locale}
              viewServiceLabel={viewServiceLabel}
            />
          ))}
        </ul>
      </div>

      <ol className="mt-10 hidden divide-y divide-white/[0.04] overflow-hidden border border-white/[0.06] md:block">
        {items.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/${locale}/services#${s.slug}`}
              className="group flex items-center justify-between gap-4 p-6 transition-colors hover:bg-white/[0.02] sm:p-7"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-semibold tracking-tight text-white">
                  {s.title}
                </span>
                <span className="mt-1 block text-sm text-white/35">
                  {s.short}
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/60" />
            </Link>
          </li>
        ))}
      </ol>
    </ServicesRail>
  )
}
