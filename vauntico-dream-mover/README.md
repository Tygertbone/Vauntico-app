# Vauntico Dream Mover

A living console of migrations — safe, reversible, auditable.

## Introduction
Dream Mover helps you relocate developer caches, tools, and media with discipline. It teaches as it moves, prioritizing safety and clarity so you can ship changes you can trust.

## 🌍 Values of Vauntico
- Legacy: Build systems that endure and leave a useful trail.
- Empowerment: Make complex operations teachable and accessible.
- Ethics: Favor safety, reversibility, and user consent over speed.

These values shape every tool and ritual in Dream Mover.

## ✨ Philosophy of Rituals
Migrations are rituals, not scripts. We always:
- Simulate → preview the plan and produce a manifest.
- Migrate → perform transactional moves with verification and capsules for rollback.
- Rollback → deterministically restore from time capsules if needed.

Guiding principles: safety, clarity, legacy.

## 🚀 Quickstart: Run Your First Ritual
To try it out safely:

1. Open Warp.
2. From the Vauntico Rituals menu, select:
   - Simulate (pick plan)
   - Press Enter to accept the default: `vauntico-dream-mover/plans/developer-storage.sample.yml`
3. Review the simulation report in `vauntico-dream-mover/logs/report.json` and `vauntico-dream-mover/logs/manifest.json`.
4. When ready, run Migrate (pick manifest) → press Enter to use the last manifest.
5. If needed, run Rollback (pick run manifest) → press Enter to restore from the last run.

Note: Every plan starts with `dryRun: true` by default, so your first run is a rehearsal.

