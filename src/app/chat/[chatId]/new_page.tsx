"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/action";
import { Chat, Message } from "@/app/action";
import { useEffect } from "react";
import { isValidElement } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { init } from "next/dist/compiled/webpack/webpack";

export default function ChatPage() {
  const params = useParams()!;
  const chatId = params.chatId as string;
  const [model, _] = useQueryState("model");
  const { handleSendMessage, insertChatHistory } = useActions();
  const [chat, setChat] = useUIState<typeof AI>();


  // const queryClient = useQueryClient();
  function fetchCurrentChat() {
    console.log("1. All chats:", chat);
    return useQuery({
      queryKey: ["chat", chatId],
      queryFn: () => {
        const selectedChat = chat.filter((c: Chat) => c.chatID === chatId)[0];
        return selectedChat;
      },
      initialData: () => {
        const selectedChat = chat.filter((c: Chat) => c.chatID === chatId)[0];
        return selectedChat;
      }
    });
  }

  const currentChat = fetchCurrentChat();

  function processInitialMessageMutation() {
    console.log("2. Current chat:", currentChat.data)
    return useMutation({
      mutationFn: async () => {
        if (currentChat.isLoading) {
          console.log("Chat data is loading...");
          return;
        }
        if (currentChat.isError) {
          console.error("Error fetching chat data:", currentChat.error);
          return;
        }
        if (currentChat.data && currentChat.data.messages.length === 1) {
          const initialMessage = currentChat.data.messages[0]?.display;
          console.log("3. Initial message:", initialMessage);
          if (isValidElement(initialMessage)) {
            const messageContent = initialMessage.props.children;
            console.log("4. Sending message const first: ", messageContent);
            const responseMessage = await handleSendMessage(messageContent);
            console.log("5. Response message:", responseMessage);
            setChat((currentChat: Chat[]) => [
              ...currentChat.map((chat) => {
                if (chat.chatID === chatId) {
                  return {
                     ...chat,
                      messages: [...chat.messages, responseMessage]
                     };
                }
                return chat;
              }),
            ]);
            // await insertChatHistory({
            //   user: currentChat.data.messages[0].display.props.children,
            //   message: responseMessage.display.props.children,
            //   timestamp: new Date().toISOString(),
            // });
          }
        }
      },
    });
  }

  const initialMessageMutation = processInitialMessageMutation();

  useEffect(() => {
    if (currentChat.data && currentChat.data.messages.length === 1) {
      initialMessageMutation.mutate();
    }
  }, [currentChat, chat, handleSendMessage]);
  return (
    <>
      <div className="sticky left-0 top-0">
        <Button
          variant="outline"
          className="border-none font-inter text-darkprim hover:bg-secondary active:bg-primary active:text-white"
        >
          {model}
        </Button>
      </div>
      <div>
        {currentChat.data.messages.map((message: Message) => (
          <div key={message.messageID}>{message.display}</div>
        ))}
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
              ])

              await insertChatHistory({
                user: message,
                message: responseMessage.display.props.children,
                timestamp: new Date().toISOString(),
              });
            } catch (error) {
              console.log("error:", error);
            }
          }}
        />
      </div>
    </>
  );
}
