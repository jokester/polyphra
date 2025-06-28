export interface StyleSpec {
  id: string
  name: string
  description: string
  avatar: string
  accent: string
  specialty: string
}

export interface MainDialogProps {
  origText: string
  visible: boolean
  onHide: () => void
}
