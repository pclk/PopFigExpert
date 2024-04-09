// /chat/[chatId]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { HistoryContext } from "@/context/HistoryContext";
import ChatContainer from "@/components/chatbot/ChatContainer";

const ChatPage = () => {
  const params = useParams()!;
  const ChatID = params.chatId as string;

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
