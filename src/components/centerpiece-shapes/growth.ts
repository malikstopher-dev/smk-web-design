/* PRICING — ascending stacked discs / bar chart hybrid:
   four discs on a rising diagonal, each a thin coin. */

import { ringPoints } from "./_shared"
import type { Vec3 } from "@/components/centerpiece"

function coin(center: Vec3, radius: number, count: number, tilt: [number, number]): Vec3[] {
  const face = ringPoints(count, radius, 0, tilt)
  return face.map((p) =>
    [p[0] + center[0], p[1] + center[1], p[2] + center[2]] as Vec3,
  )
}

const coins: Vec3[] = [
  [-0.55, -0.5, 0],
  [-0.18, -0.17, 0.1],
  [0.18, 0.16, 0.05],
  [0.55, 0.5, 0],
]

const tilt: [number, number] = [Math.PI / 2 - 0.35, 0.25]
const big = coin(coins[0], 0.3, 340, tilt)
const midA = coin(coins[1], 0.27, 300, tilt)
const midB = coin(coins[2], 0.25, 280, tilt)
const top = coin(coins[3], 0.22, 250, tilt)

/* Thin ascending trail of dots under the stack. */
const trail: Vec3[] = []
for (let i = 0; i < 180; i++) {
  const t = i / 179
  trail.push([-0.85 + t * 1.7, -0.72 + t * 1.28, -0.1 - Math.sin(t * Math.PI) * 0.1])
}

export const POINTS: Vec3[] = [...big, ...midA, ...midB, ...top, ...trail]
