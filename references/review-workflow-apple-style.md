# Apple-Style Review Workflow

A five-lens review used before any UI work ships. Load this for design review, audit, or critique. It coordinates the other references; it does not replace them.

## 1. When to use

- reviewing an existing screen, component, or full product
- auditing generated UI before delivery
- comparing two candidate implementations
- doing a craft pass after the build is functionally complete

Run the lenses in order. A failure in an earlier lens is not excused by strength in a later one.

## 2. The five lenses

### Lens 1 — Craft

Question: does this look like a disciplined system or a template?

- No centered hero stacked over three identical cards.
- No purple gradient, no all-caps mono eyebrow, no decorative 01/02/03.
- One accent, one type family, radius from the scale.
- A signature element exists and is content-specific, not decorative.
- Spacing carries hierarchy before borders or shadows.
- See `design-apple-style.md` and `anti-patterns-apple-style.md`.

### Lens 2 — Interaction and motion

Question: does every gesture and transition follow input and resolve on release?

- Direct manipulation tracks 1:1 during drag.
- Commit uses velocity and offset, never a mid-drag snap.
- Springs use the documented defaults; bounce stays within range.
- Motion is interruptible and reducible.
- Feedback fires at commit, not per frame.
- See `animations-apple-style.md` and `haptics-and-sound-apple-style.md`.

### Lens 3 — Accessibility

Question: can every person reach and understand every function?

- Every control has a name, role, and state.
- Keyboard path exists; focus order matches reading order.
- Contrast passes in light and dark; no color-only state.
- Dynamic type reflows at 200%; Reduce Motion path exists.
- See `accessibility-apple-style.md`.

### Lens 4 — Platform fidelity

Question: does this feel native on the target platform?

- Navigation chrome matches the host platform.
- Input method (touch, pointer, keyboard, gaze) is respected.
- Target sizes and density are native, not copied.
- A browser back, system back, or window close is handled.
- See `platform-adapters-apple-style.md`.

### Lens 5 — Code quality

Question: is the implementation clean, complete, and token-driven?

- No raw hex, radius, duration, or font in components.
- No stubs, dead controls, or fake content.
- Bounded loops and fail-closed reads on untrusted input.
- Ordered teardown of listeners, timers, and workers.
- Run `scripts/code-audit.mjs`, `scripts/audit.mjs`, and `scripts/token-lint.mjs`.

## 3. Severity rubric

| Severity | Meaning | Example |
|---|---|---|
| Blocker | ships nothing until fixed | keyboard trap, contrast failure, state loss |
| High | violates a platform or system rule | iOS tab bar on Android, broken undo |
| Medium | degrades craft or clarity | random radii, over-animation, cute copy |
| Low | cleanup, non-blocking | one stray raw value with a token available |
| Info | suggestion, no action required | optional signature-element idea |

Blocking categories: accessibility, contrast, focus restoration, state loss, platform navigation mismatch, carousel end behavior, destructive confirmation.

## 4. Review procedure

1. Identify platform and framework. Name them in one line.
2. Load the five lens references plus the docs for the surface under review.
3. Walk each lens; record findings as `path:line — severity — lens — message`.
4. For HIG-related findings, name the HIG topic and owning house file; label strength Must/Should/May per `evidence-apple-style.md`.
5. Run static scripts when source is available.
6. Assign a verdict.

## 5. Report format

```text
Verdict: Pass | Conditional | Fail
Platform: ios | android | web | desktop
Framework: SwiftUI | Compose | React | Flutter | other

Blocking:
- src/Form.jsx:42 — Blocker — Accessibility — input has no label

High:
- src/Shell.jsx:18 — High — Platform — bottom tab bar on macOS

Medium:
- src/Card.css:9 — Medium — Craft — radius 18px not from scale

Non-blocking / Info:
- src/Theme.css:3 — Low — Code — raw hex, token exists

Applied lenses:
- craft, interaction, accessibility, platform, code
```

## 6. Verdict rules

- **Pass:** no Blocker or High findings.
- **Conditional:** only Medium/Low findings, each named in notes.
- **Fail:** any Blocker or High finding.

A platform mismatch is at least High. An accessibility or contrast failure is always Blocker.

## 7. Do / Don't

Do:

- review in lens order
- cite `path:line` for code findings
- name the platform before judging fidelity

Don't:

- let visual polish excuse a keyboard failure
- call a platform mismatch a preference
- downgrade a contrast failure to Medium

## Related

- `qa-apple-style.md`
- `restraint-and-antislop-apple-style.md`
- `evidence-apple-style.md`
- `heritage-apple-style.md`
- `scripts/code-audit.mjs`
