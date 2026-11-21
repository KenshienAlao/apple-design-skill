# Apple-Style macOS Windowing

macOS-specific window, toolbar, sidebar, and menu rules. Load when building desktop Apple-inspired apps.

## 1. Window is the unit

- Each window has a focused task.
- Multiple windows are valid for multi-document work.
- Window state restores on reopen.
- Closing a window closes that document context, not the app unless it is the last window.
- Minimize and zoom behave as system controls.

## 2. Traffic lights

- close, minimize, zoom remain in system position.
- never overlay content under traffic lights.
- titlebar drag region stays usable.
- full-screen button respects system behavior.
- custom close behavior must still ask before data loss.

## 3. Toolbar

- belongs at top of window.
- holds view-level actions, not global app commands.
- icons may show labels on wide layouts.
- destructive actions separated.
- search field can live in toolbar when central.
- toolbar items collapse gracefully.

## 4. Sidebar

- source-of-truth navigation for the window.
- groups use section headers.
- selection visible with tint fill.
- items show count badges where useful.
- collapsible groups persist state.
- sidebar width 240–320pt default.

## 5. Inspector

- right-side panel for contextual details.
- width 280–360pt default.
- not required for primary task.
- can be toggled from toolbar.
- state persists per document where possible.

## 6. Split view

- primary and detail panes.
- divider is draggable with limits.
- double-click divider can collapse primary.
- compact width collapses to navigation stack.
- detail empty state explains selection.

## 7. Sheets

- attached to the window.
- not full-screen unless the task demands it.
- present with calm spring or curve.
- focus trapped while open.
- close returns focus to invoker.
- unsaved changes block accidental close.

## 8. Popovers

- anchored to toolbar item or control.
- arrow points to source.
- outside click dismisses.
- no nested popovers.
- move to sheet when content grows.

## 9. Menu bar

- app menu for app-wide commands.
- File for documents.
- Edit for undo, copy, paste, find.
- View for layout and visibility.
- Window for window management.
- Help for help entry.
- shortcuts shown.
- disabled commands show why when possible.

## 10. Context menus

- right-click or secondary click.
- actions ordered by frequency.
- destructive last.
- labels are verbs.
- keep under six items.

## 11. Drag and drop

- pasteboard types explicit.
- drag source shows preview.
- drop target highlights.
- invalid drop shows no-drop cursor.
- keyboard alternative exists through menu commands.

## 12. Keyboard

- Cmd-based shortcuts.
- Escape dismisses transient UI.
- Tab navigation follows visual order.
- Focus ring visible.
- Key equivalents match menu labels.
- No shortcut fires while editing text unless scoped.

## 13. Window restoration

Restore:

- window frame
- sidebar selection
- inspector visibility
- split view widths
- scroll position
- selection
- unsaved draft

Do not restore:

- transient popovers
- destructive confirmations
- expired modal state

## 14. Anti-patterns

- web-style full-page modal for every action
- hidden menu commands with no shortcut
- bottom tab bar
- oversized touch controls everywhere
- non-native traffic light behavior
- windows that do not restore state

## QA checklist

- Window restores frame and state.
- Toolbar actions are view-level.
- Menu bar has global commands.
- Sidebar and inspector toggles persist.
- Sheets are window-attached.
- Popovers return focus.
- Drag and drop has keyboard path.
- Traffic lights unobstructed.

## Related

- `platform-adapters-apple-style.md`
- `layout-apple-style.md`
- `components-apple-style.md`
- `qa-apple-style.md`
