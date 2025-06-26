import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ModelSelector } from "../ModelSelector";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Menu } from "lucide-react";
import { DarkModeToggle } from "../layout/DarkModeToggle";
import { MobileSidebar } from "../sidebar/MobileSidebar";
import prompts from "../../lib/prompts.json";

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentConversationId, setCurrentConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [selectedModel, setSelectedModel] = useState("default");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const chatAreaRef = useRef<HTMLDivElement>(null);

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
  const sendGeminiChat = useAction(api.gemini.chat);
  const sendGeminiName = useAction(api.gemini.name);
  const updateConversationTitle = useMutation(api.conversations.updateTitle);
  const [pendingTitle, setPendingTitle] = useState("");
  const [showTitleDialog, setShowTitleDialog] =
    useState<Id<"conversations"> | null>(null);

  const handleNewChat = async () => {
    const systemPrompt = getSystemPrompt();
    const conversationId = await createConversation({
      title: "New Chat",
      systemPrompt,
    });
    setCurrentConversationId(conversationId);
  };

  const getSystemPrompt = () => {
    return (
      prompts[selectedModel as keyof typeof prompts] || prompts.default
    ).replace(/\{customPrompt\}/g, customPrompt || prompts.default);
  };

  const handleSendMessage = async (content: string) => {
    try {
      const systemPrompt = getSystemPrompt();
      const systemPromptMessage: { role: "user"; content: string } = {
        role: "user",
        content: systemPrompt,
      };
      if (!currentConversationId) {
        const conversationId = await createConversation({
          title: "New Chat",
          systemPrompt,
        });
        setCurrentConversationId(conversationId);

        await createMessage({
          conversationId,
          role: "user",
          content,
        });
        setIsLoading(true);

        const geminiResponse = await sendGeminiChat({
          messages: [systemPromptMessage, { role: "user", content }],
        });

        await createMessage({
          conversationId,
          role: "assistant",
          content: geminiResponse,
        });

        // Invisible: prompt model for a super short summary and update title in DB
        try {
          const summary = await sendGeminiName({
            messages: [
              systemPromptMessage,
              { role: "user", content },
              { role: "assistant", content: geminiResponse },
            ],
          });
          if (summary && summary.trim()) {
            await updateConversationTitle({
              id: conversationId,
              title: summary.trim(),
            });
            // Optimistically update the conversation title in the local list
            const idx = conversations.findIndex(
              (c) => c._id === conversationId
            );
            if (idx !== -1) {
              conversations[idx].title = summary.trim();
            }
          }
        } catch (err) {
          // Fallback: do nothing if naming fails
        }
      } else {
        await createMessage({
          conversationId: currentConversationId,
          role: "user",
          content,
        });
        setIsLoading(true);

        const geminiResponse = await sendGeminiChat({
          messages: [
            systemPromptMessage,
            ...messages.map((msg) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
            { role: "user", content },
          ],
        });

        await createMessage({
          conversationId: currentConversationId,
          role: "assistant",
          content: geminiResponse,
        });
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleResize() {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height;
        setKeyboardOffset(offset > 0 ? offset : 0);
        // Optionally scroll to bottom when keyboard opens
        if (offset > 0 && chatAreaRef.current) {
          chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
      }
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <MobileSidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={setCurrentConversationId}
                onNewChat={handleNewChat}
              />
            </div>
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
            />
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {currentConversationId ? (
            <>
              <div ref={chatAreaRef} className="flex-1 overflow-y-auto">
                <MessageList messages={messages} isLoading={isLoading} />
              </div>
              <MessageInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                keyboardOffset={keyboardOffset}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold text-foreground mb-4">
                    Welcome to Rafiqi Beta
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
