import React from "react"
import { Dropdown } from "primereact/dropdown"
import { Avatar } from "primereact/avatar"
import { Actor } from "../types"
import { styleOptions } from "../data"

interface ActorSelectorProps {
  selectedActor: Actor | null
  onActorChange: (actor: Actor | null) => void
}

// Custom option template for the dropdown
const actorOptionTemplate = (option: Actor) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar 
        image={option.avatar || "/placeholder.svg"} 
        label={option.name.split(" ").map((n) => n[0]).join("")}
        size="normal"
        shape="circle"
      />
      <div className="flex flex-col">
        <span className="font-medium">{option.name}</span>
        <span className="text-xs text-gray-500">{option.description}</span>
      </div>
    </div>
  )
}

// Selected value template for the dropdown
const selectedActorTemplate = (option: Actor, props: any) => {
  if (option) {
    return (
      <div className="flex items-center gap-2">
        <Avatar 
          image={option.avatar || "/placeholder.svg"} 
          label={option.name.split(" ").map((n) => n[0]).join("")}
          size="normal"
          shape="circle"
        />
        <span>{option.name}</span>
      </div>
    )
  }
  return <span>{props.placeholder}</span>
}

export const ActorSelector: React.FC<ActorSelectorProps> = ({ selectedActor, onActorChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Choose an actor</label>
      <Dropdown
        value={selectedActor}
        options={styleOptions}
        onChange={(e) => onActorChange(e.value)}
        itemTemplate={actorOptionTemplate}
        valueTemplate={selectedActorTemplate}
        placeholder="Choose an actor"
        className="w-full"
      />
    </div>
  )
}
