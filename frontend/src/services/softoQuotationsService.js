const API_BASE_URL = "http://localhost:5000/api";

class SoftoQuotationsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/quotation`;
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem("token");
  }

  // Make authenticated request
  async makeRequest(url, options = {}, expectBlob = false) {
    const token = this.getAuthToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // 👇 Handle PDF binary response
    if (expectBlob) return response.blob();

    return response.json();
  }

  // Get all quotations
  async getAllQuotations() {
    try {
      const response = await this.makeRequest(`${this.baseURL}/getall`);
      console.log("Quotations response:", response);
      console.log("Response data:", response.data);
      console.log("Is array:", Array.isArray(response.data));
      return response.data || response;
    } catch (error) {
      console.error("Error fetching quotations:", error);
      throw error;
    }
  }

  // Get quotation by ID
  async getQuotationById(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/get/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching quotation:", error);
      throw error;
    }
  }

  // Create new quotation
  async createQuotation(quotationData) {
    try {
      console.log("Creating quotation with data:", quotationData);
      const response = await this.makeRequest(`${this.baseURL}/create`, {
        method: "POST",
        body: JSON.stringify(quotationData),
      });
      console.log("Create quotation response:", response);
      return response.data || response;
    } catch (error) {
      console.error("Error creating quotation:", error);
      throw error;
    }
  }

  // Update quotation
  async updateQuotation(id, quotationData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(quotationData),
      });
      return response.data || response;
    } catch (error) {
      console.error("Error updating quotation:", error);
      throw error;
    }
  }

  // Delete quotation
  async deleteQuotation(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/delete/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }

  // Generate PDF
  async generatePDF(id, isPrint = false) {
    try {
      const blob = await this.makeRequest(
        `${this.baseURL}/create/pdf`,
        {
          method: "POST",
          body: JSON.stringify({ id }),
        },
        true // 👈 expectBlob = true
      );
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  }

  async downloadPDF(id, isPrint = false) {
    try {
      const blob = await this.generatePDF(id, isPrint);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }
}

export default new SoftoQuotationsService();
