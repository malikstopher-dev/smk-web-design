"use client"

import { motion } from "framer-motion"
import { EASE_OUT } from "@/components/motion"

export function WordmarkBanner({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden py-8 sm:py-14 ${className}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="whitespace-nowrap text-center font-display font-semibold uppercase leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]"
        style={{ fontSize: "clamp(2rem, 8.5vw, 10rem)" }}
      >
        {text}
      </motion.p>
    </div>
  )
}
