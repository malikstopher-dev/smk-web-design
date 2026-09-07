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
   PRICING HERO SCENE — minimal rotating ring with one gold
   arc. A thin dotted track plus one bright arc segment that
   travels; a second faint counter-rotating ring gives depth.
   The cheapest scene of the set — deliberately quiet.
   ═══════════════════════════════════════════════════════ */

const RING_VERTEX = `
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute vec3 aScatter;
  attribute vec3 color;
  attribute float aSize;
  attribute float aAngle;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float eased = 1.0 - pow(1.0 - uProgress, 3.0);
    vec3 transformed = mix(position + aScatter, position, eased);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vColor = color;
    vAlpha = 1.0;
    gl_PointSize = aSize * uPixelRatio * (5.0 / max(2.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const RING_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.14, 0.5, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

const TRACK_COLOR: readonly [number, number, number] = [0.55, 0.66, 0.85]
const ARC_COLOR: readonly [number, number, number] = [0.95, 0.72, 0.3]

function buildRing(mobile: boolean) {
  const random = seededRandom(0x72696e67)
  const trackCount = mobile ? 340 : 520
  const arcCount = mobile ? 42 : 64
  const faintCount = mobile ? 120 : 180
  const count = trackCount + arcCount + faintCount
  const positions = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  let cursor = 0

  const addRingPoint = (
    angle: number,
    radius: number,
    y: number,
    color: readonly [number, number, number],
    size: number,
    lift = 0,
  ) => {
    const offset = cursor * 3
    positions[offset] = Math.cos(angle) * radius
    positions[offset + 1] = y + Math.sin(angle * 3) * lift
    positions[offset + 2] = Math.sin(angle) * radius
    colors[offset] = color[0]
    colors[offset + 1] = color[1]
    colors[offset + 2] = color[2]
    sizes[cursor] = size

    const theta = random() * Math.PI * 2
    const zz = random() * 2 - 1
    const radial = Math.sqrt(1 - zz * zz)
    const distance = 0.4 + random() * 1.0
    scatter[offset] = Math.cos(theta) * radial * distance
    scatter[offset + 1] = zz * distance
    scatter[offset + 2] = Math.sin(theta) * radial * distance
    cursor++
  }

  // Main track — even spacing, slight vertical shimmer.
  for (let i = 0; i < trackCount; i++) {
    addRingPoint(
      (i / trackCount) * Math.PI * 2,
      1,
      0,
      TRACK_COLOR,
      1.9 + random() * 0.4,
      0.012,
    )
  }

  // The gold arc — one segment of the circle, brighter.
  const arcSpan = Math.PI * 0.34
  const arcBase = 0.6
  for (let i = 0; i < arcCount; i++) {
    const t = i / (arcCount - 1)
    const edge = Math.sin(t * Math.PI)
    addRingPoint(
      arcBase + t * arcSpan,
      1,
      0,
      ARC_COLOR,
      2.6 + edge * 1.4,
      0.016,
    )
  }

  // Faint counter ring — smaller radius, slight tilt applied
  // by the parent group, gives depth without noise.
  for (let i = 0; i < faintCount; i++) {
    addRingPoint(
      (i / faintCount) * Math.PI * 2 + 1.2,
      0.72,
      -0.05,
      [0.42, 0.5, 0.68],
      1.5 + random() * 0.3,
      0.008,
    )
  }

  return { positions, scatter, colors, sizes }
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

export type RingSceneController = {
  setPointer: (x: number, y: number) => void
  resetPointer: () => void
  setOrientation: (x: number, y: number) => void
  beginDrag: () => void
  drag: (dx: number, dy: number, frameScale: number) => void
  endDrag: () => void
}

type RingControls = {
  dragging: boolean
  pointerX: number
  pointerY: number
  orientationX: number
  orientationY: number
  yaw: number
  pitch: number
  velocityYaw: number
  velocityPitch: number
  lastInteractionAt: number
}

const DRAG_YAW = 0.006
const DRAG_PITCH = 0.004
const IDLE_SPEED = 0.14
const PITCH_LIMIT = 0.5

export const RingScene = forwardRef<
  RingSceneController,
  {
    active: boolean
    mobile: boolean
  }
>(function RingScene({ active, mobile }, controllerRef) {
  const controlsRef = useRef<RingControls>({
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    orientationX: 0,
    orientationY: 0,
    yaw: 0.4,
    pitch: 0.42,
    velocityYaw: 0,
    velocityPitch: 0,
    lastInteractionAt: 0,
  })
  const tiltRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const enteredAt = useRef<number | null>(null)
  const tiltX = useRef(0)
  const tiltY = useRef(0)
  const ring = useMemo(() => buildRing(mobile), [mobile])
  const pixelRatio = useThree((state) => state.gl.getPixelRatio())
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: { value: pixelRatio },
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
        controlsRef.current.velocityYaw = 0
        controlsRef.current.velocityPitch = 0
        controlsRef.current.lastInteractionAt = performance.now()
      },
      drag(dx, dy, frameScale) {
        const controls = controlsRef.current
        const yawDelta = -dx * DRAG_YAW
        const pitchDelta = -dy * DRAG_PITCH
        controls.yaw += yawDelta
        controls.pitch = clampPitch(controls.pitch + pitchDelta)
        controls.velocityYaw = yawDelta / frameScale
        controls.velocityPitch = pitchDelta / frameScale
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
    const ringGroup = ringRef.current
    const material = materialRef.current
    if (!tilt || !ringGroup || !material) return

    if (enteredAt.current === null) enteredAt.current = state.clock.elapsedTime
    material.uniforms.uProgress.value = Math.min(
      (state.clock.elapsedTime - enteredAt.current) / 1.15,
      1,
    )
    material.uniforms.uPixelRatio.value = pixelRatio

    const controls = controlsRef.current
    const frameScale = Math.min(delta * 60, 2)
    if (!controls.dragging) {
      controls.yaw += controls.velocityYaw * frameScale
      controls.pitch = clampPitch(
        controls.pitch + controls.velocityPitch * frameScale,
      )
      const decay = Math.exp(-5.2 * delta)
      controls.velocityYaw *= decay
      controls.velocityPitch *= decay
      if (
        performance.now() - controls.lastInteractionAt > 1500 &&
        Math.abs(controls.velocityYaw) < 0.0004
      ) {
        controls.yaw += delta * IDLE_SPEED
      }
    }

    const targetTiltY = clampTilt(
      controls.pointerX * 0.15 + controls.orientationX * 0.09,
    )
    const targetTiltX = clampTilt(
      -controls.pointerY * 0.09 + controls.orientationY * 0.06,
    )
    const smoothing = 1 - Math.exp(-5.5 * delta)
    tiltX.current += (targetTiltX - tiltX.current) * smoothing
    tiltY.current += (targetTiltY - tiltY.current) * smoothing
    tilt.rotation.x = tiltX.current
    tilt.rotation.y = tiltY.current

    // The ring lies near-horizontal, tilted toward the viewer;
    // yaw spins it around its own axis.
    ringGroup.rotation.x = controls.pitch
    ringGroup.rotation.y = controls.yaw
    // Gold arc travels slowly around the track even while the
    // ring idles: rotate the whole ring by yaw, arc position is
    // fixed in the ring's local space.
  })

  return (
    <>
      <FrameScheduler active={active} mobile={mobile} />
      <group
        ref={tiltRef}
        position={mobile ? [0, -0.06, 0] : [2.15, -0.04, 0]}
        scale={mobile ? 1.5 : 1.74}
      >
        <group ref={ringRef} rotation={[0.42, 0, 0.1]}>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[ring.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-aScatter"
                args={[ring.scatter, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[ring.colors, 3]}
              />
              <bufferAttribute
                attach="attributes-aSize"
                args={[ring.sizes, 1]}
              />
            </bufferGeometry>
            <shaderMaterial
              ref={materialRef}
              vertexShader={RING_VERTEX}
              fragmentShader={RING_FRAGMENT}
              uniforms={uniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </points>
        </group>
      </group>
    </>
  )
})

function clampPitch(value: number) {
  return Math.min(Math.max(value, -PITCH_LIMIT), PITCH_LIMIT)
}

function clampTilt(value: number) {
  return Math.min(Math.max(value, -0.22), 0.22)
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, -1), 1)
}
