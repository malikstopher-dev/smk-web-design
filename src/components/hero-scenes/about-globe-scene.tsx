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
    vAlpha = mix(0.13, 0.92, facing);
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
    float alpha = (1.0 - smoothstep(0.18, 0.5, distanceToCenter)) * vAlpha;
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
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDirection), 0.0), 2.8);
    float warmth = smoothstep(-0.65, 0.85, vObjectNormal.y + vObjectNormal.x * 0.3);
    vec3 cyan = vec3(0.18, 0.78, 0.96);
    vec3 warmWhite = vec3(1.0, 0.91, 0.76);
    vec3 color = mix(cyan, warmWhite, warmth);
    gl_FragColor = vec4(color, fresnel * 0.34);
  }
`

const AFRICA: [number, number][] = [
  [-17, 36],
  [11, 37],
  [34, 31],
  [51, 12],
  [43, -12],
  [32, -24],
  [18, -35],
  [11, -17],
  [-5, 5],
  [-17, 15],
]

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function insidePolygon(lng: number, lat: number) {
  let inside = false
  for (let i = 0, j = AFRICA.length - 1; i < AFRICA.length; j = i++) {
    const [xi, yi] = AFRICA[i]
    const [xj, yj] = AFRICA[j]
    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function latLngToPoint(lat: number, lng: number, radius: number) {
  const latitude = THREE.MathUtils.degToRad(lat)
  const longitude = THREE.MathUtils.degToRad(lng)
  const latitudeRadius = Math.cos(latitude) * radius
  return new THREE.Vector3(
    Math.sin(longitude) * latitudeRadius,
    Math.sin(latitude) * radius,
    Math.cos(longitude) * latitudeRadius,
  )
}

function buildParticles(mobile: boolean) {
  const worldCount = mobile ? 950 : 1850
  const africaCount = mobile ? 380 : 760
  const southAfricaCount = mobile ? 45 : 90
  const count = worldCount + africaCount + southAfricaCount
  const positions = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const random = seededRandom(0x534d4b)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  let cursor = 0

  const addPoint = (
    point: THREE.Vector3,
    color: readonly [number, number, number],
    size: number,
  ) => {
    const offset = cursor * 3
    positions[offset] = point.x
    positions[offset + 1] = point.y
    positions[offset + 2] = point.z
    colors[offset] = color[0]
    colors[offset + 1] = color[1]
    colors[offset + 2] = color[2]
    sizes[cursor] = size

    const theta = random() * Math.PI * 2
    const z = random() * 2 - 1
    const radial = Math.sqrt(1 - z * z)
    const distance = 0.35 + random() * 1.15
    scatter[offset] = Math.cos(theta) * radial * distance
    scatter[offset + 1] = z * distance
    scatter[offset + 2] = Math.sin(theta) * radial * distance
    cursor++
  }

  for (let i = 0; i < worldCount; i++) {
    const y = 1 - (i / Math.max(worldCount - 1, 1)) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i + 0.7
    const radius = 1 + (random() - 0.5) * 0.012
    addPoint(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius,
      ),
      [0.62, 0.78, 0.95],
      2 + random() * 0.8,
    )
  }

  let placed = 0
  while (placed < africaCount) {
    const lng = -18 + random() * 70
    const lat = -36 + random() * 74
    if (!insidePolygon(lng, lat)) continue
    addPoint(
      latLngToPoint(lat, lng, 1.012 + random() * 0.012),
      [0.9, 0.96, 1],
      2.7 + random() * 0.9,
    )
    placed++
  }

  for (let i = 0; i < southAfricaCount; i++) {
    const angle = random() * Math.PI * 2
    const distance = Math.sqrt(random())
    const lng = 24 + Math.cos(angle) * distance * 7
    const lat = -29 + Math.sin(angle) * distance * 5
    addPoint(
      latLngToPoint(lat, lng, 1.035 + random() * 0.008),
      [1, 0.72, 0.3],
      3.2 + random() * 1.1,
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

export type AboutGlobeController = {
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

export const AboutGlobeScene = forwardRef<
  AboutGlobeController,
  {
    active: boolean
    mobile: boolean
  }
>(function AboutGlobeScene({ active, mobile }, controllerRef) {
  const controlsRef = useRef<GlobeControls>({
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    orientationX: 0,
    orientationY: 0,
    yaw: 0,
    pitch: -0.08,
    velocityYaw: 0,
    velocityPitch: 0,
    lastInteractionAt: 0,
  })
  const tiltRef = useRef<THREE.Group>(null)
  const globeRef = useRef<THREE.Group>(null)
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
        const yawDelta = -dx * 0.006
        const pitchDelta = -dy * 0.004
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
    const material = materialRef.current
    if (!tilt || !globe || !material) return

    if (enteredAt.current === null) enteredAt.current = state.clock.elapsedTime
    material.uniforms.uProgress.value = Math.min(
      (state.clock.elapsedTime - enteredAt.current) / 1.25,
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
        performance.now() - controls.lastInteractionAt > 1800 &&
        Math.abs(controls.velocityYaw) < 0.0004
      ) {
        controls.yaw += delta * 0.075
      }
    }

    const targetTiltY = clampTilt(
      controls.pointerX * 0.14 + controls.orientationX * 0.08,
    )
    const targetTiltX = clampTilt(
      -controls.pointerY * 0.09 + controls.orientationY * 0.06,
    )
    const smoothing = 1 - Math.exp(-5.5 * delta)
    tiltX.current += (targetTiltX - tiltX.current) * smoothing
    tiltY.current += (targetTiltY - tiltY.current) * smoothing
    tilt.rotation.x = tiltX.current
    tilt.rotation.y = tiltY.current
    globe.rotation.x = controls.pitch
    globe.rotation.y = controls.yaw
  })

  return (
    <>
      <FrameScheduler active={active} mobile={mobile} />
      <group
        ref={tiltRef}
        position={mobile ? [0.3, -0.05, 0] : [2.05, -0.08, 0]}
        scale={mobile ? 1.36 : 1.58}
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

          <mesh scale={1.045}>
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

          <mesh scale={1.01}>
            <sphereGeometry args={[1, mobile ? 20 : 30, mobile ? 14 : 20]} />
            <meshBasicMaterial
              color="#c8ddf4"
              wireframe
              transparent
              opacity={0.035}
              depthWrite={false}
            />
          </mesh>

          <mesh rotation={[1.08, 0.15, 0.2]}>
            <torusGeometry args={[1.18, 0.003, 4, mobile ? 80 : 140]} />
            <meshBasicMaterial
              color="#b6dcff"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0.26, 0.75, -0.4]}>
            <torusGeometry args={[1.13, 0.002, 4, mobile ? 72 : 120]} />
            <meshBasicMaterial
              color="#f4e2bd"
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </>
  )
})

function clampPitch(value: number) {
  return Math.min(Math.max(value, -0.62), 0.62)
}

function clampTilt(value: number) {
  return Math.min(Math.max(value, -0.22), 0.22)
}

function clampUnit(value: number) {
  return Math.min(Math.max(value, -1), 1)
}
