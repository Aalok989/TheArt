import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiHome, 
  HiChevronDown, 
  HiUser, 
  HiBell, 
  HiChevronLeft,
  HiChevronRight,
  HiPlus,
  HiCamera,
  HiChatBubbleLeftRight,
  HiCalendar,
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineSquare3Stack3D,
  HiOutlineMapPin,
  HiBars3,
  HiXMark
} from "react-icons/hi2";
import LoginPopup from './LoginPopup';
import FeaturesPopup from './FeaturesPopup';
import ContactsPopup from './ContactsPopup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../styles/property-swiper.css';

const normalizeRole = (role) => {
  const normalized = (role || 'user').toLowerCase();
  if (normalized === 'admin') {
    return 'superadmin';
  }
  if (normalized === 'superadmin') {
    return 'superadmin';
  }
  if (normalized === 'builder_admin' || normalized === 'builderadmin') {
    return 'builder_admin';
  }
  if (normalized === 'user' || normalized === 'customer') {
    return 'user';
  }
  return 'user';
};

const getStoredRole = () => {
  if (typeof window === 'undefined') {
    return 'user';
  }
  const rawRole = localStorage.getItem('userRole');
  const normalizedRole = normalizeRole(rawRole);
  if (rawRole !== normalizedRole) {
    localStorage.setItem('userRole', normalizedRole);
  }
  return normalizedRole;
};

