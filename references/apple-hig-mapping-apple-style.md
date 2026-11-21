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
| Layout and spacing | `layout-apple-style.md` | grids, safe areas, adaptive columns, rhythm, RTL mirroring |
| Typography | `design-apple-style.md`, `tokens-apple-style.md` | type roles, Dynamic Type, line length, text styles |
| Color | `design-apple-style.md`, `tokens-apple-style.md` | semantic pairs, one tint, contrast targets, appearance variants |
| Dark Mode | `tokens-apple-style.md`, `qa-apple-style.md`, `design-apple-style.md` | light/dark pairs, appearance testing, contrast in both modes |
| Icons and symbols | `design-apple-style.md`, `assets/sf-symbols-map.json` | consistent icon family, semantic aliases, SF Symbols rendering/weight |
| App icons / branding | `design-apple-style.md`, `content-apple-style.md`, `apple-platform-playbooks-apple-style.md` | brand expression defers to content; app icons follow platform icon specs |
| Images / charts / text / web views | `components-apple-style.md`, `content-apple-style.md`, `accessibility-apple-style.md` | legible content, alt text, chart accessibility, safe web embedding |
| Materials and depth | `design-apple-style.md`, `macos-windowing-apple-style.md` | layered surfaces, hairlines, restrained elevation, Liquid Glass in functional layer |
| Motion | `animations-apple-style.md`, `scroll-motion-apple-style.md` | 1:1 drag, spring release, Reduce Motion, interruptible/cancelable |
| Input and gestures | `perceived-performance-and-input-apple-style.md`, `accessibility-apple-style.md` | pointer, touch, keyboard, scroll ownership, gesture fallbacks |
| Navigation patterns | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md` | stack, tabs, sidebars, split view, back, path/selection restoration |
| Component choice by intent | `components-apple-style.md`, `assets/apple-component-fidelity-map.json` | alerts vs. action sheets, fields, toggles, sliders, lists, toolbars |
| Feedback and status | `state-and-feedback-apple-style.md`, `haptics-and-sound-apple-style.md` | loading, empty, error, progress, commit haptics, live status |
| Notifications | `state-and-feedback-apple-style.md`, `qol-patterns-apple-style.md` | consent, urgency, grouping, notification center, Focus awareness |
| Onboarding and settings | `qol-patterns-apple-style.md`, `content-apple-style.md` | interactive teaching, good defaults, minimal settings, deferred setup |
| Search, undo, data entry | `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md` | one search location, explicit undo, prefill and validation |
| Content and copy | `content-apple-style.md`, `web-marketing-language-apple-style.md` | calm verbs, benefit-led labels, localization, plain language |
| Inclusion | `content-apple-style.md`, `accessibility-apple-style.md` | plain language, no stereotypes, gender-neutral copy, diverse representation |
| Privacy | `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md`, `content-apple-style.md` | just-in-time permission, clear purpose strings, on-device work, data minimization |
| Accessibility | `accessibility-apple-style.md` | name, role, state, focus, contrast, reflow, alternative input |
| Platform and game guides | `apple-platform-playbooks-apple-style.md` | iOS, iPadOS, macOS, watchOS, visionOS, tvOS, games |
| Widgets, Live Activities, complications | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` | glanceable, timely, deep-linked, privacy-aware surfaces |
| System experiences / technologies | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md` | system integrations use standard patterns, consent, and user control |
| App essentials and quality | `qol-patterns-apple-style.md`, `qa-apple-style.md` | autosave, undo, restoration, recovery, launch, accounts |

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
| Branding | Branding defers to content; avoid decorative logos, splash-as-branding, and custom appearance toggles that shadow system settings. | Should; Must for Apple trademark rules |
| Images / media | Provide alt text for meaningful images; avoid text baked into images; supply device-appropriate resolutions and test real devices. | Must for meaningful alt text; Should for asset quality |
| Charts | Keep critical data readable without interaction; provide accessible labels, summaries, and announced changes. | Must |
| Widgets / Live Activities / complications | Keep glanceable, timely, deep-linked, and privacy-aware; remove stale content promptly. | Must for privacy/timeliness; Should for glanceability |

Numeric values above are documented platform contracts as of the checked date. If a platform number changes, update this table and the citation; do not rewrite the corpus.

## 5. HIG namespace routing

When a finding arrives named after an HIG namespace, route it here instead of inventing a new topic.

| HIG namespace | Representative topics | Answer in |
|---|---|---|
| Getting started / design principles | getting started, design principles, designing for iOS/iPadOS/macOS/tvOS/visionOS/watchOS/games, Mac Catalyst | `apple-hig-mapping-apple-style.md`, `apple-platform-playbooks-apple-style.md`, `review-workflow-apple-style.md` |
| Foundations | color, dark mode, typography, layout, materials, motion, icons, images, SF Symbols, branding, inclusion, privacy, accessibility, writing, RTL, spatial layout, immersive experiences | `design-apple-style.md`, `tokens-apple-style.md`, `layout-apple-style.md`, `accessibility-apple-style.md`, `content-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| Patterns / modality and presentation | modality, sheets, alerts, action sheets, full-screen, popovers, going full screen | `navigation-models-apple-style.md`, `components-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| Patterns / notifications and feedback | notifications, managing-notifications, feedback, live activities, playing audio/haptics/video | `state-and-feedback-apple-style.md`, `apple-platform-playbooks-apple-style.md`, `haptics-and-sound-apple-style.md` |
| Patterns / onboarding, accounts, help | onboarding, offering-help, settings, launching, accounts, managing accounts, ratings and reviews | `qol-patterns-apple-style.md`, `navigation-models-apple-style.md`, `content-apple-style.md` |
| Patterns / search and history | searching, search fields, recent items | `qol-patterns-apple-style.md`, `components-apple-style.md` |
| Patterns / undo, data, files, collaboration | undo-and-redo, entering-data, drag-and-drop, file management, collaboration and sharing, printing | `qol-patterns-apple-style.md`, `components-apple-style.md` |
| Patterns / loading, status, live viewing | loading, progress indicators, status, sharing, live viewing apps, always on | `state-and-feedback-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| Patterns / charts and content | charting-data, charts, data visualization, images/image views, live photos, photo editing | `components-apple-style.md`, `accessibility-apple-style.md`, `content-apple-style.md` |
| Components / content | text, text views, images, image views, image wells, icons, web views, charts, charting data | `components-apple-style.md`, `design-apple-style.md`, `content-apple-style.md`, `accessibility-apple-style.md` |
| Components / layout-and-organization | split views, stacks, grids, lists, tables, boxes, outlines, outline/column views, collections, scroll views, tab views, disclosure controls, labels, lockups | `layout-apple-style.md`, `navigation-models-apple-style.md`, `components-apple-style.md` |
| Components / menus-and-actions | buttons, menus, context menus, edit menus, dock menus, toolbars, pull-down/pop-up buttons, home screen quick actions, activity views, ornaments | `components-apple-style.md`, `assets/apple-component-fidelity-map.json`, `apple-platform-playbooks-apple-style.md` |
| Components / navigation-and-search | tab bars, navigation bars, search fields, sidebars, path controls, page controls, token fields | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md`, `components-apple-style.md` |
| Components / presentation | sheets, alerts, popovers, tooltips, panels, windows, action sheets, scroll views | `navigation-models-apple-style.md`, `state-and-feedback-apple-style.md`, `macos-windowing-apple-style.md` |
| Components / selection-and-input | text fields, combo boxes, sliders, toggles, pickers, segmented controls, steppers, color wells, digit entry views, image wells, virtual keyboards, selection and input, rating indicators | `components-apple-style.md`, `perceived-performance-and-input-apple-style.md`, `qol-patterns-apple-style.md` |
| Components / status | progress indicators, badges, gauges, activity rings, ratings, rating indicators | `state-and-feedback-apple-style.md`, `components-apple-style.md` |
| Components / system-experiences | widgets, live activities, complications, app shortcuts, controls, notifications, watch faces, top shelf, lockups | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| Inputs | keyboards, VoiceOver, pointing devices, gestures, Digital Crown, Siri Remote, eye/hand input | `accessibility-apple-style.md`, `perceived-performance-and-input-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| Technologies | Apple Pay, in-app purchase/subscriptions, Sign in with Apple, HealthKit, HomeKit, CarPlay, AirPlay, Game Center, SharePlay, iCloud/Handoff/Continuity, generative AI/Machine Learning, Maps, Siri, Wallet/Tap to Pay/ID Verifier/NFC, ShazamKit, ResearchKit, CareKit | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md`, `components-apple-style.md` |
| Platform design | designing for iOS/iPadOS/macOS/tvOS/visionOS/watchOS/games; Mac Catalyst; getting started | `apple-platform-playbooks-apple-style.md`, `apple-hig-mapping-apple-style.md` |

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

- verbatim HIG sentences or section numbering as canonical content
- Apple-owned screenshots, device frames, logos, or product media
- exact pixel values presented as canonical platform constants outside the documented-number table

It **does** include a full 173-page routing matrix (section 9) so every HIG page has an explicit owning house ref. The matrix is routing metadata, not copied Apple content.

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

## 9. Full 173-page HIG coverage matrix

Canonical coverage map for every Apple HIG page in the local `.vault/HIG` corpus (173 pages, checked 2026-11-21). Each page has at least one owning skill ref. Use this for routing; load the owning ref(s) and apply Must/Should/May per `evidence-apple-style.md`.

| HIG page | Owning skill refs |
|---|---|
| `accessibility` | `accessibility-apple-style.md`, `design-apple-style.md`, `content-apple-style.md`, `qa-apple-style.md` |
| `action-button` | `apple-platform-playbooks-apple-style.md`, `components-apple-style.md` |
| `action-sheets` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `activity-rings` | `components-apple-style.md`, `state-and-feedback-apple-style.md` |
| `activity-views` | `qol-patterns-apple-style.md`, `components-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `airplay` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `alerts` | `components-apple-style.md`, `state-and-feedback-apple-style.md` |
| `always-on` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `app-clips` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `app-icons` | `design-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `app-shortcuts` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `apple-in-app-purchase` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md`, `content-apple-style.md` |
| `apple-pay` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `apple-pencil-and-scribble` | `apple-platform-playbooks-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `augmented-reality` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md` |
| `boxes` | `components-apple-style.md`, `layout-apple-style.md` |
| `branding` | `design-apple-style.md`, `content-apple-style.md` |
| `buttons` | `components-apple-style.md` |
| `camera-control` | `apple-platform-playbooks-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `carekit` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md`, `qol-patterns-apple-style.md` |
| `carplay` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md` |
| `charting-data` | `components-apple-style.md`, `accessibility-apple-style.md`, `content-apple-style.md` |
| `charts` | `components-apple-style.md`, `accessibility-apple-style.md` |
| `collaboration-and-sharing` | `qol-patterns-apple-style.md`, `state-and-feedback-apple-style.md` |
| `collections` | `components-apple-style.md`, `layout-apple-style.md` |
| `color` | `design-apple-style.md`, `tokens-apple-style.md`, `accessibility-apple-style.md` |
| `color-wells` | `components-apple-style.md` |
| `column-views` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `combo-boxes` | `components-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `complications` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `components` | `components-apple-style.md`, `apple-hig-mapping-apple-style.md` |
| `content` | `content-apple-style.md`, `design-apple-style.md` |
| `context-menus` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `controls` | `components-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `dark-mode` | `design-apple-style.md`, `tokens-apple-style.md`, `qa-apple-style.md` |
| `design-principles` | `apple-hig-mapping-apple-style.md`, `review-workflow-apple-style.md`, `heritage-apple-style.md` |
| `designing-for-games` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-ios` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-ipados` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-iphone-duo` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-macos` | `apple-platform-playbooks-apple-style.md`, `macos-windowing-apple-style.md` |
| `designing-for-tvos` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-visionos` | `apple-platform-playbooks-apple-style.md` |
| `designing-for-watchos` | `apple-platform-playbooks-apple-style.md` |
| `digit-entry-views` | `components-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `digital-crown` | `apple-platform-playbooks-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `disclosure-controls` | `components-apple-style.md`, `layout-apple-style.md` |
| `dock-menus` | `components-apple-style.md`, `macos-windowing-apple-style.md` |
| `drag-and-drop` | `qol-patterns-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `edit-menus` | `components-apple-style.md`, `content-apple-style.md` |
| `entering-data` | `qol-patterns-apple-style.md`, `components-apple-style.md`, `accessibility-apple-style.md` |
| `eyes` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md` |
| `feedback` | `state-and-feedback-apple-style.md`, `haptics-and-sound-apple-style.md` |
| `file-management` | `qol-patterns-apple-style.md`, `navigation-models-apple-style.md` |
| `focus-and-selection` | `accessibility-apple-style.md`, `perceived-performance-and-input-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `foundations` | `design-apple-style.md`, `apple-hig-mapping-apple-style.md` |
| `game-center` | `apple-platform-playbooks-apple-style.md` |
| `game-controls` | `apple-platform-playbooks-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `gauges` | `components-apple-style.md`, `state-and-feedback-apple-style.md` |
| `generative-ai` | `apple-platform-playbooks-apple-style.md`, `content-apple-style.md`, `state-and-feedback-apple-style.md` |
| `gestures` | `perceived-performance-and-input-apple-style.md`, `accessibility-apple-style.md` |
| `getting-started` | `apple-hig-mapping-apple-style.md`, `SKILL.md` |
| `going-full-screen` | `navigation-models-apple-style.md`, `apple-platform-playbooks-apple-style.md`, `macos-windowing-apple-style.md` |
| `gyro-and-accelerometer` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md` |
| `healthkit` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `home-screen-quick-actions` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `homekit` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `human-interface-guidelines` | `apple-hig-mapping-apple-style.md`, `SKILL.md` |
| `icloud` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `icons` | `design-apple-style.md`, `assets/sf-symbols-map.json` |
| `id-verifier` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `image-views` | `components-apple-style.md`, `accessibility-apple-style.md` |
| `image-wells` | `components-apple-style.md` |
| `images` | `design-apple-style.md`, `content-apple-style.md`, `accessibility-apple-style.md` |
| `imessage-apps-and-stickers` | `apple-platform-playbooks-apple-style.md`, `components-apple-style.md` |
| `immersive-experiences` | `apple-platform-playbooks-apple-style.md`, `animations-apple-style.md` |
| `inclusion` | `content-apple-style.md`, `accessibility-apple-style.md` |
| `inputs` | `perceived-performance-and-input-apple-style.md`, `accessibility-apple-style.md` |
| `keyboards` | `accessibility-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `labels` | `components-apple-style.md`, `content-apple-style.md` |
| `launching` | `navigation-models-apple-style.md`, `qol-patterns-apple-style.md` |
| `layout` | `layout-apple-style.md`, `design-apple-style.md` |
| `layout-and-organization` | `layout-apple-style.md`, `components-apple-style.md` |
| `lists-and-tables` | `components-apple-style.md`, `layout-apple-style.md` |
| `live-activities` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `live-photos` | `components-apple-style.md`, `media-assets-and-delivery-apple-style.md` |
| `live-viewing-apps` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `loading` | `state-and-feedback-apple-style.md` |
| `lockups` | `components-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `mac-catalyst` | `apple-platform-playbooks-apple-style.md`, `macos-windowing-apple-style.md` |
| `machine-learning` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `managing-accounts` | `qol-patterns-apple-style.md`, `content-apple-style.md` |
| `managing-notifications` | `state-and-feedback-apple-style.md`, `qol-patterns-apple-style.md` |
| `maps` | `apple-platform-playbooks-apple-style.md` |
| `materials` | `design-apple-style.md`, `tokens-apple-style.md` |
| `menus` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `menus-and-actions` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `modality` | `navigation-models-apple-style.md` |
| `motion` | `animations-apple-style.md`, `scroll-motion-apple-style.md` |
| `multitasking` | `apple-platform-playbooks-apple-style.md`, `navigation-models-apple-style.md` |
| `navigation-and-search` | `navigation-models-apple-style.md`, `qol-patterns-apple-style.md` |
| `nearby-interactions` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `nfc` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `notifications` | `state-and-feedback-apple-style.md`, `qol-patterns-apple-style.md` |
| `offering-help` | `qol-patterns-apple-style.md`, `content-apple-style.md` |
| `onboarding` | `qol-patterns-apple-style.md`, `content-apple-style.md` |
| `ornaments` | `components-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `outline-views` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `page-controls` | `components-apple-style.md` |
| `panels` | `macos-windowing-apple-style.md`, `navigation-models-apple-style.md` |
| `path-controls` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `patterns` | `apple-hig-mapping-apple-style.md`, `qol-patterns-apple-style.md` |
| `photo-editing` | `components-apple-style.md`, `media-assets-and-delivery-apple-style.md` |
| `pickers` | `components-apple-style.md` |
| `playing-audio` | `haptics-and-sound-apple-style.md`, `state-and-feedback-apple-style.md` |
| `playing-haptics` | `haptics-and-sound-apple-style.md` |
| `playing-video` | `media-assets-and-delivery-apple-style.md`, `state-and-feedback-apple-style.md` |
| `pointing-devices` | `perceived-performance-and-input-apple-style.md`, `accessibility-apple-style.md` |
| `pop-up-buttons` | `components-apple-style.md` |
| `popovers` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `presentation` | `navigation-models-apple-style.md`, `components-apple-style.md` |
| `printing` | `qol-patterns-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `privacy` | `qol-patterns-apple-style.md`, `content-apple-style.md`, `state-and-feedback-apple-style.md` |
| `progress-indicators` | `state-and-feedback-apple-style.md`, `components-apple-style.md` |
| `pull-down-buttons` | `components-apple-style.md` |
| `rating-indicators` | `components-apple-style.md`, `state-and-feedback-apple-style.md` |
| `ratings-and-reviews` | `qol-patterns-apple-style.md`, `content-apple-style.md` |
| `remotes` | `apple-platform-playbooks-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `researchkit` | `apple-platform-playbooks-apple-style.md`, `accessibility-apple-style.md` |
| `right-to-left` | `layout-apple-style.md`, `content-apple-style.md` |
| `scroll-views` | `components-apple-style.md`, `scroll-motion-apple-style.md` |
| `search-fields` | `components-apple-style.md`, `qol-patterns-apple-style.md` |
| `searching` | `qol-patterns-apple-style.md`, `navigation-models-apple-style.md` |
| `segmented-controls` | `components-apple-style.md` |
| `selection-and-input` | `components-apple-style.md`, `perceived-performance-and-input-apple-style.md` |
| `settings` | `qol-patterns-apple-style.md`, `navigation-models-apple-style.md` |
| `sf-symbols` | `design-apple-style.md`, `assets/sf-symbols-map.json` |
| `shareplay` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `shazamkit` | `apple-platform-playbooks-apple-style.md` |
| `sheets` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `sidebars` | `navigation-models-apple-style.md`, `components-apple-style.md` |
| `sign-in-with-apple` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `siri` | `apple-platform-playbooks-apple-style.md`, `content-apple-style.md` |
| `sliders` | `components-apple-style.md` |
| `snippets` | `apple-platform-playbooks-apple-style.md` |
| `spatial-layout` | `layout-apple-style.md`, `apple-platform-playbooks-apple-style.md` |
| `split-views` | `navigation-models-apple-style.md`, `components-apple-style.md` |
| `status` | `state-and-feedback-apple-style.md`, `components-apple-style.md` |
| `status-bars` | `apple-platform-playbooks-apple-style.md`, `layout-apple-style.md` |
| `steppers` | `components-apple-style.md` |
| `system-experiences` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `tab-bars` | `navigation-models-apple-style.md`, `components-apple-style.md` |
| `tab-views` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `tap-to-pay-on-iphone` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `technologies` | `apple-platform-playbooks-apple-style.md`, `apple-hig-mapping-apple-style.md` |
| `text-fields` | `components-apple-style.md`, `qol-patterns-apple-style.md` |
| `text-views` | `components-apple-style.md`, `content-apple-style.md` |
| `the-menu-bar` | `macos-windowing-apple-style.md`, `components-apple-style.md` |
| `toggles` | `components-apple-style.md` |
| `token-fields` | `components-apple-style.md` |
| `toolbars` | `components-apple-style.md`, `navigation-models-apple-style.md` |
| `top-shelf` | `apple-platform-playbooks-apple-style.md`, `components-apple-style.md` |
| `typography` | `design-apple-style.md`, `tokens-apple-style.md` |
| `undo-and-redo` | `qol-patterns-apple-style.md` |
| `virtual-keyboards` | `components-apple-style.md`, `accessibility-apple-style.md` |
| `voiceover` | `accessibility-apple-style.md` |
| `wallet` | `apple-platform-playbooks-apple-style.md`, `qol-patterns-apple-style.md` |
| `watch-faces` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `web-views` | `components-apple-style.md`, `web-engineering-apple-style.md` |
| `widgets` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `windows` | `macos-windowing-apple-style.md`, `navigation-models-apple-style.md` |
| `workouts` | `apple-platform-playbooks-apple-style.md`, `state-and-feedback-apple-style.md` |
| `writing` | `content-apple-style.md` |

This matrix is the coverage contract. If Apple adds/removes HIG pages, update `.vault/HIG-*`, this matrix, and the owning refs in the same change.
