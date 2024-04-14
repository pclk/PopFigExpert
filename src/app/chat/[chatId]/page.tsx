// pages/chat/[chatId].tsx
"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { IconUser } from "@tabler/icons-react";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [messages, setMessages] = useUIState<typeof AI>();
  const { handleSendMessage } = useActions();

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