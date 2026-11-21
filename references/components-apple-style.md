# Component Specs

Component anatomy and state rules across iOS, Android, web, and desktop. Uses values from `tokens-apple-style.md` and behavior from `animations-apple-style.md`. Standard controls come first; platform chrome follows `platform-adapters-apple-style.md`.

## Component contract

Every component spec includes:

- purpose
- anatomy
- sizes
- states
- interaction
- content
- do / don't

State list is mandatory: default, hover where relevant, pressed, focused, disabled, loading, error.

## 1. Button

Purpose: commit an action.

Anatomy: label, optional leading icon, optional trailing icon, background or border.

Sizes:

- height 44pt minimum.
- horizontal padding 16–20pt.
- icon 16 or 20pt.
- gap 8pt.

Variants:

- filled: tint background, contrast label.
- plain: tint label, no background.
- tinted: fill-2 background, tint label.
- destructive: red label or fill.

States:

- default: semantic tokens.
- hover: fill increases one step.
- pressed: scale 0.97, immediate highlight.
- focused: 2px tint ring, 2px offset.
- disabled: opacity 0.4, no pointer.
- loading: replace label with progress, preserve width.

Do: use a clear verb. Don't: stack multiple primary buttons in one view.

## 2. Icon button

Purpose: compact action with known meaning.

Rules:

- 44×44pt hit area.
- visible icon 20 or 24pt.
- accessible name required.
- tooltip on web hover.
- no bare icon without label in dense screens.

## 3. Toggle

Purpose: binary setting that applies immediately.

Anatomy: track, knob, optional label, optional description.

Rules:

- knob follows finger.
- commit spring 280–320ms.
- track crossfade 120–160ms.
- label describes the state, not the action.
- no submit button for a toggle setting.

## 4. Segmented control

Purpose: choose one option among 2–5 short choices.

Rules:

- labels are short nouns.
- selected pill uses spring 300ms.
- equal widths unless content demands otherwise.
- avoid when options need explanation.

## 5. Text field

Purpose: single-line text entry.

Anatomy: label, input, placeholder, helper, error, trailing affordance.

Rules:

- persistent label preferred over placeholder-only.
- height 44pt minimum.
- helper text uses footnote.
- error uses red + text, not color alone.
- focus ring is mandatory.
- clear button appears only when content exists.

## 6. Slider

Purpose: choose value on a continuous range.

Rules:

- track 4pt, thumb 28pt visual with 44pt hit area.
- show current value nearby.
- tick marks only when discrete values matter.
- haptic at notable stops.

## 7. Stepper

Purpose: increment or decrement a small numeric value.

Rules:

- two 44pt targets.
- value label uses tabular numerals.
- disable at bounds visually and semantically.

## 8. Navigation bar

Purpose: orientation and top-level actions.

Anatomy: leading control, title, trailing controls, background material.

Rules:

- title uses Headline or Title 2 depending on mode.
- large title collapses on scroll.
- material strength: regular.
- hairline bottom separator when content scrolls under.
- trailing actions max two.

## 9. Tab bar

Purpose: switch top-level sections.

Rules:

- 3–5 tabs.
- labels short.
- selected state uses tint + fill.
- badge uses red or tint, max 2 digits then "99+".
- do not nest tab bars.

## 10. Toolbar

Purpose: contextual actions for the current view.

Rules:

- actions are icon + label on wide layouts.
- collapse to icon-only on compact layouts with accessible names.
- destructive actions use red.
- group by frequency.

## 11. Sheet

Purpose: focused task over current context.

Rules:

- radius-sheet, large shadow.
- grabber optional.
- present spring 450–550ms.
- interactive dismiss when drag exceeds 25% height or velocity.
- background dim 200–250ms.
- focus trapped while open.
- escape closes when safe.

## 12. Alert

Purpose: critical information requiring a decision.

Rules:

- title + message + 1–3 actions.
- preferred action is non-destructive.
- destructive action is red.
- no complex inputs inside alerts.
- no stacked alerts.

## 13. Action sheet

Purpose: choose among contextual actions.

Rules:

- title optional.
- destructive action separated.
- cancel action always present on touch.
- max about six actions.

## 14. Popover

Purpose: transient content anchored to a control.

Rules:

- radius-large, medium shadow.
- arrow points to source.
- dismiss on outside tap.
- keyboard focus returns to source.
- avoid covering the source control.

