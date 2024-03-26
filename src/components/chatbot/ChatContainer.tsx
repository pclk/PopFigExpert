// ChatContainer.tsx at src/app/components/chatbot
"use client";
import { useContext, useState } from "react";
import { Stack, Box, Text, Textarea, Button, Group } from "@mantine/core";
import { useParams } from "next/navigation";
import { HistoryContext } from "../../context/HistoryContext";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { MessageType } from "@/lib/validators/MessageType";
import ChatMessage from "./ChatMessage";

export default function ChatContainer() {
  const params = useParams();
  const { Chathistory, addMessages } = useContext(HistoryContext);
  const [userInput, setUserInput] = useState("");
  const ChatID = params.chatId as string;
  const selectedHistory = Chathistory.find((history) => history.id === ChatID);

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: MessageType) => {
      const updatedMessages = [...(selectedHistory?.messages || []), message];
      addMessages(ChatID, message);
      console.log(updatedMessages);
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMessages),
      });
      return res.body;
    },
    onSuccess: () => {
      console.log("success");
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
        <Button onClick={handleSendMessage} className="bg-teal-400">
          Send
        </Button>
      </Group>
    </Stack>
  );
}