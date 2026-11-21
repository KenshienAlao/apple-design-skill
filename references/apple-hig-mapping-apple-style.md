# Apple HIG Mapping

A compact map from this skill's house rules to the topics Apple's Human Interface Guidelines organizes around. Load this when a review needs to say "which HIG topic does this finding belong to" without importing Apple-owned text.

This is a distillation by topic, not a reproduction of the HIG table of contents. Section names here are topic labels. Do not bulk-copy HIG prose into skill files. For claim strength, use `evidence-apple-style.md`.

Checked against Apple's published HIG JSON endpoints on 2026-11-21. HIG change logs on those pages run through 2026-10-28. Numbers below are paraphrased contracts, not quoted text; re-verify a cited number before treating it as current.

The full reachable graph was inventoried at 173 content pages; 172 page bodies were extracted. That crawl feeds the applied findings in the owning reference files. It does not turn this skill into a HIG mirror.

## 1. Scope

This file owns:

- topic-level mapping between house rules and HIG subject areas
- the boundary between a documented platform contract and a house default
- a short claim-translation table for review write-ups
- the canonical source links and the date they were checked
- routing from HIG topic namespaces to the house file that answers them
- applied findings from the full reachable HIG corpus, kept in their owning reference files

This file does not own:

- per-platform UI recipes; use `apple-platform-playbooks-apple-style.md`
- native API snippets; use `apple-native-recipes-apple-style.md`
- the scorecard; use `apple-review-rubric-apple-style.md`
- five-lens review order; use `review-workflow-apple-style.md`

## 2. Principles: Apple's three vs. the house working tests

Apple's current HIG states three principles: **Purpose** (make something meaningful), **Agency** (let people do things their own way), and **Responsibility** (act in people's best interest). These are documented platform framing, not house rules. Use them to explain *why* a finding belongs to a topic.

The house translates those into three working tests that are actually checkable in a review. Keep the two sets distinct; never present a house test as an Apple principle.

| House working test | Check | Strength |
|---|---|---|
| Clarity | text is legible, controls are named, hierarchy is readable at a glance | Must for legibility and naming; Should for aesthetic clarity |
| Deference | chrome recedes; content and task own the screen; one accent | Should (house default derived from agency) |
| Depth | motion and layering communicate order, not decoration | May for flourish; Must when it carries state |

Rules:

- A principle is a test, not a quota. Do not add motion to "have depth."
- Deference is measurable: count the competing accents and decorative layers.
- Depth is load-bearing only when it explains spatial or causal order.
- Purpose and Responsibility land in the privacy, inclusion, and error-copy topics below; they are not extra visual rules.

## 3. Topic map

