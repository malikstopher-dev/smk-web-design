"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { subscribeScene, wakeScene, type SceneFrame } from "@/lib/scene-runtime"

const BackgroundPlanets = dynamic(() => import("./planets-scene").then(module => module.PlanetsScene), { ssr: false })

const LAYERS = [
  { count: 145, mobile: 74, radius: 0.65, drift: 1.4, pointer: 9, scroll: 0.055, alpha: 0.4 },
  { count: 90, mobile: 45, radius: 1.05, drift: 3.8, pointer: 27, scroll: 0.13, alpha: 0.58 },
  { count: 36, mobile: 18, radius: 1.85, drift: 7, pointer: 56, scroll: 0.26, alpha: 0.78 },
] as const

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()
  const isInnerPage = pathname.split("/").filter(Boolean).length > 1

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d", { alpha: true })
    if (!canvas || !ctx) return
    let width = 0
    let height = 0
    let compact = false
    let visible = true
    let dpr = 1
    let seed = 0xc0ffee42
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
    type Star = { x: number; y: number; phase: number; radius: number; depth: number }
    let stars: Star[] = []

    // Reuse a painted glow instead of constructing gradients for every star,
    // every frame. The brightest near stars retain the original soft halo.
    const sprite = document.createElement("canvas")
    sprite.width = sprite.height = 48
    const glow = sprite.getContext("2d")!
    const gradient = glow.createRadialGradient(24, 24, 0, 24, 24, 24)
    gradient.addColorStop(0, "rgba(235,244,255,0.95)")
    gradient.addColorStop(0.12, "rgba(215,231,255,0.45)")
    gradient.addColorStop(0.4, "rgba(160,195,245,0.12)")
    gradient.addColorStop(1, "rgba(160,195,245,0)")
    glow.fillStyle = gradient
    glow.fillRect(0, 0, 48, 48)

    const rebuild = (s: SceneFrame) => {
      width = s.width
      height = s.height
      compact = s.compact
      dpr = Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed = 0xc0ffee42
      stars = []
      LAYERS.forEach((layer, depth) => {
        for (let i = 0; i < (compact ? layer.mobile : layer.count); i++) {
          stars.push({ x: rand(), y: rand(), phase: rand() * Math.PI * 2, radius: layer.radius * (0.65 + rand() * 0.65), depth })
        }
      })
      canvas.dataset.stars = String(stars.length)
      canvas.dataset.layers = "3"
    }
    const wrap = (value: number, extent: number) => ((value % extent) + extent) % extent
    const render = (s: SceneFrame) => {
      if (!visible) return
      if (width !== s.width || height !== s.height || compact !== s.compact) rebuild(s)
      ctx.clearRect(0, 0, width, height)
      const time = s.reduced ? 0 : s.time
      const amount = compact ? 0.6 : 1
      for (const star of stars) {
        const layer = LAYERS[star.depth]
        const x = wrap(star.x * width + time * layer.drift * amount - s.pointerX * layer.pointer * amount, width + 24) - 12
        const y = wrap(star.y * height - time * layer.drift * 0.32 * amount - (s.reduced ? 0 : s.scrollY * layer.scroll * amount) - s.pointerY * layer.pointer * amount, height + 24) - 12
        const twinkle = 0.76 + Math.sin(time * (0.65 + star.depth * 0.2) + star.phase) * 0.24
        ctx.globalAlpha = layer.alpha * twinkle
        if (star.depth === 2 || star.phase < 0.55) {
          const size = star.radius * 10
          ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size)
        }
        ctx.fillStyle = "#dcecff"
        ctx.beginPath()
        ctx.arc(x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    const unsubscribe = subscribeScene(render)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wakeScene() })
    observer.observe(canvas)
    return () => { unsubscribe(); observer.disconnect() }
  }, [])

  return <div id="cosmic-bg" aria-hidden>
    <div id="cosmic-gradient" />
    <div id="cosmic-vignette" />
    <div id="cosmic-nebula-1" />
    <div id="cosmic-nebula-2" />
    <canvas ref={canvasRef} id="cosmic-star-canvas" />
    {isInnerPage && <BackgroundPlanets placement="background" />}
    <div id="noise-overlay" aria-hidden />
  </div>
}
