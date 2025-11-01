import React, { useState, useEffect } from 'react';
import { HiChevronRight, HiChevronDown } from 'react-icons/hi';

const ManageUser = ({ onPageChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Define all categories with their subcategories as flat arrays
  const categoriesData = [
    // Column 1 - Manage (with complex nesting)
    {
      id: 'manage',
      name: 'Manage',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Manage Bank',
          hasSubcategories: true,
          subcategories: ['Favouring Bank']
        },
        {
          name: 'Manage User',
          hasSubcategories: true,
          subcategories: ['Access Roles', 'Add User', 'Disable User']
        },
        { name: 'Manage Channel Partner', hasSubcategories: false, subcategories: [] },
        {
          name: 'Manage Commission',
          hasSubcategories: true,
          subcategories: ['Add Commission']
        },
        { name: 'Calculate Interest', hasSubcategories: false, subcategories: [] },
        { name: 'Construction Stages', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Column 2 - New Booking (no subcategories)
    {
      id: 'newBooking',
      name: 'New Booking',
      hasSubcategories: false,
      subcategories: []
    },
    // Block Inventory (with subcategories)
    {
      id: 'blockInventory',
      name: 'Block Inventory',
      hasSubcategories: true,
      subcategories: [
        { name: 'Floor wise', hasSubcategories: false, subcategories: [] },
        { name: 'Block wise', hasSubcategories: false, subcategories: [] },
        { name: 'Size wise', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Customer (with subcategories)
    {
      id: 'customer',
      name: 'Customer',
      hasSubcategories: true,
      subcategories: [
        { name: 'No Discount', hasSubcategories: false, subcategories: [] },
        { name: 'Extra Discount', hasSubcategories: false, subcategories: [] },
        { name: 'Extra Payment', hasSubcategories: false, subcategories: [] },
        { name: 'Signed BBA', hasSubcategories: false, subcategories: [] },
        { name: 'Unsigned BBA', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Channel Partners (with subcategories)
    {
      id: 'channelPartners',
      name: 'Channel Partners',
      hasSubcategories: true,
      subcategories: [
        { name: 'Add Channel Partner', hasSubcategories: false, subcategories: [] },
        { name: 'View All', hasSubcategories: false, subcategories: [] },
        { name: 'Release Commission', hasSubcategories: false, subcategories: [] },
        { name: 'Paid Commission', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Booked Flats (with subcategories)
    {
      id: 'bookedFlats',
      name: 'Booked Flats',
      hasSubcategories: true,
      subcategories: [
        { name: 'Floor Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Block Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Size Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Month Wise', hasSubcategories: false, subcategories: [] },
        { name: 'View All', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Blocked Flats (with subcategories)
    {
      id: 'blockedFlats',
      name: 'Blocked Flats',
      hasSubcategories: true,
      subcategories: [
        { name: 'Floor Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Block Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Size Wise', hasSubcategories: false, subcategories: [] },
        { name: 'View All', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Cancelled Flats (with subcategories)
    {
      id: 'cancelledFlats',
      name: 'Cancelled Flats',
      hasSubcategories: true,
      subcategories: [
        { name: 'Month Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Block Wise', hasSubcategories: false, subcategories: [] },
        { name: 'View All', hasSubcategories: false, subcategories: [] },
        { name: 'Refunded Flats', hasSubcategories: false, subcategories: [] },
        { name: 'Refunded Cheques', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Payment Received (with nested subcategories)
    {
      id: 'paymentReceived',
      name: 'Payment Received',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Cheques',
          hasSubcategories: true,
          subcategories: ['In Process', 'Cleared', 'Bounced', 'Month Wise', 'View All']
        },
        {
          name: 'Cash',
          hasSubcategories: true,
          subcategories: ['Month Wise', 'View All', 'Adjustment']
        },
        {
          name: 'NEFT',
          hasSubcategories: true,
          subcategories: ['Month Wise', 'View All']
        }
      ]
    },
    // Payment Status (with subcategories)
    {
      id: 'paymentStatus',
      name: 'Payment Status',
      hasSubcategories: true,
      subcategories: [
        { name: 'Complete Payment', hasSubcategories: false, subcategories: [] },
        { name: 'Balance Payment', hasSubcategories: false, subcategories: [] },
        { name: 'No Payment', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Flats Verification (no subcategories)
    {
      id: 'flatsVerification',
      name: 'Flats Verification',
      hasSubcategories: false,
      subcategories: []
    },
    // Loan (with nested subcategories)
    {
      id: 'loan',
      name: 'Loan',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Loaned Flats',
          hasSubcategories: true,
          subcategories: ['All', 'Month Wise']
        },
        { name: 'Loan Documents', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Flats Status (with subcategories)
    {
      id: 'flatsStatus',
      name: 'Flats Status',
      hasSubcategories: true,
      subcategories: [
        { name: 'Floor Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Block Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Size Wise', hasSubcategories: false, subcategories: [] },
        { name: 'Mortgaged', hasSubcategories: false, subcategories: [] },
        { name: 'View All', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Flats Summary (no subcategories)
    {
      id: 'flatsSummary',
      name: 'Flats Summary',
      hasSubcategories: false,
      subcategories: []
    },
    // Project Snapshot (with subcategories)
    {
      id: 'projectSnapshot',
      name: 'Project Snapshot',
      hasSubcategories: true,
      subcategories: [
        { name: 'View Coupons', hasSubcategories: false, subcategories: [] },
        { name: 'Installment Report', hasSubcategories: false, subcategories: [] },
        { name: 'CLP Report', hasSubcategories: false, subcategories: [] },
        { name: 'Final Report', hasSubcategories: false, subcategories: [] },
        { name: 'Today Report', hasSubcategories: false, subcategories: [] },
        { name: 'Datewise Report', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Set Reminder (no subcategories)
    {
      id: 'setReminder',
      name: 'Set Reminder',
      hasSubcategories: false,
      subcategories: []
    },
    // Construction Updates (no subcategories)
    {
      id: 'constructionUpdates',
      name: 'Construction Updates',
      hasSubcategories: false,
      subcategories: []
    },
    // Flat Customization (with subcategories)
    {
      id: 'flatCustomization',
      name: 'Flat Customization',
      hasSubcategories: true,
      subcategories: [
        { name: 'Activity Type', hasSubcategories: false, subcategories: [] },
        { name: 'View Activities', hasSubcategories: false, subcategories: [] },
        { name: 'Customize', hasSubcategories: false, subcategories: [] },
        { name: 'View Customization', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Handover Activities (with subcategories)
    {
      id: 'handoverActivities',
      name: 'Handover Activities',
      hasSubcategories: true,
      subcategories: [
        { name: 'Add Activity', hasSubcategories: false, subcategories: [] },
        { name: 'Add Subactivity', hasSubcategories: false, subcategories: [] },
        { name: 'View Activities', hasSubcategories: false, subcategories: [] },
        { name: 'Flat H.over Activity', hasSubcategories: false, subcategories: [] },
        { name: 'View Flat H.A.', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Documents Section (with subcategories)
    {
      id: 'documentsSection',
      name: 'Documents Section',
      hasSubcategories: true,
      subcategories: [
        { name: 'Upload Common Docs', hasSubcategories: false, subcategories: [] },
        { name: 'View Common Docs', hasSubcategories: false, subcategories: [] },
        { name: 'Upload Flat Docs', hasSubcategories: false, subcategories: [] },
        { name: 'View Flat Docs', hasSubcategories: false, subcategories: [] },
        { name: 'Upload Legal Docs', hasSubcategories: false, subcategories: [] },
        { name: 'View Legal Docs', hasSubcategories: false, subcategories: [] },
        { name: 'Upload Flat Legal Docs', hasSubcategories: false, subcategories: [] },
        { name: 'View Flat Legal Docs', hasSubcategories: false, subcategories: [] }
      ]
    },
    // Reports (with subcategories)
    {
      id: 'reports',
      name: 'Reports',
      hasSubcategories: true,
      subcategories: [
        { name: 'User Logs', hasSubcategories: false, subcategories: [] }
      ]
    }
  ];

  // Initialize checkbox states - flatten everything
  const getInitialCheckboxStates = () => {
    const states = {};
    categoriesData.forEach(cat => {
      states[cat.id] = false;
    });
    return states;
  };

  const getInitialSubCheckboxStates = () => {
    const states = {};
    
    const processCategory = (category) => {
      states[category.id] = {};
      
      if (category.hasSubcategories && category.subcategories) {
        category.subcategories.forEach(sub => {
          if (sub.hasSubcategories) {
            // This sub has children
            states[category.id][sub.name] = {};
            if (sub.subcategories) {
              sub.subcategories.forEach(subsub => {
                states[category.id][sub.name][subsub] = false;
              });
            }
          } else if (sub.name) {
            // This is a simple subcategory without children
            states[category.id][sub.name] = false;
          } else {
            // This is a flat sub
            if (Array.isArray(sub)) {
              sub.forEach(subName => {
                states[category.id][subName] = false;
              });
            }
          }
        });
      } else if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach(sub => {
          if (typeof sub === 'string') {
            states[category.id][sub] = false;
          }
        });
      }
    };
    
    categoriesData.forEach(cat => processCategory(cat));
    return states;
  };

  const [checkboxStates, setCheckboxStates] = useState(getInitialCheckboxStates());
  const [subCheckboxStates, setSubCheckboxStates] = useState(getInitialSubCheckboxStates());

  // Auto-update parent checkbox when all subcategories change
  useEffect(() => {
    setCheckboxStates(prev => {
      const newCheckboxStates = { ...prev };
      
      categoriesData.forEach(category => {
        if (category.hasSubcategories && subCheckboxStates[category.id]) {
          // Check if all subcategories are checked
          const allSubsChecked = Object.keys(subCheckboxStates[category.id]).every(key => {
            const subValue = subCheckboxStates[category.id][key];
            if (typeof subValue === 'object' && subValue !== null) {
              // Nested subcategory - check if all children are checked
              return Object.values(subValue).every(v => v);
            } else {
              // Simple subcategory
              return subValue === true;
            }
          });
          
          newCheckboxStates[category.id] = allSubsChecked;
        }
      });
      
      return newCheckboxStates;
    });
  }, [subCheckboxStates]);

  const userRoles = [
    '--Select User Level--',
    'Super Administrator',
    'Administrator',
    'Lower Administrator',
    'Accounts',
    'Customer',
    'Channel Partner',
    'Flat Customization',
    'Legal'
  ];

  const roleDefaults = {
    'Super Administrator': { manage: true, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': true, 'Access Roles': true, 'Add User': true, 'Disable User': true, 'Manage Channel Partner': true, 'Manage Commission': true, 'Add Commission': true, 'Calculate Interest': true, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': true, 'Signed BBA': true, 'Unsigned BBA': true, channelPartners: true, 'Add Channel Partner': true, 'View All': true, 'Release Commission': true, 'Paid Commission': true, bookedFlats: true, 'Floor Wise': true, 'Block Wise': true, 'Size Wise': true, 'Month Wise': true, blockedFlats: true, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: true, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: true, Mortgaged: true, flatsSummary: true, projectSnapshot: true, 'View Coupons': true, 'Installment Report': true, 'CLP Report': true, 'Final Report': true, 'Today Report': true, 'Datewise Report': true, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: true, 'Add Activity': true, 'Add Subactivity': true, 'Flat H.over Activity': true, 'View Flat H.A.': true, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: true, 'User Logs': true },
    'Administrator': { manage: false, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': true, 'Access Roles': true, 'Add User': true, 'Disable User': true, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': true, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': true, 'Signed BBA': true, 'Unsigned BBA': true, channelPartners: true, 'Add Channel Partner': true, 'View All': true, 'Release Commission': true, 'Paid Commission': true, bookedFlats: true, 'Floor Wise': true, 'Block Wise': true, 'Size Wise': true, 'Month Wise': true, blockedFlats: true, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: true, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: true, Mortgaged: true, flatsSummary: true, projectSnapshot: true, 'View Coupons': true, 'Installment Report': true, 'CLP Report': true, 'Final Report': true, 'Today Report': true, 'Datewise Report': true, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: true, 'Add Activity': true, 'Add Subactivity': true, 'Flat H.over Activity': true, 'View Flat H.A.': true, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: true, 'User Logs': true },
    'Lower Administrator': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: true, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: true, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: true, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: true, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: true, Mortgaged: false, flatsSummary: true, projectSnapshot: true, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: true, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: true, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: true, 'User Logs': false },
    'Accounts': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': true, 'Add Commission': true, 'Calculate Interest': true, 'Construction Stages': false, newBooking: false, blockInventory: true, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': true, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
    'Customer': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: false, blockInventory: false, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
    'Channel Partner': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: true, blockInventory: true, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: true, 'Add Channel Partner': false, 'View All': true, 'Release Commission': false, 'Paid Commission': false, bookedFlats: true, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: true, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
    'Flat Customization': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': true, newBooking: false, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: false, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: true, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
    'Legal': { manage: false, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: false, blockInventory: false, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: false, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: false, 'User Logs': false }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
    
    if (role && role !== '--Select User Level--' && roleDefaults[role]) {
      const roleDefault = roleDefaults[role];
      
      // Set main checkbox states
      const mainStates = {};
      categoriesData.forEach(cat => {
        mainStates[cat.id] = roleDefault[cat.id] || false;
      });
      setCheckboxStates(mainStates);
      
      // Set subcategory states
      const newSubStates = getInitialSubCheckboxStates();
      Object.keys(newSubStates).forEach(catId => {
        Object.keys(newSubStates[catId]).forEach(subKey => {
          if (typeof newSubStates[catId][subKey] === 'object' && newSubStates[catId][subKey] !== null) {
            // Nested subcategory
            Object.keys(newSubStates[catId][subKey]).forEach(deepKey => {
              newSubStates[catId][subKey][deepKey] = roleDefault[deepKey] || false;
            });
    } else {
            // Simple subcategory
            newSubStates[catId][subKey] = roleDefault[subKey] || false;
          }
        });
      });
      setSubCheckboxStates(newSubStates);
    } else {
      setCheckboxStates(getInitialCheckboxStates());
      setSubCheckboxStates(getInitialSubCheckboxStates());
    }
  };

  const handleCheckboxChange = (checkboxId) => {
    const newValue = !checkboxStates[checkboxId];
    
    setCheckboxStates(prev => ({
      ...prev,
      [checkboxId]: newValue
    }));
    
    // Update all subcategories recursively
    const updateSubStates = (categoryId) => {
      if (subCheckboxStates[categoryId]) {
        const updated = {};
        Object.keys(subCheckboxStates[categoryId]).forEach(key => {
          if (typeof subCheckboxStates[categoryId][key] === 'object' && subCheckboxStates[categoryId][key] !== null) {
            updated[key] = {};
            Object.keys(subCheckboxStates[categoryId][key]).forEach(subkey => {
              updated[key][subkey] = newValue;
            });
          } else {
            updated[key] = newValue;
          }
        });
        return updated;
      }
      return subCheckboxStates[categoryId];
    };
    
    setSubCheckboxStates(prev => ({
      ...prev,
      [checkboxId]: updateSubStates(checkboxId)
    }));
  };

  const handleSubCheckboxChange = (parentId, subName) => {
    // Check if this subcategory has nested children
    const currentSubState = subCheckboxStates[parentId]?.[subName];
    const hasNestedChildren = typeof currentSubState === 'object' && currentSubState !== null;
    
    if (hasNestedChildren) {
      // This is a parent subcategory with children - toggle all children
      const allChecked = Object.values(currentSubState).every(v => v);
      const newValue = !allChecked;
      
      setSubCheckboxStates(prev => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          [subName]: Object.keys(currentSubState).reduce((acc, key) => {
            acc[key] = newValue;
            return acc;
          }, {})
        }
      }));
    } else {
      // Simple subcategory without children
      setSubCheckboxStates(prev => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          [subName]: !prev[parentId][subName]
        }
      }));
    }
  };

  const handleDeepSubCheckboxChange = (parentId, subName, deepSubName) => {
    setSubCheckboxStates(prev => ({
      ...prev,
      [parentId]: {
        ...prev[parentId],
        [subName]: {
          ...prev[parentId][subName],
          [deepSubName]: !prev[parentId][subName][deepSubName]
        }
      }
    }));
  };

  const handleSaveAccessRights = () => {
    console.log('Access rights saved for role:', selectedRole, checkboxStates, subCheckboxStates);
    alert('Access rights saved successfully!');
  };

  const handleFilterClick = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filter);
    }
  };

  const getHeaderTitle = () => {
    switch (selectedFilter) {
      case 'accessRoles':
        return 'Access Roles';
      case 'addUser':
        return 'Add User';
      case 'disableUser':
        return 'Disable User';
      default:
        return 'User Management';
    }
  };

  const renderSubcategories = (category) => {
    if (!category.hasSubcategories || !category.subcategories || category.subcategories.length === 0) {
      return null;
    }

    return (
      <div className="bg-gray-50 pl-6 pr-3 pb-2 space-y-0">
        {category.subcategories.map((sub) => {
          if (sub.hasSubcategories) {
            // Nested subcategory with children
            return (
              <div key={sub.name} className="border-b border-gray-200">
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id={`checkbox-${category.id}-${sub.name}`}
                    checked={subCheckboxStates[category.id]?.[sub.name] ? 
                      (typeof subCheckboxStates[category.id][sub.name] === 'object' ? 
                        Object.values(subCheckboxStates[category.id][sub.name]).every(v => v) : 
                        subCheckboxStates[category.id][sub.name]) : false}
                    onChange={() => handleSubCheckboxChange(category.id, sub.name)}
                    className="w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor={`checkbox-${category.id}-${sub.name}`} className="text-gray-700 font-medium cursor-pointer select-none text-xs flex-1">
                    {sub.name}
                  </label>
                </div>
                {/* Render children of nested sub */}
                {sub.subcategories && (
                  <div className="pl-6 pr-3 pb-2 space-y-0">
                    {sub.subcategories.map((deepSub) => (
                      <div key={deepSub} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id={`checkbox-${category.id}-${sub.name}-${deepSub}`}
                          checked={subCheckboxStates[category.id]?.[sub.name]?.[deepSub] || false}
                          onChange={() => handleDeepSubCheckboxChange(category.id, sub.name, deepSub)}
                          className="w-3 h-3 cursor-pointer"
                        />
                        <label htmlFor={`checkbox-${category.id}-${sub.name}-${deepSub}`} className="text-gray-600 cursor-pointer select-none text-xs flex-1">
                          {deepSub}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Simple subcategory without children - still render it
            return (
              <div key={sub.name} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id={`checkbox-${category.id}-${sub.name}`}
                  checked={subCheckboxStates[category.id]?.[sub.name] || false}
                  onChange={() => handleSubCheckboxChange(category.id, sub.name)}
                  className="w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor={`checkbox-${category.id}-${sub.name}`} className="text-gray-700 cursor-pointer select-none text-xs flex-1">
                  {sub.name}
                </label>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Organize into columns
  const getCategoriesByColumn = () => {
    return [
      [categoriesData[0], categoriesData[1], categoriesData[8], categoriesData[9], categoriesData[11]], // Manage, New Booking, Payment Received, Payment Status, Loan
      [categoriesData[12], categoriesData[13], categoriesData[10], categoriesData[17], categoriesData[2], categoriesData[5], categoriesData[6], categoriesData[7], categoriesData[18]], // Flats Status, Flats Summary, Flats Verification, Flat Customization, Block Inventory, Booked Flats, Blocked Flats, Cancelled Flats, Handover Activities
      [categoriesData[3], categoriesData[4], categoriesData[14], categoriesData[15], categoriesData[16], categoriesData[20]], // Customer, Channel Partners, Project Snapshot, Set Reminder, Construction Updates, Reports
      [categoriesData[19]] // Documents Section
    ];
  };

  const categoriesByColumn = getCategoriesByColumn();

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT SECTION — FILTERS */}
        <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Manage User</h2>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              {['accessRoles', 'addUser', 'disableUser'].map((filter) => {
                const filterLabels = {
                  accessRoles: 'Access Roles',
                  addUser: 'Add User',
                  disableUser: 'Disable User'
                };

                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 w-full ${
                      selectedFilter === filter ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
                  >
                    <span>{filterLabels[filter]}</span>
                    <HiChevronRight className={`transition-transform ${selectedFilter === filter ? 'rotate-90' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)', marginLeft: 'auto' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — CONTENT */}
        <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>{getHeaderTitle()}</h2>
            
            {/* Dropdown for User Level */}
            {selectedFilter === 'accessRoles' && (
              <div className="mt-3 mb-2">
                <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>Select User Level</label>
                <div className="relative w-full max-w-xs">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full text-left bg-white border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${selectedRole ? 'text-gray-900' : 'text-gray-500'}`}>
                        {selectedRole || '--Select User Level--'}
                      </span>
                      <HiChevronDown className={`text-gray-600 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} size={16} />
                    </div>
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
                      {userRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            selectedRole === role 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {!selectedFilter && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Please select an option from the left to manage users</p>
                </div>
              </div>
            )}
            
            {selectedFilter === 'accessRoles' && (
              <div className="w-full max-w-7xl mx-auto pt-2">
                {selectedRole && selectedRole !== '--Select User Level--' && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900">Access Rights Configuration</h3>
                      <p className="text-xs text-gray-600 mt-0.5">Configure permissions for: <span className="font-medium">{selectedRole}</span></p>
                    </div>
                    
                    <div className="p-3">
                      <div className="grid grid-cols-4 gap-4">
                        {categoriesByColumn.map((columnCategories, columnIndex) => (
                          <div key={columnIndex} className="space-y-0">
                            {columnCategories.map((category) => (
                              <div key={category.id}>
                                {/* Main Checkbox */}
                                <div className="flex items-center gap-2 p-2 transition-colors">
                            <input
                              type="checkbox"
                                    id={`checkbox-${category.id}`}
                                    checked={checkboxStates[category.id] || false}
                                    onChange={() => handleCheckboxChange(category.id)}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <label htmlFor={`checkbox-${category.id}`} className="text-gray-900 font-medium cursor-pointer select-none text-sm flex-1">
                                    {category.name}
                            </label>
                                </div>
                                
                                {/* Subcategories - wrapped in background */}
                                {renderSubcategories(category)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Save Button */}
                      <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
                        <button
                          onClick={handleSaveAccessRights}
                          className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                        >
                          SAVE CHANGES
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedFilter && selectedFilter !== 'accessRoles' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg">Content for {selectedFilter} will be added here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUser;
