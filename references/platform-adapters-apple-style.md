# Universal Platform Adapters

One disciplined craft system translated into each platform's native idioms. Load this whenever the target is Android, iOS, web, desktop, or a cross-platform framework.

Apple is the craft lens; the host platform is the execution target. The stack never changes the principle, only the vocabulary and chrome.

## 1. Transfer rules

Transfer unchanged:

- semantic roles (background, surface, label, tint, status)
- type roles and hierarchy relationships
- spacing scale and grid logic
- content rules and voice
- state names: default, hover, pressed, focused, disabled, loading, error
- accessibility requirements

Adapt:

- navigation chrome and input method
- density and target size
- materials and elevation model
- motion amplitude and curve vocabulary
- window / lifecycle behavior

Never transfer unchanged:

- mouse hover to touch
- touch gestures to keyboard-only contexts
- full-screen sheets to desktop windows
- phone margins to large canvases
- Material navigation to iOS or vice versa

## 2. Universal platform table

| Platform | Input | Nav pattern | Chrome | Target | Density | Motion |
|---|---|---|---|---|---|---|
| iOS | touch | nav stack, tab bar | nav/toolbar | 44pt | comfortable | spring primary |
| Android | touch | nav rail / bottom nav / back | top app bar | 48dp | comfortable | spring + Material easing |
| web | pointer + keyboard + touch | URL + app nav | browser chrome | 44px | fluid | mixed |
| macOS | pointer + keyboard | window, sidebar, menu bar | toolbar/titlebar | 28–32pt | compact | curves dominant |
| Windows | pointer + keyboard | window, nav view, command bar | title bar | 32px | compact | curves dominant |
| Linux | pointer + keyboard | window, sidebar, header bar | headerbar | 32px | compact | curves dominant |
| iPadOS | touch + keyboard + pointer | split view, sidebar | toolbar | 44pt | regular | spring + subtle |
| watchOS | touch + crown | stack | minimal | large relative | very compact | quick, low amplitude |
| visionOS | gaze + pinch | windows + volumes | spatial chrome | large | spacious | calm, depth-aware |

## 3. iOS / iPadOS

- 44pt minimum targets; safe areas mandatory.
- tab bar for top-level sections; nav stack for drill-down.
- sheets for focused tasks; haptics at commit.
- system back and large-title collapse tied to scroll.
- Reduce Motion uses fades; VoiceOver traits exposed.

## 4. Android / Material 3

- 48dp minimum targets; 8dp grid.
- bottom navigation for 3–5 top-level destinations, nav rail for tablets, navigation drawer for deep hierarchies.
- top app bar for actions and title; system back handled explicitly.
- Material roles map to semantic tokens: primary ≈ tint, on-primary ≈ tint-contrast, surface ≈ surface, on-surface ≈ label.
- snackbar for brief confirmations with optional action.
- FAB for the single promoted action; extended FAB on large screens.
- ripple/pressed state from the material; elevation from tonal surfaces, not heavy shadows.
- respect `prefers-reduced-motion` equivalent and Android motion settings.

## 5. Web

- browser back/forward is part of navigation; URLs are state.
- focus ring mandatory; semantic HTML before ARIA.
- safe areas via `env(safe-area-inset-*)`; solid fallback for materials.
- 44px targets; keyboard and screen reader paths required.
- `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast` honored.

## 6. Desktop (macOS / Windows / Linux)

- window is the unit; keyboard and pointer first.
- sidebar owns navigation; toolbar/command bar owns view actions; menu bar or app menu owns global commands.
- hover and focus are real states; selection is explicit.
- sheets/dialogs attach to the window, not full-screen.
- state restored on window reopen; keyboard shortcuts scoped to window.
- 28–32pt/px targets acceptable for pointer precision; keep readable hit padding.

## 7. watchOS / visionOS

- watchOS: one task per screen, crown scrolling, haptics carry meaning, 180–300ms motion.
- visionOS: depth is spatial not decorative, gaze targets larger, hover precedes pinch, reflow on resize.

## 8. Framework vocabulary

Frameworks change naming, not rules. Pick the native control from the framework that matches the platform spec.

| Need | SwiftUI | Compose (Android) | React web | Flutter | Tauri / Electron |
|---|---|---|---|---|---|
| action | Button | Button | button | ElevatedButton | button |
| switch | Toggle | Switch | role=switch input | Switch | role=switch input |
| modal | sheet | ModalBottomSheet | dialog / sheet | showModalBottomSheet | dialog |
| nav | NavigationStack | NavHost | router + Outlet | Navigator | router |
| list | List | LazyColumn | mapped list | ListView | mapped list |
| status text | Text | Text | element | Text | element |

Rules:

- use the framework's accessible primitives first
- map tokens to the framework's theme system, never hardcode
- framework defaults that violate accessibility are overridden, not copied

## 9. Decision table

| Need | Pick |
|---|---|
| top-level mobile sections | iOS tab bar / Android bottom nav |
| master-detail on wide screen | iPadOS/macOS split view / Android nav rail |
| modal form on phone | full-height sheet / modal bottom sheet |
| modal form on desktop | window-attached sheet / dialog |
| URL-addressable state | web route |
| glanceable action | watchOS |
| spatial object interaction | visionOS |

## 10. Anti-patterns

- iPhone layout stretched to desktop; Material nav forced onto iOS.
- bottom tab bar on macOS; hover-only affordance on touch.
- browser back ignored; system back unhandled on Android.
- touch target sizes copied to pointer UI without reason.
- one mockup reused across every platform.

## QA checklist

- Platform named before judging fidelity.
- Input method mapped.
- Navigation model native to the platform.
- Target sizes native (44pt iOS / 48dp Android / 44px web / pointer on desktop).
- System/browser back handled.
- Chrome respects platform.
- Keyboard path exists where relevant.
- Haptics only where supported.
- State restored on reload or reopen.

## Related

- `layout-apple-style.md`
- `components-apple-style.md`
- `animations-apple-style.md`
- `accessibility-apple-style.md`
- `macos-windowing-apple-style.md`
- `review-workflow-apple-style.md`
