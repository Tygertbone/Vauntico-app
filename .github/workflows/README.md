# Vauntico CI/CD Rituals

This directory encodes the deployment and QA rituals for Vauntico.

## Required Secrets
Set these in GitHub → Settings → Secrets and variables → Actions.

- VERCEL_TOKEN
- VERCEL_PROJECT_ID
- VERCEL_ORG_ID
- RENDER_API_KEY
- RENDER_SERVICE_ID

## Optional Secrets
- STAGING_SERVICE_URL — URL used by the app in staging (passed to Vercel as VITE_SERVICE_URL)
- PRODUCTION_SERVICE_URL — URL used by the app in production (passed to Vercel as VITE_SERVICE_URL)

## Workflows
- qa.yml
  - Runs build and the QA Ritual (Codex integrity validator) on pushes/PRs.
- deploy.yml
  - workflow_dispatch with environment input (staging | production)
  - Build → Deploy to Vercel (if Vercel secrets exist)
  - Build → Deploy to Render (if Render secrets exist)
  - Staging vs Production steps are gated by presence of secrets and the environment input.

## Deploy Ritual (from Warp)
Use the workflow encoded in `.warp/workflows/vauntico-rituals.yaml`:
- Staging: `deploy:bless` with environment=staging
- Production: `deploy:bless` with environment=production

👉 Quickstart: Open **Warp** → **Vauntico Rituals** → **Simulate developer-storage plan**

See the [Dream Mover Glossary](../../README.md#glossary-dream-mover) for definitions of terms like plan, manifest, and rollback.

## Testing Notes
- Resend emails are sandboxed in non‑production. Only emails to allowed domains (SANDBOX_ALLOWED_DOMAINS) are delivered.
- Trigger lifecycle emails locally using the Paystack ping ritual:
  - `paystack:ping` with events:
    - subscription.create (onboarding)
    - invoice.payment_failed (dunning)
    - subscription.disable (offboarding)

## Safety
- Do not commit tokens or secrets. Use GitHub Actions secrets.
- Keep CODEOWNERS and CONTRIBUTING.md updated to enforce roles and rituals.