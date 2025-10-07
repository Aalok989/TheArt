import React, { useState } from 'react';
import { HiBell, HiPhone, HiUser, HiLogout, HiCog, HiDocumentText } from 'react-icons/hi';
import TheArtLogo from '../../assets/TheArtLogo.png';
import Hamburger from '../../assets/Hamburger.png';
import flatDetailsIcon from '../../assets/flat details.png';
import currentDuesIcon from '../../assets/current dues.png';
import paymentIcon from '../../assets/payment.png';
import documentsIcon from '../../assets/documents.png';
import PasswordChangePopup from './PasswordChangePopup';
import ConstructionUpdatesPopup from './ConstructionUpdatesPopup';
import MyDocumentsPopup from './MyDocumentsPopup';

const Navbar = ({
  activePage,
  setActivePage,
  onLogout,
  onSidebarToggle,
  onUpdatesToggle,
  isSidebarOpen,
  isUpdatesOpen,
}) => {
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isUpdatesPopupOpen, setIsUpdatesPopupOpen] = useState(false);
  const [isMyDocumentsPopupOpen, setIsMyDocumentsPopupOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
  };

  const handleSettingsClick = () => {
    setIsPasswordPopupOpen(true);
  };

  const handleNotificationsClick = () => {
    setIsUpdatesPopupOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleMyDocumentsClick = () => {
    setIsMyDocumentsPopupOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Mobile handlers
  const handleMobileUpdatesClick = () => {
    setIsUpdatesPopupOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleMobileUpdatesToggle = () => {
    onUpdatesToggle();
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav
      className="relative"
      style={{
        height: '7.25rem',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '40',
        paddingLeft: '2.75rem',
        paddingRight: '3.125rem',
      }}
    >
      <div className="h-full flex items-center justify-between relative">
        {/* Left Section - Hamburger Menu and Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
          {/* Hamburger Menu - Hidden on desktop, visible on mobile/tablet */}
          <button
            onClick={onSidebarToggle}
            className={`lg:hidden w-[2.5rem] h-[2.5rem] flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
              isSidebarOpen
                ? 'bg-white shadow-md scale-105 opacity-0 pointer-events-none'
                : 'hover:bg-white/50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1 w-[1.25rem] h-[1.25rem]">
              <span
                className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
                }`}
              ></span>
              <span
                className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              ></span>
              <span
                className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                  isSidebarOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
                }`}
              ></span>
            </div>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={TheArtLogo} alt="The Art" className="h-[3.5rem] w-auto" />
          </div>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div
          className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2"
          style={{
            gap: '0.625rem',
            minWidth: '20rem',
          }}
        >
          <button
            onClick={() => handleNavClick('flatDetails')}
            className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
              activePage === 'flatDetails'
                ? 'text-white font-medium transform scale-105'
                : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg'
            }`}
            style={{
              width: '10.625rem',
              height: '2.8125rem',
              background:
                activePage === 'flatDetails'
                  ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                  : undefined,
            }}
          >
            <img
              src={flatDetailsIcon}
              alt="Flat Details"
              className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
              style={{
                marginRight: '0.5625rem',
                filter: activePage === 'flatDetails' ? 'invert(1)' : 'none',
              }}
            />
            <span className="font-medium text-sm font-montserrat">Flat Details</span>
          </button>

          <button
            onClick={() => handleNavClick('currentDues')}
            className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
              activePage === 'currentDues'
                ? 'text-white font-medium transform scale-105'
                : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg'
            }`}
            style={{
              width: '12rem',
              height: '2.8125rem',
              background:
                activePage === 'currentDues'
                  ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                  : undefined,
            }}
          >
            <img
              src={currentDuesIcon}
              alt="Current Dues"
              className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
              style={{
                marginRight: '0.5625rem',
                filter: activePage === 'currentDues' ? 'invert(1)' : 'none',
              }}
            />
            <span className="font-medium text-sm font-montserrat">Current Dues</span>
          </button>

          <button
            onClick={() => handleNavClick('payment')}
            className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
              activePage === 'payment'
                ? 'text-white font-medium transform scale-105'
                : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg'
            }`}
            style={{
              width: '10.625rem',
              height: '2.8125rem',
              background:
                activePage === 'payment'
                  ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                  : undefined,
            }}
          >
            <img
              src={paymentIcon}
              alt="Payment"
              className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
              style={{
                marginRight: '0.5625rem',
                filter: activePage === 'payment' ? 'invert(1)' : 'none',
              }}
            />
            <span className="font-medium text-sm font-montserrat">Payments</span>
          </button>

          <button
            onClick={() => handleNavClick('documents')}
            className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
              activePage === 'documents'
                ? 'text-white font-medium transform scale-105'
                : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg'
            }`}
            style={{
              width: '10.9375rem',
              height: '2.8125rem',
              background:
                activePage === 'documents'
                  ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                  : undefined,
            }}
          >
            <img
              src={documentsIcon}
              alt="Documents"
              className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
              style={{
                marginRight: '0.5625rem',
                filter: activePage === 'documents' ? 'invert(1)' : 'none',
              }}
            />
            <span className="font-medium text-sm font-montserrat">Documents</span>
          </button>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Desktop Icons - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleSettingsClick}
              className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate"
            >
              <HiCog className="w-[1.25rem] h-[1.25rem] text-gray-600 transition-transform duration-300 hover:rotate-90" />
            </button>
            <button
              onClick={handleNotificationsClick}
              className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate"
            >
              <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600 transition-transform duration-300 hover:scale-110" />
            </button>
          </div>

          {/* Mobile Updates Toggle Button */}
          <button
            onClick={handleMobileUpdatesToggle}
            className="lg:hidden w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate"
          >
            <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600 transition-transform duration-300 hover:scale-110" />
          </button>
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Aman Bhutani"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <HiUser className="w-[1.25rem] h-[1.25rem] text-gray-600" />
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 top-[3rem] w-[12rem] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up"
              >
                {/* Desktop Only Items */}
                <div className="lg:hidden">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiCog className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-montserrat">Settings</span>
                  </button>
                  <button
                    onClick={handleMobileUpdatesClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-montserrat">Updates</span>
                  </button>
                </div>

                {/* Common Items */}
                <button
                  onClick={handleMyDocumentsClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <HiDocumentText className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 font-montserrat">My Documents</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <HiLogout className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 font-montserrat">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Popup */}
      <PasswordChangePopup
        isOpen={isPasswordPopupOpen}
        onClose={() => setIsPasswordPopupOpen(false)}
      />

      {/* Construction Updates Popup */}
      <ConstructionUpdatesPopup
        isOpen={isUpdatesPopupOpen}
        onClose={() => setIsUpdatesPopupOpen(false)}
      />

      {/* My Documents Popup */}
      <MyDocumentsPopup
        isOpen={isMyDocumentsPopupOpen}
        onClose={() => setIsMyDocumentsPopupOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
