import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettingsStore } from "@/stores/settingsStore"
import { useConversationStore } from "@/stores/conversationStore"
import { sampleConversations, folders } from "@/data/conversations"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme, fontSize, setFontSize, enterToSend, setEnterToSend } = useSettingsStore()
  const setConversations = useConversationStore(s => s.setConversations)
  const conversations = useConversationStore(s => s.conversations)

  const loadSampleData = () => {
    if (conversations.length === 0) {
      setConversations(sampleConversations)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your chat experience</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-sm">Theme</Label>
            <Select value={theme} onValueChange={(v: "light" | "dark" | "system") => setTheme(v)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="fontSize" className="text-sm">Font Size</Label>
            <Select value={fontSize} onValueChange={(v: "sm" | "base" | "lg") => setFontSize(v)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="base">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enterToSend" className="text-sm">Enter to send</Label>
            <Switch
              id="enterToSend"
              checked={enterToSend}
              onCheckedChange={setEnterToSend}
            />
          </div>

          {conversations.length === 0 && (
            <button
              onClick={loadSampleData}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
            >
              Load sample conversations
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
