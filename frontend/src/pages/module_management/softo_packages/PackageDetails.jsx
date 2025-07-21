import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import softoPackagesService from '../../../services/softoPackagesService';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [sections, setSections] = useState([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionType, setNewSectionType] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch package data
  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
        const data = await softoPackagesService.getPackageById(id);
        
        if (data) {
          setPackageData(data);
          setSections(data.sections || []);
        } else {
          // If no data found, create mock data for demonstration
          const mockPackageData = {
            id: id,
            name: 'Kitchen Renovation',
            sections: [
              {
                id: '1',
                name: 'CABINETS',
                type: 'squareNet',
                workItems: [
                  { id: '1', srNo: 1, item: 'MAIN PLATFORM (SS BASKET)', nos: 1, width: 9.25, length: 2.50, sqFt: 23.13, pricePerSqFt: 1500, total: 34687.50 },
                  { id: '2', srNo: 2, item: 'CHIMNEY CABINET', nos: 1, width: 9.25, length: 4.00, sqFt: 37.00, pricePerSqFt: 1200, total: 44400.00 },
                  { id: '3', srNo: 3, item: 'SERVICE PLATFORM', nos: 1, width: 5.50, length: 2.50, sqFt: 13.75, pricePerSqFt: 1300, total: 17875.00 },
                  { id: '4', srNo: 4, item: 'SERVICE PLATFORM(OVERHEAD)', nos: 1, width: 8.00, length: 5.00, sqFt: 40.00, pricePerSqFt: 1200, total: 48000.00 }
                ]
              },
              {
                id: '2',
                name: 'ACCESSORIES',
                type: 'description',
                workItems: [
                  { id: '5', srNo: 1, carpentryWork: 'SOFA', description: 'per Meter) with Ashan patta & sofa cover with 2 cushion size 12*18', size: '', price: 3500 },
                  { id: '6', srNo: 2, carpentryWork: 'RECEPTION TABLE', description: 'Ply with Laminate finish', size: '', price: 7500 },
                  { id: '7', srNo: 3, carpentryWork: 'CHAIR', description: 'Regular staff chair', size: '', price: 3500 }
                ]
              }
            ]
          };
          setPackageData(mockPackageData);
          setSections(mockPackageData.sections);
        }
      } catch (error) {
        console.error('Error fetching package data:', error);
        // Show error or redirect
        navigate('/softo-packages');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageData();
    }
  }, [id, navigate]);

  // Save sections to service when they change
  useEffect(() => {
    if (packageData && sections.length > 0) {
      const saveSections = async () => {
        try {
          await softoPackagesService.updatePackageSections(packageData.id, sections);
        } catch (error) {
          console.error('Error saving sections:', error);
        }
      };
      saveSections();
    }
  }, [sections, packageData]);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'squareNet': return 'Square Footage';
      case 'description': return 'Description';
      default: return 'Default';
    }
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      alert('Please enter a space name');
      return;
    }

    if (!newSectionType) {
      alert('Please select a space type');
      return;
    }
    
    const newSection = {
      id: Date.now().toString(),
      name: newSectionName,
      type: newSectionType,
      workItems: []
    };

    setSections(prev => [...prev, newSection]);
    setShowAddSectionModal(false);
    setNewSectionName('');
    setNewSectionType('');
  };

  const handleEditSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSectionId(sectionId);
      setEditingSectionName(section.name);
    }
  };

  const handleSaveSectionEdit = () => {
    if (!editingSectionName.trim()) {
      alert('Please enter a space name');
      return;
    }

    setSections(prev => prev.map(section => 
      section.id === editingSectionId 
        ? { ...section, name: editingSectionName }
        : section
    ));
    setEditingSectionId(null);
    setEditingSectionName('');
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      setSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const handleAddWorkItem = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newWorkItem = {
      id: Date.now().toString(),
      srNo: section.workItems.length + 1
    };

    if (section.type === 'squareNet') {
      Object.assign(newWorkItem, {
        item: '',
        nos: 1,
        width: 0,
        length: 0,
        sqFt: 0,
        pricePerSqFt: 0,
        total: 0
      });
    } else {
      Object.assign(newWorkItem, {
        carpentryWork: '',
        description: '',
        size: '',
        price: 0
      });
    }

    setSections(prev => prev.map(s => 
      s.id === sectionId 
        ? { ...s, workItems: [...s.workItems, newWorkItem] }
        : s
    ));
  };

  const handleDeleteWorkItem = (sectionId, itemId) => {
    if (window.confirm('Are you sure you want to delete this work item?')) {
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              workItems: section.workItems
                .filter(item => item.id !== itemId)
                .map((item, index) => ({ ...item, srNo: index + 1 }))
            }
          : section
      ));
    }
  };

  const handleWorkItemChange = (sectionId, itemId, field, value) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            workItems: section.workItems.map(item => {
              if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };
                
                // Auto-calculate for square footage type
                if (section.type === 'squareNet' && (field === 'nos' || field === 'width' || field === 'length' || field === 'pricePerSqFt')) {
                  const nos = Number(updatedItem.nos || 0);
                  const width = Number(updatedItem.width || 0);
                  const length = Number(updatedItem.length || 0);
                  const pricePerSqFt = Number(updatedItem.pricePerSqFt || 0);
                  
                  updatedItem.sqFt = (width * length * nos).toFixed(2);
                  updatedItem.total = (Number(updatedItem.sqFt) * pricePerSqFt).toFixed(2);
                }
                
                return updatedItem;
              }
              return item;
            })
          }
        : section
    ));
  };

  const calculateSectionTotal = (workItems, type) => {
    if (type === 'squareNet') {
      return workItems.reduce((sum, item) => sum + Number(item.total || 0), 0).toFixed(2);
    } else {
      return workItems.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2);
    }
  };

  const calculatePackageTotal = () => {
    return sections.reduce((sum, section) => {
      return sum + Number(calculateSectionTotal(section.workItems, section.type));
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/softo-packages')}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{packageData.name}</h2>
              <p className="text-sm text-gray-600">
                {sections.length} spaces • {sections.reduce((sum, section) => sum + section.workItems.length, 0)} items
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="bg-[#800000]/90 hover:bg-[#800000] text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Space
            </button>
          </div>
        </div>
      </div>

      {/* Package Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-[#800000]">{sections.length}</div>
            <div className="text-xs text-gray-600">Total Spaces</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#800000]">
              {sections.reduce((sum, section) => sum + section.workItems.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#800000]">
              {sections.filter(s => s.type === 'squareNet').length}
            </div>
            <div className="text-xs text-gray-600">Square Footage Spaces</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#800000]">
              {sections.filter(s => s.type === 'description').length}
            </div>
            <div className="text-xs text-gray-600">Description Spaces</div>
          </div>
        </div>
      </div>

      {/* Spaces */}
      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Space Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {editingSectionId === section.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-sm"
                    />
                    <button
                      onClick={handleSaveSectionEdit}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className="text-base font-medium text-gray-900">{section.name}</h3>
                )}
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {getTypeLabel(section.type)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditSection(section.id)}
                  className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  <PencilIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleAddWorkItem(section.id)}
                  className="bg-[#800000]/90 hover:bg-[#800000] text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                >
                  Add Work Item
                </button>
              </div>
            </div>
          </div>

          {/* Space Table */}
          <div className="overflow-x-auto">
            {section.type === 'squareNet' ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Sr No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Item</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Nos</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Width</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Length</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Sq. Ft.</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Rs./sFt.</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Total</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.workItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-3 py-2 text-xs text-gray-900">{item.srNo}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'item', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.nos}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'nos', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.width}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'width', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.length}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'length', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">{item.sqFt}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.pricePerSqFt}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'pricePerSqFt', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-900">{item.total}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDeleteWorkItem(section.id, item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-3 py-2 text-xs font-medium text-gray-900 text-right">
                      Space Total:
                    </td>
                    <td className="px-3 py-2 text-xs font-bold text-[#800000]">
                      ₹{calculateSectionTotal(section.workItems, section.type)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Sr No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Carpentry Work</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Description</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Size</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Price</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.workItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-3 py-2 text-xs text-gray-900">{item.srNo}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.carpentryWork}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'carpentryWork', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <textarea
                          value={item.description}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs resize-none"
                          rows="2"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'size', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleWorkItemChange(section.id, item.id, 'price', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleDeleteWorkItem(section.id, item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="px-3 py-2 text-xs font-medium text-gray-900 text-right">
                      Space Total:
                    </td>
                    <td className="px-3 py-2 text-xs font-bold text-[#800000]">
                      ₹{calculateSectionTotal(section.workItems, section.type)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      ))}

      {/* Package Total */}
      {sections.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-900">Package Summary</h3>
            <div className="text-right">
              <div className="text-xl font-bold text-[#800000]">
                ₹{calculatePackageTotal()}
              </div>
              <div className="text-xs text-gray-600">Total Package Value</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
            <h3 className="text-base font-medium text-gray-900 mb-3">Add New Space</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Name
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Enter space name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sectionType"
                      value="description"
                      checked={newSectionType === 'description'}
                      onChange={(e) => setNewSectionType(e.target.value)}
                      className="w-3 h-3 text-[#800000] border-gray-300 focus:ring-[#800000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Description-based</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sectionType"
                      value="squareNet"
                      checked={newSectionType === 'squareNet'}
                      onChange={(e) => setNewSectionType(e.target.value)}
                      className="w-3 h-3 text-[#800000] border-gray-300 focus:ring-[#800000]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Square Footage-based</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowAddSectionModal(false);
                  setNewSectionName('');
                  setNewSectionType('');
                }}
                className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSection}
                className="px-3 py-1 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 text-sm"
              >
                Add Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails; 