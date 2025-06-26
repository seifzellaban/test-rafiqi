import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import { ChevronDown, Settings, Trash2 } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
}

const predefinedModels = [
  { id: "default", name: "Default Assistant", description: "Helpful AI assistant" },
  { id: "code", name: "Code Expert", description: "Programming and development" },
  { id: "creative", name: "Creative Writer", description: "Storytelling and creative content" },
  { id: "business", name: "Business Analyst", description: "Strategic insights and analysis" },
  { id: "research", name: "Research Assistant", description: "Thorough research and information" },
  { id: "tutor", name: "Tutor", description: "Patient teaching and explanations" },
  { id: "custom", name: "Custom Prompt", description: "Your own system prompt" },
];

export function ModelSelector({
  selectedModel,
  onModelChange,
  customPrompt,
  onCustomPromptChange,
}: ModelSelectorProps) {
  const [showCustomPromptModal, setShowCustomPromptModal] = useState(false);
  const [newCustomPrompt, setNewCustomPrompt] = useState(customPrompt);

  const customPrompts = useQuery(api.customPrompts.list) || [];
  const createCustomPrompt = useMutation(api.customPrompts.create);
  const deleteCustomPrompt = useMutation(api.customPrompts.remove);

  const selectedModelData = predefinedModels.find(m => m.id === selectedModel);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    if (modelId === "custom") {
      setShowCustomPromptModal(true);
    }
  };

  const handleSaveCustomPrompt = () => {
    onCustomPromptChange(newCustomPrompt);
    setShowCustomPromptModal(false);
  };

  const handleSaveAsPreset = async () => {
    if (newCustomPrompt.trim()) {
      const name = prompt("Enter a name for this custom prompt:");
      if (name) {
        await createCustomPrompt({
          name: name.trim(),
          prompt: newCustomPrompt.trim(),
        });
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="font-medium">{selectedModelData?.name || "Select Model"}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuLabel>AI Models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {predefinedModels.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              className={`flex flex-col items-start p-3 ${
                selectedModel === model.id ? "bg-accent" : ""
              }`}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-sm text-muted-foreground">{model.description}</div>
            </DropdownMenuItem>
          ))}
          
          {customPrompts.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Saved Custom Prompts</DropdownMenuLabel>
              {customPrompts.map((prompt) => (
                <DropdownMenuItem
                  key={prompt._id}
                  className="flex items-center justify-between p-3"
                  onSelect={(e) => e.preventDefault()}
                >
                  <button
                    onClick={() => {
                      onCustomPromptChange(prompt.prompt);
                      onModelChange("custom");
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium">{prompt.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {prompt.prompt.slice(0, 50)}...
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteCustomPrompt({ id: prompt._id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Prompt Dialog */}
      <Dialog open={showCustomPromptModal} onOpenChange={setShowCustomPromptModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom System Prompt</DialogTitle>
            <DialogDescription>
              Enter your custom system prompt to personalize the AI's behavior.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={newCustomPrompt}
            onChange={(e) => setNewCustomPrompt(e.target.value)}
            placeholder="Enter your custom system prompt..."
            className="min-h-[120px]"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCustomPromptModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveAsPreset}
              disabled={!newCustomPrompt.trim()}
            >
              Save as Preset
            </Button>
            <Button
              onClick={handleSaveCustomPrompt}
              disabled={!newCustomPrompt.trim()}
            >
              Use This Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
