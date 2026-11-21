# State and Feedback Logic

When each UI state fires and which surface carries it. Load this for loading, empty, error, disabled, optimistic, pagination, and validation behavior.

Platform names such as `ContentUnavailableView` are native examples, not requirements. Use the host platform equivalent.

## 1. Scope

This file owns:

- feedback selection by elapsed time
- loading, empty, error, disabled, and optimistic state logic
- pagination selection
- validation timing
- state copy rules

This file does not own:

- latency metrics; use `perceived-performance-and-input-apple-style.md`
- visual state styling; use `components-apple-style.md`
- motion for state changes; use `animations-apple-style.md`
- offline autosave language; use `qol-patterns-apple-style.md`

## 2. Feedback by elapsed time

| Elapsed time | Feedback | Rule |
|---|---|---|
| under 100 ms | no explicit indicator | Respond by completing the action. |
| 100 ms–1 s | subtle local cue | Use a pressed state, inline label, or slight progress hint. Avoid a spinner. |
| 1–10 s | spinner or skeleton | Keep layout stable and name the work. |
| over 10 s | determinate progress and cancel | Expose progress, remaining work, and an exit. |

Must: acknowledge input immediately.

Should: avoid showing a spinner for a fast action; it creates visual noise.

Must: keep the operation cancellable when it can run long.

## 3. Loading surfaces

| Surface | Use for | Avoid for |
|---|---|---|
| skeleton | known layout, list or card loading | unknown or highly variable layouts |
| spinner | short, local, indeterminate work | page-scale loading with known structure |
| progress bar | measurable, long work | unknown work with no milestones |
| progressive reveal | streaming content or media | actions that must complete atomically |
| inline pending label | small commits such as save | blocking navigation |

Rules:

- Skeletons must match the final content geometry.
- Do not animate a skeleton longer than needed to avoid a flash.
- Do not replace readable content with a skeleton after it has loaded.
- Keep the page structure stable while content loads.
- Give every progress indicator a text equivalent.

## 4. Empty states

Use three distinct empty states.

| Type | Meaning | Action |
|---|---|---|
| first-run | no content has been created | primary create action and short explanation |
| search-empty | filters produced no result | clear filters or broaden query |
| failure/offline | content should exist but cannot load | retry and status explanation |

```swift
ContentUnavailableView {
  Label("No Saved Items", systemImage: "bookmark")
} description: {
  Text("Saved items appear here.")
} actions: {
  Button("Browse Items") { openBrowse() }
}
```

Web equivalent:

```html
<section class="empty" aria-labelledby="empty-title">
  <h2 id="empty-title">No saved items</h2>
  <p>Saved items appear here.</p>
  <button type="button">Browse items</button>
</section>
```

Rules:

- Render empty states as an overlay or sibling that does not resize the scroll container.
- Keep the primary action in the empty state.
- Do not use the same copy for first-run, filtered, and failed states.
- Do not blame the user.

## 5. Error surfaces

| Error scope | Surface |
|---|---|
| one field or one inline action | inline message with `role="alert"` or native equivalent |
| page-level recoverable failure | banner or toast with retry |
| blocking, destructive, or security-sensitive failure | full-screen alert or `alertdialog` |

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" aria-describedby="email-error" aria-invalid="true">
  <p id="email-error" role="alert">Enter a valid email, for example you@example.com.</p>
