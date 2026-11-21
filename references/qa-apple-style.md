# Apple-Style QA

Use this file before shipping any Apple-inspired UI work. A failed item blocks the build.

## 1. Visual

- [ ] Type uses defined roles only.
- [ ] No more than three font weights on screen.
- [ ] Dynamic Type reaches 200% without clipping.
- [ ] Spacing aligns to 4/8 grid.
- [ ] Radius values come from tokens.
- [ ] Semantic colors used in light and dark.
- [ ] One accent tint per screen.
- [ ] Materials preserve contrast and Liquid Glass stays in functional layer only.
- [ ] No heavy decorative shadows.
- [ ] No gradient background by default.
- [ ] Essential body text meets 4.5:1.
- [ ] Secondary text meets 3:1.
- [ ] Tertiary metadata below 3:1 is non-essential and paired with full label text.
- [ ] Branding defers to content; no decorative logos or splash-as-branding.

## 2. Layout

- [ ] Safe areas respected.
- [ ] Reading width capped.
- [ ] Compact, regular, wide layouts checked.
- [ ] No nested vertical scrollers without reason.
- [ ] Back navigation restores scroll.
- [ ] No horizontal overflow.
- [ ] Sheet adapts by size class.
- [ ] Forms group related fields.

## 3. Components

- [ ] Standard controls used first.
- [ ] Every control has all states.
- [ ] Touch targets are 44pt.
- [ ] Icon buttons have accessible names.
- [ ] Loading preserves layout.
- [ ] Errors include recovery.
- [ ] Empty states include action.
- [ ] Destructive actions separated.

## 4. Motion

- [ ] Motion posture declared (subtle/standard/flagship) and matches surface purpose.
- [ ] Direct manipulation tracks input 1:1; no spring while captured.
- [ ] Commit uses velocity projection and is interruptible/cancelable.
- [ ] Springs/curves are documented defaults or justified exceptions.
- [ ] Bounce never exceeds 0.25 unless intentionally playful and documented.
- [ ] Carousel snaps only after release; edge uses bounded rubber band; no phantom page.
- [ ] Durations are purposeful; no render-on-mount animation spam; no layout-property jank.
- [ ] Haptics fire once at commit, never per frame.
- [ ] Reduce Motion path preserves meaning (crossfade/instant final state).

## 5. Haptics and feedback

- [ ] Feedback fires at commit, not during drag frames.
- [ ] Cancelled gestures produce no haptic.
- [ ] Haptic cooldown is 80–120ms or more.
- [ ] Sound has a visible equivalent.
- [ ] Sound can be muted.
- [ ] Web vibration degrades silently.
- [ ] VoiceOver is not interrupted.

## 6. Quality of life

- [ ] Autosave states are visible where autosave exists.
- [ ] Undo covers primary edits.
- [ ] Focus returns after modal dismissal.
- [ ] Scroll position restored on back.
- [ ] Keyboard shortcuts do not fire while typing.
- [ ] Drag and drop has a keyboard alternative.
- [ ] Deep link invalid state is useful.
- [ ] Offline state visible where relevant.
- [ ] Recovery names restored content.
- [ ] Permissions are requested in context with clear purpose strings; denial/revocation handled.
- [ ] Account/sign-in flows avoid premature walls; passkeys/system auth preferred where appropriate.
- [ ] Sharing/collaboration/printing/export/file actions are explicit, scoped, and recoverable.
- [ ] Sharing/collaboration scope is clear; printing/export/file actions are explicit and recoverable.

## 7. Platform and desktop

- [ ] Target platform named (iOS / Android / web / desktop).
- [ ] Input method mapped to platform.
- [ ] Navigation model native to platform.
- [ ] Chrome respects platform.
- [ ] Target sizes native: 44pt iOS / 48dp Android / 44px web / pointer desktop.
- [ ] System or browser back handled.
- [ ] Keyboard path exists where relevant.
- [ ] Haptics only where supported.
- [ ] Motion amplitude adapted.
- [ ] macOS window frame and state restored.
- [ ] macOS toolbar holds view actions, menu bar holds global actions.
- [ ] macOS sheets attach to the window.
- [ ] Traffic lights unobstructed.
- [ ] Widgets/Live Activities/complications are glanceable, timely, deep-linked, and privacy-aware.
- [ ] System integrations (Pay/Sign in/Share/Health/Game Center/CarPlay/Siri/iCloud/AI) use standard patterns and user control.

## 8. Accessibility

