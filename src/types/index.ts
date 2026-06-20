export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  files?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  folderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  icon?: string
}

export type AIModel = {
  id: string
  name: string
  provider: string
  icon?: string
  description?: string
}

export type Theme = "light" | "dark" | "system"

export interface AppSettings {
  theme: Theme
  defaultModel: string
  fontSize: "sm" | "base" | "lg"
  enterToSend: boolean
}
