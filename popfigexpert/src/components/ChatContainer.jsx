// ChatContainer.jsx
import React from 'react';
import Message from './Message';
import { Paper, Avatar, Text, TextInput, Button, Group, Box } from '@mantine/core';
// import { IconSend } from '@tabler/icons-react';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};


const ChatContainer = () => {
  return (
    <Paper shadow="sm" p="md" style={{ maxWidth: 600, margin: 'auto' }}>
      <Group align="center" justify="center" mb="md">
        <Avatar src="/src/assets/image.png" alt="Chatbot Avatar" size="lg" />
        <Text size="lg" weight={500}>PopFigExpert</Text>
        <TypingIndicator />
      </Group>
      <Box className="chat-messages" style={{ maxHeight: 400, overflowY: 'auto' }}>
        {/* <Greetings /> */}
        <Message text="Hello! How can I assist you today?" isUser={false}/>
        <Message text="I need help with my order." isUser={true} />
        <Message text="Sure, I'd be happy to help! Can you provide me with your order number?" isUser={false}/>
        {/* Add more Message components */}
      </Box>
      <Group position="right" mt="md">
        <TextInput placeholder="Type your message..." style={{ flexGrow: 1 }} />
        <Button>Send</Button>
      </Group>
    </Paper>
  );
};

export default ChatContainer;