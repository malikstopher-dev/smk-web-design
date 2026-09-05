/* Shared point-cloud helpers for hero centerpieces. */

import type { Vec3 } from "@/components/centerpiece"

/* Evenly distributed points on a unit sphere (Fibonacci). */
export function spherePoints(count: number, seed = 0): Vec3[] {
  const pts: Vec3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i + seed
    pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r])
  }
  return pts
}

/* Points on a sphere restricted to a lat/lng window —
   used to foreground a continent. */
export function sphereRegion(
  count: number,
  latRange: [number, number],
  lngRange: [number, number],
): Vec3[] {
  const pts: Vec3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  let placed = 0
  let i = 0
  while (placed < count && i < count * 40) {
    const y = 1 - (i / (count * 40 - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    // lat from y, lng from atan2
    const lat = (Math.asin(y) * 180) / Math.PI
    const lng = (Math.atan2(z, x) * 180) / Math.PI
    if (
      lat >= latRange[0] &&
      lat <= latRange[1] &&
      lng >= lngRange[0] &&
      lng <= lngRange[1]
    ) {
      pts.push([x, y, z])
      placed++
    }
    i++
  }
  return pts
}

/* Points on a ring/disc of given radius in the XZ plane. */
export function ringPoints(
  count: number,
  radius: number,
  y = 0,
  tilt: [number, number] = [0, 0],
): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    let p: Vec3 = [
      Math.cos(a) * radius,
      y + Math.sin(a * 3) * 0.02,
      Math.sin(a) * radius,
    ]
    if (tilt[0]) {
      const cy = Math.cos(tilt[0])
      const sy = Math.sin(tilt[0])
      p = [p[0] * cy - p[2] * sy, p[1], p[0] * sy + p[2] * cy]
    }
    if (tilt[1]) {
      const cx = Math.cos(tilt[1])
      const sx = Math.sin(tilt[1])
      p = [p[0], p[1] * cx - p[2] * sx, p[1] * sx + p[2] * cx]
    }
    pts.push(p)
  }
  return pts
}
