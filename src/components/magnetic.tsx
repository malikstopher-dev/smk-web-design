"use client"

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

function canMagnet() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function useMagnet(strength = 0.3, maxShift = 6) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })
  const enabled = useRef(false)

  useEffect(() => {
    enabled.current = canMagnet()
  }, [])

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    if (!enabled.current) return
    const r = e.currentTarget.getBoundingClientRect()
    let dx = (e.clientX - (r.left + r.width / 2)) * strength
    let dy = (e.clientY - (r.top + r.height / 2)) * strength
    const m = Math.hypot(dx, dy)
    if (m > maxShift) {
      dx = (dx / m) * maxShift
      dy = (dy / m) * maxShift
    }
    x.set(dx)
    y.set(dy)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { style: { x: springX, y: springY }, onMouseMove, onMouseLeave }
}

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
  maxShift = 6,
}: {
  children: ReactNode
  className?: string
  strength?: number
  maxShift?: number
}) {
  const magnet = useMagnet(strength, maxShift)
  return (
    <motion.span {...magnet} className={`inline-flex ${className}`}>
      {children}
    </motion.span>
  )
}
