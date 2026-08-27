# AGENTS.md — SMK Web Design

Project: **SMK Web Design** (`smk.stopher-malik.co.za`, repo `malikstopher-dev/smk-web-design`).
Owner: Stopher Malik. Studio: Paulshof, Sandton, South Africa.
Stack: Next.js 16.2.2 (Turbopack) + React 19 + TypeScript 5 + Tailwind 4 + framer-motion + cobe globe + Web3Forms.

This file is for **future agents** (Claude, GPT, or otherwise) and the next session. Read it fully before touching anything. It is non-negotiable.

---

## 1. Mission lock — do not change

The mission of this site is unchanged. It has not changed since the studio was founded and will not change:

> **Build high-performing, SEO-ready websites for businesses in South Africa, the DRC, Mozambique, Canada, and beyond — sites that bring the call, the booking, the order. Designed in Sandton. Deployed to global edge infrastructure. One invoice. No retainers.**

Every change you make must serve this mission. If a refactor, a library swap, a copy edit, a visual change, or a new feature does not move the studio closer to this mission, **do not do it**.

If the user asks for something that contradicts this mission (e.g. "make it look more corporate", "add a subscriptions product page", "switch to a generic template aesthetic"), surface the conflict explicitly before acting. Do not silently comply.

---

## 2. No AI trace

This site is the studio's most visible work. Clients see it. Recruiters see it. Search engines see it. AI tells — language patterns, design patterns, copy patterns, code patterns that signal "a machine wrote this" — are a **direct threat to the mission** because they erode the trust the studio is built on.

### 2.1 Copy / language

- **Never** ship copy that an LLM would default to. Concretely, these patterns are banned in this repo and must be replaced when found:
  - "Built to win clients" / "Gagner des clients" / "Conquistar clientes" — used to be repeated 11 times across the i18n strings. It is now banned in any new code. Use the actual outcome ("brings the call", "ranks locally", "loads in 0.8s on 3G").
  - "Conversion-focused" as a stand-alone adjective.
  - "Solutions", "leverage", "synergy", "passionate about", "robust", "seamless", "cutting-edge", "delve into", "in today's digital landscape", "navigate the complexities".
  - Question-mark hero headlines ("X that does one thing: Y?"). Real studio copy is declarative, not rhetorical.
  - All-caps eyebrows with letter-spacing as a section header. Used in 2023–2025 SaaS templates. Use sentence case.
  - "Measured, not promised", "Trust the process", "We don't just X, we Y" — the LinkedIn-formula opener.
- **Always** use specific numbers, specific places, specific outcomes. The studio has real clients; lean on them. "22 sites live across South Africa, DRC, Mozambique, and Canada" beats "global reach".
- **Always** keep copy short. ≤18 words per line for hero copy. ≤90 characters for service `short` fields. ≤14 words for process step bodies.
- Every public-facing string lives in `src/i18n/messages/{en,fr,pt}.ts` and must be in all three languages when added or changed. No English-only copy.
- If you are unsure whether a phrase is AI-coded, ask: "would a Sandton-based web designer write this in an email to a client?" If no, rewrite.

### 2.2 Design

- **Never** add a stat block with unverifiable round numbers (`100%`, `22+`, `48h`). If a number is real, source it. If it is not, kill the block.
- **Never** use the `01 02 03 04` numbered-card rhythm on more than one section per page. Currently allowed on `/services` (where it is load-bearing) only.
- **Never** add a CTA band with generic copy ("Have a project in mind? Let's talk!") more than once per page. One CtaBand per page.
- **Avoid** a cosmic / space / "innovation dark" aesthetic on new sections or pages. The cosmic background on this site is the studio's signature and is rendered once at the body root. New sections should not duplicate or compete with it.
- **Avoid** "framer-motion + magnets + tilt + spotlight + reveal + wordmark banner" stacks. The current home page runs more motion than necessary. Do not add more; trim what is there when refactoring.
- Cards have one interaction each. Not four. Pick the strongest one (hover lift, or spotlight, or tilt, or magnetic — not all four at once).
- Buttons have one animation each (`whileHover` + `whileTap` is fine; do not add a separate spring on the same button).

