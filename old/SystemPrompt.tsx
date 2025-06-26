import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemPromptProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  className?: string;
}

export const SystemPrompt: React.FC<SystemPromptProps> = ({
  systemPrompt,
  onSystemPromptChange,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onSystemPromptChange(tempPrompt);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPrompt(systemPrompt);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempPrompt(systemPrompt);
    setIsEditing(true);
    setIsExpanded(true);
  };

  return (
    <div className={cn("", className)}>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <Textarea
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              placeholder="Enter custom system instructions here... (e.g., 'You are a helpful assistant that responds in a friendly and professional manner.')"
              className="min-h-[100px] sm:min-h-[120px] bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm px-2 sm:px-3"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Save
              </Button>
            </div>
          </>
        ) : (
          <>
            {systemPrompt ? (
              <div className="p-2 sm:p-3 bg-gray-900 rounded-md border border-gray-600">
                <p className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {systemPrompt}
                </p>
              </div>
            ) : (
              <div className="p-2 sm:p-3 bg-gray-900 rounded-md border border-gray-600 border-dashed">
                <p className="text-xs sm:text-sm text-gray-500 italic">
                  No custom system prompt set. Click "Edit" to add instructions.
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
