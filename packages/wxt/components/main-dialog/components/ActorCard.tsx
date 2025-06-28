import React from "react"
import { Card } from "primereact/card"
import { Avatar } from "primereact/avatar"
import { Tag } from "primereact/tag"
import { Actor } from "../types"

interface ActorCardProps {
  actor: Actor
}

export const ActorCard: React.FC<ActorCardProps> = ({ actor }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
      <div className="flex items-start gap-4 p-4">
        <Avatar 
          image={actor.avatar || "/placeholder.svg"} 
          label={actor.name.split(" ").map((n) => n[0]).join("")}
          size="large"
          shape="circle"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{actor.name}</h3>
            <Tag value={actor.accent} severity="secondary" />
          </div>
          <p className="text-sm text-gray-600">{actor.description}</p>
          <Tag value={actor.specialty} severity="info" className="text-xs" />
        </div>
      </div>
    </Card>
  )
}