### 2.3 Code

- **Never** import a library without checking that the project already uses it. The dependency list is fixed: `next`, `react`, `react-dom`, `framer-motion`, `cobe`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`. Do not add `three.js`, `gsap`, `lottie`, `react-spring`, or other animation libraries — the cosmic scene uses raw canvas + `cobe`.
- **Never** add a "client component" wrapper where a server component would do. The split is intentional: server by default, `"use client"` only for components that genuinely need state/effects/handlers. Currently the only client components are: `cosmic-background`, `globe-markers`, `hero-depth-scene` is fine as a server component (it has no client logic), `motion` helpers, `magnetic`, `reveal`, `text-reveal`, `wordmark-banner`, `pricing-cards`, `contact-form`, `site-header`, `language-switcher`, `home-services-list`, `work-grid`, `spotlight-card` (server would be fine; it's a client component because it tracks mouse position).
- **Never** add a "JSON-LD" script tag inline in a page. Add a schema function to `src/components/json-ld.tsx` and call it.
- **Never** add metadata in a `<head>` tag. Use `generateMetadata` in the page file. The pattern is consistent across all 7 page routes.
- **Never** duplicate the proxy locale detection. The single source of truth is `src/proxy.ts`, which sets the `x-smk-locale` header. Pages read it via `headers()` if they need the locale, but the canonical pattern is to read `params.locale` from the segment.
- **Never** add new font loads. The font set is locked: Geist (sans) + Fraunces (display). Mono is the system stack via `globals.css`.
- **Never** write `framer-motion` props in a way that requires importing `EASE_OUT` as a mutable array. The constant is `as const` in `src/components/motion.tsx`. Reuse it.

### 2.4 Process

- **Never** ship a change without `npm run lint` passing (0 errors, 0 warnings).
- **Never** ship a change that breaks the dev server. Smoke-test at least `/en`, `/fr`, `/fr/blog` (should show coming-soon), `/fr/blog/<any-slug>` (should 307 to `/en/blog/<same-slug>`), and `/en/about` (the page with the most layout).
- **Never** commit a BOM. If you save `blog-posts.json` with a UTF-8 BOM, JSON parsers reject it with `expected value at line 1 column 1`. The fix is: `[System.IO.File]::WriteAllBytes($f, $bytes[3..($bytes.Length-1)])` after the bad write.
- **Never** commit `.next/`, `node_modules/`, `.env.local`, or any other ignored path. The `.gitignore` is correct; do not edit it without good reason.
- **Never** use `git push` without `--force-with-lease` (or `--force`) on this repo. The remote has been overwritten multiple times and history is non-linear.

---

## 3. Operating principles

### 3.1 Audit before code

Before any non-trivial change, do a full audit pass: crawl every public route, read every relevant file, list the issues with severity (P0/P1/P2/P3), and propose a plan. Do not start editing until the user has approved the plan or the issue is clearly bounded.

The audit format that has worked here:
- Category sections (A: content, B: structural, C: a11y, D: perf, E: SEO, F: code health, G: copy, H: assets)
- Per-issue: file:line references, severity, one-line fix
- A "Sprint 1/2/3/4" priority roadmap at the end

### 3.2 De-AI pass after every copy edit

Any time you change copy, run a de-AI scan:
1. Search for the banned phrases (see §2.1) in `src/i18n/messages/`.
2. Check that all three locales are updated.
3. Check that no public-facing string is English-only.
4. Check that hero copy is declarative, not rhetorical.

### 3.3 One change at a time

Do not batch multiple refactors. Make one change, lint, verify, move to the next. The current diff is the result of item-by-item work, not a single sweep. Batching hides regressions.

### 3.4 Verify with a live render

After every change to a page component, fetch the page from `http://localhost:3000` and check the HTML. Do not trust the dev server log alone. The log only shows compile errors, not runtime breakage.

