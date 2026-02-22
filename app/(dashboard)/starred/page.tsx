"use client"

import React, { useEffect, useState } from 'react'

type FileItem = {
  id: string
  name: string
  url: string
  createdAt: string
  isStarred?: boolean
}

export default function StarredPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const res = await fetch('/api/files?filter=starred', { credentials: 'same-origin' })
      const data = await res.json()
      if (!mounted) return
      setFiles((data || []).map((f: any, i: number) => ({ ...f, id: String(f._id ?? f.id ?? i) })))
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function toggleStar(fileId: string, value: boolean) {
    await fetch('/api/files/star', { method: 'POST', credentials: 'same-origin', body: JSON.stringify({ fileId, value }), headers: { 'Content-Type': 'application/json' } })
    setFiles(s => s.map(f => (f.id === fileId ? { ...f, isStarred: value } : f)))
  }

  if (loading) return <div className="text-slate-400">Loading...</div>
  if (files.length === 0) return <div className="text-slate-400">No starred files</div>

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Starred</h2>
      <div className="space-y-2">
        {files.map(f => (
          <div key={f.id} className="p-3 bg-slate-800 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-slate-400">{new Date(f.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleStar(f.id, !f.isStarred)} className="p-2 rounded hover:bg-slate-700">{f.isStarred ? 'Unstar' : 'Star'}</button>
              <a href={f.url} target="_blank" rel="noreferrer" className="text-emerald-400">Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
