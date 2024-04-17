// pages/chat/[chatId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { Chat, Message } from "@/app/action";
import { useEffect } from "react";
import { isValidElement } from "react";
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [chat, setChat] = useUIState<typeof AI>();
  const { handleSendMessage } = useActions();
  const {modelType, setModelType} = useModelContext();

  useEffect(() => {
    const processInitialMessage = async () => {
      // Find the current chat based on chatId
      const currentChat = chat.find((chat: Chat) => chat.chatID === chatId);
  
      // Process the initial message if the current chat has only one message and it hasn't been processed yet
      if (currentChat && currentChat.messages.length === 1) {
        const initialMessage = currentChat.messages[0]?.display;
        if (isValidElement(initialMessage)) {
          const messageContent = initialMessage.props.children;
          const responseMessage = await handleSendMessage(messageContent);
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
      }
    };
  
    processInitialMessage();
  }, [chatId, chat, handleSendMessage]);
  return (
    <>
      <div className="sticky left-0 top-0">
      <Button
            variant="outline"
            className="border-none font-inter text-darkprim hover:bg-secondary active:bg-primary active:text-white"
          >
            {modelType}
          </Button>      
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
            setChat((currentAI: Chat[]) => [
              ...currentAI.map((chat) => {
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
              setChat((currentAI: Chat[]) => [
                ...currentAI.map((chat) => {
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