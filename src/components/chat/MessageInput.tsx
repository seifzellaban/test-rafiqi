import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Loader2 } from "lucide-react";

// Function to detect if text contains Arabic characters
const isArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

// Function to detect if the first strong character is RTL
const isFirstStrongRTL = (text: string): boolean => {
  for (const char of text) {
    if (/\s/.test(char)) continue;
    if (/[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(char)) {
      return true;
    }
    if (/[A-Za-z0-9]/.test(char)) {
      return false;
    }
  }
  return false;
};

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  keyboardOffset?: number;
}

export function MessageInput({
  onSendMessage,
  isLoading,
  keyboardOffset = 0,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = isFirstStrongRTL(message);
  const hasArabic = isArabicText(message);

  // Focus textarea after sending a message
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage("");

    await onSendMessage(messageToSend);
    // Focus will be handled by useEffect
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div
      className="border-t border-border bg-card p-4"
      style={{ marginBottom: keyboardOffset }}
    >
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRTL ? "اكتب رسالتك هنا..." : "Type your message here..."
            }
            className={`min-h-[52px] max-h-32 resize-none ${isRTL ? "pl-12 text-right" : "pr-12 text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
            lang={hasArabic ? "ar" : "en"}
            style={{
              fontFamily: hasArabic
                ? '"IBM Plex Sans Arabic", "Noto Sans Arabic", "Cairo", "Amiri", "Scheherazade New", system-ui, sans-serif'
                : "inherit",
              lineHeight: hasArabic ? "1.8" : "1.5",
              unicodeBidi: "plaintext", // Ensures correct bidi rendering for mixed content
            }}
            rows={1}
            disabled={isLoading}
            autoCorrect={hasArabic ? "on" : undefined}
            autoCapitalize={hasArabic ? "sentences" : undefined}
            spellCheck={hasArabic}
          />
          <div
            className={`absolute bottom-2 ${isRTL ? "left-2" : "right-2"} text-xs text-muted-foreground`}
          >
            {message.length}
          </div>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          size="icon"
          className="h-[52px] w-[52px]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </form>
      <div
        className={`text-xs text-muted-foreground mt-2 ${isRTL ? "text-right" : "text-left"}`}
      >
        {isRTL
          ? "اضغط Enter للإرسال، Shift+Enter لسطر جديد"
          : "Press Enter to send, Shift+Enter for new line"}
      </div>
    </div>
  );
}
