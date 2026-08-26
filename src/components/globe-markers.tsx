"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import createGlobe from "cobe"
import type { ClientGeo } from "@/lib/markers"

const DEG = Math.PI / 180
const BASE_THETA = 0.28

function latLngToVec([lat, lng]: [number, number]): [number, number, number] {
  const la = lat * DEG
  const lo = lng * DEG - Math.PI
  return [
    -Math.cos(la) * Math.cos(lo),
    Math.sin(la),
    Math.cos(la) * Math.sin(lo),
  ]
}

function project(
  v: [number, number, number],
  phi: number,
  theta: number,
): { x: number; y: number; visible: boolean } {
  const cp = Math.cos(phi)
  const sp = Math.sin(phi)
  const ct = Math.cos(theta)
  const st = Math.sin(theta)
  const x = cp * v[0] + sp * v[2]
  const y = sp * st * v[0] + ct * v[1] - cp * st * v[2]
  const z = -sp * ct * v[0] + st * v[1] + cp * ct * v[2]
  return {
    x: (x + 1) / 2,
    y: (1 - y) / 2,
    visible: z >= 0 || x * x + y * y >= 0.64,
  }
}

function wrapPi(x: number) {
  return ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI
}

function focusAngles(v: [number, number, number]) {
  const phi = Math.atan2(-v[0], v[2])
  const sp = Math.sin(phi)
  const cp = Math.cos(phi)
  const a = sp * v[0] - cp * v[2]
  return { phi, theta: Math.atan2(v[1], -a) }
}

interface GlobeMarkersProps {
  markers?: ClientGeo[]
  className?: string
  speed?: number
  onSelect?: (id: string | null) => void
}

