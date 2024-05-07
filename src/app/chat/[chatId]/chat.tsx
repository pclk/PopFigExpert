"use client";

import { useActions, useUIState } from "ai/rsc";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./chat-input";
import type { AI } from "@/app/ai_sdk_action";
import { nanoid } from "ai";
import { useQueryState } from "nuqs";

export interface ChatProps extends React.ComponentProps<"div"> {
  id?: string;
}

export function Chat({ id }: ChatProps) {
  const [messages, setMessages] = useUIState<typeof AI>();

  const messagesRef = useRef<HTMLDivElement>(null);
  const { submitUserMessage } = useActions();

  useEffect(() => {
    if (messages.length === 1) {
      const initialMessage = messages[0].display as string;
      setMessages([{ id: nanoid(), display: <>{initialMessage}</> }]);
    }
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (messages.length === 1 && messages[0].display) {
        const initialMessage = (messages[0].display as React.ReactElement).props
          .children as string;
        console.log("initialMessage", initialMessage);
        try {
          const response = await submitUserMessage(initialMessage, "mixtral");
          setMessages((currentMessages) => [...currentMessages, response]);
        } catch (error) {
          console.error(error);
        }
      }
    };

    sendInitialMessage();
  }, [messages, submitUserMessage, setMessages]);

  return (
    <>
      <div
        ref={messagesRef}
        className="flex h-[calc(100%-20px-1.25rem-20px-2px)] grow flex-col space-y-6 overflow-y-auto"
      >
        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            {message.spinner}
            {message.attachments}
            {message.display}
          </div>
        ))}
        <div className="mb-4"></div>
      </div>
      <ChatInput id={id} />
    </>
  );
}
