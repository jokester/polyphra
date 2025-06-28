"use client"

import React, { useState } from "react"
import { Dialog } from "primereact/dialog"
import { MainDialogProps } from "./types"
import { useActorSelection, useRephrase, useTextToSpeech } from "./hooks"
import {
  DialogHeader,
  ActorSelector,
  ActorCard,
  TextInput,
  RephraseButton,
  OutputCard,
  InstructionsCard,
} from "./components"

export const MainDialog: React.FC<MainDialogProps> = ({ visible, onHide, origText }) => {
  const [userText, setUserText] = useState<string>(origText)
  
  const { selectedActor, selectActor } = useActorSelection()
  const { rephrasedText, isRephrasing, rephrase } = useRephrase()
  const { isSpeaking, speak } = useTextToSpeech()

  const handleRephrase = async () => {
    if (!userText.trim() || !selectedActor) return
    await rephrase(userText, selectedActor)
  }

  const handleSpeak = () => {
    speak(rephrasedText, selectedActor)
  }

  const isRephraseDisabled = !userText.trim() || !selectedActor || isRephrasing

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={<DialogHeader />}
      modal
      draggable={false}
      resizable={false}
      maximizable
      closeOnEscape
      className="w-full max-w-4xl"
    >
      <div className="space-y-6">
        {/* Actor Selection */}
        <ActorSelector 
          selectedActor={selectedActor} 
          onActorChange={selectActor} 
        />

        {/* Selected Actor Info */}
        {selectedActor && <ActorCard actor={selectedActor} />}

        {/* Input Section */}
        <TextInput 
          value={origText} 
          onChange={setUserText} 
          readOnly 
        />

        {/* Rephrase Button */}
        <RephraseButton
          onRephrase={handleRephrase}
          disabled={isRephraseDisabled}
          isRephrasing={isRephrasing}
          selectedActor={selectedActor}
        />

        {/* Output Section */}
        <OutputCard
          rephrasedText={rephrasedText}
          selectedActor={selectedActor}
          onSpeak={handleSpeak}
          isSpeaking={isSpeaking}
        />

        {/* Instructions */}
        <InstructionsCard />
      </div>
    </Dialog>
  )
}
