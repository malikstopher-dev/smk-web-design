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
import {
  BlogGlobeScene,
  type BlogGlobeController,
} from "@/components/hero-scenes/blog-globe-scene"
import {
  WaveTerrainScene,
  type WaveTerrainController,
} from "@/components/hero-scenes/wave-terrain-scene"
import {
  RingScene,
  type RingSceneController,
} from "@/components/hero-scenes/ring-scene"
import {
  StreamScene,
  type StreamSceneController,
} from "@/components/hero-scenes/stream-scene"

export type InnerHeroSceneName = "about" | "blog" | "services" | "pricing" | "work"

type SceneController = AboutGlobeController &
  BlogGlobeController &
  WaveTerrainController &
  RingSceneController &
  StreamSceneController

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

/* Blog data labels — post counts layered over the globe.
   Static positions, no per-frame DOM writes. */
const BLOG_LABELS = [
  { count: "16", label: "SEO" },
  { count: "17", label: "Web Design" },
  { count: "12", label: "Growth" },
  { count: "50", label: "Posts" },
]

function BlogSceneFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      data-scene-fallback
      className={`absolute inset-0 transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute inset-0 flex items-center justify-end md:pr-[7vw]">
        <div className="relative aspect-square w-[min(90vw,24rem)] md:w-[min(44vw,30rem)]">
          <div className="absolute inset-[6%] rounded-full border border-sky-200/15 bg-[radial-gradient(circle_at_36%_28%,rgba(255,255,255,0.1),transparent_36%),radial-gradient(circle_at_66%_74%,rgba(56,160,238,0.14),transparent_46%),rgba(4,14,28,0.4)] shadow-[0_0_90px_rgba(56,160,238,0.12)]" />
          <div
            className="absolute inset-[8%] rounded-full opacity-6"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(214,234,255,0.66) 0 1px, transparent 1.25px)",
              backgroundSize: "9px 9px",
              maskImage:
                "radial-gradient(circle, black 0%, rgba(0,0,0,0.9) 60%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 0%, rgba(0,0,0,0.9) 60%, transparent 95%)",
            }}
          />
          <div className="absolute left-[36%] top-[30%] h-2 w-2 rounded-full bg-[#7dd3fc] shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
          <div className="absolute left-[62%] top-[58%] h-1.5 w-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
          <div className="absolute left-[58%] top-[44%] h-1 w-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          <div className="absolute inset-[2%] rotate-[12deg] rounded-full border border-sky-200/10" />
        </div>
      </div>
      <BlogLabels />
    </div>
  )
}

function BlogLabels() {
  return (
    <div className="absolute bottom-[12%] right-[6vw] hidden flex-col gap-2 md:flex">
      {BLOG_LABELS.map((item, index) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 border border-white/10 bg-[#050a14]/70 px-3 py-1.5 backdrop-blur-sm"
          style={{ marginRight: index % 2 === 0 ? 0 : "1.5rem" }}
        >
          <span
            className={`font-display text-lg leading-none ${
              item.label === "Posts" ? "text-[#e8b04b]" : "text-white"
            }`}
          >
            {item.count}
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* Services fallback — layered dot-wave rows in pure CSS. */
function ServicesSceneFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      data-scene-fallback
      className={`absolute inset-0 transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      {[0, 1, 2].map((layer) => (
        <div
          key={layer}
          className="absolute left-1/2"
          style={{
            bottom: `${4 + layer * 9}%`,
            width: `${140 - layer * 24}vw`,
            height: "26%",
            transform: "translateX(-50%)",
            backgroundImage: `radial-gradient(circle, rgba(${190 - layer * 30},${210 - layer * 30},${240 - layer * 25}, ${0.55 - layer * 0.14}) 0 1.1px, transparent 1.4px)`,
            backgroundSize: `${14 + layer * 4}px ${14 + layer * 4}px`,
            maskImage:
              "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)",
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(3,7,15,0.7))]" />
    </div>
  )
}

/* Pricing fallback — a CSS ring with a gold arc segment. */
function PricingSceneFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      data-scene-fallback
      className={`absolute inset-0 transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute inset-0 flex items-center justify-end md:pr-[8vw]">
        <div
          className="relative aspect-square w-[min(80vw,22rem)] rotate-[24deg] md:w-[min(40vw,30rem)]"
          style={{ transform: "perspective(1000px) rotateX(56deg) rotateZ(6deg)" }}
        >
          {/* Track */}
          <div className="absolute inset-0 rounded-full border border-slate-300/25" />
          {/* Dotted texture on the track */}
          <div
            className="absolute inset-[2%] rounded-full opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(190,205,235,0.6) 0 1px, transparent 1.3px)",
              backgroundSize: "12px 12px",
              maskImage:
                "radial-gradient(circle, transparent 54%, black 60%, black 92%, transparent 96%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 54%, black 60%, black 92%, transparent 96%)",
            }}
          />
          {/* Gold arc */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 100deg, transparent 0deg, rgba(232,176,75,0) 8deg, rgba(232,176,75,0.85) 52deg, rgba(252,211,77,0.95) 62deg, rgba(232,176,75,0) 70deg, transparent 70deg)",
              maskImage:
                "radial-gradient(circle, transparent 54%, black 60%, black 92%, transparent 96%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 54%, black 60%, black 92%, transparent 96%)",
            }}
          />
          {/* Faint inner counter-ring */}
          <div className="absolute inset-[22%] rounded-full border border-slate-300/15" />
          <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(120,150,210,0.12)_100%)]" />
        </div>
      </div>
    </div>
  )
}

/* Work fallback — a CSS spiral vortex of dots. */
function WorkSceneFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      data-scene-fallback
      className={`absolute inset-0 transition-opacity duration-700 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute inset-0 flex items-center justify-end md:pr-[8vw]">
        <div
          className="relative aspect-square w-[min(84vw,23rem)] md:w-[min(42vw,30rem)]"
          style={{ transform: "perspective(1100px) rotateX(52deg)" }}
        >
          {[0, 1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: `${96 - ring * 22}%`,
                height: `${96 - ring * 22}%`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `radial-gradient(circle, rgba(${168 - ring * 14},${196 - ring * 12},${232 - ring * 10}, ${0.5 - ring * 0.09}) 0 1px, transparent 1.3px)`,
                backgroundSize: `${11 + ring * 3}px ${11 + ring * 3}px`,
                maskImage:
                  "radial-gradient(circle, transparent 52%, black 62%, black 94%, transparent)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 52%, black 62%, black 94%, transparent)",
              }}
            />
          ))}
          {/* Core */}
          <div className="absolute left-1/2 top-1/2 h-[7%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(3,7,15,0.95)_30%,rgba(88,110,168,0.4)_78%,transparent_100%)] shadow-[0_0_34px_rgba(88,110,168,0.35)]" />
          {/* Gold sparks */}
          <div className="absolute left-[38%] top-[42%] h-1.5 w-1.5 rounded-full bg-[#f4d03c] shadow-[0_0_10px_rgba(244,208,60,0.8)]" />
          <div className="absolute left-[62%] top-[58%] h-1 w-1 rounded-full bg-[#f4d03c]/80 shadow-[0_0_8px_rgba(244,208,60,0.6)]" />
        </div>
      </div>
    </div>
  )
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
  const globeController = useRef<SceneController>(null)
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
      {scene === "about" && <AboutSceneFallback hidden={ready && !reduced} />}
      {scene === "blog" && <BlogSceneFallback hidden={ready && !reduced} />}
      {scene === "services" && (
        <ServicesSceneFallback hidden={ready && !reduced} />
      )}
      {scene === "pricing" && (
        <PricingSceneFallback hidden={ready && !reduced} />
      )}
      {scene === "work" && <WorkSceneFallback hidden={ready && !reduced} />}
      {scene === "blog" && ready && !reduced && (
        <div className="pointer-events-none absolute inset-0 transition-opacity duration-700">
          <BlogLabels />
        </div>
      )}

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
            {scene === "blog" && (
              <BlogGlobeScene
                ref={globeController}
                active={active}
                mobile={mobile}
              />
            )}
            {scene === "services" && (
              <WaveTerrainScene
                ref={globeController}
                active={active}
                mobile={mobile}
              />
            )}
            {scene === "pricing" && (
              <RingScene
                ref={globeController}
                active={active}
                mobile={mobile}
              />
            )}
            {scene === "work" && (
              <StreamScene
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
            scene === "blog"
              ? "linear-gradient(90deg, rgba(3,7,15,0.99) 0%, rgba(3,7,15,0.94) 38%, rgba(3,7,15,0.55) 64%, rgba(3,7,15,0.26) 100%)"
              : scene === "services"
                ? "linear-gradient(180deg, rgba(3,7,15,0.9) 0%, rgba(3,7,15,0.36) 46%, rgba(3,7,15,0.2) 72%, rgba(3,7,15,0.72) 100%), linear-gradient(90deg, rgba(3,7,15,0.98) 0%, rgba(3,7,15,0.82) 40%, transparent 75%)"
                : "linear-gradient(90deg, rgba(3,7,15,0.98) 0%, rgba(3,7,15,0.93) 34%, rgba(3,7,15,0.48) 62%, rgba(3,7,15,0.18) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(3,7,15,0.58)_100%)] md:hidden" />
      {scene === "blog" && (
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_62%_44%,transparent_30%,rgba(3,7,15,0.5)_78%,rgba(3,7,15,0.82)_100%)] md:block" />
      )}
    </div>
  )
}
