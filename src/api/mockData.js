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
    { label: "Double Car Parking", value: "250000" },
    { label: "Extra Car Parking", value: "50000" },
    { label: "Water Charges", value: "1000" },
    { label: "Electricity Charges", value: "1000" },
    { label: "Security Deposit", value: "10000" },
    { label: "Advance Payment", value: "10000" },
    { label: "Total Amount", value: "6848100" },
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

// ==================== ADMIN: BOOKED FLATS DETAILED DATA ====================
const bookedFlatsDetails = [
  {
    flatNo: 'A101', customerName: 'V.REVATHI', coApplicantName: 'V.RAMA MOHAN RAO', email: 'vure.rama.mohan.rao@gmail.com', contactNo: '9966801523', panNo: 'BBEPV4857L', bookingDate: '11-10-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1386', companyRate: '5000', loginRate: '5600', totalCost: '8396700', dueAmount: '6037650', pendingAmount: '0', paidAmount: '8219625', cleared: '8219625', dueTax: '301884', pendingTax: '301884', paidTax: '0', clearedTax: '0', totalPending: '301884', address: 'H.No. 12-3-456, RTC Colony, Vijayawada, Andhra Pradesh - 520001'
  },
  {
    flatNo: 'A103', customerName: 'Ashu', coApplicantName: '—', email: 'user1@example.com', contactNo: '1234567890', panNo: 'AAAPA1234A', bookingDate: '08-09-2025', dealer: 'GHPL', paymentPlan: 'CLP', area: '1500', companyRate: '5000', loginRate: '1000', totalCost: '1584000', dueAmount: '4605000', pendingAmount: '4605000', paidAmount: '0', cleared: '0', dueTax: '230250', pendingTax: '230250', paidTax: '0', clearedTax: '0', totalPending: '4835250', address: 'Flat 304, Green Valley Apartments, Gachibowli, Hyderabad, Telangana - 500032'
  },
  {
    flatNo: 'A105', customerName: 'SRAVANTHI PULLELA', coApplicantName: 'RAHUL PULLELA', email: 'rahul.pullela@gmail.com', contactNo: '9963371173', panNo: 'CQYPS7558K', bookingDate: '25-06-2022', dealer: 'GHPL', paymentPlan: 'CLP', area: '1171', companyRate: '5000', loginRate: '5600', totalCost: '56936400', dueAmount: '6765300', pendingAmount: '6765300', paidAmount: '0', cleared: '0', dueTax: '338265', pendingTax: '338265', paidTax: '0', clearedTax: '0', totalPending: '7103565', address: 'Door No. 45, Srinagar Colony, Begumpet, Hyderabad, Telangana - 500016'
  },
  {
    flatNo: 'B102', customerName: 'SURESH', coApplicantName: '—', email: 'suresh@example.com', contactNo: '9876543210', panNo: 'ABCDE1234F', bookingDate: '14-10-2025', dealer: 'HDFC', paymentPlan: 'EMI', area: '1231', companyRate: '5000', loginRate: '4000', totalCost: '6140000', dueAmount: '1188000', pendingAmount: '1188000', paidAmount: '0', cleared: '0', dueTax: '59400', pendingTax: '59400', paidTax: '0', clearedTax: '0', totalPending: '1247400', address: 'Plot No. 89, Sector 12, Hitech City, Hyderabad, Telangana - 500081'
  },
  {
    flatNo: 'C302', customerName: 'CHILUKURI RAMA KRISHNA', coApplicantName: '—', email: 'hrkrishna@gmail.com', contactNo: '8463924759', panNo: 'AEHPC6394L', bookingDate: '07-01-2022', dealer: 'GHPL', paymentPlan: 'CLP', area: '1500', companyRate: '5000', loginRate: '5500', totalCost: '56584500', dueAmount: '6819000', pendingAmount: '6819000', paidAmount: '0', cleared: '0', dueTax: '340953', pendingTax: '340953', paidTax: '0', clearedTax: '0', totalPending: '7159953', address: 'H.No. 23-4-567, Dwarakanagar, Visakhapatnam, Andhra Pradesh - 530016'
  },
  {
    flatNo: 'B117', customerName: 'RAGHAVENDER YADGIRKAR', coApplicantName: '—', email: 'yadgirkar_y@rediffmail.com', contactNo: '9849037894', panNo: 'AYPYG1234L', bookingDate: '16-04-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1171', companyRate: '5000', loginRate: '5000', totalCost: '5855000', dueAmount: '5000000', pendingAmount: '500000', paidAmount: '855000', cleared: '855000', dueTax: '250000', pendingTax: '25000', paidTax: '42750', clearedTax: '42750', totalPending: '525000', address: 'Flat 502, Sunshine Towers, Banjara Hills, Hyderabad, Telangana - 500034'
  },
  {
    flatNo: 'A201', customerName: 'PRASAD REDDY', coApplicantName: '—', email: 'prasad.reddy@gmail.com', contactNo: '9876543211', panNo: 'ABCPR1234A', bookingDate: '15-03-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1171', companyRate: '5000', loginRate: '5000', totalCost: '5855000', dueAmount: '4500000', pendingAmount: '350000', paidAmount: '1355000', cleared: '1355000', dueTax: '225000', pendingTax: '17500', paidTax: '67750', clearedTax: '67750', totalPending: '367500', address: 'H.No. 8-2-293/82, Jubilee Hills, Hyderabad, Telangana - 500033'
  },
  {
    flatNo: 'B205', customerName: 'KAVITHA SHARMA', coApplicantName: 'RAJESH SHARMA', email: 'kavitha.sharma@yahoo.com', contactNo: '9765432109', panNo: 'DEFKS5678B', bookingDate: '22-05-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1231', companyRate: '5000', loginRate: '5000', totalCost: '6155000', dueAmount: '4800000', pendingAmount: '800000', paidAmount: '1355000', cleared: '1355000', dueTax: '240000', pendingTax: '40000', paidTax: '67750', clearedTax: '67750', totalPending: '840000', address: 'Flat 201, Lakeview Apartments, Kondapur, Hyderabad, Telangana - 500084'
  },
  {
    flatNo: 'C401', customerName: 'ANAND KUMAR', coApplicantName: '—', email: 'anand.kumar@email.com', contactNo: '9654321098', panNo: 'GHIAK9012C', bookingDate: '08-07-2021', dealer: 'HDFC', paymentPlan: 'EMI', area: '1386', companyRate: '5000', loginRate: '5000', totalCost: '6930000', dueAmount: '5200000', pendingAmount: '300000', paidAmount: '1730000', cleared: '1730000', dueTax: '260000', pendingTax: '15000', paidTax: '86500', clearedTax: '86500', totalPending: '315000', address: 'Plot 45, Phase 1, KPHB Colony, Kukatpally, Hyderabad, Telangana - 500072'
  },
  {
    flatNo: 'A306', customerName: 'SUNITA DEVI', coApplicantName: 'MOHAN LAL', email: 'sunita.devi@gmail.com', contactNo: '9543210987', panNo: 'JKLSM3456D', bookingDate: '14-09-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1500', companyRate: '5000', loginRate: '5000', totalCost: '7500000', dueAmount: '5500000', pendingAmount: '1000000', paidAmount: '2000000', cleared: '2000000', dueTax: '275000', pendingTax: '50000', paidTax: '100000', clearedTax: '100000', totalPending: '1050000', address: 'Flat 701, Grand Heights, Financial District, Nanakramguda, Hyderabad, Telangana - 500032'
  },
  {
    flatNo: 'B312', customerName: 'VIKRAM SINGH', coApplicantName: '—', email: 'vikram.singh@email.com', contactNo: '9432109876', panNo: 'MNOVI7890E', bookingDate: '25-11-2021', dealer: 'GHPL', paymentPlan: 'CLP', area: '1171', companyRate: '5000', loginRate: '5000', totalCost: '5855000', dueAmount: '4200000', pendingAmount: '650000', paidAmount: '1655000', cleared: '1655000', dueTax: '210000', pendingTax: '32500', paidTax: '82750', clearedTax: '82750', totalPending: '682500', address: 'H.No. 5-9-88, Chikkadpally, Hyderabad, Telangana - 500020'
  },
  {
    flatNo: 'C203', customerName: 'PRIYA PATEL', coApplicantName: 'AMIT PATEL', email: 'priya.patel@gmail.com', contactNo: '9321098765', panNo: 'PQRPP2345F', bookingDate: '03-01-2022', dealer: 'GHPL', paymentPlan: 'CLP', area: '1231', companyRate: '5000', loginRate: '5000', totalCost: '6155000', dueAmount: '4400000', pendingAmount: '900000', paidAmount: '1755000', cleared: '1755000', dueTax: '220000', pendingTax: '45000', paidTax: '87750', clearedTax: '87750', totalPending: '945000', address: 'Flat 303, Royal Enclave, Madhapur, Hyderabad, Telangana - 500081'
  },
  {
    flatNo: 'A408', customerName: 'RAJENDRA KUMAR', coApplicantName: '—', email: 'rajendra.kumar@yahoo.com', contactNo: '9210987654', panNo: 'STURK4567G', bookingDate: '18-02-2022', dealer: 'HDFC', paymentPlan: 'EMI', area: '1386', companyRate: '5000', loginRate: '5000', totalCost: '6930000', dueAmount: '5000000', pendingAmount: '1200000', paidAmount: '1930000', cleared: '1930000', dueTax: '250000', pendingTax: '60000', paidTax: '96500', clearedTax: '96500', totalPending: '1260000', address: 'H.No. 12-5-456, Tarnaka, Secunderabad, Telangana - 500017'
  },
  {
    flatNo: 'B109', customerName: 'LAKSHMI NARAYANAN', coApplicantName: 'SURESH NARAYANAN', email: 'lakshmi.n@gmail.com', contactNo: '9109876543', panNo: 'VWXLN5678H', bookingDate: '12-04-2022', dealer: 'GHPL', paymentPlan: 'CLP', area: '1500', companyRate: '5000', loginRate: '5000', totalCost: '7500000', dueAmount: '5300000', pendingAmount: '700000', paidAmount: '2200000', cleared: '2200000', dueTax: '265000', pendingTax: '35000', paidTax: '110000', clearedTax: '110000', totalPending: '735000', address: 'Flat 401, Skyline Towers, Manikonda, Hyderabad, Telangana - 500089'
  },
  {
    flatNo: 'C305', customerName: 'MAHESH REDDY', coApplicantName: '—', email: 'mahesh.reddy@email.com', contactNo: '9098765432', panNo: 'YZAMR6789I', bookingDate: '30-06-2022', dealer: 'GHPL', paymentPlan: 'CLP', area: '1171', companyRate: '5000', loginRate: '5000', totalCost: '5855000', dueAmount: '4100000', pendingAmount: '550000', paidAmount: '1755000', cleared: '1755000', dueTax: '205000', pendingTax: '27500', paidTax: '87750', clearedTax: '87750', totalPending: '577500', address: 'Plot 67, Sanjeeva Reddy Nagar, Hyderabad, Telangana - 500038'
  }
];

export const fetchBookedFlatsDetails = async () => {
  return {
    success: true,
    data: bookedFlatsDetails
  };
};

// ==================== ADMIN: BLOCKED FLATS DETAILED DATA ====================
const blockedFlatsDetails = [
  { flatNo: 'A104', customerName: 'Aalok', contactNo: '1234567891', bookingDate: '29-10-2025', dealer: 'GHPL' },
  { flatNo: 'B104', customerName: 'Rohit', contactNo: '9988776655', bookingDate: '10-11-2025', dealer: 'GHPL' },
  { flatNo: 'C402', customerName: 'Kiran', contactNo: '9812312312', bookingDate: '18-09-2025', dealer: 'GHPL' },
];

export const fetchBlockedFlatsDetails = async () => {
  return {
    success: true,
    data: blockedFlatsDetails
  };
};

// ==================== ADMIN: CANCELLED FLATS DETAILED DATA ====================
const cancelledFlatsDetails = [
  { flatNo: 'A105', customerName: 'BHASKAR', paidAmount: '0', dealer: 'GHPL', cancellationDate: '30-11-2001', remarks: '', status: 'In-Process' },
  { flatNo: 'A409', customerName: 'MS.', paidAmount: '1981800', dealer: 'GHPL', cancellationDate: '10-06-2020', remarks: 'Due to Covid-19.', status: 'Cancelled' },
];

export const fetchCancelledFlatsDetails = async () => {
  return {
    success: true,
    data: cancelledFlatsDetails
  };
};

// ==================== ADMIN: REFUNDED FLATS / CHEQUES DATA ====================
const refundedFlatsData = [
  { srNo: 1, flatNo: 'A103', clearedAmount: '0', refundedAmount: '200000', refundedDate: '15-06-2020', chequeNo: 'NEFT0', chequeBank: 'HDFC', chequeDate: '15-06-2020', chequeStatus: 'Cleared', remarks: 'refund the given account' },
  { srNo: 2, flatNo: 'A105', clearedAmount: '188250', refundedAmount: '188250', refundedDate: '03-11-2020', chequeNo: '555544', chequeBank: 'HDFC', chequeDate: '01-11-2020', chequeStatus: 'Cleared', remarks: 'Cancelled Flats' },
  { srNo: 3, flatNo: 'A105', clearedAmount: '111750', refundedAmount: '111750', refundedDate: '03-11-2020', chequeNo: '555545', chequeBank: 'HDFC', chequeDate: '01-11-2020', chequeStatus: 'Cleared', remarks: 'Cancelled Flats' },
];

