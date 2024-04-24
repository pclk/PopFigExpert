"use client";

import { useAIState, useActions, useUIState } from "ai/rsc";
import { useEffect, useRef, useState } from "react";
import { ChatInput2 } from "./chat-input";
import type { AI } from "@/app/ai_sdk_action";

export interface ChatProps extends React.ComponentProps<"div"> {
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useUIState<typeof AI>()

  const messagesRef = useRef<HTMLDivElement>(null);
  const {submitUserMessage} = useActions();


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
      <div ref={messagesRef} className="flex flex-col h-[calc(100%-20px-1.25rem-20px-2px)] grow">
        {messages.map((message) => (          
          <div key={message.id} className="message">
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
