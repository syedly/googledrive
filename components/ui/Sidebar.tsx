"use client"

import React from 'react'

const Sidebar = () => {
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      window.location.href = '/login'
    } catch (e) {
      console.error(e)
      window.location.href = '/login'
    }
  }
  return (
    <aside className="w-72 bg-slate-800 p-4 border-r border-slate-700">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">CloudVault</h2>
      </div>

      <nav className="space-y-2">
        <a className="block px-3 py-2 rounded hover:bg-slate-700">All Files</a>
        <a className="block px-3 py-2 rounded hover:bg-slate-700">Recent</a>
        <a className="block px-3 py-2 rounded hover:bg-slate-700">Starred</a>
        <a className="block px-3 py-2 rounded hover:bg-slate-700">Trash</a>
      </nav>

      <div className="mt-8">
        <p className="text-sm text-slate-300">Storage</p>
        <div className="w-full bg-slate-700 rounded h-3 mt-2 overflow-hidden">
          <div className="h-3 bg-emerald-400" style={{ width: '25%' }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">125MB of 500MB used</p>
        <div className="mt-4">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">Logout</button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
