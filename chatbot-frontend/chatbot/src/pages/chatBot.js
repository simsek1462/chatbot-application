import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { notification } from 'antd'; 
import LoadingSkeleton from '../components/loadingSkeleton';
import ChatMessages from '../components/chatMessages';
import ChatInput from '../components/chatInput';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isChatDone, setIsChatDone] = useState(false); // End of chat check
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/chatbot/question', { withCredentials: true });
      
      const chatHistory = response.data.chatHistory || [];
      if (chatHistory.length > 0) {
        const previousMessages = chatHistory.map(item => ({
          sender: item.role.toLowerCase(),
          text: item.message,
          sent: true
        }));
        setMessages(previousMessages);
        if (response.data.isDone) { 
          setIsChatDone(true); // Check if the chat is done
        }
      }

      if (response.data.lastResponse) {
        addBotMessage(response.data.lastResponse);
      } 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the question", error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch the response. Please check your connection.',
      });
    }
  };

  const addBotMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: message }]);
  };

  const addUserMessage = (message, success = true) => {
    setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'user', text: message, sent: success }
    ]);
  };

  const clearChat = async () => {
    try {
        const response = await axios.post('http://localhost:5000/chatbot/reset', {}, { withCredentials: true });
        notification.success({
            message: 'Success',
            description: response.data.message,
        });
        // Reset state
        setMessages([]);
        setIsChatDone(false);
        fetchQuestion();
    } catch (error) {
        console.error("Error resetting the chat", error);
        notification.error({
            message: 'Error',
            description: 'Failed to reset the chat. Please check your connection.',
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const currentAnswer = answer;
    setAnswer('');
    addUserMessage(currentAnswer);
    setTyping(true);

    try {
        const response = await axios.post('http://localhost:5000/chatbot/answer', { answer: currentAnswer }, { withCredentials: true });

        if (response.data.nextMessage) {
            addBotMessage(response.data.nextMessage);
        }
        if (response.data.isDone) {
            setIsChatDone(true);
        }
    } catch (error) {
        console.error("Error saving the answer", error);
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].sent = false; 
            return updatedMessages;
        });

        notification.error({
            message: 'Error',
            description: 'Failed to save your answer. Please check your connection.',
        });
    } finally {
        setIsSubmitting(false);
        setTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#35A29F] font-body">
      <div className="bg-[#0B666A] shadow-md rounded-lg p-8 max-w-lg w-full mx-auto flex flex-col space-y-4">
        <h2 className="text-4xl font-bold text-white mb-4 text-center font-heading">Chatbot</h2>
        <div className="flex flex-col space-y-3 overflow-auto h-96 border border-gray-300 rounded-lg p-4 bg-gray-50 scrollbar">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <ChatMessages messages={messages} typing={typing} messagesEndRef={messagesEndRef} />
          )}
        </div>

        {!isChatDone ? (
          <ChatInput
            answer={answer} 
            setAnswer={setAnswer} 
            handleSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            loading={loading}
          />
        ) : (
          <button onClick={clearChat} className='bg-[#97FEED] text-[#071952] font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out hover:bg-[#3ef5d6]'>Start New Chat</button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