- [ ] All controls reachable by keyboard.
- [ ] Focus ring visible.
- [ ] Focus order matches reading order.
- [ ] Screen reader names and states correct.
- [ ] Contrast passes in light and dark.
- [ ] No color-only state.
- [ ] VoiceOver or screen reader tested.
- [ ] Increase Contrast checked.
- [ ] Reduce Motion / Reduce Transparency / Bold Text / Dynamic Type behaviors verified.
- [ ] Gestures have non-gesture alternatives; platform input alternatives covered.

## 9. Content

- [ ] Buttons use verbs.
- [ ] Errors name problem and recovery.
- [ ] No "Something went wrong" alone.
- [ ] No cute microcopy.
- [ ] Capitalization follows content doc.
- [ ] Strings are localization-safe.
- [ ] No lorem ipsum or TODO labels.
- [ ] Copy is inclusive, plain, and respectful; no gendered/stereotyping idioms.
- [ ] Sensitive data not exposed in notifications/previews/logs by default.

## 10. Code hygiene

- [ ] No raw hex in components.
- [ ] No raw radius in components.
- [ ] No hardcoded duration in components.
- [ ] Tokens imported.
- [ ] No stubs.
- [ ] No dead controls.
- [ ] Strict warnings pass where applicable.
- [ ] `audit.mjs` clean.
- [ ] `token-lint.mjs` clean where source files are available.
- [ ] `check-contrast.mjs` clean.
- [ ] `a11y-audit.mjs` clean where source files are available.
- [ ] `code-audit.mjs` clean where source files are available.
- [ ] `link-check.mjs` clean (relative links resolve).

## 10a. Flagship web and media checks

Automatable checks now live in `code-audit.mjs`. Review these manually when source files are unavailable.

- [ ] No `preventDefault()` on `wheel` or `touchmove` for ordinary scrolling.
- [ ] No `scroll-behavior: smooth` on the root element.
- [ ] No page-level vertical `scroll-snap`.
- [ ] Tall theme sections use a center-line observer, not `threshold: 0.5`.
- [ ] Sticky children have no ancestor with `overflow: hidden|clip|auto|scroll`.
- [ ] Scroll-bound scenes have a reduced-motion branch.
- [ ] Hero or LCP media is not `loading="lazy"`.
- [ ] Images and video posters have `width` and `height`.
- [ ] Worker image decode uses `createImageBitmap(blob)`, not an image element.
- [ ] Decoded bitmaps are closed when removed from the window.
- [ ] `will-change` is scoped to active layers, not applied globally.
- [ ] No Apple-owned logos, bezels, screenshots, photography, or captured frames ship with the build.

## 11. Scoring

- **Pass:** all blocking items pass.
- **Conditional:** one non-blocking token cleanup remains, named in notes.
- **Fail:** any accessibility, motion, state, contrast, or recovery item fails.

Blocking categories: accessibility, layout overflow, component states, carousel end behavior, contrast, Reduce Motion, focus restoration, destructive confirmation, state loss.

## 12. Output format

When auditing, report:

```text
Verdict: Pass | Conditional | Fail

Blocking:
- item

Non-blocking:
- item

Applied rules:
- design-apple-style.md
- animations-apple-style.md
- tokens-apple-style.md
- components-apple-style.md
- layout-apple-style.md
- accessibility-apple-style.md
- content-apple-style.md
- haptics-and-sound-apple-style.md
- qol-patterns-apple-style.md
- platform-adapters-apple-style.md
- macos-windowing-apple-style.md
- anti-patterns-apple-style.md
- restraint-and-antislop-apple-style.md
- scroll-motion-apple-style.md
- scrollytelling-apple-style.md
- media-assets-and-delivery-apple-style.md
- perceived-performance-and-input-apple-style.md
- state-and-feedback-apple-style.md
- navigation-models-apple-style.md
- web-engineering-apple-style.md
- web-marketing-language-apple-style.md
- review-workflow-apple-style.md
```

For a full design review, run the five-lens workflow in `review-workflow-apple-style.md` and use its `path:line — severity — lens — message` finding format and its Pass/Conditional/Fail verdict rules. Use `evidence-apple-style.md` to label each rule Must/Should/May.

## Related

- all `references/*.md`
- `scripts/audit.mjs`
- `scripts/token-lint.mjs`
- `scripts/check-contrast.mjs`
- `scripts/a11y-audit.mjs`
- `scripts/code-audit.mjs`
- `scripts/link-check.mjs`
- `scripts/visual-diff.mjs`
- `scripts/a11y-probe.mjs`
- `examples/good-apple-style.md`
- `examples/bad-clone-patterns.md`
- `examples/reference-implementations/`
