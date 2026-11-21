# Perceived Performance and Input

Latency thresholds, feedback timing, focus, pointer, keyboard, and scroll-input doctrine. Load this when an interface feels slow, unresponsive, awkward, or physically wrong.

Thresholds marked as documented are platform or web-vital contracts. Values marked as house defaults are implementation guidance.

## 1. Scope

This file owns:

- response-time thresholds
- input classification and hysteresis
- scroll-as-input rules
- focus and keyboard behavior
- pointer and touch affordances
- perceived-loading techniques

This file does not own:

- state selection; use `state-and-feedback-apple-style.md`
- scroll animation; use `scroll-motion-apple-style.md`
- native component anatomy; use `components-apple-style.md`
- haptics and sound; use `haptics-and-sound-apple-style.md`

## 2. Latency thresholds

| Event | Target | Strength |
|---|---|---|
| visible response to direct input | within 100 ms | Must where achievable |
| Interaction to Next Paint | 200 ms at p75 | Must on web |
| first response before spinner | under 100 ms | Should |
| subtle cue before loading indicator | 100 ms–1 s | Should |
| spinner or skeleton | 1–10 s | Should |
| determinate progress plus cancel | over 10 s | Must for long blocking work |
| swipe classification hysteresis | about 10 pt | House default |
| double-tap window | about 500 ms | House default |

Rules:

- Acknowledge input immediately, even if the result is not ready.
- Do not show a spinner for work that completes inside the response budget.
- Do not hide a long operation behind an indeterminate loop.
- Use elapsed time to promote the feedback style.

## 3. Input doctrine

Must: track direct manipulation 1:1 while the finger, pen, or pointer is down.

Must: project velocity and OS momentum on release instead of fighting it.

Must: keep a stable commit threshold so small jitter does not flip state.

Must: keep primary actions reversible where practical.

Should: use hysteresis before classifying a drag as a swipe.

Should: expose the same action through touch, pointer, keyboard, and assistive technology.

Should: preserve scroll momentum and rubber-band behavior owned by the platform.

## 4. Scroll as input

Absolute rules:

- Never call `preventDefault()` on `wheel` or `touchmove` for ordinary scrolling.
- Never remove the native scrollbar without an equivalent affordance.
- Never remove keyboard scrolling.
- Never set page-level vertical `scroll-snap`.
- Never set `scroll-behavior: smooth` on the root element.
- Never use a full-page scroll interception library for utility UI.

Allowed:

- horizontal snap inside a gallery
- scroll-bound transforms on flagship scenes
- `touch-action` to declare the intended axis on a component
- scroll restoration after navigation
- `overscroll-behavior` to contain nested scroll regions

```css
[data-drag-x] {
  touch-action: pan-y;
}

.gallery {
  overscroll-behavior-x: contain;
}
```

## 5. Focus and keyboard

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}
```

Rules:

- Keep focus order aligned with DOM or view order.
- Never remove focus outlines without a visible replacement.
- Give custom controls the correct role, keyboard behavior, and state.
- Keep focus inside modal surfaces while they are open.
- Restore focus to the trigger when a sheet, popover, or dialog closes.
- Do not move focus on hover.
- Do not trap focus in non-modal page sections.

SwiftUI mapping:

```swift
@FocusState private var isEmailFocused: Bool

TextField("Email", text: $email)
    .focused($isEmailFocused)
    .textInputAutocapitalization(.never)
    .keyboardType(.emailAddress)
    .submitLabel(.go)

Button("Continue") { submit() }
    .keyboardShortcut(.defaultAction)
```

## 6. Pointer and touch affordances

```css
button {
  position: relative;
}

button .hit-area {
  position: absolute;
  inset: -11px;
}
```

Rules:

- Minimum target: 44×44 pt on iOS, 48×48 dp on Android, 44×44 px on web.
- Desktop pointer targets must remain comfortably clickable even when visually compact.
- visionOS targets should target 60×60 pt.
- Use invisible hit padding instead of enlarging the visible control.
- Gate hover effects with `@media (hover: hover) and (pointer: fine)`.
- Do not rely on hover to reveal essential actions on touch.
- Do not move a control away from the pointer on hover.
- Keep pressed feedback immediate.

```css
@media (hover: hover) and (pointer: fine) {
  .magnetic {
    transition: transform 160ms ease-out;
  }
}
```

```swift
Button(action: open) {
  Label("Open", systemImage: "arrow.up.right")
}
.contentShape(Rectangle())
.hoverEffect(.lift)
```

## 7. Form input

```html
<input
  id="email"
  type="email"
  inputmode="email"
  autocomplete="email"
  enterkeyhint="go"
>
```

Rules:

- Match keyboard type to the data type.
- Use autocomplete tokens for known fields.
- Use `enterkeyhint` for the expected submit action.
- Keep labels visible.
- Do not clear user input after validation failure.
- Do not validate presence on every keystroke.
- Keep error text specific and adjacent to the field.

## 8. Perceived-loading techniques

Speculation hints:

```html
<script type="speculationrules">
{
  "prefetch": [{ "source": "document", "urls": ["/next"] }]
}
</script>
```

Render containment:

```css
.offscreen-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

Priority:

```html
<img
  src="/media/hero.webp"
  width="1920"
  height="1080"
  fetchpriority="high"
  alt="Generated hero still"
>
```

Rules:

- Prefetch only likely next destinations.
- Use `content-visibility` with an intrinsic size to avoid scroll jumps.
- Defer analytics, tagging, and image decoding until after first paint where possible.
- Use optimistic updates only for low-risk, reversible, idempotent actions.
- Roll back visibly and preserve the user's input when reconciliation fails.
- Make skeletons match the final layout shape.

## 9. Failure table

| Symptom | Cause | Fix |
|---|---|---|
| Tap feels ignored | delayed feedback | acknowledge within 100 ms |
| Page feels stuck | long indeterminate spinner | determinate progress and cancel |
| Scroll feels stolen | wheel interception | native scroll, passive listeners |
| Button hard to hit | visual size equals hit size | invisible hit padding |
| Focus disappears | outline removed | `:focus-visible` replacement |
| Keyboard trap in sheet | missing focus management | trap, restore on close |
| Jank during scroll | main-thread work | passive listener, rAF batching |
| Layout jumps on load | missing dimensions | explicit media size |

## 10. Review checks

- Is there visible feedback within the response budget?
- Is the feedback style correct for elapsed time?
- Is native scrolling untouched?
- Are targets large enough on every platform?
- Is focus visible and correctly ordered?
- Are input hints and autocomplete present?
- Are optimistic contracts reversible?
- Are expensive tasks deferred after paint?

## Related

- `state-and-feedback-apple-style.md`
- `qol-patterns-apple-style.md`
- `haptics-and-sound-apple-style.md`
- `scroll-motion-apple-style.md`
- `accessibility-apple-style.md`
- `components-apple-style.md`
