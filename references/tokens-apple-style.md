# Apple-Style Tokens

Source of truth for named values. Components consume tokens. Raw values live only here.

## 1. Naming

Format:

```text
--apple-<category>-<role>-<variant>
```

Examples:

```text
--apple-color-bg
--apple-color-label-2
--apple-space-5
--apple-radius-medium
--apple-duration-standard
```

## 2. Color tokens

### CSS

```css
:root {
  --apple-color-bg: #FFFFFF;
  --apple-color-surface: #F2F2F7;
  --apple-color-surface-2: #FFFFFF;
  --apple-color-label: #000000;
  --apple-color-label-2: rgba(60, 60, 67, 0.60);
  --apple-color-label-3: rgba(60, 60, 67, 0.30);
  --apple-color-separator: rgba(60, 60, 67, 0.29);
  --apple-color-fill: rgba(120, 120, 128, 0.12);
  --apple-color-fill-2: rgba(120, 120, 128, 0.20);
  --apple-color-tint: #007AFF;
  --apple-color-tint-contrast: #FFFFFF;
  --apple-color-green: #34C759;
  --apple-color-orange: #FF9500;
  --apple-color-red: #FF3B30;
}

@media (prefers-color-scheme: dark) {
  :root {
    --apple-color-bg: #000000;
    --apple-color-surface: #1C1C1E;
    --apple-color-surface-2: #2C2C2E;
    --apple-color-label: #FFFFFF;
    --apple-color-label-2: rgba(235, 235, 245, 0.60);
    --apple-color-label-3: rgba(235, 235, 245, 0.30);
    --apple-color-separator: rgba(84, 84, 88, 0.65);
    --apple-color-fill: rgba(120, 120, 128, 0.36);
    --apple-color-fill-2: rgba(120, 120, 128, 0.58);
    --apple-color-tint: #0A84FF;
    --apple-color-tint-contrast: #FFFFFF;
    --apple-color-green: #30D158;
    --apple-color-orange: #FF9F0A;
    --apple-color-red: #FF453A;
  }
}
```

### SwiftUI mapping

```swift
Color.primary              // label
Color.secondary            // label-2
Color(uiColor: .systemBackground)
Color(uiColor: .secondarySystemBackground)
Color(uiColor: .separator)
Color(uiColor: .systemFill)
Color.accentColor          // tint
```

## 3. Typography tokens

```css
:root {
  --apple-font-text: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --apple-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  --apple-type-large-title-size: 34px;
  --apple-type-large-title-line: 41px;
  --apple-type-large-title-weight: 400;

  --apple-type-title-1-size: 28px;
  --apple-type-title-1-line: 34px;
  --apple-type-title-1-weight: 400;

  --apple-type-title-2-size: 22px;
  --apple-type-title-2-line: 28px;
  --apple-type-title-2-weight: 400;

  --apple-type-title-3-size: 20px;
  --apple-type-title-3-line: 25px;
  --apple-type-title-3-weight: 400;

  --apple-type-headline-size: 17px;
  --apple-type-headline-line: 22px;
  --apple-type-headline-weight: 600;

  --apple-type-body-size: 17px;
  --apple-type-body-line: 22px;
  --apple-type-body-weight: 400;

  --apple-type-callout-size: 16px;
  --apple-type-callout-line: 21px;

  --apple-type-subheadline-size: 15px;
  --apple-type-subheadline-line: 20px;

  --apple-type-footnote-size: 13px;
  --apple-type-footnote-line: 18px;

  --apple-type-caption-1-size: 12px;
  --apple-type-caption-1-line: 16px;

  --apple-type-caption-2-size: 11px;
  --apple-type-caption-2-line: 13px;
}
```

## 4. Spacing tokens

```css
:root {
  --apple-space-1: 2px;
  --apple-space-2: 4px;
  --apple-space-3: 8px;
  --apple-space-4: 12px;
  --apple-space-5: 16px;
  --apple-space-6: 20px;
  --apple-space-7: 24px;
  --apple-space-8: 32px;
  --apple-space-9: 40px;
  --apple-space-10: 48px;
  --apple-space-11: 64px;
}
```

## 5. Radius tokens

```css
:root {
  --apple-radius-control: 8px;
  --apple-radius-small: 10px;
  --apple-radius-medium: 14px;
  --apple-radius-large: 20px;
  --apple-radius-sheet: 28px;
  --apple-radius-pill: 999px;
}
```

## 6. Motion tokens

