// ==================== USER PROFILE DATA ====================
const userProfileData = {
  fullName: 'Aman Bhutani',
  flatNo: 'A-209',
  profileImage: '/src/assets/user Image big.png', // When real API comes, this will be a full URL
  contacts: {
    email: 'aman_bhutani85@gmail.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 54542',
  }
};

export const fetchUserProfile = async () => {
  return {
    success: true,
    data: userProfileData
  };
};

// ==================== DETAILED INFORMATION DATA ====================
const detailedInformationData = {
  fullName: 'Aman Bhutani',
  fatherHusbandName: 'Mahesh Bhutani',
  panNo: 'AFXXXXXXKM',
  dob: '20 Jan, 1995',
  address: 'HN2541, Sec-62, Noida',
};

export const fetchDetailedInformation = async () => {
  return {
    success: true,
    data: detailedInformationData
  };
};

// ==================== FLAT DETAILS DATA ====================
const flatDetailsData = {
  flatInfo: [
    { label: "Area", value: "1614" },
    { label: "Booking Date", value: "12-07-2019" },
    { label: "Unit Cost", value: "6848100" },
  ],
  chargesInfo: [
    { label: "Amenities", value: "100/- Sq. Ft." },
    { label: "Corpus Fund", value: "70/- Sq. Ft." },
    { label: "EWSW", value: "100/- Sq. Ft." },
    { label: "Maintenance for 1st year", value: "40/- Sq. Ft." },
    { label: "Maintenance for 2nd year", value: "40/- Sq. Ft." },
    { label: "Single Car Parking", value: "150000" },
  ],
};

export const fetchFlatDetails = async () => {
  return {
    success: true,
    data: flatDetailsData
  };
};

// ==================== CURRENT DUES DATA ====================
const currentDuesData = {
  flatDues: [
    { label: 'Due Amount', value: '4833450' },
    { label: 'Paid Amount', value: '6312131' },
    { label: 'Pending Amount', value: '0' },
  ],
  gstTaxDues: [
    { label: 'Due Amount', value: '241674' },
    { label: 'Paid Amount', value: '233926' },
    { label: 'Pending Amount', value: '7748' },
  ],
  maintenanceDues: [
    { label: 'Monthly Maintenance', value: '2500' },
    { label: 'Paid Amount', value: '15000' },
    { label: 'Pending Amount', value: '5000' },
  ],
  electricityDues: [
    { label: 'Current Bill', value: '3200' },
    { label: 'Paid Amount', value: '2800' },
    { label: 'Pending Amount', value: '400' },
  ],
  waterDues: [
    { label: 'Water Bill', value: '800' },
    { label: 'Paid Amount', value: '800' },
    { label: 'Pending Amount', value: '0' },
  ],
};

export const fetchCurrentDues = async () => {
  return {
    success: true,
    data: currentDuesData
  };
};

// ==================== PAYMENT SCHEDULE DATA ====================
const paymentScheduleData = {
  payments: [
    {
      description: 'Booking Advance',
      amountDescription: '10% of (BSP+Amenities+Car Parking)',
      amountPayable: '644460',
      gst: '32223',
      bgColor: '#E4FFE5',
    },
    {
      description: 'At the time of Agreement of Sale',
      amountDescription: '20% of (BSP+Amenities+Car Parking)',
      amountPayable: '1288920',
      gst: '64446',
      bgColor: '#EFF1F6',
    },
    {
      description: 'Completion of Cellar Slab',
      amountDescription: '15% of (BSP+Amenities+Car Parking)',
      amountPayable: '966690',
      gst: '48335',
      bgColor: '#FFEBEB',
    },
    {
      description: 'Completion of 5th Slab',
      amountDescription: '25% of (BSP+Amenities+Car Parking)',
      amountPayable: '1611150',
      gst: '80558',
      bgColor: '#FFF8D4',
    },
    {
      description: 'Completion of First Stage of Internal works',
      amountDescription: '5% of (BSP+Amenities+Car Parking)',
      amountPayable: '322230',
      gst: '16112',
      bgColor: '#EFF1F6',
    },
    {
      description: 'Completion of First Stage of Internal works',
      amountDescription: '5% of (BSP+Amenities+Car Parking)',
      amountPayable: '322230',
      gst: '16112',
      bgColor: '#EFF1F6',
    },
    {
      description: 'Completion of 2nd Stage of Internal works',
      amountDescription: '5% of (BSP+Amenities+Car Parking)',
      amountPayable: '322230',
      gst: '16112',
      bgColor: '#E4FFE5',
    },
  ],
  totalAmount: '6848100',
  totalGST: '322233',
};

