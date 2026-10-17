"use client"

import { useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import type { Dict } from "@/i18n/types"
import { PRICING, PRICING_PRICES } from "@/lib/site"
import { waLink } from "@/lib/contact"
import styles from "./signal-panels.module.css"
import depth from "./pricing-depth.module.css"

function whatsappFor(tierEyebrow: string, cta: string, template: string) {
  return waLink(template.replace("{package}", tierEyebrow).replace("{cta}", cta))
}

export function PricingCards({ pricing, controls }: { pricing: Dict["pricingPage"]; controls: Dict["sceneControls"] }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: .1 })
  const [paused, setPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(1)
  const active = pricing.tiers[activeIndex] ?? pricing.tiers[0]

  function select(index: number) {
    setActiveIndex(index)
    window.dispatchEvent(new CustomEvent("smk:scene-selection", {
      detail: { scene: "pricing", index },
    }))
  }

  return (
    <div ref={ref} id="pricing-packages" className={`${styles.pricing} ${depth.stage}`} data-moving={visible && !paused && !reduced}>
      {!reduced && <div className={depth.controls}><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}{paused ? controls.play : controls.pause}</button></div>}
      <div role="radiogroup" aria-label={pricing.groupLabel} className={`${styles.pricingGrid} ${depth.grid}`}>
        {pricing.tiers.map((tier, index) => (
          <div key={tier.eyebrow} className={depth.mount} style={{ "--phase": `${index * -1.8}s` } as CSSProperties}>
          <motion.button
            key={tier.eyebrow}
            type="button"
            role="radio"
            aria-checked={index === activeIndex}
            aria-label={`${pricing.groupLabel}: ${tier.eyebrow}`}
            className={`${styles.tier} ${depth.card}`}
            onClick={() => select(index)}
            initial={false}
            animate={{ y: reduced ? 0 : index === activeIndex ? -14 : 4, z: reduced ? 0 : index === activeIndex ? 28 : 0, rotateY: reduced || index === activeIndex ? 0 : (1 - index) * 6 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 23 }}
          >
            {PRICING[index]?.popular && <span className={styles.popular}>{pricing.popular}</span>}
            <span className={styles.tierName}>{tier.eyebrow}<i aria-hidden /></span>
            <span className={styles.price}>{PRICING_PRICES[index]}</span>
            <span className={styles.terms}>{tier.terms}</span>
            <ul>{tier.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            <span className={styles.bestFor}>{pricing.bestForPrefix} {tier.bestFor}</span>
          </motion.button>
          </div>
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
