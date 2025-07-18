import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import clientsService from '../../services/clientsService';

const ViewClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client data from API
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await clientsService.getClientById(id);
        setClient(data.client || data || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to fetch client. Please try again.');
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
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
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-500 py-8">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Client not found.</p>
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
            to="/clients" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
            <p className="text-gray-600">View detailed information about this client</p>
          </div>
          <Link
            to={`/clients/edit/${client.id}`}
            className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Client
          </Link>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {client.fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {client.city}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {client.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {client.whatsappNumber}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {client.address}
            </div>
          </div>

          {/* Portal Access Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portal Access
            </label>
            <div className="flex items-center gap-2">
              {client.hasPassword ? (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                  No Access
                </span>
              )}
              <span className="text-sm text-gray-500">
                {client.hasPassword 
                  ? 'Client has access to the portal' 
                  : 'Client does not have portal access'
                }
              </span>
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
                {formatDate(client.createdAt)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {formatDate(client.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm">
              Send Email
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-sm">
              Send WhatsApp
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 shadow-sm">
              Create Quotation
            </button>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 shadow-sm">
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClient; 