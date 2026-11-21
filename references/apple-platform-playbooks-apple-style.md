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

Must: keep the primary action reachable with one hand and clear of safe-area insets. Source: `designing-for-ios`. Audit: primary CTA is in the thumb zone; no control sits under the notch or home indicator.

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

Must: use width through split views and multiple columns; hover and focus are real states alongside touch. Source: `designing-for-ipados`. Audit: wide layout is not a stretched phone view; multitasking and pointer input keep the task intact.

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

Must: keep one idea per screen and assume a seconds-long session; complications and notifications are first-class surfaces. Source: `designing-for-watchos`. Audit: screen has one purpose; target size holds; a glanceable surface is considered.

Should: keep text short and use Dynamic Type at the small end of the scale.

## 5. visionOS

- Windows and volumes occupy real space; depth is spatial, not decorative.
- Gaze precedes pinch; hover is a genuine state before commit.
- Ornaments attach controls to a window without covering content.
- Targets are larger than on flat screens; reflow on resize.
- Materials respond to light; contrast must hold in bright and dim environments.

Must: never use depth to imply hierarchy that is not functional.

Should: keep one plane of content dominant and let ornaments recede.

Should: keep content at a comfortable reach distance and tolerate gaze jitter with forgiving targets. Source: `designing-for-visionos`. Audit: windows fit the viewing space; targets remain selectable without precise aim; no edge-to-edge opaque chrome.

## 6. tvOS

- Design for a viewing distance of roughly ten feet: large type, large targets, and one visible focus.
- Focus movement is the primary navigation path; never leave focus ambiguous or split between regions.
- Minimize text entry; prefer choices, search, or companion-device input.
- Titles, metadata, and status stay glanceable from the couch.

Must: keep the focused item unmistakable and primary actions reachable without long typing. Source: `designing-for-tvos`. Audit: focus is visible, targets are sized for distance, and long text fields are absent.

Should: keep one dominant content region and let chrome recede during playback.

## 7. Games

- Prioritize immediate visual and audio response to input.
- Make pause and resume explicit and reachable without leaving the task.
- Persist progress, inventory, and settings when the app backgrounds or loses focus.
- Keep overlays legible at the target display size and input distance.

Must: save progress on background and expose pause/resume from the main interaction path. Source: `designing-for-games`. Audit: input feedback is immediate; pause is reachable; state survives interruption.

Should: defer setup detail until the first moment the game needs it.

## 8. System surfaces and technologies

Use system surfaces and integrations as native patterns, not custom reinventions. Source labels name HIG topics.

