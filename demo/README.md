# Lumen demo site

A complete flagship web page built with this skill alone. Lumen is fictional. All illustrations are generated SVG files in `media/`; no Apple-owned media, logos, screenshots, or fonts are used.

Open `index.html` directly or serve the folder with any static server.

## Applied references

- `../SKILL.md` for task routing and the build workflow
- `../references/restraint-and-antislop-apple-style.md` for restraint and deference
- `../references/web-marketing-language-apple-style.md` for section order and calm copy
- `../references/web-engineering-apple-style.md` for progressive enhancement
- `../references/design-apple-style.md` for visual direction
- `../references/tokens-apple-style.md` for token names and contrast targets
- `../references/media-assets-and-delivery-apple-style.md` for generated media
- `../references/scroll-motion-apple-style.md` and `../references/scrollytelling-apple-style.md` for the damped progress scene
- `../references/state-and-feedback-apple-style.md` and `../references/accessibility-apple-style.md` for states and the keyboard path

## Verification

```bash
node ../scripts/a11y-audit.mjs . --strict --platform=web
node ../scripts/code-audit.mjs . --strict
node ../scripts/audit.mjs . --strict --platform=web
node ../scripts/token-lint.mjs . --strict
```

All four checks pass with zero findings. The site keeps a readable no-script end state, honors `prefers-reduced-motion`, uses native controls, and reads color, type, spacing, radius, duration, target, and hairline values from the skill's token sheet.
