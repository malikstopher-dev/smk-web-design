"use client"

import { useFrame, useThree } from "@react-three/fiber"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import * as THREE from "three"

/* ═══════════════════════════════════════════════════════
   SERVICES HERO SCENE — rippling layered dot-wave terrain.
   Three depth planes of points undulating with offset sine
   phases (the "process in motion" feel). Drag shifts the
   wave field horizontally; pointer tilts the camera plane.
   ═══════════════════════════════════════════════════════ */

const WAVE_VERTEX = `
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uScroll;
  attribute vec3 aScatter;
  attribute vec3 color;
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vHeight;

  void main() {
    float eased = 1.0 - pow(1.0 - uProgress, 3.0);
    vec3 settled = position;
    // Ripple: two crossing sine waves scrolling with uScroll.
    float wave = sin(settled.x * 1.6 + uTime * 0.9 + aPhase) * 0.5
               + sin(settled.z * 2.1 - uTime * 0.7 + aPhase * 1.7) * 0.5;
    settled.y += wave * 0.22;
    vec3 transformed = mix(position + aScatter, settled, eased);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vColor = color;
    float depthFade = smoothstep(-9.0, -3.0, mvPosition.z);
    vAlpha = mix(0.28, 1.0, depthFade);
    vHeight = clamp(wave * 0.5 + 0.5, 0.0, 1.0);
    gl_PointSize = aSize * uPixelRatio * (5.0 / max(2.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const WAVE_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vHeight;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.16, 0.5, distanceToCenter)) * vAlpha;
    vec3 color = mix(vColor, vec3(0.93, 0.97, 1.0), vHeight * 0.22);
    gl_FragColor = vec4(color, alpha);
  }
`

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

/* Three dot layers on the XZ plane, receding into depth. */
function buildWave(mobile: boolean) {
  const random = seededRandom(0x77657273)
  const layers = mobile
    ? [
        { count: 900, y: -0.5, z: -2.2, size: 1.6, color: [0.72, 0.82, 0.95] },
        { count: 620, y: -0.9, z: -4.6, size: 1.3, color: [0.55, 0.68, 0.88] },
        { count: 420, y: -1.25, z: -6.8, size: 1.1, color: [0.42, 0.55, 0.78] },
      ]
    : [
        { count: 1500, y: -0.5, z: -2.2, size: 1.7, color: [0.72, 0.82, 0.95] },
        { count: 1050, y: -0.9, z: -4.6, size: 1.35, color: [0.55, 0.68, 0.88] },
        { count: 700, y: -1.25, z: -6.8, size: 1.15, color: [0.42, 0.55, 0.78] },
      ]

  const count = layers.reduce((sum, layer) => sum + layer.count, 0)
  const positions = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  let cursor = 0

  const halfWidth = 5.6
  const halfDepth = 4.6

  for (const layer of layers) {
    const cols = Math.ceil(Math.sqrt(layer.count * (halfWidth / halfDepth)))
    const rows = Math.ceil(layer.count / cols)
    let placed = 0
    for (let row = 0; row < rows && placed < layer.count; row++) {
      for (let col = 0; col < cols && placed < layer.count; col++) {
        const jitterX = (random() - 0.5) * (halfWidth * 2 / cols) * 0.55
        const jitterZ = (random() - 0.5) * (halfDepth * 2 / rows) * 0.55
        const x = -halfWidth + (col / Math.max(cols - 1, 1)) * halfWidth * 2 + jitterX
        const z = -halfDepth + (row / Math.max(rows - 1, 1)) * halfDepth * 2 + jitterZ

        const offset = cursor * 3
        positions[offset] = x
        positions[offset + 1] = layer.y
        positions[offset + 2] = layer.z + z
        colors[offset] = layer.color[0]
        colors[offset + 1] = layer.color[1]
        colors[offset + 2] = layer.color[2]
        sizes[cursor] = layer.size + random() * 0.5
        phases[cursor] = random() * Math.PI * 2

        const theta = random() * Math.PI * 2
        const zz = random() * 2 - 1
        const radial = Math.sqrt(1 - zz * zz)
        const distance = 0.6 + random() * 1.6
        scatter[offset] = Math.cos(theta) * radial * distance
        scatter[offset + 1] = zz * distance * 0.5 + 0.8
        scatter[offset + 2] = Math.sin(theta) * radial * distance

        cursor++
        placed++
      }
    }
  }

  return { positions, scatter, colors, sizes, phases }
}

function FrameScheduler({ active, mobile }: { active: boolean; mobile: boolean }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    invalidate()
    if (!active) return
    let frame = 0
    let lastFrame = 0
    const minimumFrameTime = 1000 / (mobile ? 30 : 60)
    const tick = (time: number) => {
      if (!document.hidden && time - lastFrame >= minimumFrameTime) {
        lastFrame = time
        invalidate()
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, invalidate, mobile])

  return null
}

export type WaveTerrainController = {
  setPointer: (x: number, y: number) => void
  resetPointer: () => void
  setOrientation: (x: number, y: number) => void
  beginDrag: () => void
  drag: (dx: number, dy: number, frameScale: number) => void
  endDrag: () => void
}