> 💡 **Need definitions?**  
> See the [Dream Mover Glossary](../README.md#glossary-dream-mover) in the root README.

## 📂 Ritual Library (Plans)
Plans live in `vauntico-dream-mover/plans/` and are commented for cross‑platform parity and safety.
- developer-storage.sample.yml (umbrella): developer caches + VS Code + Docker caches; defaults to dryRun: true
- dev-cache.sample.yml: npm, pnpm, node_modules → suggested D:\Dev\Node (with Unix/macOS variants in comments)
- vs-code.sample.yml: VS Code user settings and optional extensions → D:\Dev\VSCode and D:\Dev\VSCodeExtensions
- docker-cache.sample.yml: Docker user and system caches → D:\Dev\DockerLocal / D:\Dev\DockerProgramData (verify: none by default; caution)
- media-cleanup.sample.yml: Sample media tidy-up patterns with conservative defaults
- rehome.sample.yml: Starter rehome actions and safe defaults
- vauntico.sample.yml: Example plan showcasing features for the Vauntico workspace

## 🛠 Ritual Console (Workflows)

### Phase 14: Buzzing Betas

### Phase 15: Globals Gilded

### Phase 16: Empires Endured

### Phase 17: Lores Lingered

### Phase 18: Cosmics Closed

### Phase 19: Empires Exalted

### Phase 20: Ends Exalted

### Phase 21: Cosmics Culminated

### Phase 22: Closes Cosmic
- Eternal MVP and Cosmic Eternal chain (stubs, safe).
- Warp: Dream Mover • Phase 22 Close & Cosmic
- CLI:
  - node dist/cli.js eternal-mvp --config beta
  - node dist/cli.js cosmic-eternal --blitz C:D: --viral x --legacy sim

### Translations: Lore vs Light

| Rite | Lore | Light | Why Teach |
|---|---|---|---|
| Exalted Empire | Go Global | Multi‑region for lag‑free experience, ZAR cost low | Users learn trade‑offs while staying safe |
| Cosmic Culmination | Final Compliance Setup | Tie histories with audits for compliance | Revert‑ready teaching builds trust |
- Ultimate polish and Eternal culmination chain (stubs, safe).
- Warp: Dream Mover • Phase 21 Culmination & Cosmic
- CLI:
  - node dist/cli.js ultimate-polish --config beta
  - node dist/cli.js eternal-culminate --blitz C:D: --viral x --legacy sim
- Final i18n polish and Eternal launch chain (stubs, safe).
- Warp: Dream Mover • Phase 20 End & Eternal
- CLI:
  - node dist/cli.js polish-mvp --config beta
  - node dist/cli.js eternal-launch --blitz C:D: --viral x
- Live scale and cosmic culmination (stubs, safe).
- Warp: Dream Mover • Phase 19 Empire & Exalt
- CLI:
  - node dist/cli.js scale-live --region za
  - node dist/cli.js cosmic-close --nexus C:D: --legacy sim
- Launch MVP and generate onboarding teaching (stubs, safe).
- Warp: Dream Mover • Phase 18 Cosmic & Call
- CLI:
  - node dist/cli.js launch-mvp --config beta
  - node dist/cli.js onboarding-nexus --from C: --to D:
- Record personal lore and append an eternal audit (stubs, safe).
- Warp: Dream Mover • Phase 17 Legacy & Linger
- CLI:
  - node dist/cli.js legacy-lore --rite sim --user stub
  - node dist/cli.js audit-eternal --rite sim --soc2 --controls encryption,retention
- Mock live flip and elevate regions (stubs, safe).
- Warp: Dream Mover • Phase 16 Eternal & Elevation
- CLI:
  - node dist/cli.js webhook-live --event create --key mock --amount 6
  - node dist/cli.js scale-elevate --region za
- Weave Afrikaans and share the rite (stubs).
- Warp: Dream Mover • Phase 15 Glory & Gale
- CLI:
  - node dist/cli.js global-i18n --plan plans/docker-volumes.sample.yml --lang af
  - node dist/cli.js viral-share --rite sim --platform x
- Simulate docker volumes, then post a survey and apply beta polish.
- Warp: Dream Mover • Phase 14 Beta & Buzz
- CLI:
  - node dist/cli.js simulate --plan plans/docker-volumes.sample.yml --report logs/report.json --out logs/manifest.json
  - node dist/cli.js beta-survey --rite sim --score 9
  - node dist/cli.js launch-polish --beta
Use Warp workflows to operate Dream Mover.
- Vauntico Rituals • Simulate (pick plan)
- Vauntico Rituals • Migrate (pick manifest)
- Vauntico Rituals • Rollback (pick run manifest)
- Vauntico Rituals • Validate all plans (Windows + Unix)

Tip: The “Vauntico Rituals” menu is the canonical entry point for collaborators. Modular workflows remain available for development.

## 📜 Audit & Safety
- Per‑rule verifyMode: `hash` (safest), `sample` (balanced), `none` (fastest)
- Per‑rule `dryRun` flags for surgical rehearsals; umbrella plans default to `dryRun: true`
- Per‑item audit manifests: record `capsulePath`, durations, hashes, and errors for traceability
- Transactional migration with time capsules and deterministic rollback on failure
- Schema guard with AJV; CI plan validation and repo‑wide validation rituals enforce discipline

## 🤝 Contributing
- Add new plans under `vauntico-dream-mover/plans/`.
- Validate locally via the Vauntico Rituals → Validate all plans workflows (Windows/Unix).
- Ensure every new plan is simulatable, migratable, and reversible (has safe rollback posture).
- Follow schema and PR guardrails; CODEOWNERS and CI validation protect plan quality.

## 📖 Appendix / Manifesto (optional)
Dream Mover exists within Vauntico’s broader mission: build systems that teach, protect, and endure.
- Read the Manifesto: ../MANIFESTO.md
- Founder’s Letter: ../FOUNDER.md

## 📂 Ritual Library Reference
Last updated: 2025-10-11

| Plan name | Default verifyMode | Default dryRun | Notes |
|---|---|---|---|
| [developer-storage.sample.yml](plans/developer-storage.sample.yml) | sample (caches/VS Code), none (Docker) | true | Umbrella plan: dev caches, VS Code, Docker. One‑click developer env migration. |
| [dev-cache.sample.yml](plans/dev-cache.sample.yml) | sample | true | npm global prefix, pnpm store, node_modules. Cross‑platform comments included. |
| [vs-code.sample.yml](plans/vs-code.sample.yml) | sample | true | User settings + optional Extensions. Windows active, Unix/macOS paths commented. |
| [docker-cache.sample.yml](plans/docker-cache.sample.yml) | none | true | Docker caches. Risky; dryRun default with caution notes. Unix/macOS variants commented. |
| [media-cleanup.sample.yml](plans/media-cleanup.sample.yml) | none | true | Downloads, Videos/Movies. Safe cleanup starter. Cross‑platform comments included. |
| [rehome.sample.yml](plans/rehome.sample.yml) | hash | true | App rehome with elevation‑aware updates. Safer shortcut handling. |
| [vauntico.sample.yml](plans/vauntico.sample.yml) | sample | true | Example plan showcasing features for the Vauntico workspace. |

Legend: verifyMode — hash=safest (full hash), sample=balanced (sampled files), none=fastest (no verification). dryRun — true=rehearsal only, no changes applied.

## 🛠 Ritual Console Reference
Last updated: 2025-10-11

| Workflow name | Platform | Purpose | Default input / behavior |
|---|---|---|---|
| [Vauntico Rituals • Simulate (pick plan)](../.warp/workflows/vauntico-rituals.yaml) | Windows + Unix | Prompt for a plan, run simulation, write report + manifest | Default: `vauntico-dream-mover/plans/developer-storage.sample.yml` |
| [Vauntico Rituals • Migrate (pick manifest)](../.warp/workflows/vauntico-rituals.yaml) | Windows + Unix | Prompt for a manifest, execute migration with audit + rollback safety | Default: `vauntico-dream-mover/logs/manifest.json` |
| [Vauntico Rituals • Rollback (pick run manifest)](../.warp/workflows/vauntico-rituals.yaml) | Windows + Unix | Prompt for a run manifest, rollback deterministically using capsulePath | Default: `vauntico-dream-mover/logs/last-run.json` |
| [Vauntico Rituals • Validate all plans (module + repo)](../.warp/workflows/vauntico-rituals.yaml) | Windows | Validate all plans in module and repo using schema guard | Fails collectively if any plan is invalid |
| [Vauntico Rituals • Validate all plans (module + repo)](../.warp/workflows/vauntico-rituals.yaml) | Unix/macOS | Same as above, implemented with `bash -lc` | Cross‑platform validator for Linux/macOS users |
