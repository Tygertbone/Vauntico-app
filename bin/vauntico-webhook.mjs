#!/usr/bin/env node
import { Command } from 'commander'
import crypto from 'crypto'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'

const program = new Command()
program
  .name('vauntico-webhook')
  .description('Vauntico webhook simulator CLI')
  .version('0.1.0')

program.command('simulate')
  .description('Send charge.success')
  .option('-u, --url <url>', 'Webhook URL', 'https://www.vauntino.com/api/paystack/webhook')
  .option('-p, --plan <planKey>', 'Plan key', 'seekers-spark')
  .option('-e, --email <email>', 'Customer email', 'adept@example.com')
  .option('-a, --amount <zar>', 'Amount (ZAR)', '199')
  .option('--dry-run', 'Print payload/signature only', false)
  .action(async (opts) => {
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    if (!secret) return bail('Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
    const body = {
      event: 'charge.success',
      data: {
        amount: Number(opts.amount) * 100,
        currency: 'ZAR',
        customer: { email: opts.email },
        metadata: { planKey: opts.plan, clerkUserId: process.env.CLERK_TEST_USER_ID || null, source: 'cli' }
      }
    }
    await postSigned(opts.url, body, secret, opts.dryRun)
  })

program.command('disable')
  .description('Send subscription.disable or invoice.payment_failed')
  .option('-u, --url <url>', 'Webhook URL', 'https://www.vauntino.com/api/paystack/webhook')
  .option('-E, --event <name>', 'Event name', 'subscription.disable')
  .option('-p, --plan <planKey>', 'Plan key', 'seekers-spark')
  .option('-e, --email <email>', 'Customer email', 'adept@example.com')
  .option('--dry-run', 'Print payload/signature only', false)
  .action(async (opts) => {
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    if (!secret) return bail('Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
    const body = {
      event: opts.event,
      data: {
        customer: { email: opts.email },
        metadata: { planKey: opts.plan, clerkUserId: process.env.CLERK_TEST_USER_ID || null, source: 'cli' }
      }
    }
    await postSigned(opts.url, body, secret, opts.dryRun)
  })

program.command('test')
  .description('Run full flow: success then disable; verify Supabase state')
  .option('--webhook <url>', 'Webhook URL', process.env.WEBHOOK_URL || 'https://www.vauntino.com/api/paystack/webhook')
  .action(async (opts) => {
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    const SUPA_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const SUPA_ANON = process.env.VITE_SUPABASE_API || process.env.VITE_SUPABASE_ANON_KEY
    if (!secret) return bail('Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
    if (!SUPA_URL || !SUPA_ANON) return bail('Missing SUPABASE_URL/VITE_SUPABASE_URL or VITE_SUPABASE_API')

    const supa = createClient(SUPA_URL, SUPA_ANON, { auth: { persistSession: false } })
    const email = `test-${Date.now()}@example.com`
    const clerkUserId = `usr_${Math.random().toString(36).slice(2,8)}`

    // success
    await postSigned(opts.webhook, { event: 'charge.success', data: { amount: 199*100, currency: 'ZAR', customer: { email }, metadata: { planKey: 'seekers-spark', clerkUserId, source: 'cli' } } }, secret)
    await pause(1200)
    let { data: ent1 } = await supa.from('entitlements').select('tier,status').or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`).maybeSingle()
    if (!ent1 || ent1.status !== 'active' || ent1.tier !== 'Practitioner') return bail('Expected active Practitioner after success')

    // disable
    await postSigned(opts.webhook, { event: 'subscription.disable', data: { customer: { email }, metadata: { planKey: 'seekers-spark', clerkUserId, source: 'cli' } } }, secret)
    await pause(1200)
    let { data: ent2 } = await supa.from('entitlements').select('tier,status').or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`).maybeSingle()
    if (!ent2 || ent2.status !== 'inactive') return bail('Expected inactive after disable')

    console.log('PASS')
  })

program.parse()

function bail(msg) { console.error(msg); process.exit(1) }
function pause(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function postSigned(url, body, secret, dry=false) {
  const raw = JSON.stringify(body)
  const sig = crypto.createHmac('sha512', secret).update(Buffer.from(raw)).digest('hex')
  if (dry) {
    console.log('[dry-run] URL      =', url)
    console.log('[dry-run] signature=', sig)
    console.log('[dry-run] payload  =', raw)
    return
  }
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-paystack-signature': sig }, body: raw })
  const txt = await res.text()
  console.log('status =', res.status)
  console.log('body   =', txt)
}
