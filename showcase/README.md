# apple-design showcase

A single-page, dependency-light front door for the [apple-design skill](../SKILL.md). It is built with vanilla Vite and uses the skill's own generated tokens and verification scripts.

The page follows the skill's flagship web language: one product story, a light/dark chapter cadence, working specimens, and commands that were actually run against this source tree.

## Run locally

```sh
npm install
npm run tokens
npm run dev
```

Build the relative-path production output:

```sh
npm run build
```

The output goes to `dist/`. Both `dist/` and `node_modules/` are ignored by [showcase/.gitignore](./.gitignore).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Vite server. |
| `npm run tokens` | Regenerate `src/tokens.css` and `src/appearance.css` from [tokens-apple-style.md](../references/tokens-apple-style.md). |
| `npm run build` | Produce the production site in `dist/`. |
| `npm run verify` | Run the showcase's link, audit, token, contrast, accessibility, code, motion, and HIG coverage checks. |
| `npm run verify:record` | Re-run all checks and rewrite `public/verification.log` and `src/verification.json`. |
| `npm --prefix .. run verify` | Run the repository's full verification gate from the skill root. |

## Source map

- [index.html](./index.html) — semantic page structure and all three specimens.
- [src/style.css](./src/style.css) — component styles; consumes `var(--apple-*)` tokens only.
- [src/main.js](./src/main.js) — copy actions, navigation, platform switching, scoped appearance, validation, router selection, and verification readout.
- [src/tokens.css](./src/tokens.css) — generated light and dark token sheets.
- [src/appearance.css](./src/appearance.css) — generated scoped token copy for the specimen's appearance switch.
- [src/verification.json](./src/verification.json) — generated summary shown in Specimen C.
- [public/verification.log](./public/verification.log) — generated raw command output.
- [scripts/generate-tokens.mjs](./scripts/generate-tokens.mjs) — wrapper around the skill's token generator.
- [scripts/record-verification.mjs](./scripts/record-verification.mjs) — reproducibility recorder for Specimen C.
- [vite.config.js](./vite.config.js) — relative `base` so the built site can be hosted from any path.
- [404.html](./404.html) — static fallback page.

## What is verifiable here

- The install prompt is copied verbatim from the approved content.
- Token sheets are regenerated from the skill's markdown source, not hand-maintained.
- Specimen A uses real hover, focus, disabled, error, and success states. Platform switching changes framework names and anatomy, not token values.
- Specimen B lists representative task reference sets, including the 173-page HIG mapping when platform contracts matter.
- Specimen C reports actual exit codes and finding counts from [audit.mjs](../scripts/audit.mjs), [token-lint.mjs](../scripts/token-lint.mjs), [check-contrast.mjs](../scripts/check-contrast.mjs), [a11y-audit.mjs](../scripts/a11y-audit.mjs), [code-audit.mjs](../scripts/code-audit.mjs), [motion-audit.mjs](../scripts/motion-audit.mjs), and [hig-coverage-check.mjs](../scripts/hig-coverage-check.mjs).

## Deliberate limits

- This is a static site with no backend, database, analytics, or telemetry.
- Icons and the hero diagram are self-owned inline SVG. No Apple-owned media is bundled.
- No public URL is configured, so canonical and OG URL metadata are omitted.
- The skill's static audits do not replace a screen reader session, real-device testing, or browser-based axe and visual diff checks. Those remain separate opt-in tools in the skill repository.
- The clipboard path prefers the asynchronous Clipboard API and falls back to a hidden textarea where that API is unavailable.