| HIG topic area | House rule file | What travels across platforms |
|---|---|---|
| Layout and spacing | `layout-apple-style.md` | grids, safe areas, adaptive columns, rhythm |
| Typography | `design-apple-style.md`, `tokens-apple-style.md` | type roles, Dynamic Type, line length |
| Color | `design-apple-style.md`, `tokens-apple-style.md` | semantic pairs, one tint, contrast targets |
| Dark Mode | `tokens-apple-style.md`, `qa-apple-style.md` | light/dark pairs, appearance testing, contrast in both modes |
| Icons and symbols | `design-apple-style.md`, `assets/sf-symbols-map.json` | consistent icon family, semantic aliases |
| Materials and depth | `design-apple-style.md`, `macos-windowing-apple-style.md` | layered surfaces, hairlines, restrained elevation |
| Motion | `animations-apple-style.md`, `scroll-motion-apple-style.md` | 1:1 drag, spring release, Reduce Motion |
| Input and gestures | `perceived-performance-and-input-apple-style.md`, `accessibility-apple-style.md` | pointer, touch, keyboard, scroll ownership, gesture fallbacks |
| Navigation patterns | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md` | stack, tabs, sheets, split view, back |
| Component choice by intent | `components-apple-style.md`, `assets/apple-component-fidelity-map.json` | alerts vs. action sheets, fields, toggles, sliders, lists, toolbars |
| Feedback and status | `state-and-feedback-apple-style.md`, `haptics-and-sound-apple-style.md` | loading, empty, error, progress, commit haptics |
| Notifications | `state-and-feedback-apple-style.md`, `qol-patterns-apple-style.md` | consent, urgency, grouping, notification center |
| Onboarding and settings | `qol-patterns-apple-style.md`, `content-apple-style.md` | interactive teaching, good defaults, minimal settings |
| Search, undo, data entry | `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md` | one search location, explicit undo, prefill and validation |
| Content and copy | `content-apple-style.md`, `web-marketing-language-apple-style.md` | calm verbs, benefit-led labels, localization |
| Inclusion | `content-apple-style.md`, `accessibility-apple-style.md` | plain language, no stereotypes, gender-neutral copy |
| Privacy | `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md` | just-in-time permission, clear purpose strings, on-device work |
| Accessibility | `accessibility-apple-style.md` | name, role, state, focus, contrast, reflow |
| Platform and game guides | `apple-platform-playbooks-apple-style.md` | iOS, iPadOS, macOS, watchOS, visionOS, tvOS, games |
| App essentials and quality | `qol-patterns-apple-style.md`, `qa-apple-style.md` | autosave, undo, restoration, recovery |

## 4. Documented numbers worth routing to

Each row names the HIG topic and the house strength. These are contracts to check in a review, not values to paste into visual design. Cite the topic, not a quoted sentence.

| Topic | Distilled contract | Strength |
|---|---|---|
| Accessibility / Vision | Support text enlargement to at least 200% (140% watchOS). | Must |
| Accessibility / Vision | Body contrast ≥4.5:1 up to 17 pt; ≥3:1 at 18 pt or bold. | Must; WCAG 2.2 AA SC 1.4.3 |
| Accessibility / Vision | Convey state with shape or icon as well as color. | Must |
| Accessibility / Mobility | Minimum control size: iOS/iPadOS 44×44 pt (min 28); macOS 28 (min 20); tvOS 66 (min 56); visionOS 60 (min 28); watchOS 44 (min 28). | Must |
| Accessibility / Mobility | Leave ~12 pt padding around bezeled controls, ~24 pt around unbezeled ones. | Should |
| Accessibility / Mobility | Every gesture-driven core action also has a non-gesture path. | Must |
| Accessibility / Hearing | Pair audio cues with captions, visual cues, or haptics. | Must |
| Accessibility / Cognitive | Reduce Motion response: tighten springs, track the gesture, replace axis transitions with fades, avoid z-depth and blur animation. | Must when Reduce Motion is active |
| Accessibility / Cognitive | Avoid time-boxed dismissal; prefer an explicit action. | Should |
| Motion | Add motion only with a purpose; keep feedback brief, gesture-consistent, and cancellable. | Must for feedback correctness; Should for restraint |
| Motion | Avoid sustained ~0.2 Hz oscillation and motion at the edge of the field of view. | Must for spatial contexts; Should elsewhere |
| Typography | Default/minimum text: iOS/iPadOS 17/11 pt, macOS 13/10, tvOS 29/23, visionOS 17/12, watchOS 16/12. | Should |
| Typography | Prefer Regular–Bold weights; avoid Ultralight/Thin/Light at small sizes. Use built-in text styles so Dynamic Type works. | Should |
| Typography / Layout | At large text sizes: stack inline items, grow rows, reduce columns, keep truncation minimal, hold hierarchy. | Must when supporting Dynamic Type |
| Color | Use semantic colors with light, dark, and increased-contrast variants. Do not hard-code system color values. | Must |
| Color | One color never means two different things in the same interface. | Must |
| Dark Mode | Test both appearances, including Increase Contrast and Reduce Transparency. Minimum 4.5:1; aim 7:1 in small text. | Must for contrast; Should for the 7:1 goal |
| Dark Mode | Avoid an app-specific appearance toggle; follow the system choice. | Should |
| Materials | Liquid Glass belongs to the functional layer (controls, navigation), not the content layer. Apply it sparingly. | Must |
| Materials | Pick regular vs. clear variant by background richness; use a ~35% dimming layer over bright content under clear glass. | Should |
| Layout | Decide from size classes, not device type or orientation. Respect safe areas. Use progressive disclosure. | Should |
| Layout | Support right-to-left by preferring system components that flip automatically. | Must when localizing to RTL |
| Gestures | Use standard gestures for standard actions. Custom gestures must be discoverable, simple, distinct, and never the only path. | Must for the alternative path; Should for the rest |
| Gestures / macOS | Enlarge the touch target, not the control. Keep layout stable across input methods. | Should |
| Writing | Active voice; verb labels; no "click here," no "we," minimal possessive pronouns; consistent sentence/title case. | Should |
| Writing | Errors sit next to the problem and state the fix; empty states give a next action. | Should |
| Inclusion | Address people as "you," not "the user." Avoid gendered, culture-specific, and colloquial phrasing. | Should |
| Privacy | Request only the data a feature needs, at the moment it is needed; purpose strings are short, active, sentence case, with a period. | Must |
| Privacy | Prefer on-device processing, keychain storage, and passkeys/2FA/biometrics over plain-text secrets. | Must for secret storage; Should for the rest |
| Notifications | Use the Time Sensitive interruption level only for an event happening now or within about one hour. | Must when using the level |

Numeric values above are documented platform contracts as of the checked date. If a platform number changes, update this table and the citation; do not rewrite the corpus.

## 5. HIG namespace routing

When a finding arrives named after an HIG namespace, route it here instead of inventing a new topic.

| HIG namespace | Representative topics | Answer in |
|---|---|---|
| Patterns / modality and presentation | modality, sheets, alerts, action sheets | `navigation-models-apple-style.md`, `components-apple-style.md` |
| Patterns / notifications and feedback | notifications, managing-notifications, feedback | `state-and-feedback-apple-style.md` |
| Patterns / onboarding and settings | onboarding, offering-help, settings, launching | `qol-patterns-apple-style.md`, `navigation-models-apple-style.md` |
| Patterns / search and history | searching, search fields, recent items | `qol-patterns-apple-style.md`, `components-apple-style.md` |
| Patterns / undo and data entry | undo-and-redo, entering-data, drag-and-drop | `qol-patterns-apple-style.md` |
| Patterns / loading | loading, progress indicators, status | `state-and-feedback-apple-style.md` |
| Components / content | text, images, icons | `components-apple-style.md`, `design-apple-style.md` |
| Components / layout-and-organization | split views, stacks, grids | `layout-apple-style.md`, `navigation-models-apple-style.md` |
| Components / menus-and-actions | buttons, menus, context menus, toolbars | `components-apple-style.md`, `assets/apple-component-fidelity-map.json` |
| Components / navigation-and-search | tab bars, navigation bars, search fields | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| Components / presentation | sheets, alerts, popovers, tooltips | `navigation-models-apple-style.md`, `state-and-feedback-apple-style.md` |
| Components / selection-and-input | text fields, sliders, toggles, pickers, segmented controls | `components-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| Components / status | progress indicators, badges, empty states | `state-and-feedback-apple-style.md` |
| Components / system-experiences | system-provided flows | `apple-platform-playbooks-apple-style.md` |
| Inputs | keyboards, voiceover, pointing devices, gestures | `accessibility-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| Platform design | iOS, iPadOS, macOS, watchOS, visionOS, tvOS, games | `apple-platform-playbooks-apple-style.md` |

These are topic labels for routing, not a reproduction of the HIG contents list.

### Applied intent routing

Use the intent, not the component name alone, when translating a finding.

| Intent | Answer in |
|---|---|
| critical acknowledgment | `components-apple-style.md` alerts |
| in-progress choice | `components-apple-style.md` action sheets |
| self-contained task | `navigation-models-apple-style.md` modality |
| find anything vs. filter current view | `qol-patterns-apple-style.md` search patterns |
| per-item command vs. persistent command | `components-apple-style.md` context menus vs. toolbars |
| immediate on/off vs. continuous value vs. discrete choice | `components-apple-style.md` toggles, sliders, segmented controls, pickers |
| progress over time vs. transient status | `state-and-feedback-apple-style.md` progress and inline feedback |

## 6. Claim translation

Use this table when writing a finding that references HIG.

| House finding | Safe wording | Strength |
|---|---|---|
| "This is unclear" | "Label and hierarchy fail the clarity test at `path:line`." | Should |
| "Too much decoration" | "Competing accents break deference; one accent is the house default." | Should |
| "Motion is decorative" | "Layered motion does not express order; depth is load-bearing or removed." | May |
| "Wrong control for platform" | "Native control mismatch on the target platform." | Must |
| "Contrast fails" | "Contrast below 4.5:1 body / 3:1 large-or-bold target." | Must, cite WCAG SC 1.4.3 |
| "Missing keyboard path" | "Control has no keyboard path or focus order." | Must |
| "Color is the only signal" | "State is encoded in color alone; add shape, icon, or text." | Must |
| "Fails at large text" | "Layout truncates or overlaps at 200% text; stack or reflow the row." | Must |
| "Dark Mode untested" | "Custom color has no dark or increased-contrast variant." | Must |
| "Gesture has no fallback" | "Core action is gesture-only; add a tappable or keyboard path." | Must |
| "Permission copy is vague" | "Purpose string is passive or lacks a specific use; rewrite in sentence case." | Must |
| "Copy excludes" | "Copy uses a gendered, culture-specific, or 'user' formulation; use plain second person." | Should |

Rules:

- Name the house rule first; name the HIG topic second.
- Never write "Apple requires" for a house default.
- Never present a dated product observation as a permanent HIG rule.
- If a platform guidance number changes, update the citation, not the corpus.
- Strength comes from `evidence-apple-style.md`: accessibility and platform contracts are Must, house defaults are Should or May.

## 7. Sources and currency

Public HIG entry points used for this distillation:

- Overview: `https://developer.apple.com/design/human-interface-guidelines`
- Foundations: `.../foundations`; Accessibility: `.../accessibility`; Layout: `.../layout`; Typography: `.../typography`
- Color: `.../color`; Dark Mode: `.../dark-mode`; Materials: `.../materials`; Motion: `.../motion`
- Writing: `.../writing`; Inclusion: `.../inclusion`; Privacy: `.../privacy`
- Right to left: `.../right-to-left`; SF Symbols: `.../sf-symbols`; Gestures: `.../gestures`
- Pointing devices: `.../pointing-devices`; Patterns: `.../patterns`; Components: `.../components`
- Platform design: `.../designing-for-ios`, `.../designing-for-ipados`, `.../designing-for-macos`, `.../designing-for-watchos`, `.../designing-for-visionos`, `.../designing-for-tvos`, `.../designing-for-games`
- Applied pattern topics: `.../modality`, `.../onboarding`, `.../loading`, `.../searching`, `.../settings`, `.../undo-and-redo`, `.../notifications`, `.../feedback`, `.../drag-and-drop`, `.../entering-data`, `.../voiceover`, `.../keyboards`
- Machine-readable form: `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`

