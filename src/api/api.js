

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
    const response = await api.post('/auth/token/login', { username, password });
    
    if (response.auth_token) {
      localStorage.setItem('authToken', response.auth_token);
      return { success: true, token: response.auth_token };
    }
    
    throw new Error('Login failed');
  },

  async logout() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
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

export default api;