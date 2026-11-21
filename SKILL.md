---
name: apple-design
description: Build and audit Apple-inspired, animation-driven, platform-native UI on iOS, iPadOS, macOS, watchOS, visionOS, tvOS, Android, web, desktop, Flutter, React Native, Compose, SwiftUI, Tauri, and Electron. Use for design systems, tokens, motion/physics, scroll-bound storytelling, flagship web pages, media delivery, perceived performance, state feedback, navigation models, haptics, QoL patterns, Apple platform fidelity, native SwiftUI/UIKit recipes, full Apple HIG topic mapping (173 pages), scored craft review, accessibility, contrast, component specs, layout, platform adaptation, craft critique, design review, and UI audits.
---

# Apple Design Skill

Apple-inspired, not Apple-branded. One disciplined craft system translated into each platform's native idioms. Progressive disclosure: read this file, then load only the references the task needs.

## 1. First action

Read this file. Identify three things in one line:

- target platform and framework
- surface class: native app, product web, or flagship marketing page
- task type: build, restyle, critique, audit, or token work

Then load the minimum reference set. Do not load every reference unless the task is a full skill build or full product audit.

Do not load `_vendor/` during normal work. It is research material behind the provenance boundary.

## 2. Routing table

| Task | Load |
|---|---|
| visual direction, type, color, spacing, radius, materials, elevation, icons | `references/design-apple-style.md` |
| motion, spring timing, carousel, rubber band, scroll physics, Reduce Motion | `references/animations-apple-style.md` |
| CSS/Swift/Compose/XML tokens, semantic color pairs, scales | `references/tokens-apple-style.md` |
| component anatomy, states, sizing, interaction | `references/components-apple-style.md` |
| safe areas, responsive layout, size classes, breakpoints | `references/layout-apple-style.md` |
| Dynamic Type, VoiceOver, TalkBack, keyboard, contrast, target sizes | `references/accessibility-apple-style.md` |
| labels, errors, empty states, capitalization, localization, calm copy | `references/content-apple-style.md` |
| haptics, sound, vibration, feedback timing | `references/haptics-and-sound-apple-style.md` |
| autosave, undo, focus restoration, shortcuts, degradation, recovery | `references/qol-patterns-apple-style.md` |
| iOS, Android, web, macOS, Windows, Linux, watchOS, visionOS adaptation | `references/platform-adapters-apple-style.md` |
| Apple platform chrome: detents, large titles, toolbars, sidebars, widgets, Crown, ornaments | `references/apple-platform-playbooks-apple-style.md` |
| SwiftUI/UIKit recipes: geometry, springs, scroll read, focus, shortcuts, named graphics | `references/apple-native-recipes-apple-style.md` |
| HIG topic mapping and safe claim wording | `references/apple-hig-mapping-apple-style.md` |
| applied HIG patterns: notifications, onboarding, search, settings, undo, data entry, drag/drop, feedback, help | `references/state-and-feedback-apple-style.md`, `references/qol-patterns-apple-style.md`, `references/content-apple-style.md` |
| scored Apple craft rubric with hard caps | `references/apple-review-rubric-apple-style.md` |
| component and native API map by Apple platform | `assets/apple-component-fidelity-map.json` |
| macOS windows, toolbar, sidebar, inspector, menu bar, restoration | `references/macos-windowing-apple-style.md` |
| reject rules and failure modes | `references/anti-patterns-apple-style.md` |
| restraint level, anti-slop decisions, deference, light/dark posture | `references/restraint-and-antislop-apple-style.md` |
| scroll-progress mapping, damped read value, CSS scroll timeline | `references/scroll-motion-apple-style.md` |
| sticky chapters, theme morph, stacked cards, flipbook, galleries | `references/scrollytelling-apple-style.md` |
| hero video, image sequence, WebGL viewer, media delivery, asset sourcing | `references/media-assets-and-delivery-apple-style.md` |
| latency thresholds, focus, pointer, keyboard, scroll-as-input | `references/perceived-performance-and-input-apple-style.md` |
| loading, empty, error, disabled, optimistic, pagination, validation states | `references/state-and-feedback-apple-style.md` |
| push, sheet, modal, tab, popover, split view, back, deep link, restore | `references/navigation-models-apple-style.md` |
| SSR document structure, progressive enhancement, namespaces, script loading | `references/web-engineering-apple-style.md` |
| flagship page anatomy, section order, CTA voice, nav, cadence | `references/web-marketing-language-apple-style.md` |
| five-lens design review and report format | `references/review-workflow-apple-style.md` |
| design lineage and conflict resolution | `references/heritage-apple-style.md` |
| Must / Should / May strength and honest citation | `references/evidence-apple-style.md` |
| vendor boundary, claim translation, source exclusions | `references/upstream-sources-apple-style.md` |
| privacy, permissions, accounts, sensitive data, inclusion | `references/qol-patterns-apple-style.md`, `references/content-apple-style.md`, `references/state-and-feedback-apple-style.md`, `references/apple-hig-mapping-apple-style.md` |
| widgets, Live Activities, complications, notifications, system surfaces | `references/apple-platform-playbooks-apple-style.md`, `references/state-and-feedback-apple-style.md`, `references/components-apple-style.md` |
| branding, app icons, SF Symbols, images, charts, text/web views | `references/design-apple-style.md`, `references/components-apple-style.md`, `references/content-apple-style.md`, `references/apple-hig-mapping-apple-style.md` |
| Apple technologies/integrations: Pay, Sign in, Health, SharePlay, Game Center, CarPlay, Siri, iCloud, AI | `references/apple-platform-playbooks-apple-style.md`, `references/qol-patterns-apple-style.md`, `references/state-and-feedback-apple-style.md` |
| final audit checklist and verdict format | `references/qa-apple-style.md` |
| examples of correct and failed work | `examples/good-apple-style.md`, `examples/bad-clone-patterns.md` |
| SwiftUI, React, carousel, sheet, scroll, media reference builds | `examples/reference-implementations/` |
| complete flagship web demo built with this skill alone | `demo/README.md`, `demo/index.html`, `demo/site.css`, `demo/site.js`, `demo/media/` |
| SF Symbols / Material Symbols / Lucide aliases | `assets/sf-symbols-map.json` |
| general static pattern scan | `scripts/audit.mjs` |
| strict token lint | `scripts/token-lint.mjs` |
| semantic contrast check | `scripts/check-contrast.mjs` |
| spring equivalents and CSS `linear()` keyframes | `scripts/motion-probe.mjs` |
| static accessibility scan | `scripts/a11y-audit.mjs` |
| rendered axe-core scan (opt-in) | `scripts/a11y-probe.mjs` |
| code hygiene and scroll/media anti-pattern scan | `scripts/code-audit.mjs` |
| relative-link validation | `scripts/link-check.mjs` |
| optional screenshot comparison | `scripts/visual-diff.mjs` |
| generate CSS/JSON/Swift/Tailwind/Compose/XML tokens | `scripts/generate-tokens.mjs` |
| verify full 173-page HIG coverage matrix and owning refs | `scripts/hig-coverage-check.mjs` |
| static motion anti-pattern / Reduce Motion audit | `scripts/motion-audit.mjs` |