function Landing({ onLogin }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState(() => getStoredRole()); // Get normalized role from localStorage
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);
  const [showContactsPopup, setShowContactsPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCustomerUser = userRole === 'user';
  const isBuilderAdmin = userRole === 'builder_admin';
  const isSuperAdmin = userRole === 'superadmin';

  // Dummy property data for cube swiper
  const propertyCards = [
    {
      id: 1,
      name: "Golden Springfield",
      location: "2821Z. Lake Sevilla, Beverly Hills, LA",
      bedrooms: 4,
      bathrooms: 2,
      size: "6x78.5 m²",
      distance: 18.2,
      images: "+28 Images",
      imageSrc: "/src/assets/poster1.jpg"
    },
    {
      id: 2,
      name: "Royal Gardens Villa",
      location: "125 Oak Street, Manhattan, NY",
      bedrooms: 5,
      bathrooms: 3,
      size: "8x95.2 m²",
      distance: 12.8,
      images: "+32 Images",
      imageSrc: "/src/assets/poster2.jpg"
    },
    {
      id: 3,
      name: "Emerald Estates",
      location: "456 Pine Avenue, San Francisco, CA",
      bedrooms: 3,
      bathrooms: 2,
      size: "5x65.3 m²",
      distance: 25.6,
      images: "+24 Images",
      imageSrc: "/src/assets/poster3.jpg"
    },
    {
      id: 4,
      name: "Crystal Palace",
      location: "789 Diamond Hill, Miami, FL",
      bedrooms: 6,
      bathrooms: 4,
      size: "10x110.7 m²",
      distance: 32.1,
      images: "+41 Images",
      imageSrc: "/src/assets/poster4.jpg"
    },
    {
      id: 5,
      name: "Sunset Manor",
      location: "321 Sunrise Boulevard, Los Angeles, CA",
      bedrooms: 4,
      bathrooms: 3,
      size: "7x85.4 m²",
      distance: 15.3,
      images: "+29 Images",
      imageSrc: "/src/assets/poster5.jpg"
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'features') {
      setShowFeaturesPopup(true);
    } else if (tab === 'contacts') {
      setShowContactsPopup(true);
    }
  };

  const handleExploreClick = () => {
    setShowExploreMenu(!showExploreMenu);
  };

  const handleNotificationClick = () => {
  };

  const handleUserClick = () => {
    setShowLoginPopup(true);
  };

  // Handle successful login
  const handleLoginSuccess = (token) => {
    // Update isLoggedIn and userRole from localStorage after login
    setIsLoggedIn(true);
    const role = getStoredRole();
    setUserRole(role);
    console.log('[Landing] Logged in with role:', role);
    
    // Call the same onLogin function that the Login page uses
    if (onLogin) {
      onLogin(token);
    }
  };

  // Sync userRole and isLoggedIn with localStorage when it changes (one-time check on mount)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userRole') {
        const role = normalizeRole(e.newValue);
        setUserRole(role);
      } else if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };
    
    // Listen for storage events (only fires from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle dashboard navigation based on user role
  const handleGoToDashboard = () => {
    const isMobileDevice = window.innerWidth < 1024;
    const role = getStoredRole();
    
    if (role === 'superadmin' || role === 'builder_admin') {
      // Admin roles
      if (isMobileDevice) {
        navigate('/dashboard/flatStatus', { replace: false });
      } else {
        navigate('/dashboard/dashboard', { replace: false });
      }
    } else {
      // Regular (customer) users
      if (isMobileDevice) {
        navigate('/dashboard', { replace: false });
      } else {
        navigate('/dashboard/flatDetails', { replace: false });
      }
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col font-outfit">
      {/* Header */}
      <header className="bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Hamburger Menu - Mobile Only */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <HiXMark className="w-6 h-6 text-black" />
            ) : (
              <HiBars3 className="w-6 h-6 text-black" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="/src/assets/proprite.png"
              alt="Proprite Logo"
              className="w-32 sm:w-40 lg:w-48 h-16 sm:h-20 lg:h-24 object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => handleTabClick('home')}
              className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                activeTab === 'home' ? 'text-white' : 'text-black hover:bg-gray-100'
              }`}
              style={activeTab === 'home' ? {background: 'linear-gradient(180deg, #FC7117, #96430E)'} : {}}
            >
              <HiHome className="w-4 h-4" />
              <span>Home</span>
            </button>
              <button 
                onClick={handleExploreClick}
                className="flex items-center space-x-1 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors relative"
                style={showExploreMenu ? {background: 'linear-gradient(180deg, #FC7117, #96430E)', backgroundClip: 'text', color: 'transparent'} : {}}
              >
              <span className={showExploreMenu ? '' : 'text-black'}>Explore</span>
              <HiChevronDown className={`w-4 h-4 transition-transform duration-150 ease-out ${showExploreMenu ? 'rotate-180 text-orange-500' : 'text-black'}`} />
              <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50 transition-all duration-150 ease-out transform ${
                showExploreMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-gray-700">Projects</div>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-gray-700">Locations</div>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-gray-700">Agents</div>
              </div>
            </button>
            {/* Grouped Navigation Links */}
            <div className="bg-white border border-gray-200 rounded-full px-6 py-3 flex items-center space-x-8 shadow-sm">
              <button 
                onClick={() => handleTabClick('features')}
                className={`transition-colors ${
                  activeTab === 'features' ? 'font-semibold' : 'text-gray-600 hover:text-black'
                }`}
                style={activeTab === 'features' ? {background: 'linear-gradient(180deg, #FC7117, #96430E)', backgroundClip: 'text', color: 'transparent'} : {}}
              >
                Features
              </button>
              <button 
                onClick={() => handleTabClick('contacts')}
                className={`transition-colors ${
                  activeTab === 'contacts' ? 'font-semibold' : 'text-gray-600 hover:text-black'
                }`}
                style={activeTab === 'contacts' ? {background: 'linear-gradient(180deg, #FC7117, #96430E)', backgroundClip: 'text', color: 'transparent'} : {}}
              >
                Contacts
              </button>
            </div>
          </nav>

           {/* Right Icons */}
           <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
             <button 
               onClick={handleNotificationClick}
               className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <HiBell className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
             </button>
             <button 
               onClick={handleUserClick}
               className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <HiUser className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
             </button>
           </div>
        </div>

        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Sidebar - Slides in from left */}
        <div className={`lg:hidden fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ width: 'min(80%, 320px)' }}>
          <div className="h-full overflow-y-auto">
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <img
                src="/src/assets/proprite.png"
                alt="Proprite Logo"
                className="h-12 object-contain"
              />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6 text-black" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-3">
              {/* Home */}
              <button
                onClick={() => {
                  handleTabClick('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'home' 
                    ? 'bg-gradient-to-r from-[#FC7117] to-[#96430E] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <HiHome className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </button>

              {/* Explore with sub-menu */}
              <div>
                <button
                  onClick={() => setShowExploreMenu(!showExploreMenu)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <span className="font-medium">Explore</span>
                  <HiChevronDown className={`w-5 h-5 transition-transform ${showExploreMenu ? 'rotate-180' : ''}`} />
                </button>
                {showExploreMenu && (
                  <div className="mt-2 ml-4 space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      Projects
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      Locations
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      Agents
                    </button>
                  </div>
                )}
              </div>

              {/* Features */}
              <button
                onClick={() => {
                  handleTabClick('features');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'features' 
                    ? 'bg-gradient-to-r from-[#FC7117] to-[#96430E] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="font-medium">Features</span>
              </button>

              {/* Contacts */}
              <button
                onClick={() => {
                  handleTabClick('contacts');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'contacts' 
                    ? 'bg-gradient-to-r from-[#FC7117] to-[#96430E] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="font-medium">Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 relative px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 lg:pt-2 pb-2 sm:pb-4 lg:pb-8 overflow-hidden">
        {/* Background Image Container with Rounded Corners */}
        <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden">
          <style>{`
            .landing-bg {
              background-size: cover;
            }
            @media (min-width: 1024px) {
              .landing-bg {
                background-size: 100% 100% !important;
              }
            }
          `}</style>
          <div
            className="landing-bg absolute inset-0 bg-no-repeat bg-center"
            style={{ 
              backgroundImage: "url(/src/assets/bg.jpg)",
            }}
          />

          {/* User Dashboard Cards - Only show on home tab and when popups are closed */}
          {activeTab === 'home' && !showLoginPopup && !showFeaturesPopup && !showContactsPopup && (
            <div className="absolute left-2 sm:left-4 lg:left-8 bottom-4 sm:bottom-6 lg:bottom-8 space-y-2 z-10 max-w-[90%] sm:max-w-xs lg:max-w-none overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
              {isCustomerUser ? (
                /* Take a Tour Card for Regular Users */
                <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 w-full sm:w-80 lg:w-96">
                   {/* Take a Tour Section */}
                   <div className="flex items-center justify-between mb-3 sm:mb-4">
                     <span className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-medium font-poly">Take a Tour</span>
                     <img src="/src/assets/Larrow.png" alt="Arrow" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                   </div>
                  
                   {/* Dashed Separator */}
                   <div className="border-t-2 border-dashed border-gray-300 mb-4 sm:mb-5 lg:mb-6"></div>
                   
                   {/* Book a Demo and Dashboard Buttons */}
                   <div className="flex flex-row space-x-2">
                     <button 
                       onClick={() => setShowContactsPopup(true)}
                       className="flex-1 py-2 sm:py-2.5 lg:py-3 px-3 sm:px-3.5 lg:px-4 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins" 
                       style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                     >
                       Book Demo
                     </button>
                     <button 
                       onClick={handleGoToDashboard}
                       className="flex-1 py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins" 
                       style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                     >
                       Dashboard
                     </button>
                   </div>
                </div>
              ) : isBuilderAdmin ? (
                /* Builder Admin Card */
                <div className="space-y-2 w-full sm:w-80 lg:w-96">
                  <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg px-4 sm:px-5 lg:px-6 pt-5 sm:pt-6 lg:pt-7 pb-4 sm:pb-5 lg:pb-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div>
                        <h2 className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-Poly leading-tight">
                          Builder<br />Workspace
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                          Coordinate projects, teams, and site progress.
                        </p>
                      </div>
                      <div className="bg-white rounded-full p-2 sm:p-3 shadow-md">
                        <HiOutlineHome className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" />
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 mb-4 sm:mb-5 lg:mb-6"></div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                      <button className="bg-white/80 text-gray-800 rounded-xl px-3 py-2 sm:py-3 flex flex-col items-start shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs sm:text-sm font-semibold">Site Updates</span>
                        <span className="text-[11px] sm:text-xs text-gray-500 mt-1">Track daily status</span>
                      </button>
                      <button className="bg-white/80 text-gray-800 rounded-xl px-3 py-2 sm:py-3 flex flex-col items-start shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs sm:text-sm font-semibold">Team Roster</span>
                        <span className="text-[11px] sm:text-xs text-gray-500 mt-1">Manage crew shifts</span>
                      </button>
                      <button className="bg-white/80 text-gray-800 rounded-xl px-3 py-2 sm:py-3 flex flex-col items-start shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs sm:text-sm font-semibold">Vendor Calls</span>
                        <span className="text-[11px] sm:text-xs text-gray-500 mt-1">Stay in touch</span>
                      </button>
                      <button className="bg-white/80 text-gray-800 rounded-xl px-3 py-2 sm:py-3 flex flex-col items-start shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs sm:text-sm font-semibold">Milestones</span>
                        <span className="text-[11px] sm:text-xs text-gray-500 mt-1">Check upcoming</span>
                      </button>
                    </div>

                    <button
                      onClick={handleGoToDashboard}
                      className="w-full py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins"
                      style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                    >
                      Open Builder Dashboard
                    </button>
                  </div>
                </div>
              ) : isSuperAdmin ? (
                /* Superadmin Dashboard Card */
                <div className="space-y-2 w-full sm:w-80 lg:w-96">
                  {/* Management Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 text-white px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-full flex items-center justify-center space-x-1 sm:space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}>
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium">Manage Staff</span>
                    </button>
                    <button className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-full flex items-center justify-center space-x-1 sm:space-x-2 transition-colors">
                      <HiHome className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Manage Properties</span>
                    </button>
                  </div>

                  {/* View Reports Section */}
                  <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg pt-6 sm:pt-7 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-3 sm:pb-3.5 lg:pb-4 relative">
                    {/* Plus Icon */}
                    <button className="absolute top-4 right-4 sm:top-5 sm:right-5 lg:top-6 lg:right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-colors">
                      <HiPlus className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-gray-700" />
                    </button>
                    
                    <h2 className="text-gray-800 mb-2 sm:mb-2.5 lg:mb-3 font-Poly font-regular text-2xl sm:text-3xl lg:text-4xl leading-tight">
                      View<br />Reports
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">Manage your property business</p>
                    
                    {/* Dashed Separator */}
                    <div className="border-t-2 border-dashed border-gray-300 mb-3 sm:mb-3.5 lg:mb-4"></div>
                    
                    {/* Go to Dashboard Button */}
                    <div className="flex justify-center">
                      <button 
                        onClick={handleGoToDashboard}
                        className="py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins w-full sm:w-auto" 
                        style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Default fallback mirrors user card */
                <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6 w-full sm:w-80 lg:w-96">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-medium font-poly">Take a Tour</span>
                    <img src="/src/assets/Larrow.png" alt="Arrow" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 mb-4 sm:mb-5 lg:mb-6"></div>
                  <div className="flex flex-row space-x-2">
                    <button
                      onClick={() => setShowContactsPopup(true)}
                      className="flex-1 py-2 sm:py-2.5 lg:py-3 px-3 sm:px-3.5 lg:px-4 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins"
                      style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                    >
                      Book Demo
                    </button>
                    <button
                      onClick={handleGoToDashboard}
                      className="flex-1 py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-6 rounded-full text-white font-semibold text-base sm:text-lg lg:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins"
                      style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Property Cards Cube Swiper - Only show on home tab and when popups are closed */}
          {activeTab === 'home' && !showLoginPopup && !showFeaturesPopup && !showContactsPopup && (
            <div className="hidden md:block absolute right-8 lg:right-16 xl:right-20 bottom-4 sm:bottom-6 lg:bottom-8 z-10 w-64 lg:w-72 xl:w-80">
            {/* Custom Navigation Arrows - Outside Card But Inside Background */}
            <button className="swiper-button-next-custom absolute -left-8 lg:-left-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl">
              <HiChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <button className="swiper-button-prev-custom absolute -right-8 lg:-right-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl">
              <HiChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            
            <Swiper
              effect="cube"
              grabCursor
              cubeEffect={{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              modules={[EffectCube, Pagination, Autoplay, Navigation]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="property-cube-swiper"
            >
              {propertyCards.map((property) => (
                <SwiperSlide key={property.id}>
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden w-full h-full">
                    {/* Property Image Section */}
                    <div className="relative h-36 lg:h-44">
                      <div 
                        className="h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${property.imageSrc})` }}
                      />
                      {/* Nearby Badge */}
                      <div className="absolute top-3 left-3 lg:top-4 lg:left-4">
                        <div className="bg-white/90 text-black px-2 py-0.5 lg:px-3 lg:py-1 rounded-full flex items-center space-x-1 shadow-sm">
                          <HiHome className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          <span className="text-xs font-medium">Nearby</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Details Section */}
                    <div className="p-4 lg:p-5 bg-white">
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <button className="bg-gray-100 text-gray-600 px-2 py-0.5 lg:py-1 rounded-full text-xs flex items-center space-x-1">
                          <HiCamera className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          <span>{property.images}</span>
                        </button>
                        <button className="bg-gray-100 text-gray-600 p-0.5 lg:p-1 rounded-full">
                          <HiChatBubbleLeftRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                      
                      <h3 className="text-lg lg:text-xl font-bold text-black mb-1.5 lg:mb-2">
                        {property.name}
                      </h3>
                      <p className="text-gray-500 text-xs lg:text-sm mb-3 lg:mb-4 line-clamp-2">
                        {property.location}
                      </p>
                      
                        <div className="flex items-center space-x-2 lg:space-x-4 mb-4 lg:mb-6">
                          <div className="flex items-center space-x-0.5 lg:space-x-1">
                            <HiOutlineHome className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500" />
                            <span className="text-xs lg:text-sm text-gray-700">{property.bedrooms} Bed</span>
                          </div>
                          <div className="flex items-center space-x-0.5 lg:space-x-1">
                            <HiOutlineAcademicCap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500" />
                            <span className="text-xs lg:text-sm text-gray-700">{property.bathrooms} Bath</span>
                          </div>
                          <div className="flex items-center space-x-0.5 lg:space-x-1">
                            <HiOutlineSquare3Stack3D className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500" />
                            <span className="text-xs lg:text-sm text-gray-700">{property.size}</span>
                          </div>
                        </div>
                      
                      {/* Distance Section */}
                      <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-1.5 lg:space-x-2">
                          <HiOutlineMapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500" />
                          <span className="text-xs lg:text-sm text-gray-600">Distance</span>
                        </div>
                        <div className="flex items-center space-x-0.5 lg:space-x-1">
                          <HiChevronRight className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-gray-500" />  
                          <span className="text-xs lg:text-sm font-semibold text-black">
                            {property.distance} KM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          )}
        </div>
      </main>

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Features Popup */}
      <FeaturesPopup 
        isOpen={showFeaturesPopup} 
        onClose={() => {
          setShowFeaturesPopup(false);
          setActiveTab('home'); // Reset to home when closing
        }} 
      />

      {/* Contacts Popup */}
      <ContactsPopup 
        isOpen={showContactsPopup} 
        onClose={() => {
          setShowContactsPopup(false);
          setActiveTab('home'); // Reset to home when closing
        }} 
      />
    </div>
  );
}

export default Landing;