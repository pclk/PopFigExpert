// components/ChatInput.tsx
"use client";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps extends React.ComponentPropsWithoutRef<"input"> {
  placeholder?: string;
  description?: string;
  clearInput?: boolean;
  submitMessage: (message: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
}
export default function Input({
  placeholder,
  description,
  clearInput = true,
  submitMessage,
  onChange,
}: ChatInputProps) {
  const [userInput, setUserInput] = useState("");

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
            onChange={(e) => {
              setUserInput(e.target.value);
              onChange?.(e); // directly use the event's value
            }}
            onKeyDown={async (e) => {
              onChange?.(e);
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (userInput.trim() !== "") {
                  submitMessage(userInput);
                  if (clearInput) {
                    setUserInput("");
                  }
                }
              }
            }}
          ></TextareaAutosize>
        </div>
        <button
          type="button"
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          onClick={async (e) => {
            if (userInput.trim() !== "") {
              submitMessage(userInput);
              if (clearInput) {
                setUserInput("");
              }
            }
          }}
        >
          <div className="text-white group-hover:text-darkprim">Send</div>
        </button>
      </div>
    </div>
  );
}
