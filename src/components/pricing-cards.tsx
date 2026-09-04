"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useMagnet } from "@/components/magnetic"
import type { Dict } from "@/i18n/types"
import { PRICING_PRICES, SITE } from "@/lib/site"

function whatsappFor(tierEyebrow: string, cta: string, template: string) {
  const text = encodeURIComponent(
    template
      .replace("{package}", tierEyebrow)
      .replace("{cta}", cta),
  )
  return `${SITE.whatsapp.url}?text=${text}`
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
        {pricing.tiers.map((tier, i) => {
          const selected = i === activeIndex
          return (
            <motion.button
              key={tier.eyebrow}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setActiveIndex(i)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              whileHover={{ y: -4 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08 * i,
              }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`)
                e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`)
              }}
              className={`spotlight-card relative flex flex-col border p-7 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                selected
                  ? "border-white/30 bg-white/[0.03] shadow-2xl shadow-black/50"
                  : "border-white/[0.06] bg-transparent hover:border-white/[0.12]"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-6 border border-white/20 bg-[#03070f] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {pricing.popular}
                </span>
              )}
              <span className="flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-white/40">
                  {tier.eyebrow}
                </span>
                <span
                  aria-hidden
                  className={`inline-block h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                    selected
                      ? "border-[7px] border-white"
                      : "border-white/30"
                  }`}
                />
              </span>
              <span className="mt-4 display-md text-white">
                {PRICING_PRICES[i]}
              </span>
              <span className="mt-1.5 text-xs text-white/35">
                {tier.terms}
              </span>
              <ul className="mt-6 flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-white/50">+</span>
                    <span className="text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-6 border border-white/[0.06] px-4 py-3 text-xs leading-relaxed text-white/35">
                {pricing.bestForPrefix} {tier.bestFor}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div
        aria-live="polite"
        className="mt-8 flex flex-col items-center justify-between gap-4 border border-white/[0.06] px-6 py-5 sm:flex-row"
      >
        <p className="text-sm text-white/40">
          <span className="font-semibold text-white">
            {active.eyebrow}
          </span>{" "}
          <span aria-hidden className="text-white/20">·</span>{" "}
          {active.bestFor}
        </p>
        <motion.a
          href={whatsappFor(active.eyebrow, active.cta, pricing.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          key={active.eyebrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          {...magnet}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-white/10 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
        >
          {active.cta}
        </motion.a>
      </div>
    </div>
  )
}
