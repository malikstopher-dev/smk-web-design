# SMK content and hero audit — 16 October 2026

Scope: fetched all 80 URLs in the production sitemap (30 translated core/legal routes and 50 English articles). All returned HTTP 200 with one h1. Reviewed the core route templates, English service/pricing copy, project records and existing terms. The article crawl checks coverage and rendering, not the factual accuracy of every article.

## A. Content

- **P1 — Pricing needs package boundaries.** `src/i18n/messages/en.ts:200`: Starter lists branding deliverables but no website. State that explicitly; explain the website tiers and how scope determines the quote.
- **P2 — Homepage lacks buying context.** `src/app/[locale]/page.tsx`: previously about 346 rendered words, mostly project/service cards. Add business use cases and bring the existing project process onto Home.
- **P2 — Services list technology without a clear review checklist.** `src/i18n/messages/en.ts:94`: add practical scope, review and launch details using existing offerings.
- **P2 — Contact lacks preparation guidance.** `src/app/[locale]/contact/page.tsx:115`: add a short project brief checklist before the form.
- **P2 — Case studies need owner evidence.** `src/lib/projects.ts:44`: descriptions include enquiry/performance claims without supporting analytics in this repository. Do not invent metrics. Future case studies need the brief, delivered scope and owner-approved results.

## B. Structure

- **P1 — Hero stacks a full square scene below the offer.** `src/components/globe-section.tsx:24`, `src/components/home-depth.module.css`: a square stage plus controls and captions adds a planet-only scroll interval on mobile. Make Earth an absolute background layer; let copy determine the hero height.
- **P2 — Oversized wordmark interrupts the sales content.** `src/app/[locale]/page.tsx`: replace the Home wordmark break with useful project-process content.

## C. Accessibility

- **P2 — Decorative planets have interactive semantics.** The standalone hero globe presents controls and country selectors unrelated to the visitor's next step. Remove those from the Home composition; keep a labelled Earth pause control, reduced-motion support and unobstructed CTA hit targets.
- All crawled pages have one h1. Visual testing must still verify text contrast over Earth and no mobile horizontal overflow.

## D. Performance

- Remove Home's scroll-driven text transforms and layout observers when removing the standalone stage. Keep the existing Earth renderer, textures, lazy initialisation and shared animation scheduler.
- No new animation libraries, fonts or image assets are required.

## E. SEO and localisation

- Preserve canonical URLs, metadata and English-only article redirects.
- New page copy must exist in EN, FR and PT. FR/PT article indexes remain intentionally untranslated.

## F. Code health

- Implement explanatory sections as server components with dictionary props; native disclosure elements suit FAQs.
- Keep `globe-section` available for existing/future uses; only remove its Home placement.

## G. Copy

- Explain the once-off build versus third-party renewals in plain language using existing terms (`src/i18n/messages/en.ts:389`). Do not create new commercial terms or guarantees.
- Leave testimonial wording unchanged. Request source/permission evidence before expanding testimonials or claims.

## H. Assets

- Preserve Earth's current texture and rendering. Change its placement and the overlay protecting text contrast.
- No new decorative assets; the existing planets should support the content.

## Priority roadmap

1. **Sprint 1, this change:** compact Home hero, Earth behind the offer, remove the separate planet stage. Verify phone, tablet/narrow preview and desktop.
2. **Sprint 2, this change:** Home use cases/process, Services scope checklist, Pricing FAQs and Contact preparation guide. Translate EN/FR/PT and check keyboard/mobile use.
3. **Sprint 3, needs source material:** richer case studies with approved scope, before/after screenshots and measured results; verify testimonial provenance.
4. **Sprint 4, separate editorial work:** review all 50 articles for accuracy, duplication and links. Translation needs its own scope; retain current locale behaviour.

## Reference background and service motion follow-up

Reviewed `MALIK CURRENT` as a read-only reference. Ported the stronger star twinkle, occasional isolated starbursts and cursor brightening into the existing shared star renderer. No reference moon or planet implementation was copied.

The six Home service illustrations now animate their internal parts: layout assembly, data packets, chart growth, deployment, a moving design cursor and shifting brand shapes. Motion runs on mobile without hover, pauses offscreen and has individual pause controls. Reduced-motion preferences disable these animations.

## Verification completed

- `npm run lint`: zero errors or warnings.
- `npm run build -- --webpack`: successful production build and TypeScript check.
- Required locale routes and French article redirect passed; canonical URLs and document languages matched.
- Home, Services, Pricing and Contact in EN/FR/PT: HTTP 200, one h1, no horizontal overflow at 390px, no page errors.
- All six service illustrations changed over time on mobile and stayed still when paused. Reduced-motion check passed.
- Pricing FAQ opened with the keyboard. Hero motion and pause checks passed.
- Desktop and mobile screenshots reviewed. The earlier compact-hero checks covered 390px, 668px and 1440px widths.
- Browser emitted WebGL texture and Earth preload warnings; these do not block rendering. Planet rendering was left unchanged in the star/card follow-up, as requested.
