"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { ArrowUpRight, Pause, Play } from "lucide-react"
import type { Dict } from "@/i18n/types"
import styles from "./signal-panels.module.css"

export function ContactSignal({ controls }: { controls: Pick<Dict["sceneControls"], "pause" | "play"> }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: .15 })
  const [paused, setPaused] = useState(false)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const update = (event: Event) => setFocused((event as CustomEvent<boolean>).detail)
    window.addEventListener("smk:contact-focus", update)
    return () => window.removeEventListener("smk:contact-focus", update)
  }, [])
  return <div ref={ref} className={styles.contactObject} data-focused={focused} data-moving={visible && !paused}>
    <div className={styles.envelopeFloat} aria-hidden="true">
    <div className={styles.envelope}>
      <div className={styles.letter} />
      <div className={styles.envelopeBody} />
      <div className={styles.seal}><ArrowUpRight size={18} strokeWidth={1.4} /></div>
    </div>
    </div>
    <button type="button" className={styles.motionToggle} aria-label={paused ? controls.play : controls.pause} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
  </div>
}
