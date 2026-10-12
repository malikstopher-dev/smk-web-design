"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Dict } from "@/i18n/types"
import { PRICING, PRICING_PRICES } from "@/lib/site"
import { waLink } from "@/lib/contact"
import styles from "./signal-panels.module.css"

function whatsappFor(tierEyebrow: string, cta: string, template: string) {
  return waLink(template.replace("{package}", tierEyebrow).replace("{cta}", cta))
}

export function PricingCards({ pricing }: { pricing: Dict["pricingPage"] }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const active = pricing.tiers[activeIndex] ?? pricing.tiers[0]

  function select(index: number) {
    setActiveIndex(index)
    window.dispatchEvent(new CustomEvent("smk:scene-selection", {
      detail: { scene: "pricing", index },
    }))
  }

  return (
    <div id="pricing-packages" className={styles.pricing}>
      <div role="radiogroup" aria-label={pricing.groupLabel} className={styles.pricingGrid}>
        {pricing.tiers.map((tier, index) => (
          <button
            key={tier.eyebrow}
            type="button"
            role="radio"
            aria-checked={index === activeIndex}
            aria-label={`${pricing.groupLabel}: ${tier.eyebrow}`}
            className={styles.tier}
            onClick={() => select(index)}
          >
            {PRICING[index]?.popular && <span className={styles.popular}>{pricing.popular}</span>}
            <span className={styles.tierName}>{tier.eyebrow}<i aria-hidden /></span>
            <span className={styles.price}>{PRICING_PRICES[index]}</span>
            <span className={styles.terms}>{tier.terms}</span>
            <ul>{tier.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <span className={styles.bestFor}>{pricing.bestForPrefix} {tier.bestFor}</span>
          </button>
        ))}
      </div>
      <div className={styles.summary}>
        <p aria-live="polite"><strong>{active.eyebrow}</strong>{active.bestFor}</p>
        <a className={styles.primary} href={whatsappFor(active.eyebrow, active.cta, pricing.waMessage)} target="_blank" rel="noopener noreferrer">
          {active.cta}<ArrowUpRight aria-hidden size={17} />
        </a>
      </div>
    </div>
  )
}
