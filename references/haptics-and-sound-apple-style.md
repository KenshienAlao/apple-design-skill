# Apple-Style Haptics and Sound

Feel layer for Apple-inspired interfaces. Load this when building interaction feedback, notifications, toggles, confirmations, or web fallbacks.

## 1. Doctrine

- Feedback confirms a state change. It does not decorate one.
- Fire once at commit, not on every animation frame.
- Haptics lead. Sound is optional.
- Silence is valid for passive or low-stakes changes.
- The same feedback must make sense with Reduce Motion on.

## 2. Feedback families

| Family | Feel | Use |
|---|---|---|
| selection | tiny tick | picker, segmented control, carousel page commit |
| impact-soft | soft tap | drag release, reorder settle |
| impact-medium | firm tap | toggle commit, sheet dismiss commit |
| impact-rigid | sharp tap | destructive confirm, hard stop at edge |
| notification-success | rising pattern | save complete, export complete |
| notification-warning | two pulses | unsaved changes, near-limit state |
| notification-error | sharp triple | failed action |
| edge | one soft tick | first overscroll at carousel edge |

## 3. Timing rules

- Fire at the moment the outcome becomes certain.
- Cooldown: 80–120ms between haptics.
- Cap at one haptic per gesture plus one completion haptic.
- Do not fire on hover, focus, scroll frames, or every drag frame.
- If a gesture is cancelled, fire no commit haptic.
- If motion is interrupted, suppress the old completion haptic.

## 4. Interaction map

| Interaction | Feedback |
|---|---|
| toggle commit | impact-medium |
| segmented selection | selection |
| carousel page commit | selection |
| carousel edge crossing | edge, once |
| sheet dismiss commit | impact-soft |
| list reorder settle | impact-soft |
| delete confirmation accepted | impact-rigid |
| save complete | notification-success |
| validation failure | notification-error |
| low storage warning | notification-warning |
| pull-to-refresh threshold | selection |

## 5. SwiftUI and UIKit

```swift
import UIKit

enum AppleHaptic {
    static let selection = UISelectionFeedbackGenerator()
    static let soft = UIImpactFeedbackGenerator(style: .soft)
    static let medium = UIImpactFeedbackGenerator(style: .medium)
    static let rigid = UIImpactFeedbackGenerator(style: .rigid)
    static let notification = UINotificationFeedbackGenerator()

    static func selectionTick() {
        selection.selectionChanged()
    }

    static func commit(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .medium) {
        switch style {
        case .soft: soft.impactOccurred()
        case .medium: medium.impactOccurred()
        case .rigid: rigid.impactOccurred()
        default: medium.impactOccurred()
        }
    }

    static func notify(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        notification.notificationOccurred(type)
    }
}
```

Rules:

- Prepare generators before the gesture when possible.
- Reuse generators; do not allocate one per frame.
- On simulator, expect no haptic output.
- Respect accessibility settings that reduce or alter feedback.

## 6. Web fallback

Web haptics are inconsistent. Treat them as optional.

```js
function tick(pattern = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
```

Rules:

- Use vibration only on user-initiated commit.
- Do not autoplay audio.
- Do not add custom sound unless the product already has a sound system.
- Keep sound short: under 200ms for confirmations.
- Never use sound as the only signal.

## 7. Sound

Default behavior:

- system sound for system-like actions only
- no sound for passive navigation
- no looping sound for success
- no sound that competes with VoiceOver
- volume follows system volume

Use custom sound only when:

- the product has a defined sound identity
- the sound is optional
- the sound can be muted
- the same state is visible

## 8. Anti-patterns

- haptic on every drag frame
- notification haptic for routine selection
- error sound for validation typo
- sound without visual state
- haptic on hover
- multiple haptics fired in one commit
- haptic after cancelled gesture

## 9. QA checklist

- Feedback fires once per commit.
- No feedback during passive scroll.
- Cancelled gestures produce no haptic.
- Web fallback degrades silently.
- VoiceOver is not interrupted.
- Sound has visible equivalent.
- Cooldown enforced.

## Related

- `animations-apple-style.md`
- `components-apple-style.md`
- `accessibility-apple-style.md`
- `qa-apple-style.md`
