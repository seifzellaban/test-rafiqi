import { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ModelSelector } from "../ModelSelector";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { SignOutButton } from "../../SignOutButton";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Menu } from "lucide-react";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [selectedModel, setSelectedModel] = useState("default");
  const [customPrompt, setCustomPrompt] = useState("");

  const conversations = useQuery(api.conversations.list) || [];
  const currentConversation = useQuery(
    api.conversations.get,
    currentConversationId ? { id: currentConversationId } : "skip"
  );
  const messages =
    useQuery(
      api.messages.list,
      currentConversationId ? { conversationId: currentConversationId } : "skip"
    ) || [];

  const createConversation = useMutation(api.conversations.create);
  const createMessage = useMutation(api.messages.create);

  const handleNewChat = async () => {
    const systemPrompt = getSystemPrompt();
    const conversationId = await createConversation({
      title: "New Chat",
      systemPrompt,
    });
    setCurrentConversationId(conversationId);
  };

  const getSystemPrompt = () => {
    const prompts = {
      QPR1: "You are a helpful AI assistant.",
      custom: customPrompt || "You are a helpful AI assistant.",
    };
    return prompts[selectedModel as keyof typeof prompts] || prompts.QPR1;
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      const systemPrompt = getSystemPrompt();
      const conversationId = await createConversation({
        title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
        systemPrompt,
      });
      setCurrentConversationId(conversationId);

      await createMessage({
        conversationId,
        role: "user",
        content,
      });

      // Simulate AI response for now
      setTimeout(async () => {
        await createMessage({
          conversationId,
          role: "assistant",
          content:
            "I'm a placeholder response. Please configure the Gemini API to get real AI responses.",
        });
      }, 1000);
    } else {
      await createMessage({
        conversationId: currentConversationId,
        role: "user",
        content,
      });

      // Simulate AI response for now
      setTimeout(async () => {
        await createMessage({
          conversationId: currentConversationId,
          role: "assistant",
          content:
            "I'm a placeholder response. Please configure the Gemini API to get real AI responses.",
        });
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
            />
          </div>
          <SignOutButton />
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversationId ? (
            <>
              <MessageList messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold text-foreground mb-4">
                    Welcome to AI Chat
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-8">
                    Start a new conversation to begin chatting
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={handleNewChat} size="lg">
                    Start New Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
