import React, { useState } from 'react';
import { HiBell, HiPhone, HiUser, HiLogout, HiCog, HiDocumentText } from 'react-icons/hi';
import UserProfile from './Dashboard_User/UserProfile';
import FlatDetails from './Dashboard_User/FlatDetails.jsx';
import PaymentSchedule from './Dashboard_User/Payment.jsx';
import Updates from './Dashboard_User/Updates';
import ChatBot from './ChatBot';
import Documents from './Dashboard_User/Documents';
import CurrentDues from './Dashboard_User/CurrentDues';
import DetailedInformation from './Dashboard_User/DetailedInformation';
import MobileSidebar from './Dashboard_User/MobileSidebar';
import CustomerCarePopup from './Dashboard_User/CustomerCarePopup';
import PasswordChangePopup from './Dashboard_User/PasswordChangePopup';
import ConstructionUpdatesPopup from './Dashboard_User/ConstructionUpdatesPopup';
import MyDocumentsPopup from './Dashboard_User/MyDocumentsPopup';
import FlatStatus from './Dashboard_Admin/FlatStatus';
import Report from './Dashboard_Admin/Report';
import LoanDetails from './Dashboard_Admin/LoanDetails';
import Proprite from '../assets/proprite.png';
import Hamburger from '../assets/Hamburger.png';
import flatDetailsIcon from '../assets/flat details.png';
import currentDuesIcon from '../assets/current dues.png';
import paymentIcon from '../assets/payment.png';
import documentsIcon from '../assets/documents.png';

