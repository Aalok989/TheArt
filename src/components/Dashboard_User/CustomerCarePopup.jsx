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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up" style={{ padding: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
      <div className="bg-[#E8F3EB] shadow-2xl w-full animate-scale-in" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', padding: 'clamp(1.25rem, 2rem, 2.5rem)', maxWidth: 'clamp(24rem, 28rem, 32rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="bg-green-100 rounded-full flex items-center justify-center" style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}>
              <HiPhone className="text-green-600" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            </div>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Customer Care</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            style={{ width: 'clamp(1.75rem, 2rem, 2.25rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)' }}
          >
            <HiX className="text-gray-500" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
          </button>
        </div>

        {/* Current Date & Time Display */}
        <div className="bg-white border border-gray-200" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.25rem)', marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              <HiCalendar style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }} />
              <span>Date: {date}</span>
            </div>
            <div className="flex items-center text-gray-600" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              <HiClock style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }} />
              <span>Time: {time}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          {/* User Field */}
          <div>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              User
            </label>
            <div className="relative">
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                style={{ paddingLeft: 'clamp(2.25rem, 3rem, 3.5rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                placeholder="Enter your name"
                required
              />
              <HiUser className="absolute top-1/2 transform -translate-y-1/2 text-gray-400" style={{ left: 'clamp(0.75rem, 1rem, 1.25rem)', width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                style={{ paddingLeft: 'clamp(2.25rem, 3rem, 3.5rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', minHeight: 'clamp(5rem, 6rem, 7rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                placeholder="Enter your message or query"
                required
              />
              <HiChat className="absolute text-gray-400" style={{ left: 'clamp(0.75rem, 1rem, 1.25rem)', top: 'clamp(0.75rem, 1rem, 1.25rem)', width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                <div className="border-white border-t-transparent rounded-full animate-spin" style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)', borderWidth: 'clamp(0.0625rem, 0.125rem, 0.1875rem)' }}></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="border-t border-gray-200" style={{ marginTop: 'clamp(1rem, 1.5rem, 2rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="text-gray-500 text-center" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
            We'll get back to you within 24 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCarePopup;
