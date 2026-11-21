# Apple-Style Anti-Patterns

Failure modes that make an interface look like a cheap imitation instead of a disciplined system.

## 1. Fake glass

Bad:

- blur everywhere
- low-contrast text over photos
- multiple stacked translucent layers
- glass on flat background with nothing behind it

Use instead:

- material only when separating layers
- solid fallback
- contrast-tested labels
- one translucent layer at a time

## 2. Random radii

Bad:

- 6px on one card, 18px on another, 4px on a button
- nested radii that fight
- pill corners on rectangular data tables

Use instead:

- radius tokens by component class
- nested radius steps
- pill only for chips, avatars, capsules

## 3. Heavy shadows

Bad:

- 0 20px 60px black on every card
- colored glow
- shadow used as border

Use instead:

- hairline + material
- small shadow for menus
- large shadow only for sheets and modals

## 4. Gradient default

Bad:

- purple or blue gradient background
- gradient buttons
- gradient text

Use instead:

- solid semantic surface
- one tint
- spacing and type for hierarchy

## 5. Over-animation

Bad:

- bounce above 0.25
- staggered card entrance on every render
- 800ms transitions
- animation that blocks input

Use instead:

- 250–500ms
- bounce 0–0.15
- motion tied to state change
- interruptible transitions

## 6. Snapping during drag

Bad:

- carousel jumps to page while finger is still down
- toggle commits before release
- sheet dismiss starts before threshold

Use instead:

- 1:1 tracking during drag
- commit on release using velocity and offset

## 7. Phantom pages

Bad:

- carousel advances past last item to blank page
- infinite bounce with no content
- visible recenter in looping carousel

Use instead:

- bounded rubber band
- spring back to edge
- invisible clone recenter for loops

## 8. Custom-control obsession

Bad:

- custom switch
- custom checkbox
- custom alert
- homemade icon set with inconsistent stroke

Use instead:

- standard controls
- SF Symbols or one consistent set
- custom only when the system vocabulary fails

## 9. Dark Mode inversion

Bad:

- white becomes black by filter
- tint becomes neon
- separators disappear
- shadows invert weirdly

Use instead:

- semantic light/dark tokens
- tuned contrast
- adapted materials

## 10. Decoration as hierarchy

Bad:

- colored left borders everywhere
- badges on every row
- cards inside cards inside cards

Use instead:

- spacing
- type role
- grouping
- one accent

## 11. Placeholder as label

Bad:

- input shows "Email" only as placeholder
- label vanishes on typing

Use instead:

- persistent label
- helper text where needed

## 12. Color-only state

Bad:

- red/green dots only
- tint as only selected affordance
- error border without message

Use instead:

- text + icon + color
- visible selected state
- error message

## 13. Cute copy

Bad:

- "Oopsie!"
- "Yay!"
- "Nothing to see here... yet!"

Use instead:

- direct statement
- recovery action

## 14. Stub UI

Bad:

- TODO labels
- lorem ipsum
- dead buttons
- fake charts

Use instead:

- real content
- empty state
- disabled with reason
- honest loading state

## 15. AI-design tells

Bad:

- centered hero over three identical cards
- all-caps mono eyebrow
- decorative 01/02/03
- purple gradient glow
- generic dashboard with fake avatars

Use instead:

- task-first layout
- real hierarchy
- standard controls
- content-specific composition

## 16. Feedback spam

Bad:

- haptic on every drag frame
- notification haptic for routine selection
- error sound for a validation typo
- sound with no visible state
- vibration on web scroll

Use instead:

- one haptic at commit
- selection tick for selection
- notification only for outcome
- visible state always present

## 17. Missing QoL

Bad:

- form loses data on back
- focus vanishes after sheet close
- no undo for destructive edit
- shortcut fires while typing
- offline queue with no visible state

Use instead:

- preserve drafts
- restore focus and scroll
- expose undo
- scope shortcuts
- show offline and pending states

## 18. Wrong platform chrome

Bad:

- bottom tab bar on macOS
- iPhone margins on a large macOS window
- hover-only affordance on touch
- browser back ignored
- full-screen sheet for a macOS settings form

Use instead:

- platform-native navigation
- window/sidebar/toolbar on macOS
- URL state on web
- touch-first affordances on iOS
- adapted density and motion

## 19. One mockup everywhere

Bad:

- identical bottom tab bar on iOS, Android, and desktop
- iOS sheet reused as an Android dialog and a desktop modal
- 48dp targets copied to iOS, or 44pt copied to Android
- Material navigation forced onto iOS or HIG chrome forced onto Android
- a single breakpoint set reused across phone, tablet, and window

Use instead:

- one craft system, translated into native chrome per platform
- platform target sizes (44pt iOS / 48dp Android / 44px web / pointer desktop)
- native navigation patterns per platform
- per-platform breakpoints (size classes, window size classes, media queries)

Platform mismatch is at least a High finding in the review workflow.

## Reject rule

If a pattern appears in this file, reject it unless the ticket explicitly names it and a written reason is recorded in the QA notes.

## Related

- `design-apple-style.md`
- `animations-apple-style.md`
- `restraint-and-antislop-apple-style.md`
- `components-apple-style.md`
- `content-apple-style.md`
- `platform-adapters-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
