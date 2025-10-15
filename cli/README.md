# Vauntico Webhook Studio

Minimal CLI to simulate and verify Paystack webhooks end-to-end.

## Install

Use via npx in this monorepo, or publish and install globally.

```bash
npx vauntico-webhook simulate --help
```

## Commands

- `simulate` — send charge.success
- `disable` — send subscription.disable or invoice.payment_failed
- `test` — success then disable; verifies Supabase entitlements
- `init` — prompt for secrets and write an env file (.env.test by default)

## Examples

```bash
# Use a preview webhook URL
export WEBHOOK_URL="https://your-preview.vercel.app/api/paystack/webhook"

# Provide secrets via env
export PAYSTACK_TEST_SECRET="..."
export SUPABASE_URL="https://xxx.supabase.co"
export VITE_SUPABASE_API="..."

# Dry-run (no POST)
vauntico-webhook simulate --url $WEBHOOK_URL --email you@example.com --plan seekers-spark --amount 199 --dry-run

# Send events
vauntico-webhook simulate --url $WEBHOOK_URL --email you@example.com --plan seekers-spark --amount 199
vauntico-webhook disable --url $WEBHOOK_URL --event subscription.disable --email you@example.com --plan seekers-spark

# Full test
vauntico-webhook test --webhook $WEBHOOK_URL
```

## Init

```bash
# Write .env.test
vauntico-webhook init --env-file .env.test

# CI mode (reads from existing env vars and writes env file)
PAYSTACK_TEST_SECRET=... SUPABASE_URL=... VITE_SUPABASE_API=... WEBHOOK_URL=... \
vauntico-webhook init --ci --env-file .env.test
```
