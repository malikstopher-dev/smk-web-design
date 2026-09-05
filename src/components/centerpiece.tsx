"use client"

import { useEffect, useRef, useState } from "react"

/* ═══════════════════════════════════════════════════════
   DOT CENTERPIECE — shared dot-stipple object renderer
   Renders a 3D point cloud as small white dots on dark
   background, matching the homepage Earth globe look:
   white dots, thin orbital ring, slow idle rotation,
   soft depth falloff. Shape definitions live in separate
   files, dynamically imported per page.
   ═══════════════════════════════════════════════════════ */

export type Vec3 = [number, number, number]

export function Centerpiece({
  shape,
  className = "",
}: {
  shape: "globe-africa" | "gear-cluster" | "network" | "growth" | "signal"
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [points, setPoints] = useState<Vec3[] | null>(null)
  const [entered, setEntered] = useState(false)
  const reducedRef = useRef<boolean | null>(null)
  const enteringRef = useRef<boolean | null>(null)
  const enteredAtRef = useRef(0)

  useEffect(() => {
    if (reducedRef.current === null) {
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      enteringRef.current = !reducedRef.current
    }
  }, [])

  /* Code-split shape definitions — only the visited page's
     shape is fetched. */
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const mod =
        shape === "globe-africa"
          ? await import("@/components/centerpiece-shapes/africa-globe")
          : shape === "gear-cluster"
            ? await import("@/components/centerpiece-shapes/gear-cluster")
            : shape === "network"
              ? await import("@/components/centerpiece-shapes/network")
              : shape === "growth"
                ? await import("@/components/centerpiece-shapes/growth")
                : await import("@/components/centerpiece-shapes/signal")
      if (!cancelled) setPoints(mod.POINTS)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [shape])

  /* Entrance — fade + scale 0.8 to 1, 800ms, IO 0.2 once,
     same trigger pattern as the 3D heading. */
  useEffect(() => {
    const el = wrapRef.current
    if (!el || entered) return
    if (reducedRef.current) {
      setEntered(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          enteringRef.current = false
          enteredAtRef.current = performance.now()
          setEntered(true)
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Render loop — rotate the cloud, project, draw dots. */
  useEffect(() => {
    if (!points) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let width = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = wrap.clientWidth
      if (w === width) return
      width = w
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(w * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${w}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const startT = performance.now()
    let rotY = 0
    let rotX = 0

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (width === 0) return

      const idle = !reducedRef.current
      if (idle && enteringRef.current === false) {
        // Slow drift rotation, same feel as the Earth globe.
        rotY = ((t - (enteredAtRef.current || startT)) / 1000) * 0.055
        rotX = Math.sin((t - (enteredAtRef.current || startT)) / 1000) * 0.06
      } else if (enteringRef.current === false && reducedRef.current) {
        rotY = 0.4
        rotX = 0.18
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, width)

      const cx = width / 2
      const cy = width / 2
      const scale = width * 0.36

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      // Sort back to front for depth-correct dot sizing.
      const projected: { x: number; y: number; z: number }[] = []
      for (const p of points) {
        // rotate Y then X
        const x1 = p[0] * cosY - p[2] * sinY
        const z1 = p[0] * sinY + p[2] * cosY
        const y2 = p[1] * cosX - z1 * sinX
        const z2 = p[1] * sinX + z1 * cosX
        projected.push({ x: x1, y: y2, z: z2 })
      }
      projected.sort((a, b) => a.z - b.z)

      for (const pt of projected) {
        const persp = 1 / (1 + (1 - pt.z) * 0.22)
        const sx = cx + pt.x * scale * persp
        const sy = cy + pt.y * scale * persp
        const depth = (pt.z + 1) / 2 // 0 back, 1 front
        const r = 0.55 + depth * 0.75
        const alpha = 0.18 + depth * 0.72
        ctx.globalAlpha = alpha
        ctx.fillStyle = "rgb(235, 240, 255)"
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [points])

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none relative aspect-square w-full ${className}`}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "scale(1)" : "scale(0.8)",
        transition: entered
          ? "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)"
          : "none",
      }}
    >
      {/* Orbital ring — same language as Earth's atmo ring */}
      <div aria-hidden className="absolute -inset-[4%]">
        <div className="atmo-ring orbit-slow h-full w-full rounded-full" />
      </div>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
