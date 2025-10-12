// Vercel serverless function: Paystack webhook with signature verification
import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    // Misconfigured environment; respond 200 to avoid retry storms but log loudly
    console.error('[paystack:webhook] Missing PAYSTACK_SECRET_KEY')
    return res.status(200).json({ ok: true })
  }

  try {
    const signature = req.headers['x-paystack-signature']
    if (!signature) {
      return res.status(400).json({ ok: false, error: 'Missing signature' })
    }

    const rawBody = await getRawBody(req)
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
    if (hash !== signature) {
      return res.status(400).json({ ok: false, error: 'Invalid signature' })
    }

    const event = JSON.parse(rawBody.toString('utf8'))
    const eventType = event?.event || event?.event_type || 'unknown'
    const data = event?.data || {}

    // Extracts
    const email = data?.customer?.email || data?.customer?.customer_email || null
    const amountMinor = typeof data?.amount === 'number' ? data.amount : null // cents for ZAR
    const amountZAR = amountMinor != null ? Math.round(amountMinor / 100) : null

    // Map to Dream Mover tier by price
    const tier = determineTierByAmountZAR(amountZAR)

    // Log the verified event
    console.log('[paystack:webhook:verified]', { eventType, email, amountZAR, tier })

    // Handle selected events quickly; queue async work if needed
    if (eventType === 'charge.success' || eventType === 'subscription.create') {
      // TODO: persist entitlement and call Dream Mover
      // await syncEntitlement({ email, tier, status: 'active', source: 'paystack' })
    } else if (
      eventType === 'subscription.disable' ||
      eventType === 'customer.subscription.disable' ||
      eventType === 'invoice.payment_failed'
    ) {
      // TODO: mark entitlement inactive
      // await syncEntitlement({ email, tier, status: 'inactive', source: 'paystack' })
    }

    // Always acknowledge quickly
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[paystack:webhook:error]', err)
    // Acknowledge to avoid retries; log for investigation
    return res.status(200).json({ ok: true })
  }
}

function determineTierByAmountZAR(amountZAR) {
  if (amountZAR === 199) return 'Practitioner' // Seeker's Spark
  if (amountZAR === 499) return 'Guild' // Weaver's Pyre
  if (amountZAR === 999) return 'Oracle' // Eternal Blaze
  return null
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
