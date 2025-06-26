import { ChatList } from "./ChatList";
import { NewChatButton } from "./NewChatButton";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Array<{
    _id: Id<"conversations">;
    title: string;
    updatedAt: number;
  }>;
  currentConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
  onNewChat: () => void;
}

export function Sidebar({
  isOpen,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
}: SidebarProps) {
  return (
    <div
      className={`${
        isOpen ? "w-80" : "w-0"
      } transition-all duration-300 bg-card border-r border-border flex flex-col overflow-hidden`}
    >
      <div className="p-4">
        <NewChatButton onClick={onNewChat} />
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-y-auto">
        <ChatList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={onSelectConversation}
        />
      </div>
    </div>
  );
}
