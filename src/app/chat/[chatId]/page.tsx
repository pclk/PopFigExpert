// pages/chat/[chatId].tsx

"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { IconUser } from "@tabler/icons-react";
import { Chat, Message } from "@/app/action";
import { useCallback, useEffect, useState } from "react";
import { ModelDropdown } from "@/components/home";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [chat, setChat] = useUIState<typeof AI>();
  const { handleSendMessage } = useActions();

  // Function to process the initial message
  const processInitialMessage = async (currentChat: Chat) => {
      const initialMessage = currentChat.messages[0]?.display.props.children;
      const responseMessage = await handleSendMessage(initialMessage);
      setChat((currentChat: Chat[]) => [
        ...currentChat.map((chat) => {
          if (chat.chatID === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, responseMessage],
            };
          }
          return chat;
        }),
      ]);
  }

  // Find the current chat based on chatId
  const currentChat = chat.find((chat: Chat) => chat.chatID === chatId);

  // Process the initial message if the current chat has only one message and it hasn't been processed yet
  if (currentChat && currentChat.messages.length === 1) {
    processInitialMessage(currentChat);
  }

  return (
    <><div className="sticky left-0 top-0">
    <ModelDropdown />
  </div>
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
            ...currentChat.map((chat) => {
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
              ...currentChat.map((chat) => {
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
    </>
  );
}