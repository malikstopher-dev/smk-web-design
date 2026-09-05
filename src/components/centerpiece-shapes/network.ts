/* WORK — constellation network: nodes of varying size on
   orbital shells, connected by spoke lines of dots. */

import { ringPoints, spherePoints } from "./_shared"
import type { Vec3 } from "@/components/centerpiece"

function node(center: Vec3, radius: number, count: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = radius * (0.75 + Math.random() * 0.25)
    pts.push([
      center[0] + Math.cos(a) * r,
      center[1] + (Math.random() - 0.5) * 0.05,
      center[2] + Math.sin(a) * r,
    ])
  }
  return pts
}

function spokeLine(from: Vec3, to: Vec3, count: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    pts.push([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t,
    ])
  }
  return pts
}

const centers: Vec3[] = [
  [0, 0, 0],
  [0.55, 0.28, 0.15],
  [-0.5, 0.32, -0.1],
  [0.32, -0.44, -0.2],
  [-0.42, -0.36, 0.22],
  [0.72, -0.12, -0.3],
  [-0.15, 0.62, 0.35],
  [-0.68, 0.05, 0.3],
]

const nodes = centers.map((c, i) => node(c, 0.08 + (i % 3) * 0.015, 90 + (i % 4) * 30))
const spokes = centers.slice(1).flatMap((c) => spokeLine(centers[0], c, 46))
const halo = spherePoints(900, 0.4).map((p) => [p[0] * 1.15, p[1] * 1.15, p[2] * 1.15] as Vec3)
const orbit = ringPoints(500, 0.95, 0.06, [Math.PI / 2.4, 0.35])

export const POINTS: Vec3[] = [...nodes.flat(), ...spokes, ...halo, ...orbit]
