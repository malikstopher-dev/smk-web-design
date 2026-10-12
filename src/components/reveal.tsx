"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { EASE_OUT } from "@/components/motion"

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className = "",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const delaySeconds = delay >= 1 ? delay / 1000 : delay
  return (
    <motion.div
      initial={reduced ? false : { y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT, delay: reduced ? 0 : delaySeconds }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
