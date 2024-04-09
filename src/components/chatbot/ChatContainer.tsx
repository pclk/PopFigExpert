// ChatContainer.tsx at src/app/components/chatbot
"use client";
import { useContext, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { MessageType } from "@/lib/validators/MessageType";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { HistoryContext } from "../../context/HistoryContext";
import { HistoryType } from "@/lib/validators/HistoryType";

interface ChatContainerProps {
  selectedHistory?: HistoryType;
}

export default function ChatContainer({ selectedHistory }: ChatContainerProps) {
  const { addMessages, updateMessages } = useContext(HistoryContext);
  const streamRef = useRef<ReadableStream | null>(null);

  const {
    mutate: sendMessage,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: MessageType) => {
      const updatedMessages = [...(selectedHistory?.messages || []), message];
      addMessages(selectedHistory?.id || "", message);

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });
      console.log("Response:", res);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to send message: ${res.status} ${res.statusText}, ${errorText}`,
        );
      }

      streamRef.current = res.body;
      return res;
    },
    onError: (error) => {
      console.error("Error in sendMessage mutation:", error);
    },
    onSuccess: async (res) => {
      if (!res.body) throw new Error("No stream found");
      const stream = res.body;
      console.log("Stream:", stream);

      // construct new message to add
      const id = nanoid();
      const responseMessage: MessageType = {
        id,
        isUser: false,
        text: "",
      };

      addMessages(selectedHistory?.id || "", responseMessage);

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log(chunkValue);

        updateMessages(selectedHistory?.id || "", (prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === id) {
              return { ...message, text: message.text + chunkValue };
            }
            return message;
          }),
        );
      }
    },
  });

  const handleSendMessage = (userInput: string) => {
    if (userInput.trim() !== "") {
      const newMessage: MessageType = {
        id: nanoid(),
        text: userInput,
        isUser: true,
      };
      sendMessage(newMessage);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="">
        {selectedHistory ? (
          selectedHistory.messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        ) : (
          <text>Select a chat to start messaging</text>
        )}
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        isPending={isPending}
        isError={isError}
        error={error}
        placeholder="Chat with Eve..."
        description="Eve may make mistakes. Please check her responses."
      />
    </div>
  );
}
