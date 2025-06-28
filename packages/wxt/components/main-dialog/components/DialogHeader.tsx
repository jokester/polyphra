import React from "react"

export const DialogHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        English Learning Studio
      </h1>
      <p className="text-sm text-gray-600">
        Learn English by rephrasing your text in the style of famous characters and historical figures
      </p>
    </div>
  )
}