## 3. Build workflow

1. Identify the task category from the routing table.
2. Name platform, framework, surface class, and task type in one line.
3. Load the minimum reference set.
4. State assumptions in one line if the ticket is shorthand.
5. Choose restraint level and surface discipline before styling.
6. Build the complete artifact with native controls, tokens, and real states.
7. Add reduced-motion and no-script end states where relevant.
8. Run the QA checklist before delivery.
9. Report blocking findings plainly.

For a native or product UI build, load in this order:

1. `references/design-apple-style.md`
2. `references/animations-apple-style.md`
3. `references/tokens-apple-style.md`
4. `references/components-apple-style.md`
5. `references/state-and-feedback-apple-style.md`
6. `references/perceived-performance-and-input-apple-style.md`
7. `references/navigation-models-apple-style.md`
8. `references/layout-apple-style.md`
9. `references/accessibility-apple-style.md`
10. `references/content-apple-style.md`
11. `references/haptics-and-sound-apple-style.md`
12. `references/qol-patterns-apple-style.md`
13. `references/platform-adapters-apple-style.md`
14. `references/macos-windowing-apple-style.md` only for desktop builds
15. `references/review-workflow-apple-style.md` for the final review

For an Apple-platform build, add this layer before the final review:

1. `references/apple-hig-mapping-apple-style.md` for topic naming and safe claims
2. `references/apple-platform-playbooks-apple-style.md` for native chrome choices
3. `references/apple-native-recipes-apple-style.md` for SwiftUI/UIKit implementation
4. `assets/apple-component-fidelity-map.json` for control and state names

