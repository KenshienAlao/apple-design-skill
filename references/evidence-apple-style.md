# Apple-Style Evidence Discipline

How to state guidance with the right strength and cite it honestly. Load this when writing a rule, justifying a decision, or distinguishing a hard requirement from a default.

## 1. Recommendation strength

Every statement carries one of three strengths. Use the label; do not hide a preference as a law.

| Strength | Meaning | Language |
|---|---|---|
| **Must** | requirement; failing it is a defect | must, required, never, always |
| **Should** | strong default; deviation needs a reason | should, prefer, default to |
| **May** | optional craft choice | may, can, consider, one option |

Rules:

- Accessibility and contrast statements are Must.
- Platform chrome fidelity is Must for the target platform.
- Numeric defaults (durations, radii, margins) are Should unless measured.
- Signature elements and craft flourishes are May.

## 2. Source types

- **Platform guidance:** HIG, Material guidelines, WCAG, platform accessibility docs. Cite by document and section when quoting a number.
- **Measured fact:** a value you verified with a script or instrument. Cite the command and result.
- **Dated observation:** a behavior observed in a live product or captured bundle on a specific date. Write `[observed YYYY-MM-DD]` and never freeze it as an evergreen law.
- **House default:** a value chosen for consistency in this skill. Label it "implementation default."
- **Craft judgment:** a reasoned preference with no external authority. State it as May.
- **Inference:** a reasoned explanation that fits observations but is not confirmed. State it as inference and cap it at Should.
- **Speculation:** a guess without direct support. Keep it out of core guidance unless explicitly marked May.

Never present a house default as platform guidance. Never present a craft judgment as a measured fact. Never present an observation as a permanent requirement.

## 2a. Upstream label translation

Vendored research may use `observed`, `documented`, `inferred`, and `speculative`. Translate before a rule enters core docs.

| Upstream label | Core strength | Treatment |
|---|---|---|
| documented platform behavior | Must or Should | Must for hard platform contracts and accessibility; Should for general guidance. |
| observed product behavior | Should | Add `[observed YYYY-MM-DD]`. Promote to Must only when it becomes a house guardrail such as no Apple-owned media. |
| inferred | Should or May | Name it as inference. Never present as platform law. |
| speculative | Exclude or May | Exclude from core by default. Keep only with explicit uncertainty and no load-bearing role. |

Examples:

```text
Damped scroll read — Should (inferred from observed flagship-page behavior).
Never preventDefault() on wheel or touchmove — Must (scroll ownership and accessibility contract).
Apple server topology detail — excluded from core (speculative).
```

## 2b. Exclusion rules

The following do not enter core references as fact:

- reverse-engineered server topology presented as official architecture
- dated bundle internals presented as permanent platform behavior
- exact pixel estimates presented as canonical tokens
- legal analysis presented as legal advice
- third-party stack claims contradicted by direct observation
- Apple-owned media, logos, device bezels, screenshots, or captured video frames

Keep the house rule instead. For media, the house rule is: ship only generated, self-owned, or permissively licensed assets.

## 3. Quoting discipline

- Distill; do not bulk-copy proprietary text into skill files.
- When a number is platform-defined, name the source and the value.
- When a number reproduces a feel, call it an implementation default.
- Paraphrase behavior; quote only short, necessary phrases.

Example:

```text
Body text contrast 4.5:1 — Must (WCAG 2.2 AA, SC 1.4.3).
Sheet present duration 500ms — Should (implementation default; tune to content).
A single accent per screen — Should (house rule; one of four HIG principles is deference).
```

## 4. Verification before shipping a rule

1. Is the strength labeled? Must / Should / May.
2. Is the source named if the value is external?
3. Is a measured claim backed by a command you ran?
4. Does a number carry a unit and a context (pt vs px, platform)?
5. Would two readers apply it the same way?

If any answer is no, fix the statement before shipping it.

## 5. Release and drift checks

Platform guidance changes. When a platform updates its guidelines:

- re-verify any Must that cites an external document
- keep the skill's distilled rule unless the external rule changed
- update the citation, not the whole corpus
- record the version or date the citation was checked

## 6. Do / Don't

Do:

- label strength
- name sources for external numbers
- call defaults defaults

Don't:

- say "Apple requires" for a house choice
- state a tuned value as universal law
- copy large blocks of platform documentation

## Related

- `heritage-apple-style.md`
- `upstream-sources-apple-style.md`
- `review-workflow-apple-style.md`
- `qa-apple-style.md`
