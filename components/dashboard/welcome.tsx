"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/userContext"

export function DashboardWelcome() {
  const [greeting, setGreeting] = useState("")
  const { user } = useUser()
  const firstName = user?.nombres 
    ? user.nombres.split(' ')[0] 
    : (user?.correo ? user.correo.split('@')[0] : '')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting("Buenos días")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Buenas tardes")
    } else {
      setGreeting("Buenas noches")
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{greeting}, {firstName}</CardTitle>
        <CardDescription>Bienvenido a su panel de control de Arbisure</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Desde aquí puede gestionar sus surebets, ver estadísticas y configurar su cuenta.</p>
      </CardContent>
    </Card>
  )
}
