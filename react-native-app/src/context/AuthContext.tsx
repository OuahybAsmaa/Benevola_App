import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "benevole" | "organisation"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role: "benevole" | "organisation") => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  role: "benevole" | "organisation"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error loading user:", error)
      }
      setIsLoading(false)
    }

    setTimeout(checkAuth, 1500) 
  }, [])

  const login = async (email: string, password: string, role: "benevole" | "organisation") => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email,
      firstName: "Jean",
      lastName: "Dupont",
      role,
      avatar: "/diverse-user-avatars.png",
    }

    setUser(mockUser)
    await AsyncStorage.setItem("user", JSON.stringify(mockUser))
  }

  const register = async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      avatar: "/diverse-user-avatars.png",
    }

    setUser(mockUser)
    await AsyncStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
