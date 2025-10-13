import React, { useState, useEffect } from "react";
import {
  HiBell,
  HiPhone,
  HiUser,
  HiLogout,
  HiCog,
  HiDocumentText,
  HiMenu,
  HiUserAdd,
  HiUserGroup,
  HiClipboardList,
  HiBriefcase,
} from "react-icons/hi";
import { customerAPI } from "../api/api";
import UserProfile from "./Dashboard_User/UserProfile";
import FlatDetails from "./Dashboard_User/FlatDetails.jsx";
import PaymentSchedule from "./Dashboard_User/Payment.jsx";
import Updates from "./Dashboard_User/Updates";
import ChatBot from "./ChatBot";
import Documents from "./Dashboard_User/Documents";
import CurrentDues from "./Dashboard_User/CurrentDues";
import DetailedInformation from "./Dashboard_User/DetailedInformation";
import MobileSidebar from "./Dashboard_User/MobileSidebar";
import CustomerCarePopup from "./Dashboard_User/CustomerCarePopup";
import PasswordChangePopup from "./Dashboard_User/PasswordChangePopup";
import ConstructionUpdatesPopup from "./Dashboard_User/ConstructionUpdatesPopup";
import MyDocumentsPopup from "./Dashboard_User/MyDocumentsPopup";
import FlatStatus from "./Dashboard_Admin/FlatStatus";
import Report from "./Dashboard_Admin/Report";
import LoanDetails from "./Dashboard_Admin/LoanDetails";
import LoanDocument from "./Dashboard_Admin/LoanDocument";
import UploadLoanDoc from "./Dashboard_Admin/UploadLoanDoc";
import AdminDocuments from "./Dashboard_Admin/docadmin.jsx";
import Flat from "./Dashboard_Admin/Flat";
import Projects from "./Dashboard_Admin/Projects";
import Proprite from "../assets/proprite.png";
import Hamburger from "../assets/Hamburger.png";
import flatDetailsIcon from "../assets/flat details.png";
import currentDuesIcon from "../assets/current dues.png";
import paymentIcon from "../assets/payment.png";
import documentsIcon from "../assets/documents.png";

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
  userRole = "user", // Default to 'user' role
}) => {
  // Navbar state
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isUpdatesPopupOpen, setIsUpdatesPopupOpen] = useState(false);
  const [isMyDocumentsPopupOpen, setIsMyDocumentsPopupOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  
  // Admin Quick Tools state
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);

  // Fetch notification count and profile image (only for customer users)
  useEffect(() => {
    if (userRole === 'user') {
      const fetchUserData = async () => {
        try {
          // Fetch notifications
          const notificationsResponse = await customerAPI.getNotifications();
          if (Array.isArray(notificationsResponse)) {
            setNotificationCount(notificationsResponse.length);
          }

          // Fetch profile for profile image
          const profileResponse = await customerAPI.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setProfileImage(profileResponse.data.profileImage);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userRole]);

  // Role-based navigation configuration
  const getNavigationItems = () => {
    if (userRole === "admin") {
      return [
        {
          key: "overview",
          label: "Overview",
          icon: flatDetailsIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
        },
        {
          key: "banking",
          label: "Banking",
          icon: currentDuesIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
        },
        {
          key: "projects",
          label: "Projects",
          icon: paymentIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
        },
        {
          key: "docadmin",
          label: "Documents",
          icon: documentsIcon,
          width: "clamp(8.75rem, 10.9375rem, 12.5rem)",
        },
      ];
    } else {
      return [
        {
          key: "flatDetails",
          label: "Flat Details",
          icon: flatDetailsIcon,
          width: "clamp(8.5rem, 10.625rem, 12rem)",
        },
        {
          key: "currentDues",
          label: "Current Dues",
          icon: currentDuesIcon,
          width: "clamp(9.5rem, 12rem, 14rem)",
        },
        {
          key: "payment",
          label: "Payments",
          icon: paymentIcon,
          width: "clamp(8.5rem, 10.625rem, 12rem)",
        },
        {
          key: "documents",
          label: "Documents",
          icon: documentsIcon,
          width: "clamp(8.75rem, 10.9375rem, 12.5rem)",
        },
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

  // Quick Tools handlers
  const handleQuickToolsToggle = () => {
    setIsQuickToolsOpen(!isQuickToolsOpen);
  };

  const handleQuickToolClick = (tool) => {
    console.log(`Quick tool clicked: ${tool}`);
    // Here you can add navigation or popup logic for each tool
    setIsQuickToolsOpen(false);
  };
  const renderMiddlePanel = () => {
    if (!activePage) {
      return null;
    }

    // Admin components
    if (userRole === "admin") {
      switch (activePage) {
        case "overview":
          return (
            <div
              className={`page-container h-full ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              {/* Desktop: Show both FlatStatus and Report side by side */}
              <div className="hidden lg:flex h-full" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
                <div className="basis-[60%] min-w-0 bg-white shadow-sm border border-gray-200" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', maxHeight: '100%', overflow: 'hidden' }}>
                  <FlatStatus key={`flatStatus-${animationKey}`} onPageChange={onPageChange} />
                </div>
                <div className="basis-[40%] min-w-0 bg-white shadow-sm border border-gray-200" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', maxHeight: '100%', overflow: 'hidden' }}>
                  <Report key={`report-${animationKey}`} />
                </div>
              </div>
              {/* Mobile/Tablet: Show message to select sub-item */}
              <div className="lg:hidden h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <p className="text-lg font-medium mb-2">Overview</p>
                  <p className="text-sm">Please select Flat Status or Report from the sidebar</p>
                </div>
              </div>
            </div>
          );
        case "flatStatus":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <FlatStatus key={`flatStatus-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "flat":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <Flat key={`flat-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "projects":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <Projects key={`projects-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "report":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <Report key={`report-${animationKey}`} />
              </div>
            </div>
          );
        case "banking":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <LoanDetails
                  key={`loanDetails-${animationKey}`}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          );
        case "loanDocuments":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <LoanDocument
                  key={`loanDocument-${animationKey}`}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          );
        case "uploadLoanDoc":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <UploadLoanDoc
                  key={`uploadLoanDoc-${animationKey}`}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
          );
        case "docadmin":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <AdminDocuments
                  key={`docadmin-${animationKey}`}
                />
              </div>
            </div>
          );
        case "documents":
          return <Documents key={`documents-${animationKey}`} />;
        default:
          return null;
      }
    }

    // User components
    const Component = (() => {
      switch (activePage) {
        case "flatDetails":
          return <FlatDetails key={`flatDetails-${animationKey}`} />;
        case "currentDues":
          return <CurrentDues key={`currentDues-${animationKey}`} />;
        case "payment":
          return <PaymentSchedule key={`payment-${animationKey}`} />;
        case "documents":
          return <Documents key={`documents-${animationKey}`} />;
        default:
          return null;
      }
    })();

    return (
      <div
        className={`page-container h-full flex flex-col ${
          isAnimating ? "opacity-50" : ""
        }`}
      >
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
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Integrated Navbar - Hidden on Mobile/Tablet */}
      <nav
        className="relative hidden lg:block"
        style={{
          height: "clamp(5rem, 7.25rem, 8rem)",
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "40",
          paddingLeft: "clamp(1.5rem, 2.75rem, 3.5rem)",
          paddingRight: "clamp(1.5rem, 3.125rem, 4rem)",
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
                  ? "bg-white shadow-md scale-105 opacity-0 pointer-events-none"
                  : "hover:bg-white/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-1 w-[1.25rem] h-[1.25rem]">
                <span
                  className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "rotate-45 translate-y-1.5"
                      : "rotate-0 translate-y-0"
                  }`}
                ></span>
                <span
                  className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "opacity-0 scale-0"
                      : "opacity-100 scale-100"
                  }`}
                ></span>
                <span
                  className={`block w-[1.25rem] h-[0.03125rem] bg-gray-600 transition-all duration-300 ease-in-out ${
                    isSidebarOpen
                      ? "-rotate-45 -translate-y-1.5"
                      : "rotate-0 translate-y-0"
                  }`}
                ></span>
              </div>
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src={Proprite}
                alt="The Art"
                style={{
                  height: "clamp(2.5rem, 3.5rem, 4rem)",
                  width: "auto",
                  filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 1))",
                }}
              />
            </div>
          </div>

          {/* Center Section - Navigation Tabs */}
          <div
            className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2"
            style={{
              gap: "clamp(0.375rem, 0.625rem, 0.875rem)",
              minWidth: "20rem",
            }}
          >
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm btn-animate hover-lift rounded-full ${
                  activePage === item.key
                    ? "text-white font-medium transform scale-105"
                    : "text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg"
                }`}
                style={{
                  width: item.width,
                  height: "clamp(2.25rem, 2.8125rem, 3.25rem)",
                  fontSize: "clamp(0.75rem, 0.875rem, 1rem)",
                  background:
                    activePage === item.key
                      ? "linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)"
                      : undefined,
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="flex-shrink-0"
                  style={{
                    width: "clamp(1rem, 1.25rem, 1.5rem)",
                    height: "clamp(1rem, 1.25rem, 1.5rem)",
                    marginRight: "clamp(0.375rem, 0.5625rem, 0.75rem)",
                    filter: activePage === item.key ? "invert(1)" : "none",
                  }}
                />
                <span className="font-medium font-montserrat" style={{ fontSize: "clamp(0.75rem, 0.875rem, 1rem)" }}>
                  {item.label}
                </span>
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
                className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate relative"
              >
                <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600 transition-transform duration-300 hover:scale-110" />
                {userRole === 'user' && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Updates Toggle Button */}
            <button
              onClick={handleMobileUpdatesToggle}
              className="lg:hidden w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate relative"
            >
              <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600 transition-transform duration-300 hover:scale-110" />
              {userRole === 'user' && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 hover-lift btn-animate overflow-hidden"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                    <HiUser className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-[3rem] w-[12rem] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up">
                  {/* Desktop Only Items */}
                  <div className="lg:hidden">
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <HiCog className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 font-montserrat">
                        Settings
                      </span>
                    </button>
                    <button
                      onClick={handleMobileUpdatesClick}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <HiBell className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 font-montserrat">
                        Updates
                      </span>
                    </button>
                  </div>

                  {/* Common Items */}
                  <button
                    onClick={handleMyDocumentsClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiDocumentText className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-montserrat">
                      My Documents
                    </span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <HiLogout className="w-[1.25rem] h-[1.25rem] text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 font-montserrat">
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Header - Shown only on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm" style={{ height: 'clamp(3.5rem, 4rem, 4.5rem)', paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="h-full flex items-center justify-between">
          {/* Hamburger Menu Button */}
          <button
            onClick={onSidebarToggle}
            className="flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            style={{ width: 'clamp(2.25rem, 2.5rem, 2.75rem)', height: 'clamp(2.25rem, 2.5rem, 2.75rem)' }}
          >
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="block bg-gray-600 transition-all duration-300" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: '2px' }}></span>
              <span className="block bg-gray-600 transition-all duration-300" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: '2px' }}></span>
              <span className="block bg-gray-600 transition-all duration-300" style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: '2px' }}></span>
            </div>
          </button>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src={Proprite}
              alt="The Art"
              style={{
                height: "clamp(2rem, 2.5rem, 3rem)",
                width: "auto",
                filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.1))",
              }}
            />
          </div>

          {/* Profile Icon */}
          <button
            onClick={handleProfileClick}
            className="flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 overflow-hidden border border-gray-200"
            style={{ width: 'clamp(2.25rem, 2.5rem, 2.75rem)', height: 'clamp(2.25rem, 2.5rem, 2.75rem)' }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <HiUser style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
              </div>
            )}
          </button>

          {/* Profile Dropdown - Mobile Version */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up" style={{ marginRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}
              >
                <HiCog style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
                <span className="font-medium text-gray-700 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                  Settings
                </span>
              </button>
              <button
                onClick={handleNotificationsClick}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 relative"
                style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}
              >
                <div className="relative">
                  <HiBell style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
                  {userRole === 'user' && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.5rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </div>
                <span className="font-medium text-gray-700 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                  Updates
                </span>
              </button>
              <button
                onClick={handleMyDocumentsClick}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}
              >
                <HiDocumentText style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
                <span className="font-medium text-gray-700 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                  My Documents
                </span>
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}
              >
                <HiLogout style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
                <span className="font-medium text-gray-700 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => onSidebarToggle()}
        activePage={activePage}
        setActivePage={onPageChange}
        onLogout={onLogout}
        onCustomerCareOpen={() => {}} // Will be handled by parent
        userRole={userRole}
      />

      <div className="overflow-hidden h-screen">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-full flex flex-col relative" style={{ paddingTop: 'clamp(4.5rem, 5rem, 5.5rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)', paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          {/* User Role - Home View (No active page) */}
          {userRole === "user" && (!activePage || activePage === "null") && (
            <>
              <div className="flex-shrink-0" style={{ height: 'clamp(12rem, 30vh, 18rem)' }}>
                <UserProfile />
              </div>
              <div className="flex-1 min-h-0">
                <DetailedInformation />
              </div>
            </>
          )}
          
          {/* Active Page View (User navigates to a specific page or Admin) */}
          {((activePage && activePage !== "null") || userRole === "admin") && (
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

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-full items-center justify-center relative" style={{ paddingTop: 'clamp(5rem, 7.25rem, 8rem)', paddingBottom: 'clamp(1.5rem, 2.3125rem, 3rem)', paddingLeft: 'clamp(1.5rem, 2.75rem, 3.5rem)', paddingRight: 'clamp(1.5rem, 2.75rem, 3.5rem)' }}>
          {userRole === "admin" ? (
            // Admin layout - only middle section with two components
            <>
              <div className="flex w-full max-w-[120rem] mx-auto" style={{ gap: 'clamp(0.625rem, 0.9375rem, 1.25rem)' }}>
                <div className="flex flex-col w-full" style={{ height: 'clamp(35rem, 49.8125rem, 55rem)', maxHeight: 'calc(100vh - 10rem)' }}>
                  {renderMiddlePanel()}
                </div>
              </div>
              
              {/* Admin Quick Tools Hamburger Button - Bottom Left */}
              <div className="fixed left-8 bottom-8 z-50">
                <button
                  onClick={handleQuickToolsToggle}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  title="Quick Tools"
                >
                  {/* Hamburger to Cross Animation */}
                  <div className="relative w-6 h-6 flex flex-col items-center justify-center">
                    <span className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isQuickToolsOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                    <span className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isQuickToolsOpen ? 'opacity-0 scale-0' : 'opacity-100'}`}></span>
                    <span className={`absolute w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${isQuickToolsOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
                  </div>
                </button>

                {/* Quick Tools Tiles */}
                {isQuickToolsOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsQuickToolsOpen(false)}
                    />
                    
                    {/* Tiles Grid with Scale Animation */}
                    <div className="absolute bottom-16 left-0 flex flex-col gap-2 z-50 origin-bottom-left animate-scale-in">
                      {/* New Bookings Tile */}
                      <button
                        onClick={() => handleQuickToolClick('new-bookings')}
                        className="bg-gray-100 rounded-lg shadow-xl border border-gray-300 px-4 py-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap group"
                        style={{
                          background: 'rgb(243, 244, 246)',
                          borderColor: 'rgb(209, 213, 219)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)';
                          e.currentTarget.style.borderColor = '#FC7117';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgb(243, 244, 246)';
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-700 font-montserrat group-hover:text-white transition-colors duration-300">New Bookings</span>
                      </button>

                      {/* New Customer Tile */}
                      <button
                        onClick={() => handleQuickToolClick('new-customer')}
                        className="bg-gray-100 rounded-lg shadow-xl border border-gray-300 px-4 py-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap group"
                        style={{
                          background: 'rgb(243, 244, 246)',
                          borderColor: 'rgb(209, 213, 219)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)';
                          e.currentTarget.style.borderColor = '#FC7117';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgb(243, 244, 246)';
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-700 font-montserrat group-hover:text-white transition-colors duration-300">New Customer</span>
                      </button>

                      {/* New Staff Tile */}
                      <button
                        onClick={() => handleQuickToolClick('new-staff')}
                        className="bg-gray-100 rounded-lg shadow-xl border border-gray-300 px-4 py-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap group"
                        style={{
                          background: 'rgb(243, 244, 246)',
                          borderColor: 'rgb(209, 213, 219)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)';
                          e.currentTarget.style.borderColor = '#FC7117';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgb(243, 244, 246)';
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-700 font-montserrat group-hover:text-white transition-colors duration-300">New Staff</span>
                      </button>

                      {/* New Projects Tile */}
                      <button
                        onClick={() => handleQuickToolClick('new-projects')}
                        className="bg-gray-100 rounded-lg shadow-xl border border-gray-300 px-4 py-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap group"
                        style={{
                          background: 'rgb(243, 244, 246)',
                          borderColor: 'rgb(209, 213, 219)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)';
                          e.currentTarget.style.borderColor = '#FC7117';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgb(243, 244, 246)';
                          e.currentTarget.style.borderColor = 'rgb(209, 213, 219)';
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-700 font-montserrat group-hover:text-white transition-colors duration-300">New Projects</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            // User layout - three sections with responsive sizing
            <div className="flex w-full mx-auto" style={{ gap: 'clamp(0.5rem, 0.9375rem, 1.25rem)', maxWidth: 'min(120rem, 100%)' }}>
              {/* Left Panel - User Profile & Detailed Info */}
              <div className="flex flex-col flex-shrink-0" style={{ width: 'clamp(18rem, 24%, 30rem)', gap: 'clamp(0.625rem, 0.9375rem, 1.25rem)', maxHeight: 'calc(100vh - 10rem)', minWidth: 0 }}>
                <div style={{ height: 'clamp(12rem, 32.5%, 18rem)', flex: '0 0 auto' }}>
                  <UserProfile />
                </div>
                <div style={{ height: 'clamp(24rem, 65.5%, 36rem)', flex: '1 1 auto', minHeight: 0 }}>
                  <DetailedInformation />
                </div>
              </div>
              
              {/* Middle Panel - Main Content */}
              <div className="flex flex-col flex-1" style={{ minWidth: 0, maxWidth: '100%', height: 'clamp(35rem, 49.8125rem, 55rem)', maxHeight: 'calc(100vh - 10rem)' }}>
                <div className="bg-white shadow-sm border border-gray-200 h-full flex flex-col min-h-0" style={{ borderRadius: 'clamp(1.25rem, 1.75rem, 2rem)' }}>
                  {renderMiddlePanel()}
                </div>
              </div>
              
              {/* Right Panel - Updates */}
              <div className="flex flex-col flex-shrink-0" style={{ width: 'clamp(18rem, 24%, 30rem)', height: 'clamp(35rem, 49.8125rem, 55rem)', maxHeight: 'calc(100vh - 10rem)', minWidth: 0 }}>
                <div className="bg-white shadow-sm border border-gray-200 h-full" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1.25rem, 1.75rem, 2rem)' }}>
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
