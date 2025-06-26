import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Id } from "../../../convex/_generated/dataModel";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  _id: Id<"messages">;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
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
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
