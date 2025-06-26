import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full justify-start gap-3"
      variant="secondary"
    >
      <Plus className="w-5 h-5" />
      <span className="font-medium">New Chat</span>
    </Button>
  );
}
