import React from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Volume2, Loader2, RefreshCw } from "lucide-react"
import { StyleSpec } from "../types"

interface OutputCardProps {
  origText: string
  actor: StyleSpec
}

export const OutputCard: React.FC<OutputCardProps> = ({ 
  origText,
  actor, 
}) => {

  const [rephrasedText, setRephrasedText] = React.useState(origText)
  const [generating, setGenerating] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">Wlll be:</label>
        <span className="flex-1" />
        <Button outlined size="small" aria-label="">
            Read out <Volume2 className="w-4 h-4 ml-2" />
        </Button>
        <Button outlined size="small" aria-label="">
            Regenerate <RefreshCw className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Card>
          <p className="text-sm leading-relaxed italic">TODO</p>
      </Card>
    </div>
  )
}
