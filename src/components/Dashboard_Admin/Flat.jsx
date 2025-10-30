import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiPlus, HiMinus, HiDotsVertical, HiTrash, HiPencil, HiCheckCircle, HiReceiptTax, HiCog, HiMenu, HiX, HiLightningBolt, HiBell, HiFolder, HiEye, HiRefresh, HiDocumentText, HiCurrencyRupee, HiPrinter, HiShare, HiInformationCircle, HiDocument, HiKey, HiArrowUp, HiArrowDown, HiXCircle, HiArrowRight, HiDeviceMobile } from 'react-icons/hi';
import { fetchFlatDetailsAdmin } from '../../api/mockData';

const Flat = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [flatData, setFlatData] = useState(null);
  const [isApplicantDetailsExpanded, setIsApplicantDetailsExpanded] = useState(true);
  const [isFlatDetailsExpanded, setIsFlatDetailsExpanded] = useState(true);
  const [isPaymentInfoExpanded, setIsPaymentInfoExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Regular');
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

  // Edit mode states for different sections
  const [editingSection, setEditingSection] = useState(null);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Hover popup state
  const [showChargesPopup, setShowChargesPopup] = useState(false);
  
  // Channel partner popup state
  const [showChannelPartnerPopup, setShowChannelPartnerPopup] = useState(false);
  const [channelPartnerData, setChannelPartnerData] = useState({
    flatNo: '',
    oldChannelPartner: '',
    newChannelPartner: ''
  });

  // Verification details popup state
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [isVerificationPopupClicked, setIsVerificationPopupClicked] = useState(false);
  const [isFlatVerified, setIsFlatVerified] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationRemark, setVerificationRemark] = useState('');
  const [verificationData, setVerificationData] = useState({
    blockName: '',
    flatNumber: '',
    verifiedBy: '',
    remarks: '',
    date: '',
    time: ''
  });

  // BBA toggle state
  const [isBBASigned, setIsBBASigned] = useState(false);

  useEffect(() => {
    // Load flat data from sessionStorage or API
    const loadFlatData = async () => {
      try {
        setLoading(true);
        const storedFlatData = sessionStorage.getItem('selectedFlat');
        console.log('Flat component - storedFlatData:', storedFlatData);
        let flatNo = 'A-101'; // Default flat number
        
        if (storedFlatData) {
          const parsedData = JSON.parse(storedFlatData);
          flatNo = parsedData.flatNo;
          console.log('Flat component - using flatNo from sessionStorage:', flatNo);
        } else {
          console.log('Flat component - no stored data, using default flatNo:', flatNo);
        }

        // Fetch detailed flat data from API
        console.log('Flat component - fetching data for flatNo:', flatNo);
        const response = await fetchFlatDetailsAdmin(flatNo);
        console.log('Flat component - API response:', response);
        if (response.success) {
          setFlatData(response.data);
          console.log('Flat component - set flatData:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading flat data:', error);
        setLoading(false);
      }
    };

    loadFlatData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.quick-access-dropdown') && !event.target.closest('.quick-access-button')) {
        setIsQuickAccessOpen(false);
      }
      if (!event.target.closest('.hamburger-dropdown') && !event.target.closest('.hamburger-button')) {
        setIsMenuOpen(false);
      }
      if (!event.target.closest('.channel-partner-popup') && showChannelPartnerPopup) {
        handleCloseChannelPartnerPopup();
      }
      if (!event.target.closest('.verification-popup') && isVerificationPopupClicked) {
        handleCloseVerificationPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChannelPartnerPopup, isVerificationPopupClicked]);

  // Edit mode handlers
  const handleEditClick = (section, data = null) => {
    setEditingSection(section);
    if (data) {
      setEditData(data);
    } else {
      // Load the appropriate data based on section
      switch(section) {
        case 'customer':
          setEditData(flatData.customerInfo);
          break;
        case 'coApplicant':
          setEditData(flatData.coApplicantInfo);
          break;
        case 'flatInfo':
          setEditData(flatData.flatInfo);
          break;
        case 'charges':
          setEditData(flatData.charges);
          break;
        default:
          setEditData({});
      }
    }
  };

  const handleSaveClick = (section) => {
    // Update the flatData with editData
    const updatedFlatData = { ...flatData };
    
    switch(section) {
      case 'customer':
        updatedFlatData.customerInfo = { ...editData };
        break;
      case 'coApplicant':
        updatedFlatData.coApplicantInfo = { ...editData };
        break;
      case 'flatInfo':
        updatedFlatData.flatInfo = { ...editData };
        break;
      case 'charges':
        updatedFlatData.charges = { ...editData };
        break;
    }
    
    setFlatData(updatedFlatData);
    setEditingSection(null);
    setEditData({});
    
    // In a real app, you would send the updated data to the API here
    console.log('Saving data for section:', section, editData);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingPaymentIndex(null);
    setEditData({});
  };

  const handleDeleteCoApplicant = () => {
    if (window.confirm('Are you sure you want to delete the co-applicant information?')) {
      // Clear the data but keep the section visible to show the "Click Here" button
      const updatedFlatData = { ...flatData };
      updatedFlatData.coApplicantInfo = {
        name: '',
        contactNo: '',
        panNo: '',
        address: '',
        fatherHusband: '',
        email: '',
        dob: ''
      };
      setFlatData(updatedFlatData);
      
      // Exit edit mode if currently editing
      setEditingSection(null);
      
      // In a real app, you would send delete request to API here
      console.log('Deleting co-applicant data');
    }
  };

  const handlePaymentEditClick = (index, payment) => {
    setEditingPaymentIndex(index);
    setEditData(payment);
  };

  const handlePaymentSaveClick = () => {
    if (editingPaymentIndex !== null) {
      const updatedFlatData = { ...flatData };
      updatedFlatData.paymentInfo[editingPaymentIndex] = { ...editData };
      setFlatData(updatedFlatData);
      setEditingPaymentIndex(null);
      setEditData({});
      
      // In a real app, you would send the updated payment data to the API here
      console.log('Saving payment data:', editData);
    }
  };

  const handlePaymentDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this payment entry?')) {
      const updatedFlatData = { ...flatData };
      updatedFlatData.paymentInfo.splice(index, 1);
      setFlatData(updatedFlatData);
      
      // In a real app, you would send delete request to API here
      console.log('Deleting payment entry at index:', index);
    }
  };

  const handlePaymentVerify = (index) => {
    const updatedFlatData = { ...flatData };
    updatedFlatData.paymentInfo[index].chequeStatus = 'CLEARED';
    setFlatData(updatedFlatData);
    
    // In a real app, you would send verify request to API here
    console.log('Verifying payment at index:', index);
  };

  const handlePaymentReceipt = (index) => {
    // In a real app, this would open a receipt modal or navigate to receipt page
    console.log('Generating receipt for payment at index:', index);
    alert('Receipt generation feature - Coming soon!');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Channel partner handlers
  const handleChannelPartnerClick = () => {
    // Navigate to channel partner details or show more info
    console.log('Channel partner clicked:', flatData.flatInfo.channelPartner);
    alert('Channel partner details - Coming soon!');
  };

  const handleChangeChannelPartnerClick = () => {
    setChannelPartnerData({
      flatNo: flatData.flatNo,
      oldChannelPartner: flatData.flatInfo.channelPartner.replace(' (Change)', ''),
      newChannelPartner: ''
    });
    setShowChannelPartnerPopup(true);
  };

  const handleChannelPartnerInputChange = (field, value) => {
    setChannelPartnerData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelPartnerChange = () => {
    if (!channelPartnerData.newChannelPartner.trim()) {
      alert('Please select a new channel partner');
      return;
    }

    // Update the flat data
    const updatedFlatData = { ...flatData };
    updatedFlatData.flatInfo.channelPartner = `${channelPartnerData.newChannelPartner} (Change)`;
    setFlatData(updatedFlatData);

    // Close popup
    setShowChannelPartnerPopup(false);
    setChannelPartnerData({
      flatNo: '',
      oldChannelPartner: '',
      newChannelPartner: ''
    });

    // In a real app, you would send the updated data to the API here
    console.log('Channel partner changed:', channelPartnerData);
    alert('Channel partner changed successfully!');
  };

  const handleCloseChannelPartnerPopup = () => {
    setShowChannelPartnerPopup(false);
    setChannelPartnerData({
      flatNo: '',
      oldChannelPartner: '',
      newChannelPartner: ''
    });
  };

  // Verification details handlers
  const handleVerificationDetailsClick = () => {
    // Set verification data based on the current flat
    setVerificationData({
      blockName: flatData.block || 'A',
      flatNumber: flatData.flatNo || '11',
      verifiedBy: 'rohit', // This could be dynamic based on current user
      remarks: verificationRemark || '',
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }) // Current time in HH:MM:SS format
    });
  };

  const handleCloseVerificationPopup = () => {
    setShowVerificationPopup(false);
    setIsVerificationPopupClicked(false);
    setVerificationData({
      blockName: '',
      flatNumber: '',
      verifiedBy: '',
      remarks: '',
      date: '',
      time: ''
    });
  };

  const handleVerificationButtonClick = () => {
    if (!isFlatVerified) {
      // Open form to capture remarks before verifying
      setShowVerificationForm(true);
      setShowVerificationPopup(false);
      setIsVerificationPopupClicked(false);
    } else {
      // If already verified, just show details popup
      handleVerificationDetailsClick();
      setShowVerificationPopup(true);
      setIsVerificationPopupClicked(true);
    }
  };

  const handleVerifySubmit = () => {
    // Persist verification in local state (mock)
    handleVerificationDetailsClick();
    setIsFlatVerified(true);
    setShowVerificationForm(false);
    setShowVerificationPopup(true); // Show details after verify
    setIsVerificationPopupClicked(true);
  };

  // BBA toggle handler
  const handleBBAToggle = () => {
    if (!isBBASigned) {
      // Currently "Sign BBA" - show confirmation
      const confirmed = window.confirm('Does BBA for this flat is signed?');
      if (confirmed) {
        setIsBBASigned(true);
        console.log('BBA signed for flat:', flatData.flatNo);
      }
    } else {
      // Currently "Revert BBA" - toggle back to sign
      setIsBBASigned(false);
      console.log('BBA reverted for flat:', flatData.flatNo);
    }
  };

  // Applicable charges data
  const applicableCharges = [
    { name: 'Amenities', rate: '100/- Sq. Ft.' },
    { name: 'Corpus Fund', rate: '70/- Sq. Ft.' },
    { name: 'EWSW', rate: '100/- Sq. Ft.' },
    { name: 'Maintenance for 1st year', rate: '40/- Sq. Ft.' },
    { name: 'Maintenance for 2nd year', rate: '40/- Sq. Ft.' },
    { name: 'Single Car Parking', rate: '150000' },
  ];

  // Loading state
  if (loading || !flatData) {
    return (
      <div className="h-full flex items-center justify-center" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading flat details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:relative space-y-4 lg:space-y-0" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <button
              onClick={() => {
                const origin = (typeof window !== 'undefined' && sessionStorage.getItem('flatOrigin')) || 'flatStatus';
                onPageChange && onPageChange(origin);
              }}
              className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
              style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}
            >
              <HiChevronLeft style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
            </button>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
              Booking Statement For Flat {flatData.flatNo}
            </h2>
          </div>
          
          {/* Centered buttons - Responsive */}
          <div className="flex lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 items-center justify-center lg:justify-start" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="relative group">
              <button 
                onClick={handleVerificationButtonClick}
                onMouseEnter={() => {
                  if (!isVerificationPopupClicked && isFlatVerified) {
                    handleVerificationDetailsClick();
                    setShowVerificationPopup(true);
                  }
                }}
                onMouseLeave={() => {
                  if (!isVerificationPopupClicked) {
                    setShowVerificationPopup(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors w-full lg:w-auto ${
                  isFlatVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                }`} 
                style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
              {isFlatVerified ? 'Verified Flat' : 'Verify Flat'}
            </button>
              
              {/* Verification Details Hover Popup */}
              {showVerificationPopup && (
                <div className="verification-popup absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl z-50" style={{ minWidth: 'clamp(15rem, 18rem, 20rem)', padding: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
                  <div className="text-center mb-4 bg-blue-100 rounded-lg p-3">
                    <h3 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                      Verification Details
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { label: 'Block Name', field: 'blockName' },
                      { label: 'Flat Number', field: 'flatNumber' },
                      { label: 'Verified By', field: 'verifiedBy' },
                      { label: 'Remarks', field: 'remarks' },
                      { label: 'Date', field: 'date' },
                      { label: 'Time', field: 'time' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <span className="text-gray-700 font-semibold" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                          {item.label}:
                        </span>
                        <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                          {verificationData[item.field] || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={handleBBAToggle}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors w-full lg:w-auto ${
                isBBASigned 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
              {isBBASigned ? 'Revert BBA' : 'Sign BBA'}
            </button>
          </div>
        </div>
        
        {/* Top right corner icons - Hidden on mobile */}
        <div className="hidden lg:flex absolute top-0 right-0 items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {/* Quick Access Tool Icon */}
            <button 
              onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
              className="flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl quick-access-button" 
              style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}
            >
              <HiLightningBolt style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-white drop-shadow-sm" />
            </button>
          
          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors hamburger-button" 
            style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}
          >
            {isMenuOpen ? (
              <HiX style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
            ) : (
              <HiMenu style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
            )}
          </button>
        </div>
        
      {/* Verification Form Modal */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <h3 className="text-center font-bold text-gray-800 mb-4" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.25rem)' }}>Add Remarks</h3>
            <textarea
              value={verificationRemark}
              onChange={(e) => setVerificationRemark(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minHeight: '10rem', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              placeholder="Enter verification remarks (optional)"
            />
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setShowVerificationForm(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Quick Access Tool Dropdown */}
        {isQuickAccessOpen && (
          <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 quick-access-dropdown" style={{ marginTop: 'clamp(4rem, 5rem, 6rem)', marginRight: 'clamp(4rem, 5rem, 6rem)', minWidth: 'clamp(10rem, 12rem, 14rem)' }}>
            <div className="py-2">
              {/* Quick Access Tool Items */}
              {[
                { icon: HiDocument, text: 'Welcome Letter' },
                { icon: HiCheckCircle, text: 'Enable Login' },
                { icon: HiKey, text: 'Reset Password' },
                { icon: HiArrowUp, text: 'Transfer Flat' },
                { icon: HiXCircle, text: 'Cancel Flat' },
                { icon: HiArrowRight, text: 'Shift Flat' },
                { icon: HiDeviceMobile, text: 'Send SMS' },
              ].map((item, index) => (
                <button key={index} className="w-full px-4 py-3 text-left text-white hover:bg-gray-600 transition-colors flex items-center gap-3 bg-gray-700 border-b border-gray-600 last:border-b-0">
                  <item.icon style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                  <span style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Hamburger Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 hamburger-dropdown" style={{ marginTop: 'clamp(4rem, 5rem, 6rem)', marginRight: 'clamp(1rem, 1.5rem, 2rem)', minWidth: 'clamp(12rem, 15rem, 18rem)', maxHeight: 'clamp(20rem, 25rem, 30rem)' }}>
            <div className="py-2 overflow-y-auto max-h-full" style={{ maxHeight: 'clamp(19rem, 24rem, 29rem)' }}>
              {/* Set Reminder */}
              <button className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                <HiBell style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                <span style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Set Reminder</span>
              </button>
              
              {/* Menu Items */}
              {[
                { icon: HiFolder, text: 'Upload Documents' },
                { icon: HiEye, text: 'View Documents' },
                { icon: HiEye, text: 'View Legal Documents' },
                { icon: HiEye, text: 'Construction Stages Change' },
                { icon: HiRefresh, text: 'Construction Stages Reset' },
                { icon: HiDocumentText, text: 'Generate Receipt Number' },
                { icon: HiCurrencyRupee, text: 'Add Payment' },
                { icon: HiPlus, text: 'Add Remarks' },
                { icon: HiPrinter, text: 'Print Demand Letter' },
                { icon: HiShare, text: 'Email Demand Letter' },
                { icon: HiPrinter, text: 'Print Payment Schedule' },
                { icon: HiShare, text: 'Email Payment Schedule' },
                { icon: HiPrinter, text: 'Print Statement' },
                { icon: HiShare, text: 'Email Statement' },
                { icon: HiInformationCircle, text: 'Print Individual Demand' },
                { icon: HiInformationCircle, text: 'Email Individual Demand' },
                { icon: HiDocumentText, text: 'Cost Sheet' },
              ].map((item, index) => (
                <button key={index} className="w-full px-4 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-3 border-t border-gray-100">
                  <item.icon style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                  <span style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{item.text}</span>
                </button>
              ))}
              
              {/* Dropdown at bottom */}
              <div className="px-4 py-3 border-t border-gray-200">
                <select 
                  value={selectedOption} 
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                >
                  <option value="Regular">Regular</option>
                  <option value="All Inclusive">All Inclusive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
          
          {/* APPLICANT/CO-APPLICANT DETAILS Section */}
          <div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsApplicantDetailsExpanded(!isApplicantDetailsExpanded)}
              style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
            >
              <button className="mr-2 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                {isApplicantDetailsExpanded ? (
                  <HiMinus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                ) : (
                  <HiPlus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                )}
              </button>
              <h3
                className="font-bold border-b flex-1"
                style={{
                  color: '#8C8C8C',
                  fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                  borderBottomColor: '#616161',
                  borderBottomWidth: '0.1875rem',
                  paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                }}
              >
                APPLICANT/CO-APPLICANT DETAILS
              </h3>
            </div>
            
            {isApplicantDetailsExpanded && (
              <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
                {/* CUSTOMER INFORMATION */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="flex justify-between items-center font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>CUSTOMER INFORMATION</span>
                    {editingSection === 'customer' ? (
                      <div style={{ display: 'flex', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <button 
                          onClick={() => handleSaveClick('customer')}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <HiCheckCircle style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <HiX style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick('customer')}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                      <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                    </button>
                    )}
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Name', field: 'name' },
                      { label: 'Contact No.', field: 'contactNo' },
                      { label: 'PAN No', field: 'panNo' },
                      { label: 'Address', field: 'address' },
                      { label: 'Father/Husband', field: 'fatherHusband' },
                      { label: 'Email', field: 'email' },
                      { label: 'DOB', field: 'dob' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                        {editingSection === 'customer' ? (
                          <input
                            type="text"
                            value={editData[item.field] || ''}
                            onChange={(e) => handleInputChange(item.field, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', width: '100%', maxWidth: 'clamp(12rem, 16rem, 20rem)' }}
                          />
                        ) : (
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', wordBreak: 'break-word' }}>
                            {flatData.customerInfo[item.field]}
                        </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CO-APPLICANT INFORMATION */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="flex justify-between items-center font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>CO-APPLICANT INFORMATION</span>
                    {editingSection === 'coApplicant' ? (
                    <div style={{ display: 'flex', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <button 
                          onClick={() => handleSaveClick('coApplicant')}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <HiCheckCircle style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <HiX style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <button 
                          onClick={() => handleEditClick('coApplicant')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                        <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                      </button>
                        {flatData.coApplicantInfo.name && (
                          <button 
                            onClick={handleDeleteCoApplicant}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                        <HiTrash style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                      </button>
                        )}
                    </div>
                    )}
                  </div>
                  <div className="space-y-0">
                    {!editingSection && !flatData.coApplicantInfo.name ? (
                      /* Show add button when no co-applicant info exists */
                      <div className="flex items-center justify-center py-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="text-center">
                          <span className="text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                            If you want to add co-applicant{' '}
                            <button 
                              onClick={() => handleEditClick('coApplicant')}
                              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                            >
                              Click Here
                            </button>
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Show form fields when editing or when data exists */
                      <>
                        {[
                          { label: 'Co-Applicant Name', field: 'name' },
                          { label: 'Contact No.', field: 'contactNo' },
                          { label: 'PAN No', field: 'panNo' },
                          { label: 'Address', field: 'address' },
                          { label: 'Father/Husband', field: 'fatherHusband' },
                          { label: 'Email', field: 'email' },
                          { label: 'DOB', field: 'dob' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                            {editingSection === 'coApplicant' ? (
                              <input
                                type="text"
                                value={editData[item.field] || ''}
                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', width: '100%', maxWidth: 'clamp(12rem, 16rem, 20rem)' }}
                              />
                            ) : (
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', wordBreak: 'break-word' }}>
                                {flatData.coApplicantInfo[item.field] || '-'}
                        </span>
                            )}
                      </div>
                    ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FLAT DETAILS Section */}
          <div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsFlatDetailsExpanded(!isFlatDetailsExpanded)}
              style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
            >
              <button className="mr-2 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                {isFlatDetailsExpanded ? (
                  <HiMinus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                ) : (
                  <HiPlus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                )}
              </button>
              <h3
                className="font-bold border-b flex-1"
                style={{
                  color: '#8C8C8C',
                  fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                  borderBottomColor: '#616161',
                  borderBottomWidth: '0.1875rem',
                  paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                }}
              >
                FLAT DETAILS
              </h3>
            </div>
            
            {isFlatDetailsExpanded && (
              <div className="grid grid-cols-1 xl:grid-cols-2" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
                {/* FLAT DETAILS - Left Column */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="flex justify-between items-center font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>FLAT DETAILS</span>
                    {editingSection === 'flatInfo' ? (
                      <div style={{ display: 'flex', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <button 
                          onClick={() => handleSaveClick('flatInfo')}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <HiCheckCircle style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <HiX style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick('flatInfo')}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                      <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                    </button>
                    )}
                  </div>
                  
                  {editingSection === 'flatInfo' ? (
                    // Edit Mode - Show the fields from the image
                    <div className="space-y-4">
                      {/* Flat Details Fields */}
                      <div className="space-y-3">
                        {[
                          { label: 'Dealer', field: 'dealer' },
                          { label: 'Booking Date', field: 'bookingDate' },
                          { label: 'Payment Plan', field: 'paymentPlan' },
                          { label: 'Company Rate', field: 'companyRate' },
                          { label: 'Login Rate', field: 'loginRate' },
                          { label: 'Scheme', field: 'scheme' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-1/3">
                              <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                                {item.label}:
                              </label>
                            </div>
                            <div className="w-2/3">
                              {item.field === 'paymentPlan' ? (
                                <select
                                  value={editData[item.field] || ''}
                                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                                >
                                  <option value="CLP">CLP</option>
                                  <option value="EMI">EMI</option>
                                </select>
                              ) : item.field === 'bookingDate' ? (
                                <input
                                  type="date"
                                  value={editData[item.field] || ''}
                                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={editData[item.field] || ''}
                                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // View Mode - Show original fields
                  <div className="space-y-0">
                    {[
                        { label: 'Area', field: 'area' },
                        { label: 'Booking Date', field: 'bookingDate' },
                        { label: 'Payment Plan', field: 'paymentPlan' },
                        { label: 'Channel Partner', field: 'channelPartner' },
                        { label: 'Total Cost', field: 'totalCost' },
                        { label: 'Total Booking Amount', field: 'totalBookingAmount' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                          {item.field === 'channelPartner' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleChannelPartnerClick}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                style={{ 
                                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                                  fontWeight: '400',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {flatData.flatInfo.channelPartner.replace(' (Change)', '')}
                              </button>
                              <button
                                onClick={handleChangeChannelPartnerClick}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                style={{ 
                                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                                  fontWeight: '400'
                                }}
                              >
                                (Change)
                              </button>
                            </div>
                          ) : (
                        <span 
                          style={{ 
                            fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                                color: '#000000', 
                            fontWeight: '400',
                            wordBreak: 'break-word'
                          }}
                        >
                              {flatData.flatInfo[item.field]}
                        </span>
                          )}
                      </div>
                    ))}
                  </div>
                  )}
                </div>

                {/* APPLICABLE PLC AND CHARGES - Right Column */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>APPLICABLE PLC:</span>
                  </div>
                  
                  {editingSection === 'flatInfo' ? (
                    // Edit Mode - Show the PLC charges fields from the image
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { label: 'Ground', field: 'ground' },
                          { label: 'Amenities', field: 'amenities' },
                          { label: 'Corpus Fund', field: 'corpusFund' },
                          { label: 'EWSW', field: 'ewsw' },
                          { label: 'HMWSSB', field: 'hmwssb' },
                          { label: 'Home Automation', field: 'homeAutomation' },
                          { label: 'Maintenance for 1st year', field: 'maintenance1stYear' },
                          { label: 'Maintenance for 2nd year', field: 'maintenance2ndYear' },
                          { label: 'Single Car Parking', field: 'singleCarParking' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-1/3">
                              <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                                {item.label}:
                              </label>
                            </div>
                            <div className="w-2/3">
                              <input
                                type="text"
                                value={editData[item.field] || ''}
                                onChange={(e) => handleInputChange(item.field, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // View Mode - Show original charges
                  <div className="space-y-0">
                    {[
                        { label: 'Extra Charges', field: 'extraCharges' },
                        { label: 'Due Amount', field: 'dueAmount' },
                        { label: 'Paid Amount', field: 'paidAmount' },
                        { label: 'Pending Amount', field: 'pendingAmount' },
                        { label: 'Due Tax', field: 'dueTax' },
                        { label: 'Paid Tax', field: 'paidTax' },
                        { label: 'Cleared Tax', field: 'clearedTax' },
                        { label: 'Pending Tax', field: 'pendingTax' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                          <div className="relative group">
                        <span 
                          style={{ 
                            fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                                color: item.field === 'extraCharges' && flatData.charges.extraCharges ? '#2563eb' : '#000000', 
                            fontWeight: '400',
                                cursor: item.field === 'extraCharges' ? 'pointer' : 'default',
                            wordBreak: 'break-word'
                          }}
                              className={item.field === 'extraCharges' ? 'hover:underline' : ''}
                              onMouseEnter={() => item.field === 'extraCharges' && setShowChargesPopup(true)}
                              onMouseLeave={() => item.field === 'extraCharges' && setShowChargesPopup(false)}
                            >
                              {flatData.charges[item.field]}
                            </span>
                            
                            {/* Popup for Extra Charges */}
                            {item.field === 'extraCharges' && showChargesPopup && (
                              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl z-50" style={{ minWidth: 'clamp(15rem, 18rem, 20rem)', padding: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
                                <div className="font-bold text-gray-800 mb-3" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                                  Applicable Charges
                                </div>
                                <div className="space-y-2">
                                  {applicableCharges.map((charge, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                                      <span className="text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                                        {charge.name}
                                      </span>
                                      <span className="text-gray-900 font-semibold" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                                        {charge.rate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* PAYMENT INFORMATION Section */}
          <div>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsPaymentInfoExpanded(!isPaymentInfoExpanded)}
              style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
            >
              <button className="mr-2 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                {isPaymentInfoExpanded ? (
                  <HiMinus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                ) : (
                  <HiPlus style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-gray-600" />
                )}
              </button>
              <h3
                className="font-bold border-b flex-1"
                style={{
                  color: '#8C8C8C',
                  fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                  borderBottomColor: '#616161',
                  borderBottomWidth: '0.1875rem',
                  paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                }}
              >
                PAYMENT INFORMATION
              </h3>
            </div>
            
            {isPaymentInfoExpanded && (
              <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                {/* Desktop Table Headers - Hidden on mobile */}
                <div
                  className="hidden lg:grid border-b sticky top-0 z-10 bg-gray-100"
                  style={{ 
                    gridTemplateColumns: '0.5fr 0.8fr 1fr 1fr 1.2fr 0.8fr 1fr 1fr 1fr 1fr 0.6fr 0.8fr 1.8fr',
                    gap: 'clamp(0.25rem, 0.5rem, 0.75rem)',
                    paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)',
                    paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem'
                  }}
                >
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
                    SR. No
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
                    Cheque Count
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Cheque No.
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'right' }}>
                    Amount
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    On Account Of
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Bank
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Cheque Date
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Cheque Status
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Clearing Date
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Remarks
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
                    Account
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
                    Updated By
                  </div>
                  <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
                    Action
                  </div>
                </div>

                {/* Desktop Table Rows */}
                <div className="hidden lg:block space-y-0">
                  {flatData.paymentInfo.map((payment, index) => (
                    <div
                      key={index}
                      className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                      style={{ 
                        gridTemplateColumns: '0.5fr 0.8fr 1fr 1fr 1.2fr 0.8fr 1fr 1fr 1fr 1fr 0.6fr 0.8fr 1.8fr',
                        gap: 'clamp(0.25rem, 0.5rem, 0.75rem)',
                        paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
                        paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)'
                      }}
                    >
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400', textAlign: 'center' }}>
                        {payment.srNo}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400', textAlign: 'center' }}>
                        {payment.chequeCount}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.chequeNo}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400', textAlign: 'right' }}>
                        {payment.amount}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.onAccountOf}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.bank}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.chequeDate}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.chequeStatus}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.clearingDate}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.remarks || '-'}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400', textAlign: 'center' }}>
                        {payment.account}
                      </div>
                      <div style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', color: '#000000', fontWeight: '400' }}>
                        {payment.updatedBy}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}>
                        {editingPaymentIndex === index ? (
                          <>
                            {/* Save Icon */}
                            <div className="relative group">
                              <button 
                                onClick={handlePaymentSaveClick}
                                className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                                <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Save
                              </div>
                            </div>
                            
                            {/* Cancel Icon */}
                            <div className="relative group">
                              <button 
                                onClick={handleCancelEdit}
                                className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                                <HiX style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Cancel
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                        {/* Delete Icon */}
                        <div className="relative group">
                              <button 
                                onClick={() => handlePaymentDelete(index)}
                                className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                            <HiTrash style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Delete
                          </div>
                        </div>
                        
                        {/* Edit Icon */}
                        <div className="relative group">
                              <button 
                                onClick={() => handlePaymentEditClick(index, payment)}
                                className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                            <HiPencil style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-blue-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Edit
                          </div>
                        </div>
                        
                        {/* Verify Icon */}
                        <div className="relative group">
                              <button 
                                onClick={() => handlePaymentVerify(index)}
                                className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                            <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Verify
                          </div>
                        </div>
                        
                        {/* Receipt Icon */}
                        <div className="relative group">
                              <button 
                                onClick={() => handlePaymentReceipt(index)}
                                className="flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" 
                                style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              >
                            <HiReceiptTax style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-purple-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Receipt
                          </div>
                        </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Payment Cards */}
                <div className="lg:hidden space-y-3">
                  {flatData.paymentInfo.map((payment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                            Payment #{payment.srNo}
                          </h3>
                          <p className="text-gray-600" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                            Cheque: {payment.chequeNo}
                          </p>
                        </div>
                        <span
                          style={{
                            backgroundColor: payment.chequeStatus === 'CLEARED' ? '#E4FFE5' : '#FFEBEB',
                            color: payment.chequeStatus === 'CLEARED' ? '#16A34A' : '#DC2626',
                            padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                            borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                            fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                            fontWeight: '500',
                          }}
                        >
                          {payment.chequeStatus}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Amount:</span>
                          <span className="text-gray-900 font-medium" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>₹{payment.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Account:</span>
                          <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{payment.onAccountOf}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Bank:</span>
                          <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{payment.bank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Date:</span>
                          <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{payment.chequeDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Updated By:</span>
                          <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{payment.updatedBy}</span>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
                        {editingPaymentIndex === index ? (
                          <>
                            <button 
                              onClick={handlePaymentSaveClick}
                              className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Save"
                            >
                              <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Cancel"
                            >
                              <HiX style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handlePaymentDelete(index)}
                              className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Delete"
                            >
                          <HiTrash style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                        </button>
                            <button 
                              onClick={() => handlePaymentEditClick(index, payment)}
                              className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Edit"
                            >
                          <HiPencil style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-blue-600" />
                        </button>
                            <button 
                              onClick={() => handlePaymentVerify(index)}
                              className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Verify"
                            >
                          <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                        </button>
                            <button 
                              onClick={() => handlePaymentReceipt(index)}
                              className="flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" 
                              style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                              title="Receipt"
                            >
                          <HiReceiptTax style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-purple-600" />
                        </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Channel Partner Change Popup */}
      {showChannelPartnerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="channel-partner-popup bg-white rounded-lg shadow-xl max-w-md w-full mx-4" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
                Change Channel Partner
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Flat No. */}
              <div className="flex items-center bg-blue-50 rounded-lg p-3">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    Flat No.:
                  </label>
                </div>
                <div className="w-2/3">
                  <input
                    type="text"
                    value={channelPartnerData.flatNo}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                  />
                </div>
              </div>

              {/* Old Channel Partner */}
              <div className="flex items-center bg-blue-50 rounded-lg p-3">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    Old Channel Partner:
                  </label>
                </div>
                <div className="w-2/3">
                  <input
                    type="text"
                    value={channelPartnerData.oldChannelPartner}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                  />
                </div>
              </div>

              {/* New Channel Partner */}
              <div className="flex items-center bg-white rounded-lg p-3 border border-gray-300">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    New Channel Partner:
                  </label>
                </div>
                <div className="w-2/3 relative">
                  <input
                    type="text"
                    value={channelPartnerData.newChannelPartner}
                    onChange={(e) => handleChannelPartnerInputChange('newChannelPartner', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                    placeholder="Select new partner"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleChannelPartnerChange}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              >
                Change
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseChannelPartnerPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Flat;

