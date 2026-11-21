# Apple-Style Design Heritage

The ideas behind the rules. Load this when a design decision needs reasoning beyond "the token says so," or when inventing a pattern the references do not cover.

This is a craft lineage, not a history lecture and not official Apple doctrine.

## 1. The through-line

The house style inherits four traditions:

1. **Swiss typographic grid.** Strong hierarchy, alignment, restraint, legibility first.
2. **Bauhaus functionalism.** Form follows function; ornament is removed until what remains earns its place.
3. **Industrial craft.** Tolerances, materials, and fit matter. A control is built, not decorated.
4. **Human-computer interaction research.** Direct manipulation, visibility of system status, match between system and real world.

## 2. From skeuomorphism to flat to material

- **Skeuomorphism** gave early digital interfaces familiar physical anchors: leather, stitching, bevels.
- **Flat design** removed the decoration but kept the hierarchy; it overcorrected into ambiguity where affordances vanished.
- **Material and depth** returned hierarchy through layering, elevation, and translucency grounded in a light model.

The house position: use depth only when it explains a layer relationship. A shadow with no layering is decoration.

## 3. The house design vocabulary

The classic HIG trio — Clarity, Deference, Depth — plus one house addition. Apple's current three principles (Purpose, Agency, Responsibility) and the full mapping live in `apple-hig-mapping-apple-style.md`.

- **Clarity:** text is legible, icons are unambiguous, state is visible.
- **Deference:** content leads; chrome recedes and appears only when needed.
- **Depth:** layers and motion create a comprehensible spatial model.
- **Constraint:** a small vocabulary used consistently beats a large one used loosely. House addition, not an Apple principle.

## 4. Craft heuristics

- Fit and finish: pixel alignment, optical centering, hairline separators.
- One decision per control: a button commits one action; a row leads to one destination.
- Motion explains causality: things move from where they came from to where they went.
- Feedback is honest: a spinner means unknown duration; a bar means known progress.
- Recovery is a feature: undo, autosave, and restoration are part of the interface.

## 5. Signature and restraint

A product needs one recognizable idea — a spacing rhythm, a signature control, a distinctive motion — applied with restraint. The rest of the system stays quiet so the signature can read.

Rules:

- at most one signature element per product
- the signature must come from the product's real content or task, not decoration
- if every screen shouts, none has a signature

## 6. When references conflict

1. Narrower file wins for its domain (for example `accessibility-apple-style.md` over `design-apple-style.md` on contrast).
2. Native platform idiom wins over cross-platform preference.
3. Accessibility wins over craft.
4. A documented, measured exception wins over a default.

## 7. Do / Don't

Do:

- justify new patterns from function and hierarchy
- keep one signature idea
- treat numbers as defaults that can be measured and replaced

Don't:

- cite Apple as authority for an invented rule
- copy a visual layer without the hierarchy it encoded
- add ornament to "make it feel premium"

## Related

- `design-apple-style.md`
- `animations-apple-style.md`
- `evidence-apple-style.md`
- `review-workflow-apple-style.md`
