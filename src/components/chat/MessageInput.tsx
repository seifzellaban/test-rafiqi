import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, Loader2 } from "lucide-react";

// Function to detect if text contains Arabic characters
const isArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

// Function to detect if text is primarily RTL
const isRTLText = (text: string): boolean => {
  const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const rtlChars = (text.match(rtlRegex) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return rtlChars / totalChars > 0.3; // If more than 30% RTL characters
};

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = isRTLText(message);
  const hasArabic = isArabicText(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      await onSendMessage(messageToSend);
    } finally {
      setIsLoading(false);
    }
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
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRTL ? "اكتب رسالتك هنا..." : "Type your message here..."}
            className={`min-h-[52px] max-h-32 resize-none ${isRTL ? 'pl-12 text-right' : 'pr-12 text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
              fontFamily: hasArabic 
                ? '"Noto Sans Arabic", "Cairo", "Amiri", "Scheherazade New", system-ui, sans-serif'
                : 'inherit',
              lineHeight: hasArabic ? '1.8' : '1.5'
            }}
            rows={1}
            disabled={isLoading}
          />
          <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'} text-xs text-muted-foreground`}>
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
      <div className={`text-xs text-muted-foreground mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {isRTL ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد' : 'Press Enter to send, Shift+Enter for new line'}
      </div>
    </div>
  );
}
