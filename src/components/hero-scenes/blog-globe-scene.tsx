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
   BLOG HERO SCENE — cinematic close-up of the About globe
   language: same particle sphere, camera pulled closer and
   pushed right, denser atmosphere, scan-line ring, plus
   HTML data labels (post counts) layered above the canvas.
   ═══════════════════════════════════════════════════════ */

const POINT_VERTEX = `
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute vec3 aScatter;
  attribute vec3 color;
  attribute float aSize;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float eased = 1.0 - pow(1.0 - uProgress, 3.0);
    vec3 transformed = mix(position + aScatter, position, eased);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normalize(transformed));
    float facing = dot(viewNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
    vColor = color;
    vAlpha = mix(0.10, 0.95, facing);
    gl_PointSize = aSize * uPixelRatio * (5.0 / max(2.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const POINT_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.16, 0.5, distanceToCenter)) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

const RIM_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying vec3 vObjectNormal;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-mvPosition.xyz);
    vObjectNormal = normal;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const RIM_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying vec3 vObjectNormal;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.4);
    float warmth = smoothstep(-0.6, 0.9, vObjectNormal.y + vObjectNormal.x * 0.25);
    vec3 cyan = vec3(0.16, 0.74, 0.94);
    vec3 warmWhite = vec3(1.0, 0.9, 0.74);
    vec3 color = mix(cyan, warmWhite, warmth);
    gl_FragColor = vec4(color, fresnel * 0.46);
  }
`

