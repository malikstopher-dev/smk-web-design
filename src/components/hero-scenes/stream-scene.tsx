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
   WORK HERO SCENE — code-stream singularity. A stream of
   glyph points spirals inward toward a dark core: particles
   spawn on an outer disc and spiral toward the centre,
   fading as they approach. Cool steel-blue stream, one or
   two gold particles in the mix (the "won client" sparks).
   The stream always flows; drag rotates the disc plane.
   ═══════════════════════════════════════════════════════ */

const STREAM_VERTEX = `
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uSpin;
  attribute vec3 aScatter;
  attribute vec3 color;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float eased = 1.0 - pow(1.0 - uProgress, 3.0);

    // Spiral: each particle has an angle + radius; radius
    // decays toward the core over its cycle, angle advances.
    float cycle = fract(uTime * aSpeed + aPhase);
    float radius = mix(1.45, 0.08, cycle);
    float angle = aPhase * 6.2831 + uTime * (0.5 + aSpeed * 0.6) + uSpin;
    float y = sin(aPhase * 12.9 + uTime * 0.8) * 0.09 * radius;

    vec3 settled = vec3(cos(angle) * radius, y, sin(angle) * radius);
    vec3 transformed = mix(position + aScatter, settled, eased);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

    vColor = color;
    // Bright mid-stream, fade at the core and at the rim.
    float edgeFade = smoothstep(0.0, 0.12, cycle) * (1.0 - smoothstep(0.85, 1.0, cycle));
    vAlpha = mix(0.25, 1.0, edgeFade) * mix(0.35, 1.0, radius / 1.45);
    gl_PointSize = aSize * uPixelRatio * (5.0 / max(2.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const STREAM_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.15, 0.5, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

const CORE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const CORE_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.2);
    vec3 rim = vec3(0.34, 0.44, 0.66);
    gl_FragColor = vec4(rim, fresnel * 0.5);
  }
`

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

const STEEL: readonly [number, number, number] = [0.58, 0.7, 0.92]
const BRIGHT: readonly [number, number, number] = [0.85, 0.94, 1]
const GOLD: readonly [number, number, number] = [0.95, 0.73, 0.32]

function buildStream(mobile: boolean) {
  const random = seededRandom(0x776f726b)
  const count = mobile ? 1300 : 2400
  const positions = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const offset = i * 3
    // Initial positions unused after settle, but must be finite.
    positions[offset] = 0
    positions[offset + 1] = 0
    positions[offset + 2] = 0

    const roll = random()
    const color = roll < 0.04 ? GOLD : roll < 0.3 ? BRIGHT : STEEL
    colors[offset] = color[0]
    colors[offset + 1] = color[1]
    colors[offset + 2] = color[2]
    sizes[i] = 1.7 + random() * 1.3
    phases[i] = random()
    speeds[i] = 0.05 + random() * 0.1

    const theta = random() * Math.PI * 2
    const zz = random() * 2 - 1
    const radial = Math.sqrt(1 - zz * zz)
    const distance = 0.5 + random() * 1.4
    scatter[offset] = Math.cos(theta) * radial * distance
    scatter[offset + 1] = zz * distance
    scatter[offset + 2] = Math.sin(theta) * radial * distance
  }

  return { positions, scatter, colors, sizes, phases, speeds }
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

export type StreamSceneController = {
  setPointer: (x: number, y: number) => void
  resetPointer: () => void
  setOrientation: (x: number, y: number) => void
  beginDrag: () => void
  drag: (dx: number, dy: number, frameScale: number) => void
  endDrag: () => void
}

