# Apple-Style Quality-of-Life Patterns

QoL is the invisible craft that makes an interface feel finished. Load this when building real products, not mockups.

## 1. Autosave

Rules:

- save after commit, not after every keystroke unless content is local-only
- show saved state quietly
- never block input while saving
- preserve unsaved state on crash where possible
- retry failed saves without duplicating records

States:

- edited
- saving
- saved
- failed
- offline pending

Copy:

- "Edited"
- "Saving…"
- "Saved"
- "Not saved. Try again."
- "Waiting for connection."

## 2. Undo and redo

Rules:

- group changes into meaningful actions
- expose undo through menu, keyboard, and gesture where platform supports it
- name the action when possible: "Undo Delete"
- keep undo after navigation when state exists
- destructive actions need undo when practical

Keyboard:

- Cmd+Z undo
- Cmd+Shift+Z redo
- Ctrl+Z / Ctrl+Y on web where appropriate

## 3. Focus restoration

Rules:

- return focus to the invoking control after sheet or popover dismissal
- preserve scroll position on back
- restore selection in lists and tables
- restore caret position in text fields
- avoid jumping focus on async refresh

## 4. Keyboard shortcuts

Rules:

- shortcuts use platform conventions
- show shortcut in menu or tooltip
- no single-letter global shortcuts
- shortcuts must not fire while typing
- Escape dismisses transient UI
- Enter activates default action only where expected

Common:

| Action | macOS | Web |
|---|---|---|
| Save | Cmd+S | Ctrl/Cmd+S |
| Find | Cmd+F | Ctrl/Cmd+F |
| Close | Cmd+W | Ctrl/Cmd+W where safe |
| Preferences | Cmd+, | not standard |
| New | Cmd+N | Ctrl/Cmd+N where safe |

## 5. Drag and drop

Rules:

- drag handle visible for complex items
- drop target highlights before release
- invalid targets reject clearly
- keyboard alternative exists
- drag preview matches source
- cancel restores original order
- commit fires one haptic

## 6. Share and export

Rules:

- share sheet on Apple platforms
- web share API where supported
- fallback to copy link or download
- show what is being shared
- preserve file type and metadata
- confirm overwrites

## 7. Deep links

Rules:

- every major object has a stable URL or route
- restore navigation hierarchy
- handle invalid links with a useful state
- preserve auth state safely
- open in existing window when appropriate

## 8. Recent items

Rules:

- show recently opened items when useful
- include name, type, and time
- allow clear recents
- exclude sensitive items unless explicitly allowed
- never use recents as navigation clutter

## 9. Smart defaults

Rules:

- choose the safe, reversible default
- remember last non-destructive choice
- do not remember destructive choices
- explain non-obvious defaults once
- allow reset to default

## 10. Progressive disclosure

Rules:

- show common controls first
- reveal advanced controls behind "More" or "Advanced"
- keep disclosure state when returning
- never hide required input
- do not collapse error causes

## 11. Batch actions

Rules:

- selection mode explicit
- action bar shows count
- destructive actions confirm with count
- select all only where it makes sense
- preserve selection across scroll

## 12. Offline behavior

Rules:

- show offline state clearly
- queue safe actions
- disable actions that cannot be queued
- reconcile on reconnect
- never silently drop data

## 13. Recovery

Rules:

- every destructive action gets undo or confirmation
- failed network action keeps entered data
- crashed session restores draft
- recovery UI names what was restored
- discard action is explicit

## 14. Empty, loading, error continuity

Rules:

- loading preserves layout
- empty state teaches the next action
- error state preserves entered data
- retry does not reset the form
- transitions between these states use crossfade only

## 15. Anti-patterns

- autosave that overwrites without history
- toast that disappears before reading
- shortcut conflict with typing
- focus lost after modal close
- drag and drop with no keyboard path
- deep link that opens blank screen
- offline queue with no visible state

## 16. QA checklist

- Autosave states visible.
- Undo works for main edits.
- Focus returns after modal.
- Scroll position restored on back.
- Keyboard shortcuts do not fire in inputs.
- Drag and drop has keyboard alternative.
- Share fallback exists.
- Deep link invalid case handled.
- Offline state visible.
- Recovery names restored content.

## Related

- `components-apple-style.md`
- `state-and-feedback-apple-style.md`
- `perceived-performance-and-input-apple-style.md`
- `platform-adapters-apple-style.md`
- `accessibility-apple-style.md`
- `qa-apple-style.md`
