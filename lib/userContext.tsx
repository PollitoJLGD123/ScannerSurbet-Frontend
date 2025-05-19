'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser, logout } from './auth'
import UserProfile from './types'

interface UserContextProps {
  user: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  logout: async () => {}
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((u: UserProfile) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, logout: handleLogout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
