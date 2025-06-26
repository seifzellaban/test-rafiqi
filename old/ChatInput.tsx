import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

// Function to detect if text is primarily Arabic
const isArabicText = (text: string): boolean => {
  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const arabicChars = text.match(
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,
  );
  const totalChars = text.replace(/\s/g, "").length;
  return arabicChars && arabicChars.length > totalChars * 0.3;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = isArabicText(message);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea but keep it single line focused
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className={cn(
              "min-h-[45px] sm:min-h-[50px] max-h-[100px] sm:max-h-[120px] resize-none pr-12 sm:pr-16 pl-3 sm:pl-4 py-2 sm:py-3 rounded-xl flex-1 text-sm sm:text-base",
              "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400",
              "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              "focus-visible:ring-2 focus-visible:ring-purple-500",
              isRTL && "text-right",
            )}
            dir={isRTL ? "rtl" : "ltr"}
            disabled={disabled}
            rows={1}
          />

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
            disabled={disabled || !message.trim()}
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
