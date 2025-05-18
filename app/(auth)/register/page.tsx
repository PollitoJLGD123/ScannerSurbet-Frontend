"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// datos de países
const paisesData = {
  paises: [
    {
      nombre: "Argentina",
      codPais: "+54",
      cantDigitos: 10,
    },
    {
      nombre: "Bolivia",
      codPais: "+591",
      cantDigitos: 8,
    },
    {
      nombre: "Brasil",
      codPais: "+55",
      cantDigitos: 11,
    },
    {
      nombre: "Canada",
      codPais: "+1",
      cantDigitos: 10,
    },
    {
      nombre: "Chile",
      codPais: "+56",
      cantDigitos: 9,
    },
    {
      nombre: "Colombia",
      codPais: "+57",
      cantDigitos: 10,
    },
    {
      nombre: "Costa Rica",
      codPais: "+506",
      cantDigitos: 8,
    },
    {
      nombre: "Cuba",
      codPais: "+53",
      cantDigitos: 8,
    },
    {
      nombre: "Republica Dominicana",
      codPais: "+1",
      cantDigitos: 10,
    },
    {
      nombre: "Ecuador",
      codPais: "+593",
      cantDigitos: 9,
    },
    {
      nombre: "El Salvador",
      codPais: "+503",
      cantDigitos: 8,
    },
    {
      nombre: "Honduras",
      codPais: "+504",
      cantDigitos: 8,
    },
    {
      nombre: "Mexico",
      codPais: "+52",
      cantDigitos: 10,
    },
    {
      nombre: "Panama",
      codPais: "+507",
      cantDigitos: 8,
    },
    {
      nombre: "Paraguay",
      codPais: "+595",
      cantDigitos: 9,
    },
    {
      nombre: "Peru",
      codPais: "+51",
      cantDigitos: 9,
    },
    {
      nombre: "Puerto Rico",
      codPais: "+1",
      cantDigitos: 10,
    },
    {
      nombre: "Uruguay",
      codPais: "+598",
      cantDigitos: 8,
    },
    {
      nombre: "Venezuela",
      codPais: "+58",
      cantDigitos: 10,
    },
  ],
}

// Validaciones
const registroSchema = z
  .object({
    nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
    correo: z.string().email("Ingrese un correo electrónico válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    pais: z.string().min(1, "Seleccione un país"),
    codPais: z.string(),
    celular: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const paisSeleccionado = paisesData.paises.find((p) => p.nombre === data.pais)
      if (!paisSeleccionado) return true //no validar sin pais seleccionado

      // validar cantidad de dígitos
      return data.celular.length === paisSeleccionado.cantDigitos
    },
    {
      message: "El número de teléfono no tiene la cantidad correcta de dígitos para el país seleccionado",
      path: ["celular"],
    },
  )

type RegistroFormValues = z.infer<typeof registroSchema>

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      correo: "",
      password: "",
      confirmPassword: "",
      pais: "",
      codPais: "",
      celular: "",
    },
  })

  // actualizacion de código de pais
  const watchPais = form.watch("pais")

  useEffect(() => {
    if (watchPais) {
      const paisSeleccionado = paisesData.paises.find((p) => p.nombre === watchPais)
      if (paisSeleccionado) {
        form.setValue("codPais", paisSeleccionado.codPais)
      }
    }
  }, [watchPais, form])

  async function onSubmit(data: RegistroFormValues) {
    setIsLoading(true)

    try {
      // simulacion de conexion backend
      console.log("Registro data:", data)

      // simulacion de estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // simulacion de registro exitoso
      toast.success("Registro exitoso", {
        description: "Su cuenta ha sido creada correctamente",
      });

      router.push("/login")
    } catch (error) {
      console.error("Error de registro:", error)
      toast.error("Error de registro",{
        description:"No se pudo completar el registro. Por favor, inténtelo de nuevo.",
      })
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Registro</CardTitle>
          <CardDescription className="text-center">
            Complete el formulario para crear su cuenta en Arbisure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese sus nombres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apellidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese sus apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="pais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un país" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paisesData.paises.map((pais) => (
                            <SelectItem key={pais.nombre} value={pais.nombre}>
                              {pais.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codPais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de País</FormLabel>
                      <FormControl>
                        <Input {...field} disabled placeholder="Código" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="celular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número de celular" type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Procesando..." : "Registrarse"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            ¿Ya tiene una cuenta?{" "}
            <Link href="/login" className="underline text-primary hover:text-primary/90">
              Inicie sesión aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
