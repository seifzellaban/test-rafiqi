import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Id } from "../../../convex/_generated/dataModel";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2, Bot } from "lucide-react";

interface Message {
  _id: Id<"messages">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 flex-shrink-0">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-400">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
