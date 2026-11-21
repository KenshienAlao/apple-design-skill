# Apple Platform Playbooks

Per-surface recipes for the Apple platforms in this skill's craft lens. Load this when the target is iOS, iPadOS, macOS, watchOS, or visionOS and the task needs native chrome decisions.

Apple is the lens; the host platform is still the execution target. When building for Android, web, Windows, or Linux, use `platform-adapters-apple-style.md` for the execution vocabulary and take only the transferable idea from here.

API family names below are documented platform vocabulary. Behavioral defaults are labeled Should. House choices are labeled May. Nothing here is a substitute for reading the current platform documentation.

## 1. iOS

### Navigation

- `UINavigationController` / `NavigationStack` for drill-down; tab bar for top-level sections.
- Large title collapses with scroll; keep the compact title reachable.
- System back stays authoritative; do not replace it with a custom button.
- Deep links land on the real screen with state restored.

Should: keep one primary action per screen in the toolbar or navigation item.

Must: handle system back and preserve in-progress input.

### Sheets

- `UISheetPresentationController` detents: `.medium` and `.large`; `.medium` only when the content genuinely fits.
- Grabber visible when the sheet is dismissible by drag.
- Focus moves into the sheet on presentation and returns on dismissal.
- Drag tracks 1:1, commits on velocity and offset, and never snaps mid-drag.

Should: use a sheet for a focused task, not for a full reading surface.

### Alerts and popovers

- `UIAlertController` for confirmation and short decisions; keep the destructive action explicit.
- `UIPopoverPresentationController` on iPad for anchored content; provide a valid bar-button or view anchor.
- Popovers must have a non-popover fallback on compact width.

### Home screen and Live Activity surfaces

- Widgets use `WidgetKit` timelines; keep one idea per widget and respect the family size.
- Live Activities and the Dynamic Island are glanceable: current state first, detail on tap.
- Never put critical-only information behind an expansion.

Should: treat these surfaces as read-mostly; keep interaction to one obvious action.

### Platform checks

- 44pt minimum targets, safe areas, Dynamic Type, VoiceOver traits.
- Haptics at commit only, once.
- Reduce Motion resolves to the final state with fades.

## 2. iPadOS

- Prefer split view and a sidebar over a stretched phone layout.
- Toolbar replaces the cramped navigation bar actions.
- Multi-scene windows each keep their own state; reopen restores it.
- Pointer and keyboard are first-class: hover, focus, and shortcuts are real states.
- Sheets may be form sheets over the scene; wide layouts use popovers anchored to controls.

Must: keep navigation valid with keyboard only.

Should: use column resizing and window size classes rather than a single breakpoint.

## 3. macOS

- `NSWindow` / `WindowGroup` is the unit; each window owns its state.
- `NSSplitViewController` / `NavigationSplitView` for sidebar + content + inspector.
- `NSToolbar` owns view actions; the menu bar owns global commands.
- Menus are `NSMenu` / `.menu` and must duplicate only commands that need keyboard access.
- Window restoration, tabbing, and close behavior are part of the build.
- Sheets attach to the window; use a panel for reusable utility UI.

Must: a window close or reopen never loses unsaved work.

Should: keep toolbars compact, label with text where space allows, and expose keyboard shortcuts for repeated actions.

May: use a subtle material for the sidebar; keep the content canvas solid.

See `macos-windowing-apple-style.md` for window rules.

## 4. watchOS

- One task per screen; the stack is shallow.
- Digital Crown scrolls and adjusts; respect the crown's inertia.
- Haptics carry meaning where sound and sight are constrained.
- Motion is quick and low amplitude; extended animation is a defect.
- Complications are glanceable; one value, one label.

Must: the primary action is reachable without scrolling when possible.

Should: keep text short and use Dynamic Type at the small end of the scale.

## 5. visionOS

- Windows and volumes occupy real space; depth is spatial, not decorative.
- Gaze precedes pinch; hover is a genuine state before commit.
- Ornaments attach controls to a window without covering content.
- Targets are larger than on flat screens; reflow on resize.
- Materials respond to light; contrast must hold in bright and dim environments.

Must: never use depth to imply hierarchy that is not functional.

Should: keep one plane of content dominant and let ornaments recede.

## 6. Cross-platform transfer table

| Idea | iOS | iPadOS | macOS | watchOS | visionOS |
|---|---|---|---|---|---|
| top-level nav | tab bar | sidebar / split view | sidebar + toolbar | stack | window + ornaments |
| modal focus task | sheet | form sheet | window sheet | pushed screen | attached panel |
| anchored detail | popover | popover | popover / inspector | detail view | ornament |
| global commands | toolbar item | toolbar item | menu bar | crown + action | gaze target |
| glanceable state | widget / Live Activity | widget | menu bar item | complication | window badge |

## 7. Anti-patterns

- stretched iPhone layout on iPad
- bottom tab bar on macOS
- full-screen sheet on a desktop window
- hover-only affordance on touch
- decorative depth on visionOS
- crown inertia copied to a pointer UI
- widget used as a full reading surface

## QA checklist

- Platform named before choosing chrome.
- Native control chosen from the platform's own API family.
- Back, close, and restoration handled.
- Targets and density native to the surface.
- Dynamic Type and Reduce Motion verified.
- Haptics only where the hardware supports them.

## Related

- `platform-adapters-apple-style.md`
- `macos-windowing-apple-style.md`
- `navigation-models-apple-style.md`
- `apple-native-recipes-apple-style.md`
- `apple-hig-mapping-apple-style.md`
- `apple-review-rubric-apple-style.md`
