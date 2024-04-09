import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isPending: boolean;
  isError: boolean;
  error: any;
  placeholder?: string;
  description?: string;
  givenUserInput?: string;
}

export default function ChatInput({
  onSendMessage,
  isPending,
  isError,
  error,
  placeholder,
  description,
  givenUserInput,
}: ChatInputProps) {
  const [userInput, setUserInput] = useState(givenUserInput || "");

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      onSendMessage(userInput);
      setUserInput("");
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
            className="font-inter box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder={placeholder}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          ></TextareaAutosize>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={isPending}
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
        >
          <text className="text-white group-hover:text-darkprim">
            {isPending ? "Sending..." : "Send"}
          </text>
        </button>
      </div>
      {isError && (
        <text className="text-red text-sm">
          Error: {(error as Error)?.message}
        </text>
      )}
    </div>
  );
}
