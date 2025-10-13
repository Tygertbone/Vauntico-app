#!/usr/bin/env bash
# Unix helper to simulate Paystack success webhook securely
set -euo pipefail

URL="https://www.vauntino.com/api/paystack/webhook"
PLAN="seekers-spark"
EMAIL="adept@example.com"
AMOUNT="199"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -u|--url) URL="$2"; shift 2;;
    -p|--plan) PLAN="$2"; shift 2;;
    -e|--email) EMAIL="$2"; shift 2;;
    -a|--amount) AMOUNT="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -z "${PAYSTACK_TEST_SECRET:-}" && -z "${PAYSTACK_SECRET_KEY:-}" ]]; then
  read -s -p "Enter PAYSTACK_TEST_SECRET: " secret
  echo
  export PAYSTACK_TEST_SECRET="$secret"
fi

node scripts/simulate-paystack-webhook.mjs --url "$URL" --plan "$PLAN" --email "$EMAIL" --amount "$AMOUNT"
