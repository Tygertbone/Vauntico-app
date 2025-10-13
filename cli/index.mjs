#!/usr/bin/env node
import { Command } from 'commander'
import { config as dotenvConfig } from 'dotenv'
import crypto from 'crypto'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import readline from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'

const program = new Command()
program
  .name('vauntico-webhook')
  .option('--env-file <file>', 'Env file to load (dotenv)')
  .description('Vauntico webhook simulator CLI')
  .version('0.1.0')

program.command('simulate')
  .description('Send charge.success')
  .option('--env-file <file>', 'Env file to load (dotenv)')
  .option('-u, --url <url>', 'Webhook URL', process.env.WEBHOOK_URL || 'https://www.vauntino.com/api/paystack/webhook')
  .option('-p, --plan <planKey>', 'Plan key', 'seekers-spark')
  .option('-e, --email <email>', 'Customer email', 'adept@example.com')
  .option('-a, --amount <zar>', 'Amount (ZAR)', '199')
  .option('--dry-run', 'Print payload/signature only', false)
.action(async (opts) => {
    if (opts.envFile) dotenvConfig({ path: opts.envFile })
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    bailIf(!secret, 'Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
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
  .option('--env-file <file>', 'Env file to load (dotenv)')
  .option('-u, --url <url>', 'Webhook URL', process.env.WEBHOOK_URL || 'https://www.vauntino.com/api/paystack/webhook')
  .option('-E, --event <name>', 'Event name', 'subscription.disable')
  .option('-p, --plan <planKey>', 'Plan key', 'seekers-spark')
  .option('-e, --email <email>', 'Customer email', 'adept@example.com')
  .option('--dry-run', 'Print payload/signature only', false)
.action(async (opts) => {
    if (opts.envFile) dotenvConfig({ path: opts.envFile })
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    bailIf(!secret, 'Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
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
  .option('--env-file <file>', 'Env file to load (dotenv)')
  .option('--webhook <url>', 'Webhook URL', process.env.WEBHOOK_URL || 'https://www.vauntino.com/api/paystack/webhook')
.action(async (opts) => {
    if (opts.envFile) dotenvConfig({ path: opts.envFile })
    const secret = process.env.PAYSTACK_TEST_SECRET || process.env.PAYSTACK_SECRET_KEY
    const SUPA_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const SUPA_ANON = process.env.VITE_SUPABASE_API || process.env.VITE_SUPABASE_ANON_KEY
    bailIf(!secret, 'Missing PAYSTACK_TEST_SECRET (or PAYSTACK_SECRET_KEY)')
    bailIf(!SUPA_URL || !SUPA_ANON, 'Missing SUPABASE_URL/VITE_SUPABASE_URL or VITE_SUPABASE_API')

    const supa = createClient(SUPA_URL, SUPA_ANON, { auth: { persistSession: false } })
    const email = `test-${Date.now()}@example.com`
    const clerkUserId = `usr_${Math.random().toString(36).slice(2,8)}`

    await postSigned(opts.webhook, { event: 'charge.success', data: { amount: 199*100, currency: 'ZAR', customer: { email }, metadata: { planKey: 'seekers-spark', clerkUserId, source: 'cli' } } }, secret)
    await pause(1200)
    let { data: ent1 } = await supa.from('entitlements').select('tier,status').or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`).maybeSingle()
    bailIf(!ent1 || ent1.status !== 'active' || ent1.tier !== 'Practitioner', 'Expected active Practitioner after success')

    await postSigned(opts.webhook, { event: 'subscription.disable', data: { customer: { email }, metadata: { planKey: 'seekers-spark', clerkUserId, source: 'cli' } } }, secret)
    await pause(1200)
    let { data: ent2 } = await supa.from('entitlements').select('tier,status').or(`clerk_user_id.eq.${clerkUserId},email.eq.${email}`).maybeSingle()
    bailIf(!ent2 || ent2.status !== 'inactive', 'Expected inactive after disable')

    console.log('PASS')
  })

program.command('init')
  .description('Interactive init to create local env file for testing')
  .option('--ci', 'Non-interactive, read from env only')
  .option('--env-file <file>', 'Env file to write', '.env.test')
  .action(async (opts) => {
    if (opts.ci) {
      const keys = ['PAYSTACK_TEST_SECRET','SUPABASE_URL','VITE_SUPABASE_API','WEBHOOK_URL']
      for (const k of keys) if (!process.env[k]) bailIf(true, `Missing ${k} in env`)
      const lines = keys.map(k => `${k}=${process.env[k]}`)
      fs.writeFileSync(opts.envFile, lines.join('\n'))
      console.log(`Wrote ${opts.envFile}`)
      return
    }
    const rl = readline.createInterface({ input, output })
    const ask = (q) => new Promise((res)=> rl.question(q, res))
    const env = {}
    env.PAYSTACK_TEST_SECRET = await ask('PAYSTACK_TEST_SECRET: ')
    env.SUPABASE_URL = await ask('SUPABASE_URL: ')
    env.VITE_SUPABASE_API = await ask('VITE_SUPABASE_API (anon): ')
    env.WEBHOOK_URL = await ask('WEBHOOK_URL (your preview /api/paystack/webhook): ')
    rl.close()
    const lines = Object.entries(env).map(([k,v])=> `${k}=${v}`)
    fs.writeFileSync(opts.envFile, lines.join('\n'))
    console.log(`Wrote ${opts.envFile}`)
  })

program.parse()

function bailIf(cond, msg){ if (cond){ console.error(msg); process.exit(1)} }
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
