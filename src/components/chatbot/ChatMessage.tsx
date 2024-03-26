import { MessageType } from "@/lib/validators/MessageType";
import { Avatar, Text, Box } from "@mantine/core";

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Box className={`flex items-center mb-4`}>
      {message.isUser ? (
        <>
          <Text className={`bg-gray-100 rounded-md p-4 mr-2`}>{message.text}</Text>
          <Avatar alt="User Avatar" size="lg" />
        </>
      ) : (
        <>
          <Avatar src="/chatbot.png" alt="Chatbot Avatar" size="lg" className="rounded-full mr-2" />
          <Text className={`bg-blue-100 justify-start rounded-md p-4`}>{message.text}</Text>
        </>
      )}
    </Box>
  );
}