import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { getSupabaseClient } from '@/lib/supabaseClient'

export default function WebhookLog() {
  const supa = getSupabaseClient()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [eventType, setEventType] = useState('')
  const [email, setEmail] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const qDescription = useMemo(() => {
    const parts = []
    if (eventType) parts.push(`event = ${eventType}`)
    if (email) parts.push(`email ~ ${email}`)
    if (from) parts.push(`from ${from}`)
    if (to) parts.push(`to ${to}`)
    return parts.join(' · ')
  }, [eventType, email, from, to])

  const fetchLogs = async () => {
    if (!supa) {
      setError('Supabase not configured')
      return
    }
    setLoading(true)
    setError('')
    try {
      let query = supa
        .from('webhook_logs')
        .select('id,event_type,email,tier,status,created_at,payload')
        .order('created_at', { ascending: false })
        .limit(100)

      if (eventType) query = query.eq('event_type', eventType)
      if (email) query = query.ilike('email', `%${email}%`)
      if (from) query = query.gte('created_at', from)
      if (to) query = query.lte('created_at', to)

      const { data, error } = await query
      if (error) throw error
      setRows(data || [])
    } catch (e) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <Helmet>
        <title>Webhook Logs — Admin</title>
        <meta name="description" content="View recent webhook events for Paystack integration." />
        <link rel="canonical" href="https://www.vauntico.com/admin/webhook-log" />
      </Helmet>

      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Webhook Logs</h1>

        <SignedOut>
          <p className="text-gray-400">You must sign in to view webhook logs.</p>
        </SignedOut>

        <SignedIn>
          <section className="mb-4 grid md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Event Type</label>
              <select value={eventType} onChange={(e)=>setEventType(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full">
                <option value="">All</option>
                <option value="charge.success">charge.success</option>
                <option value="subscription.create">subscription.create</option>
                <option value="subscription.disable">subscription.disable</option>
                <option value="invoice.payment_failed">invoice.payment_failed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="user@example.com" className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">From</label>
              <input type="datetime-local" value={from} onChange={(e)=>setFrom(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">To</label>
              <input type="datetime-local" value={to} onChange={(e)=>setTo(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full" />
            </div>
            <div className="flex items-end">
              <button onClick={fetchLogs} className="w-full bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" disabled={loading}>
                {loading ? 'Loading…' : 'Apply'}
              </button>
            </div>
          </section>

          {qDescription && (
            <p className="text-xs text-gray-500 mb-2">Filters: {qDescription}</p>
          )}

          {error && (
            <div className="mb-3 text-red-400 text-sm">{error}</div>
          )}

          <section className="overflow-x-auto border border-gray-800 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left px-3 py-2">Event</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Tier</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Created</th>
                  <th className="text-left px-3 py-2">Payload</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <Row key={r.id} row={r} />
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-500">No events found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </SignedIn>
      </main>
    </div>
  )
}

function Row({ row }) {
  const [open, setOpen] = useState(false)
  return (
    <tr className="border-t border-gray-800">
      <td className="px-3 py-2">{row.event_type}</td>
      <td className="px-3 py-2">{row.email || '-'}</td>
      <td className="px-3 py-2">{row.tier || '-'}</td>
      <td className="px-3 py-2">{row.status || '-'}</td>
      <td className="px-3 py-2">{new Date(row.created_at).toLocaleString()}</td>
      <td className="px-3 py-2">
        <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">setOpen(!open)} className="underline text-yellow-400 hover:opacity-80">{open ? 'Hide' : 'View'}</button>
        {open && (
          <pre className="mt-2 max-h-64 overflow-auto bg-gray-900 p-2 rounded border border-gray-800 text-xs">{JSON.stringify(row.payload, null, 2)}</pre>
        )}
      </td>
    </tr>
  )
}
