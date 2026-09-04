"use client"

import { useEffect, useRef } from "react"

/* ─────────────────────────────────────────────────────────────
   SOLAR SYSTEM SCENE
   Composition brief: spacious, intentional, depth-layered.
   - Jupiter: large, far left edge, partially cropped (background)
   - Saturn: right side, clear ring silhouette (background)
   - Mars: small, upper-left area, deep background
   - Moon: independent, upper-right, textured (foreground-mid)
   - Sun: distant, upper-left corner, warm corona + light source
   Bodies never enter the central column (hero title / nav safe).
   Textures: Solar System Scope (CC BY 4.0) + three.js examples
   moon_1024.jpg (NASA-derived). See public/planets/CREDITS.md.
   ───────────────────────────────────────────────────────────── */

type PlanetConfig = {
  id: string
  texture: string
  radius: number
  // NDC-ish scene coords; camera sits at z=11, fov 38.
  position: readonly [number, number, number]
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
    texture: "/planets/8k_jupiter.jpg",
    radius: 2.35,
    // Far left, half-cropped by the viewport edge. Background depth.
    position: [-10.4, 0.1, -3.4],
    atmosphereColor: [0.97, 0.77, 0.52],
    atmosphereIntensity: 0.22,
    drift: [0.2, 0.1, 0.06],
    spinSpeed: 0.1,
    tilt: [0.05, 0.08],
  },
  {
    id: "saturn",
    texture: "/planets/8k_saturn.jpg",
    radius: 1.5,
    // Right side, rings visible, deep background.
    position: [9.6, 1.9, -5.2],
    atmosphereColor: [0.93, 0.84, 0.62],
    atmosphereIntensity: 0.18,
    drift: [0.14, 0.09, 0.05],
    spinSpeed: 0.07,
    tilt: [0.07, -0.18],
    hasRings: true,
  },
  {
    id: "mars",
    texture: "/planets/8k_mars.jpg",
    radius: 0.34,
    // Small, upper-left, far away.
    position: [-6.6, 3.4, -6.8],
    atmosphereColor: [0.9, 0.42, 0.22],
    atmosphereIntensity: 0.12,
    drift: [0.1, 0.08, 0.1],
    spinSpeed: 0.14,
    tilt: [0.16, 0.06],
  },
  {
    id: "venus",
    texture: "/planets/8k_venus_surface.jpg",
    radius: 0.4,
    // Low right, distant — balances Mars diagonally.
    position: [7.0, -3.3, -7.6],
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
    float rimShadow = pow(max(dot(viewDir, normal), 0.0), 0.82);
    float lighting = mix(0.16, 1.0, diffuse) * rimShadow;

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

/* ── SUN — layered sprite: core, surface grain, corona ── */
const SUN_CORE_FRAGMENT = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;

    // Warm white core → yellow → orange edge.
    vec3 core = vec3(1.0, 0.97, 0.88);
    vec3 mid = vec3(1.0, 0.86, 0.62);
    vec3 edge = vec3(0.99, 0.62, 0.32);

    float surface =
      0.03 * sin(vUv.x * 46.0 + uTime * 0.7) +
      0.03 * sin(vUv.y * 52.0 - uTime * 0.5) +
      0.02 * sin((vUv.x + vUv.y) * 38.0 + uTime * 0.9);
    float n = clamp(0.5 + surface, 0.0, 1.0);

    vec3 col = mix(core, mid, smoothstep(0.0, 0.55, r));
    col = mix(col, edge, smoothstep(0.5, 1.0, r));
    col *= 0.92 + 0.16 * n;

    float alpha = 1.0 - smoothstep(0.85, 1.0, r);
    gl_FragColor = vec4(col, alpha);
  }
