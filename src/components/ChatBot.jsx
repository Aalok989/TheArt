import React, { useState } from 'react';
import ChatBotPage from './ChatBotPage';
import ChatBotImage from '../assets/ChatBot.png';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div 
        className="fixed z-50"
        style={{ 
          width: '4.125rem',
          height: '4.125rem',
          bottom: '1.25rem',
          right: '1.25rem'
        }}
      >
        <button 
          onClick={handleOpenChat}
          className="w-full h-full rounded-full flex items-center justify-center shadow-lg hover:scale-110 duration-200 transition-transform cursor-pointer"
          style={{ 
            width: '4.125rem',
            height: '4.125rem'
          }}
        >
          {/* Chatbot PNG Image */}
          <img 
            src={ChatBotImage} 
            alt="Chatbot" 
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* ChatBot Modal */}
      {isOpen && <ChatBotPage onClose={handleCloseChat} />}
    </>
  );
};

export default ChatBot;