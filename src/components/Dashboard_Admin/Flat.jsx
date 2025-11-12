  const individualDemandStageOptions = [
    {
      id: 'bookingAdvance',
      label: 'Booking Advance',
      percentage: '10%',
      installmentAmount: 805020,
      tdsGhpl: 37891,
      tdsOrchid: 2249,
      gstGhpl: 52528,
      gstOrchid: 14993
    },
    {
      id: 'agreementOfSale',
      label: 'At the time of Agreement of Sale',
      percentage: '20%',
      installmentAmount: 1610040,
      tdsGhpl: 75600,
      tdsOrchid: 4500,
      gstGhpl: 105056,
      gstOrchid: 29986
    },
    {
      id: 'completion5thSlab',
      label: 'Completion of 5th Slab',
      percentage: '25%',
      installmentAmount: 2012550,
      tdsGhpl: 94500,
      tdsOrchid: 5625,
      gstGhpl: 131320,
      gstOrchid: 37500
    },
    {
      id: 'firstStageInternal',
      label: 'Completion of First Stage of Internal works',
      percentage: '5%',
      installmentAmount: 402510,
      tdsGhpl: 18900,
      tdsOrchid: 1125,
      gstGhpl: 26264,
      gstOrchid: 7497
    }
  ];

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiChevronLeft, HiPlus, HiMinus, HiDotsVertical, HiTrash, HiPencil, HiCheckCircle, HiReceiptTax, HiCog, HiMenu, HiX, HiLightningBolt, HiBell, HiFolder, HiEye, HiRefresh, HiDocumentText, HiCurrencyRupee, HiPrinter, HiShare, HiInformationCircle, HiDocument, HiKey, HiArrowUp, HiArrowDown, HiXCircle, HiArrowRight, HiDeviceMobile } from 'react-icons/hi';
import { fetchFlatDetailsAdmin } from '../../api/mockData';
import UploadDocumentPopup from './UploadDocumentPopup';
import DemandLetter from '../Template/DemandLetter';
import PaymentSchedule from '../Template/PaymentSchedule';
import PrintStatement from '../Template/PrintStatement';
import IndividualDemand from '../Template/IndividualDemand';
import Reciept from '../Template/Reciept';

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
  const [showPaymentEditModal, setShowPaymentEditModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  
  // Hover popup state
  const [showChargesPopup, setShowChargesPopup] = useState(false);
  
  // Channel partner popup state
  const [showChannelPartnerPopup, setShowChannelPartnerPopup] = useState(false);
  const [channelPartnerData, setChannelPartnerData] = useState({
    flatNo: '',
    oldChannelPartner: '',
    newChannelPartner: ''
  });

  // SMS popup state
  const [showSMSPopup, setShowSMSPopup] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');

  // Shift Flat popup state
  const [showShiftFlatPopup, setShowShiftFlatPopup] = useState(false);
  const [shiftFlatData, setShiftFlatData] = useState({
    oldFlatNo: '',
    newTower: '',
    newFlat: ''
  });

  // Cancel Flat popup state
  const [showCancelFlatPopup, setShowCancelFlatPopup] = useState(false);
  const [cancelFlatData, setCancelFlatData] = useState({
    cancellationDate: '',
    remarks: ''
  });

  // Reset Password popup state
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    password: '',
    confirmPassword: ''
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

  // Login enabled/disabled state
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);

  // Add Remarks popup state
  const [showAddRemarksPopup, setShowAddRemarksPopup] = useState(false);
  const [showUploadDocumentsPopup, setShowUploadDocumentsPopup] = useState(false);
  const [showDemandLetterModal, setShowDemandLetterModal] = useState(false);
  const [showPaymentScheduleModal, setShowPaymentScheduleModal] = useState(false);
  const [showPrintStatementModal, setShowPrintStatementModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showIndividualDemandModal, setShowIndividualDemandModal] = useState(false);
  const [selectedIndividualStages, setSelectedIndividualStages] = useState([]);
  const [individualDemandStep, setIndividualDemandStep] = useState('selection');
  const [remarkType, setRemarkType] = useState(''); // 'comment' or 'customerNotification'
  const [commentVisibility, setCommentVisibility] = useState(''); // 'public' or 'confidential'
  const [remarkText, setRemarkText] = useState('');
  const [receiptData, setReceiptData] = useState(null);

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
      if (!event.target.closest('.sms-popup') && showSMSPopup) {
        handleCloseSMSPopup();
      }
      if (!event.target.closest('.shift-flat-popup') && showShiftFlatPopup) {
        handleCloseShiftFlatPopup();
      }
      if (!event.target.closest('.cancel-flat-popup') && showCancelFlatPopup) {
        handleCloseCancelFlatPopup();
      }
      if (!event.target.closest('.reset-password-popup') && showResetPasswordPopup) {
        handleCloseResetPasswordPopup();
      }
      if (!event.target.closest('.add-remarks-popup') && showAddRemarksPopup) {
        handleCloseAddRemarksPopup();
      }
      if (!event.target.closest('.upload-documents-popup') && showUploadDocumentsPopup) {
        handleCloseUploadDocumentsPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChannelPartnerPopup, isVerificationPopupClicked, showSMSPopup, showShiftFlatPopup, showCancelFlatPopup, showResetPasswordPopup, showAddRemarksPopup, showUploadDocumentsPopup]);

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
    setEditingPayment({ index, ...payment });
    setShowPaymentEditModal(true);
  };

  const handlePaymentSaveClick = (updatedData) => {
    if (editingPayment !== null) {
      const updatedFlatData = { ...flatData };
      updatedFlatData.paymentInfo[editingPayment.index] = { ...updatedFlatData.paymentInfo[editingPayment.index], ...updatedData };
      setFlatData(updatedFlatData);
      setShowPaymentEditModal(false);
      setEditingPayment(null);
      
      // In a real app, you would send the updated payment data to the API here
      console.log('Saving payment data:', updatedData);
      alert('Payment information updated successfully!');
    }
  };

  const handleClosePaymentEditModal = () => {
    setShowPaymentEditModal(false);
    setEditingPayment(null);
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
    const payment = flatData.paymentInfo?.[index];
    const details = buildReceiptData(payment);
    setReceiptData(details);
    setShowReceiptModal(true);
  };
  
  const handleCloseReceipt = () => {
    setShowReceiptModal(false);
    setReceiptData(null);
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

  // SMS handlers
  const handleSendSMSClick = () => {
    setIsQuickAccessOpen(false);
    setShowSMSPopup(true);
    setSmsMessage('');
  };

  const handleSMSSubmit = () => {
    if (!smsMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    // TODO: Implement SMS sending API call
    console.log('Sending SMS:', {
      flatNo: flatData.flatNo,
      message: smsMessage
    });

    alert('SMS sent successfully!');
    handleCloseSMSPopup();
  };

  const handleCloseSMSPopup = () => {
    setShowSMSPopup(false);
    setSmsMessage('');
  };

  // Shift Flat handlers
  const handleShiftFlatClick = () => {
    setIsQuickAccessOpen(false);
    setShowShiftFlatPopup(true);
    setShiftFlatData({
      oldFlatNo: flatData?.flatNo || '',
      newTower: '',
      newFlat: ''
    });
  };

  const handleShiftFlatInputChange = (field, value) => {
    setShiftFlatData(prev => ({ ...prev, [field]: value }));
  };

  const handleShiftFlatSubmit = () => {
    if (!shiftFlatData.newTower.trim() || !shiftFlatData.newFlat.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // TODO: Implement shift flat API call
    console.log('Shifting flat:', {
      oldFlatNo: shiftFlatData.oldFlatNo,
      newTower: shiftFlatData.newTower,
      newFlat: shiftFlatData.newFlat
    });

    alert('Flat shifted successfully!');
    handleCloseShiftFlatPopup();
  };

  const handleCloseShiftFlatPopup = () => {
    setShowShiftFlatPopup(false);
    setShiftFlatData({
      oldFlatNo: '',
      newTower: '',
      newFlat: ''
    });
  };

  // Cancel Flat handlers
  const handleCancelFlatClick = () => {
    setIsQuickAccessOpen(false);
    setShowCancelFlatPopup(true);
    setCancelFlatData({
      cancellationDate: '',
      remarks: ''
    });
    // Debug: Log customerInfo to check kycId
    console.log('Flat data on cancel click:', flatData);
    console.log('Customer info:', flatData?.customerInfo);
    console.log('KYC ID:', flatData?.customerInfo?.kycId);
  };

  const handleCancelFlatInputChange = (field, value) => {
    setCancelFlatData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelFlatSubmit = () => {
    if (!cancelFlatData.remarks.trim()) {
      alert('Please enter remarks');
      return;
    }

    if (!cancelFlatData.cancellationDate.trim()) {
      alert('Please select cancellation date');
      return;
    }

    // TODO: Implement cancel flat API call
    console.log('Cancelling flat:', {
      flatNo: flatData?.flatNo,
      cancellationDate: cancelFlatData.cancellationDate,
      remarks: cancelFlatData.remarks
    });

    alert('Flat cancelled successfully!');
    handleCloseCancelFlatPopup();
  };

  const handleCloseCancelFlatPopup = () => {
    setShowCancelFlatPopup(false);
    setCancelFlatData({
      cancellationDate: '',
      remarks: ''
    });
  };

  // Reset Password handlers
  const handleResetPasswordClick = () => {
    setIsQuickAccessOpen(false);
    setShowResetPasswordPopup(true);
    setResetPasswordData({
      password: '',
      confirmPassword: ''
    });
  };

  const handleResetPasswordInputChange = (field, value) => {
    setResetPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleResetPasswordSubmit = () => {
    if (!resetPasswordData.password.trim()) {
      alert('Please enter password');
      return;
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      alert('Password and confirm password do not match');
      return;
    }

    if (resetPasswordData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // TODO: Implement reset password API call
    console.log('Resetting password for flat:', {
      flatNo: flatData?.flatNo,
      password: resetPasswordData.password
    });

    alert('Password reset successfully!');
    handleCloseResetPasswordPopup();
  };

  const handleCloseResetPasswordPopup = () => {
    setShowResetPasswordPopup(false);
    setResetPasswordData({
      password: '',
      confirmPassword: ''
    });
  };

  // Enable/Disable Login handler
  const handleToggleLogin = () => {
    setIsQuickAccessOpen(false);
    const newState = !isLoginEnabled;
    setIsLoginEnabled(newState);
    
    // TODO: Implement API call to enable/disable login
    console.log(`${newState ? 'Enabling' : 'Disabling'} login for flat:`, flatData?.flatNo);
    
    alert(`Login ${newState ? 'enabled' : 'disabled'} successfully!`);
  };

  // Add Remarks handlers
  const handleAddRemarksClick = () => {
    setIsMenuOpen(false);
    setShowAddRemarksPopup(true);
    setRemarkType('');
    setCommentVisibility('');
    setRemarkText('');
  };

  const handleRemarkTypeChange = (type) => {
    setRemarkType(type);
    setCommentVisibility('');
    setRemarkText('');
  };

  const handleCommentVisibilityChange = (visibility) => {
    setCommentVisibility(visibility);
  };

  const handleAddRemarksSubmit = () => {
    if (!remarkType) {
      alert('Please select a remark type');
      return;
    }

    if (!remarkText.trim()) {
      alert('Please enter remark');
      return;
    }

    if (remarkType === 'comment' && !commentVisibility) {
      alert('Please select comment visibility');
      return;
    }

    // TODO: Implement API call to add remark
    console.log('Adding remark:', {
      flatNo: flatData?.flatNo,
      remarkType,
      commentVisibility: remarkType === 'comment' ? commentVisibility : null,
      remark: remarkText
    });

    alert('Remark added successfully!');
    handleCloseAddRemarksPopup();
  };

  const handleCloseAddRemarksPopup = () => {
    setShowAddRemarksPopup(false);
    setRemarkType('');
    setCommentVisibility('');
    setRemarkText('');
  };

  // Upload Documents handler
  const handleUploadDocumentsClick = () => {
    setIsMenuOpen(false);
    setShowUploadDocumentsPopup(true);
  };

  const handleCloseUploadDocumentsPopup = () => {
    setShowUploadDocumentsPopup(false);
  };

  // Demand Letter handler
  const handleOpenDemandLetter = () => {
    setIsMenuOpen(false);
    setIsQuickAccessOpen(false);
    setShowDemandLetterModal(true);
  };

  const handleCloseDemandLetter = () => {
    setShowDemandLetterModal(false);
  };

  const handleOpenPaymentSchedule = () => {
    setIsMenuOpen(false);
    setIsQuickAccessOpen(false);
    setShowPaymentScheduleModal(true);
  };

  const handleClosePaymentSchedule = () => {
    setShowPaymentScheduleModal(false);
  };

  const handleOpenPrintStatement = () => {
    setIsMenuOpen(false);
    setIsQuickAccessOpen(false);
    setShowPrintStatementModal(true);
  };

  const handleClosePrintStatement = () => {
    setShowPrintStatementModal(false);
  };

  const handleOpenIndividualDemand = () => {
    setIsMenuOpen(false);
    setIsQuickAccessOpen(false);
    setSelectedIndividualStages([]);
    setIndividualDemandStep('selection');
    setShowIndividualDemandModal(true);
  };

  const handleCloseIndividualDemand = () => {
    setShowIndividualDemandModal(false);
    setSelectedIndividualStages([]);
    setIndividualDemandStep('selection');
  };

  // View Documents handler - Navigate to FlatDocs with pre-selected flat
  const handleViewDocumentsClick = () => {
    setIsQuickAccessOpen(false);
    // Store current flat number and block in sessionStorage for FlatDocs page
    if (flatData?.flatNo) {
      // Get block directly from flatData (it's stored separately)
      const block = flatData.block || (flatData.flatNo.match(/^([A-Z])/)?.[1] || 'A');
      
      // Extract flat number (remove block prefix and hyphen if present)
      // flatNo might be "A-101" or "A101", we need just "101"
      let flatNo = flatData.flatNo.replace(/^[A-Z]-?/, '');
      
      console.log('Setting view flags for flat:', { 
        block, 
        flatNo, 
        originalFlatNo: flatData.flatNo,
        flatDataBlock: flatData.block 
      });
      
      // Store in sessionStorage for FlatDocs page
      sessionStorage.setItem('viewFlatNo', flatNo);
      sessionStorage.setItem('viewBlock', block);
      sessionStorage.setItem('viewFromFlat', 'true');
      // Store flat number for back navigation
      sessionStorage.setItem('flatNoForBack', flatData.flatNo);
      sessionStorage.setItem('fromFlatPage', 'true');
    }
    // Navigate to FlatDocs page
    if (onPageChange) {
      onPageChange('flatDocs');
    }
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

  const customerName = flatData.customerInfo?.name || '';
  const coApplicantName = flatData.coApplicantInfo?.name || '';
  const customerEmail = flatData.customerInfo?.email || '';

  const demandLetterData = {
    flatNo: flatData.flatNo || '',
    name: customerName,
    coApplicant: coApplicantName,
    email: customerEmail
  };

  const paymentScheduleData = {
    flatNo: flatData.flatNo || '',
    name: customerName,
    coApplicant: coApplicantName,
    email: customerEmail
  };

  const parseAmount = (value) => {
    const numeric = String(value ?? '0').replace(/[^0-9.]/g, '');
    return Number(numeric || 0);
  };

  const statementInfo = {
    customerName: customerName || '',
    fatherHusbandName: flatData.customerInfo?.fatherHusband || '',
    contactNo: flatData.customerInfo?.contactNo || '',
    coApplicant: coApplicantName || '',
    area: flatData.flatInfo?.area || '',
    paymentPlan: flatData.flatInfo?.paymentPlan || '',
    totalAmount: parseAmount(flatData.flatInfo?.totalCost),
    paidAmount: parseAmount(flatData.charges?.paidAmount),
    uniqueId: flatData.customerInfo?.kycId || '',
    date: new Date().toLocaleDateString('en-GB'),
    title: flatData.flatNo ? `Flat No:- ${flatData.flatNo}` : 'Payment Statement'
  };

  const statementRows = (flatData.paymentInfo || []).map((payment, index) => ({
    srNo: payment.srNo || index + 1,
    receiptNo: payment.receiptNo || `R${String(index + 1).padStart(4, '0')}`,
    chequeNo: payment.chequeNo || '-',
    amount: parseAmount(payment.amount),
    bank: payment.bank || '',
    chequeDate: payment.chequeDate || '',
    status: payment.chequeStatus || ''
  }));

  const sanitizedFlatNo = (flatData.flatNo || 'A1').replace(/-/g, '');

  const defaultReceiptData = {
    receiptNo: 'A1603',
    date: '23-11-2021',
    customerName: customerName || 'V.REVATHI',
    guardianName: flatData.customerInfo?.fatherHusband || 'V.RAMA MOHAN RAO',
    flatNo: sanitizedFlatNo || 'A1',
    address: flatData.customerInfo?.address || 'Flat No-16-104 Near Saibaba Temple, Huzusnagar, at Suryapet.',
    ghplAmount: 0,
    orchidAmount: 0,
    totalAmount: 0,
    chequeNo: '',
    bank: '',
    chequeDate: ''
  };

  const buildReceiptData = (payment) => {
    const baseDetails = { ...defaultReceiptData };

    if (!payment) {
      return {
        ...baseDetails,
        ghplAmount: 376500,
        orchidAmount: 223500,
        totalAmount: 600000,
        chequeNo: '000003',
        bank: 'HDFC',
        chequeDate: '20-11-2021'
      };
    }

    const rawAmount = parseAmount(payment.totalAmount ?? payment.amount ?? baseDetails.totalAmount);
    const receiptNo = payment.receiptNo || baseDetails.receiptNo;
    const chequeNo = payment.chequeNo || baseDetails.chequeNo;
    const bank = payment.bank || baseDetails.bank;
    const chequeDate = payment.chequeDate || baseDetails.chequeDate;
    const paymentDate = payment.receivingDate || chequeDate || baseDetails.date;

    let ghplAmount = baseDetails.ghplAmount;
    let orchidAmount = baseDetails.orchidAmount;

    if (payment.ghplAmount !== undefined || payment.orchidAmount !== undefined) {
      ghplAmount = payment.ghplAmount !== undefined ? parseAmount(payment.ghplAmount) : ghplAmount;
      orchidAmount = payment.orchidAmount !== undefined ? parseAmount(payment.orchidAmount) : orchidAmount;
    } else {
      const accountInfo = (payment.onAccountOf || '').toLowerCase();
      if (accountInfo.includes('ghpl') && accountInfo.includes('orchid')) {
        // Split equally only if both are mentioned but no explicit breakup provided
        ghplAmount = rawAmount ? rawAmount / 2 : ghplAmount;
        orchidAmount = rawAmount ? rawAmount / 2 : orchidAmount;
      } else if (accountInfo.includes('ghpl')) {
        ghplAmount = rawAmount || ghplAmount;
        orchidAmount = 0;
      } else if (accountInfo.includes('orchid')) {
        orchidAmount = rawAmount || orchidAmount;
        ghplAmount = 0;
      } else {
        ghplAmount = rawAmount || ghplAmount;
        orchidAmount = 0;
      }
    }

    const computedTotal = rawAmount || ghplAmount + orchidAmount;

    return {
      ...baseDetails,
      receiptNo,
      date: paymentDate || baseDetails.date,
      chequeNo,
      bank,
      chequeDate,
      ghplAmount,
      orchidAmount,
      totalAmount: computedTotal || baseDetails.totalAmount
    };
  };

  const individualDemandInfo = {
    customerName: customerName,
    coApplicant: coApplicantName,
    flatNo: flatData.flatNo || '',
    floor: flatData.flatInfo?.floor || '',
    block: flatData.flatInfo?.block || '',
    email: customerEmail
  };

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
                { icon: HiCheckCircle, text: isLoginEnabled ? 'Disable Login' : 'Enable Login', action: 'toggleLogin' },
                { icon: HiKey, text: 'Reset Password', action: 'resetPassword' },
                { icon: HiArrowUp, text: 'Transfer Flat' },
                { icon: HiXCircle, text: 'Cancel Flat', action: 'cancelFlat' },
                { icon: HiArrowRight, text: 'Shift Flat', action: 'shiftFlat' },
                { icon: HiDeviceMobile, text: 'Send SMS', action: 'sendSMS' },
              ].map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    if (item.action === 'sendSMS') {
                      handleSendSMSClick();
                    } else if (item.action === 'shiftFlat') {
                      handleShiftFlatClick();
                    } else if (item.action === 'cancelFlat') {
                      handleCancelFlatClick();
                    } else if (item.action === 'resetPassword') {
                      handleResetPasswordClick();
                    } else if (item.action === 'toggleLogin') {
                      handleToggleLogin();
                    }
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-600 transition-colors flex items-center gap-3 bg-gray-700 border-b border-gray-600 last:border-b-0"
                >
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
                { icon: HiFolder, text: 'Upload Documents', action: 'uploadDocuments' },
                { icon: HiEye, text: 'View Documents' },
                { icon: HiEye, text: 'View Legal Documents' },
                { icon: HiEye, text: 'Construction Stages Change' },
                { icon: HiRefresh, text: 'Construction Stages Reset' },
                { icon: HiDocumentText, text: 'Generate Receipt Number' },
                { icon: HiCurrencyRupee, text: 'Add Payment' },
                { icon: HiPlus, text: 'Add Remarks', action: 'addRemarks' },
                { icon: HiPrinter, text: 'Print Demand Letter', action: 'printDemandLetter' },
                { icon: HiShare, text: 'Email Demand Letter', action: 'emailDemandLetter' },
                { icon: HiPrinter, text: 'Print Payment Schedule', action: 'printPaymentSchedule' },
                { icon: HiShare, text: 'Email Payment Schedule', action: 'emailPaymentSchedule' },
                { icon: HiPrinter, text: 'Print Statement', action: 'printStatement' },
                { icon: HiShare, text: 'Email Statement', action: 'emailStatement' },
                { icon: HiInformationCircle, text: 'Print Individual Demand', action: 'printIndividualDemand' },
                { icon: HiInformationCircle, text: 'Email Individual Demand', action: 'emailIndividualDemand' },
                { icon: HiDocumentText, text: 'Cost Sheet' },
              ].map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => {
                    if (item.action === 'addRemarks') {
                      handleAddRemarksClick();
                    } else if (item.action === 'uploadDocuments') {
                      handleUploadDocumentsClick();
                    } else if (item.action === 'printDemandLetter' || item.action === 'emailDemandLetter') {
                      handleOpenDemandLetter();
                    } else if (item.action === 'printPaymentSchedule' || item.action === 'emailPaymentSchedule') {
                      handleOpenPaymentSchedule();
                    } else if (item.action === 'printStatement' || item.action === 'emailStatement') {
                      handleOpenPrintStatement();
                    } else if (item.action === 'printIndividualDemand' || item.action === 'emailIndividualDemand') {
                      handleOpenIndividualDemand();
                    } else if (item.text === 'View Documents') {
                      handleViewDocumentsClick();
                    } else if (item.text === 'View Legal Documents') {
                      // Similar handler for legal documents
                      setIsQuickAccessOpen(false);
                      // Store current flat number and block in sessionStorage for FlatLegalDocs page
                      if (flatData?.flatNo) {
                        // Get block directly from flatData (it's stored separately)
                        const block = flatData.block || (flatData.flatNo.match(/^([A-Z])/)?.[1] || 'A');
                        
                        // Extract flat number (remove block prefix and hyphen if present)
                        let flatNo = flatData.flatNo.replace(/^[A-Z]-?/, '');
                        
                        // Store in sessionStorage for FlatLegalDocs page
                        sessionStorage.setItem('viewFlatNo', flatNo);
                        sessionStorage.setItem('viewBlock', block);
                        sessionStorage.setItem('viewFromFlat', 'true');
                        sessionStorage.setItem('viewLegalDocs', 'true');
                        // Store flat number for back navigation
                        sessionStorage.setItem('flatNoForBack', flatData.flatNo);
                        sessionStorage.setItem('fromFlatPage', 'true');
                      }
                      if (onPageChange) {
                        onPageChange('flatLegalDocs');
                      }
                    }
                  }}
                  className="w-full px-4 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                >
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
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Send SMS Popup */}
      {showSMSPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="sms-popup bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
                Send SMS
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Message Field */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                  Enter Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', minHeight: '120px' }}
                  placeholder="Enter your message here..."
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSMSSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              >
                Submit
              </button>
              <button
                onClick={handleCloseSMSPopup}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              >
                Cancel
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseSMSPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Shift Flat Popup */}
      {showShiftFlatPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="shift-flat-popup bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
                Shift Flat
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Old Flat No. */}
              <div className="flex items-center bg-blue-50 rounded-lg p-3">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    Old Flat No.:
                  </label>
                </div>
                <div className="w-2/3">
                  <input
                    type="text"
                    value={shiftFlatData.oldFlatNo}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                  />
                </div>
              </div>

              {/* New Tower */}
              <div className="flex items-center bg-white rounded-lg p-3 border border-gray-300">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    New Tower <span className="text-red-500">*</span>:
                  </label>
                </div>
                <div className="w-2/3">
                  <input
                    type="text"
                    value={shiftFlatData.newTower}
                    onChange={(e) => handleShiftFlatInputChange('newTower', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                    placeholder="Enter new tower"
                    required
                  />
                </div>
              </div>

              {/* New Flat */}
              <div className="flex items-center bg-white rounded-lg p-3 border border-gray-300">
                <div className="w-1/3">
                  <label className="font-semibold text-gray-700" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                    New Flat <span className="text-red-500">*</span>:
                  </label>
                </div>
                <div className="w-2/3">
                  <input
                    type="text"
                    value={shiftFlatData.newFlat}
                    onChange={(e) => handleShiftFlatInputChange('newFlat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                    placeholder="Enter new flat number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleShiftFlatSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              >
                Submit
              </button>
              <button
                onClick={handleCloseShiftFlatPopup}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              >
                Cancel
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseShiftFlatPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Flat Popup */}
      {showCancelFlatPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="cancel-flat-popup bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 relative" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Cancellation for flat no {flatData?.flatNo}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCancelFlatSubmit(); }} className="space-y-3">
              {/* Grid Layout for Display Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">KYC Id</label>
                  <input
                    type="text"
                    value={flatData?.customerInfo?.kycId || flatData?.customerInfo?.panNo || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={flatData?.customerInfo?.name || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Dealer</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.channelPartner?.replace(' (Change)', '') || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Booking Date</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.bookingDate || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Payment Plan</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.paymentPlan || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Company Rate</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.companyRate || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Login Rate</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.loginRate || ''}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Scheme</label>
                  <input
                    type="text"
                    value={flatData?.flatInfo?.scheme || 'NSC'}
                    readOnly
                    className="w-full border rounded px-3 py-2 bg-gray-50 text-sm text-gray-600"
                  />
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Cancellation Date</label>
                  <input
                    type="date"
                    value={cancelFlatData.cancellationDate}
                    onChange={(e) => handleCancelFlatInputChange('cancellationDate', e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-700 mb-1">Remarks <span className="text-red-500">*</span></label>
                  <textarea
                    value={cancelFlatData.remarks}
                    onChange={(e) => handleCancelFlatInputChange('remarks', e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ minHeight: '80px' }}
                    placeholder="Enter remarks..."
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleCloseCancelFlatPopup}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseCancelFlatPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Popup */}
      {showResetPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="reset-password-popup bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Reset Password
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleResetPasswordSubmit(); }} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Enter Password</label>
                <input
                  type="password"
                  value={resetPasswordData.password}
                  onChange={(e) => handleResetPasswordInputChange('password', e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-700 mb-1">Enter Confirm Password</label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => handleResetPasswordInputChange('confirmPassword', e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCloseResetPasswordPopup}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseResetPasswordPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Add Remarks Popup */}
      {showAddRemarksPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="add-remarks-popup bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Add Remarks
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddRemarksSubmit(); }} className="space-y-4">
              {/* Remark Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Select Type:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remarkType"
                      value="comment"
                      checked={remarkType === 'comment'}
                      onChange={(e) => handleRemarkTypeChange('comment')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Comment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remarkType"
                      value="customerNotification"
                      checked={remarkType === 'customerNotification'}
                      onChange={(e) => handleRemarkTypeChange('customerNotification')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Customer Notification</span>
                  </label>
                </div>
              </div>

              {/* Comment Visibility (only shown when Comment is selected) */}
              {remarkType === 'comment' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Visibility:</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commentVisibility"
                        value="public"
                        checked={commentVisibility === 'public'}
                        onChange={(e) => handleCommentVisibilityChange('public')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commentVisibility"
                        value="confidential"
                        checked={commentVisibility === 'confidential'}
                        onChange={(e) => handleCommentVisibilityChange('confidential')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Confidential</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Enter Remark Field */}
              {(remarkType === 'comment' && commentVisibility) || remarkType === 'customerNotification' ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enter Remark <span className="text-red-500">*</span></label>
                  <textarea
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ minHeight: '100px' }}
                    placeholder="Enter remark..."
                    required
                  />
                </div>
              ) : null}

              {/* Action Buttons */}
              {(remarkType === 'comment' && commentVisibility) || remarkType === 'customerNotification' ? (
                <div className="flex justify-center gap-3 pt-3 border-t border-gray-200">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAddRemarksPopup}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseAddRemarksPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Demand Letter Modal */}
      {showDemandLetterModal && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDemandLetter();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">Demand Letter - {demandLetterData.flatNo}</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseDemandLetter();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{
                  zIndex: 100002,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <DemandLetter paymentData={demandLetterData} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Payment Schedule Modal */}
      {showPaymentScheduleModal && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePaymentSchedule();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">Payment Schedule - {paymentScheduleData.flatNo}</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClosePaymentSchedule();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{
                  zIndex: 100002,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <PaymentSchedule paymentData={paymentScheduleData} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Receipt Modal */}
      {showReceiptModal && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseReceipt();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">Payment Receipt - {receiptData?.flatNo || defaultReceiptData.flatNo}</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseReceipt();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{
                  zIndex: 100002,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <Reciept receiptData={receiptData || defaultReceiptData} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Print Statement Modal */}
      {showPrintStatementModal && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePrintStatement();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">Payment Statement - {statementInfo.uniqueId}</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClosePrintStatement();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{
                  zIndex: 100002,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <PrintStatement statementInfo={statementInfo} rows={statementRows} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Individual Demand Modal */}
      {showIndividualDemandModal && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseIndividualDemand();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">
                Individual Demand {individualDemandStep === 'selection' ? ' - Select Construction Stages' : ` - ${flatData.flatNo}`}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseIndividualDemand();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{
                  zIndex: 100002,
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              {individualDemandStep === 'selection' ? (
                <div>
                  <p className="font-medium mb-4 text-gray-700">Please select Installment stages</p>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm">
                          <th className="border border-gray-300 px-3 py-2 w-16 text-center">S.No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Installment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {individualDemandStageOptions.map((stage, idx) => (
                          <tr key={stage.id} className="text-sm">
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIndividualStages.includes(stage.id)}
                                onChange={(e) => {
                                  setSelectedIndividualStages((prev) => {
                                    if (e.target.checked) {
                                      return [...prev, stage.id];
                                    }
                                    return prev.filter((id) => id !== stage.id);
                                  });
                                }}
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">{stage.label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      onClick={() => {
                        if (selectedIndividualStages.length === 0) {
                          alert('Please select at least one installment stage.');
                          return;
                        }
                        setIndividualDemandStep('preview');
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              ) : (
                <IndividualDemand
                  demandInfo={individualDemandInfo}
                  stages={individualDemandStageOptions}
                  selectedStageIds={selectedIndividualStages}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Documents Popup */}
      {flatData && (
        <UploadDocumentPopup
          isOpen={showUploadDocumentsPopup}
          onClose={handleCloseUploadDocumentsPopup}
          documentType={`Documents - ${flatData.flatNo || ''}`}
        />
      )}

      {/* Payment Edit Modal */}
      {showPaymentEditModal && editingPayment && (
        <PaymentEditModal
          payment={editingPayment}
          flatNo={flatData?.flatNo || ''}
          onClose={handleClosePaymentEditModal}
          onSave={handlePaymentSaveClick}
        />
      )}

    </div>
  );
};

// Payment Edit Modal Component
const PaymentEditModal = ({ payment, flatNo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    flatNo: flatNo || '',
    chequeNo: payment.chequeNo || '',
    amount: payment.amount || '',
    onAccountOf: payment.onAccountOf || '',
    favor: payment.favor || '',
    bank: payment.bank || 'HDFC',
    chequeDate: payment.chequeDate || '',
    receivingDate: payment.receivingDate || '',
    chequeStatus: payment.chequeStatus || 'Cleared',
    clearingDate: payment.clearingDate || '',
    receiverBank: payment.receiverBank || '',
    account: payment.account || '',
    remarks: payment.remarks || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[95%] max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Payment Details</h3>
        <form onSubmit={handleSubmit} className="overflow-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Flat No.</label>
              <input 
                readOnly 
                value={formData.flatNo} 
                className="w-full border rounded px-3 h-10 bg-gray-50 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Cheque No.</label>
              <input 
                value={formData.chequeNo} 
                onChange={(e) => handleInputChange('chequeNo', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Amount</label>
              <input 
                value={formData.amount} 
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">On Account</label>
              <input 
                value={formData.onAccountOf} 
                onChange={(e) => handleInputChange('onAccountOf', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Favor</label>
              <input 
                value={formData.favor} 
                onChange={(e) => handleInputChange('favor', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Bank</label>
              <select 
                value={formData.bank} 
                onChange={(e) => handleInputChange('bank', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm"
              >
                {['HDFC','ICICI','SBI','PNB','FEDER','SBP'].map(b=>(<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mt-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Date</label>
              <input 
                value={formData.chequeDate} 
                onChange={(e) => handleInputChange('chequeDate', e.target.value)}
                type="date"
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Receiving Date</label>
              <input 
                value={formData.receivingDate} 
                onChange={(e) => handleInputChange('receivingDate', e.target.value)}
                type="date"
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Cheque status</label>
              <select 
                value={formData.chequeStatus} 
                onChange={(e) => handleInputChange('chequeStatus', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm"
              >
                {['Cleared','Pending','Bounced','Cancelled'].map(s=>(<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Clearing Date</label>
              <input 
                value={formData.clearingDate} 
                onChange={(e) => handleInputChange('clearingDate', e.target.value)}
                type="date"
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Receiver Bank</label>
              <select 
                value={formData.receiverBank} 
                onChange={(e) => handleInputChange('receiverBank', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm"
              >
                <option value="">Select Receiver</option>
                {['HDFC','ICICI','SBI','PNB','FEDER','SBP'].map(b=>(<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1 font-semibold">Account</label>
              <input 
                value={formData.account} 
                onChange={(e) => handleInputChange('account', e.target.value)}
                className="w-full border rounded px-3 h-10 text-sm" 
              />
            </div>
          </div>

          {/* Row 3 - Remarks */}
          <div className="mt-4">
            <label className="block text-xs text-gray-700 mb-1 font-semibold">Remarks</label>
            <input 
              value={formData.remarks} 
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full border rounded px-3 h-10 text-sm" 
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-6">
            <button 
              type="submit" 
              className="px-4 h-10 rounded border bg-gray-800 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
            >
              Update
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 h-10 rounded border bg-white text-gray-800 text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Flat;

