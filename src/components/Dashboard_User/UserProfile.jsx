import React, { useState, useEffect } from 'react';
import userImageBig from '../../assets/user Image big.png';
import emailIcon from '../../assets/Mail.png';
import phoneIcon from '../../assets/phone.png';
import whatsappIcon from '../../assets/whatsapp..png';
import EmailIcon from '../../assets/email.png';
import arrowIcon from '../../assets/arrow.png';
import { fetchUserProfile } from '../../api/mockData';

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
        const response = await fetchUserProfile();
        if (response.success) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
      className="relative bg-white shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden"
      style={{ borderRadius: '1.75rem' }}
    >
      <div className="h-full flex flex-col justify-between min-h-0 p-5">
        {/* Profile Section */}
        <div
          className={`flex items-center space-x-4 mb-0 lg:mb-2 animate-fade-in-up ${
            isLoaded ? 'animate-delay-100' : ''
          }`}
        >
          {/* Profile Image - Responsive sizing */}
          <div
            className="bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0 animate-scale-in w-[5rem] h-[5rem] lg:w-[6.25rem] lg:h-[6.25rem]"
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
              className="mb-1 text-[1.125rem] sm:text-[1.25rem] lg:text-[1.78125rem] leading-tight"
            >
              <span style={{ color: '#690A7D' }}>Hi, </span>
              <span style={{ color: '#690A7D', fontWeight: '700' }}>
                {userData.fullName.split(' ')[0]}
              </span>
            </h2>
            <p
              className="font-lora text-[0.875rem] sm:text-[1rem] lg:text-[1.1625rem]"
              style={{ color: '#FF6B9D', fontWeight: '600' }}
            >
              Flat No. :- {userData.flatNo}
            </p>
          </div>
        </div>

        {/* Contact Icons - Responsive layout */}
        <div
          className={`flex items-center justify-start gap-[0.9375rem] animate-fade-in-up ${
            isLoaded ? 'animate-delay-200' : ''
          }`}
        >
          {/* Email Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative w-[2.5rem] h-[2.5rem] lg:w-[3.125rem] lg:h-[3.125rem] ${
              activeContact === 'email' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'email' ? '#000000' : 'transparent'
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
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[1rem] h-[1rem] lg:w-[1rem] lg:h-[1rem]"
              />
            )}
          </div>

          {/* Phone Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative w-[2.5rem] h-[2.5rem] lg:w-[3.125rem] lg:h-[3.125rem] ${
              activeContact === 'phone' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'phone' ? '#000000' : 'transparent'
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
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[1rem] h-[1rem] lg:w-[1rem] lg:h-[1rem]"
              />
            )}
          </div>

          {/* WhatsApp Icon */}
          <div
            className={`cursor-pointer hover:opacity-80 transition-all duration-200 relative w-[2.5rem] h-[2.5rem] lg:w-[3.125rem] lg:h-[3.125rem] ${
              activeContact === 'whatsapp' ? 'rounded-full' : ''
            }`}
            style={{
              backgroundColor: activeContact === 'whatsapp' ? '#000000' : 'transparent'
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
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[1rem] h-[1rem] lg:w-[1rem] lg:h-[1rem]"
              />
            )}
          </div>
        </div>

        {/* Contact Info Box - Responsive */}
        <div
          className="rounded-full flex items-center justify-center px-4 animate-fade-in-up mt-2 w-full h-[2.5rem] lg:h-[2.5rem]"
          style={{ backgroundColor: 'rgba(240, 220, 211, 0.5)' }}
        >
          <img
            src={contactData[activeContact].icon}
            alt={activeContact}
            className="w-[1rem] h-[1rem] mr-3"
          />
          <span className="text-black text-[1rem] truncate">
            {contactData[activeContact].label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