export function GlobeMarkers({
  markers,
  className = "",
  speed = 0.0022,
  onSelect,
}: GlobeMarkersProps) {
  const vecs = useMemo(
    () => (markers ?? []).map((m) => latLngToVec(m.location)),
    [markers],
  )

  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffset = useRef(0)
  const thetaOffset = useRef(0)
  const basePhi = useRef(0)
  const baseTheta = useRef(BASE_THETA)
  const pausedRef = useRef(false)
  const hoveredRef = useRef<string | null>(null)
  const selectedRef = useRef<string | null>(null)
  const targetRef = useRef<{ phi: number; theta: number } | null>(null)
  const reducedRef = useRef(false)
  const [width, setWidth] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
  }, [])

  const holdMarker = useCallback((id: string) => {
    hoveredRef.current = id
    pausedRef.current = true
  }, [])

  const releaseMarker = useCallback(() => {
    hoveredRef.current = null
    if (!pointerStart.current) pausedRef.current = false
  }, [])

  const handleSelect = useCallback(
    (id: string, i: number) => {
      const next = selectedRef.current === id ? null : id
      selectedRef.current = next
      setSelected(next)
      onSelect?.(next)
      if (!next) {
        targetRef.current = null
        return
      }
      const angles = focusAngles(vecs[i])
      if (reducedRef.current) {
        basePhi.current = angles.phi
        baseTheta.current = angles.theta
        targetRef.current = null
      } else {
        targetRef.current = {
          phi: basePhi.current + wrapPi(angles.phi - basePhi.current),
          theta: angles.theta,
        }
      }
    },
    [vecs, onSelect],
  )

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    pausedRef.current = true
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerStart.current) return
      dragOffset.current = {
        phi: (e.clientX - pointerStart.current.x) / 280,
        theta: (e.clientY - pointerStart.current.y) / 900,
      }
    }
    const handlePointerUp = () => {
      if (pointerStart.current) {
        phiOffset.current += dragOffset.current.phi
        thetaOffset.current += dragOffset.current.theta
        dragOffset.current = { phi: 0, theta: 0 }
      }
      pointerStart.current = null
      pausedRef.current = false
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0]?.contentRect.width ?? 0)
      if (w > 0) setWidth((prev) => (prev === w ? prev : w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width === 0 || !markers?.length) return

    let frame = 0
    let shown = false
    const prefersReduced = reducedRef.current

    const hub = markers[0]?.location
    const spokes = markers.slice(1).map((m) => m.location)

    function lerpLoc(
      a: [number, number],
      b: [number, number],
      t: number,
    ): [number, number] {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
    }

    function smooth(t: number) {
      return t * t * (3 - 2 * t)
    }

    const fullArcs = hub
      ? spokes.map((to) => ({ from: hub, to }))
      : []

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: basePhi.current,
      theta: baseTheta.current,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 20000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.32],
      markerColor: [1, 1, 1],
      glowColor: [0.42, 0.45, 0.55],
      arcColor: [0.78, 0.83, 0.96],
      arcWidth: 0.32,
      arcHeight: 0.24,
      markers: [],
      arcs: prefersReduced ? fullArcs : [],
    })

    const animate = () => {
      const dragging = pointerStart.current !== null
      const target = targetRef.current

      if (!dragging) {
        if (target) {
          const dPhi = target.phi - basePhi.current
          const dTheta = target.theta - baseTheta.current
          if (Math.abs(dPhi) < 0.0015 && Math.abs(dTheta) < 0.0015) {
            basePhi.current = target.phi
            baseTheta.current = target.theta
            targetRef.current = null
          } else {
            basePhi.current += dPhi * 0.085
            baseTheta.current += dTheta * 0.085
          }
        } else if (
          !pausedRef.current &&
          !hoveredRef.current &&
          !selectedRef.current
        ) {
          basePhi.current += speed
        }
      }

      const curPhi = basePhi.current + phiOffset.current + dragOffset.current.phi
      const curTheta =
        baseTheta.current + thetaOffset.current + dragOffset.current.theta

      if (hub && !prefersReduced) {
        const tSec = performance.now() / 1000
        const arcs = spokes.map((to, k) => {
          const phase = (tSec * 0.1 + k * 0.37) % 1
          return { from: hub, to: lerpLoc(hub, to, smooth(phase)) }
        })
        globe.update({ phi: curPhi, theta: curTheta, arcs })
      } else {
        globe.update({ phi: curPhi, theta: curTheta })
      }

      markers.forEach((_, i) => {
        const el = dotRefs.current[i]
        if (!el) return
        const p = project(vecs[i], curPhi, curTheta)
        el.style.left = `${p.x * 100}%`
        el.style.top = `${p.y * 100}%`
        el.style.opacity = p.visible ? "1" : "0"
        el.style.pointerEvents = p.visible ? "auto" : "none"
      })

      if (!shown) {
        shown = true
        canvas.style.opacity = "1"
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      globe.destroy()
    }
  }, [width, speed, markers, vecs])

  const handleTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedRef.current || e.pointerType !== "mouse") return
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    const el = tiltRef.current
    if (!el) return
    el.style.setProperty("--rx", `${(-dy * 4).toFixed(2)}deg`)
    el.style.setProperty("--ry", `${(dx * 5).toFixed(2)}deg`)
  }

  const handleTiltLeave = () => {
    const el = tiltRef.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
  }

  return (
    <div ref={wrapRef} className={`relative aspect-square w-full select-none ${className}`}>
      <div
        ref={tiltRef}
        className="relative h-full w-full"
        style={{
          transform:
            "perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 0.25s ease-out",
          willChange: "transform",
        }}
        onPointerMove={handleTiltMove}
        onPointerLeave={handleTiltLeave}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[4%] z-0 rounded-full"
        >
          <div className="atmo-ring orbit-slow h-full w-full rounded-full" />
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="block h-full w-full"
          style={{
            cursor: "grab",
            opacity: 0,
            transition: "opacity 1s ease",
            touchAction: "none",
          }}
        />
        {(markers ?? []).map((m, i) => {
          const active = selected === m.id
          return (
            <div
              key={m.id}
              ref={(el) => {
                dotRefs.current[i] = el
              }}
              className="group absolute"
              style={{ left: "50%", top: "50%", opacity: 0 }}
            >
              <span
                className={`absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-opacity duration-200 ${
                  active
                    ? "border-gray-900/50 opacity-100 dark:border-white/60"
                    : "border-gray-900/30 opacity-0 group-hover:opacity-70 dark:border-white/40"
                }`}
              />
              <span
                className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 shadow-md ring-2 ring-white/70 transition-transform duration-150 group-hover:scale-125 dark:bg-white dark:ring-gray-950/60 ${
                  active ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                }`}
              />
              <button
                type="button"
                aria-label={`${m.country}, ${m.work}`}
                aria-pressed={active}
                onMouseEnter={() => holdMarker(m.id)}
                onMouseLeave={releaseMarker}
                onFocus={() => holdMarker(m.id)}
                onBlur={releaseMarker}
                onClick={() => handleSelect(m.id, i)}
                onKeyDown={(e) => {
                  if (e.key === "Escape" && active) handleSelect(m.id, i)
                }}
                className="absolute left-0 top-0 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white"
              />
              <span
                role="tooltip"
                className={`pointer-events-none absolute bottom-4 left-0 hidden w-max max-w-[240px] -translate-x-1/2 rounded-2xl bg-gray-900 px-3.5 py-2 text-left shadow-xl transition-all duration-150 lg:block dark:bg-white ${
                  active
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                }`}
              >
                <span className="block text-xs font-semibold text-white dark:text-gray-900">
                  {m.country}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-gray-300 dark:text-gray-600">
                  {m.work}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
