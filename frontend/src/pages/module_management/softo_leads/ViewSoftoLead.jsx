import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  HomeIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';

import softoLeadsService from '../../../services/softoLeadsService';

const ViewSoftoLead = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await softoLeadsService.getLeadById(id);
        console.log('Lead data:', data);
        
        setLead(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('Failed to fetch lead data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLead();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceLabel = (source) => {
    return source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/module/softo-leads"
              className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h2>
            <p className="text-gray-600 mb-4">The lead you're looking for doesn't exist.</p>
            <Link
              to="/module/softo-leads"
              className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead Details</h2>
            <p className="text-gray-600">
              View detailed information about this lead.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/user-dashboard/module/softo-leads"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Leads
            </Link>
            <Link
              to={`/user-dashboard/module/softo-leads/edit/${lead.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Lead
            </Link>
          </div>
        </div>
      </div>

      {/* Lead Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                  {lead.fullName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a 
                    href={`mailto:${lead.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a 
                    href={`https://wa.me/${lead.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    {lead.whatsappNumber}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                  <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{lead.city}</span>
                </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border min-h-[60px] flex items-center">
                {lead.address || 'No address provided'}
              </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source
                </label>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getSourceLabel(lead.source)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                  {lead.squareFeet} sq ft
                </p>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border min-h-[80px]">
              {lead.remark || 'No remarks provided'}
            </p>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Timestamps
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created At
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                  {formatDate(lead.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/user-dashboard/module/softo-leads/edit/${lead.id}`}
            className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Lead
          </Link>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this lead?')) {
                // TODO: Implement delete functionality
                alert('Delete functionality will be implemented here');
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete Lead
          </button>
          <button
            onClick={() => {
              // TODO: Implement convert to client functionality
              alert('Convert to client functionality will be implemented here');
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Convert to Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSoftoLead; 