import React, { useState } from "react";
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
  HiOutlineMapPin
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

function Landing({ onLogin }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'builder'
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);
  const [showContactsPopup, setShowContactsPopup] = useState(false);

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
    console.log(`Clicked on ${tab}`);
  };

  const handleExploreClick = () => {
    setShowExploreMenu(!showExploreMenu);
    console.log('Explore menu toggled');
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleUserClick = () => {
    console.log('User profile clicked - showing login popup');
    setShowLoginPopup(true);
  };

  // Toggle user role for demonstration (you can remove this later)
  const toggleUserRole = () => {
    setUserRole(userRole === 'user' ? 'builder' : 'user');
  };

  // Handle successful login
  const handleLoginSuccess = (token) => {
    console.log('User logged in successfully with token:', token);
    // Call the same onLogin function that the Login page uses
    if (onLogin) {
      onLogin(token);
    }
  };


  return (
    <div className="h-screen bg-white flex flex-col font-outfit">
      {/* Header */}
      <header className="bg-white max-h-20 relative">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/src/assets/proprite.png"
              alt="Proprite Logo"
              className="w-48 h-24 max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
           <div className="flex items-center space-x-4">
             <button 
               onClick={toggleUserRole}
               className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
             >
               {userRole === 'user' ? 'Switch to Builder' : 'Switch to User'}
             </button>
             <button 
               onClick={handleNotificationClick}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <HiBell className="w-6 h-6 text-black" />
             </button>
             <button 
               onClick={handleUserClick}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             >
               <HiUser className="w-6 h-6 text-black" />
             </button>
           </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 relative px-8 pt-8 pb-8 overflow-hidden">
        {/* Background Image Container with Rounded Corners */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-no-repeat"
            style={{ 
              backgroundImage: "url(/src/assets/bg.jpg)",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center"
            }}
          />

          {/* User Dashboard Cards - Only show on home tab and when popups are closed */}
          {activeTab === 'home' && !showLoginPopup && !showFeaturesPopup && !showContactsPopup && (
            <div className="absolute left-4 md:left-8 bottom-8 space-y-2 z-10 max-w-xs md:max-w-none overflow-y-auto max-h-[80vh]">
              {userRole === 'user' ? (
                /* Take a Tour Card for Regular Users */
                <div className="bg-gray-100/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-60 md:w-80">
                   {/* Take a Tour Section */}
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-gray-800 text-4xl font-medium font-poly">Take a Tour</span>
                     <img src="/src/assets/Larrow.png" alt="Arrow" className="w-16 h-16" />
                   </div>
                  
                   {/* Dashed Separator */}
                   <div className="border-t-2 border-dashed border-gray-300 mb-6"></div>
                   
                   {/* Book a Demo Button - Right aligned */}
                   <div className="flex justify-end">
                     <button 
                       onClick={() => setShowContactsPopup(true)}
                       className="py-3 px-4 rounded-full text-white font-semibold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins w-40" 
                       style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}
                     >
                       Book a Demo
                     </button>
                   </div>
                </div>
              ) : (
                /* Builder Dashboard Card */
                <div className="space-y-2 w-80 md:w-96">
                  {/* Management Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 text-white px-4 py-3 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105" style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">Manage Staff</span>
                    </button>
                    <button className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-3 rounded-full flex items-center justify-center space-x-2 transition-colors">
                      <HiHome className="w-4 h-4" />
                      <span className="text-sm font-medium">Manage Properties</span>
                    </button>
                  </div>

                  {/* View Reports Section */}
                  <div className="bg-gray-100/90 backdrop-blur-sm rounded-2xl shadow-lg pt-8 px-8 pb-4 relative">
                    {/* Plus Icon */}
                    <button className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center transition-colors">
                      <HiPlus className="w-10 h-10 text-gray-700" />
                    </button>
                    
                    <h2 className="text-gray-800 mb-3 font-Poly font-regular" style={{fontSize: '36px', lineHeight: '1.1'}}>
                      View<br />Reports
                    </h2>
                    <p className="text-gray-600 text-base mb-2" style={{fontSize: '14px'}}>Manage your property business</p>
                    
                    {/* Dashed Separator */}
                    <div className="border-t-2 border-dashed border-gray-300 mb-4"></div>
                    
                    {/* Go to Dashboard Button */}
                    <div className="flex justify-center">
                      <button className="py-3 px-6 rounded-full text-white font-semibold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-poppins w-96" style={{background: 'linear-gradient(180deg, #FC7117, #96430E)'}}>
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Property Cards Cube Swiper - Only show on home tab and when popups are closed */}
          {activeTab === 'home' && !showLoginPopup && !showFeaturesPopup && !showContactsPopup && (
            <div className="absolute right-16 md:right-20 bottom-8 z-10 w-72 md:w-80">
            {/* Custom Navigation Arrows - Outside Card But Inside Background */}
            <button className="swiper-button-next-custom absolute -left-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl">
              <HiChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-button-prev-custom absolute -right-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl">
              <HiChevronRight className="w-5 h-5" />
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
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full">
                    {/* Property Image Section */}
                    <div className="relative h-44">
                      <div 
                        className="h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${property.imageSrc})` }}
                      />
                      {/* Nearby Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 text-black px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                          <HiHome className="w-3 h-3" />
                          <span className="text-xs font-medium">Nearby</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Details Section */}
                    <div className="p-5 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                          <HiCamera className="w-3 h-3" />
                          <span>{property.images}</span>
                        </button>
                        <button className="bg-gray-100 text-gray-600 p-1 rounded-full">
                          <HiChatBubbleLeftRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h3 className="text-xl font-bold text-black mb-2">
                        {property.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {property.location}
                      </p>
                      
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="flex items-center space-x-1">
                            <HiOutlineHome className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{property.bedrooms} Bed</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiOutlineAcademicCap className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{property.bathrooms} Bath</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HiOutlineSquare3Stack3D className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{property.size}</span>
                          </div>
                        </div>
                      
                      {/* Distance Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <HiOutlineMapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Distance</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiChevronRight className="w-3 h-3 text-gray-500" />  
                          <span className="text-sm font-semibold text-black">
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