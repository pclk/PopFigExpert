// /chat/[chatId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { HistoryContext } from "@/context/HistoryContext";
import ChatContainer from "@/components/chatbot/ChatContainer";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "@/app/actions";
import { useState } from "react";

const ChatPage = () => {
  const params = useParams()!;
  const ChatID = params.chatId as string;
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <HistoryContext.Consumer>
      {({ Chathistory }) => {
        const selectedHistory = Chathistory.find(
          (history) => history.id === ChatID,
        );
        return <ChatContainer selectedHistory={selectedHistory} />;
      }}
    </HistoryContext.Consumer>
  );
};

export default ChatPage;
