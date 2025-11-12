import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing/Landing';
import { authAPI } from './api/api';

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

const getDefaultPageForRole = (role, isMobile) => {
  if (role === 'superadmin') {
    return isMobile ? 'flatStatus' : 'dashboard';
  }
  if (role === 'user' || role === 'builder_admin') {
    return isMobile ? null : 'flatDetails';
  }
  return null;
};

const getInitialActivePage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const isMobile = window.innerWidth < 1024;
  const role = getStoredRole();
  return getDefaultPageForRole(role, isMobile);
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState(() => getStoredRole());
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCustomerCarePopupOpen, setIsCustomerCarePopupOpen] = useState(false);

  const [activePage, setActivePage] = useState(() => getInitialActivePage());

  useEffect(() => {
    const checkScreenSize = () => {
      // Use viewport width for responsive breakpoints
      // Browser zoom automatically scales rem/px units, so this works correctly
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      const currentUserRole = normalizeRole(localStorage.getItem('userRole'));
      
      // On mobile, users should have no active page (shows UserProfile + DetailedInfo)
      // Superadmins always need an active page
      if (mobile && (currentUserRole === 'user' || currentUserRole === 'builder_admin')) {
        setActivePage(prevPage => {
          // Only update if changing from a page to null
          if (prevPage !== null) {
            navigate('/dashboard', { replace: true });
          }
          return null;
        });
      } else if (mobile && currentUserRole === 'superadmin') {
        // Superadmin on mobile: prefer flatStatus
        setActivePage(prevPage => {
          // If coming from desktop dashboard, switch to flatStatus
          if (prevPage === 'dashboard') {
            navigate('/dashboard/flatStatus', { replace: true });
            return 'flatStatus';
          }
          const pageToSet = prevPage || 'flatStatus';
          if (!prevPage) {
            navigate(`/dashboard/${pageToSet}`, { replace: true });
          }
          return pageToSet;
        });
      } else if (!mobile && (currentUserRole === 'user' || currentUserRole === 'builder_admin')) {
        // User and Builder Admin on desktop: default to flatDetails
        setActivePage(prevPage => {
          // Switching from mobile (null) to desktop - set default and navigate
          if (prevPage === null || prevPage === undefined) {
            navigate('/dashboard/flatDetails', { replace: true });
            return 'flatDetails';
          }
          // Already on desktop with a page selected - keep it
          return prevPage;
        });
      } else if (!mobile && currentUserRole === 'superadmin') {
        // Superadmin on desktop: keep current page if set; otherwise default to dashboard
        setActivePage(prevPage => {
          if (prevPage) {
            // Do not override existing page on desktop
            return prevPage;
          }
          const pageToSet = 'dashboard';
          navigate(`/dashboard/${pageToSet}`, { replace: true });
          return pageToSet;
        });
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate, location.pathname]);

  // Allow logged-in users to stay on landing page
  // Removed redirect to allow users to see role-based landing page after login

  // Sync activePage with URL when navigating
  useEffect(() => {
    if (isLoggedIn && location.pathname.startsWith('/dashboard')) {
      const pathSegments = location.pathname.split('/');
      const pageFromUrl = pathSegments[2]; // /dashboard/flatDetails -> flatDetails
      const userRole = normalizeRole(localStorage.getItem('userRole'));
      const isMobileDevice = window.innerWidth < 1024;
      
      if (pageFromUrl && pageFromUrl !== activePage) {
        // URL has a specific page - set it
        setActivePage(pageFromUrl);
      } else if (!pageFromUrl) {
        // URL is just /dashboard - set default based on role and device
        if (isMobileDevice && (userRole === 'user' || userRole === 'builder_admin')) {
          // On mobile/tablet, users and builder admins should have no active page (shows UserProfile + DetailedInfo)
          setActivePage(null);
        } else if (isMobileDevice && userRole === 'superadmin') {
          // On mobile/tablet, superadmin defaults to flatStatus
          if (!activePage) {
            setActivePage('flatStatus');
          }
        } else if (!isMobileDevice && (userRole === 'user' || userRole === 'builder_admin')) {
          // On desktop, user and builder admin default to flatDetails
          if (!activePage) {
            setActivePage('flatDetails');
          }
        } else if (!isMobileDevice && userRole === 'superadmin') {
          // On desktop, superadmin defaults to dashboard
          if (!activePage) {
            setActivePage('dashboard');
          }
        }
      }
    }
  }, [location.pathname, isLoggedIn, activePage]);

  // Allow logged-in users to access landing page via back button
  // Removed redirect to allow users to see role-based landing page after login

  const handleLogin = (token) => {
    // Defer state updates to avoid updating during render
    setTimeout(() => {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authToken', token);
      
      // Get role from localStorage (set by API during login)
      const role = getStoredRole();
      setUserRole(role); // Update userRole state
      
      // Navigate to landing page to show role-based content
      navigate('/', { replace: true });
    }, 0);
  };


  const handlePageChange = (page) => {
    if (page !== activePage) {
      // Update state immediately to avoid intermediate flashes
      setActivePage(page);
      setAnimationKey(prev => prev + 1);
      setIsAnimating(false);
      navigate(`/dashboard/${page}`, { replace: false });
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUserRole('user'); // Reset to default user role
      setActivePage('flatDetails'); // Reset to default page
      setIsSidebarOpen(false);
      setIsUpdatesOpen(false);
      navigate('/');
    }
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

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={<Landing onLogin={handleLogin} />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          isLoggedIn ? (
            <Layout
              activePage={activePage}
              onPageChange={handlePageChange}
              onLogout={handleLogout}
              onSidebarToggle={handleSidebarToggle}
              onUpdatesToggle={handleUpdatesToggle}
              isSidebarOpen={isSidebarOpen}
              isUpdatesOpen={isUpdatesOpen}
              isCustomerCarePopupOpen={isCustomerCarePopupOpen}
              onCustomerCareClose={() => setIsCustomerCarePopupOpen(false)}
              isAnimating={isAnimating}
              animationKey={animationKey}
              userRole={userRole}
            />
          ) : (
            <Landing onLogin={handleLogin} />
          )
        } 
      />
      <Route 
        path="/dashboard/:page" 
        element={
          isLoggedIn ? (
            <Layout
              activePage={activePage}
              onPageChange={handlePageChange}
              onLogout={handleLogout}
              onSidebarToggle={handleSidebarToggle}
              onUpdatesToggle={handleUpdatesToggle}
              isSidebarOpen={isSidebarOpen}
              isUpdatesOpen={isUpdatesOpen}
              isCustomerCarePopupOpen={isCustomerCarePopupOpen}
              onCustomerCareClose={() => setIsCustomerCarePopupOpen(false)}
              isAnimating={isAnimating}
              animationKey={animationKey}
              userRole={userRole}
            />
          ) : (
            <Landing onLogin={handleLogin} />
          )
        } 
      />
    </Routes>
  );
}

export default App;