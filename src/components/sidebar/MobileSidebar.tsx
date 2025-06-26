import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { NewChatButton } from "./NewChatButton";
import { Separator } from "../ui/separator";
import { ChatList } from "./ChatList";
import { SignOutButton } from "../../SignOutButton";
import { DarkModeToggle } from "../layout/DarkModeToggle";

interface MobileSidebarProps {
  conversations: Array<{
    _id: Id<"conversations">;
    title: string;
    updatedAt: number;
  }>;
  currentConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
  onNewChat: () => void;
}

export function MobileSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col w-64 sm:w-80">
        <SheetTitle className="sr-only">Mobile Sidebar</SheetTitle>
        <div className="mt-12 p-3">
          <NewChatButton
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
          />
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto">
          <ChatList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={(id) => {
              onSelectConversation(id);
              setIsOpen(false);
            }}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-center px-4 py-2 gap-4">
          <SignOutButton />
          <DarkModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
