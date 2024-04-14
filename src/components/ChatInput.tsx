// components/ChatInput.tsx
"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useUIState, useActions } from "ai/rsc";
import { AI } from "@/app/action";
import { nanoid } from "ai";
import { HistoryType } from "@/lib/validators/HistoryType";

interface ChatInputProps {
  placeholder?: string;
  description?: string;
}

export default function ChatInput({ placeholder, description }: ChatInputProps) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() !== "") {
      const message = {
        id: nanoid(),
        text: userInput,
        isUser: true,
      };
      const newHistory: HistoryType = {
        id: nanoid(),
        label: userInput,
        messages: [
          {
            ...message,
          },
        ],
      };
      setMessages((prevMessages) => [...prevMessages, newHistory]);
      setUserInput("");

      // Call the server action to handle the user message
      await submitUserMessage(userInput);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 flex w-full bg-white">
      <div className="flex w-full items-end gap-4">
        <div className="flex w-full flex-grow flex-col justify-end">
          <text className="text-muted-foreground mb-1 text-sm text-gray-400">
            {description}
          </text>
          <TextareaAutosize
            className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            value={userInput}
            onChange={handleInputChange}
          ></TextareaAutosize>
        </div>
        <button
          type="button"
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          onClick={handleSendMessage}
        >
          <text className="text-white group-hover:text-darkprim">Send</text>
        </button>
      </div>
    </div>
  );
}