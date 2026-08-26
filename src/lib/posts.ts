import postsJson from "./blog-posts.json"

export interface BlogPost {
  slug: string
  title: string
  category: string
  description: string
  meta: string
  body: string
}

export const BLOG_POSTS = postsJson as BlogPost[]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export const BLOG_CATEGORIES = Array.from(
  new Set(BLOG_POSTS.map((p) => p.category)),
).sort()
