import { MessageType } from "@/lib/validators/MessageType";
import { Avatar, Text, Box } from "@mantine/core";

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Box className={`mb-4 flex items-center`}>
      {message.isUser ? (
        <>
          <Text className={`mr-2 rounded-md bg-white p-4`}>{message.text}</Text>
          <Avatar alt="User Avatar" size="lg" />
        </>
      ) : (
        <>
          <Avatar
            src="/chatbot.png"
            alt="Chatbot Avatar"
            size="lg"
            className="mr-2 rounded-full"
          />
          <Text className={`justify-start rounded-md bg-secondary p-4`}>
            {message.text}
          </Text>
        </>
      )}
    </Box>
  );
}
