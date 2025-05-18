import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sección de Usuarios</CardTitle>
          <CardDescription>Descripción de usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lista de usuarios</p>
        </CardContent>
      </Card>
    </div>
  )
}