Use these checks (the dev server runs at port 3000):
- `<html lang="…">` — must be the right locale (`en-ZA`, `fr-CD`, `pt-MZ`)
- `<meta property="og:url" …>` — must be the actual page URL
- `<link rel="canonical" …>` — must be the actual page URL
- Section-specific markers: stat block absent, "01 02 03 04" absent, etc.

### 3.5 The dev server may be stale

After many edits, the Turbopack dev server can hang on stale `.next/dev` caches. The fix is: stop the dev process, `Remove-Item -Recurse .next\dev`, restart `npm run dev`. This is rare but happens.

### 3.6 Git commits

The current commit on `main` is `246f9bf`. Commit messages should:
- Use the imperative mood ("Drop the stat block", not "Dropped").
- Have a one-line title that fits in 72 characters.
- Have a body with a short rationale and the file paths touched.
- Reference any blockers, but do not name-and-shame past agents.

The current remote main is non-linear (force-pushed). Do not assume linear history when rebasing or doing archaeology.

---

## 4. Project map

```
C:\TINA\malik\
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # root <html lang>, fonts, cosmic bg
│   │   ├── template.tsx                # 200ms fade-in on page change
│   │   ├── globals.css                 # tailwind + tokens + animations
│   │   ├── cosmic-bg.css               # cosmic background CSS
│   │   ├── sitemap.ts                  # 7 routes + 50 blog posts
│   │   ├── robots.ts                   # allow all, points to sitemap
│   │   ├── actions/contact.ts          # server action, Web3Forms
│   │   └── [locale]/
│   │       ├── layout.tsx              # header, footer, dict lookup
│   │       ├── not-found.tsx           # 404 page
│   │       ├── page.tsx                # home
│   │       ├── about/page.tsx
│   │       ├── blog/page.tsx
│   │       ├── blog/[slug]/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── services/page.tsx
│   │       └── work/page.tsx
│   ├── components/                     # see §5 below
│   ├── i18n/
│   │   ├── config.ts                   # LOCALES, HTML_LANG, OG_LOCALE
│   │   ├── index.ts                    # getDict(locale)
│   │   ├── types.ts                    # Dict interface
│   │   └── messages/{en,fr,pt}.ts      # all copy
│   ├── lib/
│   │   ├── site.ts                     # SITE constants, SERVICES, PRICING
│   │   ├── projects.ts                 # PROJECTS, FEATURED_PROJECTS, categories
│   │   ├── posts.ts                    # BLOG_POSTS loader (from JSON)
│   │   ├── markers.ts                  # globe client locations
│   │   ├── blog-posts.json             # 50 posts
│   │   └── utils.ts                    # cn() helper
│   └── proxy.ts                        # Next 16 proxy: locale detection
├── public/
│   ├── og-image-1200x630.png           # (40KB; likely default Next.js; replace)
│   ├── stopher-portrait.png            # 1.3MB; optimize to 200KB
│   ├── work/                           # project screenshots
│   ├── favicon.ico
│   ├── next.svg / vercel.svg            # unused, can delete
├── next.config.ts                      # security headers, /work image cache
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json                     # shadcn config (unused; ui/ is empty)
├── package.json                        # 11 deps, 10 devDeps (locked)
```

---

## 5. Component inventory

