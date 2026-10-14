"use client"

import { useEffect, useRef } from "react"
import * as T from "three"
import { SCENE_MOTION, subscribeScene, wakeScene } from "@/lib/scene-runtime"

// The five existing textured bodies frame the full hero, not just Earth's
// square stage. Coordinates use the camera frustum (-1 to 1 in each axis).
const BODIES = [
  { id: "jupiter", texture: "/planets/jupiter-2k.jpg", radius: .078, mobileRadius: .078, depth: -5.6, x: .055, y: -.55, mobileX: -.8, mobileY: -.84, spin: 0.12, drift: 0.08, rim: [0.97, 0.77, 0.52], roughness: 0.86 },
  { id: "saturn", texture: "/planets/saturn-2k.jpg", radius: .032, mobileRadius: .052, depth: -7.2, x: -.49, y: .69, mobileX: -.73, mobileY: -.02, spin: 0.09, drift: 0.07, rim: [0.93, 0.84, 0.62], roughness: 0.9 },
  { id: "mars", texture: "/planets/mars-2k.jpg", radius: .035, mobileRadius: .04, depth: -8.2, x: .85, y: -.1, mobileX: .8, mobileY: -.78, spin: 0.075, drift: 0.05, rim: [0.9, 0.42, 0.22], roughness: 0.98 },
  { id: "venus", texture: "/planets/venus-2k.jpg", radius: .038, mobileRadius: .043, depth: -9, x: .16, y: .58, mobileX: .78, mobileY: -.28, spin: 0.055, drift: 0.045, rim: [0.96, 0.7, 0.38], roughness: 0.94 },
  { id: "moon", texture: "/planets/moon_1024.jpg", radius: .052, mobileRadius: .058, depth: -2.6, x: .79, y: .47, mobileX: .84, mobileY: .35, spin: 0.045, drift: 0.05, rim: [0.65, 0.72, 0.86], roughness: 1 },
] as const

// Keep the shared background's bodies in the margins, clear of inner-page
// headings and interactive hero objects. Home retains its own composition.
const BACKGROUND_POSITIONS = {
  jupiter: { x: -.94, y: -.56, mobileX: -.91, mobileY: -.62 },
  saturn: { x: .33, y: .67, mobileX: .54, mobileY: .68 },
  mars: { x: -.82, y: .64, mobileX: -.76, mobileY: .69 },
  venus: { x: .94, y: -.64, mobileX: .91, mobileY: -.82 },
  moon: { x: .84, y: .60, mobileX: .89, mobileY: .15 },
} as const