const refundedChequesData = [
  { srNo: 4, flatNo: 'A105', clearedAmount: '-300000', refundedAmount: '-300000', refundedDate: '08-10-2025', chequeNo: '72727', chequeBank: 'HDFC', chequeDate: '01-10-2025', chequeStatus: 'InProcess', remarks: '72' },
  { srNo: 5, flatNo: 'A409', clearedAmount: '1981800', refundedAmount: '1282597', refundedDate: '03-11-2020', chequeNo: '55547', chequeBank: 'FEDER', chequeDate: '01-11-2020', chequeStatus: 'Cleared', remarks: 'Cancelled Flats' },
];

export const fetchRefundedFlats = async () => ({ success: true, data: refundedFlatsData });
export const fetchRefundedCheques = async () => ({ success: true, data: refundedChequesData });

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

// ==================== ADMIN: LOANED FLATS DATA ====================
const loanedFlatsData = {
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

export const fetchLoanedFlatsData = async () => {
  return {
    success: true,
    data: loanedFlatsData
  };
};

// ==================== ADMIN: LOAN DOCUMENTS DATA ====================
const loanDocumentsData = {
  loans: [
    { srNo: 1, flatNo: 'A1', name: 'V.REVATHI', contactNo: '9966801523', paymentPlan: 'CLP', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA76967SKV', employmentType: 'salaried', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Salary Slip (6 months for salaried)', 'Bank Statement (12 months current)'] },
    { srNo: 2, flatNo: 'A101', name: 'SMT. Z SINCY', contactNo: '9052730815', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 3, flatNo: 'A102', name: 'S V NARASIMHA SWAMY', contactNo: '9704008535', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 4, flatNo: 'A103', name: 'RAJ KUMAR REDDY KOMMIDI', contactNo: '9538775554', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA91234XYZ', employmentType: 'selfEmployed', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Builder Buyer Agreement', 'Credit Card Statement', 'Bank Statement (12 months current)'] },
    { srNo: 5, flatNo: 'A104', name: 'D. SAI AKSHAY RAJ', contactNo: '8008233657', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 6, flatNo: 'A105', name: 'ARASANI SREEKANTH REDDY', contactNo: '9963377522', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 7, flatNo: 'A106', name: 'RAVINDRANATH MEDISETTI', contactNo: '6300022405', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 8, flatNo: 'A107', name: 'CHANDRASEKHAR VEERASWAMI DONTHA', contactNo: '9819287227', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA87654ABC', employmentType: 'salaried', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Salary Slip (6 months for salaried)', 'Form 16 of 3 years'] },
    { srNo: 9, flatNo: 'A108', name: 'KAPIL DEV CHOWDHRY', contactNo: '9177665757', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 10, flatNo: 'A109', name: 'MUTHADI SRIDHAR REDDY', contactNo: '9618245135', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 11, flatNo: 'A11', name: 'Ashu', contactNo: '1234567890', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 12, flatNo: 'A110', name: 'SMT: SIRISHA MALYALA', contactNo: '8125308700', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA34567DEF', employmentType: 'selfEmployed', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Builder Buyer Agreement', 'ITR (3 years with balance sheet, computation P&L)'] },
    { srNo: 13, flatNo: 'A111', name: 'THAKUR DHEREN SINGH', contactNo: '8897543490', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 14, flatNo: 'A112', name: 'CHILUKURI RAMA KRISHNA', contactNo: '8463924759', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 15, flatNo: 'A201', name: 'N. DHANANJOY SINGH', contactNo: '7032909776', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 16, flatNo: 'A202', name: 'VIJAY KRISHNA MALLADI', contactNo: '9676892424', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA11111GHI', employmentType: 'salaried', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Salary Slip (6 months for salaried)', 'Bank Statement (12 months current)', 'Utility Bill (electricity bill, telephone bill, gas connection)'] },
    { srNo: 17, flatNo: 'A203', name: 'SMT. NALUMASU SINDHUJA', contactNo: '9666054123', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 18, flatNo: 'A204', name: 'SAI KUMAR VALLURI', contactNo: '8008044487', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 19, flatNo: 'A205', name: 'KOMMANA PRADEEP', contactNo: '8790572832', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 20, flatNo: 'A206', name: 'RAJESH KUMAR', contactNo: '9876543210', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA22222JKL', employmentType: 'selfEmployed', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Credit Card Statement', 'Bank Statement (12 months current)', 'Asset/Liabilities'] },
    { srNo: 21, flatNo: 'A207', name: 'PRIYA SHARMA', contactNo: '8765432109', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 22, flatNo: 'A208', name: 'AMIT SINGH', contactNo: '7654321098', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'No' },
    { srNo: 23, flatNo: 'A209', name: 'SUNITA DEVI', contactNo: '6543210987', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
    { srNo: 24, flatNo: 'A210', name: 'VIKRAM REDDY', contactNo: '5432109876', paymentPlan: 'EMI', bbaSigned: 'Yes', loanRequired: 'Yes', documentsReceived: 'Yes', kycId: 'TA33333MNO', employmentType: 'salaried', uploadedDocuments: ['ID Proof (PAN card mandatory/Company Id Card)', 'Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)', 'Salary Slip (6 months for salaried)', 'Form 16 of 3 years', 'Bank Statement (12 months current)'] },
    { srNo: 25, flatNo: 'B101', name: 'KAVITHA RAO', contactNo: '4321098765', paymentPlan: 'CLP', bbaSigned: 'No', loanRequired: 'No', documentsReceived: 'No' },
  ],
};

export const fetchLoanDocuments = async () => {
  return {
    success: true,
    data: loanDocumentsData
  };
};

export const updateLoanDocuments = async (flatNo, kycId, employmentType, uploadedDocuments) => {
  const loanIndex = loanDocumentsData.loans.findIndex(loan => loan.flatNo === flatNo);
  if (loanIndex !== -1) {
    loanDocumentsData.loans[loanIndex].kycId = kycId;
    loanDocumentsData.loans[loanIndex].employmentType = employmentType;
    loanDocumentsData.loans[loanIndex].uploadedDocuments = uploadedDocuments;
    loanDocumentsData.loans[loanIndex].documentsReceived = 'Yes';
    return {
      success: true,
      message: 'Loan documents updated successfully'
    };
  }
  return {
    success: false,
    message: 'Loan not found'
  };
};

// ==================== ADMIN: FLAT DETAIL CP DATA ====================
const flatDetailCPData = {
  flats: [
    { flatNo: 'A1', customerName: 'V.REVATHI', emailId: 'vure.rama.mohan.rao@gmail.com', contactNo: '9966801523', address: 'Flat No-16-104 Near Saibaba Temple, Huzusnagar, at Suryapet.', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5600, bookingDate: '11-10-2021', dealerId: 'GHPL' },
    { flatNo: 'A10', customerName: 'Mukul Sagar', emailId: 'ph23m006@smail.iitm.ac.in', contactNo: '9467676327', address: '141, Ganga IIT Madras', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4000, bookingDate: '01-10-2025', dealerId: 'HDFC' },
    { flatNo: 'A101', customerName: 'SMT. Z SINCY', emailId: 'mdvazeerahmad@gmail.com', contactNo: '9052730815', address: '#1-1-1007, Siddarthanagar, NIT Post, Kazipet, Warangal-506004, Telangana', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4100, bookingDate: '06-01-2020', dealerId: 'GHPL' },
    { flatNo: 'A102', customerName: 'S V NARASIMHA SWAMY', emailId: 'narasimha18sv@gmail.com', contactNo: '9704008535', address: '#2/78, Yenumulapalli, Puttaparthi, Anantapur-515134', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4050, bookingDate: '29-09-2019', dealerId: 'GHPL' },
    { flatNo: 'A103', customerName: 'RAJ KUMAR REDDY', emailId: 'raj.kumar@email.com', contactNo: '9876543210', address: '123 Main Street, Hyderabad', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5500, bookingDate: '15-03-2021', dealerId: 'GHPL' },
    { flatNo: 'A104', customerName: 'PRIYA SHARMA', emailId: 'priya.sharma@email.com', contactNo: '8765432109', address: '456 Park Avenue, Mumbai', paymentPlan: 'EMI', companyRate: 5000, loginRate: 4500, bookingDate: '20-04-2021', dealerId: 'HDFC' },
    { flatNo: 'A105', customerName: 'AMIT SINGH', emailId: 'amit.singh@email.com', contactNo: '7654321098', address: '789 Business District, Delhi', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5000, bookingDate: '10-05-2021', dealerId: 'ICICI' },
    { flatNo: 'B101', customerName: 'SUNITA DEVI', emailId: 'sunita.devi@email.com', contactNo: '6543210987', address: '321 Residential Area, Bangalore', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4800, bookingDate: '05-06-2021', dealerId: 'GHPL' },
    { flatNo: 'B102', customerName: 'VIKRAM KUMAR', emailId: 'vikram.kumar@email.com', contactNo: '5432109876', address: '654 Commercial Street, Chennai', paymentPlan: 'EMI', companyRate: 5000, loginRate: 4200, bookingDate: '25-07-2021', dealerId: 'HDFC' },
    { flatNo: 'C101', customerName: 'LAKSHMI NARAYANAN', emailId: 'lakshmi.n@email.com', contactNo: '4321098765', address: '987 Garden Road, Pune', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4600, bookingDate: '15-08-2021', dealerId: 'ICICI' },
  ],
};

export const fetchFlatDetailCP = async () => {
  return {
    success: true,
    data: flatDetailCPData
  };
};

// ==================== ADMIN: COMPLETE PAYMENT DATA ====================
const completePaymentData = {
  payments: [
    { srNo: 1, flatNo: 'A101', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phnNo: '9876543210', paymentPlan: 'CLP', dueAmount: '500000', pendingAmount: '200000', clearedAmount: '300000', inProcess: '50000', dueTax: '50000', pendingTax: '20000', paidTax: '25000', clearedTax: '5000', totalDues: '750000' },
    { srNo: 2, flatNo: 'A102', name: 'Priya Sharma', email: 'priya.sharma@email.com', phnNo: '8765432109', paymentPlan: 'CLP', dueAmount: '600000', pendingAmount: '150000', clearedAmount: '450000', inProcess: '75000', dueTax: '60000', pendingTax: '25000', paidTax: '30000', clearedTax: '5000', totalDues: '825000' },
    { srNo: 3, flatNo: 'A103', name: 'Amit Singh', email: 'amit.singh@email.com', phnNo: '7654321098', paymentPlan: 'CLP', dueAmount: '550000', pendingAmount: '250000', clearedAmount: '300000', inProcess: '60000', dueTax: '55000', pendingTax: '30000', paidTax: '20000', clearedTax: '5000', totalDues: '855000' },
    { srNo: 4, flatNo: 'B201', name: 'Sunita Devi', email: 'sunita.devi@email.com', phnNo: '6543210987', paymentPlan: 'Regular', dueAmount: '700000', pendingAmount: '100000', clearedAmount: '600000', inProcess: '80000', dueTax: '70000', pendingTax: '15000', paidTax: '40000', clearedTax: '15000', totalDues: '885000' },
    { srNo: 5, flatNo: 'B202', name: 'Vikram Reddy', email: 'vikram.reddy@email.com', phnNo: '5432109876', paymentPlan: 'Regular', dueAmount: '650000', pendingAmount: '300000', clearedAmount: '350000', inProcess: '70000', dueTax: '65000', pendingTax: '35000', paidTax: '25000', clearedTax: '5000', totalDues: '1010000' },
    { srNo: 6, flatNo: 'C301', name: 'Kavitha Rao', email: 'kavitha.rao@email.com', phnNo: '4321098765', paymentPlan: 'CLP', dueAmount: '580000', pendingAmount: '180000', clearedAmount: '400000', inProcess: '65000', dueTax: '58000', pendingTax: '20000', paidTax: '30000', clearedTax: '8000', totalDues: '863000' },
    { srNo: 7, flatNo: 'C302', name: 'Naresh Patel', email: 'naresh.patel@email.com', phnNo: '3210987654', paymentPlan: 'CLP', dueAmount: '620000', pendingAmount: '220000', clearedAmount: '400000', inProcess: '72000', dueTax: '62000', pendingTax: '28000', paidTax: '28000', clearedTax: '6000', totalDues: '904000' },
    { srNo: 8, flatNo: 'D401', name: 'Anjali Gupta', email: 'anjali.gupta@email.com', phnNo: '2109876543', paymentPlan: 'Regular', dueAmount: '680000', pendingAmount: '120000', clearedAmount: '560000', inProcess: '78000', dueTax: '68000', pendingTax: '18000', paidTax: '35000', clearedTax: '15000', totalDues: '886000' },
    { srNo: 9, flatNo: 'D402', name: 'Rohit Verma', email: 'rohit.verma@email.com', phnNo: '1098765432', paymentPlan: 'Regular', dueAmount: '590000', pendingAmount: '190000', clearedAmount: '400000', inProcess: '68000', dueTax: '59000', pendingTax: '22000', paidTax: '32000', clearedTax: '5000', totalDues: '873000' },
    { srNo: 10, flatNo: 'A104', name: 'Deepa Nair', email: 'deepa.nair@email.com', phnNo: '9876543211', paymentPlan: 'CLP', dueAmount: '540000', pendingAmount: '240000', clearedAmount: '300000', inProcess: '62000', dueTax: '54000', pendingTax: '30000', paidTax: '22000', clearedTax: '2000', totalDues: '894000' },
    { srNo: 11, flatNo: 'B203', name: 'Suresh Iyer', email: 'suresh.iyer@email.com', phnNo: '8765432110', paymentPlan: 'Regular', dueAmount: '610000', pendingAmount: '210000', clearedAmount: '400000', inProcess: '71000', dueTax: '61000', pendingTax: '25000', paidTax: '28000', clearedTax: '8000', totalDues: '897000' },
    { srNo: 12, flatNo: 'C303', name: 'Meera Joshi', email: 'meera.joshi@email.com', phnNo: '7654321109', paymentPlan: 'CLP', dueAmount: '570000', pendingAmount: '170000', clearedAmount: '400000', inProcess: '66000', dueTax: '57000', pendingTax: '19000', paidTax: '29000', clearedTax: '9000', totalDues: '853000' },
    { srNo: 13, flatNo: 'D403', name: 'Arjun Menon', email: 'arjun.menon@email.com', phnNo: '6543211098', paymentPlan: 'Regular', dueAmount: '630000', pendingAmount: '230000', clearedAmount: '400000', inProcess: '73000', dueTax: '63000', pendingTax: '32000', paidTax: '26000', clearedTax: '5000', totalDues: '918000' },
    { srNo: 14, flatNo: 'A105', name: 'Lakshmi Pillai', email: 'lakshmi.pillai@email.com', phnNo: '5432110987', paymentPlan: 'CLP', dueAmount: '560000', pendingAmount: '160000', clearedAmount: '400000', inProcess: '64000', dueTax: '56000', pendingTax: '18000', paidTax: '30000', clearedTax: '8000', totalDues: '842000' },
    { srNo: 15, flatNo: 'B204', name: 'Kiran Desai', email: 'kiran.desai@email.com', phnNo: '4321109876', paymentPlan: 'Regular', dueAmount: '590000', pendingAmount: '190000', clearedAmount: '400000', inProcess: '69000', dueTax: '59000', pendingTax: '21000', paidTax: '31000', clearedTax: '7000', totalDues: '870000' },
  ],
};

