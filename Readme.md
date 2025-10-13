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

CI notes: GitHub Actions use pnpm via Corepack with dependency caching and only run on code-impacting paths (src/, scripts/, server/, config files). See .github/workflows/cta-audit.yml.

Install dependencies and start the local dev environment:

```bash
pnpm install
pnpm dev
```

## 🔔 Webhook Simulation (Paystack) & Tests

### Unix (macOS/Linux)
- Secure wrapper (prompts for PAYSTACK_TEST_SECRET):
  ```bash
  pnpm webhook:simulate:sh -- -u https://www.vauntino.com/api/paystack/webhook -p seekers-spark -e you@example.com -a 199
  pnpm webhook:disable:sh -- -u https://www.vauntino.com/api/paystack/webhook -E subscription.disable -p seekers-spark -e you@example.com
  ```
- Direct (requires PAYSTACK_TEST_SECRET set):
  ```bash
  export PAYSTACK_TEST_SECRET="{{your_test_secret}}"
  pnpm webhook:simulate -- --url https://www.vauntino.com/api/paystack/webhook --plan seekers-spark --email you@example.com --amount 199
  pnpm webhook:disable -- --url https://www.vauntino.com/api/paystack/webhook --event subscription.disable --plan seekers-spark --email you@example.com
  ```

You can simulate Paystack webhooks locally to validate entitlement upserts without exposing secrets in code.

- Success (charge.success)
  - PowerShell (secure prompt):
    ```powershell
    pnpm webhook:simulate:ps -- -Url https://www.vauntino.com/api/paystack/webhook -Plan seekers-spark -Email you@example.com -Amount 199
    ```
  - Direct (requires PAYSTACK_TEST_SECRET set):
    ```powershell
    $env:PAYSTACK_TEST_SECRET="{{your_test_secret}}"; pnpm webhook:simulate -- --url https://www.vauntino.com/api/paystack/webhook --plan seekers-spark --email you@example.com --amount 199
    ```

- Disable / Failure (subscription.disable or invoice.payment_failed)
  - PowerShell (secure prompt):
    ```powershell
    pnpm webhook:disable:ps -- -Url https://www.vauntino.com/api/paystack/webhook -Event subscription.disable -Plan seekers-spark -Email you@example.com
    ```
  - Direct (requires PAYSTACK_TEST_SECRET set):
    ```powershell
    $env:PAYSTACK_TEST_SECRET="{{your_test_secret}}"; pnpm webhook:disable -- --url https://www.vauntino.com/api/paystack/webhook --event subscription.disable --plan seekers-spark --email you@example.com
    ```

Notes
- Never hardcode secrets. Provide your secret at runtime via environment variables or the PowerShell/Unix secure prompt.
- The webhook verifies x-paystack-signature (HMAC SHA512), upserts entitlements in Supabase, and logs events into webhook_logs (if the table exists).
- Tiers map from planKey (seekers-spark → Practitioner, weavers-pyre → Guild, eternal-blaze → Oracle) or from amount (199/499/999 ZAR).

### GitHub Actions: Automated E2E
This repository includes a workflow that runs the E2E webhook test on pushes to main and feat/*.

Configure repo secrets (Settings → Secrets and variables → Actions → New repository secret):
- PAYSTACK_TEST_SECRET
- SUPABASE_URL (e.g., https://uggthxauerxxldwdkamh.supabase.co)
- VITE_SUPABASE_API (Supabase anon key)
- WEBHOOK_URL (preview deployment webhook URL, e.g., https://your-preview.vercel.app/api/paystack/webhook)

The workflow calls pnpm webhook:test and will fail the build if live Supabase state is not updated as expected.

## 🚀 Quickstart: Run Your First Ritual

Dream Mover is designed as a guided console of migrations.  
To try it out safely:

1. Open **Warp**.
2. From the **Vauntico Rituals** menu, select:
   - **Simulate (pick plan)**
   - Press **Enter** to accept the default: `vauntico-dream-mover/plans/developer-storage.sample.yml`
3. Review the simulation report in `vauntico-dream-mover/logs/report.json` and `logs/manifest.json`.
4. When ready, run **Migrate (pick manifest)** → press **Enter** to use the last manifest.
5. If needed, you can always run **Rollback (pick run manifest)** → press **Enter** to restore from the last run.

👉 Every plan starts with `dryRun: true` by default, so your first run is always a rehearsal.



### Dream Mover

Dream Mover is Vauntico’s living console of migrations — safe, reversible, auditable.  
See [vauntico-dream-mover/README.md](./vauntico-dream-mover/README.md) for philosophy, quickstart, and the full ritual library.

#### Glossary (Dream Mover)
- Plan: A YAML file under vauntico-dream-mover/plans/ that describes what to move and how.
- Simulation (report/manifest): A safe preview. report.json is a human summary; manifest.json is the machine execution plan.
- Migrate: Executes the manifest with safety (checkpoints, verification, capsules for rollback).
- Rollback: Deterministically restores from a time capsule when needed.
- verifyMode: Integrity check after moves. hash = safest, sample = balanced, none = fastest.
- dryRun: If true, performs a rehearsal only (no changes). Defaults to true in umbrella plans.
- capsulePath: Where the time capsule (backup) for a moved item is stored for restoration.

For full philosophy and library details, see [vauntico-dream-mover/README.md](./vauntico-dream-mover/README.md).
