"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
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
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
