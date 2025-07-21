const API_BASE_URL = 'http://localhost:5000/api';

class SoftoPackagesService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/packages`;
    this.storageKey = 'softo_packages_data';
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Local storage methods for frontend-only implementation
  getPackagesFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading packages from storage:', error);
      return [];
    }
  }

  savePackagesToStorage(packages) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(packages));
    } catch (error) {
      console.error('Error saving packages to storage:', error);
    }
  }

  // Get all packages
  async getAllPackages() {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/getall`);
      // return response;
      
      // For now, use localStorage
      return this.getPackagesFromStorage();
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  // Get package by ID
  async getPackageById(id) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/get/${id}`);
      // return response;
      
      // For now, use localStorage
      const packages = this.getPackagesFromStorage();
      return packages.find(pkg => pkg.id === id) || null;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  }

  // Create new package
  async createPackage(packageData) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/create`, {
      //   method: 'POST',
      //   body: JSON.stringify(packageData),
      // });
      // return response;
      
      // For now, use localStorage
      const packages = this.getPackagesFromStorage();
      const newPackage = {
        id: Date.now().toString(),
        name: packageData.name,
        sections: packageData.sections || [],
        totalItems: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      packages.unshift(newPackage);
      this.savePackagesToStorage(packages);
      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  // Update package
  async updatePackage(id, packageData) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/update/${id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(packageData),
      // });
      // return response;
      
      // For now, use localStorage
      const packages = this.getPackagesFromStorage();
      const packageIndex = packages.findIndex(pkg => pkg.id === id);
      
      if (packageIndex === -1) {
        throw new Error('Package not found');
      }
      
      packages[packageIndex] = {
        ...packages[packageIndex],
        ...packageData,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      this.savePackagesToStorage(packages);
      return packages[packageIndex];
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  // Delete package
  async deletePackage(id) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/delete/${id}`, {
      //   method: 'DELETE',
      // });
      // return response;
      
      // For now, use localStorage
      const packages = this.getPackagesFromStorage();
      const filteredPackages = packages.filter(pkg => pkg.id !== id);
      this.savePackagesToStorage(filteredPackages);
      return { success: true };
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // Update package sections
  async updatePackageSections(id, sections) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await this.makeRequest(`${this.baseURL}/${id}/sections`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ sections }),
      // });
      // return response;
      
      // For now, use localStorage
      const packages = this.getPackagesFromStorage();
      const packageIndex = packages.findIndex(pkg => pkg.id === id);
      
      if (packageIndex === -1) {
        throw new Error('Package not found');
      }
      
      const totalItems = sections.reduce((sum, section) => sum + section.workItems.length, 0);
      
      packages[packageIndex] = {
        ...packages[packageIndex],
        sections,
        totalItems,
        lastModified: new Date().toISOString().split('T')[0]
      };
      
      this.savePackagesToStorage(packages);
      return packages[packageIndex];
    } catch (error) {
      console.error('Error updating package sections:', error);
      throw error;
    }
  }

  // Make authenticated request (for when backend is ready)
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

  // Export package data
  exportPackageData(packageId) {
    try {
      const packages = this.getPackagesFromStorage();
      const packageData = packages.find(pkg => pkg.id === packageId);
      
      if (!packageData) {
        throw new Error('Package not found');
      }
      
      return packageData;
    } catch (error) {
      console.error('Error exporting package data:', error);
      throw error;
    }
  }

  // Import package data
  importPackageData(packageData) {
    try {
      const packages = this.getPackagesFromStorage();
      
      // Check if package already exists
      const existingIndex = packages.findIndex(pkg => pkg.id === packageData.id);
      
      if (existingIndex !== -1) {
        // Update existing package
        packages[existingIndex] = {
          ...packages[existingIndex],
          ...packageData,
          lastModified: new Date().toISOString().split('T')[0]
        };
      } else {
        // Add new package
        packages.unshift({
          ...packageData,
          lastModified: new Date().toISOString().split('T')[0]
        });
      }
      
      this.savePackagesToStorage(packages);
      return packageData;
    } catch (error) {
      console.error('Error importing package data:', error);
      throw error;
    }
  }

  // Calculate package totals
  calculatePackageTotals(packageData) {
    if (!packageData || !packageData.sections) {
      return { totalItems: 0, totalValue: 0 };
    }

    let totalItems = 0;
    let totalValue = 0;

    packageData.sections.forEach(section => {
      totalItems += section.workItems.length;
      
      if (section.type === 'squareNet') {
        totalValue += section.workItems.reduce((sum, item) => sum + Number(item.total || 0), 0);
      } else {
        totalValue += section.workItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
      }
    });

    return {
      totalItems,
      totalValue: totalValue.toFixed(2)
    };
  }
}

export default new SoftoPackagesService(); 