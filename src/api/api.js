

// Base API configuration
const API_BASE_URL = '/api';

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

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
}

// Create instance
const api = new SimpleApiClient();

// Authentication methods
export const authAPI = {
  async login(username, password) {
    const response = await api.post('/auth/token/login/', { username, password });
    
    if (response.auth_token) {
      localStorage.setItem('authToken', response.auth_token);
      
      // Determine role based on user_type or role.type from the response
      const userType = response.role?.type || response.user_type;
      const role = userType === 'staff' ? 'admin' : 'user';
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
    return api.get('/customer/documents/');
  }
};

export default api;