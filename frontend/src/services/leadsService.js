import axios from 'axios';

//const API_BASE_URL = 'http://192.168.29.206:5000/api';
const API_BASE_URL = 'http://localhost:5000/api';

class LeadsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/leads`;
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

  // Get all leads
  async getAllLeads() {
    try {
      console.log('Making request to:', `${this.baseURL}/getall`);
      console.log('Headers:', this.getHeaders());
      
      const response = await fetch(`${this.baseURL}/getall`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      // Leads controller returns { success: true, data: [...], message: "..." }
      return data.data || data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  // Get lead by ID
  async getLeadById(id) {
    try {
      const response = await fetch(`${this.baseURL}/get/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  // Create new lead
  async createLead(leadData) {
    try {
      const response = await fetch(`${this.baseURL}/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }

  // Update lead
  async updateLead(id, leadData) {
    try {
      const response = await fetch(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  }

  // Delete lead
  async deleteLead(id) {
    try {
      const response = await fetch(`${this.baseURL}/delete/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }

  // Convert lead to client
  async convertLeadToClient(leadId, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/client/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ id: leadId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error converting lead to client:', error);
      throw error;
    }
  }
}

export default new LeadsService(); 