import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import softoPackagesService from '../../../services/softoPackagesService';

const SoftoPackages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPackageName, setNewPackageName] = useState('');

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await softoPackagesService.getAllPackages();
      
      // If no packages exist, create some mock data for demonstration
      if (data.length === 0) {
        const mockPackages = [
          {
            id: '1',
            name: 'Kitchen Renovation',
            sections: [
              { id: '1', name: 'CABINETS', type: 'squareNet', itemCount: 4 },
              { id: '2', name: 'ACCESSORIES', type: 'description', itemCount: 3 }
            ],
            totalItems: 7,
            createdAt: '2024-01-15',
            lastModified: '2024-01-20'
          },
          {
            id: '2',
            name: 'Bathroom Project',
            sections: [
              { id: '3', name: 'BATHROOM 1', type: 'description', itemCount: 12 }
            ],
            totalItems: 12,
            createdAt: '2024-01-10',
            lastModified: '2024-01-18'
          },
          {
            id: '3',
            name: 'Living Room Setup',
            sections: [
              { id: '4', name: 'FURNITURE', type: 'description', itemCount: 6 },
              { id: '5', name: 'ELECTRONICS', type: 'squareNet', itemCount: 2 }
            ],
            totalItems: 8,
            createdAt: '2024-01-05',
            lastModified: '2024-01-12'
          }
        ];
        
        // Save mock data to service
        for (const pkg of mockPackages) {
          await softoPackagesService.createPackage(pkg);
        }
        
        setPackages(mockPackages);
        setFilteredPackages(mockPackages);
      } else {
        setPackages(data);
        setFilteredPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [searchText, packages]);

  const getPackageColor = (name) => {
    if (!name) return { 
      bg: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)', 
      text: '#fff',
      icon: <ArchiveBoxIcon className="w-6 h-6" />
    };
    
    const lower = name.toLowerCase();
    
    if (lower.includes('kitchen')) return { 
      bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', 
      text: '#fff',
      icon: <ArchiveBoxIcon className="w-6 h-6" />
    };
    
    if (lower.includes('bathroom')) return { 
      bg: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', 
      text: '#fff',
      icon: <ArchiveBoxIcon className="w-6 h-6" />
    };
    
    if (lower.includes('living')) return { 
      bg: 'linear-gradient(135deg, #A8E6CF 0%, #7FCDCD 100%)', 
      text: '#fff',
      icon: <ArchiveBoxIcon className="w-6 h-6" />
    };
    
    return {
      bg: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
      text: '#fff',
      icon: <ArchiveBoxIcon className="w-6 h-6" />
    };
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'squareNet': return 'Square Footage';
      case 'description': return 'Description';
      default: return 'Default';
    }
  };

  const handleCreatePackage = async () => {
    if (!newPackageName.trim()) {
      alert('Please enter a package name');
      return;
    }

    const newPackage = {
      id: Date.now().toString(), // This will be overwritten by the service
      name: newPackageName,
      sections: [],
      totalItems: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    try {
      await softoPackagesService.createPackage(newPackage);
      setPackages(prev => [newPackage, ...prev]);
      setShowCreateModal(false);
      setNewPackageName('');
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Failed to create package. Please try again.');
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await softoPackagesService.deletePackage(packageId);
        setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">SOFTO Packages</h2>
            <p className="text-sm text-gray-600">
              Manage your project packages and quotation details.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#800000]/90 hover:bg-[#800000] text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add New Package
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map(pkg => {
          const { bg, text, icon } = getPackageColor(pkg.name);
          
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Package Header */}
              <div 
                className="p-3 text-white"
                style={{ background: bg }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{pkg.name}</h3>
                      <p className="text-xs opacity-90">
                        {pkg.sections.length} spaces • {pkg.totalItems} items
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-white/20 rounded">
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Spaces:</span>
                    <span className="font-medium">{pkg.sections.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{pkg.totalItems}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Last Modified:</span>
                    <span className="font-medium">{pkg.lastModified}</span>
                  </div>
                </div>

               

                {/* Actions */}
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link
                      to={`/softo-packages/${pkg.id}`}
                      className="flex-1 bg-[#800000]/10 hover:bg-[#800000]/20 text-[#800000] px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <EyeIcon className="w-3 h-3 mr-1" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <ArchiveBoxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-base font-medium text-gray-900 mb-2">
            {searchText ? 'No packages found' : 'No packages yet'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {searchText 
              ? 'Try adjusting your search terms' 
              : 'Create your first package to get started with project management.'
            }
          </p>
          {!searchText && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#800000]/90 hover:bg-[#800000] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm text-sm"
            >
              Create First Package
            </button>
          )}
        </div>
      )}

      {/* Create Package Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
            <h3 className="text-base font-medium text-gray-900 mb-3">Create New Package</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  placeholder="Enter package name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPackageName('');
                }}
                className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePackage}
                className="px-3 py-1 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Create Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftoPackages;
