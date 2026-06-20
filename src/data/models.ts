import { AIModel } from "@/types"

export const models: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    icon: "⚡",
    description: "Most capable GPT-4 model with vision",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    icon: "⚡",
    description: "Fast and affordable small model",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    icon: "✨",
    description: "Balanced performance and speed",
  },
  {
    id: "claude-haiku-3",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    icon: "✨",
    description: "Fastest Claude model",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    icon: "🌐",
    description: "Fast, versatile flash model",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    icon: "🌐",
    description: "Google's most capable model",
  },
  {
    id: "grok-3",
    name: "Grok 3",
    provider: "xAI",
    icon: "🪐",
    description: "Real-time knowledge, witty responses",
  },
]

export const modelGroups = [
  { label: "OpenAI", models: models.filter(m => m.provider === "OpenAI") },
  { label: "Anthropic", models: models.filter(m => m.provider === "Anthropic") },
  { label: "Google", models: models.filter(m => m.provider === "Google") },
  { label: "xAI", models: models.filter(m => m.provider === "xAI") },
]
