"use client";

import { useParams } from "next/navigation";
import { HistoryContext } from "@/context/HistoryContext";
import ChatInput from "@/components/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "@/app/ai";
import { IconUser } from "@tabler/icons-react";

export default function ChatPage() {
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
                  <div
                    key={index}
                    className="mb-4 flex flex-col items-center pb-4"
                  >
                    {message.isUser ? (
                      <div className="flex items-center self-end">
                        <text className="mr-2 rounded-md bg-primary p-4">
                          {message.text}
                        </text>
                        <IconUser className="size-10 flex-shrink-0 fill-darkprim " />
                      </div>
                    ) : (
                      <div className="flex items-center self-start">
                        <img
                          src="/chatbot.png"
                          alt="Chatbot Avatar"
                          className="mr-2 size-12 flex-shrink-0 rounded-full align-middle"
                        />
                        <text className="justify-start rounded-md bg-secondary p-4">
                          {message.text}
                        </text>
                      </div>
                    )}
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
}
