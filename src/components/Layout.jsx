import React, { useState, useEffect, useRef, useCallback } from "react";
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
import Megamenu from "./Megamenu";
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
import BookedFlats from "./Dashboard_Admin/BookedFlats";
import BlockedFlats from "./Dashboard_Admin/BlockedFlats";
import CancelledFlats from "./Dashboard_Admin/CancelledFlats";
import LoanedFlats from "./Dashboard_Admin/LoanedFlats";
import FlatVerification from "./Dashboard_Admin/FlatVerification";
import FlatSummary from "./Dashboard_Admin/FlatSummary";
import BlockInventory from "./Dashboard_Admin/BlockInventory";
import UserLogs from "./Dashboard_Admin/UserLogs.jsx";
import LoanDocument from "./Dashboard_Admin/LoanDocument";
import UploadLoanDoc from "./Dashboard_Admin/UploadLoanDoc";
import CompletePayment from "./Dashboard_Admin/CompletePayment";
import BalancePayment from "./Dashboard_Admin/BalancePayment";
import NoPayment from "./Dashboard_Admin/NoPayment";
import NoDiscount from "./Dashboard_Admin/NoDiscount";
import ExtraDiscount from "./Dashboard_Admin/ExtraDiscount";
import ExtraPayment from "./Dashboard_Admin/ExtraPayment";
import BBASigned from "./Dashboard_Admin/BBASigned";
import UnsignedBBA from "./Dashboard_Admin/UnsignedBBA";
import Cheque from "./Dashboard_Admin/Cheque";
import Cash from "./Dashboard_Admin/Cash";
import NEFT from "./Dashboard_Admin/NEFT";
import ManageBank from "./Dashboard_Admin/ManageBank";
import ManageUser from "./Dashboard_Admin/ManageUser";
import ManageCommission from "./Dashboard_Admin/ManageCommission";
import ConstructionStages from "./Dashboard_Admin/ConstructionStages";
import Flat from "./Dashboard_Admin/Flat";
import Projects from "./Dashboard_Admin/Projects";
import AddPartner from "./Dashboard_Admin/AddPartner";
import ViewAll from "./Dashboard_Admin/ViewAll";
import FlatDetail_CP from "./Dashboard_Admin/FlatDetail_CP";
import CP_Detail from "./Dashboard_Admin/CP_Detail";
import ReleaseCommission from "./Dashboard_Admin/ReleaseCommission";
import PaidCommission from "./Dashboard_Admin/PaidCommission";
import ViewCoupons from "./Dashboard_Admin/ViewCoupons";
import InstallmentReport from "./Dashboard_Admin/InstallmentReport";
import CLPReport from "./Dashboard_Admin/CLPReport";
import FinalReport from "./Dashboard_Admin/FinalReport";
import TodayReport from "./Dashboard_Admin/TodayReport";
import DatewiseReport from "./Dashboard_Admin/DatewiseReport";
import Dashboard from "./Dashboard_Admin/Dashboard";
import CommonDocs from "./Dashboard_Admin/CommonDocs";
import FlatDocs from "./Dashboard_Admin/FlatDocs";
import LegalDocs from "./Dashboard_Admin/LegalDocs";
import FlatLegalDocs from "./Dashboard_Admin/FlatLegalDocs";
import ActivityType from "./Dashboard_Admin/ActivityType";
import ViewActivities from "./Dashboard_Admin/ViewActivities";
import Customize from "./Dashboard_Admin/Customize";
import ViewCustomization from "./Dashboard_Admin/ViewCustomization";
import AddActivity from "./Dashboard_Admin/AddActivity";
import AddSubactivity from "./Dashboard_Admin/AddSubactivity";
import ViewActivity from "./Dashboard_Admin/ViewActivity";
import FlatHandover from "./Dashboard_Admin/FlatHandover";
import ViewHandover from "./Dashboard_Admin/ViewHandover";

