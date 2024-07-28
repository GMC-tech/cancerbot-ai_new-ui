import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import ChatInput from './ChatInput';
import axios from 'axios';

const callAIModel = async (userMessage) => {
  const apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY;
  const apiEndpoint = 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct';

  const response = await axios.post(
    apiEndpoint,
    {
      inputs: userMessage,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response;
};

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isScrolledUp]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const chatContainer = document.querySelector('.chat-history');
    if (chatContainer.scrollTop + chatContainer.clientHeight < chatContainer.scrollHeight) {
      setIsScrolledUp(true);
    } else {
      setIsScrolledUp(false);
    }
  };

  const handleSendMessage = async (text) => {
    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length + 1, text, from: 'user' },
    ]);
    scrollToBottom();
  
    try {
      const response = await callAIModel(text);
      const botResponse = response.data[0].generated_text || 'That\'s an interesting question! Here\'s a sample response.';
  
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: botResponse, from: 'bot' },
        ]);
      }, 1000);
  
    } catch (error) {
      console.error('Error calling AI model:', error);
  
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: 'API not yet initialized. Sending sample text.', from: 'bot' },
        ]);
      }, 1000); 
    } finally {
      scrollToBottom();
    }
  };
  

  return (
    <div className="ChatWindow">
      <div className="chat-history" onScroll={handleScroll}>
        {messages.map((message) => (
          <div key={message.id} className={`message from-${message.from}`}>
            <div className={`message-avatar ${message.from}`}>{message.from === 'user' ? 'U' : 'B'}</div>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
