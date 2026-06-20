import { Conversation } from "@/types"

export const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Building a React component library",
    messages: [],
    model: "claude-sonnet-4",
    folderId: "folder-1",
    createdAt: new Date("2026-06-19T10:00:00"),
    updatedAt: new Date("2026-06-19T10:30:00"),
  },
  {
    id: "conv-2",
    title: "Debugging TypeScript generics",
    messages: [],
    model: "gpt-4o",
    folderId: "folder-1",
    createdAt: new Date("2026-06-19T09:00:00"),
    updatedAt: new Date("2026-06-19T09:45:00"),
  },
  {
    id: "conv-3",
    title: "Python data analysis with pandas",
    messages: [],
    model: "gemini-2.0-flash",
    folderId: "folder-2",
    createdAt: new Date("2026-06-18T14:00:00"),
    updatedAt: new Date("2026-06-18T14:20:00"),
  },
  {
    id: "conv-4",
    title: "Docker Compose tips",
    messages: [],
    model: "claude-haiku-3",
    folderId: "folder-2",
    createdAt: new Date("2026-06-18T11:00:00"),
    updatedAt: new Date("2026-06-18T11:15:00"),
  },
  {
    id: "conv-5",
    title: "Understanding Rust ownership",
    messages: [],
    model: "gpt-4o",
    createdAt: new Date("2026-06-17T16:00:00"),
    updatedAt: new Date("2026-06-17T16:30:00"),
  },
  {
    id: "conv-6",
    title: "CSS Grid layout strategies",
    messages: [],
    model: "gemini-2.5-pro",
    createdAt: new Date("2026-06-16T08:00:00"),
    updatedAt: new Date("2026-06-16T08:10:00"),
  },
]

export const folders = [
  { id: "folder-1", name: "Engineering", icon: "💻" },
  { id: "folder-2", name: "Data Science", icon: "📊" },
  { id: "folder-3", name: "DevOps", icon: "🚀" },
]
