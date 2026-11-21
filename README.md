# apple-design

A portable, progressive-disclosure skill for building and auditing Apple-inspired UI on any platform.

Apple is the craft lens. The host platform is the execution target. iOS, Android, web, macOS, Windows, Linux, watchOS, visionOS, Flutter, React Native, Compose, SwiftUI, Tauri, and Electron all ship through the same rules with native vocabulary.

This is design guidance. It is not official Apple material and does not use Apple branding. Core docs are provider-neutral and dependency-free.

## What it covers

- visual foundation, type, color, spacing, radius, materials, elevation, icons
- motion, spring timing, carousel physics, rubber band behavior, Reduce Motion
- haptics and sound feedback
- quality-of-life patterns: autosave, undo, focus restoration, shortcuts, recovery
- design tokens and token generation for CSS, JSON, Swift, Tailwind, Compose, and Android XML
- component anatomy and states across mobile, web, and desktop
- responsive layout, safe areas, size classes, window size classes
- universal platform adapters and framework vocabulary
- macOS windowing, toolbar, sidebar, inspector, and menu bar rules
- accessibility with cross-platform naming APIs and target sizes
- Apple HIG topic mapping, Apple platform playbooks, native SwiftUI/UIKit recipes, component/API fidelity map
- scored Apple craft rubric with hard caps and `path:line` findings
- content rules, anti-patterns, restraint discipline, deference-as-withholding, craft critique, and evidence discipline
- five-lens design review workflow and design-review report format
- scroll-bound motion, scrollytelling scenes, media delivery, and flagship web page language
- perceived performance, input handling, state/feedback logic, and navigation models
- SSR-first web engineering, progressive enhancement, and versioned component ownership
- vendored upstream research with provenance and strict claim labeling
- static audits, contrast checks, token lint, motion probe, link check, code audit, optional rendered a11y probe, optional visual diff

## Structure

```text
design/
├── SKILL.md
├── README.md
├── THIRD_PARTY.md
├── package.json
├── .gitignore
├── .gitattributes
├── .github/
│   └── workflows/
│       └── verify.yml
├── references/
│   ├── design-apple-style.md
│   ├── animations-apple-style.md
│   ├── tokens-apple-style.md
│   ├── components-apple-style.md
│   ├── layout-apple-style.md
│   ├── accessibility-apple-style.md
│   ├── content-apple-style.md
│   ├── haptics-and-sound-apple-style.md
│   ├── qol-patterns-apple-style.md
│   ├── platform-adapters-apple-style.md
│   ├── macos-windowing-apple-style.md
│   ├── anti-patterns-apple-style.md
│   ├── restraint-and-antislop-apple-style.md
│   ├── scroll-motion-apple-style.md
│   ├── scrollytelling-apple-style.md
│   ├── media-assets-and-delivery-apple-style.md
│   ├── perceived-performance-and-input-apple-style.md
│   ├── state-and-feedback-apple-style.md
│   ├── navigation-models-apple-style.md
│   ├── web-engineering-apple-style.md
│   ├── web-marketing-language-apple-style.md
│   ├── qa-apple-style.md
│   ├── review-workflow-apple-style.md
│   ├── apple-hig-mapping-apple-style.md
│   ├── apple-platform-playbooks-apple-style.md
│   ├── apple-native-recipes-apple-style.md
│   ├── apple-review-rubric-apple-style.md
│   ├── heritage-apple-style.md
│   ├── evidence-apple-style.md
│   └── upstream-sources-apple-style.md
├── examples/
│   ├── good-apple-style.md
│   ├── bad-clone-patterns.md
│   └── reference-implementations/
│       ├── README.md
│       ├── tokens.css
│       ├── profile-screen.css
│       ├── interactive-sheet.css
│       ├── carousel-rubber-band.css
│       ├── ProfileScreen.swift
│       ├── ProfileScreen.jsx
│       ├── InteractiveSheet.jsx
│       ├── CarouselRubberBand.jsx
│       ├── ScrollStory.jsx
│       ├── scroll-story.css
│       ├── MediaHero.jsx
│       └── media-hero.css
├── demo/
│   ├── README.md
│   ├── index.html
│   ├── theme.css
│   ├── site.css
│   ├── site.js
│   └── media/
│       ├── hero-still.svg
│       ├── scene-capture.svg
│       ├── scene-connect.svg
│       ├── scene-review.svg
│       └── detail-still.svg
├── assets/
│   ├── sf-symbols-map.json
│   └── apple-component-fidelity-map.json
└── scripts/
    ├── lib/
    │   └── tokens.mjs
    ├── audit.mjs
    ├── token-lint.mjs
    ├── check-contrast.mjs
    ├── generate-tokens.mjs
    ├── motion-probe.mjs
    ├── a11y-audit.mjs
    ├── a11y-probe.mjs
    ├── code-audit.mjs
    ├── link-check.mjs
    └── visual-diff.mjs
└── _vendor/
    └── apple-design-skills/  # optional research, skipped by scripts
```

