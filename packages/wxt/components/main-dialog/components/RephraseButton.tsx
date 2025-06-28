import React from "react"
import { Button } from "primereact/button"
import { Wand2, Loader2 } from "lucide-react"
import { Actor } from "../types"

interface RephraseButtonProps {
  onRephrase: () => void
  disabled: boolean
  isRephrasing: boolean
  selectedActor: Actor | null
}

export const RephraseButton: React.FC<RephraseButtonProps> = ({ 
  onRephrase, 
  disabled, 
  isRephrasing, 
  selectedActor 
}) => {
  return (
    <Button
      onClick={onRephrase}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      size="large"
    >
      {isRephrasing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Rephrasing in {selectedActor?.name}'s style...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4 mr-2" />
          Rephrase Text
        </>
      )}
    </Button>
  )
}
