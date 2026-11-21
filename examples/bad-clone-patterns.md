<!-- apple-design-audit:ignore -->
# Bad Clone Patterns — Reject Examples

These examples are intentionally wrong. They show what fails and the correction.

## 1. Fake glass card

Bad:

```css
.glass-card {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  backdrop-filter: blur(40px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  border-radius: 18px;
}
```

Failures:

- gradient as identity
- heavy shadow
- random radius
- glass with no layer separation

Correct:

```css
.glass-card {
  background: var(--apple-color-surface);
  border: var(--apple-hairline);
  border-radius: var(--apple-radius-medium);
  box-shadow: var(--apple-shadow-small);
}
```

## 2. Carousel snap during drag

Bad:

```js
onPointerMove((x) => {
  carousel.style.transform = `translateX(${Math.round(x / width) * width}px)`;
});
```

Failures:

- snaps while finger is down
- ignores finger position
- ignores velocity

Correct:

```js
onPointerMove((x) => {
  carousel.style.transform = `translateX(${x}px)`;
});

onPointerUp(({ offset, velocity }) => {
  const projected = offset + velocity * 0.2;
  const page = Math.round(projected / width);
  springTo(page * width, { duration: 0.35, bounce: 0.15 });
});
```

## 3. Phantom carousel page

Bad:

```js
function next() {
  index += 1;
  render(index); // renders blank when index is past the end
}
```

Failures:

- advances past last item
- no edge resistance
- no spring return

Correct:

```js
function next() {
  if (index >= items.length - 1) {
    rubberBandAndReturn();
    return;
  }
  index += 1;
  springToPage(index);
}
```

## 4. Toggle without label

Bad:

```html
<button class="toggle"></button>
```

Failures:

- no accessible name
- no state
- no description

Correct:

```html
<button class="toggle" role="switch" aria-checked="true">
  <span class="sr-only">Wi-Fi, on</span>
</button>
```

## 5. Error with no recovery

Bad:

```text
Something went wrong.
```

Failures:

- names nothing
- offers no next step
- no action

Correct:

```text
The file could not be opened because it is damaged. Choose another file.
```

Action: "Choose File"

## 6. Stub interface

Bad:

```text
TODO: add settings
lorem ipsum dolor sit amet
[Continue button does nothing]
```

Failures:

- placeholder content
- dead control
- fake build

Correct:

- real section title
- real helper copy
- button performs an action or is disabled with a reason

## 7. All-caps mono eyebrow hero

Bad:

```html
<p class="eyebrow">PREMIUM EXPERIENCE</p>
<h1>Design that just works</h1>
<div class="cards">three identical cards</div>
```

Failures:

- generic AI landing page pattern
- no real hierarchy
- no task-first composition

Correct:

- start with the actual task
- use one clear title
- show the primary control or content, not decorative cards

## Rejection rule

Any bad pattern here blocks the build unless the ticket explicitly names it and the QA notes record why.
