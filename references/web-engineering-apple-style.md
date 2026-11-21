# Web Engineering for Flagship Surfaces

Front-end architecture for fast, resilient marketing and product pages. Load this for page structure, progressive enhancement, asset loading, script ownership, and CSS namespacing.

Bundle and file-path observations are dated snapshots, not requirements. The rules below translate them into platform-neutral engineering defaults.

## 1. Scope

This file owns:

- semantic document structure
- progressive enhancement
- script loading and controller ownership
- CSS namespace and versioning
- font and media delivery discipline
- front-end anti-patterns

This file does not own:

- visual tokens; use `tokens-apple-style.md`
- media pipeline; use `media-assets-and-delivery-apple-style.md`
- page anatomy and copy; use `web-marketing-language-apple-style.md`
- scroll engines; use `scroll-motion-apple-style.md`

## 2. Architecture posture

Flagship marketing pages areDocuments with controllers, not single-page apps by default.

Must: ship semantic HTML that renders content before JavaScript runs.

Must: keep navigation, headline copy, pricing, and primary CTAs in the server-rendered document.

Should: use small vanilla controllers for isolated behaviors.

Should: avoid a client framework for a mostly-static product page.

May: use a framework for real application state, configuration tools, or account surfaces.

Observed flagship bundles use vanilla JavaScript controllers and shared utilities. Claims that a specific framework powers these pages are third-party speculation and are excluded from core guidance.

## 3. Progressive enhancement

```html
<html class="no-js">
  <head>
    <script>document.documentElement.className = 'js';</script>
  </head>
  <body>
    <section class="reveal">Content is present without JavaScript.</section>
  </body>
</html>
```

```css
.reveal {
  opacity: 1;
}

.js .reveal {
  opacity: 0;
  transition: opacity 400ms ease;
}

.js .reveal.is-visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .js .reveal {
    opacity: 1;
    transition: none;
  }
}
```

Rules:

- The no-script state is the complete content, not a blank page.
- Add scripted hiding only after the `js` class is set.
- Reduced motion must restore the no-script final state.
- Never use `display: none` as the only pre-reveal state for essential content.
- Keep controls functional without script where native HTML can do the job.

Fix typo: "nativeHTML" -> "native HTML". Need do later.

## 4. Script loading

Rules:

- Defer non-critical JavaScript.
- Load controllers only for sections present on the page.
- Avoid render-blocking bundles in the head.
- Split long-lived shared UI from page-specific behavior.
- Version shared components when many pages depend on them.
- Use custom events or an event bus only when direct wiring would create coupling.
- Destroy observers and listeners when controllers unmount.

Observed upstream patterns include versioned global navigation and footer bundles, CommonJS modules, a shared-instance registry, custom event controllers, and DOM helper modules. Treat these as examples of isolation, not required library choices.

## 5. CSS discipline

```css
.thing__title { }
.thing__cta { }
.thing.is-open { }
```

Rules:

- Namespace component classes.
- Keep state classes on the component element.
- Prefer flat, hyphenated names over deep selector chains.
- Do not rewrite long-lived shared components in place across every page; version them.
- Inline only critical CSS needed for first paint.
- Keep tokens in `tokens-apple-style.md`.
- Keep all effects behind capability and motion checks.

Anti-patterns:

- global utility soup with no ownership
- duplicate class names across page teams
- enormous single stylesheet for every surface
- runtime style injection for static design tokens
- one-off colors in page CSS when a token exists

## 6. Fonts

Rules:

- Prefer the system font stack for product and marketing surfaces.
- Do not bundle or redistribute proprietary system fonts.
- Use a variable or fallback stack only with a clear license.
- Set `font-display: swap` for any licensed webfont.
- Use `size-adjust`, `ascent-override`, and metric overrides only when measured.
- Keep type scale values in the canonical tokens.

Observed flagship pages use a system font stack rather than downloading the proprietary UI font. This is a Should for new work, not a universal ban on licensed webfonts.

## 7. Loading discipline

```html
<link rel="preconnect" href="{{ASSET_ORIGIN}}">
<link rel="preload" as="image" href="/media/generated-hero.webp">

<picture>
  <source type="image/avif" srcset="/media/hero.avif">
  <source type="image/webp" srcset="/media/hero.webp">
  <img src="/media/hero.jpg" width="1920" height="1080" fetchpriority="high" alt="Generated hero">
</picture>
```

Rules:

- Preconnect only to used origins.
- Preload only one first-paint asset.
- Add explicit image dimensions.
- Use responsive sources for art direction and density.
- Lazy-load below-fold media.
- Fingerprint static assets for immutable caching.
- Keep the first response small enough for the LCP target in `media-assets-and-delivery-apple-style.md`.

Replace `{{ASSET_ORIGIN}}` with the project's real static origin.

## 8. Front-end anti-patterns

- SPA framework for a static marketing page
- one unoptimized JPEG for every viewport
- render-blocking JavaScript
- no lazy loading below the fold
- no explicit media dimensions
- global CSS without namespace
- in-place rewrite of a shared nav or footer used by many pages
- hidden content that never appears without script
- global smooth scrolling or page-level snap
- copying captured reference CSS instead of deriving rules

## 9. Review checks

- Does the document work before JavaScript?
- Are core content and CTA in the server HTML?
- Are scripts deferred and section-scoped?
- Are component classes namespaced?
- Are shared components versioned?
- Is only one asset preloaded?
- Are images responsive, dimensioned, and prioritized correctly?
- Are listeners and observers torn down?

## Related

- `web-marketing-language-apple-style.md`
- `media-assets-and-delivery-apple-style.md`
- `scroll-motion-apple-style.md`
- `scrollytelling-apple-style.md`
- `tokens-apple-style.md`
- `upstream-sources-apple-style.md`
