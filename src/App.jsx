import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing/Landing';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'user'; // Default to 'user' role
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCustomerCarePopupOpen, setIsCustomerCarePopupOpen] = useState(false);

  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      // Use viewport width directly (browser zoom scales this automatically)
      const isMobile = window.innerWidth < 1024;
      const userRole = localStorage.getItem('userRole') || 'user';
      
      if (userRole === 'admin') {
        // Admin: on mobile/tablet default to flatStatus, on desktop default to overview
        const defaultPage = isMobile ? 'flatStatus' : 'overview';
        return defaultPage;
      } else {
        // User: on mobile/tablet no default page, on desktop default to flatDetails
        return isMobile ? null : 'flatDetails';
      }
    }
    return null;
  });

  useEffect(() => {
    const checkScreenSize = () => {
      // Use viewport width for responsive breakpoints
      // Browser zoom automatically scales rem/px units, so this works correctly
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      const currentUserRole = localStorage.getItem('userRole') || 'user';
      
      // On mobile, users should have no active page (shows UserProfile + DetailedInfo)
      // Admins always need an active page
      if (mobile && currentUserRole === 'user') {
        setActivePage(prevPage => {
          // Only update if changing from a page to null
          if (prevPage !== null) {
            navigate('/dashboard', { replace: true });
          }
          return null;
        });
      } else if (mobile && currentUserRole === 'admin') {
        // Admin on mobile: default to flatStatus if switching from desktop
        setActivePage(prevPage => {
          // If coming from desktop with "overview", switch to "flatStatus"
          if (prevPage === 'overview') {
            navigate('/dashboard/flatStatus', { replace: true });
            return 'flatStatus';
          }
          // Otherwise keep current page or default to flatStatus
          const pageToSet = prevPage || 'flatStatus';
          if (!prevPage) {
            navigate(`/dashboard/${pageToSet}`, { replace: true });
          }
          return pageToSet;
        });
      } else if (!mobile && currentUserRole === 'user') {
        // User on desktop: default to flatDetails
        setActivePage(prevPage => {
          // Switching from mobile (null) to desktop - set default and navigate
          if (prevPage === null || prevPage === undefined) {
            navigate('/dashboard/flatDetails', { replace: true });
            return 'flatDetails';
          }
          // Already on desktop with a page selected - keep it
          return prevPage;
        });
      } else if (!mobile && currentUserRole === 'admin') {
        // Admin on desktop: default to overview or keep current page
        setActivePage(prevPage => {
          // If coming from mobile with "flatStatus" or "report", switch to "overview"
          if (prevPage === 'flatStatus' || prevPage === 'report') {
            navigate('/dashboard/overview', { replace: true });
            return 'overview';
          }
          // Otherwise keep current page or default to overview
          const pageToSet = prevPage || 'overview';
          if (!prevPage) {
            navigate(`/dashboard/${pageToSet}`, { replace: true });
          }
          return pageToSet;
        });
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate, location.pathname]);

  // Redirect logged-in users away from landing page
  useEffect(() => {
    if (isLoggedIn && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // Sync activePage with URL when navigating
  useEffect(() => {
    if (isLoggedIn && location.pathname.startsWith('/dashboard')) {
      const pathSegments = location.pathname.split('/');
      const pageFromUrl = pathSegments[2]; // /dashboard/flatDetails -> flatDetails
      const userRole = localStorage.getItem('userRole') || 'user';
      const isMobileDevice = window.innerWidth < 1024;
      
      if (pageFromUrl && pageFromUrl !== activePage) {
        // URL has a specific page - set it
        setActivePage(pageFromUrl);
      } else if (!pageFromUrl) {
        // URL is just /dashboard - set default based on role and device
        if (isMobileDevice && userRole === 'user') {
          // On mobile/tablet, users should have no active page (shows UserProfile + DetailedInfo)
          setActivePage(null);
        } else if (isMobileDevice && userRole === 'admin') {
          // On mobile/tablet, admin defaults to flatStatus
          if (!activePage) {
            setActivePage('flatStatus');
          }
        } else if (!isMobileDevice && userRole === 'user') {
          // On desktop, user defaults to flatDetails
          if (!activePage) {
            setActivePage('flatDetails');
          }
        } else if (!isMobileDevice && userRole === 'admin') {
          // On desktop, admin defaults to overview
          if (!activePage) {
            setActivePage('overview');
          }
        }
      }
    }
  }, [location.pathname, isLoggedIn, activePage]);

  // Prevent logged-in users from accessing landing page via back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (isLoggedIn && location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, location.pathname, navigate]);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', token);
    // Navigate to default page based on role and device
    const role = localStorage.getItem('userRole') || 'user';
    const isMobileDevice = window.innerWidth < 1024;
    
    if (isMobileDevice && role === 'user') {
      // On mobile/tablet, users start with no active page (shows UserProfile + DetailedInfo)
      setActivePage(null);
      navigate('/dashboard', { replace: true });
    } else if (isMobileDevice && role === 'admin') {
      // On mobile/tablet, admin starts with flatStatus
      setActivePage('flatStatus');
      navigate('/dashboard/flatStatus', { replace: true });
    } else if (!isMobileDevice && role === 'user') {
      // On desktop, user starts with flatDetails
      setActivePage('flatDetails');
      navigate('/dashboard/flatDetails', { replace: true });
    } else if (!isMobileDevice && role === 'admin') {
      // On desktop, admin starts with overview
      setActivePage('overview');
      navigate('/dashboard/overview', { replace: true });
    }
  };


  const handlePageChange = (page) => {
    if (page !== activePage) {
      setIsAnimating(true);
      setTimeout(() => {
        setActivePage(page);
        setAnimationKey(prev => prev + 1);
        setIsAnimating(false);
        // Update URL to reflect current page
        navigate(`/dashboard/${page}`, { replace: false });
      }, 150);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    const userRole = localStorage.getItem('userRole') || 'user';
    const defaultPage = userRole === 'admin' ? 'overview' : 'flatDetails';
    setActivePage(defaultPage);
    setIsSidebarOpen(false);
    setIsUpdatesOpen(false);
    navigate('/');
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

  // Temporary function to test role switching
  const toggleUserRole = () => {
    const newRole = userRole === 'user' ? 'admin' : 'user';
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
    // Switch to the default page for the new role
    const defaultPage = newRole === 'admin' ? 'overview' : 'flatDetails';
    setActivePage(defaultPage);
    navigate(`/dashboard/${defaultPage}`, { replace: true });
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
              onRoleToggle={toggleUserRole}
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
              onRoleToggle={toggleUserRole}
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