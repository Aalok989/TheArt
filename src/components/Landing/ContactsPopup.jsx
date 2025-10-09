import React, { useState } from 'react';
import { HiXMark, HiPhone, HiEnvelope, HiClock, HiChevronDown } from 'react-icons/hi2';

const ContactsPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', source: '' });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">Get in</h2>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{background: 'linear-gradient(180deg, #FC7117, #96430E)', backgroundClip: 'text', color: 'transparent'}}>Touch</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiXMark className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Contact Form */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Phone Field */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* How did you find us dropdown */}
              <div className="relative">
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                >
                  <option value="">How did you find us?</option>
                  <option value="google">Google Search</option>
                  <option value="social">Social Media</option>
                  <option value="referral">Referral</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 sm:py-3.5 lg:py-4 rounded-full font-bold text-sm sm:text-base text-white transition-all duration-200 shadow-lg ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'hover:shadow-xl transform hover:scale-105'
                }`}
                style={loading ? {} : {background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
              >
                {loading ? 'SENDING...' : 'SEND'}
              </button>
            </form>

            {/* Contact Information */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
              {/* Phone */}
              <div className="flex items-center gap-2">
                <HiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-black uppercase">PHONE</span>
                  <span className="text-xs sm:text-sm font-semibold" style={{color: '#FC7117'}}>+91-9355321321</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <HiEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-black uppercase">EMAIL</span>
                  <span className="text-xs sm:text-sm font-semibold" style={{color: '#FC7117'}}>contact@proprite.com</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2">
                <HiClock className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-black uppercase">TIME</span>
                  <span className="text-xs sm:text-sm font-semibold" style={{color: '#FC7117'}}>9:00am - 6:00pm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="flex-1 relative p-4 sm:p-6 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-0 min-h-[300px] lg:min-h-0">
            {/* Google Maps Embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d874.9621446602787!2d76.9334246437481!3d28.694175845356973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1759753150276!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{border: 0, minHeight: '300px'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg lg:rounded-r-2xl lg:rounded-l-none"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPopup;
