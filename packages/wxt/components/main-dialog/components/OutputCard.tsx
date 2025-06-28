import React from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Volume2, Loader2 } from "lucide-react"
import { Actor } from "../types"

interface OutputCardProps {
  rephrasedText: string
  selectedActor: Actor | null
  onSpeak: () => void
  isSpeaking: boolean
}

export const OutputCard: React.FC<OutputCardProps> = ({ 
  rephrasedText, 
  selectedActor, 
  onSpeak, 
  isSpeaking 
}) => {
  if (!rephrasedText) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Rephrased by {selectedActor?.name}</label>
        <Button 
          onClick={onSpeak} 
          disabled={isSpeaking} 
          outlined
          size="small"
          label={isSpeaking ? "Speaking..." : "Listen"}
        >
          {isSpeaking ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 mr-2" />
          )}
        </Button>
      </div>
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="p-4">
          <p className="text-sm leading-relaxed italic">"{rephrasedText}"</p>
        </div>
      </Card>
    </div>
  )
}
