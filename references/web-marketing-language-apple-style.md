# Web Marketing Language

The measured structure and copy posture of flagship product pages. Load this for marketing pages, launch pages, product reveals, and apple.com-class storytelling.

This file records observed page language and inferred cadence. Exact sizes are estimates; canonical tokens win on conflict.

## 1. Scope

This file owns:

- page section order
- hero and chapter structure
- CTA hierarchy and copy voice
- nav behavior on long pages
- dark and light cadence
- footer and comparison structure

This file does not own:

- visual tokens; use `tokens-apple-style.md`
- scene mechanics; use `scrollytelling-apple-style.md`
- media assets; use `media-assets-and-delivery-apple-style.md`
- front-end architecture; use `web-engineering-apple-style.md`

## 2. Core language

Flagship product pages usually follow these ideas:

- The product is the sole hero.
- One idea occupies one full-bleed section.
- Large type is short and confident.
- Whitespace signals confidence and premium positioning.
- Copy leads with benefit, not feature inventory.
- Motion supports the claim; it does not replace it.
- Most sections end with a small linked next step.

Must: keep one dominant message per section.

Must: keep the product visually dominant in the hero.

Should: use short benefit-led headlines with concrete support copy.

Should: let sections breathe before adding another visual device.

## 3. Page anatomy

Observed common order:

1. sticky translucent nav
2. compact product subnav when needed
3. product hero
4. bento or highlights grid
5. four to eight chapter sections
6. ecosystem section
7. cross-sell to related products
8. why-buy section
9. comparison table
10. specs or learn-more link
11. fat footer

Rules:

- Keep the nav fixed in role but transparent at the very top.
- Add frosted material only after scroll passes a small sentinel.
- Use the subnav for anchors inside one product story.
- Place the strongest proof early.
- Keep comparison and specs reachable from the footer and CTA band.
- Use a full footer with many grouped links; do not collapse it into a minimal app footer.

## 4. Nav behavior

Observed pattern: nav starts transparent over the hero, then gains frosted material on scroll.

```js
const sentinel = document.querySelector('#nav-sentinel');
const nav = document.querySelector('.site-nav');

const io = new IntersectionObserver(([entry]) => {
  nav.classList.toggle('is-solid', !entry.isIntersecting);
}, { threshold: 0 });

io.observe(sentinel);
```

```css
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
}

.site-nav.is-solid {
  background: var(--nav-frost);
  backdrop-filter: blur(18px) saturate(160%);
}

@media (prefers-reduced-motion: reduce) {
  .site-nav { transition: none; }
}
```

Rules:

- Use a sentinel or a small scroll threshold, not a per-frame layout read.
- Store nav colors as tokens.
- Test labels against the hero background before the nav becomes solid.
- Do not let the nav become washed out over a bright hero.
- Dark-hero pages should swap nav tokens with the hero section.
- Keep the nav links visible in both light and dark chapters.

## 5. Light and dark cadence

Observed marketing pages often use a repeated light-gray, gray, light, black, light, gray, footer cadence. Treat that as an observed rhythm, not a law.

Rules:

- Use light as the default posture for most product stories.
- Use dark chapters for contrast, demos, or performance moments.
- Use one bright moment inside a dark sequence.
- Do not alternate themes randomly.
- Theme changes must align with section meaning.
- Nav and CTA contrast must be checked for every theme.

Estimated public-page values such as 44px nav height, 12px nav type, 96–1068px content widths, 120–160px section padding, and 64–96px headlines are `[observed estimate YYYY-MM-DD]`. Use project tokens and fluid type instead of copying them.

## 6. CTA hierarchy

Primary action:

- short verb phrase
- pill or compact button
- high contrast
- one per viewport where possible

Secondary action:

- inline link style
- "Learn more" with a chevron
- lowercase or sentence case according to the product voice

Rules:

- Never give two equal primary CTAs in one section.
- Use the same primary action label throughout a page when it means the same thing.
- Put price and buy action near the product decision, not in every chapter.
- Do not use "Click here".
- Do not use " Revolutionary " when a concrete claim will land harder.

## 7. Copy voice

Use:

- "Built for the way you work."
- "More room for what matters."
- "All-day battery. Now with faster charging."
- "Learn more"
- "Buy"

Avoid:

- "Cutting-edge solution"
- "Unlock your potential"
- "Seamless synergy"
- "Game-changing innovation"
- exclamation-heavy launch copy

Rules:

- Lead with the outcome.
- Follow with one proof point.
- Keep nouns concrete.
- Prefer one idea per sentence.
- Let whitespace carry emphasis.

## 8. Bento and chapter sections

Bento blocks:

- vary scale by importance
- use consistent radius and spacing from tokens
- keep one idea per tile
- do not make every tile the same size

Chapters:

- give each chapter a single claim
- pair copy with one dominant visual
- use scroll-bound motion only when the chapter needs it
- resolve to a clear end state
- include a small next step where relevant

## 9. Footer and comparison

Footer rules:

- group links by intent
- include product, support, account, legal, and company groups
- keep text hierarchy tight
- keep link targets real
- keep the footer readable after a long dark sequence

Comparison rules:

- compare like with like
- use a stable table structure
- mark recommended or current model clearly
- keep key numbers visible without horizontal scroll on compact screens where possible
- link to full specs

## 10. Failure table

| Failure | Fix |
|---|---|
| Product hidden by effects | reduce scene intensity and restore hero dominance |
| Each section says the same thing | enforce one idea per section |
| Nav unreadable over hero | token swap by section |
| Theme flips feel random | align cadence with meaning |
| Two equal CTAs | choose one primary and one link |
| Generic launch copy | replace with concrete benefit and proof |
| No end-state after scroll story | resolve scene and add next step |

## 11. Review checks

- Is the product the hero?
- Does each section carry one idea?
- Does the page follow a coherent anatomy?
- Is nav contrast correct in every chapter?
- Is dark used deliberately?
- Is there one primary CTA per viewport?
- Are exact values tokenized rather than copied?
- Are media assets generated or licensed?

## Related

- `restraint-and-antislop-apple-style.md`
- `web-engineering-apple-style.md`
- `media-assets-and-delivery-apple-style.md`
- `scrollytelling-apple-style.md`
- `design-apple-style.md`
- `content-apple-style.md`
