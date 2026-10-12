import * as THREE from "three"

// A 1.25-unit orthographic half-width keeps the globe at 80% of its canvas,
// matching the DOM marker projection in globe-markers.
const CAMERA_EXTENT = 1.25
const SUN = new THREE.Vector3(-0.85, 0.55, 1).normalize()

const VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SURFACE = `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    float sunlight = dot(normal, uSun);
    float day = smoothstep(-0.13, 0.20, sunlight);
    vec3 albedo = texture2D(uDay, vUv).rgb;
    vec3 cities = texture2D(uNight, vUv).rgb;
    vec3 color = albedo * (0.035 + 1.55 * max(sunlight, 0.0));
    color += cities * (1.0 - day) * 1.6;
    // The blue-dominant ocean gets a small sun glint; land stays matte.
    float ocean = smoothstep(0.015, 0.08, albedo.b - max(albedo.r, albedo.g));
    vec3 halfway = normalize(uSun + vec3(0.0, 0.0, 1.0));
    float glint = pow(max(dot(normal, halfway), 0.0), 70.0);
    color += vec3(0.65, 0.78, 0.92) * glint * ocean * day * 0.24;
    float rim = pow(1.0 - max(normal.z, 0.0), 4.0);
    color += vec3(0.045, 0.14, 0.32) * rim * (0.18 + day * 0.55);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const CLOUDS = `
  uniform sampler2D uClouds;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    float density = texture2D(uClouds, vUv).r;
    float light = max(dot(normalize(vNormal), uSun), 0.0);
    vec3 color = vec3(0.92, 0.95, 1.0) * (0.05 + light * 1.35);
    gl_FragColor = vec4(color, smoothstep(0.12, 0.88, density) * 0.72);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const ATMOSPHERE = `
  uniform vec3 uSun;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    float rim = pow(1.0 - max(normal.z, 0.0), 5.5);
    float lit = smoothstep(-0.3, 0.8, dot(normal, uSun));
    gl_FragColor = vec4(vec3(0.18, 0.43, 0.8), rim * (0.06 + lit * 0.28));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

interface EarthOptions {
  compact: boolean
  locations: [number, number, number][]
  onReady: () => void
  onTextureLoad: () => void
}

export interface EarthFrame {
  phi: number
  theta: number
  time: number
  width: number
  dpr: number
}

/** Resource owner only. Rendering is driven by the site's shared scene clock. */
export function createEarthGlobe(canvas: HTMLCanvasElement, options: EarthOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-CAMERA_EXTENT, CAMERA_EXTENT, CAMERA_EXTENT, -CAMERA_EXTENT, 0.1, 10)
  camera.position.z = 4
  const world = new THREE.Group()
  scene.add(world)
  const segments = options.compact ? 48 : 80
  const geometry = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.65))
  const textures: THREE.Texture[] = []
  const materials: THREE.Material[] = []
  const arcGeometries: THREE.BufferGeometry[] = []
  let destroyed = false
  let lastWidth = 0
  let lastDpr = 0
  const loader = new THREE.TextureLoader()
  const load = (file: string, color: boolean, ready = false) => {
    const texture = loader.load(`/planets/${file}`, loaded => {
      if (destroyed) { loaded.dispose(); return }
      if (ready) options.onReady()
      options.onTextureLoad()
    })
    texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
    texture.anisotropy = Math.min(options.compact ? 2 : 4, renderer.capabilities.getMaxAnisotropy())
    textures.push(texture)
    return texture
  }
  const day = load("earth-day-2k.jpg", true, true)
  const night = load("earth-night-1k.jpg", true)
  const cloudMap = load("earth-clouds-1k.jpg", false)
  const surfaceMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: SURFACE,
    uniforms: { uDay: { value: day }, uNight: { value: night }, uSun: { value: SUN } },
  })
  const cloudMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: CLOUDS,
    uniforms: { uClouds: { value: cloudMap }, uSun: { value: SUN } },
    transparent: true,
    depthWrite: false,
  })
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: ATMOSPHERE,
    uniforms: { uSun: { value: SUN } },
    transparent: true,
    depthWrite: false,
  })
  materials.push(surfaceMaterial, cloudMaterial, atmosphereMaterial)
  world.add(new THREE.Mesh(geometry, surfaceMaterial))
  const clouds = new THREE.Mesh(geometry, cloudMaterial)
  clouds.scale.setScalar(1.009)
  clouds.renderOrder = 1
  world.add(clouds)
  const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial)
  atmosphere.scale.setScalar(1.025)
  atmosphere.renderOrder = 2
  world.add(atmosphere)

  // Fixed great-circle connections remain attached to the surface while it
  // rotates. The opaque Earth naturally hides the back halves of the arcs.
  const arcMaterial = new THREE.LineBasicMaterial({ color: 0xd9c49c, transparent: true, opacity: 0.24, depthWrite: false })
  materials.push(arcMaterial)
  const hubLocation = options.locations[0]
  const hub = hubLocation ? new THREE.Vector3(...hubLocation) : new THREE.Vector3()
  for (const location of options.locations.slice(1)) {
    const end = new THREE.Vector3(...location)
    const points = Array.from({ length: 49 }, (_, index) => {
      const t = index / 48
      return hub.clone().lerp(end, t).normalize().multiplyScalar(1.012 + Math.sin(t * Math.PI) * 0.1)
    })
    const arc = new THREE.BufferGeometry().setFromPoints(points)
    arcGeometries.push(arc)
    world.add(new THREE.Line(arc, arcMaterial))
  }

  return {
    update({ phi, theta, time, width, dpr }: EarthFrame) {
      if (destroyed) return
      if (width !== lastWidth || Math.abs(dpr - lastDpr) > 0.04) {
        lastWidth = width
        lastDpr = dpr
        renderer.setPixelRatio(dpr)
        renderer.setSize(width, width, false)
        canvas.dataset.dpr = dpr.toFixed(2)
      }
      world.rotation.set(theta, phi, 0, "XYZ")
      clouds.rotation.y = time * 0.003
      renderer.render(scene, camera)
    },
    destroy() {
      destroyed = true
      geometry.dispose()
      arcGeometries.forEach(arc => arc.dispose())
      materials.forEach(material => material.dispose())
      textures.forEach(texture => texture.dispose())
      renderer.dispose()
    },
  }
}