export const fetchPaymentSchedule = async () => {
  return {
    success: true,
    data: paymentScheduleData
  };
};

// ==================== DOCUMENTS DATA ====================
const documentsData = [
  { id: 1, fileName: '1730958908', type: 'PDF' },
  { id: 2, fileName: '2342342344', type: 'PDF' },
  { id: 3, fileName: '5653453543', type: 'DOC' },
  { id: 4, fileName: '5656545452', type: 'PDF' },
  { id: 5, fileName: '7890123456', type: 'DOC' },
  { id: 6, fileName: '9876543210', type: 'PDF' },
  { id: 7, fileName: '1111111111', type: 'DOC' },
  { id: 8, fileName: '2222222222', type: 'PDF' },
  { id: 9, fileName: '3333333333', type: 'DOC' },
  { id: 10, fileName: '4444444444', type: 'PDF' },
];

export const fetchDocuments = async () => {
  return {
    success: true,
    data: documentsData
  };
};

// ==================== UPDATES DATA ====================
const updatesData = [
  {
    id: 1,
    title: 'Construction of 2nd floor is underway.',
    description: 'Laying the foundation and erecting the structure to installing utilities.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 2,
    title: 'Location and Connectivity',
    description: 'Proximity to essential services and good transport links remain crucial for most buyers.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 3,
    title: 'Sustainability and Smart Homes',
    description: 'A growing focus on eco-friendly features like energy-efficient appliances.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 4,
    title: 'Favorable Lending Environment',
    description: 'Stable interest rates on home loans are affordable housing buyers.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 5,
    title: 'Ready-to-Move',
    description: 'Buyers are increasingly favoring ready-to-move-in properties.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 6,
    title: 'Luxury Segment Driving Growth',
    description: 'The demand for luxury housing (above ₹1 crore) is particularly strong.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 7,
    title: 'Infrastructure Development',
    description: 'New metro lines and road expansions are improving accessibility to the project area.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 8,
    title: 'Amenities Completion',
    description: 'Swimming pool, gym, and community center construction is progressing well.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 9,
    title: 'Market Trends',
    description: 'Property prices in the region have shown a 15% increase over the last quarter.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 10,
    title: 'Legal Approvals',
    description: 'All necessary building permits and environmental clearances have been obtained.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 11,
    title: 'Investment Opportunities',
    description: 'Early bird discounts and flexible payment plans are available for investors.',
    bgColor: 'bg-[#EFF1F6]',
  },
  {
    id: 12,
    title: 'Quality Assurance',
    description: 'Regular quality checks and material testing ensure construction standards.',
    bgColor: 'bg-[#EFF1F6]',
  },
];

export const fetchUpdates = async () => {
  return {
    success: true,
    data: updatesData
  };
};

