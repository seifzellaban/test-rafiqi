import { ChatList } from "./ChatList";
import { NewChatButton } from "./NewChatButton";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { SignOutButton } from "../../SignOutButton";
import { DarkModeToggle } from "../layout/DarkModeToggle";

interface SidebarProps {
  isOpen: boolean;
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
      className={`hidden md:flex ${
        isOpen ? "w-80" : "w-0"
      } transition-all duration-300 bg-card border-r border-border flex-col overflow-hidden`}
    >
      <div className="p-3">
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
      <Separator />
      <div className="flex items-center justify-center px-4 py-2 gap-4">
        <SignOutButton />
        <DarkModeToggle />
      </div>
    </div>
  );
}
