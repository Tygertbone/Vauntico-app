// Serverless API: Admin webhook logs
// Verifies Clerk session (Authorization: Bearer <token>) and fetches logs via Supabase service role
import { verifyToken } from '@clerk/backend'
import { createClient } from '@supabase/supabase-js'

function parseQuery(req) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const q = url.searchParams
  return {
    event: q.get('event') || '',
    email: q.get('email') || '',
    from: q.get('from') || '',
    to: q.get('to') || '',
    page: Math.max(1, parseInt(q.get('page') || '1', 10)),
    pageSize: Math.min(200, Math.max(1, parseInt(q.get('pageSize') || '50', 10))),
  }
}

async function authenticate(req) {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) return { ok: false, error: 'Missing CLERK_SECRET_KEY' }
  const auth = req.headers['authorization'] || req.headers['Authorization']
  if (!auth || !auth.startsWith('Bearer ')) return { ok: false, error: 'Missing Authorization header' }
  const token = auth.slice('Bearer '.length)
  try {
    const claims = await verifyToken(token, { secretKey })
    // Accept role=admin in common claim locations
    const role = claims?.role || claims?.public_metadata?.role || claims?.org_role
    if (role !== 'admin') return { ok: false, error: 'Forbidden' }
    return { ok: true, claims }
  } catch (e) {
    return { ok: false, error: 'Invalid token' }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  const authn = await authenticate(req)
  if (!authn.ok) return res.status(401).json({ ok: false, error: authn.error })

  const { event, email, from, to, page, pageSize } = parseQuery(req)
  const supaUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!supaUrl || !serviceKey) return res.status(500).json({ ok: false, error: 'Missing Supabase service env' })

  const supa = createClient(supaUrl, serviceKey, { auth: { persistSession: false } })

  try {
    let query = supa.from('webhook_logs').select('id,event_type,email,tier,status,created_at,payload', { count: 'estimated' })
    if (event) query = query.eq('event_type', event)
    if (email) query = query.ilike('email', `%${email}%`)
    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to)

    const fromIdx = (page - 1) * pageSize
    const toIdx = fromIdx + pageSize - 1
    query = query.order('created_at', { ascending: false }).range(fromIdx, toIdx)

    const { data, error, count } = await query
    if (error) throw error

    return res.status(200).json({ ok: true, data: data || [], page, pageSize, total: count ?? null })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
}