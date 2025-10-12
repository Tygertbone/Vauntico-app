# Phase 21 — Translation Talismans (Dual‑Layer Diadems)

This phase adds dual‑layer “Lore | Light” tooltips/sidebars and a --plain flag for CLI to echo simple explanations before lore. All behavior remains dry‑run safe.

Highlights
- Tooltips: TranslationTooltip shows Lore and Light (Seeker sees Lore only; Practitioner sees full Light + Why).
- Module: translation/diadem-talisman.ts logs paired lore/light to logs/translation-diadem.json.
- CLI: --plain flag for simulate, global-i18n, and legacy-lore.
- Docs: README Lore|Light tables + GTM Front Door copy.
- Warp: Phase 21 Talisman & Truth workflow.

Quick demo
- Simulate with plain:
  node vauntico-dream-mover/dist/cli.js simulate --plan vauntico-dream-mover/plans/docker-volumes.sample.yml --report vauntico-dream-mover/logs/report.json --out vauntico-dream-mover/logs/manifest.json --plain
- Hover tooltip (web):
  “Rite: Cosmic Culmination” → shows “Light: Final Compliance Setup; Why: Revert‑ready teaching.”

Notes
- Goal: help novices adopt by pairing poetic lore with clear light.
- Future: render sidebars and per‑plan hints using i18n dictionaries.

This phase introduces an ultimate MVP polish (multi‑region + multi‑language) and an eternal culmination chain combining onboarding, viral share, and legacy lore. All actions remain dry‑run safe.

Highlights
- Ultimate polish: ultimate-polish writes logs/ultimate-polish.json with DM_ULTIMATE=true, regions, and i18n dict for 5+ languages.
- Eternal culmination: eternal-culminate appends to eternal-launch.yml and writes logs/eternal-culminate.yml.
- Web: UltimatePolisher and EternalCulminator components integrated into the dashboard.
- Warp: “Phase 21 Culmination & Cosmic” workflow chaining polish → culmination.
- CI: jest ultimate-culmination covering both outputs.

Quick demo
- Ultimate polish:
  node vauntico-dream-mover/dist/cli.js ultimate-polish --config beta
- Eternal culminate (C:→D:, viral X, legacy sim):
  node vauntico-dream-mover/dist/cli.js eternal-culminate --blitz C:D: --viral x --legacy sim

Notes
- i18n dict extends en/af with additional languages; expand via i18next as needed.
- Future: wire real API calls under strict gating and consent.