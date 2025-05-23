import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DashboardWelcome } from "@/components/dashboard/welcome"
import { Activity, Building2, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardWelcome />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-card/40 to-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Surebets Activas</h3>
              <div className="rounded-full bg-primary/10 p-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">24</span>
              <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-xs font-medium text-green-500">
                +12% hoy
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Total de surebets disponibles actualmente</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-card/40 to-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Casas de Apuestas</h3>
              <div className="rounded-full bg-primary/10 p-2">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">30</span>
              <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-500">
                2 nuevas
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Casas de apuestas disponibles</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-card/40 to-card shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Deportes</h3>
              <div className="rounded-full bg-primary/10 p-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">40</span>
              <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-xs font-medium text-amber-500">
                Fútbol +8
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Deportes con surebets disponibles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