export const fetchCompletePayment = async () => {
  return {
    success: true,
    data: completePaymentData
  };
};

// ==================== ADMIN: NO DISCOUNT DATA ====================
// NoDiscount means flats where Company Rate equals Login Rate (no discount given)
const noDiscountData = bookedFlatsDetails.filter(flat => 
  flat.companyRate === flat.loginRate
).map((flat, idx) => ({
  srNo: idx + 1,
  flatNo: flat.flatNo,
  name: flat.customerName,
  email: flat.email,
  contactNo: flat.contactNo,
  paymentPlan: flat.paymentPlan,
  dealer: flat.dealer,
  companyRate: flat.companyRate,
  loginRate: flat.loginRate,
  bookingDate: flat.bookingDate
}));

export const fetchNoDiscount = async () => {
  return {
    success: true,
    data: noDiscountData
  };
};

// ==================== ADMIN: EXTRA DISCOUNT DATA ====================
// ExtraDiscount means flats where Company Rate does NOT equal Login Rate (discount given)
const extraDiscountData = bookedFlatsDetails.filter(flat => 
  flat.companyRate !== flat.loginRate
).map((flat, idx) => ({
  srNo: idx + 1,
  flatNo: flat.flatNo,
  name: flat.customerName,
  email: flat.email,
  contactNo: flat.contactNo,
  paymentPlan: flat.paymentPlan,
  dealer: flat.dealer,
  companyRate: flat.companyRate,
  loginRate: flat.loginRate,
  bookingDate: flat.bookingDate
}));

export const fetchExtraDiscount = async () => {
  return {
    success: true,
    data: extraDiscountData
  };
};

// ==================== ADMIN: EXTRA PAYMENT DATA ====================
// ExtraPayment shows flats with payment details (due amount, paid amount, taxes)
const extraPaymentData = bookedFlatsDetails.map((flat, idx) => ({
  srNo: idx + 1,
  flatNo: flat.flatNo,
  name: flat.customerName,
  email: flat.email,
  contactNo: flat.contactNo,
  dueAmount: flat.dueAmount || '0',
  paidAmount: flat.paidAmount || '0',
  dueTax: flat.dueTax || '0',
  paidTax: flat.paidTax || '0',
  pendingTax: flat.pendingTax || '0'
}));

export const fetchExtraPayment = async () => {
  return {
    success: true,
    data: extraPaymentData
  };
};

// ==================== ADMIN: BBA SIGNED DATA ====================
// BBASigned shows flats where BBA (Builder Buyer Agreement) is signed
const bbaSignedData = loanDocumentsData.loans.filter(loan => 
  loan.bbaSigned === 'Yes'
).map((loan, idx) => ({
  srNo: idx + 1,
  flatNo: loan.flatNo,
  name: loan.name,
  contactNo: loan.contactNo
}));

export const fetchBBASigned = async () => {
  return {
    success: true,
    data: bbaSignedData
  };
};

// ==================== ADMIN: UNSIGNED BBA DATA ====================
// UnsignedBBA shows flats where BBA (Builder Buyer Agreement) is not signed
const unsignedBBAData = loanDocumentsData.loans.filter(loan => 
  loan.bbaSigned === 'No'
).map((loan, idx) => ({
  srNo: idx + 1,
  flatNo: loan.flatNo,
  name: loan.name,
  contactNo: loan.contactNo
}));

export const fetchUnsignedBBA = async () => {
  return {
    success: true,
    data: unsignedBBAData
  };
};

// ==================== ADMIN: COMMON DOCUMENTS DATA ====================
const commonDocumentsData = [
  { srNo: 1, documentName: 'Project Plan', type: 'PDF', uploadDate: '2024-10-01', size: '2.5 MB', status: 'Approved' },
  { srNo: 2, documentName: 'NOC Certificate', type: 'PDF', uploadDate: '2024-10-02', size: '1.8 MB', status: 'Approved' },
  { srNo: 3, documentName: 'Fire Safety Certificate', type: 'PDF', uploadDate: '2024-10-03', size: '3.2 MB', status: 'Pending' },
  { srNo: 4, documentName: 'Building Plan', type: 'PDF', uploadDate: '2024-10-04', size: '5.1 MB', status: 'Approved' },
  { srNo: 5, documentName: 'Environmental Clearance', type: 'PDF', uploadDate: '2024-10-05', size: '2.9 MB', status: 'Approved' },
  { srNo: 6, documentName: 'Completion Certificate', type: 'PDF', uploadDate: '2024-10-06', size: '5.1 MB', status: 'Approved' },
  { srNo: 7, documentName: 'Occupancy Certificate', type: 'PDF', uploadDate: '2024-10-07', size: '2.9 MB', status: 'Approved' },
  { srNo: 8, documentName: 'Structural Stability Certificate', type: 'PDF', uploadDate: '2024-10-08', size: '5.1 MB', status: 'Approved' },
  { srNo: 9, documentName: 'Electrical Safety Certificate', type: 'PDF', uploadDate: '2024-10-09', size: '2.9 MB', status: 'Approved' },
  { srNo: 10, documentName: 'Water Supply NOC', type: 'PDF', uploadDate: '2024-10-10', size: '5.1 MB', status: 'Approved' },
  { srNo: 11, documentName: 'Sewage Connection NOC', type: 'PDF', uploadDate: '2024-10-11', size: '2.9 MB', status: 'Approved' },
  { srNo: 12, documentName: 'Layout Plan Approval', type: 'PDF', uploadDate: '2024-10-12', size: '5.1 MB', status: 'Approved' },
];

export const fetchCommonDocuments = async () => {
  return {
    success: true,
    data: commonDocumentsData
  };
};

