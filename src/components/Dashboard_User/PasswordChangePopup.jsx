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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up" style={{ padding: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
      <div className="bg-orange-400 shadow-2xl w-full animate-scale-in" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', padding: 'clamp(1.25rem, 2rem, 2.5rem)', maxWidth: 'clamp(24rem, 28rem, 32rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="bg-blue-100 rounded-full flex items-center justify-center" style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}>
              <HiLockClosed className="text-blue-600" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            </div>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Change Password</h2>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
            style={{ width: 'clamp(1.75rem, 2rem, 2.25rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)' }}
          >
            <HiX className="text-gray-500" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          {/* Current Password */}
          <div>
            <label className="block font-medium text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(2.25rem, 3rem, 3.5rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <HiEyeOff style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} /> : <HiEye style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block font-medium text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(2.25rem, 3rem, 3.5rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <HiEyeOff style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} /> : <HiEye style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-medium text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(2.25rem, 3rem, 3.5rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <HiEyeOff style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} /> : <HiEye style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                <div className="border-white border-t-transparent rounded-full animate-spin" style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)', borderWidth: 'clamp(0.0625rem, 0.125rem, 0.1875rem)' }}></div>
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
