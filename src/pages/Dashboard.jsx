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
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/property-swiper.css';

function Dashboard({ onNavigateToLogin }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('buy');
  const [showBuyOptions, setShowBuyOptions] = useState(false);

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
    console.log('User profile clicked - navigating to login');
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  const handlePropertyTypeClick = (type) => {
    setSelectedPropertyType(type);
    console.log(`Property type changed to: ${type}`);
  };

  const handleBuyVillaClick = () => {
    setShowBuyOptions(!showBuyOptions);
    console.log('Buy Villa dropdown toggled');
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
              className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                activeTab === 'home' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <HiHome className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={handleExploreClick}
              className="text-black flex items-center space-x-1 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors relative"
            >
              <span>Explore</span>
              <HiChevronDown className={`w-4 h-4 transition-transform duration-150 ease-out ${showExploreMenu ? 'rotate-180' : ''}`} />
              <div className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50 transition-all duration-150 ease-out transform ${
                showExploreMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">Projects</div>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">Locations</div>
                <div className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">Agents</div>
              </div>
            </button>
            {/* Grouped Navigation Links */}
            <div className="bg-white border border-gray-200 rounded-full px-6 py-3 flex items-center space-x-8 shadow-sm">
              <button 
                onClick={() => handleTabClick('features')}
                className={`transition-colors ${
                  activeTab === 'features' ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => handleTabClick('mission')}
                className={`transition-colors ${
                  activeTab === 'mission' ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
                }`}
              >
                Our Mission
              </button>
              <button 
                onClick={() => handleTabClick('contacts')}
                className={`transition-colors ${
                  activeTab === 'contacts' ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'
                }`}
              >
                Contacts
              </button>
            </div>
          </nav>

           {/* Right Icons */}
           <div className="flex items-center space-x-4">
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

          {/* Left Cards */}
          <div className="absolute left-4 md:left-8 bottom-8 space-y-2 z-10 max-w-xs md:max-w-none overflow-y-auto max-h-[80vh]">
            {/* First Card - Find Your Dream Property Based On Time */}
            <div className="bg-gray-700/60 text-white p-3 rounded-full backdrop-blur-sm w-full max-w-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-500 p-1 rounded">
                    <HiCalendar className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm">Find Your Dream Property Based On Time</span>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  28 - 31 August 2024
                </div>
              </div>
            </div>

            {/* Second Card - Property Search */}
            <div className="bg-gray-700/60 text-white p-4 rounded-full backdrop-blur-sm w-full max-w-md">
              <div className="flex space-x-2 items-center">
                <button 
                  onClick={handleBuyVillaClick}
                  className={`px-3 py-2 rounded-full flex-1 flex items-center justify-center space-x-1 text-sm transition-colors relative ${
                    showBuyOptions 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <HiHome className="w-4 h-4" />
                  <span>Buy Villa</span>
                  <HiChevronRight className={`w-3 h-3 transition-transform duration-150 ease-out ${showBuyOptions ? 'rotate-90' : ''}`} />
                </button>
                <button 
                  onClick={() => handlePropertyTypeClick('rent')}
                  className="bg-white/20 text-white px-3 py-2 rounded-full flex-1 flex items-center justify-center space-x-1 text-sm hover:bg-white/30 transition-colors"
                >
                  <HiHome className="w-4 h-4" />
                  <span>Rent Villa</span>
                  <HiChevronRight className="w-3 h-3" />
                </button>
                <button className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Third Card - Find Nearby Luxurious Estates - Only show when Buy Villa dropdown is open */}
            {showBuyOptions && (
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-4xl font-outfit font-ExtraLight 200 text-black leading-tight">
                    <div>Find Nearby</div>
                    <div>Luxurious Estates</div>
                  </h3>
                  <HiPlus className="w-12 h-12 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  Enhances the experience of finding and dealing luxury houses
                </p>

                <div className="flex justify-between mb-4">
                  <button className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1 hover:bg-gray-50 transition-colors">
                    <HiHome className="w-4 h-4 text-gray-500" />
                    <span>3-Bedroom</span>
                  </button>
                  <button className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1 hover:bg-gray-50 transition-colors">
                    <HiHome className="w-4 h-4 text-gray-500" />
                    <span>2-Bathroom</span>
                  </button>
                  <button className="border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1 hover:bg-gray-50 transition-colors">
                    <HiHome className="w-4 h-4 text-gray-500" />
                    <span>Villa</span>
                  </button>
                </div>

                <button className="bg-orange-500 hover:bg-orange-600 text-white w-full py-3 rounded-full font-semibold transition-colors">
                  Search Recent
                </button>
              </div>
            )}
          </div>

          {/* Right Property Cards Cube Swiper */}
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;