type StreamControls = {
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

const DRAG_YAW = 0.0055
const DRAG_PITCH = 0.0038
const IDLE_SPIN = 0.06
const PITCH_LIMIT = 0.55

export const StreamScene = forwardRef<
  StreamSceneController,
  {
    active: boolean
    mobile: boolean
  }
>(function StreamScene({ active, mobile }, controllerRef) {
  const controlsRef = useRef<StreamControls>({
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    orientationX: 0,
    orientationY: 0,
    yaw: 0,
    pitch: 0.5,
    velocityYaw: 0,
    velocityPitch: 0,
    lastInteractionAt: 0,
  })
  const tiltRef = useRef<THREE.Group>(null)
  const discRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const enteredAt = useRef<number | null>(null)
  const tiltX = useRef(0)
  const tiltY = useRef(0)
  const stream = useMemo(() => buildStream(mobile), [mobile])
  const pixelRatio = useThree((state) => state.gl.getPixelRatio())
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uSpin: { value: 0 },
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
    const disc = discRef.current
    const material = materialRef.current
    if (!tilt || !disc || !material) return

    if (enteredAt.current === null) enteredAt.current = state.clock.elapsedTime
    material.uniforms.uProgress.value = Math.min(
      (state.clock.elapsedTime - enteredAt.current) / 1.35,
      1,
    )
    material.uniforms.uPixelRatio.value = pixelRatio
    material.uniforms.uTime.value = state.clock.elapsedTime

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
        performance.now() - controls.lastInteractionAt > 1600 &&
        Math.abs(controls.velocityYaw) < 0.0004
      ) {
        controls.yaw += delta * IDLE_SPIN
      }
    }

    material.uniforms.uSpin.value = controls.yaw

    const targetTiltY = clampTilt(
      controls.pointerX * 0.14 + controls.orientationX * 0.08,
    )
    const targetTiltX = clampTilt(
      -controls.pointerY * 0.08 + controls.orientationY * 0.06,
    )
    const smoothing = 1 - Math.exp(-5.5 * delta)
    tiltX.current += (targetTiltX - tiltX.current) * smoothing
    tiltY.current += (targetTiltY - tiltY.current) * smoothing
    tilt.rotation.x = tiltX.current
    tilt.rotation.y = tiltY.current

    // The disc tilts toward the viewer; pitch from drag spins
    // it around the horizontal axis.
    disc.rotation.x = controls.pitch
  })

  return (
    <>
      <FrameScheduler active={active} mobile={mobile} />
      <group
        ref={tiltRef}
        position={mobile ? [0, -0.02, 0] : [2.3, -0.02, 0]}
        scale={mobile ? 1.45 : 1.68}
      >
        <group ref={discRef} rotation={[0.5, 0, 0]}>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[stream.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-aScatter"
                args={[stream.scatter, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[stream.colors, 3]}
              />
              <bufferAttribute
                attach="attributes-aSize"
                args={[stream.sizes, 1]}
              />
              <bufferAttribute
                attach="attributes-aPhase"
                args={[stream.phases, 1]}
              />
              <bufferAttribute
                attach="attributes-aSpeed"
                args={[stream.speeds, 1]}
              />
            </bufferGeometry>
            <shaderMaterial
              ref={materialRef}
              vertexShader={STREAM_VERTEX}
              fragmentShader={STREAM_FRAGMENT}
              uniforms={uniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </points>

          {/* Dark core with a steel Fresnel rim — the
              singularity itself. */}
          <mesh scale={0.16}>
            <sphereGeometry args={[1, mobile ? 32 : 48, mobile ? 20 : 32]} />
            <shaderMaterial
              vertexShader={CORE_VERTEX}
              fragmentShader={CORE_FRAGMENT}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>

          {/* Accretion line — one thin orbit where the stream
              concentrates before the plunge. */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.0035, 4, mobile ? 64 : 110]} />
            <meshBasicMaterial
              color="#a8c4e8"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2 - 0.18, 0.4, 0.1]}>
            <torusGeometry args={[0.94, 0.002, 4, mobile ? 56 : 96]} />
            <meshBasicMaterial
              color="#f0dcae"
              transparent
              opacity={0.1}
              depthWrite={false}
            />
          </mesh>
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
