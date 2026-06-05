'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/results')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-[11px] font-bold tracking-widest uppercase text-faint mb-8 text-center">
          Baseline Training Hub
        </div>
        <h1 className="text-2xl font-bold text-ink mb-8 text-center">Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-warm-border rounded-card px-4 py-3 text-sm text-ink bg-warm-card outline-none focus:border-ink transition-colors"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect password.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-ink text-warm-card text-sm font-semibold py-3 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
