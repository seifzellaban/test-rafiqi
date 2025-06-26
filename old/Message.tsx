import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "./ChatInterface";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface MessageProps {
  message: Message;
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

export const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isRTL = isArabicText(message.content);

  return (
    <div
      className={cn(
        "flex items-start space-x-3 sm:space-x-4 max-w-4xl mx-auto",
        isUser && "flex-row-reverse space-x-reverse",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
          isUser ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300",
        )}
      >
        {isUser ? (
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 space-y-1 sm:space-y-2",
          isUser && "flex flex-col items-end",
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 sm:px-4 sm:py-3 prose prose-sm max-w-none text-sm sm:text-base",
            isUser
              ? "bg-purple-600 text-white ml-8 sm:ml-12"
              : "bg-gray-800 text-gray-100 mr-8 sm:mr-12",
            isRTL && "text-right",
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {isUser ? (
            <p
              className={cn(
                "whitespace-pre-wrap leading-relaxed text-white m-0",
                isRTL && "text-right",
              )}
            >
              {message.content}
            </p>
          ) : (
            <div
              className={cn(
                "prose prose-sm prose-invert max-w-none",
                "prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-600 prose-pre:text-xs sm:prose-pre:text-sm prose-pre:p-2 sm:prose-pre:p-3",
                "prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-200 prose-code:text-xs sm:prose-code:text-sm",
                "prose-headings:text-gray-100 prose-p:text-gray-100 prose-li:text-gray-100",
                "prose-strong:text-gray-100 prose-em:text-gray-100",
                "prose-p:text-sm sm:prose-p:text-base prose-li:text-sm sm:prose-li:text-base",
                isRTL && "text-right",
              )}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      className={cn(
                        "whitespace-pre-wrap leading-relaxed text-gray-100 m-0 mb-2 last:mb-0 text-sm sm:text-base",
                        isRTL && "text-right",
                      )}
                    >
                      {children}
                    </p>
                  ),
                  code: ({ children, ...props }) => {
                    const isInlineCode =
                      !props.className?.includes("language-");
                    return isInlineCode ? (
                      <code
                        className="bg-gray-700 px-1 py-0.5 rounded text-gray-200 text-xs sm:text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 border border-gray-600 rounded p-2 sm:p-3 overflow-x-auto">
                        <code
                          className="text-gray-200 text-xs sm:text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      </pre>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div
          className={cn(
            "text-[10px] sm:text-xs text-gray-500 px-1",
            isUser && "text-right",
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