| Component | Client? | Purpose | Notes |
|---|---|---|---|
| `cosmic-background` | yes | 300-star canvas + 4 planets + moon + nebulae | Singleton at body root. RAF pauses on hidden / out-of-viewport. |
| `hero-depth-scene` | no | 3D planes + orbits on the home hero | Static CSS animation, no JS state. |
| `globe-section` + `globe-markers` | yes | cobe 3D globe with client markers | Lazy-init on scroll into view. |
| `home-services-list` | yes | Hairline list of 6 services | Plain list, no `01–06` numbers. |
| `work-grid` (+ `ProjectCard`) | yes | Filterable work grid | Uses `useSyncExternalStore` for hover media query. |
| `pricing-cards` | yes | 3-tier pricing with radio semantics | `role="radiogroup"`; middle tier is `popular`. |
| `contact-form` | yes | Server-action form, Web3Forms | Honeypot field `company`. |
| `site-header` | yes | Sticky header, mobile menu with focus trap | No magnet on nav links; only on WhatsApp CTA. |
| `site-footer` | no | 4-column footer with socials, services, contact | |
| `language-switcher` | yes | EN/FR/PT radio | Real navigation, uses `useRouter` + cookie. |
| `page-hero` | no | Eyebrow + h1 + lede | Used by every inner page. |
| `cta-band` (in `page-hero`) | no | Closing CTA on every page | One per page. |
| `reveal` | yes | `useInView` + opacity/y | Use sparingly, not per item. |
| `motion` | yes | `FadeIn`, `HeroIn`, `HoverButton`, `HoverLift`, `EASE_OUT` | |
| `magnetic` | yes | `useMagnet` hook, `Magnetic` wrapper | Header CTA only, not nav. |
| `text-reveal` | yes | Word-by-word h1/h2 reveal | Reduce-motion aware. |
| `spotlight-card` | yes | Cursor-tracking gradient on card hover | |
| `stat-counter` | **DELETED** | Was the count-up for `22+ / 100% / 48h` | Do not re-add. |
| `document-lang` | **DELETED** | Was a client effect to fix `lang` | Do not re-add. |
| `wordmark-banner` | yes | Big outline-text hero wordmark | Used after featured work. |

---

## 6. i18n rules

- Three locales: `en` (`en-ZA`), `fr` (`fr-CD`), `pt` (`pt-MZ`).
- The `pt` locale is for **Mozambican Portuguese**, not Brazilian. Use `você` sparingly; `tu` is unusual in MZ. The current copy is fine.
- The `fr` locale is for **DRC French**, not France. "Article" copy should not use `vous` exclusively if the studio's DRC clients use `tu` informally. Currently the copy uses `vous` and `tu` inconsistently — do not "fix" this without asking.
- The `en` locale is for **South African English** (no `Z` ending on `optimise`, no Oxford comma in headlines).
- All copy must be in all three locales. If a translation is too long for a card, shorten the source first, not the translation.
- The proxy redirects `/` to `/<detected-locale>`. Detection order: cookie (`smk-lang`), then `Accept-Language`, then `en`. The `x-smk-locale` response header is read by the root layout to set `<html lang>`.

---

## 7. SEO rules

- Every page sets `alternates.canonical` to its full URL including locale.
- Every page sets `openGraph.url` to the same. The layout fallback is `SITE_URL/<locale>`.
- Title template: `"%s | Stopher Malik · SMK Web Design"` (set in layout).
- JSON-LD: `WebSite` on home, `Person` on home and about, `LocalBusiness` on home and contact, `BreadcrumbList` on every inner page, `Article` on every blog post.
- The `Article` schema on blog posts must set `inLanguage: "en"` because posts are English-only. Non-EN blog URLs 307-redirect to `/en/blog/<slug>`. Do not change this without also translating the posts.
- Sitemap lists 7 routes × 3 locales (with `xhtml:link` alternates) + 50 blog posts (EN only). Update on any new route.
- `robots.txt` allows all and points to the sitemap. Do not block staging paths here.
- `og-image-1200x630.png` is currently the default Next.js placeholder (40KB). Replace with a real OG card showing the logo, tagline, and domain. **Not done yet** — open P0 if you find time.

---

## 8. Performance rules

