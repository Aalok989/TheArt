import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing/Landing';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
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
      
      if (pageFromUrl && pageFromUrl !== activePage) {
        setActivePage(pageFromUrl);
      } else if (!pageFromUrl && activePage) {
        // If URL is just /dashboard, set to default page
        setActivePage('flatDetails');
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
    navigate('/dashboard', { replace: true });
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
    setActivePage('flatDetails');
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
            renderDashboard()
          ) : (
            <Landing onLogin={handleLogin} />
          )
        } 
      />
      <Route 
        path="/dashboard/:page" 
        element={
          isLoggedIn ? (
            renderDashboard()
          ) : (
            <Landing onLogin={handleLogin} />
          )
        } 
      />
    </Routes>
  );

  const renderDashboard = () => {
    return (
      <Dashboard
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
      />
    );
  };
}

export default App;