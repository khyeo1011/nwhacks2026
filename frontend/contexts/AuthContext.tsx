"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
    userId: string | null
    login: (userId: string) => void
    logout: () => void
    isAuthenticated: boolean
    points: number
    setPoints: (points: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null)
    const [points, setPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check if user is logged in (from localStorage)
        const storedUserId = localStorage.getItem("userId")
        if (storedUserId) {
            setUserId(storedUserId)
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        // Redirect logic
        if (!isLoading) {
            const publicRoutes = ["/login", "/register"]
            const isPublicRoute = publicRoutes.includes(pathname)

            if (!userId && !isPublicRoute) {
                router.push("/login")
            } else if (userId && isPublicRoute) {
                router.push("/")
            }
        }
    }, [userId, pathname, isLoading, router])

    const login = (newUserId: string) => {
        setUserId(newUserId)
        localStorage.setItem("userId", newUserId)
    }

    const logout = () => {
        setUserId(null)
        localStorage.removeItem("userId")
        router.push("/login")
    }

    if (isLoading) {
        return null // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ userId, login, logout, isAuthenticated: !!userId, points, setPoints }}>
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
