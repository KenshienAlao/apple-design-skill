# apple-design

**A progressive-disclosure agent skill for Apple-inspired, platform-native UI. 30 reference docs, 11 script files, 2 machine-readable maps, and a complete flagship demo — provider-neutral and dependency-free.**

Apple-inspired, not Apple-branded. Apple is the craft lens; the host platform is the execution target. iOS, Android, web, macOS, Windows, Linux, watchOS, visionOS, Flutter, React Native, Compose, SwiftUI, Tauri, and Electron all ship through the same rules with native vocabulary.

Release `1.0.0` · Skill snapshot `2026-11-21` · `npm run verify` clean.

## Copy-paste install prompt

Copy and paste this message into your agent to install the skill.

```text
Install the apple-design skill for me from https://github.com/KenshienAlao/apple-design-skill.git
Read SKILL.md first, then load only the references my task needs. Do not load
the whole corpus unless I ask for a full build or full audit.
```

No slash command is required. The skill works from normal prompts.

## 1.0.0 release: craft depth and flagship demo

This release turns the earlier craft starter into a full build and review system.

- **Apple-depth layer.** [HIG topic mapping](references/apple-hig-mapping-apple-style.md) with applied pattern rules in the owning refs, [platform playbooks](references/apple-platform-playbooks-apple-style.md), [native SwiftUI/UIKit recipes](references/apple-native-recipes-apple-style.md), [component/API fidelity map](assets/apple-component-fidelity-map.json), and a [scored craft rubric](references/apple-review-rubric-apple-style.md) with hard caps.
- **Flagship web craft.** [Restraint and anti-slop](references/restraint-and-antislop-apple-style.md), [scroll motion](references/scroll-motion-apple-style.md), [scrollytelling](references/scrollytelling-apple-style.md), [media delivery](references/media-assets-and-delivery-apple-style.md), [web engineering](references/web-engineering-apple-style.md), and [page language](references/web-marketing-language-apple-style.md).
- **Interaction depth.** [Perceived performance](references/perceived-performance-and-input-apple-style.md), [state and feedback](references/state-and-feedback-apple-style.md), [navigation models](references/navigation-models-apple-style.md), haptics, QoL patterns, and platform adapters.
- **Verification.** [11 script files](scripts/) cover links, static audit, token lint, contrast, accessibility, code hygiene, motion probing, token generation, rendered a11y, visual diff, and token helpers. CI runs `npm run verify`.
- **Working proof.** The [Lumen demo](demo/README.md) is a complete flagship page built with the skill alone.

## Manual install

Extract the complete `design/` folder into your agent's skills directory, either for one project or for all local projects. Your agent's documentation names that location. Agents without skill discovery need explicit access to [SKILL.md](SKILL.md) and its sibling files.

Keep `SKILL.md`, this README, `references/`, `examples/`, `assets/`, `scripts/`, `demo/`, [THIRD_PARTY.md](THIRD_PARTY.md), and [LICENSE](LICENSE) together. When upgrading, replace the old skill folder rather than merging files; check for another installed copy with the same name.

There is no onboarding website, browser intake, dashboard, or setup server. The agent works in your conversation and project. Core docs need no runtime. Node 18+ runs the static scripts; generated token outputs are disposable. Optional rendered checks need Playwright and friends.

## Confirm the installation

```text
Find the installed apple-design skill. Read SKILL.md and report its absolute
location, package version, and the reference groups it routes to. Do not load
all references or start a review for this setup check.
```

Expect version `1.0.0`, a progressive-disclosure router, and reference groups for visual foundation, motion, tokens, components, accessibility, Apple-platform depth, flagship web craft, and audit workflows. If the skill is missing, check the install location and refresh or restart the host.

## Use

```text
Use apple-design to build a settings screen with Apple-style tokens for Android.
Use apple-design to audit this page against the five-lens review workflow.
Use apple-design in flagship web mode for this landing page.
Use apple-design to generate CSS, Swift, Compose, and Android XML tokens.
```

The agent loads the minimum reference set. Setup and greeting questions do not load the corpus. Answers name the applied reference files and the assumptions in one line each.

Common lanes:

- native app builds: [design](references/design-apple-style.md), [animations](references/animations-apple-style.md), [tokens](references/tokens-apple-style.md), [components](references/components-apple-style.md), [state](references/state-and-feedback-apple-style.md), [accessibility](references/accessibility-apple-style.md), [content](references/content-apple-style.md)
- Apple-platform builds: [HIG mapping](references/apple-hig-mapping-apple-style.md), [platform playbooks](references/apple-platform-playbooks-apple-style.md), [native recipes](references/apple-native-recipes-apple-style.md), [fidelity map](assets/apple-component-fidelity-map.json)
- HIG pattern decisions: [state and feedback](references/state-and-feedback-apple-style.md), [navigation](references/navigation-models-apple-style.md), [quality patterns](references/qol-patterns-apple-style.md), [components](references/components-apple-style.md), [accessibility](references/accessibility-apple-style.md)
- flagship web: [restraint](references/restraint-and-antislop-apple-style.md), [page language](references/web-marketing-language-apple-style.md), [web engineering](references/web-engineering-apple-style.md), [media](references/media-assets-and-delivery-apple-style.md), [scroll motion](references/scroll-motion-apple-style.md), [scrollytelling](references/scrollytelling-apple-style.md)
- audits: [review workflow](references/review-workflow-apple-style.md), [QA checklist](references/qa-apple-style.md), [anti-patterns](references/anti-patterns-apple-style.md), [evidence strength](references/evidence-apple-style.md), [scored rubric](references/apple-review-rubric-apple-style.md)

