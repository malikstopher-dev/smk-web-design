"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import styles from "./signal-panels.module.css"

export function ContactSignal() {
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const update = (event: Event) => setFocused((event as CustomEvent<boolean>).detail)
    window.addEventListener("smk:contact-focus", update)
    return () => window.removeEventListener("smk:contact-focus", update)
  }, [])
  return <div className={styles.contactObject} data-focused={focused} aria-hidden="true">
    <div className={styles.envelope}>
      <div className={styles.letter} />
      <div className={styles.envelopeBody} />
      <div className={styles.seal}><ArrowUpRight size={18} strokeWidth={1.4} /></div>
    </div>
  </div>
}