type WaveControls = {
  dragging: boolean
  pointerX: number
  pointerY: number
  orientationX: number
  orientationY: number
  scroll: number
  velocityScroll: number
  velocityTilt: number
  tilt: number
  lastInteractionAt: number
}

const DRAG_SCROLL = 0.0035
const DRAG_TILT = 0.0028
const TILT_LIMIT = 0.3
const IDLE_SCROLL = 0.05

export const WaveTerrainScene = forwardRef<
  WaveTerrainController,
  {
    active: boolean
    mobile: boolean
  }
>(function WaveTerrainScene({ active, mobile }, controllerRef) {
  const controlsRef = useRef<WaveControls>({
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    orientationX: 0,
    orientationY: 0,
    scroll: 0,
    velocityScroll: 0,
    velocityTilt: 0,
    tilt: 0.12,
    lastInteractionAt: 0,
  })
  const tiltRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const enteredAt = useRef<number | null>(null)
  const smoothedTilt = useRef(0.12)
  const wave = useMemo(() => buildWave(mobile), [mobile])
  const pixelRatio = useThree((state) => state.gl.getPixelRatio())
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    [pixelRatio],
  )

  useImperativeHandle(
    controllerRef,
    () => ({
      setPointer(x, y) {
        controlsRef.current.pointerX = x
        controlsRef.current.pointerY = y
      },
      resetPointer() {
        controlsRef.current.pointerX = 0
        controlsRef.current.pointerY = 0
      },
      setOrientation(x, y) {
        controlsRef.current.orientationX = clampUnit(x)
        controlsRef.current.orientationY = clampUnit(y)
      },
      beginDrag() {
        controlsRef.current.dragging = true
        controlsRef.current.velocityScroll = 0
        controlsRef.current.velocityTilt = 0
        controlsRef.current.lastInteractionAt = performance.now()
      },
      drag(dx, dy, frameScale) {
        const controls = controlsRef.current
        const scrollDelta = -dx * DRAG_SCROLL
        const tiltDelta = dy * DRAG_TILT
        controls.scroll += scrollDelta
        controls.tilt = clampTiltValue(controls.tilt + tiltDelta)
        controls.velocityScroll = scrollDelta / frameScale
        controls.velocityTilt = tiltDelta / frameScale
        controls.lastInteractionAt = performance.now()
      },
      endDrag() {
        controlsRef.current.dragging = false
        controlsRef.current.lastInteractionAt = performance.now()
      },
    }),
    [],
  )

  useFrame((state, delta) => {
    const tilt = tiltRef.current
    const material = materialRef.current
    if (!tilt || !material) return

    if (enteredAt.current === null) enteredAt.current = state.clock.elapsedTime
    material.uniforms.uProgress.value = Math.min(
      (state.clock.elapsedTime - enteredAt.current) / 1.3,
      1,
    )
    material.uniforms.uPixelRatio.value = pixelRatio

    const controls = controlsRef.current
    const frameScale = Math.min(delta * 60, 2)
    if (!controls.dragging) {
      controls.scroll += controls.velocityScroll * frameScale
      controls.tilt = clampTiltValue(
        controls.tilt + controls.velocityTilt * frameScale,
      )
      const decay = Math.exp(-5.2 * delta)
      controls.velocityScroll *= decay
      controls.velocityTilt *= decay
      if (
        performance.now() - controls.lastInteractionAt > 1800 &&
        Math.abs(controls.velocityScroll) < 0.0004
      ) {
        controls.scroll += delta * IDLE_SCROLL
      }
    }

    // Pointer/orientation shifts the wave field laterally.
    const targetShift = clampShift(
      controls.pointerX * 0.35 + controls.orientationX * 0.2,
    )
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uScroll.value = controls.scroll + targetShift

    const targetTilt =
      0.12 +
      clampTiltSmall(
        -controls.pointerY * 0.05 + controls.orientationY * 0.04,
      )
    const smoothing = 1 - Math.exp(-5.5 * delta)
    smoothedTilt.current += (targetTilt - smoothedTilt.current) * smoothing
    tilt.rotation.x = controls.tilt + smoothedTilt.current
  })

  return (
    <>
      <FrameScheduler active={active} mobile={mobile} />
      <group ref={tiltRef} rotation={[0.12, 0, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[wave.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-aScatter"
              args={[wave.scatter, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[wave.colors, 3]}
            />
            <bufferAttribute
              attach="attributes-aSize"
              args={[wave.sizes, 1]}
            />
            <bufferAttribute
              attach="attributes-aPhase"
              args={[wave.phases, 1]}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={materialRef}
            vertexShader={WAVE_VERTEX}
            fragmentShader={WAVE_FRAGMENT}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>
    </>
  )
})

function clampTiltValue(value: number) {
  return Math.min(Math.max(value, -TILT_LIMIT), TILT_LIMIT)
}

function clampTiltSmall(value: number) {
  return Math.min(Math.max(value, -0.08), 0.08)
}

function clampShift(value: number) {
  return Math.min(Math.max(value, -0.6), 0.6)
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, -1), 1)
}