For a flagship web build, load in this order:

1. `references/restraint-and-antislop-apple-style.md`
2. `references/web-marketing-language-apple-style.md`
3. `references/web-engineering-apple-style.md`
4. `references/design-apple-style.md`
5. `references/tokens-apple-style.md`
6. `references/media-assets-and-delivery-apple-style.md`
7. `references/scroll-motion-apple-style.md`
8. `references/scrollytelling-apple-style.md`
9. `references/perceived-performance-and-input-apple-style.md`
10. `references/state-and-feedback-apple-style.md`
11. `references/accessibility-apple-style.md`
12. `references/qa-apple-style.md`

## 4. Audit workflow

1. Load `references/review-workflow-apple-style.md`.
2. Load `references/qa-apple-style.md`, `references/anti-patterns-apple-style.md`, and `references/restraint-and-antislop-apple-style.md`.
3. Load only the docs covering the audited surface.
4. Use `references/evidence-apple-style.md` to label each rule Must, Should, or May.
5. Add `references/apple-review-rubric-apple-style.md` when a scored verdict is requested.
6. Run static scripts when source files are available.
7. Run `scripts/a11y-probe.mjs` only when a live URL and optional deps exist.
8. Run `scripts/visual-diff.mjs` only when a browser baseline exists.
9. Report verdict using the five-lens report format.

Commands:

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

Optional rendered fidelity and a11y (needs dev dependencies):

```bash
npm i -D playwright @axe-core/playwright pixelmatch pngjs
npx playwright install chromium
node scripts/a11y-probe.mjs --url=http://localhost:3000 --strict
node scripts/visual-diff.mjs --url=http://localhost:3000 --routes=/,/settings --baseline=./visual-baseline --out=./visual-diff
```

## 5. Core rules

- Apple-inspired, not official Apple guidance.
- The host platform is the execution target; native chrome wins over a shared mockup.
- Match restraint level to surface purpose. Utility surfaces stay plain.
- Use one accent tint.
- Use semantic tokens, never raw values in components.
- Standard controls first.
- No stubs, fake charts, lorem ipsum, or dead controls.
- Direct manipulation tracks input 1:1; springs resolve release.
- Carousel edges use bounded rubber band, never phantom pages.
- Native scrolling is authoritative. Never intercept wheel or touch movement for ordinary scroll.
- Cinematic scroll scenes commit fully or skip. Weak pinned scenes do not ship.
- Ship generated, self-owned, or permissively licensed media only.
- Reduced motion resolves to the final state; it never hides content.
- Accessibility is required: name, role, state, keyboard path, contrast, Reduce Motion.
- Target sizes are native: 44pt iOS, 48dp Android, 44px web, pointer-appropriate desktop.
- Copy is direct, calm, and specific.
- Haptics fire once at commit, never per frame.
- Autosave, undo, focus restoration, and recovery are part of the build.
- State Must / Should / May honestly; defaults are not platform laws.
- No purple gradients, random radii, heavy shadows, all-caps mono eyebrows, or centered hero over three identical cards.

