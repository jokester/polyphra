import { Actor } from "./types"

export const styleOptions: Actor[] = [
  {
    id: "shakespeare",
    name: "William Shakespeare",
    description: "Elizabethan poet and playwright",
    avatar: "/placeholder.svg?height=40&width=40",
    accent: "British",
    specialty: "Classical Literature",
  },
  {
    id: "sherlock",
    name: "Sherlock Holmes",
    description: "Brilliant detective",
    avatar: "/placeholder.svg?height=40&width=40",
    accent: "British",
    specialty: "Logic & Deduction",
  },
  {
    id: "yoda",
    name: "Master Yoda",
    description: "Wise Jedi Master",
    avatar: "/placeholder.svg?height=40&width=40",
    accent: "Unique",
    specialty: "Wisdom & Philosophy",
  },
  {
    id: "gatsby",
    name: "Jay Gatsby",
    description: "Romantic dreamer from the Jazz Age",
    avatar: "/placeholder.svg?height=40&width=40",
    accent: "American",
    specialty: "Romance & Dreams",
  },
  {
    id: "churchill",
    name: "Winston Churchill",
    description: "British Prime Minister and orator",
    avatar: "/placeholder.svg?height=40&width=40",
    accent: "British",
    specialty: "Leadership & Oratory",
  },
]

export const mockResponses: Record<string, string> = {
  shakespeare: `Hark! {text}. Verily, 'tis a most wondrous sentiment that doth stir the very essence of one's soul!`,
  sherlock: `Elementary observation: "{text}" - a statement that, upon careful analysis, reveals the logical conclusion that the speaker possesses a methodical approach to communication.`,
  yoda: `"{text}", you say. Hmm. Wise words these are, yes. Much to learn from this, there is.`,
  gatsby: `Old sport, "{text}" - why, that's simply marvelous! It reminds me of those golden summer evenings when hope danced like fireflies across the bay.`,
  churchill: `"{text}" - Indeed, this statement embodies the very spirit of determination that shall guide us through our darkest hours toward the dawn of victory!`,
}
