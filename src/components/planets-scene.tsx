"use client"

import { useEffect, useRef } from "react"

/* ─────────────────────────────────────────────────────────────
   SOLAR SYSTEM SCENE
   Composition brief: spacious, intentional, depth-layered.
   - Jupiter: lower-left edge, partially cropped (background)
   - Saturn: far right, clear ring silhouette (background)
   - Mars: small, high centre, deep background
   - Moon: independent, upper-right, textured (foreground-mid)
   - Sun: distant, upper-left, flat disc + light source
   Bodies never enter the central column (hero title / nav safe).
   Textures: Solar System Scope (CC BY 4.0) + three.js examples
   moon_1024.jpg (NASA-derived). See public/planets/CREDITS.md.
   ───────────────────────────────────────────────────────────── */

type PlanetConfig = {
  id: string
  texture: string
  radius: number
  compactRadius: number
  // NDC-ish scene coords; camera sits at z=11, fov 38.
  position: readonly [number, number, number]
  compactPosition: readonly [number, number, number]
  atmosphereColor: readonly [number, number, number]
  atmosphereIntensity: number
  drift: readonly [number, number, number]
  spinSpeed: number
  tilt: readonly [number, number]
  hasRings?: boolean
}

const PLANETS: PlanetConfig[] = [
  {
    id: "jupiter",
    texture: "/planets/jupiter-2k.jpg",
    radius: 1.85,
    compactRadius: 1.15,
    // Lower-left, half-cropped by the viewport edge. Background depth.
    position: [-10.0, -1.8, -5.6],
    compactPosition: [-3.05, -3.2, -5.6],
    atmosphereColor: [0.97, 0.77, 0.52],
    atmosphereIntensity: 0.22,
    drift: [0.2, 0.1, 0.06],
    spinSpeed: 0.1,
    tilt: [0.05, 0.08],
  },
  {
    id: "saturn",
    texture: "/planets/saturn-2k.jpg",
    radius: 1.15,
    compactRadius: 0.72,
    // Far right, rings visible, deep background.
    position: [11.3, 1.2, -7.2],
    compactPosition: [2.85, 1.0, -7.2],
    atmosphereColor: [0.93, 0.84, 0.62],
    atmosphereIntensity: 0.18,
    drift: [0.14, 0.09, 0.05],
    spinSpeed: 0.07,
    tilt: [0.07, -0.18],
    hasRings: true,
  },
  {
    id: "mars",
    texture: "/planets/mars-2k.jpg",
    radius: 0.28,
    compactRadius: 0.2,
    // High centre, far from the sun and headline.
    position: [0.8, 3.8, -8.2],
    compactPosition: [2.2, 4.15, -8.2],
    atmosphereColor: [0.9, 0.42, 0.22],
    atmosphereIntensity: 0.12,
    drift: [0.1, 0.08, 0.1],
    spinSpeed: 0.14,
    tilt: [0.16, 0.06],
  },
  {
    id: "venus",
    texture: "/planets/venus-2k.jpg",
    radius: 0.32,
    compactRadius: 0.24,
    // Low right, distant - balances Mars diagonally.
    position: [5.4, -3.8, -9.0],
    compactPosition: [1.75, -4.8, -9.0],
    atmosphereColor: [0.96, 0.7, 0.38],
    atmosphereIntensity: 0.14,
    drift: [0.09, 0.07, 0.08],
    spinSpeed: 0.08,
    tilt: [0.04, -0.1],
  },
]

const PLANET_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const PLANET_FRAGMENT = `
  uniform sampler2D uTexture;
  uniform vec3 uSunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 tex = texture2D(uTexture, vUv).rgb;
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uSunDirection);
    vec3 viewDir = normalize(vViewDir);

    float sunDot = dot(normal, lightDir);
    float diffuse = smoothstep(-0.35, 0.65, sunDot);
    float limb = mix(
      0.42,
      1.0,
      pow(max(dot(viewDir, normal), 0.0), 0.82)
    );
    float lighting = mix(0.24, 1.0, diffuse) * limb;

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 48.0) * diffuse * 0.08;

    vec3 color = tex * lighting + vec3(spec);
    gl_FragColor = vec4(color, 1.0);
  }
`

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const ATMOSPHERE_FRAGMENT = `
  uniform vec3 uAtmosphereColor;
  uniform vec3 uSunDirection;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDir);
    vec3 lightDir = normalize(uSunDirection);

    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.2);
    float sun = smoothstep(-0.2, 0.8, dot(normal, lightDir));
    float alpha = fresnel * sun * uIntensity;

    gl_FragColor = vec4(uAtmosphereColor, alpha * 0.7);
  }
`

