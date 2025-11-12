

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
    
    // Add text fields
    formData.append('name', projectData.name);
    const locationValue = projectData.location ?? projectData.address ?? '';
    formData.append('location', locationValue);
    if (projectData.address) {
      formData.append('address', projectData.address);
    }
    formData.append('description', projectData.description || '');
    if (projectData.contactDetails) {
      formData.append('contact_details', projectData.contactDetails);
    }
    if (projectData.supportContactDetails) {
      formData.append('support_contact_details', projectData.supportContactDetails);
    }
    if (projectData.assignedBuilderId) {
      formData.append('builder', projectData.assignedBuilderId);
    } else if (projectData.assignedBuilderName) {
      formData.append('builder_name', projectData.assignedBuilderName);
    }
    
    // Add optional fields if provided
    if (projectData.projectType) {
      formData.append('project_type', projectData.projectType);
    }
    if (projectData.unitType) {
      formData.append('unit_type', projectData.unitType);
    }
    if (projectData.startDate) {
      formData.append('start_date', projectData.startDate);
    }
    if (projectData.endDate) {
      formData.append('end_date', projectData.endDate);
    }
    if (projectData.isActive !== undefined) {
      formData.append('is_active', projectData.isActive);
    }
    
    // Add file uploads if provided
    if (projectData.logo && projectData.logo instanceof File) {
      formData.append('logo', projectData.logo);
    }
    if (projectData.headerImage && projectData.headerImage instanceof File) {
      formData.append('header', projectData.headerImage);
    }
    if (projectData.footerImage && projectData.footerImage instanceof File) {
      formData.append('footer', projectData.footerImage);
    }
    
    return api.postFormData('/properties/projects/', formData);
  }
};

export default api;