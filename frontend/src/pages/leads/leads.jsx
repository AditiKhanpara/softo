import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  UserPlusIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import leadsService from '../../services/leadsService';
import authService from '../../services/authService';

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [convertFormData, setConvertFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [convertErrors, setConvertErrors] = useState({});
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sources = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Check authentication first
      const authCheck = await authService.checkAuth();
      console.log('Auth check:', authCheck);
      
      if (!authCheck.isAuthenticated) {
        setError('You are not authenticated. Please log in.');
        setLeads([]);
        return;
      }
      
      console.log('User authenticated, fetching leads...');
      
      // Test user profile endpoint first
      try {
        const userData = await authService.getCurrentUser();
        console.log('User profile data:', userData);
      } catch (userError) {
        console.error('Error fetching user profile:', userError);
      }
      
      const data = await leadsService.getAllLeads();
      console.log('Leads data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      // Leads controller returns { success: true, data: [...], message: "..." }
      setLeads(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(`Failed to fetch leads: ${err.message}`);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Refresh leads when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchLeads();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = !selectedSource || lead.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsService.deleteLead(id);
        // Refresh the leads list
        const updatedLeads = leads.filter(lead => lead.id !== id);
        setLeads(updatedLeads);
        alert('Lead deleted successfully!');
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const handleConvertToClient = (lead) => {
    setSelectedLead(lead);
    setConvertFormData({ password: '', confirmPassword: '' });
    setConvertErrors({});
    setShowConvertModal(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!convertFormData.password) {
      newErrors.password = 'Password is required';
    } else if (convertFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (convertFormData.password !== convertFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setConvertErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await leadsService.convertLeadToClient(selectedLead.id, convertFormData.password);
        // Remove the lead from the list since it's now a client
        const updatedLeads = leads.filter(lead => lead.id !== selectedLead.id);
        setLeads(updatedLeads);
        alert('Lead converted to client successfully!');
        setShowConvertModal(false);
        setSelectedLead(null);
        setConvertFormData({ password: '', confirmPassword: '' });
      } catch (error) {
        console.error('Error converting lead to client:', error);
        alert('Failed to convert lead to client. Please try again.');
      }
    }
  };

  const handleConvertChange = (e) => {
    const { name, value } = e.target;
    setConvertFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (convertErrors[name]) {
      setConvertErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-lg shadow-sm p-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Leads Management</h2>
        <p className="text-gray-600">
          Manage and track your leads. View, add, and update lead information.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
            <div className="flex gap-2">
              <button
                onClick={fetchLeads}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/leads/add"
                className="bg-[#800000]/90 hover:bg-[#800000] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add New Lead
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
              >
                {sources.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000] mx-auto mb-4"></div>
              <p>Loading leads...</p>
            </div>
          ) : error ? (
            <div className="text-center text-gray-500 py-8">
              <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredLeads.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Square Feet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                        <div className="text-sm text-gray-500">{lead.city}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.whatsappNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.squareFeet} sq ft
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleConvertToClient(lead)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          title="Convert to Client"
                        >
                          <UserPlusIcon className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/leads/view/${lead.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="View Lead"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/leads/edit/${lead.id}`}
                          className="text-[#800000] hover:text-[#800000]/80 transition-colors duration-200"
                          title="Edit Lead"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Delete Lead"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No leads found. {searchTerm || selectedSource ? 'Try adjusting your search criteria.' : 'Add your first lead to get started.'}</p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p>Total leads in state: {leads.length}</p>
                  <p>Filtered leads: {filteredLeads.length}</p>
                  <p>Search term: "{searchTerm}"</p>
                  <p>Selected source: "{selectedSource}"</p>
                  <p>Loading: {loading ? 'Yes' : 'No'}</p>
                  <p>Error: {error || 'None'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Client Modal */}
      {showConvertModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Convert Lead to Client
                </h3>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleConvertSubmit} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Converting <span className="font-medium text-gray-900">{selectedLead.fullName}</span> to a client. 
                  Please set a password for their portal access.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={convertFormData.password}
                    onChange={handleConvertChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                      convertErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  {convertErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{convertErrors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 6 characters required
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={convertFormData.confirmPassword}
                    onChange={handleConvertChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 ${
                      convertErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  {convertErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{convertErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Convert to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
