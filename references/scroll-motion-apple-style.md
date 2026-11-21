# Scroll-Bound Motion

The scroll engine for reversible, continuous motion. Load this for scroll-progress effects, damped read values, parallax, and scroll-timeline enhancement. Load `animations-apple-style.md` for springs, gestures, and non-scroll transitions.

This file distills documented browser APIs and inferred flagship-page patterns. Numeric ranges are implementation defaults unless marked otherwise.

## 1. Scope

This file owns:

- scroll-progress mapping
- damped read values
- passive scroll sampling
- CSS scroll-bound enhancement
- reduced-motion resolution
- scroll-motion failure modes

This file does not own:

- page anatomy; use `web-marketing-language-apple-style.md`
- scene choreography; use `scrollytelling-apple-style.md`
- media decode and video scrub; use `media-assets-and-delivery-apple-style.md`
- general spring timing; use `animations-apple-style.md`

## 2. Doctrine

One-shot reveal is a boolean state machine. Scroll-bound motion is a pure function of position.

Use scroll-bound motion only when:

- the effect must reverse when the user scrolls back
- position carries meaning, such as progress through a chapter
- multiple properties move at deliberate different rates
- the surface is flagship, onboarding, or media-led

Do not use scroll-bound motion for:

- utility lists, forms, settings, docs, or data tables
- text that must be read at speed
- controls whose affordance must remain fixed
- any effect that needs to block native scrolling

Must: keep native scroll position authoritative.

Must: use a passive scroll listener and never call `preventDefault()` on wheel or touch movement for ordinary scrolling.

Must: resolve to the final visible state under reduced motion.

## 3. Core mapping

Define the clamp once and reuse it.

```js
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const mapRange = (value, inA, inB, outA, outB) => {
  const span = inB - inA;
  if (span === 0) return outA;
  return outA + clamp01((value - inA) / span) * (outB - outA);
};
```

Every scroll-bound property must have:

- an input range expressed in page or element coordinates
- an output range expressed in transform, opacity, or color tokens
- a clamped result
- a final state that does not depend on animation frames running

## 4. Damped read value

Smooth the value read from scroll. Never smooth the scroll container.

```js
const ALPHA = 0.1; // implementation default: 0.08-0.12
let raw = 0;
let smooth = 0;
let frame = 0;

const onScroll = () => {
  raw = window.scrollY;
  if (!frame) frame = requestAnimationFrame(tick);
};

function tick() {
  frame = 0;
  smooth += (raw - smooth) * ALPHA;

  const start = chapter.offsetTop;
  const end = start + chapter.offsetHeight - window.innerHeight;
  const progress = mapRange(smooth, start, end, 0, 1);

  inner.style.transform =
    `translateY(${mapRange(progress, 0, 1, 0, -120).toFixed(2)}px) ` +
    `scale(${mapRange(progress, 0, 1, 0.9, 1).toFixed(3)})`;

  if (Math.abs(raw - smooth) > 0.1) frame = requestAnimationFrame(tick);
}

window.addEventListener('scroll', onScroll, { passive: true });
```

Rules:

- Read layout in the frame, not inside the scroll callback.
- Batch all reads before writes.
- Stop the rAF loop when the value settles.
- Keep simultaneous animated layers at 6–8 or fewer.
- Use transform and opacity first. Avoid animating layout properties.
- Do not add `will-change` globally. Add it to active layers only.

## 5. Parameter defaults

| Parameter | Default | Range | Notes |
|---|---|---|---|
| damping alpha | 0.1 | 0.08–0.12 | Lower is slower; too low feels detached. |
| sentinel height | 300vh | 200–500vh | Longer scenes give motion room to breathe. |
| vertical travel | -120px | -40–-200px | Larger values suit full-bleed media. |
| scale | 0.9–1 | 0.85–1 | Avoid large scale changes on text. |
| simultaneous layers | 6 | up to 8 | More layers increase jank risk. |
| opacity floor | 0.85 | 0.6–1 | Never hide core content. |

These are implementation defaults. They are not platform constants.

## 6. CSS scroll-bound enhancement

Use CSS scroll timelines where supported, but do not let CSS and JS drive the same property.

```css
@supports (animation-timeline: scroll()) {
  .progressive .scene__title {
    animation: wipe linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 45%;
  }

  @keyframes wipe {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
}
```

Rules:

- Set a `js-scroll` class only when the JS controller owns a scene.
- Gate CSS effects with `.progressive:not(.js-scroll)`.
- Do not combine a view-timeline animation and a JS transform on the same element.
- Treat browser support as a progressive enhancement, not a baseline requirement.

## 7. Reduced motion

Reduced motion resolves the scene to its final state. It does not freeze content halfway.

```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduce) {
  inner.style.transform = 'none';
  inner.style.opacity = '1';
} else {
  window.addEventListener('scroll', onScroll, { passive: true });
}
```

```css
@media (prefers-reduced-motion: reduce) {
  .scene__inner {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}
```

Must: keep all text and controls visible and usable.

Must: preserve the same reading order and destinations.

Should: keep a short opacity-only transition when the platform still allows it.

## 8. Failure modes

| Failure | Fix |
|---|---|
| Stutter on low-end devices | Reduce layers, cap work, reuse transforms, remove blur. |
| Content never reaches final state | Clamp ranges and write final state on reduce/no-script. |
| JS and CSS fight | Gate one controller per property. |
| Scene feels detached | Raise damping alpha within range. |
| Page feels like an app demo | Use scroll motion only on chapter-defining moments. |
| Sticky ancestor breaks | Check `overflow` on ancestors in `scrollytelling-apple-style.md`. |
| Scroll hijack | Remove `preventDefault()` and restore keyboard scrolling. |

## 9. Review checks

- Is the scroll position still native and unmodified?
- Is the listener passive?
- Is the read value damped, not the scroll container?
- Are all ranges clamped?
- Are reads batched before writes?
- Are no more than 8 layers active?
- Does reduced motion show the final state?
- Does no-script show the same information?

## Related

- `animations-apple-style.md`
- `restraint-and-antislop-apple-style.md`
- `scrollytelling-apple-style.md`
- `media-assets-and-delivery-apple-style.md`
- `web-engineering-apple-style.md`
- `accessibility-apple-style.md`
