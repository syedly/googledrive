import React from 'react'
import Sidebar from '../../components/ui/Sidebar'

export default function DashboardRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
