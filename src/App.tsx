import { useState } from "react"

import { Header } from "./components/Header"
import { ChatSidebar } from "./components/ChatSidebar"
import { ChatArea } from "./components/ChatArea"
import { SettingsDialog } from "./components/SettingsDialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useConversationStore } from "@/stores/conversationStore"
import { useUIStore } from "@/stores/uiStore"
import { useSettingsStore } from "@/stores/settingsStore"

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { createConversation } = useConversationStore()
  const { sidebarOpen } = useUIStore()
  const defaultModel = useSettingsStore(s => s.defaultModel)

  const handleNewChat = () => {
    createConversation(defaultModel)
  }

  return (
    <TooltipProvider>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar
            onNewChat={handleNewChat}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <ChatArea />
        </div>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </TooltipProvider>
  )
}

export default App
