import React from 'react'
import Sidebar from '../../components/ui/Sidebar'

export const metadata = {
  title: 'CloudVault',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
