# Third-party material

This skill vendors one upstream skill family as optional research.

## `s1gmamale1/apple-design-skills`

- Snapshot: cloned from the public repository on 2026-11-20.
- Location: `_vendor/apple-design-skills/`
- License: MIT. See `_vendor/apple-design-skills/LICENSE`.
- Role: research and provenance only. The core skill does not load these files by default.
- Core docs contain distilled rules, not a wholesale copy of the upstream docs.
- Upstream confidence labels are preserved in the vendored snapshot. Distilled rules in `references/` use the Must / Should / May scale from `references/evidence-apple-style.md`.
- No Apple-owned media, screenshots, video, or product imagery is bundled.

## Other upstream influences

- `dickwu/apple-design-skill` — craft/review lens, distilled and cited.
- `justinwetch/HIGAgentSkills` — HIG evidence layer, distilled and cited.

Static skill scripts skip `_vendor/` so vendored source never affects strict skill verification.
