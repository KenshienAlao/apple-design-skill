# Reference implementations

Concrete builds that show the Apple-style system in use. They are examples, not a component library.

## Files

| File | Shows |
|---|---|
| `tokens.css` | semantic light/dark token sheet |
| `profile-screen.css` | layout, rows, buttons, toggle, focus, Reduce Motion |
| `ProfileScreen.swift` | SwiftUI screen with nav stack, sheet, alert, haptics, grouped sections |
| `ProfileScreen.jsx` | React screen with standard controls and focus restoration |
| `InteractiveSheet.jsx` | drag-to-dismiss sheet with focus trap and Escape path |
| `interactive-sheet.css` | sheet material, radius, backdrop, responsive presentation |
| `CarouselRubberBand.jsx` | 1:1 drag, velocity commit, bounded edge rubber band, keyboard paging |
| `carousel-rubber-band.css` | carousel viewport, pages, dots, focus states |
| `ScrollStory.jsx` | reversible scroll-progress scene, center-line theme morph, reduced-motion branch |
| `scroll-story.css` | sticky chapter, sticky scene, generated shape, static reduced-motion state |
| `MediaHero.jsx` | lazy video load, timeout fallback, unload on end, reduced-motion still |
| `media-hero.css` | media hero layers, poster fallback, CTA, focus, reduced motion |

## React usage

Import the token sheet before component styles:

```jsx
import './tokens.css';
import './profile-screen.css';
import './interactive-sheet.css';
import './carousel-rubber-band.css';
import './scroll-story.css';
import './media-hero.css';
```

Render the profile screen:

```jsx
import ProfileScreen from './ProfileScreen.jsx';

export default function App() {
  return <ProfileScreen />;
}
```

Render the carousel:

```jsx
import CarouselRubberBand from './CarouselRubberBand.jsx';

const pages = [
  <article key="one">First page</article>,
  <article key="two">Second page</article>,
  <article key="three">Third page</article>
];

export function Gallery() {
  return <CarouselRubberBand pages={pages} label="Featured" />;
}
```

Render the scroll study and media hero:

```jsx
import ScrollStory from './ScrollStory.jsx';
import MediaHero from './MediaHero.jsx';

export function FlagshipStudy() {
  return (
    <>
      <MediaHero />
      <ScrollStory />
    </>
  );
}
```

`MediaHero` expects generated local files at `/media/generated-hero-still.webp` and `/media/generated-hero.mp4`. Replace those paths with your own licensed assets.

## SwiftUI usage

`ProfileScreen.swift` includes its own `@main` app entry point. In an existing app, remove the `@main` struct and present `ProfileScreen()` from your own root view.

## What to copy

- semantic token consumption, not raw values in components
- one accent tint
- 44pt targets
- focus visible and focus restored
- drag 1:1, commit on release
- one haptic at commit
- reduced-motion branch
- direct labels and specific error copy

## What not to copy

- the exact sample content
- the inert delete confirmation action
- any decorative gradient or extra shadow
- any custom control that duplicates a system control
- any captured product frame, logo, bezel, or third-party media
