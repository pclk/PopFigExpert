"use client";

import { useActions, useUIState } from "ai/rsc";
import { useEffect, useRef, useState } from "react";
import { ChatInput2 } from "./chat-input";
import type { AI } from "@/app/ai_sdk_action";
import { UserMessage } from "@/components/ai-ui/message";
import { nanoid } from "ai";

export interface ChatProps extends React.ComponentProps<"div"> {
  id?: string;
}

export function Chat({ id }: ChatProps) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useUIState<typeof AI>()

  const messagesRef = useRef<HTMLDivElement>(null);
  const {submitUserMessage} = useActions();

  useEffect(() => {
    if (messages.length === 1) {
      const initialMessage = messages[0].display as string;
      setMessages([{id: nanoid(), display: <UserMessage>{initialMessage}</UserMessage>}])
    }
  }, [])


  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (messages.length === 1) {
        const initialMessage = messages[0].display as string;
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
      <div ref={messagesRef} className="flex flex-col h-[calc(100%-20px-1.25rem-20px-2px)] grow space-y-6 overflow-y-auto">
        {messages.map((message) => (          
          <div key={message.id} className="space-y-4">
            {message.spinner}
            {message.attachments}
            {message.display}
          </div>
        ))}
      </div>
      <ChatInput2 id={id} input={input} setInput={setInput} />
    </>
  );
}
