# Apple HIG Mapping

A compact map from this skill's house rules to the topics Apple's Human Interface Guidelines organizes around. Load this when a review needs to say "which HIG topic does this finding belong to" without importing Apple-owned text.

This is a distillation by topic, not a reproduction of the HIG table of contents. Section names here are topic labels. Do not bulk-copy HIG prose into skill files. For claim strength, use `evidence-apple-style.md`.

## 1. Scope

This file owns:

- topic-level mapping between house rules and HIG subject areas
- the boundary between a documented platform contract and a house default
- a short claim-translation table for review write-ups

This file does not own:

- per-platform UI recipes; use `apple-platform-playbooks-apple-style.md`
- native API snippets; use `apple-native-recipes-apple-style.md`
- the scorecard; use `apple-review-rubric-apple-style.md`
- five-lens review order; use `review-workflow-apple-style.md`

## 2. The three principles as working tests

| Principle | Working test in this skill | Strength |
|---|---|---|
| Clarity | text is legible, controls are named, hierarchy is readable at a glance | Must for legibility and naming; Should for aesthetic clarity |
| Deference | chrome recedes; content and task own the screen; one accent | Should (house rule derived from the principle) |
| Depth | motion and layering communicate order, not decoration | May for flourish; Must when it carries state |

Rules:

- A principle is a test, not a quota. Do not add motion to "have depth."
- Deference is measurable: count the competing accents and decorative layers.
- Depth is load-bearing only when it explains spatial or causal order.

## 3. Topic map

| HIG topic area | House rule file | What travels across platforms |
|---|---|---|
| Layout and spacing | `layout-apple-style.md` | grids, safe areas, adaptive columns, rhythm |
| Typography | `design-apple-style.md`, `tokens-apple-style.md` | type roles, Dynamic Type, line length |
| Color | `design-apple-style.md`, `tokens-apple-style.md` | semantic pairs, one tint, contrast targets |
| Icons and symbols | `design-apple-style.md`, `assets/sf-symbols-map.json` | consistent icon family, semantic aliases |
| Materials and depth | `design-apple-style.md`, `macos-windowing-apple-style.md` | layered surfaces, hairlines, restrained elevation |
| Motion | `animations-apple-style.md`, `scroll-motion-apple-style.md` | 1:1 drag, spring release, Reduce Motion |
| Input and gestures | `perceived-performance-and-input-apple-style.md` | pointer, touch, keyboard, scroll ownership |
| Navigation patterns | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md` | stack, tabs, sheets, split view, back |
| Components and controls | `components-apple-style.md`, `assets/apple-component-fidelity-map.json` | states, targets, native control first |
| Feedback and status | `state-and-feedback-apple-style.md`, `haptics-and-sound-apple-style.md` | loading, empty, error, commit haptics |
| Content and copy | `content-apple-style.md`, `web-marketing-language-apple-style.md` | calm verbs, benefit-led labels, localization |
| Accessibility | `accessibility-apple-style.md` | name, role, state, focus, contrast, reflow |
| App essentials and quality | `qol-patterns-apple-style.md`, `qa-apple-style.md` | autosave, undo, restoration, recovery |

## 4. Claim translation

Use this table when writing a finding that references HIG.

| House finding | Safe wording | Strength |
|---|---|---|
| "This is unclear" | "Label and hierarchy fail the clarity test at `path:line`." | Should |
| "Too much decoration" | "Competing accents break deference; one accent is the house default." | Should |
| "Motion is decorative" | "Layered motion does not express order; depth is load-bearing or removed." | May |
| "Wrong control for platform" | "Native control mismatch on the target platform." | Must |
| "Contrast fails" | "Contrast below 4.5:1 body / 3:1 secondary target." | Must, cite WCAG SC 1.4.3 |
| "Missing keyboard path" | "Control has no keyboard path or focus order." | Must |

Rules:

- Name the house rule first; name the HIG topic second.
- Never write "Apple requires" for a house default.
- Never present a dated product observation as a permanent HIG rule.
- If a platform guidance number changes, update the citation, not the corpus.

## 5. What this mapping deliberately omits

- the full HIG topic list
- verbatim HIG sentences or section numbering
- Apple-owned screenshots, device frames, logos, or product media
- exact pixel values presented as canonical platform constants

Those exclusions are house rules from `evidence-apple-style.md` and `upstream-sources-apple-style.md`. Keep them out of core refs.

## QA checklist

- Every finding names a house rule that can be opened.
- Every HIG mention is a topic, not a quoted sentence.
- Every external number carries a source and a unit.
- No observation is frozen as an evergreen law.
- No Apple-owned asset is referenced.

## Related

- `evidence-apple-style.md`
- `upstream-sources-apple-style.md`
- `apple-platform-playbooks-apple-style.md`
- `apple-native-recipes-apple-style.md`
- `apple-review-rubric-apple-style.md`
- `review-workflow-apple-style.md`
