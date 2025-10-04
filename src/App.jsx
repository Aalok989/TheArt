import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import FlatDetails from './components/FlatDetails.jsx';
import PaymentSchedule from './components/Payment.jsx';
import Updates from './components/Updates';
import ChatBot from './components/ChatBot';
import Login from './pages/Login';
import Documents from './components/Documents';
import CurrentDues from './components/CurrentDues';
import DetailedInformation from './components/DetailedInformation';
import MobileSidebar from './components/MobileSidebar';
import CustomerCarePopup from './components/CustomerCarePopup';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showLogin, setShowLogin] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCustomerCarePopupOpen, setIsCustomerCarePopupOpen] = useState(false);

  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const pixelRatio = window.devicePixelRatio || 1;
      const adjustedWidth = window.innerWidth * pixelRatio;
      const isMobile = adjustedWidth < 1024;
      return isMobile ? null : 'flatDetails';
    }
    return null;
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const adjustedWidth = window.innerWidth * pixelRatio;
      const mobile = adjustedWidth < 1024;
      console.log('Pixel Ratio:', pixelRatio, 'Window Width:', window.innerWidth, 'Adjusted Width:', adjustedWidth, 'Is Mobile:', mobile);
      setIsMobile(mobile);
      setActivePage(prevActivePage => mobile ? null : (prevActivePage || 'flatDetails'));
      document.documentElement.style.setProperty('--device-pixel-ratio', pixelRatio);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLogin(false);
    const pixelRatio = window.devicePixelRatio || 1;
    const adjustedWidth = window.innerWidth * pixelRatio;
    const isMobile = adjustedWidth < 1024;
    setActivePage(isMobile ? null : 'flatDetails');
  };

  const handleNavigateToLogin = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handlePageChange = (page) => {
    if (page !== activePage) {
      setIsAnimating(true);
      setTimeout(() => {
        setActivePage(page);
        setAnimationKey(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    setActivePage('flatDetails');
    setIsSidebarOpen(false);
    setIsUpdatesOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsUpdatesOpen(false);
  };

  const handleUpdatesToggle = () => {
    setIsUpdatesOpen(!isUpdatesOpen);
    setIsSidebarOpen(false);
  };

  const handleCustomerCareOpen = () => {
    setIsCustomerCarePopupOpen(true);
  };

  const renderMiddlePanel = () => {
    if (!activePage) {
      return null;
    }

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

  // Show Dashboard by default, then show full login page if showLogin is true
  if (!isLoggedIn && !showLogin) {
    return (
      <Dashboard onNavigateToLogin={handleNavigateToLogin} />
    );
  }

  // Show complete login page when showLogin is true
  if (showLogin) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main authenticated app
  return (
    <div className="min-h-screen overflow-auto bg-[#E8F3EB] relative">
      <Navbar 
        activePage={activePage} 
        setActivePage={handlePageChange} 
        onLogout={handleLogout}
        onSidebarToggle={handleSidebarToggle}
        onUpdatesToggle={handleUpdatesToggle}
        isSidebarOpen={isSidebarOpen}
        isUpdatesOpen={isUpdatesOpen}
      />

      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        setActivePage={handlePageChange}
        onLogout={handleLogout}
        onCustomerCareOpen={handleCustomerCareOpen}
      />

      <div className="overflow-hidden h-screen pt-[7.25rem] pb-[2.3125rem] px-11">
        <div className="lg:hidden h-full flex flex-col space-y-3 relative">
          {!activePage && (
            <div className="flex-shrink-0 h-[calc(30vh-2.1875rem)]">
              <UserProfile />
            </div>
          )}
          {!activePage && (
            <div className="flex-1 min-h-0">
              <DetailedInformation />
            </div>
          )}
          {activePage && (
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0 overflow-hidden">
              {renderMiddlePanel()}
            </div>
          )}
          {isUpdatesOpen && (
            <>
              <div 
                className="fixed bg-black bg-opacity-50 z-40 lg:hidden top-[-1vh] left-[-1vw] right-[-1vw] bottom-[-1vh] w-[102vw] h-[102vh]"
                onClick={() => setIsUpdatesOpen(false)}
              ></div>
              <div className="fixed left-4 right-4 bottom-4 top-20 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-in-up lg:hidden">
                <div className="p-4">
                  <div className="flex items-center justify-end mb-4">
                    <button 
                      onClick={() => setIsUpdatesOpen(false)}
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
        </div>
      </div>

      <ChatBot />
      <CustomerCarePopup 
        isOpen={isCustomerCarePopupOpen} 
        onClose={() => setIsCustomerCarePopupOpen(false)}
      />
    </div>
  );
}

export default App;