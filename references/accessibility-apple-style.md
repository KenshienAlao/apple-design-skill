# Apple-Style Accessibility

Accessibility is part of the system, not a pass at the end. This file defines required behavior.

## 1. Dynamic Type

On Apple platforms, support Dynamic Type from xSmall to accessibility sizes. On web, map text scaling to `rem` and `clamp()`.

Rules:

- No fixed-height text containers that clip.
- Buttons grow with text.
- Navigation titles truncate only when necessary.
- Layout reflows at 200% text.
- Test AX5 and AX7 sizes.

Web base:

```css
html {
  font-size: 100%;
}

.apple-body {
  font-size: 1.0625rem;
  line-height: 1.294;
}
```

## 2. Contrast

Targets:

- body text: 4.5:1 minimum
- large text 18pt+ or 14pt bold: 3:1 minimum
- UI components and focus rings: 3:1 against adjacent color
- disabled controls: exempt from contrast target but still legible

Rules:

- Semantic colors must pass in both light and dark.
- Never convey state by color alone.
- Increase Contrast mode removes low-alpha separators where needed.

## 3. VoiceOver and screen readers

Rules:

- Every interactive element has a name, role, and value/state.
- Decorative images are hidden.
- Meaningful images have short descriptions.
- Headings form a logical outline.
- Lists expose item count and position.
- Live regions announce async results and errors.
- Custom controls expose traits and actions.

Button naming:

```text
Good: "Save changes"
Bad: "Button"
Bad: "Click here"
```

Toggle naming:

```text
Good: "Wi-Fi, on"
Bad: "Switch"
```

## 4. Focus and keyboard

Rules:

- Focus ring visible on keyboard focus.
- Focus order follows reading order.
- No keyboard traps except intentional modal focus.
- Escape dismisses sheets, popovers, and menus when no unsaved work is at risk.
- Space activates buttons.
- Arrow keys move within segmented controls, sliders, tabs, and menus.
- Enter submits only the intended form.

Focus ring:

```css
:focus-visible {
  outline: 2px solid var(--apple-color-tint);
  outline-offset: 2px;
}
```

## 5. Touch targets

- minimum 44×44pt
- visual icon may be smaller
- spacing between targets at least 8pt
- destructive targets get more separation

## 6. Reduce Motion

Rules:

- Remove translation, scale, bounce, parallax, and autoplay motion.
- Use opacity fade ≤150ms.
- Keep progress and state feedback.
- Do not remove essential motion that communicates state; replace it with a static state change.

Web:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 150ms !important;
    scroll-behavior: auto !important;
  }
}
```

Apple platforms:

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
```

## 7. Increase Contrast

Rules:

- separators become opaque
- fills gain alpha
- focus rings strengthen
- text uses full label color
- status colors keep text labels

## 8. Bold Text

- respect Bold Text setting
- never rely on exact glyph widths
- buttons and fields expand

## 9. Color blindness

Rules:

- red/green status always has text or icon
- charts use shape + label + color
- tint is not the only affordance

## 10. Testing matrix

Test each screen with:

- VoiceOver or screen reader on
- keyboard only
- 200% text
- accessibility text size
- Reduce Motion on
- Increase Contrast on
- dark mode
- 320pt compact width
- landscape compact height

## 11. Do / Don't

Do:

- name controls properly
- expose state
- keep focus visible
- reflow text
- test with assistive tech

Don't:

- use placeholder as label
- hide focus ring
- trap focus
- rely on color alone
- animate essential content with no alternative

## 12. Cross-platform accessibility APIs

The requirement is identical everywhere: name, role, value/state. Only the vocabulary changes.

| Platform | Name | Role/trait | State | Screen reader |
|---|---|---|---|---|
| iOS SwiftUI | `.accessibilityLabel` | `.accessibilityAddTraits` | `.accessibilityValue` | VoiceOver |
| Android Compose | `contentDescription` / `Modifier.semantics` | `role` | `stateDescription` | TalkBack |
| Android XML | `android:contentDescription` | `android:importantForAccessibility` | `android:checked` | TalkBack |
| web | `aria-label` / visible text | semantic element / `role` | `aria-*` attributes | NVDA / VoiceOver / JAWS |
| Flutter | `Semantics(label:)` | `Semantics(button:)` | `Semantics(value:)` | TalkBack / VoiceOver |

Rules:

- Every interactive element exposes a name in the platform's API.
- Decorative elements are hidden from the accessibility tree (`aria-hidden`, `.accessibilityHidden`, `importantForAccessibility="no"`).
- State is exposed, not implied: selected, expanded, checked, disabled.
- Custom controls require explicit traits/roles; native controls already carry them.
- Live regions / announcements map across platforms: `aria-live`, `AccessibilityNotification.announcement`, `announceForAccessibility`.

Target sizes by platform:

- iOS 44pt, Android 48dp, web 44px, desktop pointer-appropriate with readable hit padding.

Reduce Motion maps across platforms:

- web `prefers-reduced-motion`
- iOS `accessibilityReduceMotion`
- Android `Settings.Global.ANIMATOR_DURATION_SCALE` / Compose `MotionDurationScale`
- Flutter `MediaQuery.disableAnimations`

## 13. Applied HIG accessibility refinements

Source labels name HIG topics and are routing hints, not copied text. Use the strength labels from `evidence-apple-style.md`.

- Must: give every control a meaningful label, value, and traits, and announce dynamic changes through the platform announcement or live-region API. Source: `voiceover`. Audit: controls are labeled; async results and errors are announced once.
- Should: group related elements into one accessible unit and keep reading order aligned with visual order. Source: `voiceover`. Audit: composite controls read as one item; focus order matches the layout.
- Must: give every custom gesture a standard-control or screen-reader-action alternative. Source: `voiceover`, `gestures`. Audit: drag, pinch, or swipe-only actions have a button, menu, or rotor equivalent.
- Must: reach every control by keyboard in logical order with a visible focus ring and standard keys. Source: `keyboards`. Audit: Tab reaches all controls; Enter and Space activate; arrow keys work in composite widgets; Escape dismisses transient UI.
- Must: trap focus only in a true modal and return it to the invoking control on dismiss. Source: `keyboards`, `sheets`. Audit: Tab escapes nonmodal views; modal close restores focus to the opener.
- Must: make no feature pointer-only. Source: `keyboards`, `pointing-devices`. Audit: text entry, reordering, selection, and data manipulation all have keyboard paths.
- Should: describe charts and infographics with a concise summary plus accessible values and interactions. Source: `charts`, `voiceover`. Audit: chart values and trends are available without sight; interactions use accessible elements.

## QA checklist

- All controls reachable by keyboard / switch access / TalkBack.
- Every control named via the platform API.
- Focus order matches reading order.
- 200% text does not clip.
- Screen reader reads state correctly on the target platform.
- Reduce Motion path works on the target platform.
- Contrast passes light and dark.
- Target sizes match the platform (44pt / 48dp / 44px).

## Related

- `design-apple-style.md`
- `components-apple-style.md`
- `perceived-performance-and-input-apple-style.md`
- `state-and-feedback-apple-style.md`
- `layout-apple-style.md`
- `platform-adapters-apple-style.md`
- `haptics-and-sound-apple-style.md`
- `qol-patterns-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