const Layout = ({ 
  activePage, 
  onPageChange, 
  onLogout, 
  onSidebarToggle, 
  onUpdatesToggle, 
  isSidebarOpen, 
  isUpdatesOpen,
  isCustomerCarePopupOpen,
  onCustomerCareClose,
  isAnimating,
  animationKey,
  userRole = 'user', // Default to 'user' role
  onRoleToggle // Temporary prop for testing
}) => {
  // Navbar state
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isUpdatesPopupOpen, setIsUpdatesPopupOpen] = useState(false);
  const [isMyDocumentsPopupOpen, setIsMyDocumentsPopupOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Role-based navigation configuration
  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return [
        {
          key: 'overview',
          label: 'Overview',
          icon: flatDetailsIcon, // Using existing icon for now
          width: '10.625rem'
        },
        {
          key: 'banking',
          label: 'Banking',
          icon: currentDuesIcon, // Using existing icon for now
          width: '10.625rem'
        },
        {
          key: 'projects',
          label: 'Projects',
          icon: paymentIcon, // Using existing icon for now
          width: '10.625rem'
        },
        {
          key: 'documents',
          label: 'Documents',
          icon: documentsIcon,
          width: '10.9375rem'
        }
      ];
    } else {
      return [
        {
          key: 'flatDetails',
          label: 'Flat Details',
          icon: flatDetailsIcon,
          width: '10.625rem'
        },
        {
          key: 'currentDues',
          label: 'Current Dues',
          icon: currentDuesIcon,
          width: '12rem'
        },
        {
          key: 'payment',
          label: 'Payments',
          icon: paymentIcon,
          width: '10.625rem'
        },
        {
          key: 'documents',
          label: 'Documents',
          icon: documentsIcon,
          width: '10.9375rem'
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  // Navbar handlers
  const handleNavClick = (page) => {
    onPageChange(page);
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
  const renderMiddlePanel = () => {
    if (!activePage) {
      return null;
    }

    // Admin components
    if (userRole === 'admin') {
      switch (activePage) {
        case 'overview':
          return (
            <div className={`page-container h-full flex gap-6 ${isAnimating ? 'opacity-50' : ''}`}>
              <div className="basis-[60%] min-w-0 bg-white rounded-xl shadow-sm border border-gray-200">
                <FlatStatus key={`flatStatus-${animationKey}`} />
              </div>
              <div className="basis-[40%] min-w-0 bg-white rounded-xl shadow-sm border border-gray-200">
                <Report key={`report-${animationKey}`} />
              </div>
            </div>
          );
        case 'banking':
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? 'opacity-50' : ''}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <LoanDetails key={`loanDetails-${animationKey}`} />
              </div>
            </div>
          );
        case 'projects':
          return <div className={`page-container h-full flex flex-col ${isAnimating ? 'opacity-50' : ''}`}>
            <div className="text-center py-8 text-gray-500">Projects component coming soon...</div>
          </div>;
        case 'documents':
          return <Documents key={`documents-${animationKey}`} />;
        default:
          return null;
      }
    }

    // User components
    const Component = (() => {
      switch (activePage) {
        case 'flatDetails':
          return <FlatDetails key={`flatDetails-${animationKey}`} />;
        case 'currentDues':
          return <CurrentDues key={`currentDues-${animationKey}`} />;
        case 'payment':
          return <PaymentSchedule key={`payment-${animationKey}`} />;
        case 'documents':
          return <Documents key={`documents-${animationKey}`} />;
        default:
          return null;
      }
    })();

    return (
      <div className={`page-container h-full flex flex-col ${isAnimating ? 'opacity-50' : ''}`}>
        {Component}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen overflow-auto relative"
      style={{
        backgroundImage: "url('/src/assets/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Integrated Navbar */}
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
              <img src={Proprite} alt="The Art" className="h-[3.5rem] w-auto" />
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
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
                  activePage === item.key
                    ? 'text-white font-medium transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg'
                }`}
                style={{
                  width: item.width,
                  height: '2.8125rem',
                  background:
                    activePage === item.key
                      ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                      : undefined,
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
                  style={{
                    marginRight: '0.5625rem',
                    filter: activePage === item.key ? 'invert(1)' : 'none',
                  }}
                />
                <span className="font-medium text-sm font-montserrat">{item.label}</span>
              </button>
            ))}
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
      </nav>

      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => onSidebarToggle()}
        activePage={activePage}
        setActivePage={onPageChange}
        onLogout={onLogout}
        onCustomerCareOpen={() => {}} // Will be handled by parent
      />

      {/* Temporary Role Toggle Button for Testing */}
      {onRoleToggle && (
        <div className="fixed top-20 right-4 z-50">
          <button
            onClick={onRoleToggle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
          >
            Switch to {userRole === 'user' ? 'Admin' : 'User'} ({userRole})
          </button>
        </div>
      )}

      <div className="overflow-hidden h-screen pt-[7.25rem] pb-[2.3125rem] px-11">
        <div className="lg:hidden h-full flex flex-col space-y-3 relative">
          {userRole === 'user' && !activePage && (
            <div className="flex-shrink-0 h-[calc(30vh-2.1875rem)]">
              <UserProfile />
            </div>
          )}
          {userRole === 'user' && !activePage && (
            <div className="flex-1 min-h-0">
              <DetailedInformation />
            </div>
          )}
          {(activePage || userRole === 'admin') && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {renderMiddlePanel()}
            </div>
          )}
          {isUpdatesOpen && (
            <>
              <div 
                className="fixed bg-black bg-opacity-50 z-40 lg:hidden top-[-1vh] left-[-1vw] right-[-1vw] bottom-[-1vh] w-[102vw] h-[102vh]"
                onClick={() => onUpdatesToggle()}
              ></div>
              <div className="fixed left-4 right-4 bottom-4 top-20 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-in-up lg:hidden">
                <div className="p-4">
                  <div className="flex items-center justify-end mb-4">
                    <button 
                      onClick={() => onUpdatesToggle()}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-500 text-xl">×</span>
                    </button>
                  </div>
                  <Updates />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden lg:flex h-full items-center justify-center">
          {userRole === 'admin' ? (
            // Admin layout - only middle section with two components
            <div className="flex gap-[0.9375rem] w-full max-w-[120rem]">
              <div className="flex flex-col w-full h-[49.8125rem]">
                {renderMiddlePanel()}
              </div>
            </div>
          ) : (
            // User layout - three sections
            <div className="flex gap-[0.9375rem]">
              <div className="flex flex-col w-[29.875rem] gap-[0.9375rem]">
                <div className="h-[16.125rem]">
                  <UserProfile />
                </div>
                <div className="h-[32.75rem]">
                  <DetailedInformation />
                </div>
              </div>
              <div className="flex flex-col w-[52.75rem] h-[49.8125rem]">
                <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col min-h-0 rounded-[1.75rem]">
                  {renderMiddlePanel()}
                </div>
              </div>
              <div className="flex flex-col w-[29.875rem] h-[49.8125rem]">
                <div className="bg-white shadow-sm border border-gray-200 h-full p-6 rounded-[1.75rem]">
                  <Updates />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatBot />
      <CustomerCarePopup 
        isOpen={isCustomerCarePopupOpen} 
        onClose={onCustomerCareClose}
      />

      {/* Navbar Popups */}
      <PasswordChangePopup
        isOpen={isPasswordPopupOpen}
        onClose={() => setIsPasswordPopupOpen(false)}
      />

      <ConstructionUpdatesPopup
        isOpen={isUpdatesPopupOpen}
        onClose={() => setIsUpdatesPopupOpen(false)}
      />

      <MyDocumentsPopup
        isOpen={isMyDocumentsPopupOpen}
        onClose={() => setIsMyDocumentsPopupOpen(false)}
      />
    </div>
  );
};

export default Layout;
