"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion"
import type { MouseEvent, ReactNode } from "react"
import { useMagnet } from "@/components/magnetic"

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function FadeIn({
  children,
  delay = 0,
  y = 12,
  duration = 0.3,
  className = "",
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-48px" }}
      transition={{ duration, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type HoverButtonProps = HTMLMotionProps<"a"> & {
  children: ReactNode
}

export function HoverButton({
  children,
  className = "",
  style,
  ...rest
}: HoverButtonProps) {
  const magnet = useMagnet(0.25, 5)
  return (
    <motion.a
      {...magnet}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.a>
  )
}

export function HoverLift({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.5 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.5 })

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 8)
    rx.set(-py * 7)
  }

  function onMouseLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={reduce ? undefined : { y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={className}
      style={{ transformPerspective: 900, rotateX: srx, rotateY: sry }}
    >
      {children}
    </motion.div>
  )
}
