// pages/chat/[chatId].tsx
"use client";
import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { IconUser } from "@tabler/icons-react";
import { Chat, Message } from "@/app/action";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [chat, setChat] = useUIState<typeof AI>();
  const { handleSendMessage } = useActions();
  console.log(chat);

  return (
    <div>
      {chat
        .filter((chat: Chat) => chat.chatID === chatId)
        .flatMap((chat: Chat) =>
          chat.messages.map((message: Message) => (
            <div key={message.messageID}>{message.display}</div>
          ))
        )}
      <ChatInput
        submitMessage={async (message) => {
          setChat((currentChat: Chat[]) => [
            ...currentChat.map(chat => {
              if (chat.chatID === chatId) {
                return {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      messageID: Date.now(),
                      display: <div key={Date.now()}>{message}</div>,
                    },
                  ],
                };
              }
              return chat;
            }),
          ]);

          const responseMessage = await handleSendMessage(message);

          try {
            setChat((currentChat: Chat[]) => [
              ...currentChat.map(chat => {
                if (chat.chatID === chatId) {
                  return {
                    ...chat,
                    messages: [...chat.messages, responseMessage],
                  };
                }
                return chat;
              }),
            ]);
          } catch (error) {
            console.log("error:", error);
          }
        }}
      />
    </div>
  );
}