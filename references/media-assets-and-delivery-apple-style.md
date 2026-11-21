# Media Assets and Delivery

Media pipeline rules for flagship web hero media: video scrub, image sequences, interactive viewers, responsive delivery, and asset ownership. Load this for media-heavy pages, not for ordinary product UI.

Observed delivery patterns are dated snapshots. Browser capabilities and CDN details change; verify before treating them as current.

## 1. Scope

This file owns:

- media choice decision tree
- hero video lifecycle
- image-sequence decode and memory budget
- interactive viewer strategy
- responsive delivery and caching notes
- encoding defaults
- performance budgets
- asset ownership guardrail

This file does not own:

- scene choreography; use `scrollytelling-apple-style.md`
- scroll mapping; use `scroll-motion-apple-style.md`
- general web loading; use `web-engineering-apple-style.md`
- perceived-performance thresholds; use `perceived-performance-and-input-apple-style.md`

## 2. Asset guardrail

Must: ship only generated, self-owned, or permissively licensed media.

Must not: bundle Apple logos, device bezels, product photography, screenshots, captured CSS, captured video frames, or trademarked frames from a reference page.

Must not: treat a vendored research snapshot as permission to redistribute its media. The vendored family ships skill docs, not Apple-owned frames.

Should: use abstract generated product stills, diagrams, or motion studies for reference implementations.

May: link to an external reference instead of copying it.

This guardrail is a house rule and is independent of the license on any skill document.

## 3. Decision tree

Use the lightest medium that preserves the idea.

| Need | Use | Avoid |
|---|---|---|
| single still product moment | responsive still image | video preview that never plays |
| looping ambient hero | muted inline video with static fallback | animated GIF |
| scrubbed product rotation | short keyframe-dense video | full HLS stream |
| complex frame-accurate reveal | canvas image sequence | unbounded decoded frame array |
| interactive angle or configuration | WebGL viewer with static fallback | loading many full-size stills |
| low-bandwidth or reduced-motion path | static poster | hidden media that never loads |

House order: video scrub → WebGL viewer → canvas flipbook → CSS scroll binding → static poster.

## 4. Hero video lifecycle

Observed flagship pages in 2025–2026 favor video-first heroes over older canvas flipbooks.

```html
<video
  id="hero-video"
  muted
  playsinline
  preload="none"
  role="img"
  aria-label="Generated abstract product still"
  poster="/media/generated-hero-still.webp"
></video>

<img
  class="hero-still"
  src="/media/generated-hero-still.webp"
  width="1920"
  height="1080"
  alt="Generated abstract product still"
>
```

```js
const video = document.querySelector('#hero-video');
const hero = document.querySelector('.hero');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const showStill = () => hero.classList.add('show-still');

if (reduce) {
  showStill();
} else {
  const loadObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || video.src) return;
    video.src = '/media/generated-hero.mp4';
    loadObserver.disconnect();
  }, { rootMargin: '100vh 0px' });

  loadObserver.observe(video);

  const loadTimeout = setTimeout(showStill, 3000);

  video.addEventListener('loadeddata', () => {
    clearTimeout(loadTimeout);
    video.play().catch(showStill);
  });

  video.addEventListener('error', showStill);

  video.addEventListener('ended', () => {
    showStill();
    video.removeAttribute('src');
    video.load();
  });
}
```

Rules:

- Set `preload="none"` for below-fold or scroll-triggered video.
- Inject `src` from an observer or an explicit user action.
- Keep a static start/end frame.
- Unload decoded media when the sequence ends.
- Use a load timeout that reveals the still.
- Do not autoplay audio.
- Under reduced motion, keep the still and never load the video.
- Give video an accessible name or treat it as decorative with an empty alternative.

Observed upstream component names such as InlineMedia, `AnimLoad`, `AnimPlay`, and `UnloadVideo` describe a snapshot, not a required framework.

## 5. Image sequence decode

A canvas flipbook is memory-heavy. Decode off the main thread and keep only a sliding window.

```js
// worker.js
self.onmessage = async ({ data }) => {
  const response = await fetch(data.url);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  self.postMessage({ index: data.index, bitmap }, [bitmap]);
};
```

```js
const BEHIND = 3;
const AHEAD = 8; // keep 12-15 total

function prune(frames, current) {
  for (const [index, bitmap] of frames) {
    if (index < current - BEHIND || index > current + AHEAD) {
      bitmap.close();
      frames.delete(index);
    }
  }
}
```

