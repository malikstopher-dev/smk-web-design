"use client"

import { useState, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"
import { PlanetsScene } from "@/components/planets-scene"
import { GlobeMarkers } from "@/components/globe-markers"
import type { Dict } from "@/i18n/types"
import styles from "./home-depth.module.css"

export function HomeDepth({ children, className, controls }: { children: ReactNode; className: string; controls: Dict["sceneControls"] }) {
  const [paused, setPaused] = useState(false)
  return <section data-home-depth className={`${className} ${styles.scene}`}>
    <div data-hero-planets aria-hidden className={styles.planets}><PlanetsScene paused={paused} /></div>
    <div data-hero-globe aria-hidden className={styles.earth}>
      <link rel="preload" as="image" href="/planets/earth-day-2k.jpg" fetchPriority="high" />
      <GlobeMarkers renderWithoutMarkers cinematic paused={paused} />
    </div>
    {children}
    <button type="button" className={styles.pause} aria-label={paused ? controls.play : controls.pause} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? <Play size={14} /> : <Pause size={14} />}
    </button>
  </section>
}
