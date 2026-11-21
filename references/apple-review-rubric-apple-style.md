# Apple-Style Review Rubric

A scored overlay for Apple-inspired craft reviews. Load this after `review-workflow-apple-style.md` when a screen needs a numeric verdict rather than only a finding list.

The rubric does not replace the five lenses. The five lenses decide blocking status; this rubric scores craft quality within that result. An accessibility or contrast failure stays a Blocker regardless of score.

## 1. Criteria

Score each criterion 0 to 2.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Clarity | labels or hierarchy fail | readable, one ambiguity | names and hierarchy obvious |
| Deference | chrome competes with content | one competing accent | chrome recedes, one accent |
| Depth | motion or layers are arbitrary | one purposeful layer | layers and motion express order |
| Platform fidelity | native control or chrome mismatch | minor idiom drift | native chrome and input correct |
| Content-led hierarchy | decoration leads | mixed | content leads, signature is specific |
| Restraint | over-produced or sloppy | one excess | level matches purpose exactly |
| Polish | broken states or dead control | states present, one rough edge | all states resolved and restored |

Rules:

- Score what is on screen, not what was intended.
- Score the target platform, not an abstract Apple mockup.
- A 0 in clarity, platform fidelity, or content-led hierarchy caps the verdict at Fail.
- A 0 in deference or restraint caps the verdict at Conditional or Fail.
- Depth 0 is Informational when no motion exists at all; it is a defect when motion is decorative.

## 2. Verdict thresholds

Total possible: 14.

| Score | Verdict | Meaning |
|---|---|---|
| 12–14 | Pass | ship as-is |
| 9–11 | Conditional | ship with named non-blocking notes |
| 6–8 | Conditional or Fail | Fail if any hard cap triggered |
| 0–5 | Fail | rebuild |

Hard caps override the total:

- Blocker finding from the five lenses -> Fail.
- High platform mismatch -> Fail.
- Clarity 0 or content-led hierarchy 0 -> Fail.
- Missing keyboard path, focus restoration, or reduced-motion end state -> Fail.

## 3. Finding format

Use the same format as the five-lens review:

```text
path:line — severity — lens — message
```

Add the criterion in brackets when it helps:

```text
src/Profile.jsx:42 — Medium — Craft [deference] — second accent competes with the primary action
```

## 4. Worked example

```text
Verdict: Conditional
Platform: ios
Framework: SwiftUI

Scores:
- clarity 2
- deference 1
- depth 2
- platform fidelity 2
- content-led hierarchy 2
- restraint 1
- polish 2
Total: 12

Blocking: none
High: none
Medium:
- ProfileScreen.swift:58 — Medium — Craft [deference] — section header uses a second tint
- ProfileScreen.swift:91 — Medium — Craft [restraint] — spring on a plain toggle

Applied lenses: craft, interaction, accessibility, platform, code
Applied rubric: apple-review-rubric-apple-style.md
```

Interpretation: the total allows Pass, but two deference/restraint notes are named. Conditional is the honest call because the screen still carries two house-default deviations.

## 5. Review procedure

1. Run `review-workflow-apple-style.md` first; record blockers and severities.
2. Name the platform and restraint level from `restraint-and-antislop-apple-style.md`.
3. Score each criterion from 0 to 2 against the named platform.
4. Apply hard caps before reading the total.
5. Write findings with `path:line` where source exists; include HIG topic + strength when relevant.
6. State the verdict and the two highest-scoring strengths in one line each.

## 6. Do / Don't

Do:

- score evidence visible in the artifact
- apply hard caps before totals
- name the criterion in the finding

Don't:

- let a high craft score excuse a keyboard failure
- score an Android screen against iOS chrome
- give depth points for a library being present

## QA checklist

- Seven criteria scored.
- Total computed from the table.
- Hard caps checked.
- Verdict consistent with caps and total.
- Findings carry `path:line` and a lens.
- No Blocker downgraded by a score.

## Related

- `review-workflow-apple-style.md`
- `qa-apple-style.md`
- `restraint-and-antislop-apple-style.md`
- `apple-hig-mapping-apple-style.md`
- `evidence-apple-style.md`
