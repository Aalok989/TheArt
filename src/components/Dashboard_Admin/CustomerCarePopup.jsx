import React, { useState } from 'react';
import { HiX, HiUser, HiChat, HiCalendar, HiClock, HiPhone } from 'react-icons/hi';
import { submitCustomerCareMessage } from '../../api/mockData';

const CustomerCarePopup = ({ isOpen, onClose }) => {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { date, time } = getCurrentDateTime();
      const response = await submitCustomerCareMessage({
        user: user.trim(),
        message: message.trim(),
        date,
        time
      });

      if (response.success) {
        alert(
          `Message submitted successfully!\n\n` +
          `Ticket ID: #${response.data.ticketId}\n` +
          `User: ${user}\n` +
          `Message: ${message}\n` +
          `Date & Time: ${date} ${time}\n\n` +
          `${response.message}`
        );
        
        // Reset form
        setUser('');
        setMessage('');
        onClose();
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to submit message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setUser('');
    setMessage('');
    onClose();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };
  };

  const { date, time } = getCurrentDateTime();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-[#E8F3EB] rounded-[1rem] shadow-2xl p-[2rem] w-full max-w-[28rem] mx-[1rem] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-[1.5rem]">
          <div className="flex items-center space-x-[0.75rem]">
            <div className="w-[2.5rem] h-[2.5rem] bg-green-100 rounded-full flex items-center justify-center">
              <HiPhone className="w-[1.25rem] h-[1.25rem] text-green-600" />
            </div>
            <h2 className="text-[1.25rem] font-bold text-gray-800">Customer Care</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-[2rem] h-[2rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <HiX className="w-[1.25rem] h-[1.25rem] text-gray-500" />
          </button>
        </div>

        {/* Current Date & Time Display */}
        <div className="bg-white rounded-lg p-[1rem] mb-[1.5rem] border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[0.5rem] text-[0.875rem] text-gray-600">
              <HiCalendar className="w-[1rem] h-[1rem]" />
              <span>Date: {date}</span>
            </div>
            <div className="flex items-center space-x-[0.5rem] text-[0.875rem] text-gray-600">
              <HiClock className="w-[1rem] h-[1rem]" />
              <span>Time: {time}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          {/* User Field */}
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.5rem]">
              User
            </label>
            <div className="relative">
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-[1rem] py-[0.75rem] pl-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
              <HiUser className="absolute left-[1rem] top-1/2 transform -translate-y-1/2 w-[1.25rem] h-[1.25rem] text-gray-400" />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.5rem]">
              Message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-[1rem] py-[0.75rem] pl-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[3rem] resize-none"
                placeholder="Enter your message or query"
                required
              />
              <HiChat className="absolute left-[1rem] top-[1rem] w-[1.25rem] h-[1.25rem] text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-[0.75rem] px-[1rem] rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-[0.5rem]">
                <div className="w-[1rem] h-[1rem] border-[0.125rem] border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-[1.5rem] pt-[1rem] border-t border-gray-200">
          <div className="text-[0.75rem] text-gray-500 text-center">
            We'll get back to you within 24 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCarePopup;
