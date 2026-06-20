import { PanelLeft, PanelLeftClose, Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModelSelector } from "./ModelSelector"
import { useUIStore } from "@/stores/uiStore"
import { useSettingsStore } from "@/stores/settingsStore"
import { useConversationStore } from "@/stores/conversationStore"
import { Theme } from "@/types"

export function Header() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { theme, setTheme, defaultModel, setDefaultModel } = useSettingsStore()
  const activeConversation = useConversationStore(s => s.activeConversation())
  const model = activeConversation?.model || defaultModel

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"]
    const idx = themes.indexOf(theme)
    setTheme(themes[(idx + 1) % themes.length])
  }

  return (
    <header className="h-12 border-b border-border/50 flex items-center justify-between px-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{sidebarOpen ? "Close sidebar" : "Open sidebar"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ModelSelector
          value={model}
          onChange={value => {
            setDefaultModel(value)
            const conv = useConversationStore.getState().activeConversation()
            if (conv) {
              useConversationStore.getState().setConversations(
                useConversationStore.getState().conversations.map(c =>
                  c.id === conv.id ? { ...c, model: value } : c
                )
              )
            }
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={cycleTheme}>
                {theme === "dark" ? <Moon className="h-4 w-4" /> :
                 theme === "light" ? <Sun className="h-4 w-4" /> :
                 <Laptop className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {theme === "dark" ? "Dark mode" : theme === "light" ? "Light mode" : "System theme"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
