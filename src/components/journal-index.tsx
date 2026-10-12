"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"
import type { Dict } from "@/i18n/types"
import styles from "./signal-panels.module.css"

type Article = { slug: string; title: string; category: string; description: string }

export function JournalIndex({ posts, controls, readLabel, locale }: { posts: Article[]; controls: Dict["sceneControls"]; readLabel: string; locale: string }) {
  const [query, setQuery] = useState("")
  const [topic, setTopic] = useState("")
  const topics = useMemo(() => [...new Set(posts.map(post => post.category))], [posts])
  const filtered = posts.filter(post => (!topic || post.category === topic) && `${post.title} ${post.description}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)))
  return <div>
    <div className={styles.journalControls}>
      <div className={styles.search}>
        <label htmlFor="journal-search" className="sr-only">{controls.search}</label>
        <input id="journal-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={controls.search} />
        <Search aria-hidden size={16} />
      </div>
      <output className={styles.label} aria-live="polite">{filtered.length} / {posts.length}</output>
    </div>
    <div className={styles.topics} role="group" aria-label={controls.all}>
      {["", ...topics].map(category => <button key={category} type="button" className={styles.topic} aria-pressed={category === topic} onClick={() => setTopic(category)}>{category || controls.all}</button>)}
    </div>
    <div className={styles.journalGrid}>
      {filtered.map(post => <Link className={styles.article} key={post.slug} href={`/${locale}/blog/${post.slug}`}>
        <span className={styles.category}>{post.category}</span>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <span className={styles.read}>{readLabel}<ArrowUpRight aria-hidden size={17} /></span>
      </Link>)}
    </div>
    {filtered.length === 0 && <p className={styles.empty} role="status">{controls.empty}</p>}
  </div>
}
