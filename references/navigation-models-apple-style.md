# Navigation Models

How a surface moves between places and tasks. Load this when choosing push, sheet, modal, tab, popover, split view, back behavior, deep links, or state restoration.

Native names are examples. The same decision model maps to Android, web, desktop, Flutter, React Native, and Compose.

## 1. Scope

This file owns:

- presentation choice by relationship
- back and deep-link behavior
- state restoration
- modality cost
- navigation data modeling
- web and cross-platform mappings

This file does not own:

- component anatomy; use `components-apple-style.md`
- layout and safe areas; use `layout-apple-style.md`
- platform vocabulary; use `platform-adapters-apple-style.md`
- loading behavior during navigation; use `state-and-feedback-apple-style.md`

## 2. Decision tree

| Relationship | Presentation | Native example | Web or desktop analog |
|---|---|---|---|
| peer top-level sections | tabs or split view | `TabView`, `UISplitViewController`, `NavigationSplitView` | sidebar, tab router, `role="tablist"` |
| child detail in a hierarchy | push | `NavigationStack`, `UINavigationController` | history route, stack router |
| self-contained subtask | sheet | sheet with detents, `fullScreenCover` | modal dialog, drawer |
| transient options | popover or action sheet | popover, menu, action sheet | Popover API, menu, small dialog |
| in-place change | state only | inline edit, disclosure | local state, details element |

Must: choose presentation from the relationship, not from visual preference.

Should: keep hierarchical depth to 3–4 levels where the task allows.

Must: preserve the return path.

## 3. Modality cost

A modal interrupts the current task. Each modal layer adds dismissal work and context loss.

Rules:

- Use a sheet when the task is self-contained and must be completed or cancelled.
- Use a popover for a short-lived choice anchored to a control.
- Use a push when the user is drilling into related content.
- Use a tab when sections are peers.
- Use state-only change when no new place is being visited.
- Do not stack modals.
- Do not present a modal from a modal without an explicit task reason.
- Do not use a full-screen modal for a two-option confirm.

Should: use detents or adaptive sheet heights so context remains visible where useful.

Must: give input-bearing sheets a clear Cancel action as well as a confirm action. A bare X can read as discard.

## 4. Navigation as data

Model destinations as serializable values.

```swift
enum Route: Hashable {
  case detail(id: String)
  case settings
  case composer(draftID: String?)
}

@State private var path: [Route] = []
```

Rules:

- Keep the route stack serializable where the framework supports it.
- Restore route, scroll position, and unsaved draft state after process death.
- Keep deep links reducible to the same route model.
- Let back, gesture, and deep link all produce the same destination.
- Do not store navigation authority only in view state.

## 5. Back behavior

- Back label should name the parent destination when the platform supports it.
- Back must not discard unsaved input silently.
- Gesture back and button back must have the same result.
- A deep link into a child should build a valid parent stack so back has meaning.
- Restore the previous scroll position on back.
- Do not clear tab state when navigating inside another tab.

Web mapping:

```js
addEventListener('popstate', () => {
  restoreScroll(history.state?.scrollY ?? 0);
});
```

Should: use the platform History or Navigation API rather than a custom stack when the platform already solves it.

## 6. Dialogs and popovers

```js
const dialog = document.querySelector('#compose-dialog');
dialog.showModal();
```

```html
<button popovertarget="menu" aria-haspopup="true">Menu</button>
<div id="menu" popover>
  <button type="button">Rename</button>
  <button type="button">Delete</button>
</div>
```

Rules:

- Native dialogs provide focus trapping and Escape handling; use them before custom overlays.
- Move focus into a dialog on open and restore it on close.
- Keep dismissal consistent: outside tap, Escape, or platform gesture where available.
- Do not make an action-sheet choice destructive by default.
- Do not use a popover for content requiring sustained reading.

## 7. Tabs and split views

Rules:

- Tabs are peers, not steps in a flow.
- Keep tab labels short and specific.
- Preserve each tab's navigation stack and scroll position.
- Badge counts must have a clear destination.
- Avoid more than five tabs on compact layouts.
- Use a split view for master-detail relationships on wide layouts.
- Collapse split view with a push or sheet on compact layouts.

## 8. Deep links and restoration

Must: validate path parameters before constructing a destination.

Must: provide a fallback destination for an unknown or expired route.

Should: encode enough context to rebuild the parent stack.

Should: persist draft state separately from route state.

Should: restore scroll after the destination view has layout.

Should: open external URLs through the platform's standard handler.

## 9. Anti-patterns

- gesture-only navigation with no visible affordance
- stacked modals
- modal confirmation for every low-risk action
- X-only dismissal on a form sheet
- tabs that represent steps in one workflow
- more than five tabs on compact layout
- back button that returns to a meaningless blank parent
- route state stored only in a transient closure
- deep link that skips required setup
- custom focus traps where the platform dialog exists

## 10. Review checks

- Is the presentation chosen from the relationship?
- Is there one clear return path?
- Can deep links rebuild a valid stack?
- Is tab state preserved?
- Is modality justified?
- Are input-bearing sheets explicit about cancel and save?
- Are focus and scroll restored?
- Is the route model serializable?

## 11. Applied HIG navigation refinements

Source labels name HIG topics and are routing hints, not copied text. Use the strength labels from `evidence-apple-style.md`.

- Must: use modality for a self-contained commitment or critical acknowledgment, not optional browsing. Source: `modality`. Audit: each modal has one clear commit or dismiss action; no modal wraps a reading task.
- Must: keep modal tasks short, named, and single-path. Source: `modality`. Audit: the modal title names the task; nested navigation does not create a second app inside the modal.
- Must: preserve parent state across a modal round-trip. Source: `modality`. Audit: scroll position, selection, and in-progress input survive open and close.
- Should: replace content inside one sheet instead of stacking modals. Source: `modality`, `sheets`. Audit: at most one modal layer; no nested dialog chains.
- Must: persist split-view selection and detail across collapse and expand. Source: `split-views`. Audit: resizing to a collapsed column keeps selection; re-expanding restores the detail pane.
- Must: use tabs for peer top-level destinations, never wizard steps or filters. Source: `tab-bars`. Audit: every tab maps to a section, not a stage or temporary state.
- Should: keep context menus for commands likely needed on the selected item now. Source: `context-menus`. Audit: items are short, relevant, and duplicated in a persistent interface surface.
- Must: restore the last task on cold launch: route, document, scroll, selection, and unsaved input. Source: `launching`. Audit: relaunch returns to the prior task without retracing steps.
- Should: use sidebars/navigation bars/toolbars in platform-idiomatic ways: sidebars for top-level structure on wide layouts, tab bars for compact peer navigation, toolbars for contextual actions. Source: `sidebars`, `tab-bars`, `toolbars`, `navigation-bars`. Audit: navigation model matches size class and platform; controls do not migrate into the wrong chrome.
- Must: make windows, panels, and multi-window behavior follow platform conventions; preserve window state and avoid losing unsaved work. Source: `windows`, `macos-windowing`, `multitasking`. Audit: close/reopen restores state; windowing commands behave natively on desktop/iPad.

## Related

- `layout-apple-style.md`
- `components-apple-style.md`
- `platform-adapters-apple-style.md`
- `state-and-feedback-apple-style.md`
- `perceived-performance-and-input-apple-style.md`
- `qa-apple-style.md`
