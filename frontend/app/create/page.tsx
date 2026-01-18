"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CameraButton } from "@/app/pending/[questId]/components/camera-button"
import { getPrompt } from "@/utils/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function CreatePage() {
    const router = useRouter()
    const [prompt, setPrompt] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [inviteUserIds, setInviteUserIds] = useState<string>("")

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const response = await getPrompt()
                setPrompt(response.prompt)
            } catch (error) {
                console.error("Failed to fetch prompt:", error)
                setPrompt("Failed to load prompt")
            } finally {
                setLoading(false)
            }
        }

        fetchPrompt()
    }, [])

    const handleImageCapture = (imageData: string) => {
        setCapturedImage(imageData)
    }

    const handleCreateQuest = () => {
        if (!capturedImage) return
        console.log("Creating quest with image:", capturedImage.substring(0, 50) + "...")
        console.log("Inviting users:", inviteUserIds)
        // TODO: Implement quest creation logic
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
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
                        <CardTitle>Create Quest</CardTitle>
                        <CardDescription>Take a photo of the prompt and invite friends</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground">Loading prompt...</p>
                        ) : (
                            <div className="p-6 bg-muted rounded-lg">
                                <p className="text-lg font-medium text-center">{prompt}</p>
                            </div>
                        )}

                        <div className="pt-4 flex flex-col items-center space-y-4">
                            <div className="w-full aspect-[4/3] bg-muted rounded-lg border overflow-hidden">
                                {capturedImage ? (
                                    <img 
                                        src={capturedImage} 
                                        alt="Captured" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No photo taken yet
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-2">
                                <Label htmlFor="inviteUsers">Invite User IDs (comma-separated)</Label>
                                <Input
                                    id="inviteUsers"
                                    type="text"
                                    placeholder="e.g., user1, user2, user3"
                                    value={inviteUserIds}
                                    onChange={(e) => setInviteUserIds(e.target.value)}
                                />
                            </div>

                            <div className="w-full flex gap-2">
                                <CameraButton onImageCapture={handleImageCapture} />
                                <Button 
                                    onClick={handleCreateQuest}
                                    disabled={!capturedImage || loading}
                                    className="flex-1"
                                >
                                    Create Quest
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}