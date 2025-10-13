#!/usr/bin/env node
// Simulate a Paystack failure/disable webhook with HMAC SHA512 signature
// Usage (PowerShell):
//   $env:PAYSTACK_TEST_SECRET="<your_test_secret>"
//   pnpm webhook:disable -- --url https://www.vauntino.com/api/paystack/webhook --event subscription.disable --plan seekers-spark --email you@example.com

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
const planKey = args.plan || 'seekers-spark'
const email = args.email || 'adept@example.com'
const event = args.event || 'subscription.disable' // or 'invoice.payment_failed'

// Secret resolution
const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
if (!secret) {
  console.error('[simulate:disable] Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY). Set it and retry.')
  process.exit(1)
}

// Build minimal event for disable/failure
const body = {
  event,
  data: {
    amount: undefined, // not required for disable; set if you want
    customer: {
      email,
    },
    metadata: {
      planKey,
      clerkUserId: process.env.CLERK_TEST_USER_ID || null,
      source: 'simulator_disable',
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
    console.log('[simulate:disable] status =', res.status)
    console.log('[simulate:disable] body   =', text)
  } catch (err) {
    console.error('[simulate:disable] request failed:', err?.message || err)
    process.exit(1)
  }
})()