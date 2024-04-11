"use client";

import { useParams } from "next/navigation";
import { HistoryContext } from "@/context/HistoryContext";
import ChatInput from "@/components/chatbot/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "@/app/ai";

const ChatPage = () => {
  const params = useParams()!;
  const ChatID = params.chatId as string;
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  function handleSendMessage() {
    return null;
  }

  return (
    <HistoryContext.Consumer>
      {({ Chathistory }) => {
        const selectedHistory = Chathistory.find(
          (history) => history.id === ChatID,
        );
        return (
          <div className="flex h-full w-full flex-col justify-end">
            <div className="grow overflow-y-auto">
              {selectedHistory ? (
                messages.map((message, index) => (
                  <div key={index} className="pb-4">
                    {message.display}
                  </div>
                ))
              ) : (
                <text>Select a chat to start messaging</text>
              )}
            </div>
            <ChatInput
              onSendMessage={submitUserMessage}
              placeholder="Chat with Eve..."
              description="Eve may make mistakes. Please check her responses."
            />
          </div>
        );
      }}
    </HistoryContext.Consumer>
  );
};

export default ChatPage;
