"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { register } from "@/utils/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleRegister = async () => {
        setError(null)
        
        try {
            const response = await register(userId, password)
            console.log("Registration response:", response)
            
            // Check if the message indicates user already exists
            if (response.message === "User already exists") {
                setError("User already exists. Please choose a different User ID.")
            } else if (response.error || response.message?.includes("failed")) {
                setError(response.message || "Registration failed. Please try again.")
            } else {
                // Handle successful registration
                router.push("/")
            }
        } catch (error) {
            console.error("Registration failed:", error)
            setError("Registration failed. Please try again.")
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="mx-auto max-w-md w-full">
                <Button 
                    variant="ghost" 
                    className="mb-4"
                    onClick={() => router.push("/")}
                >
                    ← Back
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Create a new account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="space-y-2">
                                <Input 
                                    type="text" 
                                    placeholder="User ID" 
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button 
                                onClick={handleRegister}
                                className="w-full"
                                size="lg"
                            >
                                Register
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}