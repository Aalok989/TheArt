import React, { useState, useEffect } from 'react';
import { HiMinus, HiEmojiHappy, HiPaperClip, HiPaperAirplane } from 'react-icons/hi';

const ChatBotPage = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: 'Hello User',
      time: '02:10 PM',
      avatar: '👤'
    },
    {
      id: 2,
      type: 'bot',
      text: 'Welcome to The ART. Pick a topic from the list or type down a question!',
      time: '02:12 PM',
      avatar: '🤖'
    }
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    // Update time immediately
    updateTime();
    
    // Update time every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartChat = () => {
    setIsChatStarted(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        avatar: '👤'
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          type: 'bot',
          text: 'Thank you for your message! How can I help you today?',
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          avatar: '🤖'
        };
        setChatMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isChatStarted) {
    return (
      <div className="fixed bottom-16 right-6 z-50 pointer-events-auto flex flex-col items-end">
        <div className="relative mt-16 mr-6 pointer-events-auto">
          {/* Phone Device Frame */}
          <div className="relative w-96 h-[48rem] bg-gray-900 rounded-3xl p-2 shadow-2xl">
            {/* Phone Screen */}
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
              {/* Status Bar */}
              <div className="bg-gray-900 h-6 flex items-center justify-between px-4 text-white text-xs">
                <span>{currentTime}</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Chat Header */}
              <div className="bg-purple-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-800">Chat with us!</h3>
                <button 
                  onClick={onClose}
                  className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                >
                  <HiMinus className="w-3 h-3" />
                </button>
              </div>

              {/* Main Content */}
              <div className="p-4 relative h-full flex flex-col">
                {/* Top Section - Spacer */}
                <div className="flex-1"></div>

                {/* Middle Section - Bot Image and Welcome Message */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  {/* Bot Image */}
                  <div className="flex justify-center">
                    <img 
                      src="/src/assets/Bot.png" 
                      alt="Bot" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>

                  {/* Welcome Message */}
                  <div className="text-center max-w-xs">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Hello! Nice to see you here! By pressing the "Start chat" button you agree to have your personal data processed as described in our Privacy Policy.
                    </p>
                  </div>
                </div>

                {/* Bottom Section - Start Chat Button */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center w-full max-w-xs">
                    <button 
                      onClick={handleStartChat}
                      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all duration-200 shadow-lg w-full"
                    >
                      Start chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-gray-400 text-xs">Powered by <strong>Proprite</strong></p>
              </div>
            </div>

            {/* Phone Home Button */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="fixed bottom-16 right-6 z-50 pointer-events-auto flex flex-col items-end">
      <div className="relative mt-16 mr-6 pointer-events-auto">
        {/* Phone Device Frame */}
        <div className="relative w-96 h-[48rem] bg-gray-900 rounded-3xl p-2 shadow-2xl">
          {/* Phone Screen */}
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
            {/* Status Bar */}
            <div className="bg-gray-900 h-6 flex items-center justify-between px-4 text-white text-xs">
              <span>{currentTime}</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Chat Header */}
            <div className="bg-purple-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">Chat with us!</h3>
              <button 
                onClick={onClose}
                className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
              >
                <HiMinus className="w-3 h-3" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="min-h-full flex flex-col justify-end">
                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        👤
                      </div>
                      <div className="max-w-xs">
                        <div className="text-xs text-gray-500 mb-1">02:10 PM</div>
                        <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2">
                          <p className="text-sm">Hello User</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">
                        🤖
                      </div>
                      <div className="max-w-xs">
                        <div className="text-xs text-gray-500 mb-1">02:12 PM</div>
                        <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2">
                          <p className="text-sm">Welcome to The ART. Pick a topic from the list or type down a question!</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Button */}
                  <div className="flex justify-end">
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                      Welcome
                    </button>
                  </div>

                  {/* Timestamp below button */}
                  <div className="flex justify-end">
                    <div className="text-xs text-gray-500">02:12 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar - Fixed at bottom */}
            <div className="absolute bottom-8 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Write a messge"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <HiEmojiHappy className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <HiPaperClip className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <HiPaperAirplane className="w-5 h-5 transform rotate-90" />
                </button>
              </div>
            </div>

            {/* Footer - Below input bar */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <p className="text-gray-400 text-xs">Powered by <strong>Proprite</strong></p>
            </div>
          </div>

          {/* Phone Home Button */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
