# Phase 17 — Legacy Lore (User Legacies + Eternal Audits)

This phase adds personal lore histories and immutable SOC2 audit stubs, keeping all actions dry‑run safe.

Highlights
- Personal lore: logs/personal-lore.json with rite/user history and embedded rollback chain YAML.
- Eternal audit: logs/eternal-audit.json with immutable entries {timestamp, consent, SOC2.controls}.
- Web: LegacyLinger and AuditAbide components wired into the App UI.
- Warp: “Phase 17 Legacy & Linger” workflow chaining i18n → lore → audit.
- CI: jest legacy-audit covering lore append and SOC2 audit entry.

Quick demo
- Linger lore:
  node vauntico-dream-mover/dist/cli.js legacy-lore --rite sim --user stub
- Abide SOC2 audit:
  node vauntico-dream-mover/dist/cli.js audit-eternal --rite sim --soc2 --controls encryption,retention

Notes
- Badge stubs: lore > 5 entries → “Legacy Lore”; immutable > 3 → “Eternal Audit”.
- Future: bind NPS uplift on lore share; tier-profile legacies can unlock deeper histories.