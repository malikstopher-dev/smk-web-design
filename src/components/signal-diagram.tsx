"use client"

import { Braces, Cloud, Compass, Layers3, PanelsTopLeft, Pause, Play, PenTool, Rocket, Search } from "lucide-react"
import { useRef, useState, type CSSProperties } from "react"
import { useInView } from "framer-motion"
import type { Dict } from "@/i18n/types"
import styles from "./signal-panels.module.css"

const SERVICE_ICONS = [PenTool, Braces, Search, Cloud, PanelsTopLeft, Layers3]
const PROCESS_ICONS = [Compass, PenTool, Braces, Rocket]

export function SignalDiagram({ stage, process = false, controls }: { stage: number; process?: boolean; controls: Pick<Dict["sceneControls"], "pause" | "play"> }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { amount: .15 })
  const [paused, setPaused] = useState(false)
  const Icon = (process ? PROCESS_ICONS : SERVICE_ICONS)[stage] ?? Layers3
  return <div ref={ref} className={styles.diagram} data-stage={stage} data-moving={visible && !paused}>
    <div className={styles.diagramOrbit} aria-hidden="true">
    <div className={styles.planes}>
      {[0, 1, 2].map(layer => <div key={layer} className={styles.plane} style={{ "--layer": layer } as CSSProperties}>
        {layer === 2 && <Icon strokeWidth={1.2} />}
      </div>)}
    </div>
    </div>
    <button type="button" className={styles.motionToggle} aria-label={paused ? controls.play : controls.pause} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
  </div>
}
