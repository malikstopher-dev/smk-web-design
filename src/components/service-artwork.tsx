"use client"

import { useRef, useState, type ReactNode } from "react"
import { useInView } from "framer-motion"
import { Pause, Play } from "lucide-react"
import type { Dict } from "@/i18n/types"
import styles from "./home-services-grid.module.css"

export function ServiceArtwork({ children, title, slug, controls }: {
  children: ReactNode
  title: string
  slug: string
  controls: Pick<Dict["sceneControls"], "pause" | "play">
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: .2 })
  const [paused, setPaused] = useState(false)
  return <div ref={ref} className={styles.visual} data-service-artwork={slug} data-moving={inView && !paused}>
    {children}
    <button type="button" className={styles.motionControl} aria-label={`${paused ? controls.play : controls.pause}: ${title}`} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? <Play size={12} /> : <Pause size={12} />}
    </button>
  </div>
}
