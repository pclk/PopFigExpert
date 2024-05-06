// components/Input.tsx
"use client";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useUserInput } from "@/app/stores";

interface ChatInputProps extends React.ComponentPropsWithoutRef<"input"> {
  placeholder?: string;
  description?: string;
  clearInput?: boolean;
  value?: string;
  submitMessage: (message: string) => void;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}
export default function Input({
  placeholder,
  description,
  clearInput = true,
  submitMessage,
}: ChatInputProps) {
  const {userInput, setUserInput} = useUserInput()

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const messageToSend = userInput;
      if (messageToSend.trim() !== "") {
        submitMessage(messageToSend);
        if (clearInput) {
          setUserInput("");
        }
      }
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
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          ></TextareaAutosize>
        </div>
        <button
          type="button"
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-darkprim active:bg-secondary"
          onClick={async () => {
            const messageToSend = userInput!;
            if (messageToSend.trim() !== "") {
              submitMessage(messageToSend);
              if (clearInput) {
                setUserInput("");
              }
            }
          }}
        >
          <div className="text-darkprim group-hover:text-white group-active:text-darkprim">Send</div>
        </button>
      </div>
    </div>
  );
}
