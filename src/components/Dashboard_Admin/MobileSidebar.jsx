import React from 'react';
import { HiX, HiPhone, HiLogout, HiMenu, HiChevronLeft } from 'react-icons/hi';
import flatDetailsIcon from '../../assets/flat details.png';
import currentDuesIcon from '../../assets/current dues.png';
import paymentIcon from '../../assets/payment.png';
import documentsIcon from '../../assets/documents.png';
import userImageBig from '../../assets/user Image big.png';

const MobileSidebar = ({ isOpen, onClose, activePage, setActivePage, onLogout, onCustomerCareOpen }) => {
  const menuItems = [
    {
      id: 'flatDetails',
      label: 'Flat Details',
      icon: flatDetailsIcon,
      isActive: activePage === 'flatDetails'
    },
    {
      id: 'currentDues',
      label: 'Current Dues',
      icon: currentDuesIcon,
      isActive: activePage === 'currentDues'
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: paymentIcon,
      isActive: activePage === 'payment'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: documentsIcon,
      isActive: activePage === 'documents'
    }
  ];

  const handleMenuClick = (pageId) => {
    // Toggle behavior: if clicking the same page that's already active, deselect it
    if (activePage === pageId) {
      setActivePage(null); // Go back to showing UserProfile + DetailedInformation
    } else {
      setActivePage(pageId); // Select the new page
    }
    // Close sidebar after a short delay to allow page change to be visible
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const handleContactUsClick = () => {
    onCustomerCareOpen();
    onClose();
  };


  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      ></div>
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 lg:hidden animate-slide-in-left">
        {/* Close Button - On Sidebar Edge */}
        <button 
          onClick={onClose}
          className="absolute top-4 -right-4 flex items-center justify-center bg-white shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          style={{ width: '28px', height: '28px', borderRadius: '8px' }}
        >
          <HiChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* User Profile Section */}
        <div className="p-6 pt-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
              <img 
                src={userImageBig} 
                alt="Aman Bhutani"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                <span className="text-gray-600">Hi, </span>
                <span className="text-[#690A7D] font-bold">Aman</span>
              </h2>
              <p className="text-[#FF6B9D] font-semibold text-sm">Flat No. :- A-209</p>
            </div>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">MAIN MENU</h3>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  item.isActive 
                    ? 'bg-[#690A7D] text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <img 
                  src={item.icon} 
                  alt={item.label}
                  className={`w-5 h-5 ${item.isActive ? 'invert' : ''}`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact and Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="space-y-2">
            <button 
              onClick={handleContactUsClick}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <HiPhone className="w-5 h-5" />
              <span className="font-medium">Contact Us</span>
            </button>
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <HiLogout className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default MobileSidebar;
