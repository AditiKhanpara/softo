import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon
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
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editingPackageName, setEditingPackageName] = useState('');

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await softoPackagesService.getAllPackages();
      setPackages(data);
      setFilteredPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      
      // Handle authentication errors
      if (error.message.includes('Authentication')) {
        alert('Please log in to access packages.');
        // You might want to redirect to login page here
        return;
      }
      
      setPackages([]);
      setFilteredPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear localStorage data (for testing/cleanup)
  const clearStorageData = () => {
    if (window.confirm('This will clear all local package data. Are you sure?')) {
      softoPackagesService.clearAllStorageData();
      fetchPackages(); // Refresh the list
    }
  };

  useEffect(() => {
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [searchText, packages]);

  const getPackageColor = (pkg, index) => {
    if (!pkg || !pkg.name) return { 
      bg: 'linear-gradient(135deg, #E8E8E8 0%, #D4D4D4 100%)', 
      text: '#4A5568',
      icon: <ArchiveBoxIcon className="w-4 h-4" />
    };
    
    // Use index to cycle through 3 fixed colors
    const colorIndex = index % 3;
    
    const colorSchemes = [
      {
        bg: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
        text: '#2D3748',
        icon: <ArchiveBoxIcon className="w-4 h-4" />
      },
      {
        bg: 'linear-gradient(135deg, #FEF5E7 0%, #FED7AA 100%)',
        text: '#744210',
        icon: <ArchiveBoxIcon className="w-4 h-4" />
      },
      {
        bg: 'linear-gradient(135deg, #F0FFF4 0%, #C6F6D5 100%)',
        text: '#22543D',
        icon: <ArchiveBoxIcon className="w-4 h-4" />
      }
    ];
    
    return colorSchemes[colorIndex];
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

    try {
      const newPackage = await softoPackagesService.createPackage({
        name: newPackageName
      });
      
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

  const handleEditPackage = (packageId, currentName) => {
    setEditingPackageId(packageId);
    setEditingPackageName(currentName);
  };

  const handleSavePackageEdit = async () => {
    if (!editingPackageName.trim()) {
      alert('Please enter a package name');
      return;
    }

    try {
      const updatedPackage = await softoPackagesService.updatePackage(editingPackageId, {
        name: editingPackageName,
        lastModified: new Date().toISOString().split('T')[0]
      });

      setPackages(prev => prev.map(pkg => 
        pkg.id === editingPackageId 
          ? { ...pkg, name: editingPackageName, lastModified: new Date().toISOString().split('T')[0] }
          : pkg
      ));

      setEditingPackageId(null);
      setEditingPackageName('');
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package name. Please try again.');
    }
  };

  const handleCancelPackageEdit = () => {
    setEditingPackageId(null);
    setEditingPackageName('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">SOFTO Packages</h2>
            <p className="text-sm text-gray-600 mb-3">
              Manage your project packages and quotation details.
            </p>
            {/* Search in header */}
            <div className="relative max-w-md">
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
          <div className="flex items-center space-x-2">
            <button
              onClick={clearStorageData}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
              title="Clear localStorage data (for testing)"
            >
              Clear Data
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#800000]/90 hover:bg-[#800000] text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add New Package
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {filteredPackages.map((pkg, index) => {
          const { bg, text, icon } = getPackageColor(pkg, index);
          
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:scale-[1.02]"
            >
              {/* Package Header */}
              <div 
                className="p-3"
                style={{ background: bg }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                      {icon}
                    </div>
                    <div className="flex-1">
                      {editingPackageId === pkg.id ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={editingPackageName}
                            onChange={(e) => setEditingPackageName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSavePackageEdit();
                              } else if (e.key === 'Escape') {
                                handleCancelPackageEdit();
                              }
                            }}
                            className="bg-white/20 text-gray-800 placeholder-gray-600 px-2 py-1 rounded text-sm border border-white/30 focus:outline-none focus:border-white/50"
                            placeholder="Enter package name"
                            autoFocus
                          />
                          <button
                            onClick={handleSavePackageEdit}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-white/10 rounded"
                            title="Save"
                          >
                            <CheckIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelPackageEdit}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-white/10 rounded"
                            title="Cancel"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <h3 className="font-semibold text-sm" style={{ color: text }}>{pkg.name}</h3>
                          <button
                            onClick={() => handleEditPackage(pkg.id, pkg.name)}
                            className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: text }}
                            title="Edit package name"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs opacity-75" style={{ color: text }}>
                        {pkg.sections.length} spaces • {pkg.totalItems} items
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-2">
                <div className="space-y-1">
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
                <div className="mt-2 pt-2 border-t border-gray-100">
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
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