Rules:

- Use `createImageBitmap(blob)`, not an image element, inside the Worker.
- Transfer bitmaps with the transfer list.
- Call `bitmap.close()` when a frame leaves the window.
- Cap the total window at 12–15 decoded frames.
- Draw with transform and a preallocated canvas.
- Keep a static poster fallback.
- Skip the sequence entirely on reduced motion or constrained devices.

Derived memory example: a 1920×1080 RGBA frame is about 8.3 MB decoded. 148 frames is roughly 1.2 GB before overhead. This is a calculation with stated assumptions, not a browser measurement.

## 6. Interactive viewer

May: use a WebGL viewer when the product requires real angle or configuration changes.

Rules:

- Load the viewer only when its container approaches the viewport.
- Ship a static poster for no-script, low-power, and reduced-motion paths.
- Use compressed GPU textures where supported, with AVIF or WebP fallback.
- Keep an explicit exit or reset control.
- Do not use a heavy 3D engine for a single static rotation.
- Do not bundle third-party model files without clear licensing.

Observed upstream viewer internals, including custom engine names and scene formats, are dated reverse-engineering notes. They belong in vendored research, not core requirements.

## 7. Responsive delivery

Observed flagship URLs are content-hash fingerprinted and segmented by breakpoint. Treat exact path shapes as `[observed YYYY-MM-DD]`.

Rules:

- Use `<picture>` and `srcset` for art direction and density.
- Add explicit `width` and `height` to images.
- Use `fetchpriority="high"` only for the LCP image.
- Use `loading="lazy"` below the fold, never on the hero.
- Preconnect only to origins actually used.
- Preload only the one asset that blocks the first paint.
- Use immutable caching for fingerprinted assets.
- Confirm byte-range support when scrubbing video.
- Test Safari, Firefox, and Chromium separately for frame stepping.

Observed breakpoint buckets were roughly below 481, below 735, below 1068, below 1441, and 1441 or wider. Use the project's own layout breakpoints instead of copying these numbers.

## 8. Encoding defaults

```bash
ffmpeg -i source.mp4 \
  -x264-params keyint=5:scenecut=0 \
  -crf 18 \
  -vf scale=1280:-2 \
  hero-scrub.mp4
```

```bash
ffmpeg -i source.mp4 \
  -g 5 \
  -crf 18 \
  -vf scale=1280:-2 \
  hero-scrub.webm
```

Rules:

- Use dense keyframes for scrubbed video.
- Keep a WebM alternative when the budget allows.
- Do not use HLS for frame-accurate scroll scrubbing.
- Re-test browser frame-stepping behavior before release.
- Keep a poster frame for every video.
- Prefer AVIF or WebP for stills with JPEG fallback where needed.

The exact keyframe interval is a dated observed pattern, not a platform requirement.

## 9. Budgets

| Metric | Target |
|---|---|
| image sequence transfer | under 2 MB |
| short hero MP4 | under 400 KB where feasible |
| LCP | under 2.5 s |
| first meaningful media frame | under 1.0 s |
| INP | under 200 ms |
| decoded flipbook window | 12–15 frames |
| simultaneous animated media layers | 6–8 |

Budgets are house targets. Measure on mid-tier hardware and a throttled connection.

## 10. Failure table

| Failure | Cause | Fix |
|---|---|---|
| Hero shows blank box | lazy `src` never injected | observer plus timeout fallback |
| Page stalls on decode | main-thread bitmap decode | Worker plus transfer list |
| Memory climbs | frames never closed | `bitmap.close()` on prune |
| Scrub skips frames | sparse keyframes | dense GOP, test per browser |
| LCP regresses | high-priority lazy hero | eager high-priority poster |
| Reduced motion still plays | media loaded unconditionally | gate before src injection |
| IP problem | copied reference media | generated or licensed assets only |

## 11. Review checks

- Is every asset generated, self-owned, or licensed?
- Does each video have a static fallback?
- Is reduced motion checked before media load?
- Is media unloaded when finished?
- Are frames decoded in a Worker and closed?
- Are image dimensions explicit?
- Is only the LCP asset high priority?
- Are CDN and browser details labeled as dated observations?

## Related

- `scrollytelling-apple-style.md`
- `scroll-motion-apple-style.md`
- `perceived-performance-and-input-apple-style.md`
- `web-engineering-apple-style.md`
- `evidence-apple-style.md`
- `upstream-sources-apple-style.md`
