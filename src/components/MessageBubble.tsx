import { User, Sparkles, Paperclip, FileText, Image as ImageIcon } from "lucide-react"
import { Message } from "@/types"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function FilePreview({ file }: { file: { name: string; type: string; size: number } }) {
  const isImage = file.type.startsWith("image/")
  const Icon = isImage ? ImageIcon : file.type.includes("pdf") ? FileText : Paperclip

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground truncate max-w-[200px]">{file.name}</span>
      <span className="text-muted-foreground/50">({(file.size / 1024).toFixed(1)} KB)</span>
    </div>
  )
}

export function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <div
      className="animate-messageSlide flex gap-3 px-4 py-5 group"
    >
      <Avatar className={cn("h-8 w-8 shrink-0 mt-0.5", isUser && "ring-2 ring-primary/20")}>
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%]",
        isUser && "items-end"
      )}>
        {message.files && message.files.length > 0 && (
          <div className={cn("flex flex-wrap gap-2 mb-2", isUser && "justify-end")}>
            {message.files.map(f => (
              <FilePreview key={f.id} file={f} />
            ))}
          </div>
        )}

        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border/50"
        )}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {isStreaming && (
            <span className="inline-flex gap-0.5 ml-0.5">
              <span className="w-1.5 h-3.5 bg-foreground/40 rounded-full animate-pulse-dot" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-3.5 bg-foreground/40 rounded-full animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-3.5 bg-foreground/40 rounded-full animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
