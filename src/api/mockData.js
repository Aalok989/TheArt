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

// ==================== ADMIN: FLAT STATUS DATA ====================
const flatStatusData = {
  floors: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
  blocks: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  sizes: ['2BHK_1171', '2BHK_1231', '2BHK_1271', '3BHK_1500', '3BHK_1650', '4BHK_2000', '4BHK_2100', '4BHK_2200', '4BHK_2300', '4BHK_2400', '4BHK_2500', '4BHK_2600', '4BHK_2700', '4BHK_2800', '4BHK_2900', '4BHK_3000', '4BHK_3100', '4BHK_3200', '4BHK_3300', '4BHK_3400', '4BHK_3500', '4BHK_3600', '4BHK_3700', '4BHK_3800', '4BHK_3900', '4BHK_4000'],
  flats: [
    // Floor 1, Block A
    { flatNo: 'A101', floor: '1', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A102', floor: '1', block: 'A', size: '2BHK_1231', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A103', floor: '1', block: 'A', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A104', floor: '1', block: 'A', size: '3BHK_1650', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'A105', floor: '1', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A106', floor: '1', block: 'A', size: '2BHK_1231', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A107', floor: '1', block: 'A', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A108', floor: '1', block: 'A', size: '3BHK_1650', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'A109', floor: '1', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A110', floor: '1', block: 'A', size: '2BHK_1231', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A111', floor: '1', block: 'A', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A112', floor: '1', block: 'A', size: '3BHK_1650', status: 'Vacant', color: 'text-green-500' },
    
    // Floor 1, Block B
    { flatNo: 'B101', floor: '1', block: 'B', size: '2BHK_1171', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'B102', floor: '1', block: 'B', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'B103', floor: '1', block: 'B', size: '3BHK_1500', status: 'BBA Signed', color: 'text-blue-500' },
    { flatNo: 'B104', floor: '1', block: 'B', size: '2BHK_1271', status: 'Blocked', color: 'text-yellow-500' },
    
    // Floor 1, Block C
    { flatNo: 'C101', floor: '1', block: 'C', size: '2BHK_1171', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'C102', floor: '1', block: 'C', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'C103', floor: '1', block: 'C', size: '3BHK_1650', status: 'BBA Signed', color: 'text-blue-500' },
    
    // Floor 2, Block A
    { flatNo: 'A201', floor: '2', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A202', floor: '2', block: 'A', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A203', floor: '2', block: 'A', size: '3BHK_1500', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A204', floor: '2', block: 'A', size: '3BHK_1650', status: 'Vacant', color: 'text-green-500' },
    
    // Floor 2, Block B
    { flatNo: 'B201', floor: '2', block: 'B', size: '2BHK_1171', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'B202', floor: '2', block: 'B', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'B203', floor: '2', block: 'B', size: '3BHK_1500', status: 'BBA Signed', color: 'text-blue-500' },
    { flatNo: 'B204', floor: '2', block: 'B', size: '2BHK_1271', status: 'Booked', color: 'text-red-500' },
    
    // Floor 2, Block C
    { flatNo: 'C201', floor: '2', block: 'C', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'C202', floor: '2', block: 'C', size: '3BHK_1500', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'C203', floor: '2', block: 'C', size: '3BHK_1650', status: 'BBA Signed', color: 'text-blue-500' },
    
    // Floor 3, Block A
    { flatNo: 'A301', floor: '3', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A302', floor: '3', block: 'A', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A303', floor: '3', block: 'A', size: '3BHK_1500', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A304', floor: '3', block: 'A', size: '3BHK_1650', status: 'Vacant', color: 'text-green-500' },
    
    // Floor 3, Block B
    { flatNo: 'B301', floor: '3', block: 'B', size: '2BHK_1171', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'B302', floor: '3', block: 'B', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'B303', floor: '3', block: 'B', size: '3BHK_1500', status: 'BBA Signed', color: 'text-blue-500' },
    { flatNo: 'B304', floor: '3', block: 'B', size: '2BHK_1271', status: 'Booked', color: 'text-red-500' },
    
    // Floor 3, Block C
    { flatNo: 'C301', floor: '3', block: 'C', size: '2BHK_1171', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'C302', floor: '3', block: 'C', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'C303', floor: '3', block: 'C', size: '3BHK_1650', status: 'BBA Signed', color: 'text-blue-500' },
    
    // Floor 4, Block A
    { flatNo: 'A401', floor: '4', block: 'A', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A402', floor: '4', block: 'A', size: '2BHK_1231', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A403', floor: '4', block: 'A', size: '3BHK_1500', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'A404', floor: '4', block: 'A', size: '3BHK_1650', status: 'Booked', color: 'text-red-500' },
    
    // Floor 4, Block B
    { flatNo: 'B401', floor: '4', block: 'B', size: '2BHK_1171', status: 'BBA Signed', color: 'text-blue-500' },
    { flatNo: 'B402', floor: '4', block: 'B', size: '2BHK_1231', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'B403', floor: '4', block: 'B', size: '3BHK_1500', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'B404', floor: '4', block: 'B', size: '2BHK_1271', status: 'Vacant', color: 'text-green-500' },
    
    // Floor 4, Block C
    { flatNo: 'C401', floor: '4', block: 'C', size: '2BHK_1171', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'C402', floor: '4', block: 'C', size: '3BHK_1500', status: 'Blocked', color: 'text-yellow-500' },
    { flatNo: 'C403', floor: '4', block: 'C', size: '3BHK_1650', status: 'Vacant', color: 'text-green-500' },
    
    // Floor 5, Block A
    { flatNo: 'A501', floor: '5', block: 'A', size: '2BHK_1171', status: 'Vacant', color: 'text-green-500' },
    { flatNo: 'A502', floor: '5', block: 'A', size: '2BHK_1231', status: 'Booked', color: 'text-red-500' },
    { flatNo: 'A503', floor: '5', block: 'A', size: '3BHK_1500', status: 'BBA Signed', color: 'text-blue-500' },
    { flatNo: 'A504', floor: '5', block: 'A', size: '3BHK_1650', status: 'Booked', color: 'text-red-500' },
  ],
};

export const fetchFlatStatus = async () => {
  return {
    success: true,
    data: flatStatusData
  };
};

// ==================== ADMIN: REPORTS DATA ====================
const reportsData = [
  { srNo: 1, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 2, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 3, username: 'A209', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 4, username: 'A209', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 5, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 6, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 7, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 8, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 9, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 10, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 11, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 12, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 13, username: 'rohit', ipAddress: '103.48.197.219', dateTime: '06-10-2025 10:06:38' },
  { srNo: 14, username: 'admin', ipAddress: '192.168.1.100', dateTime: '07-10-2025 09:15:22' },
  { srNo: 15, username: 'B305', ipAddress: '103.48.197.220', dateTime: '07-10-2025 11:32:45' },
  { srNo: 16, username: 'manager', ipAddress: '192.168.1.101', dateTime: '07-10-2025 14:20:18' },
  { srNo: 17, username: 'C401', ipAddress: '103.48.197.221', dateTime: '07-10-2025 16:45:33' },
  { srNo: 18, username: 'admin', ipAddress: '192.168.1.100', dateTime: '08-10-2025 08:30:12' },
];

export const fetchReports = async () => {
  return {
    success: true,
    data: reportsData
  };
};

// ==================== ADMIN: LOAN DETAILS DATA ====================
const loanDetailsData = {
  loans: [
    { srNo: 1, flatNo: 'A301', customerName: 'Akaash', sanctionedAmount: '40000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '4000', status: 'Successful' },
    { srNo: 2, flatNo: 'A302', customerName: 'Akhilesh', sanctionedAmount: '50000', loanBank: 'SBI', loanAccountNo: '1245786532', loanInterest: '5000', status: 'Successful' },
    { srNo: 3, flatNo: 'A303', customerName: 'Mohan', sanctionedAmount: '25000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '2500', status: 'Failed' },
    { srNo: 4, flatNo: 'A304', customerName: 'Sohan', sanctionedAmount: '15000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '1500', status: 'Successful' },
    { srNo: 5, flatNo: 'A305', customerName: 'Avinash', sanctionedAmount: '25000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '2500', status: 'Successful' },
    { srNo: 6, flatNo: 'A306', customerName: 'Bablu', sanctionedAmount: '65000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '6500', status: 'Successful' },
    { srNo: 7, flatNo: 'A307', customerName: 'Mohit', sanctionedAmount: '12000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '1200', status: 'Failed' },
    { srNo: 8, flatNo: 'B101', customerName: 'Rajesh', sanctionedAmount: '35000', loanBank: 'HDFC', loanAccountNo: '9876543210', loanInterest: '3500', status: 'Successful' },
    { srNo: 9, flatNo: 'B102', customerName: 'Suresh', sanctionedAmount: '45000', loanBank: 'ICICI', loanAccountNo: '1122334455', loanInterest: '4500', status: 'Successful' },
    { srNo: 10, flatNo: 'B103', customerName: 'Ramesh', sanctionedAmount: '20000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '2000', status: 'Failed' },
    { srNo: 11, flatNo: 'C201', customerName: 'Vikash', sanctionedAmount: '55000', loanBank: 'SBI', loanAccountNo: '5566778899', loanInterest: '5500', status: 'Successful' },
    { srNo: 12, flatNo: 'C202', customerName: 'Naresh', sanctionedAmount: '30000', loanBank: 'HDFC', loanAccountNo: '9988776655', loanInterest: '3000', status: 'Successful' },
    { srNo: 13, flatNo: 'C203', customerName: 'Mahesh', sanctionedAmount: '18000', loanBank: 'PNB', loanAccountNo: '1245786532', loanInterest: '1800', status: 'Failed' },
    { srNo: 14, flatNo: 'D401', customerName: 'Sunil', sanctionedAmount: '42000', loanBank: 'ICICI', loanAccountNo: '4433221100', loanInterest: '4200', status: 'Successful' },
    { srNo: 15, flatNo: 'D402', customerName: 'Anil', sanctionedAmount: '28000', loanBank: 'SBI', loanAccountNo: '7788990011', loanInterest: '2800', status: 'Successful' },
  ],
};

export const fetchLoanDetails = async () => {
  return {
    success: true,
    data: loanDetailsData
  };
};

// ==================== ADMIN: LOAN DOCUMENTS DATA ====================
const loanDocumentsData = {
  loans: [
    { srNo: 1, flatNo: 'A1', name: 'V.REVATHI', contactNo: '9966801523', paymentPlan: 'CLP', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 2, flatNo: 'A101', name: 'SMT. Z SINCY', contactNo: '9052730815', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 3, flatNo: 'A102', name: 'S V NARASIMHA SWAMY', contactNo: '9704008535', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 4, flatNo: 'A103', name: 'RAJ KUMAR REDDY KOMMIDI', contactNo: '9538775554', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 5, flatNo: 'A104', name: 'D. SAI AKSHAY RAJ', contactNo: '8008233657', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 6, flatNo: 'A105', name: 'ARASANI SREEKANTH REDDY', contactNo: '9963377522', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 7, flatNo: 'A106', name: 'RAVINDRANATH MEDISETTI', contactNo: '6300022405', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 8, flatNo: 'A107', name: 'CHANDRASEKHAR VEERASWAMI DONTHA', contactNo: '9819287227', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 9, flatNo: 'A108', name: 'KAPIL DEV CHOWDHRY', contactNo: '9177665757', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 10, flatNo: 'A109', name: 'MUTHADI SRIDHAR REDDY', contactNo: '9618245135', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 11, flatNo: 'A11', name: 'Ashu', contactNo: '1234567890', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 12, flatNo: 'A110', name: 'SMT: SIRISHA MALYALA', contactNo: '8125308700', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 13, flatNo: 'A111', name: 'THAKUR DHEREN SINGH', contactNo: '8897543490', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 14, flatNo: 'A112', name: 'CHILUKURI RAMA KRISHNA', contactNo: '8463924759', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 15, flatNo: 'A201', name: 'N. DHANANJOY SINGH', contactNo: '7032909776', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 16, flatNo: 'A202', name: 'VIJAY KRISHNA MALLADI', contactNo: '9676892424', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 17, flatNo: 'A203', name: 'SMT. NALUMASU SINDHUJA', contactNo: '9666054123', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 18, flatNo: 'A204', name: 'SAI KUMAR VALLURI', contactNo: '8008044487', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 19, flatNo: 'A205', name: 'KOMMANA PRADEEP', contactNo: '8790572832', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 20, flatNo: 'A206', name: 'RAJESH KUMAR', contactNo: '9876543210', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 21, flatNo: 'A207', name: 'PRIYA SHARMA', contactNo: '8765432109', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 22, flatNo: 'A208', name: 'AMIT SINGH', contactNo: '7654321098', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 23, flatNo: 'A209', name: 'SUNITA DEVI', contactNo: '6543210987', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 24, flatNo: 'A210', name: 'VIKRAM REDDY', contactNo: '5432109876', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes' },
    { srNo: 25, flatNo: 'B101', name: 'KAVITHA RAO', contactNo: '4321098765', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
  ],
};

export const fetchLoanDocuments = async () => {
  return {
    success: true,
    data: loanDocumentsData
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
  fetchFlatStatus,
  fetchReports,
  fetchLoanDetails,
  fetchLoanDocuments,
};

