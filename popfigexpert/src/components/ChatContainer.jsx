// ChatContainer.jsx
import React, { useState } from "react";
import Message from "./Message";
import {
  Paper,
  Avatar,
  Text,
  Textarea,
  Button,
  Group,
  Box,
} from "@mantine/core";

const ChatContainer = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false },
    { text: "I need help with my order.", isUser: true },
    {
      text: "Sure, I'd be happy to help! Can you provide me with your order number?",
      isUser: false,
    },
  ]);

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      const newMessage = { text: userInput, isUser: true };
      setMessages([...messages, newMessage]);
      setUserInput("");
    }
  };

  return (
    <Paper shadow="sm" p="md" style={{ maxWidth: 600, margin: "auto" }}>
      <Group align="center" justify="center" mb="md">
        <Avatar src="/src/assets/image.png" alt="Chatbot Avatar" size="lg" />
        <Text size="lg" weight={500}>
          PopFigExpert
        </Text>
      </Group>
      <Box
        className="chat-messages"
        style={{ maxHeight: 400, overflowY: "auto" }}
      >
        {messages.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} />
        ))}
      </Box>
      <Group position="right" mt="md" align="flex-end">
        <Textarea
          placeholder="Type your message..."
          description="PopFigExpert can make mistakes. Please double-check responses."
          autosize
          style={{ flexGrow: 1 }}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Group>
    </Paper>
  );
};

export default ChatContainer;