```css
:root {
  --apple-duration-instant: 80ms;
  --apple-duration-fast: 120ms;
  --apple-duration-control: 250ms;
  --apple-duration-standard: 350ms;
  --apple-duration-sheet: 500ms;

  --apple-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --apple-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --apple-ease-in: cubic-bezier(0.4, 0, 1, 1);

  --apple-spring-standard-duration: 350ms;
  --apple-spring-standard-bounce: 0.15;
  --apple-spring-sheet-duration: 500ms;
  --apple-spring-sheet-bounce: 0.08;
}
```

## 7. Elevation tokens

```css
:root {
  --apple-shadow-none: none;
  --apple-shadow-small: 0 1px 3px rgba(0, 0, 0, 0.08);
  --apple-shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.12);
  --apple-shadow-large: 0 20px 60px rgba(0, 0, 0, 0.18);
  --apple-hairline: 1px solid var(--apple-color-separator);
}
```

## 8. Size tokens

```css
:root {
  --apple-target-min: 44px;
  --apple-icon-16: 16px;
  --apple-icon-20: 20px;
  --apple-icon-24: 24px;
  --apple-icon-28: 28px;
  --apple-read-max: 720px;
  --apple-content-max: 1024px;
}
```

## 9. Layer tokens

```css
:root {
  --apple-z-base: 0;
  --apple-z-content: 10;
  --apple-z-sticky: 100;
  --apple-z-overlay: 1000;
  --apple-z-modal: 1100;
  --apple-z-toast: 1200;
}
```

## 10. Usage rules

- Components import tokens. Tokens do not import component context.
- Raw hex in component code is a defect.
- Raw radius in component code is a defect.
- New values require a named token and a reason.
- Dark Mode changes token values, not component structure.
- Motion tokens point to `animations-apple-style.md` for behavior.

## 11. Cross-platform semantic aliases

The house roles above are the source of truth. Each platform maps them to its native theme vocabulary. Use the native role name in platform code; keep raw values only in this file.

| House role | Material 3 | iOS / SwiftUI | Web CSS var |
|---|---|---|---|
| tint | primary | accentColor | `--apple-color-tint` |
| tint-contrast | onPrimary | tint contrast | `--apple-color-tint-contrast` |
| bg | background | systemBackground | `--apple-color-bg` |
| surface | surface | secondarySystemBackground | `--apple-color-surface` |
| label | onSurface | primary | `--apple-color-label` |
| label-2 | onSurfaceVariant | secondary | `--apple-color-label-2` |
| separator | outlineVariant | separator | `--apple-color-separator` |
| fill | surfaceVariant | systemFill | `--apple-color-fill` |
| red | error | systemRed | `--apple-color-red` |
| green | (custom) | systemGreen | `--apple-color-green` |

### Compose / Kotlin (`Theme.kt`)

```kotlin
object AppTokens {
    val Primary = androidx.compose.ui.graphics.Color(0xFF007AFF)
    val OnPrimary = androidx.compose.ui.graphics.Color(0xFFFFFFFF)
    val Background = androidx.compose.ui.graphics.Color(0xFFFFFFFF)
    val Surface = androidx.compose.ui.graphics.Color(0xFFF2F2F7)
    val OnSurface = androidx.compose.ui.graphics.Color(0xFF000000)
    val Error = androidx.compose.ui.graphics.Color(0xFFFF3B30)
}
```

### Android XML (`colors.xml`)

```xml
<resources>
    <color name="apple_tint">#007AFF</color>
    <color name="apple_tint_contrast">#FFFFFF</color>
    <color name="apple_bg">#FFFFFF</color>
    <color name="apple_surface">#F2F2F7</color>
    <color name="apple_label">#000000</color>
    <color name="apple_red">#FF3B30</color>
</resources>
```

### SwiftUI

```swift
extension Color {
    static let appleTint = Color(uiColor: .systemBlue)
    static let appleBackground = Color(uiColor: .systemBackground)
    static let appleLabel = Color.primary
}
```

Rules:

- The generated `Theme.kt` and `colors.xml` come from `scripts/generate-tokens.mjs`; do not hand-maintain them.
- Platform roles may reuse system colors where they match; keep the house value when the system role differs.
- Dark mode is a second value set, never an inverted filter.
- Semantic aliases never introduce a second raw value in this file.

## Related

- `design-apple-style.md`
- `animations-apple-style.md`
- `components-apple-style.md`
- `platform-adapters-apple-style.md`
- `qa-apple-style.md`
