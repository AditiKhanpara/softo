const API_BASE_URL = 'http://localhost:5000/api';

class SoftoLeadsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/softo-leads`;
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Make authenticated request
  async makeRequest(url, options = {}) {
    const token = this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all leads
  async getAllLeads() {
    try {
      const response = await this.makeRequest(`${this.baseURL}/getall`);
      return response;
    } catch (error) {
      console.error('Error fetching softo leads:', error);
      throw error;
    }
  }

  // Get lead by ID
  async getLeadById(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/get/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching softo lead:', error);
      throw error;
    }
  }

  // Create new lead
  async createLead(leadData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/create`, {
        method: 'POST',
        body: JSON.stringify(leadData),
      });
      return response;
    } catch (error) {
      console.error('Error creating softo lead:', error);
      throw error;
    }
  }

  // Update lead
  async updateLead(id, leadData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(leadData),
      });
      return response;
    } catch (error) {
      console.error('Error updating softo lead:', error);
      throw error;
    }
  }

  // Delete lead
  async deleteLead(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/delete/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting softo lead:', error);
      throw error;
    }
  }
}

export default new SoftoLeadsService(); 