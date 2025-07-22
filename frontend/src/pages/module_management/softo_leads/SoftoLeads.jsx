import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  EyeIcon,
  ArrowPathIcon,
  UserPlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import softoLeadsService from '../../../services/softoLeadsService';

const SoftoLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await softoLeadsService.getAllLeads();
      console.log('Softo leads data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      // Handle different response formats
      let leadsArray = [];
      if (Array.isArray(data)) {
        leadsArray = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        leadsArray = data.data;
      } else if (data && Array.isArray(data)) {
        leadsArray = data;
      }
      
      // Filter out leads that have already been converted to clients
      const activeLeads = leadsArray.filter(lead => !lead.addToClient);
      
      setLeads(activeLeads);
      setError(null);
    } catch (err) {
      console.error('Error fetching softo leads:', err);
      setError('Failed to fetch leads. Please try again.');
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
    return lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lead.source?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await softoLeadsService.deleteLead(id);
        alert('Lead deleted successfully!');
        fetchLeads(); // Refresh the list
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const handleConvertToClient = (lead) => {
    setSelectedLead(lead);
    setShowConvertModal(true);
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await softoLeadsService.convertLeadToClient(selectedLead.id);
      // Refresh the leads list to get updated data from backend
      await fetchLeads();
      alert('Lead converted to client successfully!');
      setShowConvertModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error converting lead to client:', error);
      alert('Failed to convert lead to client. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Leads</h2>
              <p className="text-sm text-gray-600 mb-3">
                Manage your lead information and track their status.
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={fetchLeads}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 text-sm"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/user-dashboard/module/softo-leads/add"
                className="flex items-center gap-2 px-3 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Lead
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Leads</h2>
            <p className="text-sm text-gray-600 mb-3">
              Manage your lead information and track their status.
            </p>
            {/* Search in header */}
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, city, or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 text-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              to="/user-dashboard/module/softo-leads/add"
              className="flex items-center gap-2 px-3 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Lead
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Square Feet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Loading leads...' : 'No leads found'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#800000]/10 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-[#800000]" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {lead.id?.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{lead.whatsappNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.city || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{lead.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {lead.source || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.squareFeet || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.addToClient ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Converted
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      )}
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
                          to={`/user-dashboard/module/softo-leads/view/${lead.id}`}
                          className="text-[#800000] hover:text-[#800000]/80 transition-colors duration-200"
                          title="View Lead"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/user-dashboard/module/softo-leads/edit/${lead.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
          <p className="text-sm text-gray-600">
            Total leads: {leads.length}
          </p>
        </div>
      </div> */}

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
                  Are you sure you want to convert <span className="font-medium text-gray-900">{selectedLead.fullName}</span> from a lead to a client? 
                  This will move them to your clients list.
                </p>
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

export default SoftoLeads;
