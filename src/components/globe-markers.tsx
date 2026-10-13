"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createEarthGlobe } from "@/lib/earth-globe"
import type { ClientGeo } from "@/lib/markers"
import { SCENE_MOTION, sceneFrame, subscribeScene, wakeScene } from "@/lib/scene-runtime"
import styles from "./globe-markers.module.css"

const DEG = Math.PI / 180
const BASE_THETA = 0.28
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))

function latLngToVec([lat, lng]: [number, number]): [number, number, number] {
  const la = lat * DEG
  const lo = lng * DEG - Math.PI
  return [-Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]
}
function project(v: [number, number, number], phi: number, theta: number) {
  const cp = Math.cos(phi), sp = Math.sin(phi), ct = Math.cos(theta), st = Math.sin(theta)
  const x = cp * v[0] + sp * v[2]
  const y = sp * st * v[0] + ct * v[1] - cp * st * v[2]
  const z = -sp * ct * v[0] + st * v[1] + cp * ct * v[2]
  return { x: (x * 0.8 + 1) / 2, y: (1 - y * 0.8) / 2, visible: z > 0.025 }
}
function wrapPi(x: number) { return ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI }
function focusAngles(v: [number, number, number]) {
  const phi = Math.atan2(-v[0], v[2])
  return { phi, theta: Math.atan2(v[1], -(Math.sin(phi) * v[0] - Math.cos(phi) * v[2])) }
}

interface LocalizedClientGeo extends ClientGeo {
  country: string
  work: string
}

interface GlobeMarkersProps {
  markers?: LocalizedClientGeo[]
  className?: string
  speed?: number
  onSelect?: (id: string | null) => void
  cinematic?: boolean
  renderWithoutMarkers?: boolean
  selectedId?: string | null
  rotationStep?: number
  paused?: boolean
  interactionLabel?: string
}

