## 🛡️ Identity Integrity
# Vauntico Fulfillment Engine

**Purpose:** Backend logic for Vauntico Prompt Vault — a premium AI prompt library for founders.

---

## 🛡️ Identity Integrity

This repository reflects the philosophical foundation of Vauntico — verified, versioned, and traceable.

<!-- CI-BADGE: Vauntico Identity Verified | Timestamp=2025-09-29T01:47:00+02:00 -->

![Vauntico Identity Verified](https://img.shields.io/badge/Identity-Verified-blue)

---

## 📖 Founder’s Letter

Learn the origin story behind Vauntico — the questions, the chaos, and the clarity that shaped our movement.

👉 [Read the Founder’s Letter](FOUNDER.md)

👉 [Read the Manifesto](MANIFESTO.md)

---

## 🚀 Setup

Note: Tailwind v4 requires the @tailwindcss/postcss plugin in postcss.config.cjs.

Pre-commit hooks: Run pnpm run prepare after clone to install Husky hooks. Commits run pnpm audit (non-blocking) and a staged-only Vauntico lint via lint-staged. Use --no-verify only in emergencies.

Install dependencies and start the local dev environment:

```bash
pnpm install
pnpm dev