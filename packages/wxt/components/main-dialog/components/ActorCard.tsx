import React from "react"
import { Card } from "primereact/card"
import { Avatar } from "primereact/avatar"
import { Tag } from "primereact/tag"
import { StyleSpec } from "../types"

interface ActorCardProps {
  spec: StyleSpec
}

export const ActorCard: React.FC<ActorCardProps> = ({ spec }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
      <div className="flex items-start gap-4 p-4">
        <Avatar 
          image={spec.avatar ||undefined} 
          label={spec.name.split(" ").map((n) => n[0]).join("")}
          size="normal"
          shape="circle"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{spec.name}</h3>
            <Tag value={spec.accent} severity="secondary" />
          </div>
          <p className="text-sm text-gray-600">{spec.description}</p>
          <Tag value={spec.specialty} severity="info" className="text-xs" />
        </div>
      </div>
    </Card>
  )
}