const RING_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const RING_FRAGMENT = `
  uniform vec3 uSunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float radius = length(p);

    float inner = smoothstep(0.55, 0.58, radius);
    float outer = 1.0 - smoothstep(0.93, 1.0, radius);
    float mask = inner * outer;

    float cassini = 1.0 - smoothstep(0.72, 0.75, radius) * (1.0 - smoothstep(0.75, 0.79, radius));
    float fineBands = 0.08 * sin(radius * 150.0) + 0.05 * sin(radius * 420.0);
    float broadBands = 0.55 + 0.18 * sin(radius * 24.0 + 0.5);

    vec3 dark = vec3(0.34, 0.3, 0.24);
    vec3 light = vec3(0.82, 0.76, 0.63);
    vec3 ringColor = mix(dark, light, clamp(broadBands + fineBands, 0.0, 1.0));

    float lightFalloff = 0.28 + 0.72 * smoothstep(-0.15, 0.65, dot(normalize(vNormal), normalize(uSunDirection)));
    float alpha = mask * cassini * (0.28 + 0.45 * broadBands);

    if (alpha < 0.03) discard;
    gl_FragColor = vec4(ringColor * lightFalloff, alpha);
  }
`

/* ── MOON — textured sphere with craters/maria from NASA-derived map ── */
const MOON_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const MOON_FRAGMENT = `
  uniform sampler2D uTexture;
  uniform vec3 uSunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 tex = texture2D(uTexture, vUv).rgb;
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uSunDirection);
    vec3 viewDir = normalize(vViewDir);

    float sunDot = dot(normal, lightDir);
    // Broad terminator: one lit side, soft falloff to shadow.
    float diffuse = smoothstep(-0.18, 0.55, sunDot);
    // Slight rim lift keeps the limb from going fully flat black.
    float rimLift = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.4) * 0.05;
    float lighting = mix(0.05, 1.0, diffuse) + rimLift;

    vec3 color = tex * lighting;
    gl_FragColor = vec4(color, 1.0);
  }
`

/* ── SUN - a shaded disc with a hard boundary and no bloom ── */
const SUN_CORE_FRAGMENT = `
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if (r > 1.0) discard;

    vec3 centre = vec3(1.0, 0.91, 0.7);
    vec3 edge = vec3(0.92, 0.5, 0.2);
    vec3 col = mix(centre, edge, smoothstep(0.12, 1.0, r));

    // Directional shading keeps the disc dimensional without a halo.
    float light = 1.0 - distance(p, vec2(-0.22, 0.2)) * 0.12;
    col *= clamp(light, 0.82, 1.02);

    float alpha = 1.0 - smoothstep(0.965, 1.0, r);
    gl_FragColor = vec4(col, alpha);
  }
`

const SPRITE_VERTEX = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function isMobileViewport() {
  return window.innerWidth < 768
}

function usesCompactComposition() {
  return isMobileViewport() || window.innerWidth / window.innerHeight < 0.8
}

const DESKTOP_SUN_POSITION = [-11.3, 4.3, -9.2] as const
const COMPACT_SUN_POSITION = [0.25, 6.0, -9.2] as const
const MOON_POSITION = [6.4, 3.1, -2.6] as const

