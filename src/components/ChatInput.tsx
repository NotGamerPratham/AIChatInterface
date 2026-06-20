import React, { useRef, useState, useEffect, useCallback } from "react"
import { ArrowUp, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettingsStore } from "@/stores/settingsStore"
import { FileAttachment } from "@/types"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (content: string, files: FileAttachment[]) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileAttachment[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const enterToSend = useSettingsStore(s => s.enterToSend)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [input])

  const handleSend = useCallback(() => {
    if (!input.trim() && files.length === 0) return
    onSend(input.trim(), files)
    setInput("")
    setFiles([])
  }, [input, files, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (enterToSend && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles: FileAttachment[] = Array.from(fileList).map(f => ({
      id: generateId(),
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    setFiles(prev => [...prev, ...newFiles].slice(0, 5))
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <TooltipProvider>
      <div className="border-t border-border/50 bg-gradient-to-t from-background via-background to-transparent pt-2 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className={cn(
              "relative rounded-2xl border transition-all duration-200",
              isDragging
                ? "border-primary border-dashed bg-primary/5"
                : "border-border/50 bg-card/80 hover:border-border/80 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 pb-0">
                {files.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/70 border border-border/50 text-xs group/file"
                  >
                    <span className="text-muted-foreground truncate max-w-[120px]">{f.name}</span>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2 p-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach files</TooltipContent>
              </Tooltip>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.txt,.csv,.json,.js,.ts,.py,.md"
                onChange={e => addFiles(e.target.files)}
              />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDragging ? "Drop files here..." : "Type a message..."}
                rows={1}
                disabled={disabled}
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/50 resize-none outline-none py-2 max-h-[200px] disabled:opacity-50"
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={disabled || (!input.trim() && files.length === 0)}
                    className={cn(
                      "shrink-0 rounded-xl transition-all duration-200",
                      input.trim() || files.length
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {enterToSend ? "Send message" : "Send (Ctrl+Enter)"}
                </TooltipContent>
              </Tooltip>
            </div>

            {isDragging && (
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-primary/5 z-10">
                <p className="text-sm text-muted-foreground">Drop files to attach</p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground/40 text-center mt-2">
            {enterToSend
              ? "Press Enter to send · Shift+Enter for new line"
              : "Press Ctrl+Enter to send"}
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
