// Vercel serverless function: Paystack webhook stub
// NOTE: Secure signature verification should be added before production.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    // In production: verify x-paystack-signature using PAYSTACK_SECRET_KEY and raw body
    const event = req.body

    // Basic routing by event type
    const eventType = event?.event || event?.event_type || 'unknown'
    const data = event?.data || {}

    // Example entitlement mapping (placeholder)
    // In production: look up the user by email/reference and persist entitlement mapping
    const email = data?.customer?.email
    const amountKobo = data?.amount

    console.log('[paystack:webhook] type=%s email=%s amount=%s', eventType, email, amountKobo)

    // TODO: Call Dream Mover API to update entitlements
    // await fetch(process.env.DREAM_MOVER_WEBHOOK_URL, { method: 'POST', headers: {...}, body: JSON.stringify({ email, tier }) })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[paystack:webhook:error]', err)
    return res.status(200).json({ ok: true }) // Return 200 to avoid Paystack retry storms during setup
  }
}