const SURFACE_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  }
`
const SURFACE_FRAGMENT = `
  uniform sampler2D uTexture;
  uniform float uLoaded;
  uniform vec3 uBaseColour;
  uniform vec3 uLight;
  uniform float uRoughness;
  uniform float uMoon;
  uniform float uRelief;
  uniform float uVenus;
  uniform float uSaturn;
  uniform vec3 uCenter;
  uniform vec3 uRingNormal;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 lightDir = normalize(uLight);
    // SRGBColorSpace textures are decoded by WebGL on sampling. Work in
    // linear light here, then convert to display colour once at the end.
    vec3 tex = mix(uBaseColour, texture2D(uTexture, vUv).rgb, uLoaded);
    // Very shallow relief from local texture variation on the rocky bodies.
    // This preserves the silhouette and does not pretend to be elevation data.
    if (uRelief > 0.0) {
      float height = dot(tex, vec3(0.2126, 0.7152, 0.0722));
      vec3 dpdx = dFdx(vWorld);
      vec3 dpdy = dFdy(vWorld);
      vec3 r1 = cross(dpdy, normal);
      vec3 r2 = cross(normal, dpdx);
      float determinant = dot(dpdx, r1);
      vec3 gradient = sign(determinant) * (dFdx(height) * r1 + dFdy(height) * r2);
      normal = normalize(abs(determinant) * normal - uRelief * gradient);
    }
    // Venus is seen through an opaque cream atmosphere, with only a trace
    // of the existing map's variation showing through the cloud envelope.
    float cloud = dot(tex, vec3(0.2126, 0.7152, 0.0722));
    tex = mix(tex, vec3(0.72, 0.61, 0.43) * (0.88 + cloud * 0.16), uVenus);
    float sun = dot(normal, lightDir);
    float diffuse = max(sun, 0.0);
    // Lunar regolith retains detail towards the limb; gas giants have a
    // smoother diffuse falloff rather than a broad flat illuminated patch.
    float lunar = max(sun, 0.0) / max(max(sun, 0.0) + max(dot(normal, viewDir), 0.0), 0.01);
    diffuse = mix(diffuse, lunar * 1.3, uMoon);
    float limb = pow(max(dot(normal, viewDir), 0.0), 0.36);
    float fill = mix(0.018, 0.009, uMoon);
    float ringShadow = 1.0;
    if (uSaturn > 0.5) {
      float denominator = dot(lightDir, uRingNormal);
      if (abs(denominator) > 0.001) {
        float distance = -dot(vWorld - uCenter, uRingNormal) / denominator;
        vec3 hit = vWorld - uCenter + distance * lightDir;
        float radius = length(hit) / uRadius;
        float ring = smoothstep(1.24, 1.3, radius) * (1.0 - smoothstep(2.16, 2.24, radius));
        float division = smoothstep(1.91, 1.94, radius) * (1.0 - smoothstep(1.99, 2.01, radius));
        if (distance > 0.0) ringShadow = 1.0 - ring * (1.0 - division) * 0.68;
      }
    }
    float illumination = (fill + diffuse * 1.65 * ringShadow) * mix(0.88, 1.0, limb);
    vec3 halfway = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfway), 0.0), mix(64.0, 12.0, uRoughness));
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    vec3 colour = tex * illumination;
    colour += vec3(0.74, 0.86, 1.0) * rim * 0.025 * diffuse * (1.0 - uMoon);
    colour += vec3(specular * (1.0 - uRoughness) * 0.16 * diffuse);
    gl_FragColor = vec4(colour, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
const ATMOSPHERE_FRAGMENT = `
  uniform vec3 uLight;
  uniform vec3 uColour;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - abs(dot(n, viewDir)), 3.6);
    float lit = smoothstep(-0.12, 0.5, dot(n, normalize(uLight)));
    gl_FragColor = vec4(uColour, fresnel * lit * uIntensity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
const RING_FRAGMENT = `
  uniform vec3 uLight;
  uniform vec3 uCenter;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    float radius = length((vUv - 0.5) * 2.0);
    float mask = smoothstep(0.55, 0.57, radius) * (1.0 - smoothstep(0.985, 1.0, radius));
    float cassini = 1.0 - 0.94 * (smoothstep(0.854, 0.864, radius) - smoothstep(0.887, 0.897, radius));
    float encke = 1.0 - 0.55 * exp(-pow((radius - 0.965) / 0.003, 2.0));
    float fine = 0.035 * sin(radius * 460.0) + 0.022 * sin(radius * 917.0);
    float bRing = smoothstep(0.68, 0.72, radius) * (1.0 - smoothstep(0.84, 0.855, radius));
    float bands = clamp(0.4 + bRing * 0.32 + fine, 0.0, 1.0);
    vec3 colour = mix(vec3(0.19, 0.17, 0.14), vec3(0.62, 0.56, 0.44), bands);
    vec3 lightDir = normalize(uLight);
    vec3 relative = vWorld - uCenter;
    float along = dot(relative, lightDir);
    float distanceToRay = length(relative - lightDir * along);
    // Analytic sphere shadow on the rings, with a soft penumbra. No shadow map.
    float shadow = along < 0.0 ? mix(0.13, 1.0, smoothstep(uRadius * 0.9, uRadius * 1.13, distanceToRay)) : 1.0;
    float light = 0.35 + 1.25 * abs(dot(normalize(vNormal), lightDir));
    float alpha = mask * cassini * encke * (0.24 + bands * 0.78);
    if (alpha < 0.025) discard;
    gl_FragColor = vec4(colour * light * shadow, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function PlanetsScene({ placement = "hero" }: { placement?: "hero" | "background" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let destroyed = false
    let dispose = () => {}

    const initialise = () => {
      if (destroyed) return
      const compactAtMount = matchMedia("(max-width: 767px), (pointer: coarse)").matches
      let renderer: InstanceType<typeof T.WebGLRenderer>
      try {
        renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" })
      } catch {
        canvas.dataset.fallback = "no-webgl"
        return
      }
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = T.SRGBColorSpace
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.08
      const scene = new T.Scene()
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.set(0, 0, 11)
      const light = new T.Vector3(-0.65, 0.38, 0.7).normalize()
      const sphere = new T.SphereGeometry(1, compactAtMount ? 40 : 64, compactAtMount ? 28 : 48)
      const atmosphere = new T.SphereGeometry(1.025, compactAtMount ? 24 : 40, compactAtMount ? 18 : 28)
      const ringGeometry = new T.RingGeometry(1.24, 2.24, compactAtMount ? 128 : 192)
      const manager = new T.LoadingManager()
      const textures: InstanceType<typeof T.Texture>[] = []
      const materials: InstanceType<typeof T.ShaderMaterial>[] = []
      manager.onLoad = () => {
        if (destroyed) return
        canvas.dataset.ready = "true"
        document.documentElement.dataset.solar3d = "true"
        wakeScene()
      }
      const loader = new T.TextureLoader(manager)
      const bodies = BODIES.map(config => {
        const anchor = new T.Group()
        const axis = new T.Group()
        axis.rotation.x = config.id === "saturn" ? 0.55 : 0.06
        axis.rotation.z = config.id === "saturn" ? -0.24 : 0.1
        const ringNormal = new T.Vector3(0, 1, 0).applyEuler(axis.rotation)
        const texture = loader.load(config.texture, () => {
          if (destroyed) return
          surfaceMaterial.uniforms.uLoaded.value = 1
          wakeScene()
        }, undefined, () => { canvas.dataset.textureError = config.id })
        texture.colorSpace = T.SRGBColorSpace
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), compactAtMount ? 2 : 8)
        texture.minFilter = T.LinearMipmapLinearFilter
        textures.push(texture)
        const surfaceMaterial = new T.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture }, uLight: { value: light },
            uLoaded: { value: 0 }, uBaseColour: { value: new T.Color(...config.rim) },
            uRoughness: { value: config.roughness }, uMoon: { value: config.id === "moon" ? 1 : 0 },
            uRelief: { value: config.id === "moon" ? 0.035 : config.id === "mars" ? 0.012 : 0 },
            uVenus: { value: config.id === "venus" ? 1 : 0 }, uSaturn: { value: config.id === "saturn" ? 1 : 0 },
            uCenter: { value: anchor.position }, uRingNormal: { value: ringNormal }, uRadius: { value: config.radius },
          },
          vertexShader: SURFACE_VERTEX, fragmentShader: SURFACE_FRAGMENT,
        })
        const rimMaterial = new T.ShaderMaterial({
          uniforms: { uLight: { value: light }, uColour: { value: new T.Vector3(...config.rim) }, uIntensity: { value: config.id === "moon" ? 0.045 : 0.24 } },
          vertexShader: SURFACE_VERTEX, fragmentShader: ATMOSPHERE_FRAGMENT,
          transparent: true, depthWrite: false, side: T.BackSide, blending: T.AdditiveBlending,
        })
        materials.push(surfaceMaterial, rimMaterial)
        const surface = new T.Mesh(sphere, surfaceMaterial)
        const initialRotation = config.id === "jupiter" ? 0.45 : config.id === "moon" ? -1.2 : 0
        surface.rotation.y = initialRotation
        axis.add(surface, new T.Mesh(atmosphere, rimMaterial))
        anchor.add(axis)
        scene.add(anchor)
        let ringMaterial: InstanceType<typeof T.ShaderMaterial> | undefined
        let ring: InstanceType<typeof T.Mesh> | undefined
        if (config.id === "saturn") {
          ringMaterial = new T.ShaderMaterial({
            uniforms: { uLight: { value: light }, uCenter: { value: anchor.position }, uRadius: { value: config.radius } },
            vertexShader: SURFACE_VERTEX, fragmentShader: RING_FRAGMENT,
            transparent: true, side: T.DoubleSide, depthWrite: false,
          })
          materials.push(ringMaterial)
          ring = new T.Mesh(ringGeometry, ringMaterial)
          ring.rotation.x = -Math.PI / 2
          // Axis is fixed; only the sphere spins. No tumbling rings.
          axis.add(ring)
        }
        return { config, anchor, axis, surface, surfaceMaterial, rimMaterial, ringMaterial, ring, initialRotation, baseX: 0, baseY: 0 }
      })

      // Keep the existing distant sun as one sprite; planets are all meshes.
      const sunCanvas = document.createElement("canvas")
      sunCanvas.width = sunCanvas.height = 64
      const ctx = sunCanvas.getContext("2d")!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, "rgba(255,248,224,1)")
      g.addColorStop(0.12, "rgba(255,224,160,0.5)")
      g.addColorStop(1, "rgba(255,214,140,0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      const sunTexture = new T.CanvasTexture(sunCanvas)
      const sunMaterial = new T.SpriteMaterial({ map: sunTexture, transparent: true, depthWrite: false, blending: T.AdditiveBlending })
      const sun = new T.Sprite(sunMaterial)
      sun.position.set(-9.2, 4.2, -9.2)
      sun.scale.setScalar(0.8)
      scene.add(sun)

      let lastWidth = 0
      let lastHeight = 0
      let lastCompact = compactAtMount
      let lastDpr = 0
      let inView = true
      // The hero can be taller than the viewport. Match the drawing buffer
      // to its actual CSS box so spherical bodies never stretch into ovals.
      let canvasWidth = canvas.clientWidth
      let canvasHeight = canvas.clientHeight
      const sizeObserver = new ResizeObserver(([entry]) => {
        canvasWidth = Math.max(1, Math.round(entry.contentRect.width))
        canvasHeight = Math.max(1, Math.round(entry.contentRect.height))
        wakeScene()
      })
      sizeObserver.observe(canvas)
      const view = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; wakeScene() })
      view.observe(canvas)
      const unsubscribe = subscribeScene(s => {
        if (!inView) return
        const dpr = Math.min(devicePixelRatio || 1, s.compact ? 1.25 : 1.75) * s.quality
        if (Math.abs(dpr - lastDpr) > 0.04 || canvasWidth !== lastWidth || canvasHeight !== lastHeight || s.compact !== lastCompact) {
          lastDpr = dpr
          lastWidth = canvasWidth
          lastHeight = canvasHeight
          lastCompact = s.compact
          renderer.setPixelRatio(dpr)
          renderer.setSize(canvasWidth, canvasHeight, false)
          camera.aspect = canvasWidth / canvasHeight
          camera.updateProjectionMatrix()
          for (const body of bodies) {
            const cfg = body.config
            const position = placement === "background" ? BACKGROUND_POSITIONS[cfg.id] : cfg
            const halfH = Math.tan(19 * Math.PI / 180) * (11 - cfg.depth)
            body.baseX = (s.compact ? position.mobileX : position.x) * halfH * camera.aspect
            body.baseY = (s.compact ? position.mobileY : position.y) * halfH
            // Size against the shorter hero dimension. A full-width desktop
            // canvas must not inflate Saturn's rings or the smaller planets.
            const radius = (s.compact ? cfg.mobileRadius : cfg.radius) * halfH * 2 * Math.min(1, camera.aspect) * (placement === "background" ? .8 : 1)
            body.axis.scale.setScalar(radius)
            body.surfaceMaterial.uniforms.uRadius.value = radius
            if (body.ringMaterial) body.ringMaterial.uniforms.uRadius.value = radius
            body.anchor.visible = true
          }
          sun.visible = false
          canvas.dataset.dpr = dpr.toFixed(2)
          canvas.dataset.spheres = "5"
        }
        const time = s.reduced ? 0 : s.time
        // Earth and the surrounding bodies now share one in-flow display area.
        // Page scroll must not pull a second, independent composition across it.
        const progress = 0
        canvas.style.opacity = "1"
        const amount = s.compact ? 0.65 : 1
        const pointerX = s.reduced ? 0 : s.pointerX
        const pointerY = s.reduced ? 0 : s.pointerY
        light.set(-0.65 + pointerX * 0.16 + Math.sin(time * 0.14) * 0.04, 0.38 - pointerY * 0.09, 0.7).normalize()
        for (const body of bodies) {
          const cfg = body.config
          const depthWeight = 10 / (11 - cfg.depth)
          const drift = cfg.drift * (s.compact ? 3.3 : 1)
          const travel = time * (s.compact ? 0.8 : 0.38)
          body.anchor.position.set(
            body.baseX + Math.sin(travel + cfg.depth) * drift * (s.compact && cfg.id === "moon" ? 0.2 : 1),
            body.baseY + Math.cos(travel * 0.8 + cfg.x) * drift * 0.7 + progress * depthWeight * 1.35 * amount,
            cfg.depth - progress * depthWeight * 2.1,
          )
          body.surface.rotation.y = time * cfg.spin * (s.compact ? 2.3 : 1) + body.initialRotation
          body.rimMaterial.uniforms.uIntensity.value = (cfg.id === "moon" ? 0.045 : 0.24) * (0.9 + Math.sin(time * 0.22) * 0.1)
        }
        // Parallel camera translation gives unequal screen movement at each Z.
        // Keep orientation stable so the environment never tilts the text.
        // Reserve the ring's full diameter plus pointer travel inside the canvas.
        camera.position.set(pointerX * SCENE_MOTION.planetPointer.x * amount * .3,
          -pointerY * SCENE_MOTION.planetPointer.y * amount * .3 - progress * 0.6, 11 + progress * 0.8)
        renderer.render(scene, camera)
        canvas.dataset.sceneTime = time.toFixed(2)
      })

      const contextLost = (event: Event) => {
        event.preventDefault()
        canvas.dataset.fallback = "context-lost"
        delete document.documentElement.dataset.solar3d
      }
      const contextRestored = () => {
        delete canvas.dataset.fallback
        document.documentElement.dataset.solar3d = "true"
        wakeScene()
      }
      canvas.addEventListener("webglcontextlost", contextLost)
      canvas.addEventListener("webglcontextrestored", contextRestored)
      dispose = () => {
        unsubscribe()
        view.disconnect()
        sizeObserver.disconnect()
        canvas.removeEventListener("webglcontextlost", contextLost)
        canvas.removeEventListener("webglcontextrestored", contextRestored)
        delete document.documentElement.dataset.solar3d
        sphere.dispose()
        atmosphere.dispose()
        ringGeometry.dispose()
        textures.forEach(texture => texture.dispose())
        materials.forEach(material => material.dispose())
        sunTexture.dispose()
        sunMaterial.dispose()
        renderer.dispose()
      }
    }
    try { initialise() } catch {
      if (!destroyed) canvas.dataset.fallback = "unavailable"
      dispose()
    }

    return () => { destroyed = true; dispose() }
  }, [placement])

  return <canvas ref={canvasRef} data-planet-scene data-placement={placement} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
}
