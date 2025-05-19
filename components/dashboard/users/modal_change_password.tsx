"use client"

import { useState, useEffect } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { changePassword, ChangePasswordData } from "@/lib/auth"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme su nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type PasswordFormValues = z.infer<typeof passwordSchema>

interface ModalChangePasswordProps {
  isVisible: boolean
  onClose: () => void
}

export default function ModalChangePassword({ isVisible, onClose }: ModalChangePasswordProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ status?: boolean; message: string }>({
    status: undefined,
    message: "",
  })

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // reset formulario de cambiar contraseña
  useEffect(() => {
    if (isVisible) {
      form.reset()
      setStatusMessage({ status: undefined, message: "" })
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isVisible, form])

  if (!isVisible) return null
  async function onSubmit(formData: PasswordFormValues) {
    setIsLoading(true)
    setStatusMessage({ status: undefined, message: "" })

    try {
      // peticion
      const passwordData: ChangePasswordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }
      
      await changePassword(passwordData)
      
      // mensaje exito
      setStatusMessage({
        status: false,
        message: "Contraseña actualizada correctamente.",
      })

      toast.success('Contraseña actualizada', { description: 'Su contraseña ha sido actualizada correctamente' })

      // cerrar el modal
      setTimeout(() => {
        onClose()
      }, 1500)    } catch (error) {
      
      // Mostrar mensaje de error específico del backend
      let errorMessage = "No se pudo procesar la solicitud. Verifique su conexión e intente nuevamente."
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        // Axios error
        const axiosError = error as {response?: {data?: {message?: string}}};
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      if (errorMessage.includes("contraseña actual es incorrecta")) {
        form.setError("currentPassword", { 
          type: "manual",
          message: "La contraseña actual es incorrecta"
        });
      } else if (errorMessage.includes("distinta de la anterior")) {
        form.setError("newPassword", { 
          type: "manual",
          message: "La nueva contraseña debe ser diferente a la actual"
        });
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center px-4 z-50">
      <div className="max-w-[450px] w-full bg-background rounded-xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          <X size={18} />
          <span className="sr-only">Cerrar</span>
        </button>

        <h2 className="font-bold text-xl text-center mb-6">Cambiar Contraseña</h2>

        {statusMessage.status !== undefined && (
          <div
            className={`border-l-4 p-3 my-4 rounded-r ${
              statusMessage.status
                ? "bg-destructive/10 border-destructive text-destructive"
                : "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
            }`}
          >
            <p className="text-sm">{statusMessage.message}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña Actual</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={isLoading}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isLoading}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
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
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
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

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                {isLoading ? "Procesando..." : "Cambiar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
