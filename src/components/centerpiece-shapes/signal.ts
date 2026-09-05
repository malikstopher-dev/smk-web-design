/* BLOG — open book: two page panels spread like a V,
   each filled with a dot grid of "text lines". */

import type { Vec3 } from "@/components/centerpiece"

function page(side: 1 | -1, count: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    // Panel spans x 0.08..0.78 (mirrored), z -0.5..0.5
    const u = Math.random() // along the spine outward
    const v = Math.random() // page height
    const x = side * (0.08 + u * 0.7)
    // Pages curl: outer edge lifts and curves
    const z = -0.5 + v + Math.pow(u, 1.6) * side * 0.22 + Math.sin(u * 2.6) * 0.06 * side
    // Snap v to "text lines" for a stipple-read of paragraphs
    const lineY = Math.round(v * 13) / 13
    pts.push([x, 0.62 - lineY * 1.24, z])
  }
  return pts
}

function spine(count: number): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const v = Math.random()
    pts.push([0, 0.62 - v * 1.24, -0.5 + v + (Math.random() - 0.5) * 0.04])
  }
  return pts
}

const left = page(-1, 1300)
const right = page(1, 1300)
const bookSpine = spine(220)

/* Radiating signal dots above the book. */
const signal: Vec3[] = []
for (let ring = 0; ring < 3; ring++) {
  const r = 0.35 + ring * 0.18
  const n = 90 - ring * 18
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    signal.push([Math.cos(a) * r * 0.9, 0.78 + Math.sin(a) * r * 0.32 + ring * 0.06, Math.sin(a) * r * 0.55 - 0.1])
  }
}

export const POINTS: Vec3[] = [...left, ...right, ...bookSpine, ...signal]
