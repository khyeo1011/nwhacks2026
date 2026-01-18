"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { Participant, QuestDetails } from "@/types/types"
import { getQuestDetails, getImage } from "@/utils/api"
import { useRouter } from "next/navigation"
import { use, useState, useEffect } from "react"

export default function QuestDetailsPage({ params }: { params: Promise<{ questId: string }> }) {
  const router = useRouter()
  const { questId } = use(params)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [quest, setQuest] = useState<QuestDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const questData = await getQuestDetails(questId)
        setQuest(questData)
      } catch (error) {
        console.error("Failed to fetch quest:", error)
        setQuest(null)
      } finally {
        setLoading(false)
      }
    }
    fetchQuest()
  }, [questId])

  useEffect(() => {
    if (selectedParticipant) {
      const fetchImage = async () => {
        setIsImageLoading(true)
        try {
          const imageBase64 = await getImage(questId, selectedParticipant.userId)
          setSelectedImage(`data:image/jpeg;base64,${imageBase64}`)
        } catch (error) {
          console.error("Failed to fetch image:", error)
          setSelectedImage(null)
        } finally {
          setIsImageLoading(false)
        }
      }
      fetchImage()
    }
  }, [selectedParticipant, questId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
        <div className="mx-auto max-w-md w-full">
          <p
            className="text-center text-[#3e2723] text-2xl animate-pulse"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Reading Scroll...
          </p>
        </div>
      </main>
    )
  }

  if (!quest) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
        <div className="mx-auto max-w-md w-full text-center">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Quest Log Missing</h1>
          <Button variant="outline2" onClick={() => router.push("/completed")}>
            Return to Archives
          </Button>
        </div>
      </main>
    )
  }

  const participants = quest.participants || []
  const winner = quest.winner
  const hasPendingParticipants = participants.some(p => p.score === null || p.time === null)

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
      <div className="mx-auto max-w-md w-full">
        <Button
          variant="outline2"
          className="mb-4"
          onClick={() => router.push("/completed")}
        >
          ← Back to Archives
        </Button>

        <Card className="border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
              Quest Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className="p-4 bg-[#f4dcb3] border-[4px] border-black relative"
              style={{ imageRendering: "pixelated" }}
            >
              <p className="text-sm uppercase mb-1 opacity-60 font-bold">The Oracle demanded:</p>
              <p
                className="text-3xl text-center leading-none text-[#3e2723]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {quest.prompt}
              </p>
            </div>

            <div className="border-[4px] border-black bg-white overflow-hidden">
              <Table>
                <TableHeader className="bg-[#5d4037]">
                  <TableRow className="hover:bg-transparent border-b-[4px] border-black">
                    <TableHead className="text-[#f4dcb3] font">Adventurer</TableHead>
                    <TableHead className="text-[#f4dcb3] font text-center">Score</TableHead>
                    <TableHead className="text-[#f4dcb3] font text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant, index) => {
                    const isWinner = !hasPendingParticipants && participant.userId === winner
                    return (
                      <TableRow
                        key={index}
                        className={`cursor-pointer border-b-[2px] border-black/10 last:border-0 hover:bg-[#f4dcb3]/50 ${
                          isWinner ? 'bg-yellow-100 hover:bg-yellow-200' : ''
                        }`}
                        onClick={() => setSelectedParticipant(participant)}
                      >
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2">
                            {participant.userId}
                            {isWinner && <span className="text-lg">🏆</span>}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {participant.score ?? '—'}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {participant.time ? `${participant.time}s` : '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {hasPendingParticipants && (
          <p className="mt-4 text-center text-muted-foreground">
            Waiting for all participants to complete the quest.
          </p>
        )}

        <AlertDialog open={!!selectedParticipant} onOpenChange={(open) => {
          if (!open) {
            setSelectedParticipant(null);
            setSelectedImage(null);
          }
        }}>
          <AlertDialogContent className="max-w-md bg-[#f4dcb3] border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setSelectedParticipant(null)}
              className="absolute right-4 top-4 border-[2px] border-black bg-white p-1 hover:bg-red-100 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertDialogHeader>
              <AlertDialogTitle 
                className="text-2xl text-[#3e2723]" 
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {selectedParticipant?.userId}&apos;s Offering
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="w-full aspect-[4/3] bg-[#d7ba8d] border-[4px] border-black overflow-hidden relative shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                style={{ imageRendering: "pixelated" }}
              >
                {isImageLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[#3e2723] animate-pulse" style={{ fontFamily: "var(--font-body)" }}>
                      Unrolling Canvas...
                    </p>
                  </div>
                ) : selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={`${selectedParticipant?.userId}'s submission`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#3e2723]/40">
                    Image Lost to Time
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full bg-[#5d4037] p-3 border-[2px] border-black text-[#f4dcb3]">
                <div className="text-center border-r-[2px] border-black/30">
                  <p className="text-xs uppercase font-bold opacity-70">Satisfaction</p>
                  <p className="text-xl font-bold">{selectedParticipant?.score ?? '0'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase font-bold opacity-70">Swiftness</p>
                  <p className="text-xl font-bold">{selectedParticipant?.time}s</p>
                </div>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  )
}