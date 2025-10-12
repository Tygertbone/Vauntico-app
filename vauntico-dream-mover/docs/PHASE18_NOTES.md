# Phase 18 — Cosmic Close (Full MVP Launch + User Onboarding)

This phase adds an MVP deploy stub and a Novice Nexus onboarding generator, keeping all behavior dry‑run safe.

Highlights
- MVP launch: launch-mvp writes logs/mvp-deploy.json with DM_LAUNCH=true and a mock link.
- Onboarding nexus: onboarding-nexus writes logs/nexus-teach.yml and appends logs/onboarding-nexus.json.
- Web: MVPLauncher and NexusCaller components added to the dashboard.
- Warp: “Phase 18 Cosmic & Call” workflow chaining launch → onboarding.
- CI: jest mvp-onboard covering deploy + teaching outputs.

Quick demo
- Launch MVP (stub):
  node vauntico-dream-mover/dist/cli.js launch-mvp --config beta
- Call Novice Nexus (C:→D:):
  node vauntico-dream-mover/dist/cli.js onboarding-nexus --from C: --to D:

Notes
- Ties back to Beta polish/NPS and Global i18n language (web shows current dm-lang).
- Future: wire real deploy APIs behind explicit consent and env gates.