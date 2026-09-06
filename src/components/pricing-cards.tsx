"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useMagnet } from "@/components/magnetic"
import type { Dict } from "@/i18n/types"
import { PRICING, PRICING_PRICES, SITE } from "@/lib/site"

const MAX_TILT = 4

function whatsappFor(tierEyebrow: string, cta: string, template: string) {
  const text = encodeURIComponent(
    template
      .replace("{package}", tierEyebrow)
      .replace("{cta}", cta),
  )
  return `${SITE.whatsapp.url}?text=${text}`
}

// Count each numeric group while preserving the surrounding price text.
function useCountUp(target: string, start: boolean) {
  // Keep the real value in SSR and no-JavaScript output.
  const [display, setDisplay] = useState(target)
  useEffect(() => {
    if (!start) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const groups = target.match(/\d[\d,]*/g)
    if (!groups) return
    const finals = groups.map((g) => parseInt(g.replace(/,/g, ""), 10))
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 800, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      let i = 0
      setDisplay(
        target.replace(/\d[\d,]*/g, () => {
          const v = Math.round(finals[i++] * eased)
          return v.toLocaleString("en-US")
        }),
      )
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return display
}

function PriceFigure({ target, start }: { target: string; start: boolean }) {
  const display = useCountUp(target, start)
  return <span className="mt-4 display-md text-white">{display}</span>
}

function TierCard({
  tier,
  index,
  price,
  popularLabel,
  isPopular,
  selected,
  onSelect,
  groupLabel,
  bestForPrefix,
}: {
  tier: Dict["pricingPage"]["tiers"][number]
  index: number
  price: string
  popularLabel: string
  isPopular: boolean
  selected: boolean
  onSelect: () => void
  groupLabel: string
  bestForPrefix: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLButtonElement>(null)
  const [entered, setEntered] = useState(false)
  const [featuresShown, setFeaturesShown] = useState(false)

  // Reveal once; feature rows follow after the card settles.
  useEffect(() => {
    const el = ref.current
    if (!el || entered) return
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
  }, [entered])

  useEffect(() => {
    if (!entered || featuresShown) return
    const timer = window.setTimeout(
      () => setFeaturesShown(true),
      600 + index * 100,
    )
    return () => clearTimeout(timer)
  }, [entered, featuresShown, index])

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = tiltRef.current
    if (!el) return
    if (e.pointerType !== "mouse") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty("--sx", `${e.clientX - r.left}px`)
    el.style.setProperty("--sy", `${e.clientY - r.top}px`)
    el.style.transform = `translateY(-8px) scale(1.02) rotateX(${-py * MAX_TILT * 2}deg) rotateY(${px * MAX_TILT * 2}deg)`
    el.style.borderColor = "rgba(232, 176, 75, 0.5)"
    el.style.boxShadow = "0 0 28px rgba(250, 204, 21, 0.18)"
  }

  function onPointerLeave() {
    const el = tiltRef.current
    if (!el) return
    el.style.transform = ""
    el.style.borderColor = ""
    el.style.boxShadow = ""
  }

  return (
    <div
      ref={ref}
      className={`h-full [perspective:900px] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        entered ? "translate-y-0 opacity-100" : "translate-y-[30px] opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        ref={tiltRef}
        className={`spotlight-card relative flex h-full w-full flex-col border p-7 text-left transition-[transform,border-color,box-shadow] duration-[250ms] ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)]:active:scale-100 ${
          isPopular
            ? "border-[#e8b04b]/40 bg-white/[0.03] shadow-[0_0_24px_rgba(232,176,75,0.10)]"
            : selected
              ? "border-white/30 bg-white/[0.03] shadow-2xl shadow-black/50"
              : "border-white/[0.06] bg-transparent hover:border-white/[0.12]"
        }`}
        aria-label={`${groupLabel}: ${tier.eyebrow}`}
      >
        {isPopular && (
          <span className="absolute -top-3 left-6 border border-[#e8b04b]/50 bg-[#03070f] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e8b04b]">
            {popularLabel}
          </span>
        )}
        <span className="flex items-center justify-between">
          <span className="text-sm font-medium uppercase tracking-[0.14em] text-white/40">
            {tier.eyebrow}
          </span>
          <span
            aria-hidden
            className={`inline-block h-4 w-4 rounded-full border-2 transition-all duration-200 ${
              selected ? "border-[7px] border-white" : "border-white/30"
            }`}
          />
        </span>
        <PriceFigure target={price} start={entered} />
        <span className="mt-1.5 text-xs text-white">{tier.terms}</span>
        <ul className="mt-6 flex flex-col gap-2.5">
          {tier.features.map((f, fi) => (
            <li
              key={f}
              className={`flex items-start gap-2.5 text-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                featuresShown
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1.5 opacity-0"
              }`}
              style={{ transitionDelay: `${fi * 40}ms` }}
            >
              <span className="mt-0.5 h-4 w-4 shrink-0 text-white/50">+</span>
              <span className="text-white">{f}</span>
            </li>
          ))}
        </ul>
        <span className="mt-6 border border-white/[0.06] px-4 py-3 text-xs leading-relaxed text-white">
          {bestForPrefix} {tier.bestFor}
        </span>
      </button>
    </div>
  )
}

export function PricingCards({ pricing }: { pricing: Dict["pricingPage"] }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const magnet = useMagnet(0.25, 4)
  const active = pricing.tiers[activeIndex] ?? pricing.tiers[0]

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={pricing.groupLabel}
        className="grid gap-5 lg:grid-cols-3"
      >
        {pricing.tiers.map((tier, i) => (
          <TierCard
            key={tier.eyebrow}
            tier={tier}
            index={i}
            price={PRICING_PRICES[i]}
            popularLabel={pricing.popular}
            isPopular={Boolean(PRICING[i]?.popular)}
            selected={i === activeIndex}
            onSelect={() => setActiveIndex(i)}
            groupLabel={pricing.groupLabel}
            bestForPrefix={pricing.bestForPrefix}
          />
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-8 flex flex-col items-center justify-between gap-4 border border-white/[0.06] px-6 py-5 sm:flex-row"
      >
        <p className="text-sm text-white">
          <span className="font-semibold text-white">
            {active.eyebrow}
          </span>{" "}
          <span aria-hidden className="text-white/40">·</span>{" "}
          <span className="text-white">{active.bestFor}</span>
        </p>
        <motion.a
          href={whatsappFor(active.eyebrow, active.cta, pricing.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          {...magnet}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
        >
          {active.cta}
        </motion.a>
      </div>
    </div>
  )
}
