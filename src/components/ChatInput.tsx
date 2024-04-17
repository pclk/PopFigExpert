// components/ChatInput.tsx
"use client";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  placeholder?: string;
  description?: string;
  submitMessage: (message: string) => void;
}

export default function ChatInput({
  placeholder,
  description,
  submitMessage,
}: ChatInputProps) {
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      submitMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="sticky bottom-0 left-0 flex w-full bg-white">
      <div className="flex w-full items-end gap-4">
        <div className="flex w-full flex-grow flex-col justify-end">
          <div className="text-muted-foreground mb-1 text-sm text-gray-400">
            {description}
          </div>
          <TextareaAutosize
            className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          ></TextareaAutosize>
        </div>
        <button
          type="button" 
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          onClick={async (e) => {
            handleSendMessage();
          }}
        >
          <div className="text-white group-hover:text-darkprim">Send</div>
        </button>
      </div>
    </div>
  );
}