// ==================== CONSTRUCTION UPDATES DATA ====================
const constructionUpdatesData = [
  {
    id: 1,
    albumName: "Foundation Work - Tower A",
    title: "Foundation Work Completed",
    description: "The foundation work for Tower A has been successfully completed. All structural elements are in place and ready for the next phase.",
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
    priority: "high",
    location: "Tower A - Ground Floor",
    viewCount: 156
  },
  {
    id: 2,
    albumName: "Electrical Installation - Tower B",
    title: "Electrical Installation Progress",
    description: "Electrical wiring installation is 75% complete in Tower B. The team is working on the 8th floor electrical connections.",
    date: "2024-01-14",
    time: "11:45",
    status: "in-progress",
    priority: "medium",
    location: "Tower B - 8th Floor",
    viewCount: 89
  },
  {
    id: 3,
    albumName: "Plumbing System Testing",
    title: "Plumbing System Testing",
    description: "Water pressure testing will be conducted tomorrow for all residential units. Please ensure all construction equipment is moved away from testing areas.",
    date: "2024-01-13",
    time: "16:20",
    status: "scheduled",
    priority: "high",
    location: "All Towers",
    viewCount: 203
  },
  {
    id: 4,
    albumName: "Elevator Installation - Tower C",
    title: "Elevator Installation Update",
    description: "Elevator installation is progressing well. Two elevators in Tower C are now operational for construction use.",
    date: "2024-01-12",
    time: "09:15",
    status: "in-progress",
    priority: "medium",
    location: "Tower C",
    viewCount: 67
  },
  {
    id: 5,
    albumName: "Safety Inspection Report",
    title: "Safety Inspection Scheduled",
    description: "Monthly safety inspection will be conducted on Friday. All construction teams should prepare their work areas.",
    date: "2024-01-11",
    time: "13:30",
    status: "scheduled",
    priority: "high",
    location: "Construction Site",
    viewCount: 134
  },
  {
    id: 6,
    albumName: "Material Delivery - Steel",
    title: "Material Delivery Completed",
    description: "Steel reinforcement materials have been delivered and stored in the designated area. Quality inspection passed.",
    date: "2024-01-10",
    time: "10:00",
    status: "completed",
    priority: "low",
    location: "Material Storage Area",
    viewCount: 45
  }
];

export const fetchConstructionUpdates = async () => {
  return {
    success: true,
    data: constructionUpdatesData
  };
};

// ==================== MY DOCUMENTS DATA ====================
const myDocumentsData = [
  { id: 1, fileName: 'PAN_Card_Aman_Bhutani', type: 'PAN Card', date: '2024-01-10' },
  { id: 2, fileName: 'Aadhaar_Card_123456789', type: 'Aadhaar Card', date: '2024-01-08' },
  { id: 3, fileName: 'Bank_Statement_HDFC', type: 'Bank Statement', date: '2024-01-05' },
  { id: 4, fileName: 'Salary_Slip_January', type: 'Salary Slip', date: '2024-01-02' },
  { id: 5, fileName: 'Property_Agreement', type: 'Property Agreement', date: '2023-12-28' },
  { id: 6, fileName: 'Insurance_Policy_Life', type: 'Insurance Policy', date: '2023-12-25' },
  { id: 7, fileName: 'Electricity_Bill_January', type: 'Utility Bill', date: '2024-01-12' },
  { id: 8, fileName: 'Rent_Receipt_December', type: 'Rent Receipt', date: '2023-12-30' }
];

export const fetchMyDocuments = async () => {
  return {
    success: true,
    data: myDocumentsData
  };
};

// ==================== CUSTOMER CARE MESSAGE SUBMISSION ====================
export const submitCustomerCareMessage = async (messageData) => {
  
  return {
    success: true,
    message: 'Your message has been submitted successfully. We will get back to you soon.',
    data: {
      ticketId: Math.floor(Math.random() * 1000000),
      submittedAt: new Date().toISOString(),
      ...messageData
    }
  };
};

// ==================== EXPORT ALL ====================
export default {
  fetchUserProfile,
  fetchDetailedInformation,
  fetchFlatDetails,
  fetchCurrentDues,
  fetchPaymentSchedule,
  fetchDocuments,
  fetchUpdates,
  fetchConstructionUpdates,
  fetchMyDocuments,
  submitCustomerCareMessage,
};

