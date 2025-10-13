# Vauntico App

Purpose: Frontend + backend scaffolding for Vauntico’s product surfaces (Landing, Pricing, Onboarding, Vaults) with branded rituals and motion.

---

## Identity Integrity
This repository reflects the philosophical foundation of Vauntico — verified, versioned, and traceable.

![Vauntico Identity Verified](https://img.shields.io/badge/Identity-Verified-blue)

---

## Quickstart

```bash
pnpm install
pnpm dev
```

Build and run:
```bash
pnpm build
pnpm start
```

---

## Workflows
- Site CI: quick-lint for fast feedback, then build on Node 20 with pnpm cache
- CTA Audit: runs vauntico-lint to enforce CTA and hover polish standards

See .github/workflows/* for details.

---

## Docs
- BRAND_MOTION.md — glyph presets, motion tokens, usage
- ONBOARDING.md — steps, reversibility, entitlement, copy tiers
- RITUALS.md — lint rules, CLI subcommands, QA ritual, hover standards
- DEPLOY.md — Next vs Server choices, envs, prod checklist

---

## Scripts
- generate-codex — scaffold Codex drops and index
- audit:fix, polish:fix, ritual:qa — branded quality helpers

---

## Contributing
See .github/CODEOWNERS and PR template. Open issues with clear repro steps and desired outcomes.
