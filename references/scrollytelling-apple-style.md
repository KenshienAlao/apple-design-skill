# Scrollytelling Scene Inventory

Scene recipes for flagship web pages where scroll carries a story. Load this only for marketing, product reveal, onboarding hero, or keynote-like pages. Load `scroll-motion-apple-style.md` first for the mapping and damping engine.

This file distills observed flagship-page patterns. Scene values are implementation defaults, not platform constants.

## 1. Scope

This file owns:

- ranked interaction inventory
- sticky chapter scenes
- theme morph sections
- sticky-stacked cards
- canvas flipbook scenes
- word-level text wipes
- horizontal snap galleries
- pointer-reactive motion

This file does not own:

- visual tokens; use `tokens-apple-style.md`
- general motion physics; use `animations-apple-style.md`
- scroll mapping; use `scroll-motion-apple-style.md`
- video and image delivery; use `media-assets-and-delivery-apple-style.md`
- page section order; use `web-marketing-language-apple-style.md`

## 2. Eligibility

Must: use these scenes only on flagship surfaces defined in `restraint-and-antislop-apple-style.md`.

Must not: use these scenes on utility apps, data tables, docs, settings, or task-critical flows.

Must: commit fully or skip the scene. A partial pinned section is worse than a static section.

Must: provide a static final state for reduced motion and no-script paths.

Should: limit a page to 2–4 choreographed chapters. Repetition turns cinematic motion into noise.

## 3. Ranked inventory

Ranked by impact when done well and damage when done badly.

| Rank | Behavior | Best use | Main risk |
|---|---|---|---|
| 1 | Damped scroll-progress hero transform | product reveal, hero scale, depth | jank if too many layers |
| 2 | Sticky-pinned chapter | feature story with 3–5 beats | weak payoff, content burial |
| 3 | Scroll-scrubbed media | product rotation, mechanism reveal | memory and decode pressure |
| 4 | Cross-section theme morph | dark-to-light narrative shift | flash, unreadable nav |
| 5 | Sticky-stacked cards | feature comparison with continuity | cards bury each other |
| 6 | Word or line clip wipe | headline emphasis | reading disruption |
| 7 | Parallax layering | depth behind media or title | text legibility loss |
| 8 | Native horizontal snap gallery | collection browsing | accidental vertical hijack |
| 9 | Pointer-reactive sugar | ambient tilt, spotlight, magnetic CTA | fake 3D, accessibility noise |

Should: choose a richer scene only when the product story needs it.

Must not: stack more than two high-rank behaviors in one viewport without a choreography reason.

## 4. Sticky chapter

A chapter is a tall wrapper with a sticky scene inside.

```css
.chapter {
  position: relative;
  height: 400vh; /* implementation default: 200-500vh */
}

.chapter__scene {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  overflow: clip;
}

@media (prefers-reduced-motion: reduce) {
  .chapter { height: auto; }
  .chapter__scene { position: relative; height: auto; min-height: 100vh; }
}
```

Rules:

- Keep only one sticky child pinned at a time.
- Give the scene a resolved final frame.
- Do not put `overflow: hidden`, `clip`, `auto`, or `scroll` on ancestors of a sticky child in iOS Safari.
- Do not use page-level vertical scroll snapping.
- Do not change `position: sticky` inside JS on every frame.

## 5. Center-line theme morph

Use a center-line sentinel for tall sections. A `threshold: 0.5` observer can silently fail when the section is 300–500vh tall.

```js
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    document.documentElement.dataset.theme = entry.target.dataset.theme;
  }
}, {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
});

document.querySelectorAll('[data-theme]').forEach((section) => io.observe(section));
```

```css
:root[data-theme='light'] {
  --scene-bg: #f5f5f7;
  --scene-fg: #1d1d1f;
}

:root[data-theme='dark'] {
  --scene-bg: #121212;
  --scene-fg: #f5f5f7;
}

body {
  background: var(--scene-bg);
  color: var(--scene-fg);
  transition: background-color 400ms ease, color 400ms ease;
}

@media (prefers-reduced-motion: reduce) {
  body { transition: none; }
}
```

Rules:

- Define theme tokens, not one-off colors.
- Keep nav contrast explicit in both themes.
- Use the same center-line method for section state changes that depend on tall wrappers.
- Do not let the nav become transparent over a light section if its labels are light.

## 6. Sticky-stacked cards

Cards pin in sequence and shrink as later cards cover them.

```css
.stack {
  position: relative;
  isolation: isolate;
}

.stack__card {
  position: sticky;
  top: calc(16px + var(--i) * 14px);
  z-index: calc(var(--i) + 1);
  min-height: 80vh;
  margin-bottom: 24px;
  transform-origin: center top;
  transition: transform 300ms ease-out, opacity 300ms ease-out;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .stack__card {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}
```

