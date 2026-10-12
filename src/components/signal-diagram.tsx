import { Braces, Cloud, Compass, Layers3, PanelsTopLeft, PenTool, Rocket, Search } from "lucide-react"
import type { CSSProperties } from "react"
import styles from "./signal-panels.module.css"

const SERVICE_ICONS = [PenTool, Braces, Search, Cloud, PanelsTopLeft, Layers3]
const PROCESS_ICONS = [Compass, PenTool, Braces, Rocket]

export function SignalDiagram({ stage, process = false }: { stage: number; process?: boolean }) {
  const Icon = (process ? PROCESS_ICONS : SERVICE_ICONS)[stage] ?? Layers3
  return <div className={styles.diagram} data-stage={stage} aria-hidden="true">
    <div className={styles.planes}>
      {[0, 1, 2].map(layer => <div key={layer} className={styles.plane} style={{ "--layer": layer } as CSSProperties}>
        {layer === 2 && <Icon strokeWidth={1.2} />}
      </div>)}
    </div>
  </div>
}
