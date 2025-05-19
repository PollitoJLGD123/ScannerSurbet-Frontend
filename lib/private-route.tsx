// filepath: lib/private-route.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './userContext'
import { hasAuthCookie } from './cookies'

interface PrivateRouteProps {
  children: React.ReactNode
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
)

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    // verificar el token en cookies primero 
    if (!hasAuthCookie()) {
      router.replace('/login')
      return
    }

    // si ya terminó de cargar y no hay usuario, redireccionar
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  // mostrar loading mientras verifica
  if (loading || !user) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
