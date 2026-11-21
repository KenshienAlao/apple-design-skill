# Good Apple-Style Example — Settings Profile Screen

Compact-width profile detail screen with standard controls, semantic tokens, and restrained motion.

## Layout

- Safe area respected on all sides.
- Large title "Profile" at top.
- Grouped form surface with 16pt side margin.
- Reading width capped at 720px on wide displays.
- Bottom sheet for editing display name.

## Structure

```html
<main class="apple-screen">
  <header class="apple-nav">
    <h1 class="apple-large-title">Profile</h1>
  </header>

  <section class="apple-group" aria-labelledby="account-heading">
    <h2 id="account-heading" class="apple-section-title">Account</h2>

    <div class="apple-row">
      <div class="apple-row-text">
        <span class="apple-headline">Display Name</span>
        <span class="apple-subheadline">Nathan</span>
      </div>
      <button class="apple-button apple-button--plain">Edit</button>
    </div>

    <div class="apple-row">
      <div class="apple-row-text">
        <span class="apple-headline">Two-Factor Authentication</span>
        <span class="apple-subheadline">Added extra security to your account.</span>
      </div>
      <button class="apple-toggle" role="switch" aria-checked="true">
        <span class="sr-only">Two-Factor Authentication, on</span>
      </button>
    </div>
  </section>

  <section class="apple-group" aria-labelledby="danger-heading">
    <h2 id="danger-heading" class="apple-section-title">Danger Zone</h2>
    <button class="apple-button apple-button--destructive">Delete Account</button>
  </section>
</main>
```

## Style

```css
.apple-screen {
  padding: max(var(--apple-space-5), env(safe-area-inset-top))
           max(var(--apple-space-5), env(safe-area-inset-right))
           max(var(--apple-space-8), env(safe-area-inset-bottom))
           max(var(--apple-space-5), env(safe-area-inset-left));
  background: var(--apple-color-bg);
  color: var(--apple-color-label);
  font-family: var(--apple-font-text);
}

.apple-large-title {
  font: var(--apple-type-large-title-weight)
        var(--apple-type-large-title-size)/
        var(--apple-type-large-title-line)
        var(--apple-font-display);
}

.apple-group {
  margin-block-start: var(--apple-space-7);
  background: var(--apple-color-surface);
  border-radius: var(--apple-radius-medium);
}

.apple-row {
  min-height: 56px;
  padding: var(--apple-space-4) var(--apple-space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--apple-space-4);
  border-bottom: var(--apple-hairline);
}

.apple-row:last-child {
  border-bottom: 0;
}

.apple-headline {
  font-size: var(--apple-type-headline-size);
  line-height: var(--apple-type-headline-line);
  font-weight: var(--apple-type-headline-weight);
}

.apple-subheadline {
  display: block;
  color: var(--apple-color-label-2);
  font-size: var(--apple-type-subheadline-size);
  line-height: var(--apple-type-subheadline-line);
}

.apple-button {
  min-height: var(--apple-target-min);
  padding-inline: var(--apple-space-5);
  border-radius: var(--apple-radius-control);
  transition: background-color var(--apple-duration-fast) var(--apple-ease-standard);
}

.apple-button:focus-visible {
  outline: 2px solid var(--apple-color-tint);
  outline-offset: 2px;
}

.apple-button--destructive {
  color: var(--apple-color-red);
}

.apple-toggle {
  width: 51px;
  height: 31px;
  border-radius: var(--apple-radius-pill);
  background: var(--apple-color-tint);
}
```

## Motion

- Toggle knob follows finger during drag.
- Toggle commit: spring 300ms, bounce 0.12.
- Edit sheet present: spring 500ms, bounce 0.08.
- Reduce Motion: opacity fade only, 150ms.
- Haptic fires once on toggle commit.

## Copy

- Title: "Profile".
- Section: "Account".
- Row: "Display Name" with value "Nathan".
- Destructive action: "Delete Account".
- Confirmation: "Delete Account?" / "This removes your account and all associated data. This action cannot be undone."

## Why it works

- Standard controls: rows, buttons, switch, sheet.
- One accent: tint.
- Semantic tokens in both themes.
- 44pt targets.
- No decorative gradients, heavy shadows, or random radii.
- Motion follows state change.
- Copy is direct and specific.
