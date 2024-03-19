import React from 'react';
import { Box, Text, Avatar, useMantineTheme } from '@mantine/core';


const Message = ({ text, isUser, avatar }) => {
  const theme = useMantineTheme();
  const chatbotAvatar = '/src/assets/image.png';

  return (
    <Box
      className={`message ${isUser ? 'user-message' : 'chatbot-message'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: theme.spacing.md,
      }}
    >
      {!isUser && (
        <Avatar src={chatbotAvatar} alt="Chatbot Avatar" size="md" mr={theme.spacing.sm} />
      )}
      <Box
        style={{
          backgroundColor: isUser ? theme.colors.gray[1] : theme.colors[theme.primaryColor][1],
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
        }}
      >
        <Text color={theme.colors.dark[9]}>{text}</Text>
      </Box>
    </Box>
  );
};

export default Message;