"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Définition des types
export type UserRole = "admin" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Utilisateurs de démonstration
const demoUsers: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Client",
    email: "client@example.com",
    role: "client",
  },
]

// Provider du contexte
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger l'utilisateur depuis le localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler une vérification d'authentification
    const foundUser = demoUsers.find((u) => u.email === email)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  // Fonction d'inscription
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Vérifier si l'email existe déjà
    if (demoUsers.some((u) => u.email === email)) {
      return false
    }

    // Créer un nouvel utilisateur (client par défaut)
    const newUser: User = {
      id: `${demoUsers.length + 1}`,
      name,
      email,
      role: "client",
    }

    // Ajouter l'utilisateur à la liste (dans une vraie application, ce serait une API)
    demoUsers.push(newUser)

    // Connecter l'utilisateur
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    return true
  }

  // Fonction de déconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}