## 6. Output contract

When building:

- ship the complete artifact
- name the reference files applied
- name assumptions in one line
- list any blocking QA failure

When auditing:

```text
Verdict: Pass | Conditional | Fail
Platform: ios | android | web | desktop
Framework: SwiftUI | Compose | React | Flutter | other

Blocking:
- path:line — severity — lens — item

Non-blocking:
- path:line — severity — lens — item

Applied rules:
- reference file names
```

## 7. Release gate

Before shipping or merging:

1. Run `npm run verify` from the skill root. It covers links, syntax checks, static audit, token lint, a11y audit, code audit, motion audit, HIG coverage check, contrast, token generation, and motion presets.
2. Run `node scripts/a11y-probe.mjs --url=...` for rendered DOM checks in a Playwright-capable environment.
3. Run `node scripts/visual-diff.mjs ...` when a rendered baseline or screenshot exists.
4. Confirm the task report names platform, framework, surface class, motion posture (subtle/standard/flagship with Reduce Motion fallback), and any logged fallback.
5. For HIG-heavy reviews, cite HIG topic + owning house file, label Must/Should/May, and confirm accessibility/privacy/platform contracts before craft polish.

## 8. Portability

- All references use relative links.
- No provider-specific tool APIs in the core docs.
- Core docs are dependency-free.
- `_vendor/` is research only and skipped by static scripts.
- All scripts use Node built-ins except the opt-in `a11y-probe.mjs` and `visual-diff.mjs`.
- Works as a progressive-disclosure skill for OpenCode, Claude, Codex, and similar agents.

## 9. Maintenance

- Raw values live only in `tokens-apple-style.md`.
- General motion timing lives only in `animations-apple-style.md`.
- Scroll-bound motion lives only in `scroll-motion-apple-style.md`.
- Scene choreography lives only in `scrollytelling-apple-style.md`.
- Media pipeline and asset sourcing live only in `media-assets-and-delivery-apple-style.md`.
- Restraint level, deference, and anti-slop decisions live only in `restraint-and-antislop-apple-style.md`.
- Content posture and calm copy live only in `content-apple-style.md`.
- Perceived performance and input live only in `perceived-performance-and-input-apple-style.md`.
- State selection and feedback timing live only in `state-and-feedback-apple-style.md`.
- Navigation presentation and restoration live only in `navigation-models-apple-style.md`.
- Flagship web engineering lives only in `web-engineering-apple-style.md`.
- Flagship page language lives only in `web-marketing-language-apple-style.md`.
- Component states live only in `components-apple-style.md`.
- Apple HIG topic mapping lives only in `apple-hig-mapping-apple-style.md`.
- Applied HIG rules live in the owning reference file, never as a bulk HIG copy.
- Apple platform chrome recipes live only in `apple-platform-playbooks-apple-style.md`.
- Native SwiftUI/UIKit recipes live only in `apple-native-recipes-apple-style.md`.
- Scored Apple craft rubric lives only in `apple-review-rubric-apple-style.md`.
- Cross-platform component and API names live only in `assets/apple-component-fidelity-map.json`.
- Feedback hardware lives only in `haptics-and-sound-apple-style.md`.
- Cross-platform ergonomics live only in `platform-adapters-apple-style.md`.
- macOS window behavior lives only in `macos-windowing-apple-style.md`.
- QoL patterns live only in `qol-patterns-apple-style.md`.
- Audit verdict format lives only in `qa-apple-style.md`.
- Five-lens review lives only in `review-workflow-apple-style.md`.
- Evidence strength lives only in `evidence-apple-style.md`.
- Vendor boundaries and claim translation live only in `upstream-sources-apple-style.md`.
- Generated token outputs are disposable; the markdown token source wins.
- If two files conflict, the narrower file wins for its domain.
- If a rule is platform-specific, label it.
- If a number reproduces a feel rather than an official constant, label it as an implementation default.
- If a claim comes from dated observation, label the date and keep it out of evergreen laws.