```js
const SLOP = 4;

function paintStack() {
  const rects = cards.map((card) => card.getBoundingClientRect());
  const tops = cards.map((card) => parseFloat(getComputedStyle(card).top) || 0);

  cards.forEach((card, i) => {
    const stuck = rects[i].top <= tops[i] + SLOP;
    let buried = 0;

    if (stuck) {
      for (let j = i + 1; j < cards.length; j += 1) {
        if (rects[j].top <= tops[j] + SLOP) buried += 1;
      }
    }

    const scale = buried ? Math.max(0.85, 0.95 - 0.03 * buried) : 1;
    const opacity = buried ? Math.max(0.6, 1 - buried * 0.12) : 1;
    card.style.transform = `scale(${scale})`;
    card.style.opacity = String(opacity);
  });
}
```

Rules:

- Measure burial relative to each card's own sticky top, not a shared constant.
- Batch all reads before writes.
- Keep a readable opacity floor.
- Remove `will-change` when the stack is offscreen.
- Limit stacks to a short sequence. Long stacks become a maze.

## 7. Canvas flipbook

Use a flipbook only when video scrub and CSS scroll binding cannot express the effect. Media pipeline details live in `media-assets-and-delivery-apple-style.md`.

```js
const canvas = document.querySelector('#flip');
const ctx = canvas.getContext('2d', { alpha: false });
const frames = new Map();
let current = -1;

function drawFrame(index) {
  const target = Math.max(0, Math.min(frames.size - 1, index));
  if (target === current) return;
  const bitmap = frames.get(target);
  if (!bitmap) return;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  current = target;
}
```

Rules:

- Decode with `createImageBitmap(blob)` in a Worker.
- Transfer bitmaps with `postMessage(message, [bitmap])`.
- Keep a sliding window of 12–15 frames.
- Close every bitmap that leaves the window with `bitmap.close()`.
- Keep a static poster fallback.
- Do not use a flipbook on reduced motion or low-memory paths.
- Do not bundle Apple-owned frames or device imagery.

## 8. Word-level wipe

Wrap words at build time or with a small DOM controller. Do not animate every character by default.

```html
<h1 class="wipe" aria-label="Built for the moment">
  <span aria-hidden="true">Built</span>
  <span aria-hidden="true">for</span>
  <span aria-hidden="true">the</span>
  <span aria-hidden="true">moment</span>
</h1>
```

```css
.wipe span {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 500ms ease-out;
}

.wipe.is-visible span {
  clip-path: inset(0 0 0 0);
}

.wipe.is-visible span:nth-child(2) { transition-delay: 60ms; }
.wipe.is-visible span:nth-child(3) { transition-delay: 120ms; }
.wipe.is-visible span:nth-child(4) { transition-delay: 180ms; }

@media (prefers-reduced-motion: reduce) {
  .wipe span { clip-path: none; transition: none; }
}
```

Rules:

- Keep the real text available to assistive technology.
- Keep stagger under 200ms total for short headlines.
- Do not wipe body copy.
- Do not hide the headline permanently when scripting fails.

## 9. Horizontal snap gallery

Use native horizontal scrolling. Never translate the page vertically to simulate a gallery.

```css
.gallery {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 32vw);
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
}

.gallery__item {
  scroll-snap-align: start;
}
```

Rules:

- Horizontal snap is allowed; vertical page snap is not.
- Keep a visible scrollbar or a clear next control.
- Support keyboard arrow scrolling.
- Preserve the native drag momentum.
- Do not call `preventDefault()` on wheel or touch events.

## 10. Pointer-reactive motion

Use pointer sugar only on fine-pointer devices and only for ambient detail.

```css
@media (hover: hover) and (pointer: fine) {
  .tilt {
    transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
    transition: transform 160ms ease-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tilt { transform: none !important; transition: none !important; }
}
```

Rules:

- Never put `perspective` or `rotateX` on the scroll axis.
- Do not let tilt move text that must be read.
- Use small angles and a quick return to rest.
- Gate by pointer capability and reduced motion.
- Skip entirely on touch-only layouts.

## 11. Failure table

| Symptom | Cause | Fix |
|---|---|---|
| Sticky scene never pins | ancestor `overflow` value | remove overflow from ancestors |
| Theme changes too early | observer threshold on tall section | use center-line sentinel |
| Cards bury each other | shared burial constant | measure per-card sticky top |
| Flipbook stutters | full-frame decode on main thread | Worker decode plus window |
| Text reads like a machine | character-level stagger | use word or line units |
| Page feels hijacked | wheel or touch interception | restore native scroll |
| Motion looks generic too many effects | no restraint model | apply `restraint-and-antislop-apple-style.md` |

## 12. Review checks

- Is the surface eligible for cinematic scenes?
- Does each scene reach a resolved final frame?
- Is there a static reduced-motion and no-script path?
- Are media assets owned or permissively licensed?
- Are sticky ancestors clean?
- Are observers sized correctly for tall sections?
- Are reads batched before writes?
- Is native scrolling untouched?

## Related

- `restraint-and-antislop-apple-style.md`
- `scroll-motion-apple-style.md`
- `media-assets-and-delivery-apple-style.md`
- `web-marketing-language-apple-style.md`
- `web-engineering-apple-style.md`
- `accessibility-apple-style.md`
