"use client"

import { Button } from "@/components/ui/button"
import { useRef } from "react"

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void
}

export function CameraButton({ onImageCapture }: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTakePhoto = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result as string
        onImageCapture(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button 
        onClick={handleTakePhoto}
        className="w-full"
      >
        📷 Take Photo
      </Button>
    </div>
  )
}
