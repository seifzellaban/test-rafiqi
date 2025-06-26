import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trash2 } from "lucide-react";

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
  return rtlChars / totalChars > 0.3;
};

interface ChatListProps {
  conversations: Array<{
    _id: Id<"conversations">;
    title: string;
    updatedAt: number;
  }>;
  currentConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
}

export function ChatList({
  conversations,
  currentConversationId,
  onSelectConversation,
}: ChatListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Id<"conversations"> | null>(null);
  const deleteConversation = useMutation(api.conversations.remove);

  const handleDelete = async (id: Id<"conversations">) => {
    await deleteConversation({ id });
    setShowDeleteConfirm(null);
    if (currentConversationId === id) {
      onSelectConversation(null as any);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="p-2">
      {conversations.map((conversation) => {
        const isRTL = isRTLText(conversation.title);
        const hasArabic = isArabicText(conversation.title);
        
        return (
          <div
            key={conversation._id}
            className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              currentConversationId === conversation._id
                ? "bg-accent"
                : "hover:bg-accent/50"
            }`}
            onClick={() => onSelectConversation(conversation._id)}
          >
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium text-sm truncate ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
                style={{
                  fontFamily: hasArabic
                    ? '"Noto Sans Arabic", "Cairo", system-ui, sans-serif'
                    : "inherit",
                }}
              >
                {conversation.title}
              </div>
              <div
                className={`text-xs text-foreground ${isRTL ? "text-right" : "text-left"}`}
              >
                {formatDate(conversation.updatedAt)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(conversation._id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