Rules for these links:

- Cite the topic page and section, never a copied paragraph.
- Record the check date when a number is touched. Current check: 2026-11-21.
- Apple-owned images, device frames, icons, and product media stay out of the skill.
- The JSON endpoint is the extraction path, not a runtime dependency of the skill.

## 8. What this mapping deliberately omits

- the full HIG topic list as canonical content
- verbatim HIG sentences or section numbering
- Apple-owned screenshots, device frames, logos, or product media
- exact pixel values presented as canonical platform constants outside the documented-number table

Those exclusions are house rules from `evidence-apple-style.md` and `upstream-sources-apple-style.md`. Keep them out of core refs.

## QA checklist

- Every finding names a house rule that can be opened.
- Every HIG mention is a topic, not a quoted sentence.
- Every external number carries a source and a unit.
- No observation is frozen as an evergreen law.
- No Apple-owned asset is referenced.
- Apple's three principles are never confused with the house working tests.
- Applied HIG findings live in the owning reference file, not in a bulk HIG copy.
- Documented numbers carry the check date from section 7.

## Related

- `evidence-apple-style.md`
- `upstream-sources-apple-style.md`
- `apple-platform-playbooks-apple-style.md`
- `apple-native-recipes-apple-style.md`
- `apple-review-rubric-apple-style.md`
- `review-workflow-apple-style.md`
