// pages/chat/[chatId].tsx
"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { IconUser } from "@tabler/icons-react";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [messages, setMessages] = useUIState<typeof AI>();

  const handleSendMessage = async (message: string) => {
    "use server";
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div>{message}</div>,
        isUser: true,
      },
    ]);
    const responseMessage = await submitUserMessage(message);
    setMessages(currentMessages => [...currentMessages, responseMessage]);
  };

  return (
    <div>
      {messages
        .filter(message => message.id === chatId || message.isUser)
        .map(message => (
          <div key={message.id}>{message.display}</div>
        ))}
      <ChatInput submitMessage={handleSendMessage} />
    </div>
  );
}