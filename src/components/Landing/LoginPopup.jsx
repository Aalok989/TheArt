import React, { useState } from 'react';
import { HiEnvelope, HiLockClosed, HiXMark } from 'react-icons/hi2';
import { authAPI } from '../../api/api';

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await authAPI.login(username, password);
      
      // Call the onLoginSuccess function to handle successful login
      if (onLoginSuccess) {
        onLoginSuccess(result.token);
      }
      
      // Close popup
      onClose();
      
      // Reset form
      setUsername('');
      setPassword('');
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 font-serif  ">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                disabled={loading}
                required
              />
              <HiEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                disabled={loading}
                required
              />
              <HiLockClosed className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm transition-colors">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-lg ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'hover:shadow-xl transform hover:scale-105'
            } text-white`}
            style={loading ? {} : {background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <a href="#" className="text-gray-600 text-sm hover:text-gray-700 transition-colors">
              Don't have an account?
            </a>
            <span className="mx-4"></span>
            <a href="#" className="text-black font-medium hover:text-gray-700 transition-colors">
              Sign Up For Free
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
