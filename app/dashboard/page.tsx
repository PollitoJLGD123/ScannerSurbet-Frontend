import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardWelcome } from "@/components/dashboard/welcome"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardWelcome />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Surebets Activas</CardTitle>
            <CardDescription>Total de surebets disponibles actualmente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Casas de Apuestas</CardTitle>
            <CardDescription>Casas de apuestas disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">18</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deportes</CardTitle>
            <CardDescription>Deportes con surebets disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
