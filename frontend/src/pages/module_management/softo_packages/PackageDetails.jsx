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
  CogIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon
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
  const [editingWorkItems, setEditingWorkItems] = useState({});
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

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
          // Package not found - redirect to packages list
          alert('Package not found');
          navigate('/softo-packages');
        }
      } catch (error) {
        console.error('Error fetching package data:', error);
        alert('Failed to load package. Please try again.');
        navigate('/softo-packages');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageData();
    }
  }, [id, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      if (packageData && sections.length > 0) {
        saveSectionsToService();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sections, packageData]);

  const saveSectionsToService = async () => {
    try {
      await softoPackagesService.updatePackageSections(packageData.id, sections);
      console.log('Auto-saved successfully');
    } catch (error) {
      console.error('Error auto-saving sections:', error);
    }
  };

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
      order: sections.length + 1,
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

  // Space reordering functions
  const moveSectionUp = (sectionId) => {
    setSections(prev => {
      const newSections = [...prev];
      const currentIndex = newSections.findIndex(s => s.id === sectionId);
      if (currentIndex > 0) {
        [newSections[currentIndex], newSections[currentIndex - 1]] = [newSections[currentIndex - 1], newSections[currentIndex]];
        // Update order numbers
        newSections.forEach((section, index) => {
          section.order = index + 1;
        });
      }
      return newSections;
    });
  };

  const moveSectionDown = (sectionId) => {
    setSections(prev => {
      const newSections = [...prev];
      const currentIndex = newSections.findIndex(s => s.id === sectionId);
      if (currentIndex < newSections.length - 1) {
        [newSections[currentIndex], newSections[currentIndex + 1]] = [newSections[currentIndex + 1], newSections[currentIndex]];
        // Update order numbers
        newSections.forEach((section, index) => {
          section.order = index + 1;
        });
      }
      return newSections;
    });
  };

  const handleAddWorkItem = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newWorkItem = {
      id: Date.now().toString(),
      srNo: section.workItems.length + 1,
      order: section.workItems.length + 1
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
                .map((item, index) => ({ ...item, srNo: index + 1, order: index + 1 }))
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

    // Mark this work item as being edited
    setEditingWorkItems(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const handleSaveWorkItem = async (sectionId, itemId) => {
    try {
      await softoPackagesService.updatePackageSections(packageData.id, sections);
      setEditingWorkItems(prev => ({
        ...prev,
        [itemId]: false
      }));
      console.log('Work item saved successfully');
    } catch (error) {
      console.error('Error saving work item:', error);
      alert('Failed to save work item. Please try again.');
    }
  };

  // Work item reordering functions
  const moveWorkItemUp = (sectionId, itemId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newWorkItems = [...section.workItems];
        const currentIndex = newWorkItems.findIndex(item => item.id === itemId);
        if (currentIndex > 0) {
          [newWorkItems[currentIndex], newWorkItems[currentIndex - 1]] = [newWorkItems[currentIndex - 1], newWorkItems[currentIndex]];
          // Update srNo and order
          newWorkItems.forEach((item, index) => {
            item.srNo = index + 1;
            item.order = index + 1;
          });
        }
        return { ...section, workItems: newWorkItems };
      }
      return section;
    }));
  };

  const moveWorkItemDown = (sectionId, itemId) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newWorkItems = [...section.workItems];
        const currentIndex = newWorkItems.findIndex(item => item.id === itemId);
        if (currentIndex < newWorkItems.length - 1) {
          [newWorkItems[currentIndex], newWorkItems[currentIndex + 1]] = [newWorkItems[currentIndex + 1], newWorkItems[currentIndex]];
          // Update srNo and order
          newWorkItems.forEach((item, index) => {
            item.srNo = index + 1;
            item.order = index + 1;
          });
        }
        return { ...section, workItems: newWorkItems };
      }
      return section;
    }));
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

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

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
      {sortedSections.map((section, sectionIndex) => {
        // Sort work items by order
        const sortedWorkItems = [...section.workItems].sort((a, b) => a.order - b.order);
        
        return (
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
                  {/* Space reordering buttons */}
                  <button
                    onClick={() => moveSectionUp(section.id)}
                    disabled={sectionIndex === 0}
                    className={`p-1 rounded ${sectionIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                  >
                    <ArrowUpIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveSectionDown(section.id)}
                    disabled={sectionIndex === sortedSections.length - 1}
                    className={`p-1 rounded ${sectionIndex === sortedSections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                  >
                    <ArrowDownIcon className="w-3 h-3" />
                  </button>
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
                    Add Work
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Order</th>
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
                    {sortedWorkItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-xs text-gray-900">{item.order}</td>
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
                          <div className="flex items-center space-x-1">
                            {/* Work item reordering */}
                            <button
                              onClick={() => moveWorkItemUp(section.id, item.id)}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                              <ArrowUpIcon className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveWorkItemDown(section.id, item.id)}
                              disabled={index === sortedWorkItems.length - 1}
                              className={`p-1 rounded ${index === sortedWorkItems.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                              <ArrowDownIcon className="w-3 h-3" />
                            </button>
                            {/* Save button */}
                            {editingWorkItems[item.id] && (
                              <button
                                onClick={() => handleSaveWorkItem(section.id, item.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save changes"
                              >
                                <CheckIcon className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteWorkItem(section.id, item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-3 py-2 text-xs font-medium text-gray-900 text-right">
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Order</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Sr No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Carpentry Work</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Size</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWorkItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-xs text-gray-900">{item.order}</td>
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
                          <div className="flex items-center space-x-1">
                            {/* Work item reordering */}
                            <button
                              onClick={() => moveWorkItemUp(section.id, item.id)}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                              <ArrowUpIcon className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveWorkItemDown(section.id, item.id)}
                              disabled={index === sortedWorkItems.length - 1}
                              className={`p-1 rounded ${index === sortedWorkItems.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                              <ArrowDownIcon className="w-3 h-3" />
                            </button>
                            {/* Save button */}
                            {editingWorkItems[item.id] && (
                              <button
                                onClick={() => handleSaveWorkItem(section.id, item.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Save changes"
                              >
                                <CheckIcon className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteWorkItem(section.id, item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="px-3 py-2 text-xs font-medium text-gray-900 text-right">
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
        );
      })}

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