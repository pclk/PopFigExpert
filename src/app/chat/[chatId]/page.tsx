// app/chat/[chatId]/page.tsx
'use client';
import { useContext } from 'react';
import { useParams } from 'next/navigation';
import { HistoryContext } from '@/context/HistoryContext'; // Import the missing module from the correct file path
import ChatContainer from '@/components/chatbot/ChatContainer';

const ChatPage = () => {
  const params = useParams()!;
  const { Chathistory } = useContext(HistoryContext);
  const ChatID = params.chatId as string;
  const selectedHistory = Chathistory.find((history) => history.id === ChatID);

  return (
    <>
      <ChatContainer selectedHistory={selectedHistory} />
    </>
  );
};

export default ChatPage;