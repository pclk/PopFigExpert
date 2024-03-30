// ChatContainer.tsx at src/app/components/chatbot
"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { Stack, Box, Text, Textarea, Button, Group } from "@mantine/core";
import { useParams } from "next/navigation";
import { HistoryContext } from "../../context/HistoryContext";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { MessageType } from "@/lib/validators/MessageType";
import ChatMessage from "./ChatMessage";

export default function ChatContainer() {
  const params = useParams()!;
  const { Chathistory, addMessages, updateMessages } = useContext(HistoryContext);
  const [userInput, setUserInput] = useState("");
  const ChatID = params.chatId as string;
  const selectedHistory = Chathistory.find((history) => history.id === ChatID);
  const streamRef = useRef<ReadableStream | null>(null);

  const { mutate: sendMessage, isPending, isError, error } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: MessageType) => {
      const updatedMessages = [...(selectedHistory?.messages || []), message];
      addMessages(ChatID, message);

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
        throw new Error(`Failed to send message: ${res.status} ${res.statusText}, ${errorText}`);
      }

      streamRef.current = res.body;
      return res;
    },
    onError: (error) => {
      console.error("Error in sendMessage mutation:", error);
    },

    onSuccess: async (res) => {
      if (!res.body) throw new Error('No stream found')
      const stream = res.body
      console.log('Stream:', stream);
      // construct new message to add
      const id = nanoid()
      const responseMessage: MessageType = {
        id,
        isUser: false,
        text: '',
      }

      addMessages(ChatID, responseMessage)

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        console.log(chunkValue)
        updateMessages(ChatID, (prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === id) {
            return { ...message, text: message.text + chunkValue };
          }
          return message;      
        }));
      }
    },
  });

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      const newMessage: MessageType = {
        id: nanoid(),
        text: userInput,
        isUser: true,
      };
      sendMessage(newMessage);
      setUserInput("");
    }
  };

  return (
    <Stack w="100%">
      <Box style={{ flexGrow: 1, overflowY: "auto" }}>
        {selectedHistory ? (
          selectedHistory.messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        ) : (
          <Text size="xl">Select a chat to start messaging</Text>
        )}
      </Box>
      <Group align="flex-end">
        <Textarea
          placeholder="Type your message..."
          description="PopFigExpert can make mistakes. Please double-check responses."
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
        <Button onClick={handleSendMessage} className="flex" disabled={isPending}>
          {isPending ? "Sending..." : "Send"}
        </Button>
      </Group>
      {isError && (
        <Text color="red" size="sm">
          Error: {(error as Error)?.message}
        </Text>
      )}
    </Stack>
  );
}