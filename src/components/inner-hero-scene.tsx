"use client"

import { Canvas } from "@react-three/fiber"
import {
  Component,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import {
  AboutGlobeScene,
  type AboutGlobeController,
} from "@/components/hero-scenes/about-globe-scene"

export type InnerHeroSceneName = "about"

type PointerSession = {
  pointerDown: boolean
  dragging: boolean
  pointerId: number
  pointerType: string
  startX: number
  startY: number
  lastX: number
  lastY: number
  lastMoveAt: number
}

const initialPointerSession = (): PointerSession => ({
  pointerDown: false,
  dragging: false,
  pointerId: -1,
  pointerType: "",
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  lastMoveAt: 0,
})

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function AboutSceneFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      data-scene-fallback
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 md:justify-end md:pr-[8vw] ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative aspect-square w-[min(82vw,25rem)] md:w-[min(42vw,31rem)]">
        <div className="absolute inset-[7%] rounded-full border border-cyan-100/15 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.11),transparent_34%),radial-gradient(circle_at_68%_72%,rgba(34,211,238,0.13),transparent_48%),rgba(4,12,25,0.42)] shadow-[0_0_80px_rgba(34,211,238,0.10)]" />
        <div
          className="absolute inset-[9%] rounded-full opacity-55"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(222,240,255,0.72) 0 1px, transparent 1.25px)",
            backgroundSize: "10px 10px",
            maskImage:
              "radial-gradient(circle, black 0%, rgba(0,0,0,0.92) 62%, transparent 96%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 0%, rgba(0,0,0,0.92) 62%, transparent 96%)",
          }}
        />
        <div
          className="absolute left-[47%] top-[27%] h-[48%] w-[29%] opacity-90"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(246,249,255,0.96) 0 1.2px, transparent 1.5px)",
            backgroundSize: "7px 7px",
            clipPath:
              "polygon(16% 0, 72% 4%, 100% 28%, 82% 52%, 65% 68%, 54% 100%, 34% 77%, 20% 51%, 0 31%)",
          }}
        />
        <div className="absolute inset-[3%] rotate-[18deg] rounded-full border border-white/10" />
      </div>
    </div>
  )
}

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

