"use client"

import React, { useState } from "react"
import { Dialog } from "primereact/dialog"
import { MainDialogProps } from "./types"
import { useActorSelection, useRephrase, useTextToSpeech } from "./hooks"
import {
  DialogHeader,
  ActorSelector,
  TextInput,
  OutputCard,
} from "./components"

export const MainDialog: React.FC<MainDialogProps> = ({ visible, onHide, origText }) => {
  const [userText, setUserText] = useState<string>(origText)
  
  const { selectedActor, selectActor } = useActorSelection()
  const { isSpeaking, speak } = useTextToSpeech()

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={<DialogHeader />}
      modal
      draggable={false}
      resizable={false}
      closeOnEscape
      className="w-3/4 max-w-4xl"
    >
      <div className="space-y-4">
        <TextInput 
          value={userText} 
          onChange={setUserText} 
          readOnly 
        />

        <ActorSelector 
          value={selectedActor} 
          onChange={selectActor} 
        />

        {/* Output Section */}
        <OutputCard
          origText="TODO"
          actor={selectedActor}
          key={`outout-${selectedActor.id}`}
        />

      </div>
    </Dialog>
  )
}
