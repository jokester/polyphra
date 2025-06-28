import { useState } from "react"
import { Actor } from "../types"

export const useActorSelection = () => {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)

  const selectActor = (actor: Actor | null) => {
    setSelectedActor(actor)
  }

  const clearSelection = () => {
    setSelectedActor(null)
  }

  return {
    selectedActor,
    selectActor,
    clearSelection,
  }
}