`

const SUN_CORONA_FRAGMENT = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;

    // Slow breathing corona rays.
    float ray =
      0.5 + 0.5 * sin(atan(p.y, p.x) * 8.0 + uTime * 0.35);
    float ray2 =
      0.5 + 0.5 * sin(atan(p.y, p.x) * 13.0 - uTime * 0.22 + 2.0);

    float glow = exp(-r * 2.4);
    float streaks = glow * (0.55 + 0.45 * ray * ray2);

    vec3 warmInner = vec3(1.0, 0.84, 0.55);
    vec3 warmOuter = vec3(0.95, 0.55, 0.28);

    vec3 col = mix(warmInner, warmOuter, smoothstep(0.2, 1.0, r));
    float alpha = streaks * 0.5;
    gl_FragColor = vec4(col * streaks, alpha);
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

      const scene = new T.Scene()
      const camera = new T.PerspectiveCamera(
        38,
        window.innerWidth / window.innerHeight,
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
      renderer.setSize(window.innerWidth, window.innerHeight)
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

      /* Sun sits far upper-left; its direction is the scene's light.
         Match SUN_POSITION so the planets are lit from the sun's side. */
      const SUN_POSITION = new T.Vector3(-8.6, 4.4, -9.2)
      const sunDirection = SUN_POSITION.clone().normalize()
      const sunLight = new T.DirectionalLight(0xfff3df, 3.2)
      sunLight.position.copy(SUN_POSITION.clone().multiplyScalar(2))
      scene.add(sunLight)
      scene.add(new T.AmbientLight(0xffffff, 0.05))

      const loader = new T.TextureLoader()
      const sphereGeometry = new T.SphereGeometry(1, 96, 96)
      const atmosphereGeometry = new T.SphereGeometry(1.04, 64, 64)
      const ringGeometry = new T.RingGeometry(1.22, 2.08, 160)
      const planeGeometry = new T.PlaneGeometry(1, 1)
      const clock = new T.Clock()

      type RuntimeBody = {
        anchor: InstanceType<typeof T.Group>
        spin: InstanceType<typeof T.Group>
        basePosition: readonly [number, number, number]
        drift: readonly [number, number, number]
        spinSpeed: number
        ring?: InstanceType<typeof T.Mesh>
      }

      const bodies: RuntimeBody[] = []

      for (const cfg of PLANETS) {
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
        spin.scale.setScalar(cfg.radius)
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

        anchor.position.set(cfg.position[0], cfg.position[1], cfg.position[2])
        anchor.add(spin)
        scene.add(anchor)

        bodies.push({
          anchor,
          spin,
          basePosition: cfg.position,
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
      moonAnchor.position.set(6.4, 3.1, -2.6)
      moonAnchor.add(moonSpin)
      scene.add(moonAnchor)

      /* ── SUN — sprite stack at SUN_POSITION ── */
      const sunGroup = new T.Group()
      sunGroup.position.copy(SUN_POSITION)

      const coreMaterial = new T.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: SPRITE_VERTEX,
        fragmentShader: SUN_CORE_FRAGMENT,
        transparent: true,
        depthWrite: false,
      })
      const coreMesh = new T.Mesh(planeGeometry, coreMaterial)
      coreMesh.scale.setScalar(2.1)
      sunGroup.add(coreMesh)

      const coronaMaterial = new T.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: SPRITE_VERTEX,
        fragmentShader: SUN_CORONA_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
      })
      const coronaMesh = new T.Mesh(planeGeometry, coronaMaterial)
      coronaMesh.scale.setScalar(5.4)
      sunGroup.add(coronaMesh)

      scene.add(sunGroup)

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
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
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
        moonAnchor.position.x = 6.4 + Math.sin(elapsed * 0.05) * 0.18
        moonAnchor.position.y = 3.1 + Math.cos(elapsed * 0.04) * 0.12

        // Sun surface shimmer.
        coreMaterial.uniforms.uTime.value = elapsed
        coronaMaterial.uniforms.uTime.value = elapsed

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
        coreMaterial.dispose()
        coronaMaterial.dispose()
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