const SCAN_VERTEX = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SCAN_FRAGMENT = `
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float band = smoothstep(0.0, 0.02, abs(r - 0.985)) * smoothstep(0.03, 0.0, abs(r - 0.985));
    float sweep = 0.5 + 0.5 * sin((vUv.y * 8.0 + vUv.x * 2.0) * 3.14159);
    float alpha = band * (0.25 + 0.45 * sweep);
    gl_FragColor = vec4(0.62, 0.85, 1.0, alpha);
  }
`

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function buildParticles(mobile: boolean) {
  const worldCount = mobile ? 800 : 1600
  const hotspotCount = mobile ? 60 : 120
  const count = worldCount + hotspotCount
  const positions = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const random = seededRandom(0x626c6f67)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  let cursor = 0

  const addPoint = (
    x: number,
    y: number,
    z: number,
    color: readonly [number, number, number],
    size: number,
  ) => {
    const offset = cursor * 3
    positions[offset] = x
    positions[offset + 1] = y
    positions[offset + 2] = z
    colors[offset] = color[0]
    colors[offset + 1] = color[1]
    colors[offset + 2] = color[2]
    sizes[cursor] = size

    const theta = random() * Math.PI * 2
    const zz = random() * 2 - 1
    const radial = Math.sqrt(1 - zz * zz)
    const distance = 0.4 + random() * 1.05
    scatter[offset] = Math.cos(theta) * radial * distance
    scatter[offset + 1] = zz * distance
    scatter[offset + 2] = Math.sin(theta) * radial * distance
    cursor++
  }

  for (let i = 0; i < worldCount; i++) {
    const y = 1 - (i / Math.max(worldCount - 1, 1)) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i + 1.9
    const radius = 1 + (random() - 0.5) * 0.014
    addPoint(
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius,
      [0.58, 0.76, 0.96],
      1.9 + random() * 0.7,
    )
  }

  // Signal hotspots — brighter nodes scattered on the sphere,
  // the "data points" of the coverage map.
  for (let i = 0; i < hotspotCount; i++) {
    const y = random() * 2 - 1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = random() * Math.PI * 2
    const radius = 1.02 + random() * 0.006
    addPoint(
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius,
      random() < 0.22 ? [1, 0.72, 0.32] : [0.85, 0.95, 1],
      3 + random() * 1.2,
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

export type BlogGlobeController = {
  setPointer: (x: number, y: number) => void
  resetPointer: () => void
  setOrientation: (x: number, y: number) => void
  beginDrag: () => void
  drag: (dx: number, dy: number, frameScale: number) => void
  endDrag: () => void
}

type GlobeControls = {
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

const DRAG_YAW = 0.0075
const DRAG_PITCH = 0.005
const IDLE_SPEED = 0.09
const PITCH_LIMIT = 0.55

export const BlogGlobeScene = forwardRef<
  BlogGlobeController,
  {
    active: boolean
    mobile: boolean
  }
>(function BlogGlobeScene({ active, mobile }, controllerRef) {
  const controlsRef = useRef<GlobeControls>({
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    orientationX: 0,
    orientationY: 0,
    yaw: 0.55,
    pitch: -0.1,
    velocityYaw: 0,
    velocityPitch: 0,
    lastInteractionAt: 0,
  })
  const tiltRef = useRef<THREE.Group>(null)
  const globeRef = useRef<THREE.Group>(null)
  const scanRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const enteredAt = useRef<number | null>(null)
  const tiltX = useRef(0)
  const tiltY = useRef(0)
  const particles = useMemo(() => buildParticles(mobile), [mobile])
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
    const globe = globeRef.current
    const scan = scanRef.current
    const material = materialRef.current
    if (!tilt || !globe || !material) return

    if (enteredAt.current === null) enteredAt.current = state.clock.elapsedTime
    material.uniforms.uProgress.value = Math.min(
      (state.clock.elapsedTime - enteredAt.current) / 1.4,
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
        performance.now() - controls.lastInteractionAt > 1600 &&
        Math.abs(controls.velocityYaw) < 0.0004
      ) {
        controls.yaw += delta * IDLE_SPEED
      }
    }

    const targetTiltY = clampTilt(
      controls.pointerX * 0.16 + controls.orientationX * 0.09,
    )
    const targetTiltX = clampTilt(
      -controls.pointerY * 0.1 + controls.orientationY * 0.07,
    )
    const smoothing = 1 - Math.exp(-5.5 * delta)
    tiltX.current += (targetTiltX - tiltX.current) * smoothing
    tiltY.current += (targetTiltY - tiltY.current) * smoothing
    tilt.rotation.x = tiltX.current
    tilt.rotation.y = tiltY.current
    globe.rotation.x = controls.pitch
    globe.rotation.y = controls.yaw

    if (scan) {
      scan.rotation.z -= delta * 0.22
    }
  })

  return (
    <>
      <FrameScheduler active={active} mobile={mobile} />
      <group
        ref={tiltRef}
        position={mobile ? [0.25, -0.02, 0] : [2.35, -0.05, 0.45]}
        scale={mobile ? 1.5 : 1.72}
      >
        <group ref={globeRef}>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[particles.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-aScatter"
                args={[particles.scatter, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[particles.colors, 3]}
              />
              <bufferAttribute
                attach="attributes-aSize"
                args={[particles.sizes, 1]}
              />
            </bufferGeometry>
            <shaderMaterial
              ref={materialRef}
              vertexShader={POINT_VERTEX}
              fragmentShader={POINT_FRAGMENT}
              uniforms={uniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </points>

          <mesh scale={1.05}>
            <sphereGeometry args={[1, mobile ? 40 : 64, mobile ? 24 : 40]} />
            <shaderMaterial
              vertexShader={RIM_VERTEX}
              fragmentShader={RIM_FRAGMENT}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.FrontSide}
              toneMapped={false}
            />
          </mesh>

          {/* Scan ring — thin equatorial band with a moving sweep */}
          <mesh ref={scanRef} rotation={[Math.PI / 2 - 0.32, 0.2, 0]}>
            <ringGeometry args={[0.985, 1.0, mobile ? 64 : 128]} />
            <shaderMaterial
              vertexShader={SCAN_VERTEX}
              fragmentShader={SCAN_FRAGMENT}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>

          <mesh rotation={[0.32, 0.6, -0.5]}>
            <torusGeometry args={[1.21, 0.0022, 4, mobile ? 70 : 120]} />
            <meshBasicMaterial
              color="#9fc8f0"
              transparent
              opacity={0.16}
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
  return Math.min(Math.max(value, -0.24), 0.24)
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, -1), 1)
}
