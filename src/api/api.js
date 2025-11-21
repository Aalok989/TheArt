

// Base API configuration
const DEFAULT_API_BASE_URL = '/api';
const envBaseUrl = typeof import.meta !== 'undefined'
  ? import.meta.env?.VITE_API_BASE_URL
  : undefined;

const sanitizedBaseUrl = envBaseUrl
  ? envBaseUrl.replace(/\/+$/, '')
  : DEFAULT_API_BASE_URL;

const API_BASE_URL = sanitizedBaseUrl;

// Simple API client
class SimpleApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get the actual error message from the backend
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(', ');
          } else if (errorData.username) {
            errorMessage = errorData.username.join(', ');
          } else if (errorData.password) {
            errorMessage = errorData.password.join(', ');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary for FormData
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        Authorization: `Token ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = await response.json();
          if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(', ');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else {
            // Collect all field errors
            const fieldErrors = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            if (fieldErrors) {
              errorMessage = fieldErrors;
            }
          }
        } catch {
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
}

// Create instance
const api = new SimpleApiClient();

// Authentication methods
const mapUserTypeToRole = (userType) => {
  const normalizedType = (userType || '').toLowerCase();
  switch (normalizedType) {
    case 'staff':
    case 'superadmin':
      return 'superadmin';
    case 'builder_admin':
    case 'builderadmin':
      return 'builder_admin';
    case 'user':
    case 'customer':
      return 'user';
    default:
      return 'user';
  }
};

export const authAPI = {
  async login(username, password) {
    const response = await api.post('/auth/token/login/', { username, password });
    
    if (response.auth_token) {
      localStorage.setItem('authToken', response.auth_token);
      
      // Determine role based on user_type or role.type from the response
      const userType = response.role?.type || response.user_type;
      const role = mapUserTypeToRole(userType);
      console.log('[Auth] Role fetched from API:', userType, '=> normalized role:', role);
      localStorage.setItem('userRole', role);
      
      // Store additional user info for future use
      localStorage.setItem('userId', response.user_id);
      localStorage.setItem('username', response.username);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('firstName', response.first_name || '');
      localStorage.setItem('lastName', response.last_name || '');
      localStorage.setItem('builderInfo', JSON.stringify(response.builder || {}));
      
      return { 
        success: true, 
        token: response.auth_token,
        role: role,
        userInfo: response
      };
    }
    
    throw new Error('Login failed');
  },

  async logout() {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/token/logout/');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always remove all local storage items
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('builderInfo');
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getUserInfo() {
    return {
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('userEmail'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      role: localStorage.getItem('userRole'),
      builder: JSON.parse(localStorage.getItem('builderInfo') || '{}')
    };
  }
};

// Content methods
export const contentAPI = {
  async getDashboard() {
    return api.get('/dashboard/');
  },

  async getUpdates() {
    return api.get('/updates/');
  },

  async getDocuments() {
    return api.get('/documents/');
  }
};

// Customer API methods
export const customerAPI = {
  async getProfile() {
    return api.get('/customer/profile/');
  },

  async getDetailedInformation() {
    return api.get('/customer/detailed-information/');
  },

  async getFlatDetails() {
    return api.get('/customer/flat-details-formatted/');
  },

  async getUpdates() {
    return api.get('/customer/updates/');
  },

  async getNotifications() {
    return api.get('/customer/notifications/');
  },

  async getCurrentDues() {
    return api.get('/customer/current-dues/');
  },

  async getPaymentSchedule() {
    return api.get('/customer/payment-schedule/');
  },

  async getDocuments() {
    return api.get('/customer/booking-documents/');
  }
};

// Properties/Projects API methods
export const propertiesAPI = {
  async getProjects() {
    const response = await api.get('/master/projects/');
    // Transform API response to match component expectations
    const projects = Array.isArray(response) ? response : (response ? [response] : []);
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      address: project.address || '',
      location: project.location || project.address || '',
      builder: project.builder_name || project.builder || '',
      builderId: project.builder_id || project.builder || '',
      builderName: project.builder_name || project.builder || '',
      description: project.description || '',
      startDate: project.start_date || '',
      endDate: project.end_date || '',
      isActive: project.is_active !== undefined ? project.is_active : true,
      isInitialized: project.is_initialized !== undefined ? project.is_initialized : false,
      createdAt: project.created_at || '',
      updatedAt: project.updated_at || '',
      databaseName: project.database_name || '',
      logo: project.logo,
      headerImage: project.header,
      footerImage: project.footer,
      projectType: project.project_type,
      unitType: project.unit_type,
      contactDetails: project.contact_details || project.contactDetails || '',
      supportContactDetails: project.support_contact_details || project.supportContactDetails || '',
      blocks: project.blocks || [] // If blocks come from API
    }));
  },

  async createProject(projectData) {
    const formData = new FormData();
    
    // Add required text fields - matching API endpoint format from curl command
    // Format: --form 'name="..."' --form 'address="..."' --form 'description="..."'
    formData.append('name', projectData.name || '');
    formData.append('address', projectData.address || '');
    formData.append('description', projectData.description || '');
    
    // Add contact details (required field in form)
    formData.append('contact_details', projectData.contactDetails || '');
    
    // Add support contact details (optional)
    if (projectData.supportContactDetails) {
      formData.append('support_contact_details', projectData.supportContactDetails);
    }
    
    // Add builder_id if available (matching API endpoint format: --form 'builder_id="2"')
    // Only send if assignedBuilderId exists and is not empty
    if (projectData.assignedBuilderId) {
      const builderId = String(projectData.assignedBuilderId).trim();
      if (builderId !== '') {
        formData.append('builder_id', builderId);
      }
    }
    
    // Add file uploads if provided (matching curl format: --form 'logo=@...' --form 'header=@...' --form 'footer=@...')
    if (projectData.logo && projectData.logo instanceof File) {
      formData.append('logo', projectData.logo);
    }
    if (projectData.headerImage && projectData.headerImage instanceof File) {
      formData.append('header', projectData.headerImage);
    }
    if (projectData.footerImage && projectData.footerImage instanceof File) {
      formData.append('footer', projectData.footerImage);
    }
    
    // Use the correct endpoint from the curl command: /api/master/projects/create_project/
    return api.postFormData('/master/projects/create_project/', formData);
  },

  async getStructureOptions(projectId) {
    // Matching curl command: GET /properties/structure-options/?project_id=1
    return api.get(`/properties/structure-options/?project_id=${projectId}`);
  },

  async getBlocks(projectId, towerId = null) {
    // GET /properties/blocks/?project_id=X&tower_id=Y (tower_id is optional)
    let endpoint = `/properties/blocks/?project_id=${projectId}`;
    if (towerId) {
      endpoint += `&tower_id=${towerId}`;
    }
    return api.get(endpoint);
  },

  async createBlock(blockData) {
    // Matching curl command: POST /properties/blocks/ with JSON body
    const payload = {
      project: blockData.project,
      name: blockData.name || '',
      description: blockData.description || ''
    };
    
    // Only include tower field if it's provided (for structures that require tower step)
    if (blockData.tower) {
      payload.tower = blockData.tower;
    }
    
    return api.post('/properties/blocks/', payload);
  },

  async getTowers(projectId) {
    // Matching curl command: GET /properties/towers/?project_id=2
    return api.get(`/properties/towers/?project_id=${projectId}`);
  },

  async createTower(towerData) {
    // Matching curl command: POST /properties/towers/ with JSON body
    const payload = {
      project: towerData.project,
      name: towerData.name || '',
      description: towerData.description || ''
    };
    
    // Include tower_number if provided
    if (towerData.tower_number !== undefined && towerData.tower_number !== null && towerData.tower_number !== '') {
      payload.tower_number = towerData.tower_number;
    }
    
    return api.post('/properties/towers/', payload);
  },

  async getFlatTemplates(projectId) {
    // Matching curl command: GET /properties/flat-templates/active/?project_id=2
    return api.get(`/properties/flat-templates/active/?project_id=${projectId}`);
  },

  async createFlatTemplate(templateData) {
    // Matching curl command: POST /properties/flat-templates/ with JSON body
    return api.post('/properties/flat-templates/', {
      name: templateData.name || '',
      description: templateData.description || '',
      project_id: templateData.project_id,
      is_active: templateData.is_active !== undefined ? templateData.is_active : true,
      flat_items: (templateData.flat_items || []).map(item => ({
        flat_number_pattern: item.flat_number_pattern || '',
        flat_type: item.flat_type || '',
        area_sqft: item.area_sqft
      }))
    });
  },

  async submitCreationHub(data) {
    // Matching curl command: POST /properties/creation-hub/ with JSON body
    return api.post('/properties/creation-hub/', data);
  }
};

export const projectHierarchyAPI = {
  async getProjectDetails(projectId) {
    return api.get(`/properties/projects/?project_id=${projectId}`);
  },

  async getProjectHierarchy(projectId) {
    return api.get(`/properties/projects/hierarchy/?project_id=${projectId}`);
  }
};

// Builders API methods
export const buildersAPI = {
  async createBuilder(builderData) {
    // Matching curl command format: POST /tenants/builders/ with JSON body
    return api.post('/tenants/builders/', {
      name: builderData.name || '',
      address: builderData.address || '',
      contact_email: builderData.contactEmail || builderData.contact_email || ''
    });
  },

  async getBuilders() {
    return api.get('/tenants/builders/');
  }
};

export const billingAPI = {
  async getBanks(projectId) {
    const endpoint = projectId ? `/billing/banks/?project_id=${projectId}` : '/billing/banks/';
    return api.get(endpoint);
  },

  async createBank(projectId, bankData) {
    const endpoint = projectId ? `/billing/banks/?project_id=${projectId}` : '/billing/banks/';
    const payload = {
      name: bankData.name || '',
      branch: bankData.branch || '',
      ifsc_code: (bankData.ifscCode || '').toUpperCase(),
      pincode: bankData.pincode || '',
      address: bankData.address || '',
      email: bankData.email || '',
      is_active: bankData.isActive !== undefined ? bankData.isActive : true
    };

    return api.post(endpoint, payload);
  },

  async createPaymentPlan(projectId, planData) {
    const endpoint = projectId ? `/billing/payment-plans/?project_id=${projectId}` : '/billing/payment-plans/';
    const payload = {
      name: planData.name || '',
      description: planData.description || '',
      duration_months: planData.durationMonths ? parseInt(planData.durationMonths, 10) : null,
      interest_rate: planData.interestRate || '',
      plan_type: planData.planType || '',
      down_payment_percentage: planData.downPaymentPercentage || '',
      booking_amount_percentage: planData.bookingAmountPercentage || '',
      bank_id: planData.bankId ? Number(planData.bankId) : null,
      is_active: planData.isActive !== undefined ? planData.isActive : true
    };

    return api.post(endpoint, payload);
  },

  async getPaymentPlans(projectId) {
    const endpoint = `/billing/payment-plans/?project_id=${projectId}`;
    return api.get(endpoint);
  },

  async createBooking(bookingData) {
    const endpoint = `/billing/bookings/`;
    return api.post(endpoint, bookingData);
  }
};

export const accountsAPI = {
  async createChannelPartner(projectId, partnerData) {
    const payload = {
      project_id: projectId,
      dealer_id: partnerData.dealer_id || partnerData.dealerId || '',
      username: partnerData.username || '',
      email: partnerData.email || '',
      password: partnerData.password || '',
      first_name: partnerData.first_name || partnerData.firstName || '',
      last_name: partnerData.last_name || partnerData.lastName || '',
      phone_number: partnerData.phone_number || partnerData.phoneNumber || '',
      user_address: partnerData.user_address || partnerData.userAddress || '',
      father_or_husband_name: partnerData.father_or_husband_name || partnerData.fatherOrHusbandName || '',
      dob: partnerData.dob || '',
      phone_no_2: partnerData.phone_no_2 || partnerData.phoneNo2 || '',
      address: partnerData.address || '',
      is_active: partnerData.is_active !== undefined ? partnerData.is_active : partnerData.isActive !== undefined ? partnerData.isActive : true
    };

    return api.post('/accounts/channel-partners/', payload);
  },

  async createStaff(projectId, staffData) {
    const endpoint = '/accounts/staff/';
    const payload = {
      project_id: projectId,
      username: staffData.username || '',
      email: staffData.email || '',
      password: staffData.password || '',
      first_name: staffData.firstName || '',
      last_name: staffData.lastName || '',
      phone_number: staffData.phoneNumber || '',
      address: staffData.address || '',
      role: staffData.role || '',
      department: staffData.department || '',
      employee_id: staffData.employeeId || '',
      joining_date: staffData.joiningDate || '',
      salary: staffData.salary || '',
      status: staffData.status || 'ACTIVE',
      is_active: staffData.isActive !== undefined ? staffData.isActive : true,
      can_view_customers: !!staffData.canViewCustomers,
      can_edit_customers: !!staffData.canEditCustomers,
      can_view_financials: !!staffData.canViewFinancials,
      can_edit_financials: !!staffData.canEditFinancials,
      can_view_reports: !!staffData.canViewReports,
      can_manage_properties: !!staffData.canManageProperties
    };

    return api.post(endpoint, payload);
  },

  getCustomers: async (projectId) => {
    const endpoint = `/accounts/customers/?project_id=${projectId}`;
    return api.get(endpoint);
  },

  createCustomer: async (projectId, customerData) => {
    const endpoint = `/accounts/customers/?project_id=${projectId}`;
    const payload = {
      project_id: projectId,
      username: customerData.username,
      email: customerData.email,
      password: customerData.password,
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      phone_number: customerData.phoneNumber,
      address: customerData.address,
      kyc_id: customerData.kycId || '',
      kyc_verified: !!customerData.kycVerified,
      status: customerData.status || 'ACTIVE',
      father_name: customerData.fatherName,
      date_of_birth: customerData.dateOfBirth,
      pan_number: customerData.panNumber,
      occupation: customerData.occupation || '',
      company_name: customerData.companyName || '',
      annual_income: customerData.annualIncome || '0.00',
      emergency_contact_name: customerData.emergencyContactName || '',
      emergency_contact_phone: customerData.emergencyContactPhone || '',
      emergency_contact_relation: customerData.emergencyContactRelation || ''
    };
    return api.post(endpoint, payload);
  },

  createCoApplicant: async (projectId, customerId, coApplicantData) => {
    const endpoint = `/accounts/co-applicants/`;
    const payload = {
      project_id: parseInt(projectId),
      customer_id: parseInt(customerId),
      name: coApplicantData.name.trim(),
      father_name: coApplicantData.fatherName.trim(),
      date_of_birth: coApplicantData.dateOfBirth,
      gender: coApplicantData.gender,
      email: coApplicantData.email.trim(),
      phone_number: coApplicantData.phoneNumber.trim(),
      address: coApplicantData.address.trim(),
      pan_number: coApplicantData.panNumber.trim().substring(0, 10), // Limit to 10 characters
      occupation: coApplicantData.occupation.trim() || '',
      annual_income: coApplicantData.annualIncome && coApplicantData.annualIncome !== '' ? `${coApplicantData.annualIncome}.00` : '0.00',
      relationship: coApplicantData.relationship
    };
    
    return api.post(endpoint, payload);
  },

  createNominee: async (projectId, customerId, nomineeData) => {
    const endpoint = `/accounts/nominees/`;
    const payload = {
      project_id: parseInt(projectId),
      customer_id: parseInt(customerId),
      name: nomineeData.name.trim(),
      father_husband_name: nomineeData.fatherHusbandName.trim(),
      email: nomineeData.email.trim(),
      date_of_birth: nomineeData.dateOfBirth,
      phone_number: nomineeData.phoneNumber.trim(),
      address: nomineeData.address.trim(),
      pan_number: nomineeData.panNumber.trim(),
      relationship: nomineeData.relationship
    };
    
    return api.post(endpoint, payload);
  },

  getChannelPartners: async (projectId) => {
    const endpoint = `/accounts/channel-partners/?project_id=${projectId}`;
    return api.get(endpoint);
  }
};

export default api;