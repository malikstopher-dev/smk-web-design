"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowDownRight, ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import type { Dict } from "@/i18n/types"
import type { InnerHeroSceneName } from "@/components/inner-hero-scene"
import { PortraitCard } from "@/components/portrait-card"
import styles from "./inner-hero.module.css"

const InteractiveHeroScene = dynamic(
  () => import("@/components/inner-hero-scene").then((module) => module.InnerHeroScene),
  { ssr: false },
)

export function InnerHero({
  eyebrow,
  heading,
  subtext,
  id,
  scene,
  portraitAlt,
  portraitCaption,
  controls,
  sceneItems,
  link,
  previews,
}: {
  eyebrow: string
  heading: string
  subtext: string
  id?: string
  scene?: InnerHeroSceneName
  portraitAlt?: string
  portraitCaption?: string
  controls?: Dict["sceneControls"]
  sceneItems?: string[]
  link?: { href: string; label: string }
  previews?: { image: string; name: string }[]
}) {
  const [paused, setPaused] = useState(false)
  const [turn, setTurn] = useState(0)
  const [selection, setSelection] = useState(scene === "pricing" ? 1 : 0)
  const heroRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [0, -12])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  useEffect(() => {
    const select = (event: Event) => {
      const detail = (event as CustomEvent<{ scene: string; index: number }>).detail
      if (detail.scene === scene) setSelection(detail.index)
    }
    window.addEventListener("smk:scene-selection", select)
    return () => window.removeEventListener("smk:scene-selection", select)
  }, [scene])
  return (
    <div ref={heroRef} className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id={id} className={styles.heading}>
          {heading}
        </h1>

        {scene === "about" && portraitAlt && (
          <div className={styles.portraitRow}>
            <PortraitCard
              src="/stopher-portrait.webp"
              alt={portraitAlt}
              width={640}
              height={800}
              caption={portraitCaption ?? ""}
            />
            <p className={styles.lede}>{subtext}</p>
          </div>
        )}
        {!(scene === "about" && portraitAlt) && <p className={styles.lede}>
          {subtext}
        </p>}
        {link && <a href={link.href} className={styles.link}>{link.label}<ArrowDownRight aria-hidden size={18} /></a>}
      </div>
      {scene && <div className={styles.stage}>
        <motion.div className={styles.scene} style={reduced ? undefined : { y: sceneY, rotateZ: sceneRotate, scale: sceneScale }}><InteractiveHeroScene scene={scene} paused={paused} turn={turn} selection={selection} /></motion.div>
        {sceneItems && <p className={styles.selection}>{sceneItems[selection]}</p>}
        {previews && <div className={styles.previews} aria-hidden>{previews.slice(0, 2).map(project => <div className={styles.preview} key={project.name}><Image src={project.image} alt="" fill sizes="(max-width: 640px) 240px, 380px" /></div>)}</div>}
        {controls && <div className={styles.controls}>
          <span>{controls.drag}</span>
          <button type="button" aria-label={controls.left} onClick={() => { setTurn(t => t - 1); setPaused(false) }}><ArrowLeft aria-hidden size={15} /></button>
          <button type="button" aria-label={paused ? controls.play : controls.pause} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? <Play aria-hidden size={14} /> : <Pause aria-hidden size={14} />}</button>
          <button type="button" aria-label={controls.right} onClick={() => { setTurn(t => t + 1); setPaused(false) }}><ArrowRight aria-hidden size={15} /></button>
        </div>}
      </div>}
    </div>
  )
}
