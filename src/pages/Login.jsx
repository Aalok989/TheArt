import React, { useState, useEffect } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import TheArtLogo from '../assets/TheArtLogo.png';
import ArtLogo from '../assets/logo.png';
import PropriteImage from '../assets/proprite.png';
import GoogleLogo from '../assets/google.png';
import AppleLogo from '../assets/apple.png';
import FacebookLogo from '../assets/fb.png';
import { authAPI } from '../api/api';

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [username, setUsername] = useState('radha');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Trigger animations on component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleUsernameVisibility = () => {
    setShowUsername(!showUsername);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authAPI.login(username, password);
      
      // Call the onLogin function to switch to main app
      onLogin(result.token);
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


    return (
      <div className="min-h-screen flex relative" style={{ backgroundColor: '#E8F3EB' }}>


      {/* Left Section - Welcome and Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-yellow-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-100 rounded-full opacity-60"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center w-full">
          {/* Art Logo */}
          <div className={`flex justify-center items-center mb-8 animate-fade-in-up ${isLoaded ? 'animate-delay-100' : ''}`}>
            <img 
              src={ArtLogo} 
              alt="Art Logo" 
              className="max-w-xs w-auto h-auto"
            />
          </div>
          
          <h1 className={`text-5xl font-bold text-gray-800 mb-6 animate-fade-in-up ${isLoaded ? 'animate-delay-200' : ''}`}>Welcome to The Art</h1>
          <p className={`text-xl text-gray-600 mb-8 max-w-md animate-fade-in-up ${isLoaded ? 'animate-delay-300' : ''}`}>
            To keep connected with us please login with your personal info.
          </p>
          
          {/* Amenities Section */}
          <div className={`max-w-2xl w-full animate-fade-in-up ${isLoaded ? 'animate-delay-400' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Premium Amenities</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Entrance Arch with 24 Hours Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Stepping Stones with Water Body</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Badminton Court on Terrace Floor</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Creek with Water Fountains</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Separate Dining for Banquet</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Bakery ICE Cream Parlour</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Senior Citizen's Corner</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Rain Water Harvesting Pits</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>(S.T.P) Sewage Treatment Plant</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Sky Lounge</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Coffee Shop & Waiting Lounge</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <span>Kids Gymboree & Sandpit</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                <span>Sky Walk</span>
              </div>
            </div>
          </div>
          
          {/* Proprite Image */}
          <div className={`flex justify-center items-center mt-8 animate-fade-in-up ${isLoaded ? 'animate-delay-500' : ''}`}>
            <img 
              src={PropriteImage} 
              alt="Proprite" 
              className="max-w-xs w-auto h-auto"
            />
          </div>
          
          {/* Footer */}
          <div className={`flex justify-center items-center mt-8 animate-fade-in-up ${isLoaded ? 'animate-delay-600' : ''}`}>
            <p className="text-sm text-gray-500 font-medium text-center">
              A product by <span className="text-green-600 font-semibold">30 Days Technologies</span>
            </p>
          </div>
          
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className={`lg:hidden flex justify-center mb-8 animate-fade-in-up ${isLoaded ? 'animate-delay-100' : ''}`}>
            <img src={TheArtLogo} alt="The Art" className="h-16 w-auto" />
          </div>
          
          <h2 className={`text-3xl font-bold text-gray-800 mb-8 animate-fade-in-up ${isLoaded ? 'animate-delay-200' : ''}`}>Login to Your account</h2>
          
          <form onSubmit={handleSubmit} className={`space-y-6 animate-fade-in-up ${isLoaded ? 'animate-delay-300' : ''}`}>
            {/* Username Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type={showUsername ? 'text' : 'text'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                  required
                />
                <button
                  type="button"
                  onClick={toggleUsernameVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showUsername ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl hover-lift btn-animate ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img src={AppleLogo} alt="Apple" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Apple</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img src={FacebookLogo} alt="Facebook" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
