# Apple-Style Animation — Motion and Interaction Physics

HIG-inspired motion system. Numbers marked as implementation defaults reproduce the feel; Apple does not publish one universal constant. Load `design-apple-style.md` for visual rules.

## 1. Motion doctrine

1. During direct manipulation, track the finger 1:1. No spring while the finger is down.
2. On release, spring to the committed state with velocity-aware projection.
3. Motion explains state change, hierarchy, or continuity; it never decorates by default.
4. Every animation is interruptible, composable, and cancelable.
5. Reduce Motion replaces geometry with opacity or instant final state. Crossfade only, 150ms maximum.
6. Animation is a product feature: define posture (subtle/standard/flagship) before choosing primitives.

## 2. Spring vs curve

Use a spring when:

- the user dragged, flicked, or tossed something
- the element has spatial continuity
- destination depends on velocity
- the object needs mass

Use a curve when:

- the change is non-spatial: color, opacity, tint
- the transition has no momentum: toast, skeleton, shimmer
- timing must be deterministic

### Implementation defaults

```swift
// SwiftUI, iOS 17+
.spring(duration: 0.35, bounce: 0.15)   // standard
.spring(duration: 0.45, bounce: 0.08)   // sheet
.spring(duration: 0.25, bounce: 0.20)   // control
.spring(duration: 0.40, bounce: 0.00)   // calm

// UIKit
UIViewPropertyAnimator(duration: 0.35, dampingRatio: 0.85)
UIViewPropertyAnimator(duration: 0.45, dampingRatio: 0.92)
UIViewPropertyAnimator(duration: 0.25, dampingRatio: 0.70)
```

CSS curve equivalents:

```css
--apple-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--apple-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--apple-ease-in: cubic-bezier(0.4, 0, 1, 1);
```

Damping guide:

- 0.9–1.0: premium, almost no overshoot.
- 0.8–0.9: default snap.
- 0.6–0.8: playful settle.
- below 0.6: cheap bouncy junk.

Ten house gates for motion audits:

1. Entrances and press states scale from `0.97`; never a different factor.
2. Interactive controls have an immediate pressed state within 80–120ms.
3. Invalid forms shake on the X axis with decaying amplitude.
4. Directional steppers slide by signed offset; forward and backward differ.
5. `height: auto` transitions use `interpolate-size: allow-keywords` where available, with an instant fallback.
6. Moving elements animate `transform` or `opacity`; never `left`, `top`, `inset-inline-start`, or `inset-block-start`.
7. Theme switching is instant; suppress transitions for one frame with a `.theme-switching` class on the root.
8. Tooltips use a short show delay and skip the delay when moving between adjacent targets.
9. Springs derive stiffness and damping from velocity; no fixed bounce on every distance.
10. Scroll Overscroll and carousels rubber-band against the drag direction, with reduced-motion fallbacks.

## 3. Component motion map

### Button

- Press: scale 0.97, 80–120ms, ease-out.
- Highlight: immediate.
- Release: spring 250ms, bounce 0.15.
- Disabled: opacity 0.4, no motion.

### Toggle

- Knob follows finger 1:1.
- Commit: spring 280–320ms, bounce 0.10–0.15.
- Track fill: crossfade 120–160ms.
- Haptic fires once on commit.

### Segmented control

- Selection pill: spring 300ms, bounce 0.08.
- Label color: crossfade 120ms.
- Commit on midpoint crossing.

### Sheet or modal

- Present: spring 450–550ms, bounce 0.05–0.10.
- Dim: opacity 200–250ms.
- Dismiss drag: content follows finger 1:1.
- Commit dismiss: offset greater than 25% height or velocity greater than 0.5pt/ms.
- Cancel: spring 350ms, bounce 0.10.
- Fast flick: continue offscreen.

### Navigation push and pop

- Push: 300–350ms, calm curve or spring bounce 0.
- Interactive pop: tracks pan 1:1.
- Commit: 50% width or velocity greater than 0.5pt/ms.
- Shared element: spring 400ms, bounce 0.05.

### Tab switch

- Crossfade plus 2–4px vertical translate.
- 180–220ms.
- No full-width slide.

### List insert and delete

- Affected rows animate together.
- Spring 400ms, bounce 0.10.
- Insert: opacity 0 to 1, scale 0.96 to 1.
- Reflow neighbors in the same transaction.

### Pull to refresh

- Resistance starts immediately.
- Threshold: 70–90pt.
- Haptic once at threshold.
- Release: spring 350ms, bounce 0.10.

