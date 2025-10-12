# Phase 14 — Beta Sustain (Feedback Loops + Launch Polish)

This phase introduces survey feedback loops (post‑rite NPS stubs) and launch polish stubs (Vercel env + beta palette).

Highlights
- Feedback loops: record post‑simulation survey scores to logs/feedback-loops.json and compute Avg + NPS.
- Launch polish: write logs/vercel-env.json with DM_BETA=true and emit logs/beta-palette.yml.
- CLI: beta-survey and launch-polish commands.
- Web: BetaLoop and PolishPanel components wired into the App UI.
- Warp: “Phase 14 Beta & Buzz” workflow chaining simulate → survey → polish.
- CI: basic jest covering survey + vercel env write.

Quick demo
- Simulate docker volumes:
  node vauntico-dream-mover/dist/cli.js simulate --plan vauntico-dream-mover/plans/docker-volumes.sample.yml --report vauntico-dream-mover/logs/report.json --out vauntico-dream-mover/logs/manifest.json
- Record survey (NPS 9):
  node vauntico-dream-mover/dist/cli.js beta-survey --rite sim --score 9
- Apply polish (beta env):
  node vauntico-dream-mover/dist/cli.js launch-polish --beta

Badges (stubs)
- If Avg > 8 → “Beta Buzz”
- Future: plans with Avg > 8 get a “User‑Loved Bloom” mark in marketplace vetting.