// ==================== ADMIN: FLAT DOCUMENTS DATA ====================
const flatDocumentsData = [
  // Block A documents
  { srNo: 1, flatNo: 'A101', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-01', status: 'Approved' },
  { srNo: 2, flatNo: 'A101', documentName: 'Allotment Letter', type: 'PDF', uploadDate: '2024-10-02', status: 'Approved' },
  { srNo: 3, flatNo: 'A101', documentName: 'Payment Receipt', type: 'PDF', uploadDate: '2024-10-03', status: 'Approved' },
  { srNo: 4, flatNo: 'A102', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-04', status: 'Approved' },
  { srNo: 5, flatNo: 'A102', documentName: 'Allotment Letter', type: 'PDF', uploadDate: '2024-10-05', status: 'Pending' },
  { srNo: 6, flatNo: 'A103', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-06', status: 'Approved' },
  { srNo: 7, flatNo: 'A103', documentName: 'Possession Letter', type: 'PDF', uploadDate: '2024-10-07', status: 'Approved' },
  { srNo: 8, flatNo: 'A201', documentName: 'Parking Allotment', type: 'PDF', uploadDate: '2024-10-08', status: 'Approved' },
  { srNo: 9, flatNo: 'A201', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-09', status: 'Approved' },
  { srNo: 10, flatNo: 'A202', documentName: 'Payment Receipt', type: 'PDF', uploadDate: '2024-10-10', status: 'Pending' },
  // Block B documents
  { srNo: 11, flatNo: 'B101', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-11', status: 'Approved' },
  { srNo: 12, flatNo: 'B102', documentName: 'Maintenance Agreement', type: 'PDF', uploadDate: '2024-10-12', status: 'Pending' },
  { srNo: 13, flatNo: 'B102', documentName: 'Allotment Letter', type: 'PDF', uploadDate: '2024-10-13', status: 'Approved' },
  { srNo: 14, flatNo: 'B203', documentName: 'Payment Receipt', type: 'PDF', uploadDate: '2024-10-14', status: 'Approved' },
  { srNo: 15, flatNo: 'B203', documentName: 'Parking Allotment', type: 'PDF', uploadDate: '2024-10-15', status: 'Approved' },
  { srNo: 16, flatNo: 'B301', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-16', status: 'Approved' },
  { srNo: 17, flatNo: 'B301', documentName: 'Possession Letter', type: 'PDF', uploadDate: '2024-10-17', status: 'Pending' },
  // Block C documents
  { srNo: 18, flatNo: 'C101', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-18', status: 'Approved' },
  { srNo: 19, flatNo: 'C102', documentName: 'Allotment Letter', type: 'PDF', uploadDate: '2024-10-19', status: 'Approved' },
  { srNo: 20, flatNo: 'C205', documentName: 'Handover Certificate', type: 'PDF', uploadDate: '2024-10-20', status: 'Approved' },
  { srNo: 21, flatNo: 'C304', documentName: 'Registry Document', type: 'PDF', uploadDate: '2024-10-21', status: 'Approved' },
  { srNo: 22, flatNo: 'C304', documentName: 'Payment Receipt', type: 'PDF', uploadDate: '2024-10-22', status: 'Pending' },
  { srNo: 23, flatNo: 'C401', documentName: 'Sale Agreement', type: 'PDF', uploadDate: '2024-10-23', status: 'Approved' },
  { srNo: 24, flatNo: 'C401', documentName: 'Maintenance Agreement', type: 'PDF', uploadDate: '2024-10-24', status: 'Approved' },
];

export const fetchFlatDocuments = async () => {
  return {
    success: true,
    data: flatDocumentsData
  };
};

// ==================== ADMIN: LEGAL DOCUMENTS DATA ====================
const legalDocumentsData = [
  { srNo: 1, documentName: 'Title Deed', type: 'PDF', category: 'Property', uploadDate: '2024-10-01', status: 'Approved' },
  { srNo: 2, documentName: 'Legal Opinion', type: 'PDF', category: 'Compliance', uploadDate: '2024-10-02', status: 'Approved' },
  { srNo: 3, documentName: 'Court Order', type: 'PDF', category: 'Litigation', uploadDate: '2024-10-03', status: 'Pending' },
  { srNo: 4, documentName: 'Power of Attorney', type: 'PDF', category: 'Authorization', uploadDate: '2024-10-04', status: 'Approved' },
  { srNo: 5, documentName: 'Encumbrance Certificate', type: 'PDF', category: 'Property', uploadDate: '2024-10-05', status: 'Approved' },
  { srNo: 6, documentName: 'Land Use Certificate', type: 'PDF', category: 'Property', uploadDate: '2024-10-06', status: 'Approved' },
  { srNo: 7, documentName: 'Development Agreement', type: 'PDF', category: 'Contract', uploadDate: '2024-10-07', status: 'Approved' },
];

export const fetchLegalDocuments = async () => {
  return {
    success: true,
    data: legalDocumentsData
  };
};

// ==================== ADMIN: UPLOAD LOAN DOCUMENT LISTS ====================
const loanDocumentLists = {
  salariedDocuments: [
    "6 Photos",
    "Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)",
    "ID Proof (PAN card mandatory/Company Id Card)",
    "Last 3 Years ITR",
    "Form 16 of 3 years",
    "Bank Statement (12 months current)",
    "Salary Slip (6 months for salaried)",
    "Utility Bill (electricity bill, telephone bill, gas connection)",
    "LIC detail/Prop. Details",
    "Credit Card Statement",
    "Rent Agreement/Owner Electricity bill",
    "Visiting Card",
  ],
  selfEmployedDocuments: [
    "6 Photos",
    "Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)",
    "ID Proof (PAN card mandatory/Company Id Card)",
    "ITR (3 years with balance sheet, computation P&L)",
    "Bank Statement (12 months current)",
    "Utility Bill (electricity bill, telephone bill, gas connection)",
    "LIC detail/Prop. Details",
    "Credit Card Statement",
    "Rent Agreement/Owner Electricity bill",
    "Builder Buyer Agreement",
    "Receipt/ Payment Schedule CLP",
    "Asset/Liabilities",
    "Visiting Card",
    "Tin No. PhotoCopy",
    "Bill of Firm",
  ],
};

export const fetchLoanDocumentLists = async () => {
  return {
    success: true,
    data: loanDocumentLists
  };
};

// ==================== ADMIN: FLAT LEGAL DOCUMENTS DATA ====================
const flatLegalDocumentsData = [
  // Block A legal documents
  { srNo: 1, flatNo: 'A101', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-01', status: 'Approved' },
  { srNo: 2, flatNo: 'A101', documentName: 'Mutation Certificate', legalType: 'Property Transfer', uploadDate: '2024-10-02', status: 'Approved' },
  { srNo: 3, flatNo: 'A101', documentName: 'Property Tax Receipt', legalType: 'Tax', uploadDate: '2024-10-03', status: 'Approved' },
  { srNo: 4, flatNo: 'A102', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-04', status: 'Approved' },
  { srNo: 5, flatNo: 'A102', documentName: 'Mutation Certificate', legalType: 'Property Transfer', uploadDate: '2024-10-05', status: 'Pending' },
  { srNo: 6, flatNo: 'A103', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-06', status: 'Approved' },
  { srNo: 7, flatNo: 'A103', documentName: 'BBA Agreement', legalType: 'Contract', uploadDate: '2024-10-07', status: 'Approved' },
  { srNo: 8, flatNo: 'A201', documentName: 'Property Tax Receipt', legalType: 'Tax', uploadDate: '2024-10-08', status: 'Approved' },
  { srNo: 9, flatNo: 'A201', documentName: 'Encumbrance Certificate', legalType: 'Verification', uploadDate: '2024-10-09', status: 'Approved' },
  { srNo: 10, flatNo: 'A202', documentName: 'Possession Certificate', legalType: 'Handover', uploadDate: '2024-10-10', status: 'Pending' },
  // Block B legal documents
  { srNo: 11, flatNo: 'B101', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-11', status: 'Approved' },
  { srNo: 12, flatNo: 'B102', documentName: 'Registry Extract', legalType: 'Registration', uploadDate: '2024-10-12', status: 'Pending' },
  { srNo: 13, flatNo: 'B102', documentName: 'Mutation Certificate', legalType: 'Property Transfer', uploadDate: '2024-10-13', status: 'Approved' },
  { srNo: 14, flatNo: 'B203', documentName: 'Possession Certificate', legalType: 'Handover', uploadDate: '2024-10-14', status: 'Approved' },
  { srNo: 15, flatNo: 'B203', documentName: 'Property Tax Receipt', legalType: 'Tax', uploadDate: '2024-10-15', status: 'Approved' },
  { srNo: 16, flatNo: 'B301', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-16', status: 'Approved' },
  { srNo: 17, flatNo: 'B301', documentName: 'BBA Agreement', legalType: 'Contract', uploadDate: '2024-10-17', status: 'Pending' },
  // Block C legal documents
  { srNo: 18, flatNo: 'C101', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-18', status: 'Approved' },
  { srNo: 19, flatNo: 'C102', documentName: 'Mutation Certificate', legalType: 'Property Transfer', uploadDate: '2024-10-19', status: 'Approved' },
  { srNo: 20, flatNo: 'C205', documentName: 'Encumbrance Certificate', legalType: 'Verification', uploadDate: '2024-10-20', status: 'Approved' },
  { srNo: 21, flatNo: 'C304', documentName: 'Encumbrance Certificate', legalType: 'Verification', uploadDate: '2024-10-21', status: 'Approved' },
  { srNo: 22, flatNo: 'C304', documentName: 'Property Tax Receipt', legalType: 'Tax', uploadDate: '2024-10-22', status: 'Pending' },
  { srNo: 23, flatNo: 'C401', documentName: 'Sale Deed', legalType: 'Registration', uploadDate: '2024-10-23', status: 'Approved' },
  { srNo: 24, flatNo: 'C401', documentName: 'BBA Agreement', legalType: 'Contract', uploadDate: '2024-10-24', status: 'Approved' },
];

export const fetchFlatLegalDocuments = async () => {
  return {
    success: true,
    data: flatLegalDocumentsData
  };
};

// ==================== EXPORT ALL ====================
// ==================== ADMIN: PROJECTS DATA ====================
const projectsData = [
  {
    id: 1,
    name: 'The Art Residency',
    builder: 'GHPL Constructions',
    location: 'Hyderabad, Telangana',
    description: 'Premium residential project with modern amenities',
    startDate: '2021-01-15',
    endDate: '2024-12-31',
    isActive: true,
    createdAt: '15-01-2021',
    blocks: [
      { id: 1, name: 'Block A', description: 'East facing premium apartments' },
      { id: 2, name: 'Block B', description: 'West facing luxury flats' },
      { id: 3, name: 'Block C', description: 'North facing spacious units' }
    ]
  },
  {
    id: 2,
    name: 'Orchid Heights',
    builder: 'Orchid Developers',
    location: 'Bangalore, Karnataka',
    description: 'Luxury high-rise apartments with world-class facilities',
    startDate: '2021-03-22',
    endDate: '2025-06-30',
    isActive: true,
    createdAt: '22-03-2021',
    blocks: []
  },
  {
    id: 3,
    name: 'Green Valley',
    builder: 'Green Homes',
    location: 'Chennai, Tamil Nadu',
    description: 'Eco-friendly residential complex with green spaces',
    startDate: '2020-06-10',
    endDate: '2023-12-31',
    isActive: false,
    createdAt: '10-06-2020',
    blocks: [
      { id: 1, name: 'Phase 1', description: 'Completed residential phase' },
      { id: 2, name: 'Phase 2', description: 'Completed commercial phase' }
    ]
  },
  {
    id: 4,
    name: 'Sunrise Towers',
    builder: 'GHPL Constructions',
    location: 'Mumbai, Maharashtra',
    description: 'Modern residential towers with sea view',
    startDate: '2021-08-05',
    endDate: '2025-12-31',
    isActive: true,
    createdAt: '05-08-2021',
    blocks: []
  },
  {
    id: 5,
    name: 'Pine Garden',
    builder: 'Orchid Developers',
    location: 'Pune, Maharashtra',
    description: 'Gated community with extensive greenery',
    startDate: '2020-04-12',
    endDate: '2023-06-30',
    isActive: false,
    createdAt: '12-04-2020',
    blocks: [
      { id: 1, name: 'Sector A', description: 'Villa plots' },
      { id: 2, name: 'Sector B', description: 'Apartment complex' }
    ]
  },
  {
    id: 6,
    name: 'Silver Springs',
    builder: 'Silver Estates',
    location: 'Gurgaon, Haryana',
    description: 'Ultra-luxury residential project',
    startDate: '2022-01-20',
    endDate: '2026-03-31',
    isActive: true,
    createdAt: '20-01-2022',
    blocks: [
      { id: 1, name: 'Block 1', description: 'Premium penthouses' },
      { id: 2, name: 'Block 2', description: 'Luxury apartments' }
    ]
  },
  {
    id: 7,
    name: 'Royal Enclave',
    builder: 'GHPL Constructions',
    location: 'Kolkata, West Bengal',
    description: 'Heritage-style luxury apartments',
    startDate: '2021-11-15',
    endDate: '2025-09-30',
    isActive: true,
    createdAt: '15-11-2021',
    blocks: [
      { id: 1, name: 'Heritage Block', description: 'Classic architecture units' },
      { id: 2, name: 'Modern Block', description: 'Contemporary design flats' }
    ]
  },
  {
    id: 8,
    name: 'Lake View Residency',
    builder: 'Green Homes',
    location: 'Coimbatore, Tamil Nadu',
    description: 'Lakeside residential community',
    startDate: '2020-09-08',
    endDate: '2023-08-31',
    isActive: false,
    createdAt: '08-09-2020',
    blocks: [
      { id: 1, name: 'Lakefront', description: 'Direct lake view apartments' },
      { id: 2, name: 'Garden View', description: 'Garden-facing units' }
    ]
  },
  {
    id: 9,
    name: 'Skyline Towers',
    builder: 'Orchid Developers',
    location: 'Noida, Uttar Pradesh',
    description: 'High-rise residential complex',
    startDate: '2022-05-10',
    endDate: '2026-12-31',
    isActive: true,
    createdAt: '10-05-2022',
    blocks: []
  },
  {
    id: 10,
    name: 'Paradise Homes',
    builder: 'Paradise Builders',
    location: 'Jaipur, Rajasthan',
    description: 'Affordable housing project',
    startDate: '2021-07-01',
    endDate: '2024-06-30',
    isActive: true,
    createdAt: '01-07-2021',
    blocks: [
      { id: 1, name: 'Block A', description: '2BHK apartments' },
      { id: 2, name: 'Block B', description: '3BHK apartments' }
    ]
  }
];

export const fetchProjects = async () => {
  return {
    success: true,
    data: projectsData
  };
};

// ==================== ADMIN: FLAT DETAILS DATA ====================
const flatDetailsAdminData = {
  flatNo: 'A-101',
  status: 'Booked',
  floor: '1st Floor',
  block: 'A',
  size: '2 BHK',
  customerInfo: {
    name: 'V.REVATHI',
    contactNo: '9966801523',
    panNo: 'BBEPV4857L',
    kycId: 'TA21143V',
    address: 'Flat No-16-104 Near Saibaba Temple, Huzusnagar, at Suryapet.',
    fatherHusband: 'V.RAMA MOHAN RAO',
    email: 'vure.rama.mohan.rao@gmail.com',
    dob: '05-06-1955'
  },
  coApplicantInfo: {
    name: 'V.RAMA MOHAN RAO',
    contactNo: '',
    panNo: '',
    address: '',
    fatherHusband: 'V.NARAYANA RAO',
    email: '',
    dob: '07-06-1946'
  },
  flatInfo: {
    area: '1386 Sq.ft',
    bookingDate: '2025-09-08',
    paymentPlan: 'CLP',
    channelPartner: 'GHPL (Change)',
    totalCost: '8396700',
    totalBookingAmount: '300000',
    // New fields for edit mode
    dealer: 'GHPL',
    companyRate: '5000',
    loginRate: '1000',
    scheme: 'NSC',
    // Applicable PLC charges
    ground: '',
    amenities: '100',
    corpusFund: '70',
    ewsw: '100',
    hmwssb: '0',
    homeAutomation: '100',
    maintenance1stYear: '40',
    maintenance2ndYear: '40',
    singleCarParking: '150000'
  },
  charges: {
    extraCharges: 'View Applicable Charges',
    dueAmount: '6037650',
    paidAmount: '8219625',
    pendingAmount: '0',
    dueTax: '301884',
    paidTax: '0',
    clearedTax: '0',
    pendingTax: '301884'
  },
  paymentInfo: [
    {
      srNo: 1,
      chequeCount: 2,
      chequeNo: '811778',
      amount: '447000',
      onAccountOf: 'Flat Cost (ORCHID)',
      bank: 'HDFC',
      chequeDate: '15-11-2021',
      chequeStatus: 'CLEARED',
      clearingDate: '15-11-2021',
      remarks: '',
      account: 7,
      updatedBy: 'bhavani'
    },
    {
      srNo: 2,
      chequeCount: 14,
      chequeNo: '000001',
      amount: '753000',
      onAccountOf: 'Flat Cost (GHPL)',
      bank: 'HDFC',
      chequeDate: '20-11-2021',
      chequeStatus: 'CLEARED',
      clearingDate: '20-11-2021',
      remarks: '',
      account: 5,
      updatedBy: 'bhavani'
    },
    {
      srNo: 3,
      chequeCount: 18,
      chequeNo: '000002',
      amount: '500000',
      onAccountOf: 'Flat Cost (ORCHID)',
      bank: 'HDFC',
      chequeDate: '25-11-2021',
      chequeStatus: 'CLEARED',
      clearingDate: '25-11-2021',
      remarks: '',
      account: 7,
      updatedBy: 'bhavani'
    },
    {
      srNo: 4,
      chequeCount: 20,
      chequeNo: '000003',
      amount: '350000',
      onAccountOf: 'Flat Cost (GHPL)',
      bank: 'ICICI',
      chequeDate: '01-12-2021',
      chequeStatus: 'CLEARED',
      clearingDate: '02-12-2021',
      remarks: 'Partial payment',
      account: 5,
      updatedBy: 'bhavani'
    },
    {
      srNo: 5,
      chequeCount: 25,
      chequeNo: '000004',
      amount: '600000',
      onAccountOf: 'Flat Cost (ORCHID)',
      bank: 'SBI',
      chequeDate: '10-12-2021',
      chequeStatus: 'PENDING',
      clearingDate: '',
      remarks: 'Under process',
      account: 7,
      updatedBy: 'admin'
    }
  ]
};

export const fetchFlatDetailsAdmin = async (flatNo) => {
  // Return a copy with requested flatNo so UI reflects the selected flat
  // Deep copy to ensure nested objects are preserved
  const dataForFlat = {
    ...flatDetailsAdminData,
    flatNo: flatNo || flatDetailsAdminData.flatNo,
    customerInfo: {
      ...flatDetailsAdminData.customerInfo
    },
    coApplicantInfo: {
      ...flatDetailsAdminData.coApplicantInfo
    },
    flatInfo: {
      ...flatDetailsAdminData.flatInfo
    }
  };
  return {
    success: true,
    data: dataForFlat
  };
};

// ==================== ADMIN: VIEW HANDOVER DATA ====================
const viewHandoverData = [
  { id: 1, flatNo: 'A-101' },
  { id: 2, flatNo: 'A-102' },
  { id: 3, flatNo: 'B-201' },
  { id: 4, flatNo: 'B-202' },
  { id: 5, flatNo: 'C-301' },
];

export const fetchViewHandover = async () => {
  return {
    success: true,
    data: viewHandoverData
  };
};

// ==================== ADMIN: VIEW CUSTOMIZATION DATA ====================
const viewCustomizationData = [
  { id: 1, flatNo: 'A-101', taxAmount: '5000' },
  { id: 2, flatNo: 'B-202', taxAmount: '3500' },
  { id: 3, flatNo: 'C-303', taxAmount: '4200' },
  { id: 4, flatNo: 'D-404', taxAmount: '2800' },
];

export const fetchViewCustomization = async () => {
  return {
    success: true,
    data: viewCustomizationData
  };
};

// ==================== ADMIN: VIEW ACTIVITIES DATA ====================
const viewActivitiesData = [
  { id: 1, name: 'Flooring' },
  { id: 2, name: 'Painting' },
  { id: 3, name: 'Plumbing' },
  { id: 4, name: 'Electrical' },
  { id: 5, name: 'Carpentry' },
];

export const fetchViewActivities = async () => {
  return {
    success: true,
    data: viewActivitiesData
  };
};

// ==================== ADMIN: FLAT HANDOVER ACTIVITIES DATA ====================
const flatHandoverActivitiesData = [
  {
    id: 1,
    title: 'Main Door',
    subs: [
      'Main door frame & beeding',
      'Door shutter & frame polish',
      'Lock fixing',
      'Tower bolt fixing',
      'Stopper',
    ],
  },
  {
    id: 2,
    title: 'Drawing Room',
    subs: [
      'Upvc window fixing with mesh',
      'Grills fixing',
      'Electrical db door',
      'Communication box',
      'Electrical switches',
    ],
  },
  {
    id: 3,
    title: 'Dining',
    subs: [
      'Sliding door',
      'Flooring & skirting',
      'Electrical switches',
      'Half wash basin with fittings',
      'Paint',
    ],
  },
];

export const fetchFlatHandoverActivities = async () => {
  return {
    success: true,
    data: flatHandoverActivitiesData
  };
};

// ==================== ADMIN: VIEW ACTIVITY DATA ====================
const viewActivityData = [
  { id: 1, activity: 'Main Door', subs: ['Main door frame & beeding', 'Door shutter & frame polish', 'Lock fixing', 'Tower bolt fixing', 'Stopper'] },
  { id: 2, activity: 'Drawing Room', subs: ['Upvc window fixing with mesh', 'Grills fixing', 'Electrical DB door', 'Communication box', 'Electrical switches', 'Paint', 'Flooring & skirting'] },
  { id: 3, activity: 'Dining', subs: ['Sliding door', 'Flooring & skirting', 'Electrical switches', 'Half wash basin with fittings', 'Paint'] },
  { id: 4, activity: 'Kitchen', subs: ['Kitchen sink', 'Faucet', 'Tiles', 'Electrical switches'] },
];

export const fetchViewActivity = async () => {
  return {
    success: true,
    data: viewActivityData
  };
};

// ==================== ADMIN: ACTIVITY TO SUBACTIVITY MAPPING ====================
const activityToSubactivityData = {
  Flooring: ['Tiles', 'Granite', 'Wooden'],
  Painting: ['Primer', 'Putty', 'Final Coat'],
  Plumbing: ['Pipes', 'Fittings', 'Fixtures'],
  Electrical: ['Wiring', 'Switches', 'Lights'],
  Carpentry: ['Doors', 'Windows', 'Furniture'],
};

export const fetchActivityToSubactivity = async () => {
  return {
    success: true,
    data: activityToSubactivityData
  };
};

// ==================== ADMIN: BLOCKS & TOWERS DATA ====================
const blocksData = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const fetchBlocks = async () => {
  return {
    success: true,
    data: blocksData
  };
};

export const fetchTowersByProject = async (projectId) => {
  // This function is kept for backward compatibility but should use API
  // Components should use propertiesAPI.getTowers() directly
  // For now, return empty array - components should use API
  return {
    success: true,
    data: []
  };
};

// Fetch blocks by project ID
export const fetchBlocksByProject = async (projectId, towerId = null) => {
  // This function is kept for backward compatibility but should use API
  // Import propertiesAPI at the top of the file if needed, or use directly in components
  // For now, return empty array - components should use propertiesAPI.getBlocks() directly
  return {
    success: true,
    data: []
  };
};

// ==================== ADMIN: FLAT TEMPLATES DATA ====================
const flatTemplatesData = [
  {
    id: 1,
    name: 'Standard 2BHK',
    flats: [
      { flatNumber: '101', type: '2BHK', area: '1171' },
      { flatNumber: '102', type: '2BHK', area: '1171' },
      { flatNumber: '103', type: '2BHK', area: '1231' },
      { flatNumber: '104', type: '2BHK', area: '1231' }
    ]
  },
  {
    id: 2,
    name: 'Mixed Floor',
    flats: [
      { flatNumber: '101', type: '2BHK', area: '1171' },
      { flatNumber: '102', type: '3BHK', area: '1500' },
      { flatNumber: '103', type: '2BHK', area: '1231' },
      { flatNumber: '104', type: '3BHK', area: '1650' }
    ]
  },
  {
    id: 3,
    name: 'Luxury Floor',
    flats: [
      { flatNumber: '101', type: '4BHK', area: '2000' },
      { flatNumber: '102', type: '4BHK', area: '2100' },
      { flatNumber: '103', type: '4BHK', area: '2200' }
    ]
  }
];

export const fetchFlatTemplates = async () => {
  return {
    success: true,
    data: flatTemplatesData
  };
};

// ==================== ADMIN: CUSTOMIZATION TYPES DATA ====================
const customizationTypesData = ['Flooring', 'Painting', 'Plumbing', 'Electrical', 'Other'];

export const fetchCustomizationTypes = async () => {
  return {
    success: true,
    data: customizationTypesData
  };
};

// ==================== ADMIN: DEALER IDs DATA ====================
const dealerIdsData = ['D001', 'D002', 'D003', 'D004', 'D005'];

export const fetchDealerIds = async () => {
  return {
    success: true,
    data: dealerIdsData
  };
};

// ==================== ADMIN: MONTHS DATA ====================
const monthsData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const fetchMonths = async () => {
  return {
    success: true,
    data: monthsData
  };
};

// ==================== ADMIN: YEARS DATA ====================
const getYearsData = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 15 }, (_, i) => currentYear - 5 + i);
};

export const fetchYears = async () => {
  return {
    success: true,
    data: getYearsData()
  };
};

// ==================== ADMIN: CASH DATA ====================
const cashData = [
  { srNo: 1, flatNo: 'A103', channelPartner: 'GHPL', amount: '17867', date: '2021-05-12', receivedBy: 'John Doe', remarks: '', account: '', updatedBy: 'bhavani', status: 'Yes' },
  { srNo: 2, flatNo: 'A501', channelPartner: 'GHPL', amount: '62527', date: '2021-07-10', receivedBy: 'Jane Smith', remarks: '', account: '007605004803', updatedBy: 'bhavani', status: 'No' },
  { srNo: 3, flatNo: 'A102', channelPartner: 'GHPL', amount: '25000', date: '2021-06-15', receivedBy: 'Mike Johnson', remarks: '', account: '007605004802', updatedBy: 'admin', status: 'Yes' },
  { srNo: 4, flatNo: 'B201', channelPartner: 'GHPL', amount: '50000', date: '2021-08-20', receivedBy: 'Sarah Williams', remarks: 'Cash payment', account: '', updatedBy: 'admin', status: 'No' },
  { srNo: 5, flatNo: 'C301', channelPartner: 'GHPL', amount: '30000', date: '2021-09-05', receivedBy: 'Tom Brown', remarks: '', account: '007605004804', updatedBy: 'bhavani', status: 'Yes' },
];

export const fetchCashData = async () => {
  return {
    success: true,
    data: cashData
  };
};

// ==================== ADMIN: NEFT DATA ====================
const neftData = [
  { srNo: 1, flatNo: 'A103', amount: '17867', date: '2021-05-12', neftNo: 'NEFT001234', remarks: '', account: '', updatedBy: 'bhavani' },
  { srNo: 2, flatNo: 'A501', amount: '62527', date: '2021-07-10', neftNo: 'NEFT001235', remarks: '', account: '007605004803', updatedBy: 'bhavani' },
  { srNo: 3, flatNo: 'A102', amount: '25000', date: '2021-06-15', neftNo: 'NEFT001236', remarks: '', account: '007605004802', updatedBy: 'admin' },
  { srNo: 4, flatNo: 'B201', amount: '50000', date: '2021-08-20', neftNo: 'NEFT001237', remarks: 'NEFT payment', account: '', updatedBy: 'admin' },
  { srNo: 5, flatNo: 'C301', amount: '30000', date: '2021-09-05', neftNo: 'NEFT001238', remarks: '', account: '007605004804', updatedBy: 'bhavani' },
];

export const fetchNeftData = async () => {
  return {
    success: true,
    data: neftData
  };
};

// ==================== ADMIN: CHEQUE DATA ====================
const chequeData = [
  { srNo: 1, flatNo: 'A103', customer: 'RAJ KUMAR REDDY KOMMIDI', paymentPlan: 'CLP', channelPartner: 'GHPL', chequeNo: '277726', chequeAmount: '17867', amount: '17867', onAccountOf: 'Service Tax', bank: 'HDFC', date: '2021-05-12', chequeDate: '2021-05-10', status: 'In Process', account: '', remarks: '', updatedBy: 'bhavani', favor: 'ORCHID', receivingDate: '2021-05-12', clearingDate: '', receiverBank: 'NA' },
  { srNo: 2, flatNo: 'A501', customer: 'BIKUMALLA ASHOK', paymentPlan: 'CLP', channelPartner: 'GHPL', chequeNo: '000018', chequeAmount: '62527', amount: '62527', onAccountOf: 'Service Tax', bank: 'ICICI', date: '2021-07-10', chequeDate: '2021-07-08', status: 'In Process', account: '007605004803', remarks: '', updatedBy: 'bhavani', favor: 'ORCHID', receivingDate: '2021-07-10', clearingDate: '', receiverBank: 'NA' },
  { srNo: 3, flatNo: 'A102', customer: 'PRIYA SHARMA', paymentPlan: 'CLP', channelPartner: 'GHPL', chequeNo: '277727', chequeAmount: '25000', amount: '25000', onAccountOf: 'Booking Advance', bank: 'HDFC', date: '2021-06-15', chequeDate: '2021-06-13', status: 'Cleared', account: '007605004802', remarks: '', updatedBy: 'admin', favor: 'ORCHID', receivingDate: '2021-06-15', clearingDate: '', receiverBank: 'NA' },
  { srNo: 4, flatNo: 'B201', customer: 'AMIT SINGH', paymentPlan: 'Regular', channelPartner: 'GHPL', chequeNo: '000019', chequeAmount: '50000', amount: '50000', onAccountOf: 'Agreement Sale', bank: 'ICICI', date: '2021-08-20', chequeDate: '2021-08-18', status: 'Bounced', account: '', remarks: 'Insufficient funds', updatedBy: 'admin', favor: 'ORCHID', receivingDate: '2021-08-20', clearingDate: '', receiverBank: 'NA' },
  { srNo: 5, flatNo: 'C301', customer: 'SUNITA DEVI', paymentPlan: 'CLP', channelPartner: 'GHPL', chequeNo: '277728', chequeAmount: '30000', amount: '30000', onAccountOf: 'Installment', bank: 'HDFC', date: '2021-09-05', chequeDate: '2021-09-03', status: 'Cleared', account: '007605004804', remarks: '', updatedBy: 'bhavani', favor: 'ORCHID', receivingDate: '2021-09-05', clearingDate: '', receiverBank: 'NA' },
];

export const fetchChequeData = async () => {
  return {
    success: true,
    data: chequeData
  };
};

// ==================== ADMIN: MANAGE USER DATA ====================
const manageUserCategoriesData = [
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
  {
    id: 'newBooking',
    name: 'New Booking',
    hasSubcategories: false,
    subcategories: []
  },
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
  {
    id: 'flatsVerification',
    name: 'Flats Verification',
    hasSubcategories: false,
    subcategories: []
  },
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
  {
    id: 'flatsSummary',
    name: 'Flats Summary',
    hasSubcategories: false,
    subcategories: []
  },
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
  {
    id: 'setReminder',
    name: 'Set Reminder',
    hasSubcategories: false,
    subcategories: []
  },
  {
    id: 'constructionUpdates',
    name: 'Construction Updates',
    hasSubcategories: false,
    subcategories: []
  },
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
  {
    id: 'reports',
    name: 'Reports',
    hasSubcategories: true,
    subcategories: [
      { name: 'User Logs', hasSubcategories: false, subcategories: [] }
    ]
  }
];

const manageUserRoles = [
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

const manageUserRoleDefaults = {
  'Super Administrator': { manage: true, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': true, 'Access Roles': true, 'Add User': true, 'Disable User': true, 'Manage Channel Partner': true, 'Manage Commission': true, 'Add Commission': true, 'Calculate Interest': true, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': true, 'Signed BBA': true, 'Unsigned BBA': true, channelPartners: true, 'Add Channel Partner': true, 'View All': true, 'Release Commission': true, 'Paid Commission': true, bookedFlats: true, 'Floor Wise': true, 'Block Wise': true, 'Size Wise': true, 'Month Wise': true, blockedFlats: true, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: true, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: true, Mortgaged: true, flatsSummary: true, projectSnapshot: true, 'View Coupons': true, 'Installment Report': true, 'CLP Report': true, 'Final Report': true, 'Today Report': true, 'Datewise Report': true, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: true, 'Add Activity': true, 'Add Subactivity': true, 'Flat H.over Activity': true, 'View Flat H.A.': true, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: true, 'User Logs': true },
  'Administrator': { manage: false, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': true, 'Access Roles': true, 'Add User': true, 'Disable User': true, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': true, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': true, 'Signed BBA': true, 'Unsigned BBA': true, channelPartners: true, 'Add Channel Partner': true, 'View All': true, 'Release Commission': true, 'Paid Commission': true, bookedFlats: true, 'Floor Wise': true, 'Block Wise': true, 'Size Wise': true, 'Month Wise': true, blockedFlats: true, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: true, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: true, Mortgaged: true, flatsSummary: true, projectSnapshot: true, 'View Coupons': true, 'Installment Report': true, 'CLP Report': true, 'Final Report': true, 'Today Report': true, 'Datewise Report': true, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: true, 'Add Activity': true, 'Add Subactivity': true, 'Flat H.over Activity': true, 'View Flat H.A.': true, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: true, 'User Logs': true },
  'Lower Administrator': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': true, newBooking: true, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: true, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: true, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: true, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: true, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: true, Mortgaged: false, flatsSummary: true, projectSnapshot: true, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: true, constructionUpdates: true, flatCustomization: true, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: true, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: true, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: true, 'User Logs': false },
  'Accounts': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': true, 'Add Commission': true, 'Calculate Interest': true, 'Construction Stages': false, newBooking: false, blockInventory: true, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': true, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: true, 'Refunded Flats': true, 'Refunded Cheques': true, paymentReceived: true, Cheques: true, Cash: true, NEFT: true, 'In Process': true, Cleared: true, Bounced: true, Adjustment: true, paymentStatus: true, 'Complete Payment': true, 'Balance Payment': true, 'No Payment': true, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
  'Customer': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: false, blockInventory: false, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
  'Channel Partner': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': true, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: true, blockInventory: true, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: true, 'No Discount': true, 'Extra Discount': true, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: true, 'Add Channel Partner': false, 'View All': true, 'Release Commission': false, 'Paid Commission': false, bookedFlats: true, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: true, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
  'Flat Customization': { manage: false, 'Manage Bank': false, 'Favouring Bank': false, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': true, newBooking: false, blockInventory: true, 'Floor wise': true, 'Block wise': true, 'Size wise': true, customer: false, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: true, loan: false, 'Loaned Flats': false, 'Loan Documents': false, All: false, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: true, 'Activity Type': true, Customize: true, 'View Customization': true, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: false, 'Upload Common Docs': false, 'View Common Docs': false, 'Upload Flat Docs': false, 'View Flat Docs': false, 'Upload Legal Docs': false, 'View Legal Docs': false, 'Upload Flat Legal Docs': false, 'View Flat Legal Docs': false, reports: false, 'User Logs': false },
  'Legal': { manage: false, 'Manage Bank': true, 'Favouring Bank': true, 'Manage User': false, 'Access Roles': false, 'Add User': false, 'Disable User': false, 'Manage Channel Partner': false, 'Manage Commission': false, 'Add Commission': false, 'Calculate Interest': false, 'Construction Stages': false, newBooking: false, blockInventory: false, 'Floor wise': false, 'Block wise': false, 'Size wise': false, customer: false, 'No Discount': false, 'Extra Discount': false, 'Extra Payment': false, 'Signed BBA': false, 'Unsigned BBA': false, channelPartners: false, 'Add Channel Partner': false, 'View All': false, 'Release Commission': false, 'Paid Commission': false, bookedFlats: false, 'Floor Wise': false, 'Block Wise': false, 'Size Wise': false, 'Month Wise': false, blockedFlats: false, cancelledFlats: false, 'Refunded Flats': false, 'Refunded Cheques': false, paymentReceived: false, Cheques: false, Cash: false, NEFT: false, 'In Process': false, Cleared: false, Bounced: false, Adjustment: false, paymentStatus: false, 'Complete Payment': false, 'Balance Payment': false, 'No Payment': false, flatsVerification: false, loan: true, 'Loaned Flats': true, 'Loan Documents': true, All: true, flatsStatus: false, Mortgaged: false, flatsSummary: false, projectSnapshot: false, 'View Coupons': false, 'Installment Report': false, 'CLP Report': false, 'Final Report': false, 'Today Report': false, 'Datewise Report': false, setReminder: false, constructionUpdates: false, flatCustomization: false, 'Activity Type': false, Customize: false, 'View Customization': false, handoverActivities: false, 'Add Activity': false, 'Add Subactivity': false, 'Flat H.over Activity': false, 'View Flat H.A.': false, documentsSection: true, 'Upload Common Docs': true, 'View Common Docs': true, 'Upload Flat Docs': true, 'View Flat Docs': true, 'Upload Legal Docs': true, 'View Legal Docs': true, 'Upload Flat Legal Docs': true, 'View Flat Legal Docs': true, reports: false, 'User Logs': false }
};

const manageUserUsernamesByRole = {
  'Super Administrator': ['admin', 'super_admin_1', 'root'],
  'Administrator': ['admin1', 'manager', 'admin_user'],
  'Lower Administrator': ['lower_admin1', 'lower_admin2', 'assistant'],
  'Accounts': ['accountant1', 'accountant2', 'finance_user'],
  'Customer': ['customer1', 'customer2', 'guest_user'],
  'Channel Partner': ['partner1', 'partner2', 'channel_user'],
  'Flat Customization': ['custom1', 'custom2', 'customization_user'],
  'Legal': ['legal1', 'legal2', 'legal_user']
};

export const fetchManageUserCategories = async () => ({
  success: true,
  data: manageUserCategoriesData
});

export const fetchManageUserRoles = async () => ({
  success: true,
  data: manageUserRoles
});

export const fetchManageUserRoleDefaults = async () => ({
  success: true,
  data: manageUserRoleDefaults
});

export const fetchManageUserUsernamesByRole = async () => ({
  success: true,
  data: manageUserUsernamesByRole
});

export const getManageUserUsernamesForRole = (role) => {
  return manageUserUsernamesByRole[role] || [];
};

// ==================== ADMIN: CHANNEL PARTNERS DATA ====================
const channelPartnersData = [
  {
    id: 'CP001',
    userId: 'USER001',
    name: 'John Smith',
    companyName: 'GHPL Constructions',
    flatTypes: ['2BHK_1171', '2BHK_1298', '2BHK_1386', '2BHK_1231', '2BHK_1308', '2BHK_753', '2BHK_1271', '2BHK_1355', '3BHK_1534', '3BHK_1554', '3BHK_1611', '3BHK_1646', '3BHK_1535', '3BHK_1584', '3BHK_1614', '3BHK_1649', '3BHK_1475', '3BHK_1552', '3BHK_1604', '3BHK_1618', '3BHK_1694']
  },
  {
    id: 'CP002',
    userId: 'USER002',
    name: 'Sarah Johnson',
    companyName: 'HDFC Realty',
    flatTypes: ['2BHK_1171', '2BHK_1298', '2BHK_1386', '2BHK_1231', '2BHK_1308', '2BHK_753', '2BHK_1271', '2BHK_1355', '3BHK_1534', '3BHK_1554', '3BHK_1611', '3BHK_1646', '3BHK_1535', '3BHK_1584', '3BHK_1614', '3BHK_1649', '3BHK_1475', '3BHK_1552', '3BHK_1604', '3BHK_1618', '3BHK_1694']
  },
  {
    id: 'CP003',
    userId: 'USER003',
    name: 'Michael Chen',
    companyName: 'ICICI Properties',
    flatTypes: ['2BHK_1171', '2BHK_1298', '2BHK_1386', '2BHK_1231', '2BHK_1308', '2BHK_753', '2BHK_1271', '2BHK_1355', '3BHK_1534', '3BHK_1554', '3BHK_1611', '3BHK_1646', '3BHK_1535', '3BHK_1584', '3BHK_1614', '3BHK_1649', '3BHK_1475', '3BHK_1552', '3BHK_1604', '3BHK_1618', '3BHK_1694']
  },
  {
    id: 'CP004',
    userId: 'USER004',
    name: 'Priya Sharma',
    companyName: 'Axis Real Estate',
    flatTypes: ['2BHK_1171', '2BHK_1298', '2BHK_1386', '2BHK_1231', '2BHK_1308', '2BHK_753', '2BHK_1271', '2BHK_1355', '3BHK_1534', '3BHK_1554', '3BHK_1611', '3BHK_1646', '3BHK_1535', '3BHK_1584', '3BHK_1614', '3BHK_1649', '3BHK_1475', '3BHK_1552', '3BHK_1604', '3BHK_1618', '3BHK_1694']
  },
  {
    id: 'CP005',
    userId: 'USER005',
    name: 'Raj Kumar',
    companyName: 'SBI Housing',
    flatTypes: ['2BHK_1171', '2BHK_1298', '2BHK_1386', '2BHK_1231', '2BHK_1308', '2BHK_753', '2BHK_1271', '2BHK_1355', '3BHK_1534', '3BHK_1554', '3BHK_1611', '3BHK_1646', '3BHK_1535', '3BHK_1584', '3BHK_1614', '3BHK_1649', '3BHK_1475', '3BHK_1552', '3BHK_1604', '3BHK_1618', '3BHK_1694']
  }
];

export const fetchChannelPartners = async () => {
  return {
    success: true,
    data: channelPartnersData
  };
};

export const fetchChannelPartnerByDealerId = async (dealerId) => {
  // Sample detailed channel partner data based on dealer ID
  const partnerDetailsMap = {
    'GHPL': {
      dealerId: 'GHPL',
      name: 'Giridhari Homes Pvt.',
      contactNo: '9999999999',
      address: 'Test Address',
      city: 'Hyderabad',
      pin: '',
      state: 'Andra Pradesh',
      emailId: 'info@giridharihomes.com',
      panNo: 'TEMPZ1234S',
      company: '',
      profession: '',
      designation: '',
      commissionDetails: [
        {
          commissionType: 'Percentage',
          flatType: 'all',
          commissionAmount: 9
        }
      ]
    },
    'HDFC': {
      dealerId: 'HDFC',
      name: 'HDFC Realty Partners',
      contactNo: '8888888888',
      address: '123 Business Center',
      city: 'Mumbai',
      pin: '400001',
      state: 'Maharashtra',
      emailId: 'info@hdfcrealty.com',
      panNo: 'ABCDE1234F',
      company: 'HDFC Realty',
      profession: 'Real Estate',
      designation: 'Partner',
      commissionDetails: [
        {
          commissionType: 'Percentage',
          flatType: 'all',
          commissionAmount: 8
        }
      ]
    },
    'ICICI': {
      dealerId: 'ICICI',
      name: 'ICICI Properties Ltd.',
      contactNo: '7777777777',
      address: '456 Financial District',
      city: 'Delhi',
      pin: '110001',
      state: 'Delhi',
      emailId: 'info@iciciproperties.com',
      panNo: 'FGHIJ5678K',
      company: 'ICICI Properties',
      profession: 'Real Estate',
      designation: 'Director',
      commissionDetails: [
        {
          commissionType: 'Percentage',
          flatType: 'all',
          commissionAmount: 7.5
        }
      ]
    }
  };

  const partnerDetails = partnerDetailsMap[dealerId];
  
  if (partnerDetails) {
    return {
      success: true,
      data: partnerDetails
    };
  } else {
    // Default partner details if dealer ID not found
    return {
      success: true,
      data: {
        dealerId: dealerId,
        name: 'Unknown Partner',
        contactNo: '',
        address: '',
        city: '',
        pin: '',
        state: '',
        emailId: '',
        panNo: '',
        company: '',
        profession: '',
        designation: '',
        commissionDetails: []
      }
    };
  }
};

// ==================== ADMIN: CP DETAIL DATA ====================
export const fetchCPDetail = async (dealerId) => {
  // Sample CP Detail data based on dealer ID
  const cpDetailMap = {
    'GHPL': {
      dealerId: 'GHPL',
      dealerName: 'Giridhari Homes Pvt.',
      records: [
        { flatNo: 'A1', customerName: 'V.REVATHI', contactNo: '9966801523', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5600, dealRate: 0, dueAmount: 6176250, clearedAmount: 8219625, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'A101', customerName: 'SMT. Z SINCY', contactNo: '9052730815', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4100, dealRate: 0, dueAmount: 5500000, clearedAmount: 3000000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'A102', customerName: 'S V NARASIMHA SWAMY', contactNo: '9704008535', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4050, dealRate: 0, dueAmount: 4800000, clearedAmount: 2500000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'A103', customerName: 'RAJ KUMAR REDDY', contactNo: '9876543210', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5500, dealRate: 0, dueAmount: 5000000, clearedAmount: 3500000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'B101', customerName: 'SUNITA DEVI', contactNo: '6543210987', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4800, dealRate: 0, dueAmount: 5500000, clearedAmount: 3200000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
      ]
    },
    'HDFC': {
      dealerId: 'HDFC',
      dealerName: 'HDFC Realty Partners',
      records: [
        { flatNo: 'A10', customerName: 'Mukul Sagar', contactNo: '9467676327', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4000, dealRate: 0, dueAmount: 6000000, clearedAmount: 4000000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'A104', customerName: 'PRIYA SHARMA', contactNo: '8765432109', paymentPlan: 'EMI', companyRate: 5000, loginRate: 4500, dealRate: 0, dueAmount: 6200000, clearedAmount: 4200000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'B102', customerName: 'VIKRAM KUMAR', contactNo: '5432109876', paymentPlan: 'EMI', companyRate: 5000, loginRate: 4200, dealRate: 0, dueAmount: 5800000, clearedAmount: 3800000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
      ]
    },
    'ICICI': {
      dealerId: 'ICICI',
      dealerName: 'ICICI Properties Ltd.',
      records: [
        { flatNo: 'A105', customerName: 'AMIT SINGH', contactNo: '7654321098', paymentPlan: 'CLP', companyRate: 5000, loginRate: 5000, dealRate: 0, dueAmount: 5500000, clearedAmount: 3500000, totalCommission: 0, commissionAfterTDS: 0, total: 0 },
        { flatNo: 'C101', customerName: 'LAKSHMI NARAYANAN', contactNo: '4321098765', paymentPlan: 'CLP', companyRate: 5000, loginRate: 4600, dealRate: 0, dueAmount: 5600000, clearedAmount: 3600000, totalCommission: 0, commissionAfterTDS: 0, total: 0 }
      ]
    }
  };

  const cpDetail = cpDetailMap[dealerId];
  
  if (cpDetail) {
    return {
      success: true,
      data: cpDetail
    };
  } else {
    // Default data if dealer ID not found
    return {
      success: true,
      data: {
        dealerId: dealerId,
        dealerName: 'Unknown Partner',
        records: []
      }
    };
  }
};

// ==================== ADMIN: CONSTRUCTION STAGES DATA ====================
const paymentPlansData = ['CLP', 'PR', 'EMI', 'Regular'];
const loanBanksData = ['Self', 'PNB', 'SBI', 'HDFC', 'ICICI', 'Axis Bank'];
const constructionStagesBlocksData = ['A', 'B', 'C', 'D', 'E', 'F'];

const constructionStagesInstallmentsData = {
  CLP: [
    { installmentNo: 1, description: 'Booking Advance', amount: '10% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 2, description: 'At the time of Agreement of Sale', amount: '20% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 3, description: 'Completion of Cellar Slab', amount: '15% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '06-12-2019' },
    { installmentNo: 4, description: 'Completion of 5th Slab', amount: '25% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '14-01-2020' },
    { installmentNo: 5, description: 'Completion of First Stage of Internal works', amount: '5% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '28-02-2020' },
    { installmentNo: 6, description: 'Completion of 2nd Stage of Internal works', amount: '5% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 7, description: 'Completion of external works', amount: '5% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 8, description: 'Completion of hardware works', amount: '10% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 9, description: 'At the time of registration', amount: '5% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 10, description: 'At the time of registration', amount: '100% EWSW Cost', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 11, description: 'At the time of registration', amount: '100% of Home Automation Cost', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 12, description: 'Corpus Fund', amount: '100% Corpus Fund', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 13, description: 'Maintenance for 1st year', amount: '100% Maintenance Charges', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 14, description: 'Maintenance for 2nd year', amount: '100% Maintenance Charges', status: 'In Process', completionDate: '30-11-0001' }
  ],
  PR: [
    { installmentNo: 1, description: 'Booking Advance', amount: '10% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 2, description: 'At the time of Agreement of Sale', amount: '20% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 3, description: 'Completion of Cellar Slab', amount: '15% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' }
  ],
  EMI: [
    { installmentNo: 1, description: 'Booking Advance', amount: '10% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 2, description: 'At the time of Agreement of Sale', amount: '20% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 3, description: 'Monthly EMI', amount: 'As per EMI schedule', status: 'In Process', completionDate: '30-11-0001' }
  ],
  Regular: [
    { installmentNo: 1, description: 'Booking Advance', amount: '10% of (BSP+Amenities+Car Parking)', status: 'Cleared', completionDate: '30-11-0001' },
    { installmentNo: 2, description: 'At the time of Agreement of Sale', amount: '20% of (BSP+Amenities+Car Parking)', status: 'In Process', completionDate: '30-11-0001' },
    { installmentNo: 3, description: 'Regular Payment', amount: 'As per payment schedule', status: 'In Process', completionDate: '30-11-0001' }
  ]
};

export const fetchPaymentPlans = async () => {
  return {
    success: true,
    data: paymentPlansData
  };
};

export const fetchLoanBanks = async () => {
  return {
    success: true,
    data: loanBanksData
  };
};

export const fetchConstructionStagesBlocks = async () => {
  return {
    success: true,
    data: constructionStagesBlocksData
  };
};

export const fetchConstructionStagesInstallments = async (paymentPlan) => {
  return {
    success: true,
    data: constructionStagesInstallmentsData[paymentPlan] || []
  };
};

// ==================== BUILDERS DATA ====================
const buildersData = [
  {
    id: 1,
    name: 'ABC Developers',
    companyName: 'ABC Developers Pvt Ltd',
    email: 'contact@abcdevelopers.com',
    phone: '+91 9876543210',
    alternatePhone: '+91 9876543211',
    type: 'Company',
    status: 'Verified',
    totalProjects: 12,
    joinedOn: '2023-01-15',
    avatar: null,
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001'
    },
    website: 'https://www.abcdevelopers.com',
    gstNumber: '27AABCU9603R1ZM',
    reraNumber: 'MHMRE/123456/2023',
    companyOwner: {
      name: 'Priya Mehta',
      email: 'priya.mehta@abcdevelopers.com',
      phone: '+91 9876543200',
      alternatePhone: '+91 9876543201'
    },
    builderAdmin: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@abcdevelopers.com',
      phone: '+91 9876543220',
      alternatePhone: '+91 9876543221'
    },
    defaultCommission: '5',
    businessDescription: 'Leading real estate developer with over 20 years of experience in residential and commercial projects.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Verified', uploadedOn: '2024-01-15' },
      { id: 2, type: 'GST', fileName: 'gst_certificate.pdf', status: 'Verified', uploadedOn: '2024-01-16' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Verified', uploadedOn: '2024-01-17' }
    ],
    projects: [
      { id: 1, name: 'Green Gardens', type: 'Residential', status: 'Active', units: 120, createdOn: '2023-02-10' },
      { id: 2, name: 'Sky Towers', type: 'Commercial', status: 'Active', units: 80, createdOn: '2023-05-20' },
      { id: 3, name: 'Sunset Villas', type: 'Residential', status: 'Completed', units: 50, createdOn: '2022-11-15' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2024-01-15 10:00 AM' },
      { id: 2, activity: 'Email updated', performedBy: 'Admin User', timestamp: '2024-01-16 11:30 AM' },
      { id: 3, activity: 'Document approved', performedBy: 'Admin User', timestamp: '2024-01-17 03:45 PM' },
      { id: 4, activity: 'Status changed to Verified', performedBy: 'Admin User', timestamp: '2024-01-18 09:15 AM' }
    ],
    notes: [
      { id: 1, note: 'Initial verification pending', timestamp: '2024-01-15 10:30 AM', admin: 'Admin User' },
      { id: 2, note: 'Documents submitted', timestamp: '2024-01-16 02:15 PM', admin: 'Admin User' }
    ]
  },
  {
    id: 2,
    name: 'Smith Constructions',
    companyName: 'Smith Constructions Pvt Ltd',
    email: 'john@smithconstructions.com',
    phone: '+91 9876543211',
    alternatePhone: '+91 9876543212',
    type: 'Company',
    status: 'Pending',
    totalProjects: 5,
    joinedOn: '2024-03-20',
    avatar: null,
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001'
    },
    website: 'https://www.smithconstructions.com',
    gstNumber: '07AASCS1234M1Z5',
    reraNumber: 'DLRERA/789012/2024',
    companyOwner: {
      name: 'Michael Smith',
      email: 'michael.smith@smithconstructions.com',
      phone: '+91 9876543205',
      alternatePhone: '+91 9876543206'
    },
    builderAdmin: {
      name: 'John Smith',
      email: 'john.smith@smithconstructions.com',
      phone: '+91 9876543213',
      alternatePhone: '+91 9876543214'
    },
    defaultCommission: '4.5',
    businessDescription: 'Experienced individual builder specializing in residential projects.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Pending', uploadedOn: '2024-03-20' },
      { id: 2, type: 'Identity', fileName: 'identity_proof.pdf', status: 'Pending', uploadedOn: '2024-03-20' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Pending', uploadedOn: '2024-03-21' }
    ],
    projects: [
      { id: 1, name: 'Modern Homes', type: 'Residential', status: 'Active', units: 60, createdOn: '2024-03-25' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2024-03-20 09:00 AM' }
    ],
    notes: [
      { id: 1, note: 'Awaiting document verification', timestamp: '2024-03-20 09:15 AM', admin: 'Admin User' }
    ]
  },
  {
    id: 3,
    name: 'XYZ Builders',
    companyName: 'XYZ Builders Group',
    email: 'info@xyzbuilders.com',
    phone: '+91 9876543212',
    alternatePhone: '+91 9876543213',
    type: 'Company',
    status: 'Suspended',
    totalProjects: 8,
    joinedOn: '2022-11-10',
    avatar: null,
    address: {
      street: '789 Business Park',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001'
    },
    website: 'https://www.xyzbuilders.com',
    gstNumber: '29AAECX5678K1Z2',
    reraNumber: 'KARERA/345678/2022',
    companyOwner: {
      name: 'Anita Desai',
      email: 'anita.desai@xyzbuilders.com',
      phone: '+91 9876543207',
      alternatePhone: '+91 9876543208'
    },
    builderAdmin: {
      name: 'Vikram Sharma',
      email: 'vikram.sharma@xyzbuilders.com',
      phone: '+91 9876543214',
      alternatePhone: '+91 9876543215'
    },
    defaultCommission: '6',
    businessDescription: 'Large scale developer with multiple ongoing projects.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Verified', uploadedOn: '2022-11-10' },
      { id: 2, type: 'GST', fileName: 'gst_certificate.pdf', status: 'Verified', uploadedOn: '2022-11-10' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Rejected', uploadedOn: '2022-11-12' }
    ],
    projects: [
      { id: 1, name: 'Luxury Heights', type: 'Residential', status: 'Active', units: 200, createdOn: '2022-12-01' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2022-11-10 10:00 AM' },
      { id: 2, activity: 'Status changed to Suspended', performedBy: 'Admin User', timestamp: '2024-01-10 02:00 PM' }
    ],
    notes: [
      { id: 1, note: 'Suspended due to non-compliance', timestamp: '2024-01-10 02:00 PM', admin: 'Admin User' }
    ]
  },
  {
    id: 4,
    name: 'Premier Builders',
    companyName: 'Premier Builders & Developers Ltd',
    email: 'info@premierbuilders.com',
    phone: '+91 9876543216',
    alternatePhone: '+91 9876543217',
    type: 'Company',
    status: 'Verified',
    totalProjects: 15,
    joinedOn: '2023-06-10',
    avatar: null,
    address: {
      street: '321 Corporate Tower',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411001'
    },
    website: 'https://www.premierbuilders.com',
    gstNumber: '27AAPBU9876R1Z3',
    reraNumber: 'MHMRE/456789/2023',
    companyOwner: {
      name: 'Rohit Khanna',
      email: 'rohit.khanna@premierbuilders.com',
      phone: '+91 9876543230',
      alternatePhone: '+91 9876543231'
    },
    builderAdmin: {
      name: 'Amit Patel',
      email: 'amit.patel@premierbuilders.com',
      phone: '+91 9876543218',
      alternatePhone: '+91 9876543219'
    },
    defaultCommission: '5.5',
    businessDescription: 'Premium real estate developer focusing on luxury residential projects.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Verified', uploadedOn: '2023-06-10' },
      { id: 2, type: 'GST', fileName: 'gst_certificate.pdf', status: 'Verified', uploadedOn: '2023-06-11' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Verified', uploadedOn: '2023-06-12' }
    ],
    projects: [
      { id: 1, name: 'Elite Residences', type: 'Residential', status: 'Active', units: 150, createdOn: '2023-07-01' },
      { id: 2, name: 'Royal Gardens', type: 'Residential', status: 'Active', units: 90, createdOn: '2023-08-15' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2023-06-10 11:00 AM' },
      { id: 2, activity: 'Status changed to Verified', performedBy: 'Admin User', timestamp: '2023-06-15 02:30 PM' }
    ],
    notes: [
      { id: 1, note: 'Premium builder with excellent track record', timestamp: '2023-06-10 11:15 AM', admin: 'Admin User' }
    ]
  },
  {
    id: 5,
    name: 'Metro Constructions',
    companyName: 'Metro Constructions Pvt Ltd',
    email: 'contact@metconstructions.com',
    phone: '+91 9876543220',
    alternatePhone: '+91 9876543221',
    type: 'Company',
    status: 'Pending',
    totalProjects: 7,
    joinedOn: '2024-01-05',
    avatar: null,
    address: {
      street: '654 Metro Plaza',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500001'
    },
    website: 'https://www.metconstructions.com',
    gstNumber: '36AAMTC2345M1Z4',
    reraNumber: 'TSRERA/112233/2024',
    companyOwner: {
      name: 'Sunita Rao',
      email: 'sunita.rao@metconstructions.com',
      phone: '+91 9876543232',
      alternatePhone: '+91 9876543233'
    },
    builderAdmin: {
      name: 'Suresh Reddy',
      email: 'suresh.reddy@metconstructions.com',
      phone: '+91 9876543222',
      alternatePhone: '+91 9876543223'
    },
    defaultCommission: '4.8',
    businessDescription: 'Growing construction company specializing in affordable housing.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Pending', uploadedOn: '2024-01-05' },
      { id: 2, type: 'GST', fileName: 'gst_certificate.pdf', status: 'Pending', uploadedOn: '2024-01-06' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Pending', uploadedOn: '2024-01-07' }
    ],
    projects: [
      { id: 1, name: 'Affordable Homes', type: 'Residential', status: 'Active', units: 100, createdOn: '2024-01-10' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2024-01-05 09:30 AM' }
    ],
    notes: [
      { id: 1, note: 'Awaiting document verification', timestamp: '2024-01-05 09:45 AM', admin: 'Admin User' }
    ]
  },
  {
    id: 6,
    name: 'Golden Properties',
    companyName: 'Golden Properties Developers',
    email: 'info@goldenproperties.com',
    phone: '+91 9876543224',
    alternatePhone: '+91 9876543225',
    type: 'Company',
    status: 'Verified',
    totalProjects: 20,
    joinedOn: '2022-05-15',
    avatar: null,
    address: {
      street: '987 Golden Tower',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600001'
    },
    website: 'https://www.goldenproperties.com',
    gstNumber: '33AAGPD5678M1Z5',
    reraNumber: 'TNRERA/998877/2022',
    companyOwner: {
      name: 'Deepak Nair',
      email: 'deepak.nair@goldenproperties.com',
      phone: '+91 9876543234',
      alternatePhone: '+91 9876543235'
    },
    builderAdmin: {
      name: 'Karthik Iyer',
      email: 'karthik.iyer@goldenproperties.com',
      phone: '+91 9876543226',
      alternatePhone: '+91 9876543227'
    },
    defaultCommission: '6.5',
    businessDescription: 'Established developer with strong presence in South India.',
    documents: [
      { id: 1, type: 'PAN', fileName: 'pan_card.pdf', status: 'Verified', uploadedOn: '2022-05-15' },
      { id: 2, type: 'GST', fileName: 'gst_certificate.pdf', status: 'Verified', uploadedOn: '2022-05-16' },
      { id: 3, type: 'RERA', fileName: 'rera_registration.pdf', status: 'Verified', uploadedOn: '2022-05-17' }
    ],
    projects: [
      { id: 1, name: 'Golden Heights', type: 'Residential', status: 'Active', units: 180, createdOn: '2022-06-01' },
      { id: 2, name: 'Platinum Towers', type: 'Commercial', status: 'Active', units: 120, createdOn: '2022-08-10' },
      { id: 3, name: 'Diamond Residency', type: 'Residential', status: 'Completed', units: 95, createdOn: '2021-12-05' }
    ],
    activityLog: [
      { id: 1, activity: 'Builder created', performedBy: 'Admin User', timestamp: '2022-05-15 10:00 AM' },
      { id: 2, activity: 'Status changed to Verified', performedBy: 'Admin User', timestamp: '2022-05-20 03:00 PM' }
    ],
    notes: [
      { id: 1, note: 'Established builder with good reputation', timestamp: '2022-05-15 10:15 AM', admin: 'Admin User' }
    ]
  }
];

const builderDocumentTypes = [
  { id: 'PAN', value: 'PAN', label: 'PAN Card' },
  { id: 'GST', value: 'GST', label: 'GST Certificate' },
  { id: 'RERA', value: 'RERA', label: 'RERA Registration' },
  { id: 'IDENTITY', value: 'Identity', label: 'Identity Proof' },
  { id: 'REGISTRATION', value: 'Registration', label: 'Company Registration' },
  { id: 'OTHER', value: 'Other', label: 'Other Documents' }
];

const builderAdminsSeed = [
  {
    id: 1,
    builderId: 1,
    builderCode: 'BUILDER-001',
    fullName: 'Rajesh Kumar',
    assignedCompany: 'ABC Developers',
    email: 'rajesh.kumar@abcdevelopers.com',
    phone: '+91 9876543220',
    status: 'Active',
    createdOn: '2024-01-15',
    profileImage: null,
    personal: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      alternatePhone: '+91 9876543221'
    },
    address: {
      street: '123 Corporate Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400005'
    },
    professional: {
      employeeId: 'EMP-00001',
      panNumber: 'ABCDE1234F',
      aadharNumber: '987654321012',
      gstNumber: '27ABCDE1234F1Z5',
      reraNumber: 'MHMRE/123456/2024',
      dateOfAssigning: '2024-01-10',
      notes: 'Senior builder admin for western region'
    },
    bank: {
      accountName: 'Rajesh Kumar',
      accountNumber: 'XXXX1234567890',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Bandra West',
      upiId: 'rajesh.kumar@hdfcbank'
    },
    assignment: {
      company: 'ABC Developers',
      notes: 'Handles premium projects'
    }
  },
  {
    id: 2,
    builderId: 4,
    builderCode: 'BUILDER-002',
    fullName: 'Amit Patel',
    assignedCompany: 'Premier Builders & Developers Ltd',
    email: 'amit.patel@premierbuilders.com',
    phone: '+91 9876543218',
    status: 'Suspended',
    createdOn: '2023-07-05',
    profileImage: null,
    personal: {
      firstName: 'Amit',
      lastName: 'Patel',
      alternatePhone: '+91 9876543219'
    },
    address: {
      street: '45 Skyline Towers',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411045'
    },
    professional: {
      employeeId: 'EMP-00045',
      panNumber: 'PQRSX5678L',
      aadharNumber: '123498765432',
      gstNumber: '27PQRSX5678L1Z2',
      reraNumber: 'MHMRE/456789/2023',
      dateOfAssigning: '2023-06-20',
      notes: 'Currently suspended pending review'
    },
    bank: {
      accountName: 'Amit Patel',
      accountNumber: 'XXXX2345678901',
      ifsc: 'ICIC0004567',
      bankName: 'ICICI Bank',
      branch: 'Koregaon Park',
      upiId: 'amit.patel@icici'
    },
    assignment: {
      company: 'Premier Builders & Developers Ltd',
      notes: 'Managed luxury villas portfolio'
    }
  },
  {
    id: 3,
    builderId: 5,
    builderCode: 'BUILDER-003',
    fullName: 'Suresh Reddy',
    assignedCompany: 'Metro Constructions Pvt Ltd',
    email: 'suresh.reddy@metconstructions.com',
    phone: '+91 9876543222',
    status: 'Inactive',
    createdOn: '2024-02-12',
    profileImage: null,
    personal: {
      firstName: 'Suresh',
      lastName: 'Reddy',
      alternatePhone: '+91 9876543223'
    },
    address: {
      street: '78 Metro Plaza',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500032'
    },
    professional: {
      employeeId: 'EMP-00057',
      panNumber: 'LMNOP6789D',
      aadharNumber: '564738291012',
      gstNumber: '36LMNOP6789D1Z4',
      reraNumber: 'TSRERA/112233/2024',
      dateOfAssigning: '2024-02-01',
      notes: 'On extended leave'
    },
    bank: {
      accountName: 'Suresh Reddy',
      accountNumber: 'XXXX3456789012',
      ifsc: 'SBIN0007890',
      bankName: 'State Bank of India',
      branch: 'Banjara Hills',
      upiId: 'suresh.reddy@sbi'
    },
    assignment: {
      company: 'Metro Constructions Pvt Ltd',
      notes: 'Focus on affordable housing projects'
    }
  }
];

let builderAdmins = [...builderAdminsSeed];

export const fetchBuilders = async () => {
  return {
    success: true,
    data: buildersData
  };
};

export const fetchBuilderDocumentTypes = async () => ({
  success: true,
  data: builderDocumentTypes
});

export const fetchBuilderAdmins = async () => ({
  success: true,
  data: builderAdmins
});

export const updateBuilderAdmin = async (adminId, updates) => {
  builderAdmins = builderAdmins.map((admin) => {
    if (admin.id !== adminId) return admin;

    const merged = {
      ...admin,
      ...updates,
      personal: {
        ...admin.personal,
        ...(updates.personal || {})
      },
      address: {
        ...admin.address,
        ...(updates.address || {})
      },
      professional: {
        ...admin.professional,
        ...(updates.professional || {})
      },
      bank: {
        ...admin.bank,
        ...(updates.bank || {})
      },
      assignment: {
        ...admin.assignment,
        ...(updates.assignment || {})
      }
    };

    merged.fullName = `${merged.personal?.firstName || ''} ${merged.personal?.lastName || ''}`.trim() || merged.fullName;
    merged.assignedCompany = merged.assignment?.company || merged.assignedCompany;

    return merged;
  });

  const updatedAdmin = builderAdmins.find((admin) => admin.id === adminId);
  return { success: true, data: updatedAdmin };
};

export const fetchBuilderById = async (id) => {
  const builder = buildersData.find(b => b.id === parseInt(id));
  return {
    success: !!builder,
    data: builder || null
  };
};

export const fetchBuilderProjects = async (builderId) => {
  const builder = buildersData.find(b => b.id === parseInt(builderId));
  return {
    success: true,
    data: builder?.projects || []
  };
};

export const fetchBuilderDocuments = async (builderId) => {
  const builder = buildersData.find(b => b.id === parseInt(builderId));
  return {
    success: true,
    data: builder?.documents || []
  };
};

export const fetchBuilderActivityLog = async (builderId) => {
  const builder = buildersData.find(b => b.id === parseInt(builderId));
  return {
    success: true,
    data: builder?.activityLog || []
  };
};

export const fetchBuilderNotes = async (builderId) => {
  const builder = buildersData.find(b => b.id === parseInt(builderId));
  return {
    success: true,
    data: builder?.notes || []
  };
};

// Add builder functions to default export
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
  fetchLoanedFlatsData,
  fetchLoanDocuments,
  updateLoanDocuments,
  fetchFlatDetailCP,
  fetchCompletePayment,
  fetchCommonDocuments,
  fetchFlatDocuments,
  fetchLegalDocuments,
  fetchFlatLegalDocuments,
  fetchLoanDocumentLists,
  fetchProjects,
  fetchFlatDetailsAdmin,
  fetchViewHandover,
  fetchViewCustomization,
  fetchViewActivities,
  fetchFlatHandoverActivities,
  fetchViewActivity,
  fetchActivityToSubactivity,
  fetchBlocks,
  fetchTowersByProject,
  fetchCustomizationTypes,
  fetchDealerIds,
  fetchMonths,
  fetchYears,
  fetchCashData,
  fetchNeftData,
  fetchChequeData,
  fetchManageUserCategories,
  fetchManageUserRoles,
  fetchManageUserRoleDefaults,
  fetchManageUserUsernamesByRole,
  getManageUserUsernamesForRole,
  fetchChannelPartners,
  fetchChannelPartnerByDealerId,
  fetchCPDetail,
  fetchPaymentPlans,
  fetchLoanBanks,
  fetchConstructionStagesBlocks,
  fetchConstructionStagesInstallments,
  fetchBuilders,
  fetchBuilderById,
  fetchBuilderProjects,
  fetchBuilderDocuments,
  fetchBuilderActivityLog,
  fetchBuilderNotes,
  fetchBuilderDocumentTypes,
};

