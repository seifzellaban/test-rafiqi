import React from "react";
import { Message } from "./ChatInterface";
import { MessageComponent } from "./Message";
import { Loader2, Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 pb-8 sm:pb-12">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[50vh] text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-600 flex items-center justify-center mb-3 sm:mb-4">
            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Welcome to Rafiqi!
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 max-w-xs sm:max-w-md leading-relaxed">
            I'm your AI assistant powered by Google's Gemini. I'm ready to help
            with questions, conversations, and tasks in both English and Arabic!
          </p>
          <div className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            💡 Tip: Toggle "Custom" above to override my default behavior with
            your own system prompt
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-start space-x-3 sm:space-x-4 max-w-4xl mx-auto">
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
    </div>
  );
};
