// Message.jsx
import React from "react";
import { Box, Text, Avatar, useMantineTheme } from "@mantine/core";

const Message = ({ text, isUser }) => {
  const theme = useMantineTheme();
  const chatbotAvatar = "/src/assets/image.png";

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: theme.spacing.md,
      }}
    >
      {isUser && (
        <Box
          style={{
            backgroundColor: theme.colors.gray[1],
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            marginRight: theme.spacing.sm,
          }}
        >
          <Text>{text}</Text>
        </Box>
      )}
      {isUser && (
        <Avatar
          alt="User Avatar"
          size="md"
          color={theme.colors[theme.secondaryColor][9]}
        />
      )}
      {!isUser && (
        <Avatar
          src={chatbotAvatar}
          alt="Chatbot Avatar"
          size="md"
          mr={theme.spacing.sm}
        />
      )}
      {!isUser && (
        <Box
          style={{
            backgroundColor: theme.colors[theme.primaryColor][1],
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
          }}
        >
          <Text>{text}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Message;
