import React, { useState } from 'react';
import { HiX, HiEye, HiEyeOff, HiLockClosed } from 'react-icons/hi';

const PasswordChangePopup = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Password changed successfully!');
      onClose();
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleClose = () => {
    // Reset form when closing
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-[#E8F3EB] rounded-[1rem] shadow-2xl p-[2rem] w-full max-w-[28rem] mx-[1rem] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-[1.5rem]">
          <div className="flex items-center space-x-[0.75rem]">
            <div className="w-[2.5rem] h-[2.5rem] bg-blue-100 rounded-full flex items-center justify-center">
              <HiLockClosed className="w-[1.25rem] h-[1.25rem] text-blue-600" />
            </div>
            <h2 className="text-[1.25rem] font-bold text-gray-800">Change Password</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-[2rem] h-[2rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <HiX className="w-[1.25rem] h-[1.25rem] text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-[1rem]">
          {/* Current Password */}
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.5rem]">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-[1rem] py-[0.75rem] pr-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <HiEyeOff className="w-[1.25rem] h-[1.25rem]" /> : <HiEye className="w-[1.25rem] h-[1.25rem]" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.5rem]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-[1rem] py-[0.75rem] pr-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <HiEyeOff className="w-[1.25rem] h-[1.25rem]" /> : <HiEye className="w-[1.25rem] h-[1.25rem]" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[0.875rem] font-medium text-gray-700 mb-[0.5rem]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-[1rem] py-[0.75rem] pr-[3rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <HiEyeOff className="w-[1.25rem] h-[1.25rem]" /> : <HiEye className="w-[1.25rem] h-[1.25rem]" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-[0.75rem] px-[1rem] rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-[0.5rem]">
                <div className="w-[1rem] h-[1rem] border-[0.125rem] border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Changing Password...</span>
              </div>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePopup;