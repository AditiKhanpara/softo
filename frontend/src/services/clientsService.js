import axios from 'axios';

//const API_BASE_URL = 'http://192.168.29.206:5000/api';
const API_BASE_URL = 'http://localhost:5000/api';
class ClientsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/client`;
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

  // Get all clients
  async getAllClients() {
    try {
      const response = await fetch(`${this.baseURL}/getall`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Clients response data:', data);
      // Client controller returns { data: [...], success: true }
      return data.data || data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Get client by ID
  async getClientById(id) {
    try {
      const response = await fetch(`${this.baseURL}/get/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data; // Backend returns { data: {...}, success: true }
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  }

  // Create new client
  async createClient(clientData) {
    try {
      // Since backend expects lead ID and password, we need to create a lead first
      // then convert it to client
      const { password, ...leadData } = clientData;
      
      // First, create a lead
      const leadResponse = await fetch(`${API_BASE_URL}/leads/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(leadData),
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(errorData.message || `Failed to create lead: ${leadResponse.status}`);
      }

      const leadResult = await leadResponse.json();
      const leadId = leadResult.data?.id || leadResult.id;

      if (!leadId) {
        throw new Error('Failed to get lead ID from response');
      }

      // Then convert the lead to client
      const clientResponse = await fetch(`${this.baseURL}/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ 
          id: leadId, 
          password: password || 'default123' // Use provided password or default
        }),
      });

      if (!clientResponse.ok) {
        const errorData = await clientResponse.json();
        throw new Error(errorData.message || `Failed to convert to client: ${clientResponse.status}`);
      }

      const data = await clientResponse.json();
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Update client
  async updateClient(id, clientData) {
    try {
      const response = await fetch(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  // Delete client
  async deleteClient(id) {
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
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}

export default new ClientsService(); 