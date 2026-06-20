import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { modelGroups } from "@/data/models"

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const currentModel = modelGroups.flatMap(g => g.models).find(m => m.id === value)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] h-7 text-xs border-border/50 bg-muted/30">
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <span>{currentModel?.icon}</span>
            <span>{currentModel?.name || "Select model"}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {modelGroups.map(group => (
          <div key={group.label}>
            {group.models.length > 0 && (
              <>
                <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </div>
                {group.models.map(model => (
                  <SelectItem key={model.id} value={model.id} className="text-xs">
                    <span className="flex items-center gap-2">
                      <span>{model.icon}</span>
                      <span>{model.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </>
            )}
          </div>
        ))}
      </SelectContent>
    </Select>
  )
}
