import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Copy, Check } from "lucide-react";

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

interface Message {
  _id: Id<"messages">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isRTL = isRTLText(message.content);
  const hasArabic = isArabicText(message.content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <Card
        className={`max-w-[80%] ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div
                className={`whitespace-pre-wrap break-words ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
                lang={hasArabic ? "ar" : "en"}
                style={{
                  fontFamily: hasArabic
                    ? '"IBM Plex Sans Arabic", "Noto Sans Arabic", "Cairo", "Amiri", "Scheherazade New", system-ui, sans-serif'
                    : "inherit",
                  lineHeight: hasArabic ? "1.8" : "1.5",
                  unicodeBidi: "plaintext", // Ensures correct bidi rendering for mixed content
                }}
              >
                {message.content}
              </div>
              <div
                className={`flex items-center justify-between mt-2 ${
                  isRTL ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span className="text-xs opacity-70">
                  {formatTime(message.createdAt)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 px-2 text-xs opacity-70 hover:opacity-100"
                >
                  {copied ? (
                    <>
                      <Check className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                      {isRTL ? "تم النسخ!" : "Copied!"}
                    </>
                  ) : (
                    <>
                      <Copy className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                      {isRTL ? "نسخ" : "Copy"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
