"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from '@/lib/auth'
import Image from "next/image"


const loginSchema = z.object({
  correo: z.string().email("Ingrese un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: "",
      password: "",
    },
  })
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    // Limpiar errores previos
    form.clearErrors()
    
    try {
      await login(data)
      toast.success('Inicio de sesión exitoso', { description: 'Bienvenido a Arbisure' })
      router.push('/dashboard')
    } catch (error: unknown) {
      
      // Obtener el mensaje de error
      let errorMessage = 'Credenciales incorrectas'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Mapear mensajes de error específicos a campos del formulario
        if (errorMessage.includes('Usuario no encontrado')) {
          form.setError('correo', { 
            type: 'manual', 
            message: 'Usuario no registrado con este correo' 
          })
        } 
        else if (errorMessage.includes('Contraseña incorrecta')) {
          form.setError('password', { 
            type: 'manual', 
            message: 'Contraseña incorrecta' 
          })
        }
        else if (errorMessage.includes('cuenta ha sido desactivada')) {
          form.setError('correo', { 
            type: 'manual', 
            message: 'Cuenta desactivada. Contacte con soporte.' 
          })
        }
        else {
          // Para otros errores, mostrar notificación general
          toast.error('Error de inicio de sesión', { 
            description: errorMessage 
          })
        }
      } else {
        toast.error('Error de inicio de sesión', { 
          description: 'Ha ocurrido un error inesperado' 
        })
      }
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

      <Card className="w-full max-w-md">

        <div className="flex justify-center mt-4">
          <Image 
            src="/arbisure-logo.png" 
            alt="Arbisure Logo" 
            width={180} 
            height={45}
            priority
          />
        </div>

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingrese sus credenciales para acceder a su cuenta</CardDescription>
        </CardHeader>        <CardContent>          <Form {...form}>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Prevenir doble submits
              if (isLoading) return;
              
              // Ejecutar el manejador de submit
              await form.handleSubmit(onSubmit)(e);
              
              // Detener la propagación del evento después del manejo
              e.stopPropagation();
              return false;
            }} className="space-y-4"><FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="correo@ejemplo.com" 
                        {...field} 
                        className={form.formState.errors.correo ? "border-red-500 focus-visible:ring-red-500" : ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className={form.formState.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            ¿No tiene una cuenta?{' '}
            <Link href="/register" className="underline text-primary hover:text-primary/90">
              Regístrese aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