## 15. Context menu

Purpose: secondary actions from a long press or right click.

Rules:

- order destructive last.
- preview optional.
- labels are verbs.
- no more than six items.

## 16. List row

Purpose: dense structured content.

Anatomy: leading asset, title, subtitle, trailing value or disclosure.

Rules:

- 44pt minimum height.
- 16pt horizontal padding.
- separator inset to text start.
- one line title, up to two subtitle lines.
- chevron means navigation only.

## 17. Table

Purpose: multi-column data.

Rules:

- header row uses Footnote or Caption 1 with label-2.
- numeric columns align right and use tabular numerals.
- row height 44pt default.
- sticky header on long tables.
- empty state explains next action.

## 18. Card

Purpose: group related content with a boundary.

Rules:

- radius-medium or radius-large.
- surface token background.
- hairline or small shadow.
- one primary action per card.
- do not make cards clickable unless they navigate.

## 19. Tag / chip

Purpose: compact status or filter label.

Rules:

- radius-pill.
- height 28–32pt.
- horizontal padding 12pt.
- font Caption 1 or Footnote.
- removable tags include 44pt target.

## 20. Empty state

Purpose: explain zero data and next action.

Structure:

- title
- one-sentence explanation
- optional primary action
- optional illustration, quiet

Rules:

- no jokes.
- no blank void.
- no decorative mascot.
- action verb specific: "Create project", not "Add".

## 21. Loading state

Purpose: show progress without lying.

Rules:

- use skeleton for known layout.
- spinner for indeterminate short waits.
- progress bar for known percentage.
- preserve layout to avoid shift.
- announce progress to screen readers.

## 22. Error state

Purpose: state what failed and what to do next.

Rules:

- message names the failed object.
- include recovery action.
- keep raw error code in expandable detail.
- use red + text, not red alone.
- no "Something went wrong" alone.

## 23. Toast / banner

Purpose: brief non-blocking confirmation.

Rules:

- bottom or top placement consistent.
- auto-dismiss 4–6 seconds.
- one action maximum.
- never use for critical errors.
- do not stack more than two.

## 24. Floating action button (Android / Material)

Purpose: promote the single primary action on a screen.

Rules:

- 56dp default, 48dp mini; 48dp minimum target.
- bottom-right, 16dp margin, clear of bottom nav.
- one FAB per screen; extended FAB on large screens with a short verb label.
- maps to the platform promoted action; do not duplicate a primary button already on screen.
- on iOS/web, use the native equivalent (large filled action or prominent toolbar item), not a copied FAB.

States: default, pressed (elevation rise), focused, disabled, loading.

## 25. Snackbar (Android / web)

Purpose: brief, low-emphasis confirmation with an optional undo.

Rules:

- bottom placement above nav/bottom bar.
- 4–10s visible; longer when an action is offered.
- one action maximum, typically Undo.
- dismiss on action or timeout; never stack more than one.
- maps to toast/banner on iOS with the same timing.
- announce via live region; action focusable by keyboard.

## 26. Navigation rail / bottom navigation (Android)

Purpose: switch top-level destinations on Android.

Rules:

- bottom navigation for 3–5 destinations on phones.
- navigation rail for 3–7 destinations on tablets/large screens.
- selected state uses tint + filled indicator + label.
- system back returns to the previous destination, not the first.
- keep labels visible; no icon-only top-level nav on touch.

## 27. Top app bar (Android)

Purpose: title, navigation affordance, and contextual actions on Android.

Rules:

- small/medium/large variants follow scroll.
- up affordance at leading edge; actions collapsed into overflow when crowded.
- action icons 24dp with 48dp targets.
- tonal or surface color, not a copied iOS blur.
- desktop equivalent is toolbar/command bar, not app bar.

## 28. Modal bottom sheet (Android / web)

Purpose: focused task that partially covers content on Android/web.

Rules:

- drag handle optional; draggable to dismiss.
- peek height shows enough content to be meaningful.
- full, half, and peek stop points where content warrants.
- scrim behind; focus trapped; escape/back dismisses when safe.
- iOS equivalent is a sheet; desktop equivalent is a window dialog.

## 29. Chips (Material) / tags

Purpose: compact filters, choices, and status labels.

Rules:

