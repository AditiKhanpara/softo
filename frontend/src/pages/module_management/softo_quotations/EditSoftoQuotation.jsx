import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CubeIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate, useParams } from 'react-router-dom';
import softoQuotationsService from '../../../services/softoQuotationsService';
import softoPackagesService from '../../../services/softoPackagesService';
import softoClientsService from '../../../services/softoClientsService';

const EditSoftoQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [packages, setPackages] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    projectName: '',
    projectCode: '',
    area: '',
    amount: '',
    salesPersonName: '',
    salesPersonMobile: '',
    discount: '',
    validFromDate: '',
    validToDate: '',
    softoClientId: '',
    packageId: ''
  });

  useEffect(() => {
    fetchQuotationData();
    fetchDropdownData();
  }, [id]);

  const fetchQuotationData = async () => {
    try {
      setFetching(true);
      const quotation = await softoQuotationsService.getQuotationById(id);
      
      setFormData({
        name: quotation.name || '',
        projectName: quotation.projectName || '',
        projectCode: quotation.projectCode || '',
        area: quotation.area || '',
        amount: quotation.amount || '',
        salesPersonName: quotation.salesPersonName || '',
        salesPersonMobile: quotation.salesPersonMobile || '',
        discount: quotation.discount || '',
        validFromDate: quotation.validFromDate ? new Date(quotation.validFromDate).toISOString().split('T')[0] : '',
        validToDate: quotation.validToDate ? new Date(quotation.validToDate).toISOString().split('T')[0] : '',
        softoClientId: quotation.softoClientId || '',
        packageId: quotation.packageId || ''
      });
    } catch (error) {
      console.error('Error fetching quotation:', error);
      alert('Failed to fetch quotation details');
      navigate('/user-dashboard/softo-quotations');
    } finally {
      setFetching(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [packagesData, clientsData] = await Promise.all([
        softoPackagesService.getAllPackages(),
        softoClientsService.getAllSoftoClients()
      ]);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      setPackages([]);
      setClients([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDiscountedPrice = () => {
    const amount = parseFloat(formData.amount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    return Math.max(0, amount - discount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.softoClientId || !formData.packageId) {
      alert('Please fill in all required fields (Name, Client, and Package)');
      return;
    }

    try {
      setLoading(true);
      
      const quotationData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        discount: parseFloat(formData.discount) || 0,
        discountedPrice: calculateDiscountedPrice(),
        validFromDate: formData.validFromDate ? new Date(formData.validFromDate).toISOString() : null,
        validToDate: formData.validToDate ? new Date(formData.validToDate).toISOString() : null
      };

      await softoQuotationsService.updateQuotation(id, quotationData);
      
      alert('Quotation updated successfully!');
      navigate('/user-dashboard/softo-quotations');
    } catch (error) {
      console.error('Error updating quotation:', error);
      alert(`Failed to update quotation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
          <span className="text-gray-700">Loading quotation details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/user-dashboard/softo-quotations"
              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Quotation</h2>
              <p className="text-sm text-gray-600">Update the quotation details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quotation Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter quotation name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Code
                </label>
                <input
                  type="text"
                  name="projectCode"
                  value={formData.projectCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter project code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (Sq. Ft.)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter area"
                />
              </div>
            </div>
          </div>

          {/* Client and Package Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Client & Package Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  name="softoClientId"
                  value={formData.softoClientId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name || client.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package *
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  required
                >
                  <option value="">Select a package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CurrencyRupeeIcon className="w-5 h-5 mr-2" />
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Amount (₹)
                </label>
                <input
                  type="text"
                  value={calculateDiscountedPrice().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Sales Person Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Sales Person Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Person Name
                </label>
                <input
                  type="text"
                  name="salesPersonName"
                  value={formData.salesPersonName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter sales person name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Person Mobile
                </label>
                <input
                  type="tel"
                  name="salesPersonMobile"
                  value={formData.salesPersonMobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Validity Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid From Date
                </label>
                <input
                  type="date"
                  name="validFromDate"
                  value={formData.validFromDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid To Date
                </label>
                <input
                  type="date"
                  name="validToDate"
                  value={formData.validToDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/user-dashboard/softo-quotations')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Quotation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSoftoQuotation; 