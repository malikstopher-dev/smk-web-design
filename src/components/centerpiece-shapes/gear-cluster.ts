/* SERVICES — gear: teeth ring plus hub, an interconnected
   system. A second smaller ring suggests meshing. */

import { ringPoints } from "./_shared"
import type { Vec3 } from "@/components/centerpiece"

function gearPoints(teeth: number, radius: number, toothDepth: number, count: number): Vec3[] {
  const pts: Vec3[] = []
  const perTooth = Math.floor(count / teeth)
  for (let t = 0; t < teeth; t++) {
    const a0 = (t / teeth) * Math.PI * 2
    const a1 = ((t + 0.55) / teeth) * Math.PI * 2
    const a2 = ((t + 1) / teeth) * Math.PI * 2
    // Tooth bulge then gap
    for (let i = 0; i < perTooth; i++) {
      const f = i / perTooth
      const a = f < 0.6 ? a0 + (a1 - a0) * (f / 0.6) : a1 + (a2 - a1) * ((f - 0.6) / 0.4)
      const r = f < 0.6 ? radius + toothDepth : radius
      const jitter = 0.03
      pts.push([Math.cos(a) * r + (Math.random() - 0.5) * jitter, (Math.random() - 0.5) * jitter * 2, Math.sin(a) * r + (Math.random() - 0.5) * jitter])
    }
  }
  return pts
}

function hub(count: number, radius: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * radius
    pts.push([Math.cos(a) * r, (Math.random() - 0.5) * 0.06, Math.sin(a) * r])
  }
  return pts
}

const gear = gearPoints(10, 0.72, 0.13, 1300)
const smallGear = gearPoints(8, 0.34, 0.09, 700).map((p) =>
  [p[0] * Math.cos(0.5) - p[2] * Math.sin(0.5) + 0.92, p[1] - 0.28, p[0] * Math.sin(0.5) + p[2] * Math.cos(0.5) + 0.3] as Vec3,
)
const spokes = ringPoints(240, 0.36, 0.02, [Math.PI / 2, 0.2])

export const POINTS: Vec3[] = [...gear, ...smallGear, ...spokes, ...hub(500, 0.34)]