</div>
```

Copy rules:

- Name what failed.
- Name the next action.
- Preserve entered input.
- Never say "You failed" or "Invalid user".
- Never expose raw stack traces or opaque codes as the only text.

## 6. Disabled versus hidden

Must: hide an action only when it is irrelevant in the current context.

Should: disable an action when it is relevant but unavailable.

Must: make a disabled control explain why it is disabled through adjacent text, tooltip, assistance help, or accessibility hint.

Must not: use disabled styling as a substitute for an explanation.

Should: keep high-value primary actions visible and disabled rather than silently removing them.

## 7. Optimistic updates

Use optimistic UI only when all are true:

- the action is low-risk
- the action is reversible
- the request is idempotent
- failure is empirically rare
- rollback can be shown clearly

```js
async function toggleSaved(button, id) {
  const previous = button.getAttribute('aria-pressed') === 'true';
  const next = !previous;

  button.setAttribute('aria-pressed', String(next));

  try {
    await api.setSaved(id, next);
  } catch {
    button.setAttribute('aria-pressed', String(previous));
    showToast('Could not save. Try again.', { action: 'Retry' });
  }
}
```

Rules:

- Apply locally, reconcile with the server, then confirm or roll back.
- Keep rollback visible and immediate.
- Preserve user input after failure.
- Do not optimistically mutate destructive or financial state.
- Do not fire duplicate mutations during retry.

## 8. Pagination and completeness

| Pattern | Use for |
|---|---|
| Load more | casual browsing with a clear end |
| infinite scroll | feeds where position is not critical and an explicit footer exists |
| numbered pages | search results, tables, and stable ordered data |
| cursor pagination | mutable datasets and APIs |
| virtualized list | long homogeneous datasets with stable row heights |

Rules:

- Show total or "at least" count when available.
- Keep a real footer after infinite scroll.
- Preserve scroll position after loading and after back navigation.
- Announce newly loaded content to assistive technology.
- Do not trap keyboard focus inside a virtualized window.
- Provide a skip path through long result sets.

## 9. Validation timing

| Validation | When |
|---|---|
| strength, counter, format hint | live during input |
| precise format check | on blur |
| presence and cross-field checks | on submit |
| screen-reader error announcements | on submit or explicit action, not every keystroke |

Rules:

- Do not mark untouched fields invalid.
- Do not remove the user's text after an error.
- Keep error messages adjacent to fields.
- Use one summary for multi-field submit failures.
- Move focus to the first invalid field or the error summary.
- Describe the fix, not the rule violation alone.

## 10. State copy table

| State | Good copy | Bad copy |
|---|---|---|
| saving | "Saving…" | "Please wait" |
| saved | "Saved" | "Success!" |
| failed | "Could not save. Try again." | "Error 500" |
| empty search | "No matches for that search." | "Nothing found" |
| offline | "Waiting for connection." | "Network error" |
| disabled | "Available after you add a photo." | "Unavailable" |

## 11. Review checks

- Is the feedback style correct for elapsed time?
- Are skeleton shapes structurally accurate?
- Are empty states distinct by cause?
- Are errors scoped to the smallest surface that can explain them?
- Is input preserved after failure?
- Are disabled controls explained?
- Is optimistic UI reversible and idempotent?
- Is validation timed to the check type?

## 12. Applied HIG pattern refinements

Source labels name HIG topics and are routing hints, not copied text. Use the strength labels from `evidence-apple-style.md`.

- Must: request notification permission at a moment of demonstrated value, not cold launch; keep a notification-settings surface available afterward. Source: `notifications`. Audit: no first-launch permission prompt; a contextual trigger and category settings exist.
- Should: keep each notification to one glanceable idea and route detail into the app. Source: `notifications`. Audit: title and body state who/what/why; tap opens the relevant destination; no private data in the banner.
- Should: coalesce repeated events from one source into a counted, expandable stack. Source: `notifications`. Audit: a burst becomes one row with a count and a way to inspect individuals.
- Must: expose per-category notification controls and time-based delivery instead of one global switch. Source: `managing-notifications`. Audit: settings show distinct categories and a quiet-hours or scheduled-delivery control.
- Must: reserve Time Sensitive interruption for information that matters now or within about an hour. Source: `managing-notifications`. Audit: no evergreen marketing or routine update uses Time Sensitive.
- Must: keep progress real, monotonic, and determinate as soon as a total is known. Source: `progress-indicators`, `loading`. Audit: value never decreases; no fake reverse animation; indeterminate progress switches on known total.
- Should: keep nonblocking work in an inline or toolbar status surface. Source: `progress-indicators`. Audit: long background sync is visible without taking over the page.
- Should: keep low-priority updates in a notification center instead of interrupting with a banner. Source: `notifications`. Audit: noncritical events persist in a list with no modal or banner.
- Must: keep Live Activities/widgets/complications timely, glanceable, and privacy-aware; end or remove stale status promptly. Source: `live-activities`, `widgets`, `complications`. Audit: status has clear end/update rules; no sensitive data on lock screen/glance surfaces by default; tap opens relevant destination.
- Should: make system-experience feedback respectful and optional where possible: haptics, sounds, badges, and live updates should match urgency and user settings. Source: `feedback`, `haptics`, `playing-audio`. Audit: nonessential sounds/haptics are suppressible; badges are accurate and clearable.

## Related

- `perceived-performance-and-input-apple-style.md`
- `components-apple-style.md`
- `qol-patterns-apple-style.md`
- `accessibility-apple-style.md`
- `animations-apple-style.md`
- `content-apple-style.md`
