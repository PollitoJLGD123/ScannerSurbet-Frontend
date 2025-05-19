"use client"
import React from 'react'
import { UserProvider } from '@/lib/userContext'
import PrivateRoute from '@/lib/private-route'
import type { Metadata } from "next"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { initWebSocket } from "@/app/socket/socketInit"
import { useEffect } from "react"

export const metadata: Metadata = {
  title: "Dashboard - Arbisure",
  description: "Panel de control de Arbisure",
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  useEffect(() => {
    initWebSocket('ws://localhost:4002')
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <UserProvider>
        <PrivateRoute>
          <DashboardHeader />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </PrivateRoute>
      </UserProvider>
    </div>
  )
}
