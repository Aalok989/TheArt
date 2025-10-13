import React, { useState, useEffect } from 'react';
import userImageBig from '../../assets/user Image big.png';
import emailIcon from '../../assets/Mail.png';
import phoneIcon from '../../assets/phone.png';
import whatsappIcon from '../../assets/whatsapp..png';
import EmailIcon from '../../assets/email.png';
import arrowIcon from '../../assets/arrow.png';
import { customerAPI } from '../../api/api';

const UserProfile = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeContact, setActiveContact] = useState('email'); // Default to email

  useEffect(() => {
    // Fetch user profile data
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getProfile();
        if (response.success) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // If API fails, you could set fallback data or show error message
      } finally {
        setLoading(false);
        // Trigger animations after data is loaded
        setTimeout(() => {
          setIsLoaded(true);
        }, 100);
      }
    };

    getUserProfile();
  }, []);

  // Contact data - now from API
  const contactData = userData ? {
    email: {
      icon: EmailIcon,
      label: userData.contacts.email,
    },
    phone: {
      icon: phoneIcon,
      label: userData.contacts.phone,
    },
    whatsapp: {
      icon: whatsappIcon,
      label: userData.contacts.whatsapp,
    },
  } : null;

  const handleContactClick = (contactType) => {
    setActiveContact(contactType);
  };

  // Loading state
  if (loading || !userData || !contactData) {
    return (
      <div
        className="relative bg-white shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden items-center justify-center"
        style={{ borderRadius: '1.75rem' }}
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative bg-white shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden w-full"
      style={{ borderRadius: 'clamp(1.25rem, 1.75rem, 2rem)' }}
    >
      <div className="h-full flex flex-col justify-between min-h-0" style={{ padding: 'clamp(1.25rem, 1.5rem, 2rem)' }}>
        {/* Profile Section */}
        <div
          className={`flex items-center mb-0 lg:mb-2 animate-fade-in-up ${
            isLoaded ? 'animate-delay-100' : ''
          }`}
          style={{ gap: 'clamp(1rem, 1.25rem, 1.5rem)' }}
        >
          {/* Profile Image - Larger for mobile */}
          <div
            className="bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0 animate-scale-in"
            style={{ width: 'clamp(5rem, 6rem, 6.25rem)', height: 'clamp(5rem, 6rem, 6.25rem)' }}
          >
            <img 
              src={userData.profileImage || userImageBig} 
              alt={userData.fullName} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = userImageBig; }} 
            />
          </div>

          {/* Name and Flat Info - Responsive layout */}
          <div className="animate-fade-in-right flex-1 min-w-0">
            <h2
              className="leading-tight"
              style={{ marginBottom: 'clamp(0.5rem, 0.75rem, 0.75rem)', fontSize: 'clamp(1.25rem, 1.5rem, 1.78125rem)' }}
            >
              <span style={{ color: '#690A7D' }}>Hi, </span>
              <span style={{ color: '#690A7D', fontWeight: '700' }}>
                {userData.fullName.split(' ')[0]}
              </span>
            </h2>
            <p
              className="font-lora"
              style={{ color: '#FF6B9D', fontWeight: '600', fontSize: 'clamp(1rem, 1.125rem, 1.1625rem)' }}
            >
              Flat No. :- {userData.flatNo}
            </p>
          </div>
        </div>

        {/* Contact Icons - Larger for mobile */}
        <div
          className={`flex items-center justify-start animate-fade-in-up ${
            isLoaded ? 'animate-delay-200' : ''
          }`}
          style={{ gap: 'clamp(1rem, 1.25rem, 1.25rem)' }}
        >
          {/* Email Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative ${
              activeContact === 'email' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'email' ? '#000000' : 'transparent',
              width: 'clamp(2.5rem, 3rem, 3.125rem)',
              height: 'clamp(2.5rem, 3rem, 3.125rem)'
            }}
            onClick={() => handleContactClick('email')}
          >
            <img
              src={emailIcon}
              alt="Email"
              className="w-full h-full object-contain"
              style={{ filter: activeContact === 'email' ? 'invert(1)' : 'none' }}
            />
            {activeContact === 'email' && (
              <img
                src={arrowIcon}
                alt="Arrow"
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ bottom: 'clamp(-0.5rem, -0.625rem, -0.625rem)', width: 'clamp(1rem, 1.25rem, 1.25rem)', height: 'clamp(1rem, 1.25rem, 1.25rem)' }}
              />
            )}
          </div>

          {/* Phone Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative ${
              activeContact === 'phone' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'phone' ? '#000000' : 'transparent',
              width: 'clamp(2.5rem, 3rem, 3.125rem)',
              height: 'clamp(2.5rem, 3rem, 3.125rem)'
            }}
            onClick={() => handleContactClick('phone')}
          >
            <img
              src={phoneIcon}
              alt="Phone"
              className="w-full h-full object-contain"
              style={{ filter: activeContact === 'phone' ? 'invert(1)' : 'none' }}
            />
            {activeContact === 'phone' && (
              <img
                src={arrowIcon}
                alt="Arrow"
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ bottom: 'clamp(-0.5rem, -0.625rem, -0.625rem)', width: 'clamp(1rem, 1.25rem, 1.25rem)', height: 'clamp(1rem, 1.25rem, 1.25rem)' }}
              />
            )}
          </div>

          {/* WhatsApp Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative ${
              activeContact === 'whatsapp' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'whatsapp' ? '#000000' : 'transparent',
              width: 'clamp(2.5rem, 3rem, 3.125rem)',
              height: 'clamp(2.5rem, 3rem, 3.125rem)'
            }}
            onClick={() => handleContactClick('whatsapp')}
          >
            <img
              src={whatsappIcon}
              alt="WhatsApp"
              className="w-full h-full object-contain"
              style={{ filter: activeContact === 'whatsapp' ? 'invert(1)' : 'none' }}
            />
            {activeContact === 'whatsapp' && (
              <img
                src={arrowIcon}
                alt="Arrow"
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ bottom: 'clamp(-0.5rem, -0.625rem, -0.625rem)', width: 'clamp(1rem, 1.25rem, 1.25rem)', height: 'clamp(1rem, 1.25rem, 1.25rem)' }}
              />
            )}
          </div>
        </div>

        {/* Contact Info Box - Larger for mobile */}
        <div
          className="rounded-full flex items-center justify-center w-full animate-fade-in-up"
          style={{ backgroundColor: 'rgba(240, 220, 211, 0.5)', paddingLeft: 'clamp(1rem, 1.25rem, 1.25rem)', paddingRight: 'clamp(1rem, 1.25rem, 1.25rem)', marginTop: 'clamp(0.5rem, 0.75rem, 0.625rem)', height: 'clamp(2.5rem, 3rem, 3rem)' }}
        >
          <img
            src={contactData[activeContact].icon}
            alt={activeContact}
            style={{ width: 'clamp(1rem, 1.125rem, 1.125rem)', height: 'clamp(1rem, 1.125rem, 1.125rem)', marginRight: 'clamp(0.75rem, 1rem, 1rem)' }}
          />
          <span className="text-black truncate" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.125rem)' }}>
            {contactData[activeContact].label}
          </span>
        </div>
      </div>
    </div>
  );
};



export default UserProfile;
