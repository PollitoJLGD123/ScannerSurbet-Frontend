"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useUser } from "@/lib/userContext"

export function DashboardHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useUser()

  // obtener Iniciales de nombre
  const getInitials = () => {
    if (!user) return '';
    
    const firstInitial = user.nombres ? user.nombres.charAt(0) : '';
    const lastInitial = user.apellidos ? user.apellidos.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`;
  }

  // obetener nombre completo
  const getFullName = () => {
    if (!user) return '';
    
    const nombres = user.nombres || '';
    const apellidos = user.apellidos || '';
    
    return `${nombres} ${apellidos}`.trim(); 
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      toast("Sesión cerrada", {
        description: "Ha cerrado sesión correctamente",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error", {
        description: "Ocurrió un problema inesperado",
      });
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
          ARBISURE
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />

        {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={getFullName()} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex">{getFullName()}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getFullName()}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.correo}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cambiar contraseña</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isLoggingOut} onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </header>
  )
}
