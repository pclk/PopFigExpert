// components/ChatMessages.tsx

"use client";

import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { Chat, Message } from "@/app/action";

interface ChatMessagesProps {
  chatId: string;
  messages: Message[];
}

export default function ChatMessages({ chatId, messages }: ChatMessagesProps) {
  const [chat, setChat] = useUIState<typeof AI>();
  const { handleSendMessage } = useActions();

  return (
    <>
      {messages.map((message: Message) => (
        <div key={message.messageID}>{message.display}</div>
      ))}
    </>
  );
}