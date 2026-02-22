"use client"

import React, { useEffect, useMemo, useState } from 'react'
import UploadButton from '../../components/ui/UploadButton'
import { Star, Trash2, Grid, List } from 'lucide-react'

type FileItem = {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
  isStarred?: boolean
}

export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [sort, setSort] = useState<'date' | 'name' | 'size'>('date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const res = await fetch('/api/files', { credentials: 'same-origin' })
      const data = await res.json()
      if (!mounted) return
      const normalized = (data || []).map((f: any, i: number) => ({ ...f, id: String(f._id ?? f.id ?? i) }))
      setFiles(normalized)
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const results = useMemo(() => {
    let list = files.slice()
    if (query) list = list.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'name') list.sort((a, b) => (a.name > b.name ? 1 : -1))
    if (sort === 'date') list.sort((a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
    if (sort === 'size') list.sort((a, b) => (Number(a.size) - Number(b.size)))
    if (order === 'desc') list.reverse()
    return list
  }, [files, query, sort, order])

  async function toggleStar(fileId: string, value: boolean) {
    await fetch('/api/files/star', { method: 'POST', credentials: 'same-origin', body: JSON.stringify({ fileId, value }), headers: { 'Content-Type': 'application/json' } })
    setFiles(s => s.map(f => (f.id === fileId ? { ...f, isStarred: value } : f)))
  }

  async function moveToTrash(fileId: string) {
    await fetch('/api/files/trash', { method: 'POST', credentials: 'same-origin', body: JSON.stringify({ fileId }), headers: { 'Content-Type': 'application/json' } })
    setFiles(s => s.filter(f => f.id !== fileId))
  }

  async function renameFile(fileId: string) {
    const name = prompt('New name')
    if (!name) return
    await fetch('/api/files/rename', { method: 'POST', credentials: 'same-origin', body: JSON.stringify({ fileId, name }), headers: { 'Content-Type': 'application/json' } })
    setFiles(s => s.map(f => (f.id === fileId ? { ...f, name } : f)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">My Drive</h1>

        <div className="flex items-center gap-3">
          <input placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} className="p-2 rounded bg-slate-800" />
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="p-2 rounded bg-slate-800">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value as any)} className="p-2 rounded bg-slate-800">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-slate-700' : ''}`}><Grid size={16} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-slate-700' : ''}`}><List size={16} /></button>
          </div>
          <UploadButton />
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading files...</div>
      ) : results.length === 0 ? (
        <div className="text-slate-400">No files</div>
      ) : view === 'list' ? (
        <div className="space-y-2">
          {results.map(f => (
            <div key={f.id} className="p-3 bg-slate-800 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-slate-400">{new Date(f.createdAt).toLocaleString()} • {Math.round((Number(f.size) || 0) / 1024)} KB</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleStar(f.id, !f.isStarred)} title="Star" className="p-2 rounded hover:bg-slate-700"><Star size={16} color={f.isStarred ? '#34D399' : undefined} /></button>
                <button onClick={() => renameFile(f.id)} title="Rename" className="p-2 rounded hover:bg-slate-700">Rename</button>
                <button onClick={() => moveToTrash(f.id)} title="Trash" className="p-2 rounded hover:bg-slate-700"><Trash2 size={16} /></button>
                <a href={f.url} target="_blank" rel="noreferrer" className="text-emerald-400">Open</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {results.map(f => (
            <div key={f.id} className="p-3 bg-slate-800 rounded">
              <div className="h-40 bg-slate-700 rounded mb-3 flex items-center justify-center">Preview</div>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-slate-400">{Math.round((Number(f.size) || 0) / 1024)} KB</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
