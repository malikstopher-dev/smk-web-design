# SEO and contact audit

Project: SMK Web Design, `C:\TINA\malik`.
Date: 12 October 2026.

## Fixed

- Forward the validated locale through proxy request headers so the root layout emits the correct HTML language.
- List all ten standard routes in each of EN, FR and PT, plus fifty English articles: 80 unique sitemap URLs.
- Retain article source dates rather than reporting every article as modified whenever the sitemap is generated. Omit unsourced modification dates for standard pages.
- Use English canonical and Open Graph article URLs for English-only articles, including their translated-route redirects.
- Escape less-than characters when serialising JSON-LD into script elements.
- Keep contact field values after validation and provider failures using controlled inputs.
- Associate field errors with their inputs, focus the first invalid field, expose submission busy state and focus the success message.
- Validate field types and lengths server-side, reject multiline sender names, check the server-side Web3Forms key and time out provider requests after twelve seconds.
- Set the submitted email as the reply-to address.

## Verification

- `npm run lint`: passed with zero errors and warnings.
- `node scripts/check-audit.mjs`: passed. Tests use a mocked provider and cover EN/FR/PT validation, honeypot handling, file/oversized input, missing configuration, successful delivery responses, provider rejection, malformed responses and network timeout. Sitemap counts, uniqueness, alternates and article dates also pass.
- `npm run build -- --webpack`: production build and TypeScript passed. The default Turbopack build stalled in this Windows environment.
- `node scripts/check-routes.mjs http://127.0.0.1:3012`: passed against the production build. Checks `/en`, `/fr`, `/pt`, `/fr/blog`, `/en/about`, `/en/contact`, English article redirection, robots and sitemap.
- Chromium mobile viewport contact validation: passed. All three invalid entries remained populated; inline error associations and focus were correct; no page errors occurred.
- Local `WEB3FORMS_ACCESS_KEY` configuration is present. Its value was neither printed nor committed.

## Delivery boundary

Provider responses were mocked for automated tests. Inbox receipt and production environment configuration still require a real deployment submission. No live test enquiry was sent.

The audit covers technical SEO and the contact workflow. Search rankings and production Core Web Vitals were not measured.