export function InnerHeroScene({ scene }: { scene: InnerHeroSceneName }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const globeController = useRef<AboutGlobeController>(null)
  const pointerSession = useRef<PointerSession>(initialPointerSession())
  const alive = useRef(true)
  const orientationStarted = useRef(false)
  const orientationCleanup = useRef<(() => void) | null>(null)
  const [canUseWebGL, setCanUseWebGL] = useState<boolean | null>(null)
  const [shouldMount, setShouldMount] = useState(false)
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setMobile(mobileQuery.matches)
      setReduced(motionQuery.matches)
    }
    sync()
    mobileQuery.addEventListener("change", sync)
    motionQuery.addEventListener("change", sync)
    return () => {
      mobileQuery.removeEventListener("change", sync)
      motionQuery.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (reduced) {
        setCanUseWebGL(false)
        return
      }
      const probe = document.createElement("canvas")
      const context =
        probe.getContext("webgl2", { powerPreference: "high-performance" }) ??
        probe.getContext("webgl", { powerPreference: "high-performance" })
      context?.getExtension("WEBGL_lose_context")?.loseContext()
      setCanUseWebGL(Boolean(context))
    })
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  useEffect(() => {
    const element = wrapRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setActive(visible)
        if (visible) setShouldMount(true)
      },
      { rootMargin: "100px 0px", threshold: 0 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active || !ready || reduced) return
    const root = document.documentElement
    root.dataset.innerHeroScene = scene
    return () => {
      if (root.dataset.innerHeroScene === scene) {
        delete root.dataset.innerHeroScene
      }
    }
  }, [active, ready, reduced, scene])

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      orientationCleanup.current?.()
    }
  }, [])

  async function enableOrientation() {
    if (orientationStarted.current || reduced) return
    if (!("DeviceOrientationEvent" in window)) return
    orientationStarted.current = true

    const OrientationEvent = window.DeviceOrientationEvent as OrientationConstructor
    if (OrientationEvent.requestPermission) {
      let permission: "granted" | "denied"
      try {
        permission = await OrientationEvent.requestPermission()
      } catch {
        return
      }
      if (permission !== "granted") return
    }
    if (!alive.current) return

    const onOrientation = (event: DeviceOrientationEvent) => {
      globeController.current?.setOrientation(
        clamp((event.gamma ?? 0) / 45, -1, 1),
        ((event.beta ?? 45) - 45) / 60,
      )
    }
    window.addEventListener("deviceorientation", onOrientation, true)
    orientationCleanup.current = () =>
      window.removeEventListener("deviceorientation", onOrientation, true)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!ready || reduced) return
    if (event.pointerType === "mouse" && event.button !== 0) return

    const session = pointerSession.current
    const now = performance.now()
    session.pointerDown = true
    session.dragging = event.pointerType === "mouse"
    session.pointerId = event.pointerId
    session.pointerType = event.pointerType
    session.startX = event.clientX
    session.startY = event.clientY
    session.lastX = event.clientX
    session.lastY = event.clientY
    session.lastMoveAt = now

    if (session.dragging) {
      globeController.current?.beginDrag()
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
      event.preventDefault()
    } else if (event.pointerType === "touch") {
      void enableOrientation()
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const session = pointerSession.current
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.pointerType === "mouse") {
      globeController.current?.setPointer(
        clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      )
    }

    if (!session.pointerDown || session.pointerId !== event.pointerId) return
    if (!session.dragging && session.pointerType === "touch") {
      const totalX = event.clientX - session.startX
      const totalY = event.clientY - session.startY
      if (Math.abs(totalX) < 8 || Math.abs(totalX) <= Math.abs(totalY) * 1.15) {
        return
      }
      session.dragging = true
      globeController.current?.beginDrag()
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }

    const now = performance.now()
    const dx = event.clientX - session.lastX
    const dy = event.clientY - session.lastY
    const frameScale = Math.max((now - session.lastMoveAt) / 16.67, 0.5)
    globeController.current?.drag(dx, dy, frameScale)
    session.lastX = event.clientX
    session.lastY = event.clientY
    session.lastMoveAt = now
    event.preventDefault()
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const session = pointerSession.current
    if (session.pointerId !== event.pointerId) return
    session.pointerDown = false
    session.dragging = false
    session.pointerId = -1
    globeController.current?.endDrag()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
  }

  function onPointerLeave() {
    if (pointerSession.current.pointerDown) return
    globeController.current?.resetPointer()
  }

  const showCanvas = shouldMount && canUseWebGL === true && !reduced

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      data-hero-scene={scene}
      className="absolute inset-0 z-0 overflow-hidden bg-[#03070f]/75"
      style={{
        cursor: ready && !reduced ? (dragging ? "grabbing" : "grab") : "default",
        touchAction: "pan-y",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onPointerLeave}
    >
      <AboutSceneFallback hidden={ready && !reduced} />

      {showCanvas && (
        <SceneBoundary onError={() => setReady(false)}>
          <Canvas
            frameloop="demand"
            dpr={mobile ? [1, 1.5] : [1, 2]}
            camera={{ position: [0, 0, 5], fov: 42, near: 0.1, far: 30 }}
            gl={{
              alpha: true,
              antialias: !mobile,
              powerPreference: "high-performance",
            }}
            fallback={null}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0)
              setReady(true)
            }}
            className={`transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            style={{ pointerEvents: "none" }}
          >
            {scene === "about" && (
              <AboutGlobeScene
                ref={globeController}
                active={active}
                mobile={mobile}
              />
            )}
          </Canvas>
        </SceneBoundary>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,7,15,0.98) 0%, rgba(3,7,15,0.93) 34%, rgba(3,7,15,0.48) 62%, rgba(3,7,15,0.18) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(3,7,15,0.58)_100%)] md:hidden" />
    </div>
  )
}