| Surface / technology | Must / Should | Audit |
|---|---|---|
| Widgets | Must: glanceable, timely, deep-linked, and privacy-aware; remove stale content. Should: support relevant sizes/families and sensible tap targets. | Widget opens relevant destination; no sensitive lock-screen content by default; stale state cleared. |
| Live Activities | Must: show live, time-bounded status only; end promptly; keep updates meaningful. Should: provide compact/expanded states with clear hierarchy. | Activity ends when event ends; updates are not promotional/noisy; tap deep-links correctly. |
| Complications / watch faces | Must: glanceable, timely, and optional; respect small-screen legibility. Should: use complications/watch-face appropriate data density. | Complication has clear value at a glance; no dense text; watch-face content remains legible. |
| Notifications / badges | Must: user control, relevance, accurate badge counts, clear actions. | Permission requested in context; badge clears when read; notification opens relevant screen. |
| Always On / live viewing | Must: reduce motion/brightness/sensitive content appropriately; keep critical info glanceable. | Always-on state is calm and privacy-aware; updates do not distract. |
| App icons / branding | Must: follow platform icon/grid/material guidance; no Apple trademarks or confusingly similar system icons. Should: test at small sizes and appearance variants. | Icon recognizable at small size; dark/tinted variants remain clear. |
| Sign in with Apple / passkeys / accounts / managing accounts | Must: respect privacy, offer system auth where appropriate, explain account value before blocking. Should: prefer passkeys/biometrics/keychain over custom password flows. | Sign-in not a premature wall; account deletion/settings clear. |
| Apple Pay / Wallet / Tap to Pay / ID Verifier / NFC | Must: use system payment/identity sheets where available; show clear total/cost/context before commit; handle sensitive data securely. | No custom card capture when system payment appropriate; identity/payment flows are explicit and consented. |
| In-app purchase / subscriptions | Must: clear pricing, terms, renewal/cancellation paths, and restore purchases where applicable. Should: avoid dark patterns and confusing paywalls. | Price/trial/renewal understandable before purchase; manage/cancel/restore visible. |
| HealthKit / CareKit / ResearchKit / sensitive data | Must: request minimum data, explain purpose, handle denial/revocation, protect privacy. | Permission purpose specific; sensitive data not exposed in notifications/logs. |
| SharePlay / sharing / collaboration / activity views | Must: make shared state visible, preserve user control, handle participants joining/leaving gracefully. | Shared session state clear; user can leave/stop sharing easily. |
| Game Center / games / game controls | Must: support system game features without blocking core play; save progress and respect platform input/accessibility. Should: support controllers and clear pause/resume. | Achievements/leaderboards optional; pause/resume/controllers work where supported. |
| CarPlay / driving contexts | Must: glanceable, minimal interaction, no complex text entry, no required iPhone interaction while driving. | Primary tasks short; text/targets legible at distance; motion/distraction limited. |
| AirPlay / media playback | Must: make playback/control destinations clear; preserve user control and privacy. | AirPlay route/control is obvious; playback state remains consistent. |
| Siri / Shortcuts / App Intents | Should: expose meaningful actions with clear phrases, predictable results, and confirmation for destructive actions. | Intent names natural; result visible/audible; destructive intents confirm. |
| iCloud / continuity / Handoff | Should: preserve state safely across devices; resolve conflicts clearly; respect privacy. | Handoff/restoration preserves task; conflicts understandable and recoverable. |
| Generative AI / Machine Learning | Must: be transparent, give user control/review, handle uncertainty/errors safely, protect private data. Should: label generated content and provide undo/feedback. | AI output editable/reviewable; no silent sensitive-data sharing; failures recoverable. |
| Apple Pencil / Scribble / camera control / gyro / nearby interactions | Should: support relevant device inputs when they add value; always provide alternatives. | Input-specific features degrade gracefully; core task works without specialized hardware. |
| App Clips / iMessage apps & stickers / top shelf / lockups | Should: keep experiences focused, fast, and platform-native. | App Clip/task is scoped; iMessage/top-shelf/lockup content is glanceable and deep-links correctly. |
| Maps / location / ShazamKit / workouts / other system tech | Must: request permissions in context, explain value, and handle unavailable data gracefully. | Permissions contextual; fallback exists when service unavailable/denied. |

## 9. Cross-platform transfer table

| Idea | iOS | iPadOS | macOS | watchOS | visionOS |
|---|---|---|---|---|---|
| top-level nav | tab bar | sidebar / split view | sidebar + toolbar | stack | window + ornaments |
| modal focus task | sheet | form sheet | window sheet | pushed screen | attached panel |
| anchored detail | popover | popover | popover / inspector | detail view | ornament |
| global commands | toolbar item | toolbar item | menu bar | crown + action | gaze target |
| glanceable state | widget / Live Activity | widget | menu bar item | complication | window badge |

| Extended surface | Primary rule | Audit |
|---|---|---|
| tvOS | one visible focus, large targets, minimal typing | focus is unambiguous from a distance |
| games | instant input response, explicit pause, background persistence | state survives interruption |

## 10. Anti-patterns

- stretched iPhone layout on iPad
- bottom tab bar on macOS
- full-screen sheet on a desktop window
- hover-only affordance on touch
- decorative depth on visionOS
- crown inertia copied to a pointer UI
- widget/Live Activity used as a full reading or promotional surface
- sensitive data exposed on glanceable/lock-screen surfaces
- custom payment/auth flows where a system pattern exists and is appropriate
- requiring iPhone interaction or complex text entry in CarPlay/driving contexts

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
