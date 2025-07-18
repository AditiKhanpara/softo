const API_BASE_URL = 'http://localhost:5000/api';

class SoftoClientsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/softo-clients`;
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

  // Get all clients
  async getAllClients() {
    try {
      const response = await this.makeRequest(`${this.baseURL}/getall`);
      return response;
    } catch (error) {
      console.error('Error fetching softo clients:', error);
      throw error;
    }
  }

  // Get client by ID
  async getClientById(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/get/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching softo client:', error);
      throw error;
    }
  }

  // Create new client
  async createClient(clientData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/create`, {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      return response;
    } catch (error) {
      console.error('Error creating softo client:', error);
      throw error;
    }
  }

  // Update client
  async updateClient(id, clientData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
      });
      return response;
    } catch (error) {
      console.error('Error updating softo client:', error);
      throw error;
    }
  }

  // Delete client
  async deleteClient(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/delete/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting softo client:', error);
      throw error;
    }
  }
}

export default new SoftoClientsService(); 