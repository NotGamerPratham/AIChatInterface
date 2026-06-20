import React, { useState } from "react"
import {
  Search, Plus, Trash2, Folder, FolderOpen, MessageSquare,
  ChevronLeft, ChevronRight, Settings, MoreHorizontal, PanelLeftClose,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useConversationStore } from "@/stores/conversationStore"
import { useUIStore } from "@/stores/uiStore"
import { useSettingsStore } from "@/stores/settingsStore"
import { formatDate, truncate, cn } from "@/lib/utils"
import { modelGroups } from "@/data/models"

function SearchBar() {
  const { searchQuery, setSearchQuery } = useUIStore()
  return (
    <div className="relative px-3 pt-3 pb-2">
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search conversations..."
        className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
      />
    </div>
  )
}

function ConversationList() {
  const { setActiveConversation, deleteConversation, activeConversationId, conversations } = useConversationStore()
  const { conversationsByFolder, folders, selectedFolderId, setSelectedFolderId } = useUIStore()
  const [showDelete, setShowDelete] = useState<string | null>(null)

  const grouped = conversationsByFolder()
  const noFolderConvs = grouped.get("__none__") || []
  const hasFilter = selectedFolderId !== null

  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-0.5 py-2">
        {!hasFilter && folders.map(folder => {
          const convs = grouped.get(folder.id) || []
          if (convs.length === 0) return null
          return (
            <div key={folder.id}>
              <button
                onClick={() => setSelectedFolderId(folder.id)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                <Folder className="h-3.5 w-3.5" />
                <span>{folder.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground/50">{convs.length}</span>
              </button>
              {convs.map(c => (
                <ConversationItem
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  updatedAt={c.updatedAt}
                  model={c.model}
                  isActive={activeConversationId === c.id}
                  showDelete={showDelete === c.id}
                  onSelect={() => setActiveConversation(c.id)}
                  onDelete={() => deleteConversation(c.id)}
                  onShowDelete={() => setShowDelete(c.id)}
                  onHideDelete={() => setShowDelete(null)}
                />
              ))}
            </div>
          )
        })}

        {hasFilter && (
          <button
            onClick={() => setSelectedFolderId(null)}
            className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md mb-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>All conversations</span>
          </button>
        )}

        {hasFilter && (
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground mb-1">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>{folders.find(f => f.id === selectedFolderId)?.name}</span>
          </div>
        )}

        {(hasFilter ? grouped.get(selectedFolderId!) || [] : noFolderConvs).map(c => (
          <ConversationItem
            key={c.id}
            id={c.id}
            title={c.title}
            updatedAt={c.updatedAt}
            model={c.model}
            isActive={activeConversationId === c.id}
            showDelete={showDelete === c.id}
            onSelect={() => setActiveConversation(c.id)}
            onDelete={() => deleteConversation(c.id)}
            onShowDelete={() => setShowDelete(c.id)}
            onHideDelete={() => setShowDelete(null)}
          />
        ))}

        {!hasFilter && noFolderConvs.map(c => (
          <ConversationItem
            key={c.id}
            id={c.id}
            title={c.title}
            updatedAt={c.updatedAt}
            model={c.model}
            isActive={activeConversationId === c.id}
            showDelete={showDelete === c.id}
            onSelect={() => setActiveConversation(c.id)}
            onDelete={() => deleteConversation(c.id)}
            onShowDelete={() => setShowDelete(c.id)}
            onHideDelete={() => setShowDelete(null)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

function ConversationItem({
  id, title, updatedAt, model, isActive, showDelete,
  onSelect, onDelete, onShowDelete, onHideDelete,
}: {
  id: string
  title: string
  updatedAt: Date
  model: string
  isActive: boolean
  showDelete: boolean
  onSelect: () => void
  onDelete: () => void
  onShowDelete: () => void
  onHideDelete: () => void
}) {
  const modelInfo = modelGroups.flatMap(g => g.models).find(m => m.id === model)
  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
      onClick={onSelect}
      onMouseEnter={onShowDelete}
      onMouseLeave={onHideDelete}
    >
      <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 opacity-60" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-0.5">
          {formatDate(updatedAt)} · {modelInfo?.name || model}
        </p>
      </div>
      {showDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

interface ChatSidebarProps {
  onNewChat: () => void
  onOpenSettings: () => void
}

export function ChatSidebar({ onNewChat, onOpenSettings }: ChatSidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <>{sidebarOpen && (
      <aside
        className="h-full w-[280px] border-r border-border/50 bg-sidebar flex flex-col overflow-hidden shrink-0"
      >
          <div className="flex items-center justify-between px-3 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="gap-2 text-xs font-medium"
            >
              <Plus className="h-4 w-4" />
              New chat
            </Button>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onOpenSettings}>
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
                      <PanelLeftClose className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Close sidebar</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Separator className="opacity-50" />

          <SearchBar />
          <ConversationList />

          <div className="p-3 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground/30 text-center">AI Chat Interface</p>
          </div>
        </aside>
      )}
    </>
  )
}
