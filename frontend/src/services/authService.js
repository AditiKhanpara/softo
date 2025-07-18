import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Check if user is authenticated
  async checkAuth() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        return { isAuthenticated: false, user: null };
      }

      const data = await response.json();
      const user = data.data || data;
      
      // TODO: Replace with actual role from backend
      // For now, we'll determine role based on user data
      // This should be replaced when backend provides role information
      const role = user.role || (user.email?.includes('client') ? 'client' : 'admin');
      
      return { 
        isAuthenticated: true, 
        user: { ...user, role } 
      };
    } catch (error) {
      console.error('Error checking auth:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
      } else if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // TODO: Replace with actual role from backend
      // For now, we'll determine role based on user data
      const user = data.data || data;
      const role = user.role || (user.email?.includes('client') ? 'client' : 'admin');
      
      return { ...data, user: { ...user, role } };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Register user
  async register(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    try {
      localStorage.removeItem('token');
      // Clear any other auth-related data
      localStorage.removeItem('user');
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  // Check if user has a token (simple check without API call)
  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new AuthService(); 