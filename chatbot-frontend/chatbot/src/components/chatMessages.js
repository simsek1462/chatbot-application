import React from 'react';
import TypingIndicator from './typingIndicator';


const ChatMessages = ({ messages, typing, messagesEndRef }) => {
  return (
    <>
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`p-4 rounded-lg max-w-xs text-gray-100 ${message.sender === 'user' ? 'bg-[#1aa58e]' : 'bg-[#071952]'}`}>
            {message.text}
            {!message.sent && message.sender === 'user' && (
              <div className="text-red-500 text-xs">Message could not be sent</div>
            )}
          </div>
        </div>
      ))}
      {typing && <TypingIndicator />}
      <div ref={messagesEndRef}></div>
    </>
  );
};

export default ChatMessages;