## Flagship web demo

The [Lumen demo](demo/index.html) is the reference plate. It reads color, type, spacing, radius, duration, target, and hairline values from the skill's token sheet, uses native HTML controls, and ships generated SVG media only.

Open `demo/index.html` directly or serve the folder with any static server. The page includes a damped scroll-progress scene, one dark chapter, real focus states, keyboard navigation, reduced-motion end states, and a complete no-script path.

```bash
node scripts/a11y-audit.mjs demo --strict --platform=web
node scripts/code-audit.mjs demo --strict
node scripts/audit.mjs demo --strict --platform=web
node scripts/token-lint.mjs demo --strict
```

All four pass with zero findings.

## Scored craft review

Ask for it by name: “Use apple-design in scored review mode on this screen.” The agent loads [apple-review-rubric-apple-style.md](references/apple-review-rubric-apple-style.md) after the five lenses, scores each area, applies hard caps, and reports `Pass | Conditional | Fail` with `path:line` findings.

A pass needs the numeric floor, complete evidence, and no unresolved material finding. Hard caps override the numeric total. The rubric does not replace the five-lens review; it sits after it.

## Coverage and context

- 30 reference docs, 11 script files, 2 JSON maps, 15 example files, 10 demo files.
- 76 files total outside `_vendor/`.
- Semantic contrast targets: body 4.5:1, secondary/large/control 3:1, decorative tertiary 1.7:1, status accents 2:1 with text labels.
- Native target sizes: 44pt iOS, 48dp Android, 44px web, pointer-appropriate desktop.
- Audit verdicts use Must / Should / May strength from [evidence-apple-style.md](references/evidence-apple-style.md).
- Static file counts are packaging facts, not measured per-request context loads.
- Full HIG mirroring is intentionally out of scope. The reachable graph was inventoried at 173 content pages with 172 bodies extracted on 2026-11-21; the HIG layer distills and maps the topics this skill actually applies.

## Repository and packaging

[SKILL.md](SKILL.md) is the first-load router. Its routing table maps tasks to the smallest useful reference set. This README is the human index. Detailed rules live in `references/*.md`; token generation, audits, and probes live in `scripts/`.

`_vendor/apple-design-skills/` is a dated MIT research snapshot. Static scripts skip it, core docs do not load it by default, and [THIRD_PARTY.md](THIRD_PARTY.md) records provenance. Do not treat vendored `SKILL.md` files as extra skill installs.

The markdown token source in [tokens-apple-style.md](references/tokens-apple-style.md) wins; generated CSS, JSON, Swift, Tailwind, Compose, and XML outputs are disposable. `.github/workflows/verify.yml` runs the full gate on push, pull request, and manual dispatch.

## Verification

```bash
npm run verify
```

Full command:

```bash
node scripts/link-check.mjs . --strict
node scripts/audit.mjs . --strict
node scripts/token-lint.mjs . --strict
node scripts/a11y-audit.mjs . --strict
node scripts/code-audit.mjs . --strict
node scripts/check-contrast.mjs --strict
node scripts/generate-tokens.mjs --format=all --out=/tmp/opencode/design-tokens
node scripts/motion-probe.mjs --all
```

Opt-in rendered checks:

```bash
npm i -D playwright @axe-core/playwright pixelmatch pngjs
npx playwright install chromium
node scripts/a11y-probe.mjs --url=http://localhost:3000 --strict
node scripts/visual-diff.mjs --url=http://localhost:3000 --routes=/,/settings --baseline=./visual-baseline --out=./visual-diff
```

Add `apple-design-audit:ignore`, `apple-design-token-lint:ignore`, or `apple-design-code-audit:ignore` to a file to skip the relevant scan.

## Structure

```text
design/
├── SKILL.md
├── README.md
├── LICENSE
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
│       ├── media-hero.css
│       ├── scroll-story.css
│       ├── ProfileScreen.swift
│       ├── ProfileScreen.jsx
│       ├── InteractiveSheet.jsx
│       ├── CarouselRubberBand.jsx
│       ├── MediaHero.jsx
│       └── ScrollStory.jsx
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
├── scripts/
│   ├── lib/
│   │   └── tokens.mjs
│   ├── audit.mjs
│   ├── token-lint.mjs
│   ├── check-contrast.mjs
│   ├── generate-tokens.mjs
│   ├── motion-probe.mjs
│   ├── a11y-audit.mjs
│   ├── a11y-probe.mjs
│   ├── code-audit.mjs
│   ├── link-check.mjs
│   └── visual-diff.mjs
└── _vendor/
    └── apple-design-skills/  # optional MIT research, skipped by scripts
```

## Attribution

Distilled from [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), [s1gmamale1/apple-design-skills](https://github.com/s1gmamale1/apple-design-skills), [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill), and [justinwetch/HIGAgentSkills](https://github.com/justinwetch/HIGAgentSkills). The latter supplies the [HIG evidence layer](references/evidence-apple-style.md) and the README structure adopted here. The [scored rubric](references/apple-review-rubric-apple-style.md) is informed by independent craft-review practice.

This independent project is not affiliated with or endorsed by Apple Inc. No Apple-owned media, logos, screenshots, video, bezels, or captured frames are bundled.

## License

Code and original material are MIT licensed. The license does not claim to extend to material owned by Apple or others. See [LICENSE](LICENSE) and [THIRD_PARTY.md](THIRD_PARTY.md).