- 32dp height minimum; 48dp touch target via padding.
- input chips removable with a 48dp target; filter/choice chips toggle state.
- selected chip uses tonal fill + label, not color alone.
- elevation chips are flat by default; no heavy shadow.

## 30. Web form controls and dialogs

Purpose: native web equivalents that keep the house rules.

Rules:

- use native `button`, `input`, `select`, `dialog` before custom widgets.
- focus ring is mandatory; `:focus-visible` uses the tint token.
- `<dialog>` with `showModal()` for modal flow; focus returns to invoker on close.
- native validation plus visible, specific error text; no color-only error.
- links navigate; buttons act. Never use a styled `div`.

## 31. Desktop command surfaces

Purpose: window-appropriate action surfaces for macOS / Windows / Linux.

Rules:

- toolbar/command bar holds view actions; app/menu bar holds global commands.
- navigation view or sidebar owns destinations; bottom tabs do not.
- dialogs and sheets attach to the window; no full-screen modal for a form.
- hover and focus are distinct visible states.
- destructive actions are separated and confirmable.

## 32. Applied HIG component refinements

Source labels name HIG topics and are routing hints, not copied text. Use the strength labels from `evidence-apple-style.md`.

- Must: give every custom button a visible press state and an action-naming label. Source: `buttons`. Audit: label is a verb phrase; press state is instant; destructive role is distinct and not the default focus.
- Must: reserve alerts for critical, actionable information. Source: `alerts`. Audit: no alert for routine or undoable deletes; message is essential-only with a useful action.
- Should: use an action sheet for short choices attached to an intentional action, with Cancel and a separated destructive option. Source: `action-sheets`. Audit: choices are few, current, and cancelable; the safe action is visually primary.
- Must: give text fields a persistent visible purpose label and show format or clear affordances only when relevant. Source: `text-fields`. Audit: placeholder is not the only label; clear button appears only with content; keyboard type matches input.
- Should: make search fields refine results as text changes, expose a clear action, and reserve scope bars for genuinely distinct scopes. Source: `search-fields`. Audit: live results, clear resets to recents, no scope bar for one scope.
- Must: keep toggle state obvious through shape or icon as well as color, and apply the effect without a separate save. Source: `toggles`. Audit: on/off reads without color; no save button on a toggle-only setting.
- Should: show the current slider value numerically and mark discrete stops. Source: `sliders`. Audit: value updates during drag; minimum stays leading or bottom, maximum trailing or top.
- Must: use segmented controls for closely related views, filters, or state on the same object, not a primary navigation path or destructive action. Source: `segmented-controls`. Audit: segments stay in one logical group; control type is consistent; destructive actions do not live in the group.
- Should: keep the selected picker value visible and default to the common, predictable choice. Source: `pickers`. Audit: long lists are searchable or ordered; hidden values can be predicted.
- Must: keep list rows uniform, open full detail on selection, and leave a visible primary action alongside swipe or context actions. Source: `lists-and-tables`. Audit: density is stable; tap opens detail; hidden actions complement rather than replace the main path.
- Should: keep toolbars to a few context-relevant commands with graceful overflow. Source: `toolbars`. Audit: primary actions are few; overflow holds the rest; narrow widths do not truncate labels.
- Must: keep charts accessible and never hide critical information behind interaction. Source: `charts`, `charting-data`. Audit: values have accessible labels; keyboard and VoiceOver paths exist; changes are announced without motion.

## Universal target sizes

| Platform | Minimum target |
|---|---|
| iOS | 44pt |
| Android | 48dp |
| web | 44px |
| desktop (pointer) | 28–32pt/px with readable hit padding |

The 44pt/px figure used throughout this file is the iOS/web default. Substitute 48dp on Android and pointer-appropriate sizes on desktop.

## Do / Don't

Do:

- use standard controls first.
- design every state.
- keep target sizes native to the platform.
- preserve width in loading buttons.

Don't:

- invent a toggle when a switch works.
- use cards as buttons without affordance.
- hide errors in color.
- put primary actions inside alerts.
- use icon-only navigation without labels.

## Related

- `design-apple-style.md`
- `animations-apple-style.md`
- `state-and-feedback-apple-style.md`
- `perceived-performance-and-input-apple-style.md`
- `tokens-apple-style.md`
- `layout-apple-style.md`
- `accessibility-apple-style.md`
- `haptics-and-sound-apple-style.md`
- `qol-patterns-apple-style.md`
- `platform-adapters-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
