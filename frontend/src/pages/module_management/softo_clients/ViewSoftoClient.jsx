import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';

const ViewSoftoClient = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch client by ID
        console.log('Fetching client with ID:', id);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockClient = {
          id: id,
          fullName: 'John Doe',
          email: 'john@example.com',
          whatsappNumber: '+1234567890',
          city: 'New York',
          address: '123 Main St, New York, NY 10001',
          hasPassword: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z'
        };
        
        setClient(mockClient);
        setError(null);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to fetch client data. Please try again.');
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
              to="/module/softo-clients"
              className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              Back to Clients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h2>
            <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
            <Link
              to="/module/softo-clients"
              className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              Back to Clients
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Details</h2>
            <p className="text-gray-600">
              View detailed information about this client.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/user-dashboard/module/softo-clients"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Clients
            </Link>
            <Link
              to={`/user-dashboard/module/softo-clients/edit/${client.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Client
            </Link>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
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
                  {client.fullName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {client.email}
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
                    href={`https://wa.me/${client.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    {client.whatsappNumber}
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                  <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{client.city}</span>
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
                {client.address || 'No address provided'}
              </p>
            </div>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              Portal Access
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Status
              </label>
              {client.hasPassword ? (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                  No Access
                </span>
              )}
            </div>
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
                  {formatDate(client.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                  {formatDate(client.updatedAt)}
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
            to={`/user-dashboard/module/softo-clients/edit/${client.id}`}
            className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Client
          </Link>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this client?')) {
                // TODO: Implement delete functionality
                alert('Delete functionality will be implemented here');
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete Client
          </button>
          <button
            onClick={() => {
              // TODO: Implement reset password functionality
              alert('Reset password functionality will be implemented here');
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSoftoClient; 