- The home page currently renders 11 simultaneous CSS animations + a 60fps canvas + a cobe globe. The cosmic-background RAF pauses on hidden / out-of-viewport. The globe lazy-inits. Do not add more motion; trim.
- Every image must use `next/image` (or be in `public/` for assets like `og-image-…png`).
- Cache headers in `next.config.ts` are scoped to `/work/:path*.{jpg,jpeg,png,webp,avif,svg}`. Do not generalize to all of `/work/*` (that would cache HTML for a year).
- Fonts: Geist + Fraunces. Mono is the system stack. Do not add more fonts.
- `lucide-react` icons: tree-shakes fine. Keep usage.

---

## 9. A11y rules

- Every page has exactly one `<h1>`. The home page uses `<h1>Stopher Malik</h1>`. Inner pages use `<h1>` via `page-hero`.
- Eyebrows are `<p>` elements with `text-xs uppercase tracking-*`. Acceptable for now. Do not convert to `<span>` without a design system discussion.
- The mobile menu in `site-header.tsx` traps focus and closes on Escape. Keep that contract.
- The pricing cards use `role="radiogroup"` with `<button role="radio">`. Currently no arrow-key handler — do not add one without a usability test.
- The language switcher uses the same `radiogroup` pattern but is really a link, not a radio. Acceptable for now; the buttons navigate via `router.push`.
- `prefers-reduced-motion: reduce` is respected by: cosmic background (no animation), hero-depth-scene (no animation), spotlight card (no gradient), text-reveal (no word stagger), project card hover (no lift), StatCounter (skipped — now deleted), pricing-cards (no whileInView animation), framer-motion's `useReducedMotion` in `Reveal`, `FadeIn`, `HoverLift`, `HoverButton`, `ProjectCard`. When you add new motion, hook it through `useReducedMotion` or `@media (prefers-reduced-motion: reduce)`.

---

## 10. When the user is the developer

The user is the developer AND the business owner. They will sometimes ask for something that hurts the mission. They are the only person who can change the mission. When they do:

1. **Surface the conflict**: "This adds a 'Pricing: subscription' page, but the mission says one-time payment, no retainers. Should I do it anyway?"
2. **State the cost**: "This will take ~X hours and replace Y."
3. **Suggest an alternative**: "If the goal is recurring revenue, a 'Maintenance plans' page (separate from the build) would be on-mission."
4. **Then act** based on the user's response.

Do not silently override. Do not silently comply. The mission lock is for the project's own sake, not the user's.

---

## 11. When you don't know

Ask. The user would rather you ask than guess. Prefer:

> "I'm not sure whether to keep the 3D depth scene on the about page or move it. The mission says 'one signature aesthetic'; the depth scene is currently on the home page only. Should I (a) leave it, (b) move it to /about, or (c) kill it?"

Over:

> "I removed the depth scene because it competes with the cosmic background." [user did not ask for this]

The user is the decision-maker for taste. You are the decision-maker for code.

---

## 12. Commits and push

The current state:
- `main` is at `246f9bf` ("feat: SEO + a11y + perf + de-AI pass (P0–P3 audit)").
- The remote was last force-pushed. History is non-linear.
- The user prefers item-by-item commits, not monolithic sweeps.

When you commit:
- Title in imperative mood, ≤72 chars.
- Body with bullet points listing what changed and why.
- File paths referenced with `path:line` for non-obvious changes.
- A "Verified" line at the end with the commands run and the results.

When you push:
- Use `git push --force-with-lease origin main` (or `--force` if you've verified no one else has pushed).
- Never `git push` without a flag on this repo.

---

## 13. Final reminder

You are not building a generic portfolio site. You are building **SMK Web Design** — a working studio's most visible asset. The site has to look like it was made by a Sandton-based designer who runs the studio full-time, not by a machine that read a Medium post about portfolios.

When in doubt, less is more. When in more doubt, ship and iterate.
