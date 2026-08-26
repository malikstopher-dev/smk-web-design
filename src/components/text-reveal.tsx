"use client"

import { motion, useReducedMotion } from "framer-motion"
import { EASE_OUT } from "@/components/motion"
import type { CSSProperties } from "react"

export function RevealHeading({
  children,
  as: Tag = "h2",
  className = "",
  style,
  id,
}: {
  children: string
  as?: "h1" | "h2" | "h3"
  className?: string
  style?: CSSProperties
  id?: string
}) {
  const reduce = useReducedMotion()
  const words = children.split(" ")

  if (reduce) {
    return (
      <Tag className={className} style={style} id={id}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag className={className} style={style} id={id}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-64px" }}
        aria-label={children}
        style={{ display: "inline" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden
            className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "115%" },
                show: { y: "0%", transition: { duration: 0.55, ease: EASE_OUT } },
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
