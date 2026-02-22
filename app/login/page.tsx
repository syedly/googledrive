'use client'

import React, { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', credentials: 'same-origin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) setMessage(data?.error || 'Login failed')
      else window.location.href = '/dashboard'
    } catch (err) {
      setLoading(false)
      setMessage('Network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-800 p-6 rounded">
        <h2 className="text-2xl mb-4">Sign in</h2>
        <label className="block mb-2">Email</label>
        <input className="w-full p-2 mb-3 rounded bg-slate-700" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2">Password</label>
        <input type="password" className="w-full p-2 mb-3 rounded bg-slate-700" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-emerald-500 text-black p-2 rounded" disabled={loading}>{loading ? '...' : 'Sign in'}</button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>
    </div>
  )
}
