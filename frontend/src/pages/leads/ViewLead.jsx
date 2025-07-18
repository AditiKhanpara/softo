import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PencilIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import leadsService from '../../services/leadsService';

const ViewLead = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lead data from API
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await leadsService.getLeadById(id);
        setLead(data.lead || data || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError('Failed to fetch lead. Please try again.');
        setLead(null);
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
    const sourceLabels = {
      website: 'Website',
      social_media: 'Social Media',
      referral: 'Referral',
      advertisement: 'Advertisement',
      cold_call: 'Cold Call',
      other: 'Other'
    };
    return sourceLabels[source] || source;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-500 py-8">
            <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-500 py-8">
            <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Lead not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            to="/leads" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
            <p className="text-gray-600">View detailed information about this lead</p>
          </div>
          <Link
            to={`/leads/edit/${lead.id}`}
            className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Lead
          </Link>
        </div>
      </div>

      {/* Lead Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {lead.fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {lead.city}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {lead.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {lead.whatsappNumber}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {getSourceLabel(lead.source)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {lead.squareFeet} sq ft
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {lead.address}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg whitespace-pre-wrap">
              {lead.remark}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-2">
              {lead.addToClient ? (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Converted to Client
                </span>
              ) : (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Active Lead
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Timestamps</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(lead.createdAt)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(lead.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLead; 