// Superadmin components
import SADashboard from "./Dashboard_SuperAdmin/Dashboard";
import SAFlatStatus from "./Dashboard_SuperAdmin/FlatStatus";
import SABookedFlats from "./Dashboard_SuperAdmin/BookedFlats";
import SABlockedFlats from "./Dashboard_SuperAdmin/BlockedFlats";
import SACancelledFlats from "./Dashboard_SuperAdmin/CancelledFlats";
import SAFlatSummary from "./Dashboard_SuperAdmin/FlatSummary";
import SAFlat from "./Dashboard_SuperAdmin/Flat";
import SAFlatVerification from "./Dashboard_SuperAdmin/FlatVerification";
import SAActivityType from "./Dashboard_SuperAdmin/ActivityType";
import SAViewActivities from "./Dashboard_SuperAdmin/ViewActivities";
import SACustomize from "./Dashboard_SuperAdmin/Customize";
import SAViewCustomization from "./Dashboard_SuperAdmin/ViewCustomization";
import SAAddActivity from "./Dashboard_SuperAdmin/AddActivity";
import SAAddSubactivity from "./Dashboard_SuperAdmin/AddSubactivity";
import SAViewActivity from "./Dashboard_SuperAdmin/ViewActivity";
import SAFlatHandover from "./Dashboard_SuperAdmin/FlatHandover";
import SAViewHandover from "./Dashboard_SuperAdmin/ViewHandover";
import SABlockInventory from "./Dashboard_SuperAdmin/BlockInventory";
import SAProjects from "./Dashboard_SuperAdmin/Projects";
import SANewProject from "./Dashboard_SuperAdmin/NewProject";
import SAUserLogs from "./Dashboard_SuperAdmin/UserLogs";
import SALoanedFlats from "./Dashboard_SuperAdmin/LoanedFlats";
import SALoanDocument from "./Dashboard_SuperAdmin/LoanDocument";
import SAUploadLoanDoc from "./Dashboard_SuperAdmin/UploadLoanDoc";
import SACompletePayment from "./Dashboard_SuperAdmin/CompletePayment";
import SABalancePayment from "./Dashboard_SuperAdmin/BalancePayment";
import SANoPayment from "./Dashboard_SuperAdmin/NoPayment";
import SANoDiscount from "./Dashboard_SuperAdmin/NoDiscount";
import SAExtraDiscount from "./Dashboard_SuperAdmin/ExtraDiscount";
import SAExtraPayment from "./Dashboard_SuperAdmin/ExtraPayment";
import SABBASigned from "./Dashboard_SuperAdmin/BBASigned";
import SAUnsignedBBA from "./Dashboard_SuperAdmin/UnsignedBBA";
import SACheque from "./Dashboard_SuperAdmin/Cheque";
import SACash from "./Dashboard_SuperAdmin/Cash";
import SANEFT from "./Dashboard_SuperAdmin/NEFT";
import SAManageBank from "./Dashboard_SuperAdmin/ManageBank";
import SAManageUser from "./Dashboard_SuperAdmin/ManageUser";
import SAManageCommission from "./Dashboard_SuperAdmin/ManageCommission";
import SAConstructionStages from "./Dashboard_SuperAdmin/ConstructionStages";
import SAAddPartner from "./Dashboard_SuperAdmin/AddPartner";
import SAReleaseCommission from "./Dashboard_SuperAdmin/ReleaseCommission";
import SAPaidCommission from "./Dashboard_SuperAdmin/PaidCommission";
import SAViewCoupons from "./Dashboard_SuperAdmin/ViewCoupons";
import SAInstallmentReport from "./Dashboard_SuperAdmin/InstallmentReport";
import SACPReport from "./Dashboard_SuperAdmin/CLPReport";
import SAFinalReport from "./Dashboard_SuperAdmin/FinalReport";
import SATodayReport from "./Dashboard_SuperAdmin/TodayReport";
import SADatewiseReport from "./Dashboard_SuperAdmin/DatewiseReport";
import SAViewAll from "./Dashboard_SuperAdmin/ViewAll";
import SAFlatDetailCP from "./Dashboard_SuperAdmin/FlatDetail_CP";
import SACPDetail from "./Dashboard_SuperAdmin/CP_Detail";
import SACommonDocs from "./Dashboard_SuperAdmin/CommonDocs";
import SAFlatDocs from "./Dashboard_SuperAdmin/FlatDocs";
import SALegalDocs from "./Dashboard_SuperAdmin/LegalDocs";
import SAFlatLegalDocs from "./Dashboard_SuperAdmin/FlatLegalDocs";
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
  const normalizedUserRole = userRole === 'admin' ? 'superadmin' : userRole;
  const isSuperAdmin = normalizedUserRole === 'superadmin';
  const isBuilderAdmin = normalizedUserRole === 'builder_admin';
  const isAdminRole = isSuperAdmin || isBuilderAdmin;
  const isCustomerUser = normalizedUserRole === 'user';

  // Navbar state
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [isUpdatesPopupOpen, setIsUpdatesPopupOpen] = useState(false);
  const [isMyDocumentsPopupOpen, setIsMyDocumentsPopupOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  
  // Admin Quick Tools state
  const [isQuickToolsOpen, setIsQuickToolsOpen] = useState(false);
  
  // Megamenu states - separate for each type
  const [isServicesMegamenuOpen, setIsServicesMegamenuOpen] = useState(false);
  const [isBankingMegamenuOpen, setIsBankingMegamenuOpen] = useState(false);
  const [isProjectsMegamenuOpen, setIsProjectsMegamenuOpen] = useState(false);
  const [isDocumentsMegamenuOpen, setIsDocumentsMegamenuOpen] = useState(false);
  const megamenuTriggerRef = useRef(null);
  const megamenuTimeoutRef = useRef(null);
  const isHoveringMegamenuRef = useRef(false);
  
  

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileButton = document.querySelector('[data-profile-button]');
      const profileDropdown = document.querySelector('[data-profile-dropdown]');
      
      if (
        isProfileDropdownOpen &&
        profileButton &&
        profileDropdown &&
        !profileButton.contains(event.target) &&
        !profileDropdown.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (megamenuTimeoutRef.current) {
        clearTimeout(megamenuTimeoutRef.current);
      }
    };
  }, []);

  // Reset hover state when megamenus close
  useEffect(() => {
    const isAnyOpen = isServicesMegamenuOpen || isBankingMegamenuOpen || isProjectsMegamenuOpen || isDocumentsMegamenuOpen;
    if (!isAnyOpen) {
      isHoveringMegamenuRef.current = false;
    }
  }, [isServicesMegamenuOpen, isBankingMegamenuOpen, isProjectsMegamenuOpen, isDocumentsMegamenuOpen]);

  // Fetch notification count and profile image (only for customer users)
  useEffect(() => {
    if (isCustomerUser) {
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
  }, [isCustomerUser]);

  // Role-based navigation configuration
  const getNavigationItems = () => {
    if (isSuperAdmin) {
      return [
        {
          key: "services",
          label: "Flats",
          icon: paymentIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'services',
        },
        {
          key: "banking",
          label: "Payment",
          icon: currentDuesIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'banking',
        },
        {
          key: "projects",
          label: "Projects",
          icon: paymentIcon, // Using existing icon for now
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'projects',
        },
        {
          key: "documents",
          label: "Documents",
          icon: documentsIcon,
          width: "clamp(8.75rem, 10.9375rem, 12.5rem)",
          isMegamenu: true,
          megamenuType: 'documents',
        },
      ];
    }

    if (isBuilderAdmin) {
      return [
        {
          key: "services",
          label: "Flats",
          icon: paymentIcon,
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'services',
        },
        {
          key: "banking",
          label: "Payment",
          icon: currentDuesIcon,
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'banking',
        },
        {
          key: "projects",
          label: "Projects",
          icon: paymentIcon,
          width: "clamp(8.5rem, 10.625rem, 12rem)",
          isMegamenu: true,
          megamenuType: 'projects',
        },
        {
          key: "documents",
          label: "Documents",
          icon: documentsIcon,
          width: "clamp(8.75rem, 10.9375rem, 12.5rem)",
          isMegamenu: true,
          megamenuType: 'documents',
        },
      ];
    }

    const customerNavigation = [
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

    return customerNavigation;
  };

  const navigationItems = getNavigationItems();

  // Helper function to get megamenu state
  const getMegamenuState = (megamenuType) => {
    switch (megamenuType) {
      case 'services':
        return isServicesMegamenuOpen;
      case 'banking':
        return isBankingMegamenuOpen;
      case 'projects':
        return isProjectsMegamenuOpen;
      case 'documents':
        return isDocumentsMegamenuOpen;
      default:
        return false;
    }
  };

  // Check if current active page belongs to a specific megamenu
  const isPageInMegamenu = (megamenuType) => {
    if (!activePage) return false;
    
    switch (megamenuType) {
      case 'services':
        // Services megamenu pages
        return ['flatStatus', 'report', 'blockedFlats', 'bookedFlats', 'cancelledFlats', 'blockInventory', 'flatVerification', 'projects', 'flat', 'activityType', 'viewActivities', 'customize', 'viewCustomization', 'addActivity', 'viewActivity', 'flatHandoverActivity', 'viewFlatHandoverActivity', 'addSubactivity', 'flatHandover', 'viewHandover'].includes(activePage);
      case 'banking':
        // Banking megamenu pages
        return ['loanedFlats', 'loanDocuments', 'completePayment', 'balancePayment', 'noPayment', 'cheque', 'cash', 'neft', 'manageBank', 'manageUser', 'manageChannelPartner', 'manageCommission', 'calculateInterest', 'constructionStages'].includes(activePage);
      case 'projects':
        // Projects megamenu pages
        return ['customer', 'channelPartners', 'projectSnapshots', 'reports', 'noDiscount', 'extraDiscount', 'extraPayment', 'signedBBA', 'unsignedBBA', 'addPartner', 'viewAll', 'releaseCommission', 'paidCommission', 'userLogs', 'viewCoupons', 'installmentReports', 'clpReport', 'finalReport', 'todayReport', 'datewiseReport'].includes(activePage);
      case 'documents':
        // Documents megamenu pages
        return ['commonDocs', 'flatDocs', 'legalDocs', 'flatLegalDocs'].includes(activePage);
      default:
        return false;
    }
  };

  // Navbar handlers
  const openMegamenu = useCallback((megamenuType) => {
    setIsServicesMegamenuOpen(megamenuType === 'services');
    setIsBankingMegamenuOpen(megamenuType === 'banking');
    setIsProjectsMegamenuOpen(megamenuType === 'projects');
    setIsDocumentsMegamenuOpen(megamenuType === 'documents');
  }, []);

  const handleNavClick = (item) => {
    if (isAdminRole && item.isMegamenu) {
      if (megamenuTimeoutRef.current) {
        clearTimeout(megamenuTimeoutRef.current);
        megamenuTimeoutRef.current = null;
      }

      const isOpen = getMegamenuState(item.megamenuType);
      if (isOpen) {
        openMegamenu(null);
      } else {
        openMegamenu(item.megamenuType);
      }
      return;
    }
    onPageChange(item.key);
  };


  // Megamenu handlers
  const handleMegamenuMouseEnter = (megamenuType) => {
    // Clear any pending timeout when entering
    if (megamenuTimeoutRef.current) {
      clearTimeout(megamenuTimeoutRef.current);
      megamenuTimeoutRef.current = null;
    }

    // Small delay to prevent flickering when switching between megamenus
    megamenuTimeoutRef.current = setTimeout(() => {
      openMegamenu(megamenuType);
      megamenuTimeoutRef.current = null;
    }, 30);
  };

  const handleMegamenuMouseLeave = (_megamenuType) => {
    // Clear any existing timeout
    if (megamenuTimeoutRef.current) {
      clearTimeout(megamenuTimeoutRef.current);
    }
    
    // Add a delay to allow moving from button to megamenu
    megamenuTimeoutRef.current = setTimeout(() => {
      // Only close if we're not hovering over any megamenu
      if (!isHoveringMegamenuRef.current) {
        openMegamenu(null);
        megamenuTimeoutRef.current = null;
      }
    }, 150);
  };

  const handleMegamenuClose = (_megamenuType) => {
    // Close all megamenus
    openMegamenu(null);
  };

  // Track when hovering over megamenu content
  const handleMegamenuContentMouseEnter = useCallback(() => {
    // Clear any pending close timeout
    if (megamenuTimeoutRef.current) {
      clearTimeout(megamenuTimeoutRef.current);
      megamenuTimeoutRef.current = null;
    }
    isHoveringMegamenuRef.current = true;
  }, []);

  const handleMegamenuContentMouseLeave = useCallback(() => {
    isHoveringMegamenuRef.current = false;
    // Use the same timeout logic as button leave
    megamenuTimeoutRef.current = setTimeout(() => {
      if (!isHoveringMegamenuRef.current) {
        openMegamenu(null);
        megamenuTimeoutRef.current = null;
      }
    }, 150);
  }, [openMegamenu]);



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
    setIsQuickToolsOpen(false);
    
    // Handle different quick tools
    switch (tool) {
      case 'new-bookings':
        // Navigate to appropriate page or open booking popup
        alert('New Bookings feature - Coming soon!');
        break;
      case 'new-customer':
        // Navigate to customer management or open customer popup
        alert('New Customer feature - Coming soon!');
        break;
      case 'new-staff':
        // Navigate to staff management or open staff popup
        alert('New Staff feature - Coming soon!');
        break;
      case 'new-projects':
        // Only super admins can access new project creation
        if (isSuperAdmin) {
          onPageChange('newProject');
        }
        break;
      default:
        console.log(`Quick tool clicked: ${tool}`);
    }
  };
  const renderMiddlePanel = () => {
    if (!activePage) {
      return null;
    }

    if (isSuperAdmin) {
      switch (activePage) {
        case "dashboard":
          return (
            <div
              className={`page-container h-full ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SADashboard key={`dashboard-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flatStatus":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAFlatStatus key={`flatStatus-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "bookedFlats":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SABookedFlats key={`bookedFlats-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "manageUser":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAManageUser
                key={`manageUser-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "manageCommission":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAManageCommission
                key={`manageCommission-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "constructionStages":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAConstructionStages
                key={`constructionStages-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "addPartner":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAAddPartner
                key={`addPartner-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "releaseCommission":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAReleaseCommission
                key={`releaseCommission-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "paidCommission":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAPaidCommission
                key={`paidCommission-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "viewCoupons":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAViewCoupons
                key={`viewCoupons-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "installmentReport":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAInstallmentReport
                key={`installmentReport-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "clpReport":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SACPReport
                key={`clpReport-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "finalReport":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAFinalReport
                key={`finalReport-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "todayReport":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SATodayReport
                key={`todayReport-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "datewiseReport":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SADatewiseReport
                key={`datewiseReport-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "viewAll":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAViewAll
                key={`viewAll-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "flatDetailCP":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SAFlatDetailCP
                key={`flatDetailCP-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "cpDetail":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <SACPDetail
                key={`cpDetail-${animationKey}`}
                onPageChange={onPageChange}
              />
            </div>
          );
        case "documents":
          return <Documents key={`documents-${animationKey}`} />;
        case "commonDocs":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <SACommonDocs key={`commonDocs-${animationKey}`} />
              </div>
            </div>
          );
        case "flatDocs":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <SAFlatDocs key={`flatDocs-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "legalDocs":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <SALegalDocs key={`legalDocs-${animationKey}`} />
              </div>
            </div>
          );
        case "flatLegalDocs":
          return (
            <div
              className={`page-container h-full flex flex-col ${
                isAnimating ? "opacity-50" : ""
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <SAFlatLegalDocs key={`flatLegalDocs-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    // Builder admin components
    if (isBuilderAdmin) {
      switch (activePage) {
        case "dashboard":
          return (
            <div className={`page-container h-full ${isAnimating ? "opacity-50" : ""}`}>
              <Dashboard key={`dashboard-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flatStatus":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FlatStatus key={`flatStatus-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "bookedFlats":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <BookedFlats key={`bookedFlats-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "blockedFlats":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <BlockedFlats key={`blockedFlats-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "cancelledFlats":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <CancelledFlats key={`cancelledFlats-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flatSummary":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FlatSummary key={`flatSummary-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flat":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <Flat key={`flat-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "flatVerification":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FlatVerification key={`flatVerification-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "activityType":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ActivityType key={`activityType-${animationKey}`} />
            </div>
          );
        case "viewActivities":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewActivities key={`viewActivities-${animationKey}`} />
            </div>
          );
        case "customize":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <Customize key={`customize-${animationKey}`} />
            </div>
          );
        case "viewCustomization":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewCustomization key={`viewCustomization-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flatHandoverActivity":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <AddActivity key={`flatHandoverActivity-${animationKey}`} />
            </div>
          );
        case "addSubactivity":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <AddSubactivity key={`addSubactivity-${animationKey}`} />
            </div>
          );
        case "viewActivity":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewActivity key={`viewActivity-${animationKey}`} />
            </div>
          );
        case "flatHandover":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FlatHandover key={`flatHandover-${animationKey}`} />
            </div>
          );
        case "viewHandover":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewHandover key={`viewHandover-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "blockInventory":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <BlockInventory key={`blockInventory-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "projects":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <Projects key={`projects-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "userLogs":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <UserLogs key={`userLogs-${animationKey}`} />
              </div>
            </div>
          );
        case "loanedFlats":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <LoanedFlats key={`loanedFlats-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "loanDocuments":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <LoanDocument key={`loanDocument-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "uploadLoanDoc":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <UploadLoanDoc key={`uploadLoanDoc-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "completePayment":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <CompletePayment key={`completePayment-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "balancePayment":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <BalancePayment key={`balancePayment-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "noPayment":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <NoPayment key={`noPayment-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "noDiscount":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <NoDiscount key={`noDiscount-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "extraDiscount":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ExtraDiscount key={`extraDiscount-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "extraPayment":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ExtraPayment key={`extraPayment-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "signedBBA":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <BBASigned key={`signedBBA-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "unsignedBBA":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <UnsignedBBA key={`unsignedBBA-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "cheque":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <Cheque key={`cheque-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "cash":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <Cash key={`cash-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "neft":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <NEFT key={`neft-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "manageBank":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ManageBank key={`manageBank-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "manageUser":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ManageUser key={`manageUser-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "manageCommission":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ManageCommission key={`manageCommission-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "constructionStages":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ConstructionStages key={`constructionStages-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "addPartner":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <AddPartner key={`addPartner-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "releaseCommission":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ReleaseCommission key={`releaseCommission-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "paidCommission":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <PaidCommission key={`paidCommission-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "viewCoupons":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewCoupons key={`viewCoupons-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "installmentReport":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <InstallmentReport key={`installmentReport-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "clpReport":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <CLPReport key={`clpReport-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "finalReport":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FinalReport key={`finalReport-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "todayReport":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <TodayReport key={`todayReport-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "datewiseReport":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <DatewiseReport key={`datewiseReport-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "viewAll":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <ViewAll key={`viewAll-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "flatDetailCP":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <FlatDetail_CP key={`flatDetailCP-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "cpDetail":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <CP_Detail key={`cpDetail-${animationKey}`} onPageChange={onPageChange} />
            </div>
          );
        case "documents":
          return <Documents key={`documents-${animationKey}`} />;
        case "commonDocs":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <CommonDocs key={`commonDocs-${animationKey}`} />
              </div>
            </div>
          );
        case "flatDocs":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <FlatDocs key={`flatDocs-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        case "legalDocs":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <LegalDocs key={`legalDocs-${animationKey}`} />
              </div>
            </div>
          );
        case "flatLegalDocs":
          return (
            <div className={`page-container h-full flex flex-col ${isAnimating ? "opacity-50" : ""}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <FlatLegalDocs key={`flatLegalDocs-${animationKey}`} onPageChange={onPageChange} />
              </div>
            </div>
          );
        default:
          return null;
      }
    }

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
              {isAdminRole ? (
                <button
                  onClick={() => onPageChange('dashboard')}
                  className="hover:opacity-80 transition-opacity duration-200"
                >
                  <img
                    src={Proprite}
                    alt="The Art"
                    style={{
                      height: "clamp(2.5rem, 3.5rem, 4rem)",
                      width: "auto",
                      filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 1))",
                    }}
                  />
                </button>
              ) : (
                <img
                  src={Proprite}
                  alt="The Art"
                  style={{
                    height: "clamp(2.5rem, 3.5rem, 4rem)",
                    width: "auto",
                    filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 1))",
                  }}
                />
              )}
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
              <div
                key={item.key}
                className="relative"
              >
                <button
                  ref={item.isMegamenu && isAdminRole ? megamenuTriggerRef : undefined}
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={item.isMegamenu && isAdminRole ? () => handleMegamenuMouseEnter(item.megamenuType) : undefined}
                  onMouseLeave={item.isMegamenu && isAdminRole ? () => handleMegamenuMouseLeave(item.megamenuType) : undefined}
                  className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm rounded-full ${
                    item.isMegamenu && isAdminRole 
                      ? "hover:bg-gray-50" // Simplified hover for megamenu buttons
                      : "btn-animate hover-lift" // Full animation for regular buttons
                  } ${
                    activePage === item.key || (item.isMegamenu && isAdminRole && (getMegamenuState(item.megamenuType) || isPageInMegamenu(item.megamenuType)))
                      ? "text-white font-medium transform scale-105"
                      : "text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg"
                  }`}
                  style={{
                    width: item.width,
                    height: "clamp(2.25rem, 2.8125rem, 3.25rem)",
                    fontSize: "clamp(0.75rem, 0.875rem, 1rem)",
                    background:
                      activePage === item.key || (item.isMegamenu && isAdminRole && (getMegamenuState(item.megamenuType) || isPageInMegamenu(item.megamenuType)))
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
                      filter: 
                        activePage === item.key || (item.isMegamenu && isAdminRole && (getMegamenuState(item.megamenuType) || isPageInMegamenu(item.megamenuType)))
                          ? "invert(1)" 
                          : "none",
                    }}
                  />
                  <span className="font-medium font-montserrat" style={{ fontSize: "clamp(0.75rem, 0.875rem, 1rem)" }}>
                    {item.label}
                  </span>
                </button>
                
                {/* Consolidated Megamenu - Only for Admin */}
                {item.isMegamenu && isAdminRole && (
                  <Megamenu
                    isOpen={getMegamenuState(item.megamenuType)}
                    onClose={handleMegamenuClose}
                    triggerRef={megamenuTriggerRef}
                    type={item.megamenuType || 'services'}
                    onPageChange={onPageChange}
                    onMouseEnter={handleMegamenuContentMouseEnter}
                    onMouseLeave={handleMegamenuContentMouseLeave}
                  />
                )}
              </div>
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
                {isCustomerUser && notificationCount > 0 && (
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
              {isCustomerUser && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                data-profile-button
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
                <div data-profile-dropdown className="absolute right-0 top-[3rem] w-[12rem] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up">
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
            {isAdminRole ? (
              <button
                onClick={() => onPageChange('dashboard')}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={Proprite}
                  alt="The Art"
                  style={{
                    height: "clamp(2rem, 2.5rem, 3rem)",
                    width: "auto",
                    filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.1))",
                  }}
                />
              </button>
            ) : (
              <img
                src={Proprite}
                alt="The Art"
                style={{
                  height: "clamp(2rem, 2.5rem, 3rem)",
                  width: "auto",
                  filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.1))",
                }}
              />
            )}
          </div>

          {/* Profile Icon */}
          <button
            data-profile-button
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
            <div data-profile-dropdown className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in-up" style={{ marginRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
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
                  {isCustomerUser && notificationCount > 0 && (
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
        userRole={normalizedUserRole}
      />

      <div className="overflow-hidden h-screen">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-full flex flex-col relative" style={{ paddingTop: 'clamp(4.5rem, 5rem, 5.5rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)', paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          {/* User Role - Home View (No active page) */}
          {isCustomerUser && (!activePage || activePage === "null") && (
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
          {((activePage && activePage !== "null") || isAdminRole) && (
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
          {isAdminRole ? (
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
                      {isSuperAdmin && (
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
                      )}
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
