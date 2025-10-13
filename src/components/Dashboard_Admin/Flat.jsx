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

  useEffect(() => {
    // Load flat data from sessionStorage or API
    const loadFlatData = async () => {
      try {
        setLoading(true);
        const storedFlatData = sessionStorage.getItem('selectedFlat');
        let flatNo = 'A-101'; // Default flat number
        
        if (storedFlatData) {
          const parsedData = JSON.parse(storedFlatData);
          flatNo = parsedData.flatNo;
        }

        // Fetch detailed flat data from API
        const response = await fetchFlatDetailsAdmin(flatNo);
        if (response.success) {
          setFlatData(response.data);
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              onClick={() => onPageChange && onPageChange('overview')}
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
            <button className="px-4 py-2 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 transition-colors w-full lg:w-auto" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              Verified Flats
            </button>
            <button className="px-4 py-2 rounded-lg text-white font-medium bg-orange-600 hover:bg-orange-700 transition-colors w-full lg:w-auto" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              Revert BBA
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
                    <button className="text-blue-500 hover:text-blue-700 transition-colors" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                      <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                    </button>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Name', value: flatData.customerInfo.name },
                      { label: 'Contact No.', value: flatData.customerInfo.contactNo },
                      { label: 'PAN No', value: flatData.customerInfo.panNo },
                      { label: 'Address', value: flatData.customerInfo.address },
                      { label: 'Father/Husband', value: flatData.customerInfo.fatherHusband },
                      { label: 'Email', value: flatData.customerInfo.email },
                      { label: 'DOB', value: flatData.customerInfo.dob },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', wordBreak: 'break-word' }}>
                          {item.value}
                        </span>
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
                    <div style={{ display: 'flex', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                      <button className="text-blue-500 hover:text-blue-700 transition-colors" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                        <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                        <HiTrash style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Co-Applicant Name', value: flatData.coApplicantInfo.name },
                      { label: 'Contact No.', value: flatData.coApplicantInfo.contactNo },
                      { label: 'PAN No', value: flatData.coApplicantInfo.panNo },
                      { label: 'Address', value: flatData.coApplicantInfo.address },
                      { label: 'Father/Husband', value: flatData.coApplicantInfo.fatherHusband },
                      { label: 'Email', value: flatData.coApplicantInfo.email },
                      { label: 'DOB', value: flatData.coApplicantInfo.dob },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', wordBreak: 'break-word' }}>
                          {item.value || '-'}
                        </span>
                      </div>
                    ))}
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
                {/* FLAT INFORMATION */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="flex justify-between items-center font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>FLAT INFORMATION</span>
                    <button className="text-blue-500 hover:text-blue-700 transition-colors" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                      <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                    </button>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Area', value: flatData.flatInfo.area },
                      { label: 'Booking Date', value: flatData.flatInfo.bookingDate },
                      { label: 'Payment Plan', value: flatData.flatInfo.paymentPlan },
                      { label: 'Channel Partner', value: flatData.flatInfo.channelPartner, isLink: true },
                      { label: 'Total Cost', value: flatData.flatInfo.totalCost },
                      { label: 'Total Booking Amount', value: flatData.flatInfo.totalBookingAmount },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                        <span 
                          style={{ 
                            fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                            color: item.isLink ? '#2563eb' : '#000000', 
                            fontWeight: '400',
                            cursor: item.isLink ? 'pointer' : 'default',
                            wordBreak: 'break-word'
                          }}
                          className={item.isLink ? 'hover:underline' : ''}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHARGES */}
                <div className="border border-gray-200 bg-gray-50" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
                  <div className="flex justify-between items-center font-bold border-b" style={{
                    color: '#8C8C8C',
                    fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                    borderBottomColor: '#616161',
                    borderBottomWidth: '0.1875rem',
                    marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
                    paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  }}>
                    <span>CHARGES</span>
                    <button className="text-blue-500 hover:text-blue-700 transition-colors" style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                      <HiPencil style={{ width: 'clamp(0.9rem, 1rem, 1.1rem)', height: 'clamp(0.9rem, 1rem, 1.1rem)' }} />
                    </button>
                  </div>
                  <div className="space-y-0">
                    {[
                      { label: 'Extra Charges', value: flatData.charges.extraCharges, isLink: true },
                      { label: 'Due Amount', value: flatData.charges.dueAmount },
                      { label: 'Paid Amount', value: flatData.charges.paidAmount },
                      { label: 'Pending Amount', value: flatData.charges.pendingAmount },
                      { label: 'Due Tax', value: flatData.charges.dueTax },
                      { label: 'Paid Tax', value: flatData.charges.paidTax },
                      { label: 'Cleared Tax', value: flatData.charges.clearedTax },
                      { label: 'Pending Tax', value: flatData.charges.pendingTax },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 last:border-b-0"
                        style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)', gap: 'clamp(0.25rem, 0.5rem, 0.75rem)' }}
                      >
                        <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                          {item.label}:
                        </span>
                        <span 
                          style={{ 
                            fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', 
                            color: item.isLink ? '#2563eb' : '#000000', 
                            fontWeight: '400',
                            cursor: item.isLink ? 'pointer' : 'default',
                            wordBreak: 'break-word'
                          }}
                          className={item.isLink ? 'hover:underline' : ''}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
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
                        {/* Delete Icon */}
                        <div className="relative group">
                          <button className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                            <HiTrash style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Delete
                          </div>
                        </div>
                        
                        {/* Edit Icon */}
                        <div className="relative group">
                          <button className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                            <HiPencil style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-blue-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Edit
                          </div>
                        </div>
                        
                        {/* Verify Icon */}
                        <div className="relative group">
                          <button className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                            <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Verify
                          </div>
                        </div>
                        
                        {/* Receipt Icon */}
                        <div className="relative group">
                          <button className="flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                            <HiReceiptTax style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-purple-600" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Receipt
                          </div>
                        </div>
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
                        <button className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                          <HiTrash style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-red-600" />
                        </button>
                        <button className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                          <HiPencil style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-blue-600" />
                        </button>
                        <button className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                          <HiCheckCircle style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-green-600" />
                        </button>
                        <button className="flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" style={{ width: 'clamp(1.5rem, 2rem, 2.5rem)', height: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                          <HiReceiptTax style={{ width: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(0.75rem, 1rem, 1.25rem)' }} className="text-purple-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Flat;

