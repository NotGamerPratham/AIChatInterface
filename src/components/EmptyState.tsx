import { MessageSquare, Sparkles, Zap, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const suggestions = [
  { icon: Sparkles, text: "Explain quantum computing in simple terms", color: "text-blue-500" },
  { icon: Zap, text: "Write a Python function to sort a list", color: "text-amber-500" },
  { icon: Globe, text: "Summarize the latest AI breakthroughs", color: "text-emerald-500" },
  { icon: MessageSquare, text: "Help me draft an email about a project delay", color: "text-purple-500" },
]

export function EmptyState({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-16">
      <div
        className="max-w-2xl w-full text-center"
      >
        <div
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 ring-1 ring-primary/10">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">What can I help with?</h1>
          <p className="text-muted-foreground text-sm">Ask me anything — I'm ready to help</p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {suggestions.map((item, i) => (
            <button
              key={i}
              style={{ animationDelay: `${0.25 + i * 0.05}s` }}
              className="animate-fadeIn flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-accent/50 text-left transition-all duration-200 text-sm cursor-pointer"
              onClick={() => onSelect(item.text)}
            >
              <item.icon className={`h-4 w-4 mt-0.5 shrink-0 ${item.color}`} />
              <span className="text-muted-foreground">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
