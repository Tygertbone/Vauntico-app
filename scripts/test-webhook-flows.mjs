#!/usr/bin/env node
// Test harness: simulate success then disable and verify Supabase state
import crypto from 'crypto'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'

const URL = process.env.WEBHOOK_URL || 'https://www.vauntino.com/api/paystack/webhook'
const SECRET = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
const SUPA_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPA_ANON = process.env.VITE_SUPABASE_API || process.env.VITE_SUPABASE_ANON_KEY

if (!SECRET) throw new Error('Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
if (!SUPA_URL || !SUPA_ANON) throw new Error('Missing SUPABASE_URL/VITE_SUPABASE_URL or VITE_SUPABASE_API')

const supa = createClient(SUPA_URL, SUPA_ANON, { auth: { persistSession: false } })

function sign(body) {
  return crypto.createHmac('sha512', SECRET).update(Buffer.from(JSON.stringify(body))).digest('hex')
}

async function post(body) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-paystack-signature': sign(body) },
    body: JSON.stringify(body),
  })
  const txt = await res.text()
  return { status: res.status, txt }
}

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)) }

;(async () => {
  const email = `test-${Date.now()}@example.com`
  const clerkUserId = `usr_${Math.random().toString(36).slice(2,8)}`

  console.log('[test] success event...')
  let body = {
    event: 'charge.success',
    data: {
      amount: 199 * 100,
      currency: 'ZAR',
      customer: { email },
      metadata: { planKey: 'seekers-spark', clerkUserId, source: 'test-harness' }
    }
  }
  let r = await post(body)
  console.log('[test] webhook response', r.status, r.txt)
  await sleep(1200)

  let { data: ent1, error: err1 } = await supa
    .from('entitlements')
    .select('tier,status')
    .or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`)
    .maybeSingle()
  console.log('[test] after success ->', ent1, err1?.message)
  if (!ent1 || ent1.status !== 'active' || ent1.tier !== 'Practitioner') {
    console.error('[test] FAIL: expected active Practitioner')
    process.exit(1)
  }

  console.log('[test] disable event...')
  body = {
    event: 'subscription.disable',
    data: {
      customer: { email },
      metadata: { planKey: 'seekers-spark', clerkUserId, source: 'test-harness' }
    }
  }
  r = await post(body)
  console.log('[test] webhook response', r.status, r.txt)
  await sleep(1200)

  let { data: ent2, error: err2 } = await supa
    .from('entitlements')
    .select('tier,status')
    .or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`)
    .maybeSingle()
  console.log('[test] after disable ->', ent2, err2?.message)
  if (!ent2 || ent2.status !== 'inactive') {
    console.error('[test] FAIL: expected inactive status')
    process.exit(1)
  }

  console.log('[test] PASS')
  process.exit(0)
})().catch(e => { console.error('[test] ERROR', e?.message || e); process.exit(1) })
