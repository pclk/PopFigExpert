import { Stack, Box, Textarea, Group, useMantineTheme, Button } from "@mantine/core";
import Message from "./Message";
import { useState } from "react";
// import { Button} from "@nextui-org/react"

interface MessageType {
  text: string;
  isUser: boolean;
}

export default function Chatbot() { 
  const theme = useMantineTheme();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([
    { text: "Hello! How can I assist you today?", isUser: false },
    { text: "I need help with my order.", isUser: true },
    {
      text: "Sure, I'd be happy to help! Can you provide me with your order number?",
      isUser: false,
    },
  ]);

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      const newMessage: MessageType = { text: userInput, isUser: true };
      setMessages([...messages, newMessage]);
      setUserInput("");
    }
  };

  return (
    <Stack w="100%">
      <Box style={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} />
        ))}
      </Box>
      <Group align="flex-end">
        <Textarea
          placeholder="Type your message..."
          description="PopFigExpert can make mistakes. Please double-check responses."
          autosize
          maxRows={20}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={handleSendMessage} className={`bg-${theme.primaryColor}-500 bg-blue-500`}>Send</Button>
      </Group>
    </Stack>
  );
}