## 4. Carousel mechanics

A carousel is a paging scroll view with velocity-aware commit.

### While dragging

- Content tracks finger exactly.
- No snapping while finger is down.
- Horizontal drag wins only when `abs(dx) > abs(dy) * 1.2`.
- Vertical drag belongs to parent scroll.
- Page indicator updates on commit, not during drag.

### On release

```text
projected = currentOffset + velocity * projectionTime
targetPage = round(projected / pageWidth)
```

- projectionTime: 0.15–0.25s.
- Advance when drag passes 50% page width or velocity exceeds about 0.5pt/ms.
- Otherwise snap back.
- Snap: spring 350–450ms, bounce 0.08–0.15.
- High velocity: spring 450ms, bounce 0.05.

### End of carousel and rubber band

At first or last page:

- Do not advance to a phantom page.
- Enable horizontal bounce.
- Overscroll tracks finger with non-linear resistance.
- Resistance is asymptotic: further pull yields less movement.
- Bound overscroll to 20–35% of viewport width.
- Release: spring back 350–500ms, bounce 0.10–0.15.
- Continued swiping produces bounded stretch, not repeated page commits.
- Fire one edge haptic on first crossing.

Implementation-grade rubber band approximation:

```js
const max = viewportWidth * 0.28;
const resisted = max * (1 - Math.exp(-Math.abs(raw) / max)) * Math.sign(raw);
```

Apple's real scroll curve uses bounded rational resistance with coefficient around 0.55. The approximation above gives the same feel: 1:1 first, then resistance, then hard limit.

### Looping carousel

- Clone first and last pages.
- Start on a clone of the first real page.
- After settling on a clone, recenter to the real page with animation disabled.
- Never recenter visibly.

### Carousel anti-patterns

- Snapping during drag.
- Linear ease snap after release.
- Page dots updating before commit.
- Infinite bounce past edge.
- Haptic on every frame.
- Auto-advance that ignores user momentum.

## 5. Scroll physics

- `UIScrollViewDecelerationRateNormal` ≈ 0.998 per 60Hz frame.
- `UIScrollViewDecelerationRateFast` ≈ 0.99 per 60Hz frame.
- Scroll bounce coefficient ≈ 0.55 of scroll dimension.
- Edge bounce is axis-specific.
- Momentum must be velocity-aware.

## 6. Timing table

| Pattern | Duration | Bounce / damping | Trigger |
|---|---:|---:|---|
| Button press | 80–120ms | ease-out | touch down |
| Button release | 250ms | 0.15 | touch up |
| Toggle | 280–320ms | 0.10–0.15 | commit |
| Segmented slide | 300ms | 0.08 | selection |
| Sheet present | 450–550ms | 0.05–0.10 | present |
| Sheet dismiss | 350–500ms | velocity-aware | dismiss |
| Navigation push | 300–350ms | 0–0.05 | push |
| Shared element | 400ms | 0.05 | continuity |
| Tab switch | 180–220ms | none | tab tap |
| List reflow | 400ms | 0.10 | insert/delete |
| Carousel snap | 350–450ms | 0.08–0.15 | release |
| Rubber-band return | 350–500ms | 0.10–0.15 | overscroll release |
| Color / opacity | 120–250ms | curve | state change |
| Reduce Motion fade | ≤150ms | none | replacement |

## 7. Reduce Motion

- Remove translation, scale, parallax, and bounce.
- Replace with opacity fade ≤150ms.
- Keep state changes instant and legible.
- Never remove feedback entirely.
- Respect `prefers-reduced-motion` on web and Reduce Motion on Apple platforms.

## 8. Anti-patterns

- Spring on opacity-only change.
- Bounce above 0.25.
- Long choreography sequence.
- Ease-in-out on drag release.
- Snap before finger leaves the surface.
- Motion that blocks input.
- Ignoring velocity.
- Ignoring Reduce Motion.

## 9. QA checklist

- Direct manipulation is 1:1 during drag.
- Commit uses velocity projection.
- Interruptions do not jump.
- Reduce Motion path exists.
- Haptics fire once, not per frame.
- Carousel edge shows bounded rubber band.
- No phantom page at carousel end.
- Timing values come from the scale.

## Related

- `design-apple-style.md`
- `tokens-apple-style.md`
- `scroll-motion-apple-style.md`
- `components-apple-style.md`
- `haptics-and-sound-apple-style.md`
- `platform-adapters-apple-style.md`
- `qa-apple-style.md`
