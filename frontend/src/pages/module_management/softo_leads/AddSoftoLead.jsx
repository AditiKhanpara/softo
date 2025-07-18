import { useState } from 'react';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const AddSoftoLead = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    city: '',
    address: '',
    source: '',
    squareFeet: '',
    remark: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const sources = [
    { value: '', label: 'Select Source' },
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    
    if (!formData.squareFeet.trim()) {
      newErrors.squareFeet = 'Square feet is required';
    } else if (isNaN(formData.squareFeet) || parseInt(formData.squareFeet) <= 0) {
      newErrors.squareFeet = 'Square feet must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement API call
      console.log('Submitting lead data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Lead added successfully!');
      navigate('/user-dashboard/module/softo-leads');
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Lead</h2>
            <p className="text-gray-600">
              Add a new lead to your project management system.
            </p>
          </div>
          <Link
            to="/user-dashboard/module/softo-leads"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Leads
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                      errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter WhatsApp number"
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <HomeIcon className="w-5 h-5" />
              Address Information
            </h4>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                placeholder="Enter complete address"
              />
            </div>
          </div>

          {/* Project Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Project Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source *
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                    errors.source ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {sources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
                {errors.source && (
                  <p className="mt-1 text-sm text-red-600">{errors.source}</p>
                )}
              </div>

              <div>
                <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet *
                </label>
                <input
                  type="number"
                  id="squareFeet"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                    errors.squareFeet ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter square feet"
                  min="1"
                />
                {errors.squareFeet && (
                  <p className="mt-1 text-sm text-red-600">{errors.squareFeet}</p>
                )}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
              placeholder="Enter any additional remarks or notes about this lead"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/user-dashboard/module/softo-leads"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                'Add Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSoftoLead; 