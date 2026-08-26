"use client"

import { useEffect } from "react"

export function CosmicBackground() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const canvasMaybe = document.getElementById(
      "cosmic-star-canvas",
    ) as HTMLCanvasElement | null
    if (!canvasMaybe) return
    const canvas: HTMLCanvasElement = canvasMaybe
    const moon = document.getElementById("cosmic-moon")
    const planet1 = document.getElementById("planet-1")
    const planet2 = document.getElementById("planet-2")
    const planet3 = document.getElementById("planet-3")
    const planet4 = document.getElementById("planet-4")
    if (!canvas) return

    const ctxMaybe = canvas.getContext("2d")
    if (!ctxMaybe) return
    const ctx: CanvasRenderingContext2D = ctxMaybe

    let W = 0
    let H = 0
    let raf = 0
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const timers: ReturnType<typeof setTimeout>[] = []

    const STAR_CONFIG = [
      { count: 160, rMin: 0.4, rMax: 0.9, opMin: 0.35, opMax: 0.72, flickerSpeed: [0.003, 0.009], scrollFactor: 0.02, glowChance: 0.06, glowScale: 2.5, colors: ["200,220,255", "210,230,255", "220,240,255", "255,255,255"] },
      { count: 100, rMin: 0.9, rMax: 1.6, opMin: 0.45, opMax: 0.88, flickerSpeed: [0.005, 0.013], scrollFactor: 0.05, glowChance: 0.18, glowScale: 3.5, colors: ["220,235,255", "200,220,255", "240,248,255", "255,255,255"] },
      { count: 40, rMin: 1.6, rMax: 2.6, opMin: 0.6, opMax: 0.95, flickerSpeed: [0.006, 0.018], scrollFactor: 0.1, glowChance: 0.55, glowScale: 5.0, colors: ["255,255,255", "230,240,255", "210,230,255"] },
    ]

    function seededRand(seed: number) {
      let s = seed
      return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
      }
    }

    interface Star {
      nx: number
      ny: number
      r: number
      flickerPhase: number
      flickerSpeed: number
      opMin: number
      opMax: number
      glow: boolean
      glowScale: number
      col: string
      scrollFactor: number
    }

    let stars: Star[] = []

    function buildStars() {
      stars = []
      const rand = seededRand(0xc0ffee42)
      STAR_CONFIG.forEach((cfg) => {
        for (let i = 0; i < cfg.count; i++) {
          const col = cfg.colors[Math.floor(rand() * cfg.colors.length)]
          const hasGlow = rand() < cfg.glowChance
          stars.push({
            nx: rand(),
            ny: rand(),
            r: cfg.rMin + rand() * (cfg.rMax - cfg.rMin),
            flickerPhase: rand() * Math.PI * 2,
            flickerSpeed:
              cfg.flickerSpeed[0] + rand() * (cfg.flickerSpeed[1] - cfg.flickerSpeed[0]),
            opMin: cfg.opMin + rand() * 0.08,
            opMax: cfg.opMax - rand() * 0.08,
            glow: hasGlow,
            glowScale: hasGlow ? cfg.glowScale + rand() * 1.5 : 0,
            col,
            scrollFactor: cfg.scrollFactor,
          })
        }
      })
    }

    interface Burst {
      x: number
      y: number
      life: number
      decay: number
      maxR: number
      col: string
    }
    interface Spark {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      decay: number
      r: number
      col: string
    }

    const bursts: Burst[] = []
    const sparks: Spark[] = []
    let nextBurstTime = 0
    const BURST_INTERVAL_MIN = 3000
    const BURST_INTERVAL_MAX = 7000

    function scheduleBurst() {
      nextBurstTime =
        performance.now() +
        BURST_INTERVAL_MIN +
        Math.random() * (BURST_INTERVAL_MAX - BURST_INTERVAL_MIN)
    }

    function fireBurst() {
      const nx = 0.05 + Math.random() * 0.9
      const ny = 0.05 + Math.random() * 0.65
      const sx = nx * W
      const sy = ny * H

      bursts.push({
        x: sx,
        y: sy,
        life: 1.0,
        decay: 0.018 + Math.random() * 0.012,
        maxR: 18 + Math.random() * 22,
        col: Math.random() < 0.7 ? "200,230,255" : "255,240,200",
      })

      const sparkCount = 8 + Math.floor(Math.random() * 7)
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + Math.random() * 0.4
        const speed = 0.6 + Math.random() * 1.8
        sparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.8 + Math.random() * 0.2,
          decay: 0.008 + Math.random() * 0.008,
          r: 0.5 + Math.random() * 1.2,
          col: Math.random() < 0.6 ? "180,220,255" : "255,255,255",
        })
      }

      scheduleBurst()
    }

    function drawBursts() {
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.life -= b.decay
        if (b.life <= 0) {
          bursts.splice(i, 1)
          continue
        }

        const r = b.maxR * (1 - b.life) * 3
        const alpha = b.life * 0.75
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(r, 1))
        g.addColorStop(0, `rgba(${b.col},${Math.min(alpha * 1.4, 0.95)})`)
        g.addColorStop(0.3, `rgba(${b.col},${alpha * 0.7})`)
        g.addColorStop(0.7, `rgba(${b.col},${alpha * 0.2})`)
        g.addColorStop(1, `rgba(${b.col},0)`)
        ctx.globalAlpha = 1
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, Math.max(r, 1), 0, Math.PI * 2)
        ctx.fill()

        if (b.life > 0.5) {
          const spikeLen = b.maxR * 2.5 * b.life
          ctx.save()
          ctx.globalAlpha = b.life * 0.6
          ctx.strokeStyle = `rgba(${b.col},1)`
          ctx.lineWidth = 0.8
          ctx.lineCap = "round"
          ctx.beginPath()
          ctx.moveTo(b.x - spikeLen, b.y)
          ctx.lineTo(b.x + spikeLen, b.y)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(b.x, b.y - spikeLen)
          ctx.lineTo(b.x, b.y + spikeLen)
          ctx.stroke()
          const dLen = spikeLen * 0.55
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(b.x - dLen, b.y - dLen)
          ctx.lineTo(b.x + dLen, b.y + dLen)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(b.x + dLen, b.y - dLen)
          ctx.lineTo(b.x - dLen, b.y + dLen)
          ctx.stroke()
          ctx.restore()
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy *= 0.97
        p.life -= p.decay
        if (p.life <= 0) {
          sparks.splice(i, 1)
          continue
        }

        ctx.globalAlpha = p.life * 0.9
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        gr.addColorStop(0, `rgba(${p.col},${p.life})`)
        gr.addColorStop(1, `rgba(${p.col},0)`)
        ctx.fillStyle = gr
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(${p.col},${Math.min(p.life * 1.2, 1)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let scrollY = 0
    let moonScrollOffset = 0

    const onScroll = () => {
      scrollY = window.scrollY
      moonScrollOffset = window.scrollY * 0.045
    }

    // Cursor-reactive starfield spotlight ("torch over the sky")
    const SPOTLIGHT_RADIUS = 180
    const finePointer =
      !prefersReduced &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    let cursorOn = false
    let mx = -99999
    let my = -99999
    let tx = -99999
    let ty = -99999

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      cursorOn = true
      tx = e.clientX
      ty = e.clientY
    }
    const onPointerLeave = () => {
      cursorOn = false
      tx = -99999
      ty = -99999
    }
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", onPointerLeave)
    }

    let t = 0

    function render(ts: number) {
      t += 0.016
      ctx.clearRect(0, 0, W, H)

      if (finePointer) {
        mx += (tx - mx) * 0.14
        my += (ty - my) * 0.14
      }

      stars.forEach((s) => {
        const sy = prefersReduced ? 0 : scrollY * s.scrollFactor
        const sx = s.nx * W
        const rawY = s.ny * H - sy
        const screenY = ((rawY % H) + H) % H

        const sineVal = Math.sin(t * s.flickerSpeed * 60 + s.flickerPhase)
        const norm = (sineVal + 1) * 0.5

        let boost = 0
        if (finePointer && cursorOn) {
          const dx = sx - mx
          const dy = screenY - my
          const d2 = dx * dx + dy * dy
          if (d2 < SPOTLIGHT_RADIUS * SPOTLIGHT_RADIUS) {
            const lin = 1 - Math.sqrt(d2) / SPOTLIGHT_RADIUS
            boost = lin * lin * (3 - 2 * lin)
          }
        }

        const opacity = Math.min(
          1,
          s.opMin + norm * (s.opMax - s.opMin) + boost * 0.28,
        )
        const radius = s.r * (1 + boost * 0.3)

        ctx.globalAlpha = opacity

        if (s.glow) {
          const glowR = radius * s.glowScale
          const grad = ctx.createRadialGradient(sx, screenY, 0, sx, screenY, glowR)
          grad.addColorStop(0, `rgba(${s.col},${opacity * 0.6})`)
          grad.addColorStop(0.5, `rgba(${s.col},${opacity * 0.2})`)
          grad.addColorStop(1, `rgba(${s.col},0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(sx, screenY, glowR, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgb(${s.col})`
        ctx.beginPath()
        ctx.arc(sx, screenY, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      if (!prefersReduced) {
        if (ts >= nextBurstTime) fireBurst()
        drawBursts()
      }

      ctx.globalAlpha = 1

      if (moon && !prefersReduced) {
        moon.style.transform = `translateY(${moonScrollOffset}px)`
      }

      raf = requestAnimationFrame(render)
    }

    function fadePlanetIn(
      el: HTMLElement | null,
      delayMs: number,
      targetOpacity: number,
      animDelay: string,
    ) {
      if (!el) return
      if (prefersReduced) {
        el.style.opacity = String(targetOpacity)
        el.style.animation = "none"
        return
      }
      timers.push(
        setTimeout(() => {
          el.style.animationDelay = animDelay
          el.style.animationPlayState = "running"
          el.style.transition = "opacity 2.2s ease"
          el.style.opacity = String(targetOpacity)
        }, delayMs),
      )
    }

    function setSize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    setSize()
    buildStars()
    scheduleBurst()
    raf = requestAnimationFrame(render)

    if (planet1) {
      planet1.style.animationPlayState = "paused"
      planet1.style.left = "-80px"
      fadePlanetIn(planet1, 1200, 0.55, "-15s")
    }
    if (planet2) {
      planet2.style.animationPlayState = "paused"
      planet2.style.right = "-60px"
      fadePlanetIn(planet2, 2600, 0.42, "-60s")
    }
    if (planet3) {
      planet3.style.animationPlayState = "paused"
      planet3.style.left = "-55px"
      fadePlanetIn(planet3, 3800, 0.38, "-35s")
    }
    if (planet4) {
      planet4.style.animationPlayState = "paused"
      planet4.style.right = "-45px"
      fadePlanetIn(planet4, 5000, 0.3, "-85s")
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setSize()
      }, 100)
    }
    window.addEventListener("resize", onResize, { passive: true })

    if (!prefersReduced) {
      window.addEventListener("scroll", onScroll, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      timers.forEach(clearTimeout)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      )
    }
  }, [])

  return (
    <div id="cosmic-bg" aria-hidden>
      <div id="cosmic-gradient" />
      <div id="cosmic-vignette" />
      <div id="cosmic-nebula-1" />
      <div id="cosmic-nebula-2" />
      <canvas id="cosmic-star-canvas" />
      <div id="cosmic-moon" />
      <div id="planet-1" />
      <div id="planet-2" />
      <div id="planet-3" />
      <div id="planet-4" />
      <div id="noise-overlay" aria-hidden />
    </div>
  )
}
