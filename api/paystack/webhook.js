// Vercel serverless function: Paystack webhook with signature verification and Supabase writes
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function determineTierByAmountZAR(amountZAR) {
  if (amountZAR === 199) return 'Practitioner'
  if (amountZAR === 499) return 'Guild'
  if (amountZAR === 999) return 'Oracle'
  return null
}

function determineTierByPlanKey(planKey) {
  if (planKey === 'seekers-spark') return 'Practitioner'
  if (planKey === 'weavers-pyre') return 'Guild'
  if (planKey === 'eternal-blaze') return 'Oracle'
  return null
}

async function upsertEntitlement({ clerkUserId, email, tier, status }) {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn('[paystack:webhook] Missing Supabase service env; skipping write')
    return
  }
  const supa = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

  // Try upsert by clerk_user_id first if present, else by email
  const payload = {
    clerk_user_id: clerkUserId || null,
    email: email || null,
    tier,
    status,
    updated_at: new Date().toISOString(),
  }

  if (clerkUserId) {
    const { error } = await supa
      .from('entitlements')
      .upsert(payload, { onConflict: 'clerk_user_id' })
    if (!error) return
    console.error('[paystack:webhook] upsert by clerk_user_id failed:', error?.message)
  }
  if (email) {
    const { error } = await supa
      .from('entitlements')
      .upsert(payload, { onConflict: 'email' })
    if (error) console.error('[paystack:webhook] upsert by email failed:', error?.message)
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = []
      req.on('data', (chunk) => chunks.push(chunk))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', (err) => reject(err))
    } catch (e) {
      reject(e)
    }
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false })

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('[paystack:webhook] Missing PAYSTACK_SECRET_KEY')
    return res.status(200).json({ ok: true })
  }

  try {
    const signature = req.headers['x-paystack-signature']
    if (!signature) return res.status(400).json({ ok: false, error: 'Missing signature' })

    const rawBody = await getRawBody(req)
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
    if (hash !== signature) return res.status(400).json({ ok: false, error: 'Invalid signature' })

    const event = JSON.parse(rawBody.toString('utf8'))
    const eventType = event?.event || event?.event_type || 'unknown'
    const data = event?.data || {}

    const email = data?.customer?.email || data?.customer?.customer_email || null
    const amountMinor = typeof data?.amount === 'number' ? data.amount : null
    const amountZAR = amountMinor != null ? Math.round(amountMinor / 100) : null

    const meta = data?.metadata || {}
    const planKey = meta?.planKey || meta?.plan_key || null
    const clerkUserId = meta?.clerkUserId || meta?.clerk_user_id || null

    let tier = determineTierByPlanKey(planKey)
    if (!tier) tier = determineTierByAmountZAR(amountZAR)

    // Minimal write path — keep webhook fast
    if ((eventType === 'charge.success' || eventType === 'subscription.create') && tier) {
      await upsertEntitlement({ clerkUserId, email, tier, status: 'active' })
    } else if (
      eventType === 'subscription.disable' ||
      eventType === 'customer.subscription.disable' ||
      eventType === 'invoice.payment_failed'
    ) {
      // Mark inactive if we can find identity
      if (clerkUserId || email) {
        await upsertEntitlement({ clerkUserId, email, tier: tier || 'Practitioner', status: 'inactive' })
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[paystack:webhook:error]', err)
    return res.status(200).json({ ok: true })
  }
}