75 files total.

## Install

Agent runtimes that discover skills from their skills directory can load this folder directly.

For other runtimes, copy or symlink this folder into the runtime's skill directory.

The core skill has no build step and no dependencies. `visual-diff.mjs` and `a11y-probe.mjs` are opt-in and need dev dependencies. `package.json` exists only to document scripts and optional dependencies.

## Use

Ask for platform-native craft work, for example:

- "Build a settings screen with Apple-style tokens for Android."
- "Audit this page against the five-lens review workflow."
- "Give me carousel rubber band behavior like iOS."
- "Create a component spec for a modal bottom sheet."
- "Generate Compose and Android XML tokens from the token source."
- "Check the semantic colors for contrast."
- "Adapt this iPhone layout for macOS and web."
- "Write a design-review report for this screen."

The agent loads `SKILL.md`, then only the references needed for the task.

## Demo

`demo/` is a complete flagship web page built with this skill alone. It uses the skill's token sheet, native HTML controls, generated SVG media, a damped scroll-progress scene, a dark chapter, reduced-motion end states, and a no-script path. See `demo/README.md` for the applied reference map and the four zero-finding audit commands.

## Scripts

All scripts are Node.js ESM and use built-in modules unless noted.

```bash
node scripts/link-check.mjs . --strict
node scripts/audit.mjs /path/to/project --strict --platform=android
node scripts/token-lint.mjs /path/to/project --strict
node scripts/check-contrast.mjs --strict
node scripts/code-audit.mjs /path/to/project --strict
node scripts/a11y-audit.mjs /path/to/project --strict --platform=web
node scripts/generate-tokens.mjs --format=all --out=generated
node scripts/motion-probe.mjs --all
npm run verify
```

### link-check.mjs

Validates relative links in all Markdown files. Absolute paths and broken links are findings.

### audit.mjs

General static pattern scan. Flags raw radii, heavy shadows, gradient backgrounds, `transition: all`, small targets, emoji icons, lorem ipsum, stub markers, raw hex, and missing Reduce Motion paths. `--platform` sets the target minimum: iOS 44, Android 48, web 44, desktop 32.

### token-lint.mjs

Stricter token discipline. Flags raw hex, raw radius, raw duration, raw font family, and raw shadow in source files. Token source files are skipped.

### check-contrast.mjs

Checks semantic color pairs in light and dark against configured targets. Body text uses 4.5:1. Secondary text and large/bold control labels use 3:1. Decorative tertiary metadata uses 1.7:1. UI component colors use 3:1. Status accents use 2:1 because meaning is carried by text and icons.

### generate-tokens.mjs

Reads `references/tokens-apple-style.md` and writes:

- `tokens.css`
- `tokens.json`
- `AppleTokens.swift`
- `tailwind.tokens.cjs`
- `Theme.kt`
- `colors.xml`

The markdown token source wins. Generated outputs are disposable.

### motion-probe.mjs

Prints SwiftUI, UIKit, CSS curve, and CSS `linear()` spring equivalents for presets or custom duration and bounce.

### a11y-audit.mjs

Static accessibility scan for language, main landmark, image alt, control names, label association, heading order, positive tabindex, clickable divs, Reduce Motion hooks, plus SwiftUI, Compose, and Android XML naming checks. `--platform` only affects reporting; the requirement is identical everywhere. It does not replace screen reader testing.

### code-audit.mjs

Code hygiene scan for empty catches, debugger statements, raw hex, hardcoded transition durations, stub markers, missing listener teardown, unbounded loops, `innerHTML` assignment, scroll hijacking, root smooth scroll, page-level snap, weak sticky/observer setup, lazy LCP media, missing media dimensions, unsafe bitmap decode, blanket `will-change`, and Apple-owned asset references. Focuses on correctness, not visual pattern matching.

### a11y-probe.mjs

Opt-in rendered accessibility scan with Playwright and axe-core against a live URL.

```bash
npm i -D playwright @axe-core/playwright
npx playwright install chromium
node scripts/a11y-probe.mjs --url=http://localhost:3000 --strict
```

### visual-diff.mjs

Optional screenshot comparison. Requires dev dependencies:

```bash
npm i -D playwright pixelmatch pngjs
npx playwright install chromium
```

Capture a baseline:

```bash
node scripts/visual-diff.mjs --url=http://localhost:3000 --routes=/,/settings --baseline=./visual-baseline --update
```

Compare later work:

```bash
node scripts/visual-diff.mjs --url=http://localhost:3000 --routes=/,/settings --baseline=./visual-baseline --out=./visual-diff --threshold=0.01
```

Add `apple-design-audit:ignore`, `apple-design-token-lint:ignore`, or `apple-design-code-audit:ignore` to a file to skip the relevant scan.

## Review model

`references/review-workflow-apple-style.md` defines five lenses: craft, interaction and motion, accessibility, platform fidelity, and code quality. Findings use `path:line — severity — lens — message`. Verdicts are Pass, Conditional, or Fail. A platform mismatch is at least High. An accessibility or contrast failure is always Blocker.

`references/evidence-apple-style.md` labels rules Must, Should, or May so defaults are never sold as platform laws.

`references/heritage-apple-style.md` explains the craft lineage and resolves conflicts between references.

Flagship web work adds `restraint-and-antislop-apple-style.md`, `scroll-motion-apple-style.md`, `scrollytelling-apple-style.md`, `media-assets-and-delivery-apple-style.md`, `web-engineering-apple-style.md`, and `web-marketing-language-apple-style.md`. Interaction reviews add `perceived-performance-and-input-apple-style.md`, `state-and-feedback-apple-style.md`, and `navigation-models-apple-style.md`.

Apple-platform work adds `apple-hig-mapping-apple-style.md` for topic naming and claim strength, `apple-platform-playbooks-apple-style.md` for native chrome, `apple-native-recipes-apple-style.md` for SwiftUI/UIKit implementations, and `assets/apple-component-fidelity-map.json` for control and state names. A scored review uses `apple-review-rubric-apple-style.md` after the five lenses; its hard caps override the numeric total.

Vendored research stays behind the boundary in `references/upstream-sources-apple-style.md` and [THIRD_PARTY.md](THIRD_PARTY.md). The core docs distill rules; they do not load vendor files during normal use.

## Maintenance rules

- `tokens-apple-style.md` owns raw values.
- `animations-apple-style.md` owns timing and physics.
- `components-apple-style.md` owns component states.
- `haptics-and-sound-apple-style.md` owns feedback timing.
- `qol-patterns-apple-style.md` owns product-level interaction patterns.
- `restraint-and-antislop-apple-style.md` owns restraint level and surface discipline.
- `scroll-motion-apple-style.md` owns scroll-progress mapping and damped read values.
- `scrollytelling-apple-style.md` owns sticky scenes and chapter choreography.
- `media-assets-and-delivery-apple-style.md` owns media pipelines and asset sourcing.
- `perceived-performance-and-input-apple-style.md` owns latency, focus, pointer, and scroll-input rules.
- `state-and-feedback-apple-style.md` owns state selection and feedback timing.
- `navigation-models-apple-style.md` owns presentation choice, back, deep links, and restoration.
- `web-engineering-apple-style.md` owns progressive enhancement and front-end architecture.
- `web-marketing-language-apple-style.md` owns flagship page anatomy and copy posture.
- `content-apple-style.md` owns calm, benefit-led, one-idea-per-sentence copy.
- `restraint-and-antislop-apple-style.md` owns deference as withholding and chrome receding.
- `apple-hig-mapping-apple-style.md` owns HIG topic mapping and safe claim wording.
- `apple-platform-playbooks-apple-style.md` owns Apple platform chrome recipes.
- `apple-native-recipes-apple-style.md` owns SwiftUI/UIKit recipe code.
- `apple-review-rubric-apple-style.md` owns scored craft review and hard caps.
- `assets/apple-component-fidelity-map.json` owns cross-platform native control names.
- `platform-adapters-apple-style.md` owns cross-platform mapping.
- `macos-windowing-apple-style.md` owns desktop window behavior.
- `qa-apple-style.md` owns the audit verdict format.
- `review-workflow-apple-style.md` owns the five-lens review.
- `evidence-apple-style.md` owns recommendation strength and citation discipline.
- `upstream-sources-apple-style.md` owns vendor boundaries and source translation.
- Keep all links relative.
- Keep core docs provider-neutral.
- Keep examples concrete.
- Generated token outputs are disposable; the markdown token source wins.

## Compatibility

Designed for OpenCode, Claude, Codex, and similar agents that read a `SKILL.md` entrypoint and supporting files progressively.
