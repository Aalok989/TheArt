import React from 'react';
import Navbar from './Dashboard_Admin/Navbar';
import UserProfile from './Dashboard_Admin/UserProfile';
import FlatDetails from './Dashboard_Admin/FlatDetails.jsx';
import PaymentSchedule from './Dashboard_Admin/Payment.jsx';
import Updates from './Dashboard_Admin/Updates';
import ChatBot from './Dashboard_Admin/ChatBot';
import Documents from './Dashboard_Admin/Documents';
import CurrentDues from './Dashboard_Admin/CurrentDues';
import DetailedInformation from './Dashboard_Admin/DetailedInformation';
import MobileSidebar from './Dashboard_Admin/MobileSidebar';
import CustomerCarePopup from './Dashboard_Admin/CustomerCarePopup';

const Dashboard = ({ 
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
  animationKey 
}) => {
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
      <Navbar 
        activePage={activePage} 
        setActivePage={onPageChange} 
        onLogout={onLogout}
        onSidebarToggle={onSidebarToggle}
        onUpdatesToggle={onUpdatesToggle}
        isSidebarOpen={isSidebarOpen}
        isUpdatesOpen={isUpdatesOpen}
      />

      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => onSidebarToggle()}
        activePage={activePage}
        setActivePage={onPageChange}
        onLogout={onLogout}
        onCustomerCareOpen={() => {}} // Will be handled by parent
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
        onClose={onCustomerCareClose}
      />
    </div>
  );
};

export default Dashboard;
