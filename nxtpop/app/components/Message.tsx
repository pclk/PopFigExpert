import { Box, Text, Avatar, useMantineTheme } from "@mantine/core";

interface MessageProps {
  text: string;
  isUser: boolean;
}

export default function Message({ text, isUser }: MessageProps) {
  const theme = useMantineTheme();

return (
<Box
  className={`flex ${isUser ? "justify-end" : "justify-start"} items-center mb-4`}
>
  {isUser ? (
    <>
      <Text className={`bg-gray-100 rounded-md p-4 mr-2 `}>{text}</Text>
      <Avatar
        alt="User Avatar"
        size="lg"
        className={`bg-${theme.primaryColor}-900`}
      />
    </>
  ) : (
    <>
      <Avatar
        src="/chatbot.png"
        alt="Chatbot Avatar"
        size="lg"
        className="rounded-full mr-2"
      />
        <Text className={`bg-${theme.primaryColor}-100 rounded-md p-4`}>{text}</Text>
    </>
  )}
</Box>
  );
}
