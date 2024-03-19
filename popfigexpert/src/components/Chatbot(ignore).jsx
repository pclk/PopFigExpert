import React, { useState } from 'react';
// import axios from 'axios';
import { Chatbot as ChatbotClass } from '../api/chatbot'; // Import the Chatbot class from the JavaScript code

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() !== '') {
      const chatbot = new ChatbotClass();
      await chatbot.init();

      const response = await chatbot.openaiClient.executeRun(
        chatbot.thread.id,
        chatbot.assistant.id,
        userInput
      );

      setConversation([...conversation, { user: userInput, assistant: response }]);
      setUserInput('');
    }
  };

  return (
    <div>
      <div className="conversation">
        {conversation.map((message, index) => (
          <div key={index}>
            <p className="user-message">{message.user}</p>
            <p className="assistant-message">{message.assistant}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;