export function PlanetsScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    // WebGL unavailable → leave the static starfield background as fallback.
    const probe = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    if (!probe) return

    let destroyed = false
    let raf = 0
    let visible = !document.hidden
    let inView = true

    void import("three").then((T) => {
      if (destroyed) return

      const mobile = isMobileViewport()
      const compact = usesCompactComposition()
      const viewportWidth = canvas.clientWidth || window.innerWidth
      const viewportHeight = canvas.clientHeight || window.innerHeight

      const scene = new T.Scene()
      const camera = new T.PerspectiveCamera(
        38,
        viewportWidth / viewportHeight,
        0.1,
        200,
      )
      camera.position.set(0, 0, 11)

      const renderer = new T.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      })
      renderer.setSize(viewportWidth, viewportHeight)
      // Cap DPR: 2 desktop, 1.5 mobile.
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, mobile ? 1.5 : 2),
      )
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = T.SRGBColorSpace
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18

      // 3D scene owns the moon; hide the CSS fallback moon.
      document.documentElement.dataset.solar3d = "true"

      const initialSunPosition = compact
        ? COMPACT_SUN_POSITION
        : DESKTOP_SUN_POSITION
      const sunPosition = new T.Vector3(...initialSunPosition)
      const sunDirection = sunPosition.clone().normalize()
      const sunLight = new T.DirectionalLight(0xfff3df, 3.2)
      sunLight.position.copy(sunPosition).multiplyScalar(2)
      scene.add(sunLight)
      scene.add(new T.AmbientLight(0xffffff, 0.05))

      const loader = new T.TextureLoader()
      const sphereGeometry = new T.SphereGeometry(1, 96, 96)
      const atmosphereGeometry = new T.SphereGeometry(1.04, 64, 64)
      const ringGeometry = new T.RingGeometry(1.22, 2.08, 160)
      const planeGeometry = new T.PlaneGeometry(1, 1)
      const clock = new T.Clock()

      type RuntimeBody = {
        config: PlanetConfig
        anchor: InstanceType<typeof T.Group>
        spin: InstanceType<typeof T.Group>
        basePosition: [number, number, number]
        drift: readonly [number, number, number]
        spinSpeed: number
        ring?: InstanceType<typeof T.Mesh>
      }

      const bodies: RuntimeBody[] = []

      for (const cfg of PLANETS) {
        const placement = compact ? cfg.compactPosition : cfg.position
        const texture = loader.load(cfg.texture)
        texture.colorSpace = T.SRGBColorSpace
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

        const planetMaterial = new T.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uSunDirection: { value: sunDirection },
          },
          vertexShader: PLANET_VERTEX,
          fragmentShader: PLANET_FRAGMENT,
        })

        const atmosphereMaterial = new T.ShaderMaterial({
          uniforms: {
            uAtmosphereColor: {
              value: new T.Vector3(
                cfg.atmosphereColor[0],
                cfg.atmosphereColor[1],
                cfg.atmosphereColor[2],
              ),
            },
            uSunDirection: { value: sunDirection },
            uIntensity: { value: cfg.atmosphereIntensity },
          },
          vertexShader: ATMOSPHERE_VERTEX,
          fragmentShader: ATMOSPHERE_FRAGMENT,
          transparent: true,
          side: T.BackSide,
          depthWrite: false,
          blending: T.AdditiveBlending,
        })

        const anchor = new T.Group()
        const spin = new T.Group()

        const planetMesh = new T.Mesh(sphereGeometry, planetMaterial)
        const atmosphereMesh = new T.Mesh(atmosphereGeometry, atmosphereMaterial)

        spin.add(planetMesh)
        spin.add(atmosphereMesh)
        spin.scale.setScalar(compact ? cfg.compactRadius : cfg.radius)
        spin.rotation.x = cfg.tilt[0]
        spin.rotation.z = cfg.tilt[1]

        let ring: InstanceType<typeof T.Mesh> | undefined
        if (cfg.hasRings) {
          const ringMaterial = new T.ShaderMaterial({
            uniforms: {
              uSunDirection: { value: sunDirection },
            },
            vertexShader: RING_VERTEX,
            fragmentShader: RING_FRAGMENT,
            transparent: true,
            side: T.DoubleSide,
            depthWrite: true,
            alphaTest: 0.03,
          })
          ring = new T.Mesh(ringGeometry, ringMaterial)
          ring.rotation.x = -1.16
          ring.rotation.z = 0.18
          spin.add(ring)
        }

        anchor.position.set(placement[0], placement[1], placement[2])
        anchor.add(spin)
        scene.add(anchor)

        bodies.push({
          config: cfg,
          anchor,
          spin,
          basePosition: [placement[0], placement[1], placement[2]],
          drift: cfg.drift,
          spinSpeed: cfg.spinSpeed,
          ring,
        })
      }

      /* ── MOON — independent body, upper-right, textured ── */
      const moonTexture = loader.load("/planets/moon_1024.jpg")
      moonTexture.colorSpace = T.SRGBColorSpace
      moonTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const moonMaterial = new T.ShaderMaterial({
        uniforms: {
          uTexture: { value: moonTexture },
          uSunDirection: { value: sunDirection },
        },
        vertexShader: MOON_VERTEX,
        fragmentShader: MOON_FRAGMENT,
      })

      const moonAnchor = new T.Group()
      const moonSpin = new T.Group()
      const moonMesh = new T.Mesh(sphereGeometry, moonMaterial)
      moonSpin.add(moonMesh)
      moonSpin.scale.setScalar(0.52)
      // Slight axial tilt for a natural look.
      moonSpin.rotation.z = 0.12
      moonAnchor.position.set(...MOON_POSITION)
      moonAnchor.add(moonSpin)
      scene.add(moonAnchor)
      const moonBasePosition: [number, number, number] = [
        MOON_POSITION[0],
        MOON_POSITION[1],
        MOON_POSITION[2],
      ]

      /* ── SUN - flat disc, deliberately without a corona ── */
      const sunGroup = new T.Group()

      const coreMaterial = new T.ShaderMaterial({
        vertexShader: SPRITE_VERTEX,
        fragmentShader: SUN_CORE_FRAGMENT,
        transparent: true,
        depthWrite: false,
      })
      const coreMesh = new T.Mesh(planeGeometry, coreMaterial)
      sunGroup.add(coreMesh)
      scene.add(sunGroup)

      const applySceneLayout = () => {
        const useCompactLayout = usesCompactComposition()

        for (const body of bodies) {
          const placement = useCompactLayout
            ? body.config.compactPosition
            : body.config.position
          body.basePosition = [placement[0], placement[1], placement[2]]
          body.anchor.position.set(placement[0], placement[1], placement[2])
          body.spin.scale.setScalar(
            useCompactLayout
              ? body.config.compactRadius
              : body.config.radius,
          )
        }

        const nextSunPosition = useCompactLayout
          ? COMPACT_SUN_POSITION
          : DESKTOP_SUN_POSITION
        sunPosition.set(
          nextSunPosition[0],
          nextSunPosition[1],
          nextSunPosition[2],
        )
        sunGroup.position.copy(sunPosition)
        coreMesh.scale.setScalar(useCompactLayout ? 0.85 : 2.0)
        sunLight.position.copy(sunPosition).multiplyScalar(2)
        sunDirection.copy(sunPosition).normalize()
      }

      applySceneLayout()

      let pointerX = 0
      let pointerY = 0
      let targetX = 0
      let targetY = 0
      let scrollY = 0

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.55
        targetY = (event.clientY / window.innerHeight - 0.5) * 0.35
      }

      const onScroll = () => {
        scrollY = window.scrollY
      }

      const onResize = () => {
        const width = canvas.clientWidth || window.innerWidth
        const height = canvas.clientHeight || window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        applySceneLayout()
      }

      const onVisibility = () => {
        visible = !document.hidden
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting
        },
        { threshold: 0 },
      )

      observer.observe(document.documentElement)
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onResize, { passive: true })
      document.addEventListener("visibilitychange", onVisibility)

      const updateBody = (body: RuntimeBody, elapsed: number, dt: number) => {
        const [baseX, baseY, baseZ] = body.basePosition
        const [ampX, ampY, speed] = body.drift
        body.anchor.position.x = baseX + Math.sin(elapsed * speed) * ampX
        body.anchor.position.y =
          baseY + Math.cos(elapsed * speed * 1.2 + baseX) * ampY
        body.anchor.position.z = baseZ

        body.spin.rotation.y += body.spinSpeed * dt
        if (body.ring) {
          body.ring.rotation.z += dt * 0.025
        }
      }

      const animate = () => {
        if (!visible || !inView) {
          raf = requestAnimationFrame(animate)
          return
        }

        const dt = clock.getDelta()
        const elapsed = clock.getElapsedTime()

        pointerX += (targetX - pointerX) * 0.05
        pointerY += (targetY - pointerY) * 0.05

        for (const body of bodies) {
          updateBody(body, elapsed, dt)
        }

        // Moon: slow spin + gentle independent drift.
        moonSpin.rotation.y += dt * 0.02
        moonAnchor.position.x =
          moonBasePosition[0] + Math.sin(elapsed * 0.05) * 0.18
        moonAnchor.position.y =
          moonBasePosition[1] + Math.cos(elapsed * 0.04) * 0.12

        // Camera parallax + slow drift downward on scroll (bodies
        // recede subtly as the visitor reads — solar depth cue).
        camera.position.x = pointerX
        camera.position.y = -pointerY - scrollY * 0.00024
        camera.lookAt(0, -scrollY * 0.00012, 0)

        renderer.render(scene, camera)
        raf = requestAnimationFrame(animate)
      }

      raf = requestAnimationFrame(animate)

      cleanupRef.current = () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onResize)
        document.removeEventListener("visibilitychange", onVisibility)
        delete document.documentElement.dataset.solar3d

        sphereGeometry.dispose()
        atmosphereGeometry.dispose()
        ringGeometry.dispose()
        planeGeometry.dispose()
        moonTexture.dispose()

        const disposeTree = (group: InstanceType<typeof T.Group>) => {
          for (const child of group.children) {
            const mesh = child as InstanceType<typeof T.Mesh>
            const material = mesh.material
            if (Array.isArray(material)) {
              material.forEach((entry) => entry.dispose())
            } else if (material) {
              const shader = material as InstanceType<
                typeof T.ShaderMaterial
              > & {
                uniforms?: Record<string, { value: unknown }>
              }
              const texture = shader.uniforms?.uTexture?.value
              if (
                texture &&
                typeof texture === "object" &&
                "dispose" in texture
              ) {
                ;(texture as { dispose: () => void }).dispose()
              }
              material.dispose()
            }
          }
        }
        for (const body of bodies) disposeTree(body.spin)
        disposeTree(moonSpin)
        disposeTree(sunGroup)

        renderer.dispose()
      }
    })

    return () => {
      destroyed = true
      cleanupRef.current?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}
