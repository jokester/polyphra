import { useState } from "react"
import { Actor } from "../types"
import { mockResponses } from "../data"

export const useRephrase = () => {
  const [rephrasedText, setRephrasedText] = useState<string>("")
  const [isRephrasing, setIsRephrasing] = useState<boolean>(false)

  const rephrase = async (text: string, actor: Actor) => {
    if (!text.trim() || !actor) return

    setIsRephrasing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate rephrased response based on actor
    const template = mockResponses[actor.id] || text
    const processedText = text.toLowerCase().replace(/you/g, "thou").replace(/your/g, "thy")
    const result = template.replace("{text}", actor.id === "shakespeare" ? processedText : text)

    setRephrasedText(result)
    setIsRephrasing(false)
  }

  const clearRephrasedText = () => {
    setRephrasedText("")
  }

  return {
    rephrasedText,
    isRephrasing,
    rephrase,
    clearRephrasedText,
  }
}
