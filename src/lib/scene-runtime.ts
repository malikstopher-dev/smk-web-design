// Shared clock and input sampling for stars, planets, the homepage globe and
// scroll choreography. Nothing subscribes during SSR; no React state per frame.
export const SCENE_MOTION = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  pointerDamping: 4.8,
  dragDamping: 5.5,
  hoverDuration: 650,
  globePointerYaw: 0.24,
  globePointerPitch: 0.12,
  globeRadiansPerSecond: 0.095,
  planetPointer: { x: 0.95, y: 0.55 },
  projectTilt: 5,
  projectZ: 96,
  neighbourZ: -64,
  imageParallax: { x: 14, y: 10 },
} as const

export type SceneFrame = {
  time: number
  delta: number
  pointerX: number
  pointerY: number
  scrollY: number
  progress: number
  width: number
  height: number
  compact: boolean
  reduced: boolean
  quality: number
}

export const sceneFrame: SceneFrame = {
  time: 0, delta: 0, pointerX: 0, pointerY: 0, scrollY: 0,
  progress: 0, width: 1440, height: 900, compact: false, reduced: false, quality: 1,
}

type Listener = (frame: SceneFrame) => void
const listeners = new Map<Listener, number>()
let ordered: Listener[] = []
let frame = 0
let last = 0
let targetX = 0
let targetY = 0
let slowFrames = 0
let samples = 0
let teardown: (() => void) | undefined

function tick(now: number) {
  frame = 0
  const elapsed = last ? now - last : 16.67
  last = now
  sceneFrame.delta = Math.min(elapsed / 1000, 0.05)
  if (!sceneFrame.reduced) {
    sceneFrame.time += sceneFrame.delta
    const damping = 1 - Math.exp(-SCENE_MOTION.pointerDamping * sceneFrame.delta)
    sceneFrame.pointerX += (targetX - sceneFrame.pointerX) * damping
    sceneFrame.pointerY += (targetY - sceneFrame.pointerY) * damping
    // Lower render resolution, never animation cadence. Ignore startup/stalls.
    if (sceneFrame.time > 4 && elapsed < 100) {
      samples++
      if (elapsed > 25) slowFrames++
      if (samples >= 120) {
        if (slowFrames > 36) sceneFrame.quality = Math.max(0.6, sceneFrame.quality - 0.15)
        samples = slowFrames = 0
      }
    }
  } else {
    sceneFrame.pointerX = sceneFrame.pointerY = 0
  }
  for (const listener of ordered) listener(sceneFrame)
  if (!sceneFrame.reduced) wakeScene()
}

export function wakeScene() {
  if (typeof document !== "undefined" && !document.hidden && !frame && listeners.size) {
    frame = requestAnimationFrame(tick)
  }
}

function start() {
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const small = matchMedia("(max-width: 767px), (pointer: coarse)")
  const resize = () => {
    sceneFrame.width = innerWidth
    sceneFrame.height = innerHeight
    sceneFrame.compact = small.matches
    wakeScene()
  }
  const scroll = () => { sceneFrame.scrollY = scrollY; wakeScene() }
  const pointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || sceneFrame.reduced) return
    targetX = (e.clientX / sceneFrame.width - 0.5) * 2
    targetY = (e.clientY / sceneFrame.height - 0.5) * 2
    wakeScene()
  }
  const leave = () => { targetX = targetY = 0; wakeScene() }
  const visibility = () => {
    cancelAnimationFrame(frame)
    frame = last = 0
    wakeScene()
  }
  const preference = () => {
    sceneFrame.reduced = motion.matches
    if (motion.matches) targetX = targetY = 0
    visibility()
  }
  sceneFrame.reduced = motion.matches
  resize()
  scroll()
  window.addEventListener("resize", resize, { passive: true })
  window.addEventListener("scroll", scroll, { passive: true })
  window.addEventListener("pointermove", pointer, { passive: true })
  document.documentElement.addEventListener("pointerleave", leave)
  document.addEventListener("visibilitychange", visibility)
  motion.addEventListener("change", preference)
  small.addEventListener("change", resize)
  teardown = () => {
    cancelAnimationFrame(frame)
    frame = last = 0
    window.removeEventListener("resize", resize)
    window.removeEventListener("scroll", scroll)
    window.removeEventListener("pointermove", pointer)
    document.documentElement.removeEventListener("pointerleave", leave)
    document.removeEventListener("visibilitychange", visibility)
    motion.removeEventListener("change", preference)
    small.removeEventListener("change", resize)
    sceneFrame.progress = 0
  }
}

export function subscribeScene(listener: Listener, priority = 0) {
  listeners.set(listener, priority)
  ordered = [...listeners].sort((a, b) => a[1] - b[1]).map(([callback]) => callback)
  if (listeners.size === 1) start()
  wakeScene()
  return () => {
    listeners.delete(listener)
    ordered = [...listeners].sort((a, b) => a[1] - b[1]).map(([callback]) => callback)
    if (!listeners.size) { teardown?.(); teardown = undefined }
  }
}
