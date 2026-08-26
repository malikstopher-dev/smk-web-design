"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
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
              className={`spotlight-card relative flex flex-col rounded-3xl border p-7 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                selected
                  ? "border-white bg-gray-900 shadow-2xl shadow-black/50"
                  : "border-gray-800 bg-transparent hover:border-gray-600"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-6 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white dark:bg-white dark:text-gray-900">
                  {pricing.popular}
                </span>
              )}
              <span className="flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                  {tier.eyebrow}
                </span>
                <span
                  aria-hidden
                  className={`inline-block h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                    selected
                      ? "border-[7px] border-gray-900 dark:border-white"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
              </span>
              <span className="mt-4 font-display text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {PRICING_PRICES[i]}
              </span>
              <span className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {tier.terms}
              </span>
              <ul className="mt-6 flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900 dark:text-white" />
                    <span className="text-gray-700 dark:text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-6 rounded-xl bg-gray-950 px-4 py-3 text-xs leading-relaxed text-gray-400">
                {pricing.bestForPrefix} {tier.bestFor}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div
        aria-live="polite"
        className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-800 px-6 py-5 sm:flex-row"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {active.eyebrow}
          </span>{" "}
          <span aria-hidden className="text-gray-500">·</span>{" "}
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
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03070f]"
        >
          {active.cta}
        </motion.a>
      </div>
    </div>
  )
}
