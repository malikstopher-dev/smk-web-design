"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { PlanetsScene } from "@/components/planets-scene"
import { sceneFrame, subscribeScene, wakeScene } from "@/lib/scene-runtime"
import styles from "./home-depth.module.css"

const clamp = (x: number) => Math.max(0, Math.min(1, x))
const smooth = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t) }

export function HomeDepth({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const work = document.querySelector<HTMLElement>('[aria-labelledby="featured-heading"]')
    const sphere = root.querySelector<HTMLElement>("[data-depth-sphere]")
    let start = 0
    let end = 1900
    let lastStage = ""
    let lastProgress = -1
    const measure = () => {
      start = root.getBoundingClientRect().top + scrollY
      end = (work ? work.getBoundingClientRect().top + scrollY + Math.min(work.offsetHeight * 0.5, 800) : root.offsetHeight + 600) - start
      wakeScene()
    }
    const resize = new ResizeObserver(measure)
    resize.observe(root)
    if (work) resize.observe(work)
    measure()
    const unsubscribe = subscribeScene(s => {
      // Scroll is sampled directly, without inertia on the scroll input.
      const progress = s.reduced ? 0 : clamp((s.scrollY - start) / end)
      sceneFrame.progress = progress
      const compact = s.compact ? 0.7 : 1
      const title = smooth(progress / 0.3)
      const foreground = smooth((progress - 0.18) / 0.32)
      const background = smooth((progress - 0.32) / 0.43)
       const stage = !s.compact && progress > 0.18 ? "work" : "hero"
      if (stage !== lastStage) {
        root.dataset.stage = stage
        if (sphere) sphere.inert = stage === "work"
        lastStage = stage
      }
      if (progress !== lastProgress) {
        const travel = Math.min(Math.max(0, s.scrollY - start), end)
        root.style.setProperty("--title-depth", `${s.reduced || s.compact ? 0 : Math.min(travel * 0.58, 240) * compact}px`)
        root.style.setProperty("--title-scale", `${1 - title * 0.2 * compact}`)
        root.style.setProperty("--title-opacity", `${1 - title * 0.7}`)
        // On touch screens, scroll moves the in-flow hero itself. Counteracting
        // it from JS makes the globe judder against the browser's scroll layer.
        root.style.setProperty("--globe-depth", `${s.reduced || s.compact ? 0 : travel * 0.9}px`)
        root.style.setProperty("--globe-scale", `${1 - smooth(progress / 0.9) * (s.compact ? 0.1 : 0.68)}`)
         root.style.setProperty("--globe-opacity", `${s.compact ? 1 : 1 - smooth((progress - 0.08) / 0.26) * 0.65 - smooth((progress - 0.5) / 0.4) * 0.18}`)
        root.style.setProperty("--tagline-depth", `${-foreground * 64 * compact}px`)
        root.style.setProperty("--tagline-scale", `${1 + foreground * 0.08 * compact}`)
        root.style.setProperty("--intro-depth", `${-background * 46 * compact}px`)
        root.style.setProperty("--intro-opacity", `${1 - background * 0.5}`)
        root.style.setProperty("--orbit-depth", `${s.reduced || s.compact ? 0 : travel * 0.82}px`)
        root.style.setProperty("--scroll-progress", String(progress))
        lastProgress = progress
      }
      root.style.setProperty("--orbit-angle", `${s.reduced || s.compact ? 0 : progress * 38 + s.pointerY * 12}deg`)
      root.style.setProperty("--orbit-yaw", `${s.reduced ? 0 : -s.pointerX * 16}deg`)
    }, -10)
    return () => {
      unsubscribe()
      resize.disconnect()
      sceneFrame.progress = 0
      if (sphere) sphere.inert = false
    }
  }, [])

  return <section ref={ref} data-home-depth className={`${className} ${styles.scene}`}>
    <div data-hero-planets aria-hidden className={styles.planets}><PlanetsScene /></div>
    {children}
  </section>
}