export function GlobeMarkers({ markers, className = "", speed = 0.0022, onSelect, cinematic = false, renderWithoutMarkers = false, selectedId, rotationStep = 0, paused = false, interactionLabel }: GlobeMarkersProps) {
  const vecs = useMemo(() => (markers ?? []).map(m => latLngToVec(m.location)), [markers])
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const phi = useRef(-1.95)
  const theta = useRef(BASE_THETA)
  const velocity = useRef({ x: 0, y: 0 })
  const pointer = useRef<{ x: number; y: number; startX: number; startY: number; time: number; type: string } | null>(null)
  const held = useRef(false)
  const selectedRef = useRef<string | null>(null)
  const target = useRef<{ phi: number; theta: number } | null>(null)
  const [internalSelected, setSelected] = useState<string | null>(null)
  const selected = selectedId === undefined ? internalSelected : selectedId
  const pausedRef = useRef(paused)
  const lastStep = useRef(rotationStep)
  const [width, setWidth] = useState(0)
  const [shouldRender, setShouldRender] = useState(false)

  const handleSelect = useCallback((id: string, index: number) => {
    const next = selectedRef.current === id ? null : id
    selectedRef.current = next
    setSelected(next)
    onSelect?.(next)
    velocity.current = { x: 0, y: 0 }
    if (next) {
      const angles = focusAngles(vecs[index])
      if (sceneFrame.reduced) {
        phi.current = angles.phi
        theta.current = angles.theta
        target.current = null
      } else target.current = { phi: phi.current + wrapPi(angles.phi - phi.current), theta: angles.theta }
    } else target.current = null
    wakeScene()
  }, [vecs, onSelect])

  useEffect(() => {
    pausedRef.current = paused
    wakeScene()
  }, [paused])
  useEffect(() => {
    if (selectedId === undefined || selectedId === selectedRef.current) return
    selectedRef.current = selectedId
    velocity.current = { x: 0, y: 0 }
    const index = markers?.findIndex(marker => marker.id === selectedId) ?? -1
    if (index >= 0) {
      const angles = focusAngles(vecs[index])
      target.current = { phi: phi.current + wrapPi(angles.phi - phi.current), theta: angles.theta }
    } else target.current = null
    wakeScene()
  }, [selectedId, markers, vecs])
  useEffect(() => {
    phi.current += (rotationStep - lastStep.current) * Math.PI / 6
    lastStep.current = rotationStep
    target.current = null
    velocity.current = { x: 0, y: 0 }
    wakeScene()
  }, [rotationStep])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const size = Math.round(entry.contentRect.width)
      if (size > 0) setWidth(prev => prev === size ? prev : size)
    })
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShouldRender(true); io.disconnect() }
    }, { rootMargin: "120px" })
    ro.observe(el)
    io.observe(el)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const drag = pointer.current
      if (!drag) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      if (drag.type === "touch" && Math.abs(e.clientY - drag.startY) > 8 && Math.abs(e.clientY - drag.startY) > Math.abs(e.clientX - drag.startX) * 1.2) {
        pointer.current = null
        velocity.current = { x: 0, y: 0 }
        return
      }
      const dt = Math.max((e.timeStamp - drag.time) / 1000, 0.008)
      const yaw = dx / 220
      const pitch = dy / 600
      phi.current += yaw
      theta.current = clamp(theta.current + pitch, -0.65, 0.95)
      velocity.current = { x: clamp(yaw / dt, -1.6, 1.6), y: clamp(pitch / dt, -0.65, 0.65) }
      drag.x = e.clientX; drag.y = e.clientY; drag.time = e.timeStamp
      wakeScene()
    }
    const up = (e: PointerEvent) => {
      if (e.type === "pointercancel") velocity.current = { x: 0, y: 0 }
      pointer.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      wakeScene()
    }
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerup", up, { passive: true })
    window.addEventListener("pointercancel", up, { passive: true })
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!shouldRender || !canvas || !wrap || !width || (!markers?.length && !renderWithoutMarkers)) return
    let inView = true
    let px = 0, py = 0, surfaceTime = 0
    let cancelled = false
    let globe: ReturnType<typeof createEarthGlobe> | undefined
    delete wrap.dataset.ready
    delete wrap.dataset.fallback
    canvas.style.opacity = "0"
    // Initialise near the viewport; the module is shared with the planet scene.
    try {
      if (cancelled) return
      globe = createEarthGlobe(canvas, {
        compact: sceneFrame.compact,
        locations: vecs,
        onReady: () => {
          if (cancelled) return
          wrap.dataset.ready = "true"
          canvas.style.opacity = "1"
          wakeScene()
        },
        onTextureLoad: wakeScene,
      })
      wakeScene()
    } catch {
      if (!cancelled) wrap.dataset.fallback = "true"
    }
    const unsubscribe = subscribeScene(s => {
      if (!inView || !globe) return
      const dt = s.delta
      const settle = 1 - Math.exp(-5 * dt)
      const dragging = pointer.current !== null
      const focused = selectedRef.current !== null || held.current
      if (s.reduced) {
        velocity.current = { x: 0, y: 0 }
        if (target.current) { phi.current = target.current.phi; theta.current = target.current.theta; target.current = null }
      } else if (!dragging) {
        if (target.current) {
          phi.current += (target.current.phi - phi.current) * settle
          theta.current += (target.current.theta - theta.current) * settle
          if (Math.abs(target.current.phi - phi.current) + Math.abs(target.current.theta - theta.current) < 0.001) target.current = null
        } else if (!focused && !pausedRef.current) {
          const inertia = Math.abs(velocity.current.x) > 0.008
          phi.current += velocity.current.x * dt + (inertia ? 0 : (cinematic ? SCENE_MOTION.globeRadiansPerSecond : speed * 60) * dt)
          theta.current = clamp(theta.current + velocity.current.y * dt, -0.65, 0.95)
          const decay = Math.exp(-SCENE_MOTION.dragDamping * dt)
          velocity.current.x *= decay
          velocity.current.y *= decay
        }
      }
      const respond = cinematic && !dragging && !focused && !s.reduced
      px += ((respond ? s.pointerX : 0) - px) * settle
      py += ((respond ? s.pointerY : 0) - py) * settle
      if (s.reduced) px = py = 0
      const curPhi = phi.current + px * SCENE_MOTION.globePointerYaw
      const curTheta = theta.current + py * SCENE_MOTION.globePointerPitch
      if (!focused && !dragging && !s.reduced && !pausedRef.current) surfaceTime += dt
      const dpr = Math.max(1, Math.min(devicePixelRatio || 1, s.compact ? 1.25 : 1.75) * s.quality)
      globe.update({ phi: curPhi, theta: curTheta, time: surfaceTime, width, dpr })
      wrap.dataset.rotation = curPhi.toFixed(3)
      const markerList = markers ?? []
      markerList.forEach((_, i) => {
        const el = dotRefs.current[i]
        if (!el) return
        const p = project(vecs[i], curPhi, curTheta)
        el.style.transform = `translate3d(${(p.x * width).toFixed(2)}px, ${(p.y * width).toFixed(2)}px, 0)`
        const visible = p.visible && wrap.dataset.ready === "true"
        el.style.opacity = visible ? "1" : "0"
        el.style.pointerEvents = visible ? "auto" : "none"
        const button = el.querySelector("button")
        if (button) button.tabIndex = visible ? 0 : -1
      })
    })
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; wakeScene() })
    observer.observe(canvas)
    return () => { cancelled = true; unsubscribe(); observer.disconnect(); globe?.destroy() }
  }, [width, speed, markers, vecs, shouldRender, cinematic, renderWithoutMarkers])

  return <div ref={wrapRef} data-earth-globe className={`relative aspect-square w-full select-none ${styles.globe} ${className}`}>
    <div aria-hidden className={styles.placeholder} />
    <canvas ref={canvasRef}
      tabIndex={interactionLabel ? 0 : undefined}
      role={interactionLabel ? "group" : undefined}
      aria-label={interactionLabel}
      onKeyDown={e => {
        if (!["ArrowLeft", "ArrowRight", "Home"].includes(e.key)) return
        e.preventDefault()
        phi.current = e.key === "Home" ? -1.95 : phi.current + (e.key === "ArrowRight" ? 1 : -1) * Math.PI / 12
        target.current = null
        velocity.current = { x: 0, y: 0 }
        wakeScene()
      }}
      onPointerDown={e => {
        if (e.pointerType === "mouse" && e.button !== 0) return
        pointer.current = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, time: e.timeStamp, type: e.pointerType }
        velocity.current = { x: 0, y: 0 }
        target.current = null
        selectedRef.current = null
        setSelected(null)
        onSelect?.(null)
        e.currentTarget.style.cursor = "grabbing"
      }}
      className="relative z-[2] block h-full w-full"
      style={{ cursor: "grab", opacity: 0, transition: "opacity 0.7s ease", touchAction: "pan-y" }}
    />
    {(markers ?? []).map((m, i) => {
      const active = selected === m.id
      return <div key={m.id} ref={el => { dotRefs.current[i] = el }} data-selected={active} className={`group absolute ${styles.marker}`} style={{ left: 0, top: 0, opacity: 0 }}>
        <span aria-hidden className={styles.pulse} />
        <span className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8b04b] shadow-[0_0_14px_rgba(232,176,75,0.7)] ring-2 ring-gray-950/60 transition-transform duration-300 group-hover:scale-150 group-focus-within:scale-150 ${active ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`} />
        <button type="button" tabIndex={-1} aria-label={`${m.country}, ${m.work}`} aria-pressed={active}
          onMouseEnter={() => { held.current = true; velocity.current = { x: 0, y: 0 } }}
          onMouseLeave={() => { held.current = false }}
          onFocus={() => { held.current = true; velocity.current = { x: 0, y: 0 } }}
          onBlur={() => { held.current = false }}
          onClick={() => handleSelect(m.id, i)}
          onKeyDown={e => { if (e.key === "Escape" && active) handleSelect(m.id, i) }}
          className="absolute left-0 top-0 h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
        <span role="tooltip" className={`pointer-events-none absolute bottom-5 left-0 hidden w-max max-w-[240px] -translate-x-1/2 rounded-2xl bg-white px-3.5 py-2 text-left shadow-xl transition-[opacity,translate] duration-300 lg:block ${cinematic ? styles.cinematicTooltip : ""} ${active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"}`}>
          <span className={`block text-xs font-semibold ${cinematic ? "text-white" : "text-gray-900"}`}>{m.country}</span>
          <span className={`mt-0.5 block text-[11px] leading-snug ${cinematic ? "text-white/75" : "text-gray-600"}`}>{m.work}</span>
        </span>
      </div>
    })}
  </div>
}
