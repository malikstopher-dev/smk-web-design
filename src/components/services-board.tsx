"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Dict } from "@/i18n/types"
import type { ServiceItem } from "@/lib/site"
import { SignalDiagram } from "@/components/signal-diagram"
import styles from "./signal-panels.module.css"

export function ServicesBoard({
  eyebrow,
  services,
  dict,
  locale,
}: {
  eyebrow: string
  services: ServiceItem[]
  dict: Dict
  locale: string
}) {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    const syncHash = () => {
      const index = services.findIndex(service => `#${service.slug}` === window.location.hash)
      if (index >= 0) {
        setSelected(index)
        requestAnimationFrame(() => document.getElementById("services-workbench")?.scrollIntoView({ block: "start" }))
      }
    }
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [services])
  const choose = (index: number) => {
    setSelected(index)
    window.dispatchEvent(new CustomEvent("smk:scene-selection", { detail: { scene: "services", index } }))
  }
  return (
    <div id="services-workbench" className={styles.workbench}>
      <p className={styles.label}>{eyebrow}</p>
      <div className={styles.serviceGrid}>
        <div className={styles.serviceNav} role="tablist" aria-label={eyebrow} aria-orientation="vertical">
          {services.map((service, index) => <button key={service.slug} type="button" role="tab" id={`service-tab-${service.slug}`} aria-controls={service.slug} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={el => { tabs.current[index] = el }} className={styles.serviceTab} onClick={() => choose(index)} onKeyDown={event => {
            const next = event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : ["ArrowDown", "ArrowRight"].includes(event.key) ? (index + 1) % services.length : ["ArrowUp", "ArrowLeft"].includes(event.key) ? (index + services.length - 1) % services.length : null
            if (next === null) return
            event.preventDefault(); choose(next); tabs.current[next]?.focus()
          }}><span>{String(index + 1).padStart(2, "0")}</span><span>{dict.servicesPage.items[index].title}</span><ArrowUpRight aria-hidden size={16} /></button>)}
        </div>
        <div>
        <SignalDiagram stage={selected} controls={dict.sceneControls} />
        {services.map((service, index) => {
          const item = dict.servicesPage.items[index]
          return (
            <article
              key={service.slug}
              id={service.slug}
              className={styles.servicePanel}
              role="tabpanel"
              aria-labelledby={`service-tab-${service.slug}`}
              hidden={index !== selected}
              tabIndex={0}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={"/" + locale + "/contact?service=" + encodeURIComponent(item.title)}
                className={styles.discuss}
              >
                {dict.servicesPage.discuss}<ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </article>
          )
        })}
        </div>
      </div>
    </div>
  )
}
