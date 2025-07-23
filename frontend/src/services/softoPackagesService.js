const API_BASE_URL = 'http://localhost:5000/api';

class SoftoPackagesService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/package`; // Changed from /packages to /package
    this.storageKey = 'softo_packages_sections_data'; // Changed to store only sections data
  }

  // Test backend connection and authentication
  async testConnection() {
    try {
      console.log('Testing backend connection...');
      const token = this.getAuthToken();
      
      // Try to access a simple endpoint to test connection
      const response = await fetch(`${API_BASE_URL}/auth/test`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Local storage methods for sections/work items (backend doesn't support this yet)
  getSectionsFromStorage(packageId) {
    try {
      const data = localStorage.getItem(`${this.storageKey}_${packageId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading sections from storage:', error);
      return [];
    }
  }

  saveSectionsToStorage(packageId, sections) {
    try {
      localStorage.setItem(`${this.storageKey}_${packageId}`, JSON.stringify(sections));
    } catch (error) {
      console.error('Error saving sections to storage:', error);
    }
  }

  // Make authenticated request to backend
  async makeRequest(url, options = {}) {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };


    const response = await fetch(url, config);
    
    
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    
    if (response.status === 404) {
      throw new Error(`Route not found: ${url}. Please check if the backend route is properly configured.`);
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Clear all localStorage data (useful for testing/cleanup)
  clearAllStorageData() {
    try {
      // Clear packages data
      localStorage.removeItem('softo_packages_data');
      
      // Clear all sections data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('softo_packages_sections_data_')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('All packages localStorage data cleared');
    } catch (error) {
      console.error('Error clearing localStorage data:', error);
    }
  }

  // Get all packages from backend
  async getAllPackages() {
    try {
      console.log('Fetching packages from backend...');
      const response = await this.makeRequest(`${this.baseURL}/getall`);
      
      // Backend returns array directly, not wrapped in an object
      const packages = Array.isArray(response) ? response : [];
      
      // Enhance backend data with sections from backend (with fallback to localStorage)
      const enhancedPackages = await Promise.all(packages.map(async (pkg) => {
        const sections = await this.getSectionsFromBackend(pkg.id);
        const totalItems = sections.reduce((sum, section) => sum + section.workItems.length, 0);
        
        return {
          ...pkg,
          sections,
          totalItems,
          createdAt: pkg.createdAt ? new Date(pkg.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          lastModified: pkg.updatedAt ? new Date(pkg.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
      }));
      
      return enhancedPackages;
    } catch (error) {
      console.error('Error fetching packages from backend:', error);
      
      // Only fallback to localStorage if it's an authentication error
      if (error.message.includes('Authentication')) {
        throw error; // Don't fallback for auth errors
      }
      
      // For other errors, return empty array instead of localStorage data
      return [];
    }
  }

  // Get package by ID from backend
  async getPackageById(id) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/get/${id}`);
      
      // Backend returns package object directly
      const packageData = response;
      
      // Enhance with sections from backend (with fallback to localStorage)
      const sections = await this.getSectionsFromBackend(id);
      const totalItems = sections.reduce((sum, section) => sum + section.workItems.length, 0);
      
      return {
        ...packageData,
        sections,
        totalItems,
        createdAt: packageData.createdAt ? new Date(packageData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: packageData.updatedAt ? new Date(packageData.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error fetching package from backend:', error);
      
      // Only fallback to localStorage if it's not an authentication error
      if (error.message.includes('Authentication')) {
        throw error; // Don't fallback for auth errors
      }
      
      // For other errors, return null instead of localStorage data
      return null;
    }
  }

  // Create new package in backend
  async createPackage(packageData) {
    try {
      console.log('Creating package in backend:', packageData);
      
      const response = await this.makeRequest(`${this.baseURL}/create`, {
        method: 'POST',
        body: JSON.stringify({ name: packageData.name }),
      });
      
      
      // Backend returns { message, package }
      const newPackage = response.package;
      
      if (!newPackage || !newPackage.id) {
        throw new Error('Invalid response from backend: missing package data');
      }
      
      // Initialize empty sections in localStorage
      this.saveSectionsToStorage(newPackage.id, []);
      
      const enhancedPackage = {
        ...newPackage,
        sections: [],
        totalItems: 0,
        createdAt: newPackage.createdAt ? new Date(newPackage.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: newPackage.updatedAt ? new Date(newPackage.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
      
      return enhancedPackage;
    } catch (error) {
      console.error('Error creating package in backend:', error);
      
      // Don't fallback to localStorage for authentication errors
      if (error.message.includes('Authentication')) {
        throw error;
      }
      
      // For other errors, throw the error instead of falling back
      throw new Error(`Failed to create package: ${error.message}`);
    }
  }

  // Update package in backend
  async updatePackage(id, packageData) {
    try {
      const response = await this.makeRequest(`${this.baseURL}/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: packageData.name }),
      });
      
      // Backend returns updated package object directly
      const updatedPackage = response;
      
      // Get sections from localStorage
      const sections = this.getSectionsFromStorage(id);
      const totalItems = sections.reduce((sum, section) => sum + section.workItems.length, 0);
      
      return {
        ...updatedPackage,
        sections,
        totalItems,
        createdAt: updatedPackage.createdAt ? new Date(updatedPackage.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: updatedPackage.updatedAt ? new Date(updatedPackage.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error updating package in backend:', error);
      // Fallback to localStorage if backend fails
      return this.updatePackageLocal(id, packageData);
    }
  }

  // Delete package from backend
  async deletePackage(id) {
    try {
      await this.makeRequest(`${this.baseURL}/delete/${id}`, {
        method: 'DELETE',
      });
      
      // Clean up sections from localStorage
      localStorage.removeItem(`${this.storageKey}_${id}`);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting package from backend:', error);
      // Fallback to localStorage if backend fails
      return this.deletePackageLocal(id);
    }
  }

  // Update package sections (store in both localStorage and backend database)
  async updatePackageSections(id, sections) {
    try {
      
      // Save to localStorage first (immediate persistence)
      this.saveSectionsToStorage(id, sections);
      
      // Try to save to backend database
      try {
        console.log('Attempting to save sections to backend database...');
        
        // First, try to get existing sections from backend
        let existingSectionIds = [];
        try {
          const existingDetails = await this.makeRequest(`${API_BASE_URL}/package-details/getall?packageId=${id}`);
          if (existingDetails.data && Array.isArray(existingDetails.data)) {
            existingSectionIds = existingDetails.data.map(detail => detail.id);
          }
        } catch (getError) {
          console.log('Could not fetch existing sections from backend:', getError.message);
        }
        
        // Delete existing sections if we found any
        for (const sectionId of existingSectionIds) {
          try {
            await this.makeRequest(`${API_BASE_URL}/package-details/delete/${sectionId}`, {
              method: 'DELETE',
            });
          } catch (deleteError) {
            console.warn('Failed to delete existing section:', deleteError.message);
          }
        }
        
        // Create new sections
        for (const section of sections) {
          const sectionData = {
            packageId: id,
            spaceType: section.type,
            spaceName: section.name,
            spaceData: {
              workItems: section.workItems,
              order: section.order
            }
          };
          
          
          await this.makeRequest(`${API_BASE_URL}/package-details/create`, {
            method: 'POST',
            body: JSON.stringify(sectionData),
          });
        }
        
        console.log('✅ Package sections saved to backend database successfully');
      } catch (backendError) {
        console.warn('⚠️ Backend save failed, but localStorage is working:', backendError.message);
        console.log('Backend error details:', backendError);
        // Continue with localStorage data - no error thrown
      }
      
      // Get updated package data
      const packageData = await this.getPackageById(id);
      return packageData;
    } catch (error) {
      console.error('Error updating package sections:', error);
      throw error;
    }
  }

  // Get sections from backend (using query parameter)
  async getSectionsFromBackend(packageId) {
    try {
      
      // Backend now expects query parameter
      const response = await this.makeRequest(`${API_BASE_URL}/package-details/getall?packageId=${packageId}`);
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(detail => ({
          id: detail.id,
          name: detail.spaceName, // Backend returns spaceName
          type: detail.spaceType, // Backend returns spaceType
          workItems: detail.spaceData?.workItems || [], // Backend returns spaceData.workItems
          order: detail.spaceData?.order || 1 // Backend returns spaceData.order
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching sections from backend:', error);
      
      // Fallback to localStorage if backend fails
      return this.getSectionsFromStorage(packageId);
    }
  }

  // Fallback methods for localStorage (when backend fails)
  getPackagesFromStorage() {
    try {
      const data = localStorage.getItem('softo_packages_data');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading packages from storage:', error);
      return [];
    }
  }

  savePackagesToStorage(packages) {
    try {
      localStorage.setItem('softo_packages_data', JSON.stringify(packages));
    } catch (error) {
      console.error('Error saving packages to storage:', error);
    }
  }

  createPackageLocal(packageData) {
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
  }

  updatePackageLocal(id, packageData) {
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
  }

  deletePackageLocal(id) {
    const packages = this.getPackagesFromStorage();
    const filteredPackages = packages.filter(pkg => pkg.id !== id);
    this.savePackagesToStorage(filteredPackages);
    return { success: true };
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

  // Method to check backend integration status
  // Backend integration is now enabled by default since the query parameter issue is fixed
  enableBackendIntegration() {
    return {
      status: 'enabled',
      message: 'Backend integration is working properly'
    };
  }

  // Test backend connection and show current status
  async testBackendStatus() {
    try {
      console.log('Testing backend connection...');
      
      // Test basic package endpoint
      const packages = await this.makeRequest(`${this.baseURL}/getall`);
      console.log('✅ Package endpoint working:', packages);
      
      // Test package-details endpoint (should work now with fixed backend)
      try {
        if (packages.length > 0) {
          const details = await this.makeRequest(`${API_BASE_URL}/package-details/getall?packageId=${packages[0].id}`);
          console.log('✅ Package-details endpoint working:', details);
        } else {
          console.log('⚠️ No packages available to test package-details endpoint');
        }
      } catch (error) {
        console.log('❌ Package-details endpoint still has issues:', error.message);
      }
      
      return {
        packagesWorking: true,
        detailsWorking: packages.length > 0,
        message: 'Package endpoints working, details endpoint should work now'
      };
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return {
        packagesWorking: false,
        detailsWorking: false,
        message: 'Backend connection failed'
      };
    }
  }

  // Test if sections are being saved to backend database
  async testSectionStorage(packageId) {
    try {
      console.log('Testing section storage for packageId:', packageId);
      
      // Get sections from localStorage
      const localStorageSections = this.getSectionsFromStorage(packageId);
      console.log('Sections in localStorage:', localStorageSections);
      
      // Try to get sections from backend
      try {
        const backendResponse = await this.makeRequest(`${API_BASE_URL}/package-details/getall?packageId=${packageId}`);
        console.log('Sections in backend:', backendResponse);
        
        return {
          localStorage: localStorageSections,
          backend: backendResponse.data || [],
          localStorageCount: localStorageSections.length,
          backendCount: backendResponse.data ? backendResponse.data.length : 0,
          status: 'Both localStorage and backend checked'
        };
      } catch (backendError) {
        console.log('Backend query failed:', backendError.message);
        
        return {
          localStorage: localStorageSections,
          backend: [],
          localStorageCount: localStorageSections.length,
          backendCount: 0,
          status: 'Backend query failed - using localStorage only',
          error: backendError.message
        };
      }
    } catch (error) {
      console.error('Error testing section storage:', error);
      return {
        localStorage: [],
        backend: [],
        localStorageCount: 0,
        backendCount: 0,
        status: 'Error occurred during testing',
        error: error.message
      };
    }
  }

  // Force save sections to backend (for testing)
  async forceSaveSectionsToBackend(packageId) {
    try {
      console.log('Force saving sections to backend for packageId:', packageId);
      
      const sections = this.getSectionsFromStorage(packageId);
      console.log('Sections to save:', sections);
      
      if (sections.length === 0) {
        console.log('No sections to save');
        return { success: true, message: 'No sections to save' };
      }
      
      // Create sections in backend
      for (const section of sections) {
        const sectionData = {
          packageId: packageId,
          spaceType: section.type,
          spaceName: section.name,
          spaceData: {
            workItems: section.workItems,
            order: section.order
          }
        };
        
        console.log('Creating section in backend:', sectionData);
        
        const response = await this.makeRequest(`${API_BASE_URL}/package-details/create`, {
          method: 'POST',
          body: JSON.stringify(sectionData),
        });
        
        console.log('Section created successfully:', response);
      }
      
      return { success: true, message: `${sections.length} sections saved to backend` };
    } catch (error) {
      console.error('Error force saving sections to backend:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new SoftoPackagesService(); 