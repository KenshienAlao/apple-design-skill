# Apple-Style Content

Content rules for Apple-inspired interfaces. Copy is part of the interface.

## 1. Voice

- direct
- calm
- specific
- non-cute
- non-salesy
- no exclamation marks by default

Good: "Changes saved."  
Bad: "Yay! Your changes are saved!"

Copy is platform-neutral: name the action or result, never a platform-specific control ("tap the tab bar", "click OK"). Let the platform supply the idiom.

## 2. Capitalization

| Element | Style | Example |
|---|---|---|
| Navigation title | title case | Payment Methods |
| Button label | title case | Save Changes |
| Section header | title case | Recent Files |
| Body prose | sentence case | Choose a payment method. |
| Error message | sentence case | The file could not be opened. |
| Field label | title case | Display Name |
| Helper text | sentence case | This appears on your profile. |

## 3. Buttons

Use verbs. Name the result.

| Good | Bad |
|---|---|
| Save Changes | OK |
| Delete Project | Submit |
| Add Payment Method | Continue |
| Try Again | Retry Now Please |
| View Details | More |

Rules:

- one primary action per view
- destructive verbs explicit: Delete, Remove, End
- avoid "Yes" and "No" without context
- keep labels under about three words

## 4. Labels

Rules:

- prefer nouns for fields
- state setting labels as the setting, not the action
- avoid negatives where possible

Good: "Wi-Fi" with toggle state on.  
Bad: "Turn off Wi-Fi" as toggle label.

## 5. Errors

Structure:

1. what failed
2. why, if known
3. what to do next

Good: "The file could not be opened because it is damaged. Choose another file."  
Bad: "Error 502."  
Bad: "Something went wrong."

Rules:

- no blame
- no jokes
- no jargon in primary message
- raw codes in expandable detail
- keep error text visible after dismiss attempt

## 6. Empty states

Structure:

- title
- one-sentence explanation
- action

Good: "No Projects Yet" / "Create a project to start organizing your work." / "Create Project"

Bad: "Nothing here :("

## 7. Help text

- one sentence
- specific
- no repetition of label
- no paragraphs unless required

Good: "Used for account recovery."  
Bad: "This is your email address. Enter your email address here."

## 8. Confirmations

Use confirmation for:

- destructive actions
- irreversible changes
- leaving unsaved work

Do not confirm:

- toggles
- navigation
- non-destructive selection

Confirmation title names action. Message names consequence.

Good: "Delete Project?" / "This removes the project and all of its files. This action cannot be undone."

## 9. Notifications and toasts

- short
- factual
- no exclamation
- one action maximum

Good: "Changes saved."  
Bad: "Success! Everything is perfect!"

## 10. Dates, numbers, units

- use locale formatting
- use tabular numerals in tables
- spell out units in prose
- avoid ambiguous date formats
- use absolute dates for past events when possible

Good: "Nov 20, 2026 at 14:30"  
Bad: "11/20/26 2:30"

## 11. Localization

- never concatenate sentence fragments
- use plural rules
- support right-to-left layouts
- leave 30% text expansion room
- avoid idioms
- keep icons culturally neutral

## 11a. Benefit-led and calm copy

Product and flagship copy states what the user gets, not what the feature is.

| Good | Bad |
|---|---|
| "Learn more" | "Click here" |
| "Syncs across your devices" | "Cross-device synchronization engine" |
| "Built for focus" | "Revolutionary productivity paradigm" |
| "See how it works" | "Explore the platform" |

Rules:

- One idea per sentence. Split a second idea into a new sentence.
- Prefer calm verbs: save, sync, open, create, choose, view, learn.
- Name the result before the mechanism.
- No hype vocabulary: revolutionary, game-changing, seamless, cutting-edge, unbeatable, effortless.
- No urgency theater in product copy: act now, don't miss out, limited time.
- Link text describes its destination, never the gesture.

Must: keep error and confirmation copy factual even in marketing surfaces.

Should: keep marketing headings under about eight words and body sentences under about twenty.

May: use a single brand-specific phrase per page when it carries meaning; never repeat it as a refrain.

## 12. Do / Don't

Do:

- use plain verbs
- keep messages short
- name objects
- offer recovery
- localize strings properly

Don't:

- use cute microcopy
- use ALL CAPS for emphasis
- use multiple exclamation marks
- rely on humor in errors
- bury the action under explanation

## QA checklist

- Every button starts with a verb.
- Every error has recovery.
- No placeholder-only fields.
- No "Something went wrong" alone.
- No exclamation marks in system copy.
- Capitalization follows table.
- Strings are localized-safe.
- Confirmations used only where needed.

## Related

- `components-apple-style.md`
- `accessibility-apple-style.md`
- `anti-patterns-apple-style.md`
- `platform-adapters-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
