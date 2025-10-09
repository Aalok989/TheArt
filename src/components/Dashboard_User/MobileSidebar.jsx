import React, { useState } from 'react';
import { HiX, HiPhone, HiLogout, HiMenu, HiChevronLeft, HiChevronDown, HiChevronRight } from 'react-icons/hi';
import flatDetailsIcon from '../../assets/flat details.png';
import currentDuesIcon from '../../assets/current dues.png';
import paymentIcon from '../../assets/payment.png';
import documentsIcon from '../../assets/documents.png';
import userImageBig from '../../assets/user Image big.png';

const MobileSidebar = ({ isOpen, onClose, activePage, setActivePage, onLogout, onCustomerCareOpen, userRole = 'user' }) => {
  // Initialize with overview expanded for admin users
  const [expandedItems, setExpandedItems] = useState(() => {
    return userRole === 'admin' ? { overview: true } : {};
  });

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  // Role-based menu items
  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        {
          id: 'overview',
          label: 'Overview',
          icon: flatDetailsIcon,
          isActive: activePage === 'overview',
          hasSubItems: true,
          subItems: [
            {
              id: 'flatStatus',
              label: 'Flat Status',
              isActive: activePage === 'flatStatus'
            },
            {
              id: 'report',
              label: 'Report',
              isActive: activePage === 'report'
            }
          ]
        },
        {
          id: 'banking',
          label: 'Banking',
          icon: currentDuesIcon,
          isActive: activePage === 'banking'
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: paymentIcon,
          isActive: activePage === 'projects'
        },
        {
          id: 'docadmin',
          label: 'Documents',
          icon: documentsIcon,
          isActive: activePage === 'docadmin'
        }
      ];
    } else {
      return [
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
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (pageId) => {
    // Toggle behavior: if clicking the same page that's already active, deselect it (user role only)
    if (activePage === pageId && userRole === 'user') {
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
        onClick={onClose}
      ></div>
      
      {/* Sidebar - Different widths for mobile vs tablet */}
      <div className="fixed top-0 left-0 h-full bg-white shadow-lg z-50 lg:hidden animate-slide-in-left w-[18rem] md:w-[24rem]">
        {/* Close Button - On Sidebar Edge (Square) */}
        <button 
          onClick={onClose}
          className="absolute flex items-center justify-center bg-white shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
          style={{ top: 'clamp(0.75rem, 1rem, 1.25rem)', right: 'clamp(-1.125rem, -1.25rem, -1.5rem)', width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)', borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}
        >
          <HiChevronLeft style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }} className="text-gray-600" />
        </button>

        {/* User Profile Section */}
        <div className="border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            <div className="bg-gray-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm" style={{ width: 'clamp(3rem, 4rem, 4.5rem)', height: 'clamp(3rem, 4rem, 4.5rem)' }}>
              <img 
                src={userImageBig} 
                alt="Aman Bhutani"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.25rem)' }}>
                <span className="text-gray-600">Hi, </span>
                <span className="text-[#690A7D] font-bold">Aman</span>
              </h2>
              <p className="text-[#FF6B9D] font-semibold" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Flat No. :- A-209</p>
            </div>
          </div>
        </div>

        {/* Main Menu Section */}
        <div style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h3 className="font-bold text-gray-500 uppercase tracking-wide" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>MAIN MENU</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            {menuItems.map((item) => (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    if (item.hasSubItems) {
                      toggleExpanded(item.id);
                    } else {
                      handleMenuClick(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-lg transition-colors ${
                    item.isActive 
                      ? 'bg-[#690A7D] text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingTop: 'clamp(0.625rem, 0.75rem, 0.875rem)', paddingBottom: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
                >
                  <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className={item.isActive ? 'invert' : ''}
                      style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }}
                    />
                    <span className="font-medium" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>{item.label}</span>
                  </div>
                  {item.hasSubItems && (
                    expandedItems[item.id] 
                      ? <HiChevronDown style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                      : <HiChevronRight style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                  )}
                </button>

                {/* Sub Items */}
                {item.hasSubItems && expandedItems[item.id] && (
                  <div className="mt-1 ml-8" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.25rem, 0.375rem, 0.5rem)' }}>
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleMenuClick(subItem.id)}
                        className={`w-full flex items-center rounded-lg transition-colors ${
                          subItem.isActive 
                            ? 'bg-[#690A7D] text-white' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingTop: 'clamp(0.5rem, 0.625rem, 0.75rem)', paddingBottom: 'clamp(0.5rem, 0.625rem, 0.75rem)' }}
                      >
                        <span className="font-medium" style={{ fontSize: 'clamp(0.8125rem, 0.9375rem, 1.0625rem)' }}>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact and Logout Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            <button 
              onClick={handleContactUsClick}
              className="w-full flex items-center text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingTop: 'clamp(0.625rem, 0.75rem, 0.875rem)', paddingBottom: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
            >
              <HiPhone style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
              <span className="font-medium" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Contact Us</span>
            </button>
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingTop: 'clamp(0.625rem, 0.75rem, 0.875rem)', paddingBottom: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
            >
              <HiLogout style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
              <span className="font-medium" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Logout</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default MobileSidebar;
