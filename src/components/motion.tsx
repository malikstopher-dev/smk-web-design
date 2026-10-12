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
import styles from "./interaction-polish.module.css"

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
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { y }}
      whileInView={{ y: 0 }}
      viewport={{ once, margin: "-48px" }}
      transition={{ duration: reduced ? 0 : duration, ease: EASE_OUT, delay: reduced ? 0 : delay }}
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
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { y: 12 }}
      animate={{ y: 0 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT, delay: reduced ? 0 : delay }}
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
  const magnet = useMagnet(0.25, 8)
  const reduced = useReducedMotion()
  return (
    <motion.a
      {...magnet}
      whileHover={reduced ? undefined : { scale: 1.035 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.32, ease: EASE_OUT }}
      className={`${className} ${styles.button}`}
      style={{ ...magnet.style, ...style }}
      {...rest}
    >
      <span className={styles.buttonContent}>{children}</span>
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
