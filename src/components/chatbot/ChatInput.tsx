import { useState, useEffect } from "react";
import { Textarea } from "@mantine/core";

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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      onSendMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="relative bottom-0 left-0 flex w-full">
      <div className="flex w-full items-end gap-4">
        <Textarea
          className="text-darkprim grow caret-primary transition-all focus:text-lg"
          placeholder={placeholder || "Type your message..."}
          description={
            description ||
            "PopFigExpert can make mistakes. Please double-check responses."
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          autosize
          maxRows={20}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isPending}
          className="group rounded-sm border-0 bg-primary px-4 py-2 text-sm transition-all hover:border-2 hover:bg-white active:bg-primary"
        >
          <text className="text-white group-hover:text-darkprim ">
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
