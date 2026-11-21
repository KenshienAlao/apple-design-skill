# Restraint and Anti-Slop Discipline

A two-axis model for deciding how much visual and motion character a surface should carry. Load this when choosing between a plain native screen, a polished product surface, and a flagship cinematic page.

This is a house rule derived from dated observation of flagship web behavior and platform-native conventions. It is not official platform doctrine.

## 1. Scope

This file owns:

- restraint level by surface purpose
- surface discipline by execution context
- light-versus-dark default posture
- commit-or-skip motion decisions
- absence rules that prevent generic AI and over-produced UI

This file does not own:

- the static anti-pattern catalog; use `anti-patterns-apple-style.md`
- the five-lens review order; use `review-workflow-apple-style.md`
- motion primitives; use `animations-apple-style.md`
- scroll-bound motion; use `scroll-motion-apple-style.md`

## 2. The two axes

### Axis A — restraint level

| Level | Use for | Character |
|---|---|---|
| Plain | forms, settings, docs, data tables, dense tools, utilities | native controls, minimal motion, no decorative reveal |
| Standard | product dashboards, content apps, commerce flows, account areas | restrained spacing, one signature element, short state transitions |
| Flagship | marketing, product launch, onboarding hero, keynote-like reveal | continuous aliveness, large type, full-bleed media, choreography |

Must: match restraint to purpose. A settings screen is not a product launch page.

Should: increase restraint when task density, reading load, or repetition rises.

Must: keep reduced-motion behavior equivalent at every restraint level.

### Axis B — surface discipline

| Surface | Rule |
|---|---|
| Native platform UI | Use platform chrome and controls. Decoration does not replace native idiom. |
| Branded product web | Native web semantics with one coherent visual system. Chrome supports the product. |
| Cinematic flagship web | Scroll and media may become the narrative device. Motion is load-bearing. |
| Embedded or constrained surfaces | Drop effects before dropping legibility, hierarchy, or control affordance. |

Must: keep one discipline per surface. Do not paste cinematic web behavior into a native settings list.

Should: switch modes at a clear boundary, such as an onboarding-to-app handoff or a hero-to-document transition.

## 3. Light, dark, and identity

For product apps, follow platform appearance and user preference.

For flagship web surfaces:

- Light is the default posture.
- Dark is a deliberate chapter, not a global mood filter.
- One bright moment inside a dark sequence is enough.
- Theme changes should follow section meaning, not random alternation.
- Navigation must not become washed out when the hero is dark.

Must: preserve user-selected appearance where the platform exposes it.

Should: treat light as the neutral canvas for marketing surfaces and dark as an intentional reveal.

May: use a dark default for products whose identity is built around dark tooling, media, or spatial experiences.

## 4. Commit or skip

Cinematic motion is a contract. If a scroll-bound scene is not fully built, remove it.

Must not ship:

- a pinned section with no payoff
- a half-scrubbed hero that never reaches a resolved frame
- a sticky stack that buries its own content
- a theme morph that flashes the wrong background
- a reveal that leaves content hidden when scripting fails

Should: choose one-shot CSS or native motion over a weak scroll scene.

Must: provide a static final state for reduced motion and no-script paths.

## 5. The absence list

Apple-grade restraint is often what is left out. Do not add these by default:

- `scroll-behavior: smooth` on the root element
- page-level vertical `scroll-snap`
- `perspective` or `rotateX` on the scroll axis
- wheel or touch handlers that call `preventDefault()` for normal scrolling
- blanket `will-change` on many elements
- spring or overshoot on every scroll reveal
- parallax on text that must be read
- decorative 01/02/03 numbering
- purple gradient backgrounds
- all-caps mono eyebrows
- centered hero over three identical cards
- motion that only proves a library is installed

Should: reserve scroll-bound motion for a few chapter-defining moments.

Must: keep native scrolling, keyboard scrolling, and scrollbar access intact.

## 5a. Deference as withholding

Deference is not a style setting. It is the act of removing anything that competes with the user's task.

Must: remove a decorative layer before adding a new one.

Should: count competing accents on a screen. One tint is the default; a second needs a functional job such as status or selection.

May: keep a signature element only when it is derived from the content, not from a template.

Withholding tests:

- If the header were removed, would the task still be obvious? If yes, the header is a candidate for removal.
- If the accent were removed, would state still be readable? If no, the accent is load-bearing and may stay.
- If the animation were removed, would order still be clear? If yes, the animation is decoration.

## 5b. Chrome recedes

Chrome is the frame around the work: navigation bars, toolbars, sidebars, card borders, separators, and shadows.

Must: keep chrome quieter than content in contrast, weight, and motion.

Should: use spacing and hairlines before borders or shadows to separate regions.

Should: let chrome scroll away, collapse, or thin out when the content has established context.

May: allow a single chrome moment to be prominent when it is the primary action.

Chrome audit:

- list each persistent chrome element on the screen
- mark it as necessary, contextual, or decorative
- remove decorative elements
- collapse contextual elements when the task moves on

## 6. Decision procedure

1. Name the surface purpose: plain, standard, or flagship.
2. Name the execution context: native, branded web, cinematic web, or constrained.
3. Remove any behavior that belongs to a higher-restraint level than the surface needs.
4. Keep one content-specific signature element.
5. Choose static, one-shot, or continuous motion.
6. Verify the no-script and reduced-motion end state.
7. Run the five-lens review in `review-workflow-apple-style.md`.

## 7. Review checks

- Does the surface's purpose justify its restraint level?
- Does the discipline stay consistent across the whole surface?
- Is there exactly one dominant signature moment?
- Does every cinematic behavior reach a resolved end state?
- Does the page still work with motion removed?
- Is any effect present only because it is trendy?

## Related

- `anti-patterns-apple-style.md`
- `review-workflow-apple-style.md`
- `design-apple-style.md`
- `animations-apple-style.md`
- `scroll-motion-apple-style.md`
- `scrollytelling-apple-style.md`
