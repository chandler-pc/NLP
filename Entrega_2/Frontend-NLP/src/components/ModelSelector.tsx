import React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

const models = [
  {
    value: "gpt-4o",
    label: "GPT 4o",
    description: "Most capable model, great for complex tasks"
  },
  {
    value: "gpt-4o-mini",
    label: "GPT 4o mini",
    description: "Smaller model, faster response times"
  },
]

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {selectedModel
            ? models.find((model) => model.value === selectedModel)?.label
            : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-2">
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.value}
              className={cn(
                "flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-accent",
                selectedModel === model.value && "bg-accent"
              )}
              onClick={() => {
                onSelectModel(model.value)
                setOpen(false)
              }}
            >
              <div>
                <div>{model.label}</div>
                <div className="text-sm text-muted-foreground">{model.description}</div>
              </div>
              {selectedModel === model.value && <Check className="h-4 w-4" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}