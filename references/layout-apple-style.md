# Apple-Style Layout

Layout rules for Apple-inspired interfaces across compact, regular, and web layouts. Uses `tokens-apple-style.md`.

## 1. Layout model

- Start with safe content area.
- Apply margins.
- Place content in groups.
- Use spacing for hierarchy.
- Let chrome recede.

Order of decisions:

1. viewport and safe area
2. navigation model
3. content column
4. grouping
5. density
6. scroll behavior

## 2. Safe areas

Rules:

- Never place critical content under notches, status bars, home indicators, or browser chrome.
- Respect `safe-area-inset-*` on web.
- Respect `safeAreaInsets` in SwiftUI.
- Backgrounds can extend into safe area; text and controls cannot.

CSS:

```css
padding-top: max(var(--apple-space-5), env(safe-area-inset-top));
padding-bottom: max(var(--apple-space-5), env(safe-area-inset-bottom));
padding-left: max(var(--apple-space-5), env(safe-area-inset-left));
padding-right: max(var(--apple-space-5), env(safe-area-inset-right));
```

## 3. Content widths

| Context | Width |
|---|---:|
| Reading column | 60–75 characters, max 720px |
| Standard content | max 1024px |
| Wide dashboard | max 1440px, then split into columns |
| Sheet content | max 640px |
| Popover | 320–480px |

Rules:

- Long text does not stretch full width on large displays.
- Tables may exceed reading width.
- Center content only when the page is document-like.

## 4. Size classes

### Compact

- margin 16pt.
- single column.
- nav bar inline title.
- tab bar at bottom.
- toolbar collapses to icons.
- sheets cover full width.

### Regular

- margin 20–24pt.
- two-column possible.
- large title available.
- sidebar or split view.
- sheet becomes centered panel or detached sheet.

### Wide

- margin 32pt.
- max content width enforced.
- sidebar 240–320pt.
- detail pane takes remaining space.
- avoid full-bleed forms.

## 5. Grid

- 8pt base grid.
- 4pt sub-grid.
- 12-column web grid for broad layout only.
- Do not force every element into 12 columns; use it for major regions.

Gutters:

- compact: 8–12pt.
- regular: 16pt.
- wide: 20–24pt.

## 6. Navigation hierarchy

Patterns:

| Pattern | Use |
|---|---|
| Tab bar | top-level sibling sections |
| Navigation stack | drill-down flow |
| Sheet | focused modal task |
| Split view | master-detail on regular width |
| Modal full screen | task requiring full attention |

Rules:

- One navigation model per screen.
- No nested tab bars.
- No modal stacked on modal without a clear reason.
- Back destination must be obvious.
- Deep links restore hierarchy.

## 7. Large titles

Use large titles when:

- screen is top-level
- content is scrollable
- hierarchy benefits from a strong anchor

Collapse rules:

- Large title collapses to inline title on scroll.
- Collapse is continuous and tied to scroll offset.
- Toolbar actions remain reachable.
- Do not use large title in a sheet with a short form.

## 8. Scroll behavior

- Scroll edge effects under nav and toolbars.
- Sticky headers only for tables or long lists.
- Avoid nested vertical scroll containers.
- Horizontal carousel may live inside vertical scroll when gesture arbitration exists.
- Preserve scroll position on back navigation.

## 9. Split views

Rules:

- Primary column has stable width.
- Detail column never becomes too narrow.
- On compact width, collapse to navigation stack.
- Selection state is visible.
- Placeholder detail explains the selection.

## 10. Forms

- Label above field for long forms.
- Leading label for dense settings rows.
- Group related fields with surface background and hairlines.
- Section header uses Footnote or Subheadline with label-2.
- Submit action sits at content end, not floating unless necessary.

## 11. Density

| Density | Row height | Use |
|---|---:|---|
| Comfortable | 56–64pt | default lists |
| Standard | 44pt | tables, settings |
| Compact | 36–40pt | dense data, web only |

Rules:

- Compact density never shrinks touch targets below 44pt.
- Give destructive actions more separation.
- Increase whitespace, not chrome, when a screen feels busy.

## 12. Responsive web breakpoints

```css
/* implementation defaults */
@media (max-width: 767px)  { /* compact */ }
@media (min-width: 768px)  { /* regular */ }
@media (min-width: 1024px) { /* wide */ }
@media (min-width: 1440px) { /* extra wide */ }
```

## 13. Do / Don't

Do:

- respect safe areas
- cap reading width
- use one navigation model
- collapse layout with intent
- preserve scroll position

Don't:

- stretch text across ultrawide screens
- nest vertical scrollers
- hide navigation behind gestures only
- use centered max-width cards for every page
- let chrome compete with content

## QA checklist

- Safe area on notched device.
- 200% text size.
- Landscape compact height.
- Regular-width split view.
- Back navigation restores scroll.
- No horizontal overflow.
- Sheet adapts from full screen to panel.
- Reading column capped.

## 14. Universal layout notes

The model (safe content area → margins → groups → spacing hierarchy) is platform-neutral. Only the chrome and insets change.

| Platform | Safe area / inset | Navigation region | Breakpoint driver |
|---|---|---|---|
| iOS | `safeAreaInsets` | nav stack / tab bar | size classes |
| Android | system bars + cutouts `WindowInsets` | app bar / nav rail / bottom nav | window size classes (compact/medium/expanded) |
| web | `env(safe-area-inset-*)` | URL + app shell | CSS media queries |
| desktop | window frame + title bar | sidebar + toolbar | window width |

Rules:

- Android window size classes: compact (<600dp), medium (600–840dp), expanded (>840dp). Collapse multi-pane at compact.
- On desktop, the window is the layout unit; never stretch a phone column across a wide window.
- Preserve scroll, selection, and focus on back/reopen on every platform.
- Reading column caps (60–75ch / 720px) hold everywhere.
- Bottom sheets become window dialogs on desktop; full-screen sheets on phones.

## Related

- `design-apple-style.md`
- `components-apple-style.md`
- `navigation-models-apple-style.md`
- `accessibility-apple-style.md`
- `platform-adapters-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
