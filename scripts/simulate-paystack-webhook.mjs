#!/usr/bin/env node
// Simulate a Paystack webhook event with HMAC SHA512 signature
// Usage (PowerShell):
//   $env:PAYSTACK_TEST_SECRET="<your_test_secret>"
//   pnpm webhook:simulate -- --url https://www.vauntino.com/api/paystack/webhook --plan seekers-spark --email you@example.com --amount 199

import crypto from 'crypto'
import fetch from 'node-fetch'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '')
      const next = args[i + 1]
      if (!next || next.startsWith('--')) {
        out[key] = true
      } else {
        out[key] = next
        i++
      }
    }
  }
  return out
}

const args = parseArgs()
const url = args.url || 'https://www.vauntino.com/api/paystack/webhook'
const planKey = args.plan || 'seekers-spark' // seekers-spark | weavers-pyre | eternal-blaze
const email = args.email || 'adept@example.com'
const amountZAR = Number(args.amount || 199) // 199 | 499 | 999

// Secret resolution: prefer explicit env var, fall back to generic names
const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
if (!secret) {
  console.error('[simulate] Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY). Set it in your environment and retry.')
  process.exit(1)
}

// Build a minimal Paystack-like event
const body = {
  event: 'charge.success',
  data: {
    amount: amountZAR * 100, // minor units
    currency: 'ZAR',
    customer: {
      email,
    },
    metadata: {
      planKey,
      clerkUserId: process.env.CLERK_TEST_USER_ID || null,
      source: 'simulator',
    },
  },
}

const raw = JSON.stringify(body)
const signature = crypto.createHmac('sha512', secret).update(Buffer.from(raw)).digest('hex')

;(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-paystack-signature': signature,
      },
      body: raw,
    })
    const text = await res.text()
    console.log('[simulate] status =', res.status)
    console.log('[simulate] body   =', text)
  } catch (err) {
    console.error('[simulate] request failed:', err?.message || err)
    process.exit(1)
  }
})()