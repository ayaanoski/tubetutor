"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  isDemo?: boolean
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  demoLogin: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("tubetutor_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate Firebase Auth
    const mockUser = {
      id: "1",
      email,
      name: email.split("@")[0],
    }
    setUser(mockUser)
    localStorage.setItem("tubetutor_user", JSON.stringify(mockUser))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate Firebase Auth
    const mockUser = {
      id: "1",
      email,
      name,
    }
    setUser(mockUser)
    localStorage.setItem("tubetutor_user", JSON.stringify(mockUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("tubetutor_user")
  }

  const demoLogin = async () => {
    const demoUser = {
      id: "demo",
      email: "demo@tubetutor.com",
      name: "Demo User",
      isDemo: true,
    }
    setUser(demoUser)
    localStorage.setItem("tubetutor_user", JSON.stringify(demoUser))
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, demoLogin }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
