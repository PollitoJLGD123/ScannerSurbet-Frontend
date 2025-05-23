"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/lib/userContext"
import { CalendarDays, Clock } from 'lucide-react'

export function DashboardWelcome() {
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const { user } = useUser()
  const firstName = user?.nombres
    ? user.nombres.split(" ")[0]
    : user?.correo
    ? user.correo.split("@")[0]
    : ""

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date()
      const hour = now.getHours()

      // Set greeting based on time of day
      if (hour >= 5 && hour < 12) {
        setGreeting("Buenos días")
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Buenas tardes")
      } else {
        setGreeting("Buenas noches")
      }

      // Format time: HH:MM
      setCurrentTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )

      // Format date: Day of week, Month Day, Year
      setCurrentDate(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    }

    // Initial update
    updateTimeAndGreeting()

    // Update time every minute
    const intervalId = setInterval(updateTimeAndGreeting, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-card/40 to-card shadow-md">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{currentTime}</span>
              <span className="text-xs">•</span>
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm font-medium capitalize">{currentDate}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {greeting},{" "}
              </span>
              <span>{firstName}</span>
            </h1>
            <p className="text-muted-foreground">
              Bienvenido a su panel de control de{" "}
              <span className="font-medium text-foreground">Arbisure</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden rounded-lg border bg-card p-3 shadow-sm md:block">
              <p className="text-sm text-muted-foreground">
                Desde aquí puede gestionar sus surebets, ver estadísticas y configurar su cuenta.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
