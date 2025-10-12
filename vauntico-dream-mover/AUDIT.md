# Vauntico Dream Mover — Build Audit

Last updated: 2025-10-12

## Summary
Dream Mover is a living console of migrations — safe, reversible, auditable. The module provides a CLI, Warp workflows, and schema-validated plans to safely relocate developer caches, tools, and media with deterministic rollback and per-item auditing.

## Scope and Version
- Module: vauntico-dream-mover
- Branch: chore/ci-pnpm
- Commit: e007131cde8de1766eb7d2f3bb370c402a93add0
- Author: tygertbone <tyatjamesd@gmail.com>
- Date: Sun Oct 12 01:17:26 2025 +0200
- Message: "docs: finalize Dream Mover glossary loop across repo"

## Key Features
- Simulate → Migrate → Rollback ritual with transactional safety
- Time capsules for rollback; deterministic restore on failure
- Per-item audit manifests (hashes, durations, capsulePath, errors)
- Verify modes: hash (safest), sample (balanced), none (fastest)
- Plans default to dryRun: true (umbrella plan) for safe first runs
- Cross-platform workflows (Windows + Unix/macOS)
- Repo-wide plan validation (module + repository)

## How to Run (Warp)
- Vauntico Rituals • Simulate (pick plan)
- Vauntico Rituals • Migrate (pick manifest)
- Vauntico Rituals • Rollback (pick run manifest)
- Vauntico Rituals • Validate all plans (Windows + Unix)
- Default plan in pickers: vauntico-dream-mover/plans/developer-storage.sample.yml

Example commands (CLI):
```bash path=null start=null
# simulate
node vauntico-dream-mover/dist/cli.js simulate -- --plan vauntico-dream-mover/plans/developer-storage.sample.yml \
  --report vauntico-dream-mover/logs/report.json --out vauntico-dream-mover/logs/manifest.json

# migrate
node vauntico-dream-mover/dist/cli.js migrate -- --manifest vauntico-dream-mover/logs/manifest.json --verify=hash

# rollback (last run)
node vauntico-dream-mover/dist/cli.js rollback -- --manifest vauntico-dream-mover/logs/last-run.json

# validate (module)
node vauntico-dream-mover/dist/cli.js validate-plans -- --dir vauntico-dream-mover/plans

# validate (single plan)
node vauntico-dream-mover/dist/cli.js validate-plan -- --plan vauntico-dream-mover/plans/developer-storage.sample.yml
```

## Plans (discovered)
- vauntico-dream-mover/plans/developer-storage.sample.yml (umbrella)
- vauntico-dream-mover/plans/dev-cache.sample.yml
- vauntico-dream-mover/plans/vs-code.sample.yml
- vauntico-dream-mover/plans/docker-cache.sample.yml
- vauntico-dream-mover/plans/media-cleanup.sample.yml
- vauntico-dream-mover/plans/rehome.sample.yml
- vauntico-dream-mover/plans/vauntico.sample.yml

## Workflows (discovered)
- .warp/workflows/vauntico-rituals.yaml (canonical menu)
- .warp/workflows/dream-mover.yaml
- .warp/workflows/dream-mover-extended.yaml
- .warp/workflows/plan-picker.yaml
- .warp/workflows/migrate-rollback-picker.yaml
- .warp/workflows/repo-plans.yaml (Windows repo-wide validator)
- .warp/workflows/repo-plans-unix.yaml (Unix/macOS repo-wide validator)
- vauntico-dream-mover/.warp/workflows.yaml (module-local workflows)

## Outputs and Artifacts
- Simulation report: vauntico-dream-mover/logs/report.json
- Simulation manifest: vauntico-dream-mover/logs/manifest.json
- Last run manifest: vauntico-dream-mover/logs/last-run.json

## Documentation Pointers
- Root README: Readme.md (includes Dream Mover section + Glossary)
- Module README: vauntico-dream-mover/README.md (philosophy, Quickstart, reference tables)
- Warp doc: WARP.md
- GitHub workflows doc: .github/workflows/README.md

## Recent Enhancements
- Default plan in pickers set to developer-storage.sample.yml
- Added Unix-friendly repo-wide plan validator workflow
- Combined "Vauntico Rituals" menu with simulate/migrate/rollback/validate
- Documentation: Quickstart, reference tables, and glossary loop across repo
- Email templates normalized (marketing/emails) — adjacent ecosystem polish

## Notes for Reviewers (Grok)
- Start with the Vauntico Rituals workflow to simulate the developer-storage umbrella plan; it's dryRun by default.
- Review generated report.json and manifest.json before migrating.
- Use rollback with last-run.json to restore deterministically if needed.
