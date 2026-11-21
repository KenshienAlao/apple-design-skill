# Apple-Style Design — Visual Foundation

HIG-inspired visual system. Not official Apple guidance and not an Apple-branded clone. Load this file for visual decisions. For motion, load `animations-apple-style.md`.

## 1. Scope

This file owns:

- principles
- typography
- spacing
- color
- radius
- materials
- elevation
- iconography
- visual anti-patterns

This file does not own:

- motion timing; use `animations-apple-style.md`
- token names; use `tokens-apple-style.md`
- component anatomy; use `components-apple-style.md`
- responsive structure; use `layout-apple-style.md`

## 2. Principles

1. **Clarity.** Text, controls, and state are legible at a glance.
2. **Deference.** Content leads. Chrome recedes.
3. **Depth.** Hierarchy comes from layering, spacing, and material, not decoration.
4. **Constraint.** Fewer sizes, fewer weights, fewer colors. Consistency beats novelty.
5. **Familiarity.** Use standard controls until the system vocabulary cannot express the job.

## 3. Typography

Use SF Pro where available.

```css
--apple-font-text: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--apple-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Reference mapping: 1pt = 1px at CSS baseline.

| Role | Size | Line height | Weight | Use |
|---|---:|---:|---:|---|
| Large Title | 34 | 41 | 400 | Top-level screen title |
| Title 1 | 28 | 34 | 400 | Primary section title |
| Title 2 | 22 | 28 | 400 | Secondary section title |
| Title 3 | 20 | 25 | 400 | Card or group title |
| Headline | 17 | 22 | 600 | Emphasized row label |
| Body | 17 | 22 | 400 | Default reading text |
| Callout | 16 | 21 | 400 | Dense body copy |
| Subheadline | 15 | 20 | 400 | Supporting copy |
| Footnote | 13 | 18 | 400 | Metadata |
| Caption 1 | 12 | 16 | 400 | Captions |
| Caption 2 | 11 | 13 | 400 | Fine print, rarely used |

Rules:

- Use no more than three weights per screen: 400, 600, 700.
- Dynamic Type is mandatory. Every text role scales.
- Never fake hierarchy with random font sizes.
- Use sentence case for prose. Use title case for navigation titles and button labels.
- Use tabular numerals for data tables and counters.

## 4. Spacing

Base grid: 8pt. Fine grid: 4pt.

| Token | Value |
|---|---:|
| space-1 | 2 |
| space-2 | 4 |
| space-3 | 8 |
| space-4 | 12 |
| space-5 | 16 |
| space-6 | 20 |
| space-7 | 24 |
| space-8 | 32 |
| space-9 | 40 |
| space-10 | 48 |
| space-11 | 64 |

Layout margins:

- Compact: 16pt.
- Regular: 20pt.
- Wide: 24–32pt.
- Gutters: 8, 12, 16, 20pt.
- Row height minimum: 44pt.
- Group spacing: 24–32pt.
- Section spacing: 40–64pt.

Rules:

- Align to the 8pt grid unless a hairline or optical adjustment needs 4pt.
- Use spacing to create hierarchy before borders or shadows.
- Keep internal padding consistent within a component family.

## 5. Radius

| Token | Value | Use |
|---|---:|---|
| radius-control | 8 | Buttons, fields, small controls |
| radius-small | 10 | Tags, small cards |
| radius-medium | 14 | Cards, grouped surfaces |
| radius-large | 20 | Large cards, popovers |
| radius-sheet | 28 | Sheets, bottom panels |
| radius-pill | 999 | Pills, avatars, capsule controls |

Rules:

- Radius is assigned by component class, not by taste.
- Nested radii should step down, not randomly jump.
- Outer radius 20, inner radius 12 or 14.
- Full-pill only for status chips, avatars, and segmented selection.

## 6. Color

Use semantic pairs. Components consume semantic tokens, never raw hex.

### Light

| Semantic | Value |
|---|---|
| background | #FFFFFF |
| surface | #F2F2F7 |
| surface-2 | #FFFFFF |
| label | #000000 |
| label-2 | #3C3C43 99% |
| label-3 | #3C3C43 60% |
| separator | #3C3C43 29% |
| fill | #787880 1C% |
| fill-2 | #787880 33% |
| tint | #007AFF |
| green | #34C759 |
| orange | #FF9500 |
| red | #FF3B30 |

### Dark

| Semantic | Value |
|---|---|
| background | #000000 |
| surface | #1C1C1E |
| surface-2 | #2C2C2E |
| label | #FFFFFF |
| label-2 | #EBEBF5 60% |
| label-3 | #EBEBF5 30% |
| separator | #545458 65% |
| fill | #787880 36% |
| fill-2 | #787880 5C% |
| tint | #0A84FF |
| green | #30D158 |
| orange | #FF9F0A |
| red | #FF453A |

Rules:

- One accent tint per screen.
- Status colors carry meaning, not decoration.
- Text contrast: 4.5:1 minimum for essential body text, 3:1 minimum for large text and secondary support text.
- Tertiary metadata and decorative marks may use 1.7:1 only when non-essential and paired with full label text elsewhere.
- Dark Mode is a semantic re-render, not an inverted palette.
- Separators are hairlines: 1px on web, 0.5pt on iOS where possible.

## 7. Materials

Use materials to separate layers while preserving legibility.

| Material | Web approximation | Use |
|---|---|---|
| ultraThin | blur 20px, saturate 180%, low alpha | Chrome over content |
| thin | blur 20px, saturate 180% | Toolbars |
| regular | blur 30px, saturate 180% | Nav bars, sidebars |
| thick | blur 50px, saturate 180% | Heavy overlays |
| solid | no blur | Default surfaces |

Base web recipe:

```css
background: color-mix(in srgb, var(--apple-color-fill) 80%, transparent);
backdrop-filter: saturate(180%) blur(20px);
-webkit-backdrop-filter: saturate(180%) blur(20px);
```

Rules:

- Material strength increases with overlap.
- Never stack more than two translucent layers.
- Text on glass must meet contrast targets.
- If `backdrop-filter` is unavailable, fall back to solid surface.

## 8. Elevation

Elevation is sparse.

| Level | Shadow | Use |
|---|---|---|
| none | none | Flat content |
| small | 0 1px 3px rgb(0 0 0 / 8%) | Cards, menus |
| medium | 0 8px 24px rgb(0 0 0 / 12%) | Popovers |
| large | 0 20px 60px rgb(0 0 0 / 18%) | Sheets, modals |

Rules:

- Prefer border + material before shadow.
- Never use glow, neon, or colored shadow as depth.
- Shadows do not replace focus rings.
- One elevated layer per interaction context.

## 9. Iconography

Prefer SF Symbols on Apple platforms. On web, use a single consistent icon set.

Rules:

- Match optical weight to adjacent text weight.
- Align icons to text baseline, not bounding box center.
- Keep symbols/icons consistent in rendering mode, weight, and optical alignment.
- Icon-only controls require accessible names.
- Avoid emoji as UI icons.
- Use 16, 20, 24, 28pt sizes.
- Prefer vector/custom symbol formats that scale cleanly; provide text alternatives for meaningful icons.

## 9a. App icons, branding, and images

Rules:

- Branding defers to content. Do not add decorative logos or splash screens as branding opportunities.
- App icons follow platform-specific icon guidance; test at small sizes and in light/dark/tinted appearances where relevant.
- Use images/media to clarify or enrich content, not to decorate or replace clear UI. Provide alt text for meaningful images.
- Avoid embedding essential text in images; if unavoidable, provide the same text accessibly.
- Support high-quality/resolution-appropriate assets and test on real devices/displays.

## 10. Decision table

| Situation | Use |
|---|---|
| Need hierarchy on a quiet screen | Spacing + type role |
| Need hierarchy over scrolling content | Material + hairline |
| Need a floating panel | Medium shadow + radius-large |
| Need a bottom modal | radius-sheet + large shadow |
| Need status | Semantic color + label |
| Need emphasis | Headline weight, not new color |
| Need density | Callout/Subheadline, not smaller touch targets |

## 11. Do / Don't

Do:

- Use standard controls.
- Use semantic tokens.
- Use one accent.
- Use readable line lengths: 60–75 characters for body text.
- Use hairlines and spacing before shadows.

Don't:

- Copy the glass without the hierarchy.
- Use random radii.
- Use purple gradients as a default.
- Use heavy shadows on flat cards.
- Use more than one typeface family.
- Let decoration compete with content.

## 12. QA checklist

- Type scale uses defined roles only.
- Dynamic Type works at 200%.
- Spacing aligns to 4/8 grid.
- Radius values come from the scale.
- Semantic colors used in both light and dark.
- One accent tint per screen.
- Materials preserve contrast.
- Icons match weight and baseline.
- No emoji UI icons.
- No decorative gradient backgrounds.

## 13. Universal foundation and craft critique

These visual roles are a craft baseline, not platform-exclusive chrome. They translate into each platform's native tokens:

- semantic colors map to `tint`/Material `primary`, `label`/`on-surface`, `surface`/`surface`.
- the 8pt grid maps to Android's 8dp grid and web spacing scale.
- type roles map to platform text styles; the numbers are defaults, not official constants.
- radius, elevation, and material strengths are implementation defaults tuned for legibility.

A craft critique asks three questions before approving a screen:

1. Does one signature idea read, and is it derived from real content?
2. Is hierarchy carried by spacing and type before borders, shadows, or color?
3. Does the screen look native to its target platform, not like a shared mockup?

If any answer is no, revise before shipping. See `heritage-apple-style.md` for reasoning and `review-workflow-apple-style.md` for the full five-lens review.

## Related

- `heritage-apple-style.md`
- `restraint-and-antislop-apple-style.md`
- `web-marketing-language-apple-style.md`
- `review-workflow-apple-style.md`
- `platform-adapters-apple-style.md`
- `animations-apple-style.md`
- `tokens-apple-style.md`
- `components-apple-style.md`
- `layout-apple-style.md`
- `accessibility-apple-style.md`
- `haptics-and-sound-apple-style.md`
- `qol-patterns-apple-style.md`
- `platform-adapters-apple-style.md`
- `anti-patterns-apple-style.md`
- `qa-apple-style.md`
