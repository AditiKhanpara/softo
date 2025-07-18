import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  PlusIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const SoftoClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setClients([
        {
          id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          whatsappNumber: '+1234567890',
          city: 'New York',
          address: '123 Main St, New York, NY 10001',
          hasPassword: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          whatsappNumber: '+1987654321',
          city: 'Los Angeles',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          hasPassword: false,
          createdAt: '2024-01-20T14:45:00Z'
        },
        {
          id: 3,
          fullName: 'Mike Johnson',
          email: 'mike@example.com',
          whatsappNumber: '+1122334455',
          city: 'Chicago',
          address: '789 Pine St, Chicago, IL 60601',
          hasPassword: true,
          createdAt: '2024-01-25T09:15:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredClients = clients.filter(client => {
    return client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           client.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        // TODO: Implement API call
        const updatedClients = clients.filter(client => client.id !== id);
        setClients(updatedClients);
        alert('Client deleted successfully!');
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client. Please try again.');
      }
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Management</h2>
        <p className="text-gray-600">
          View and manage your client information and project details.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Client Directory</h3>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/user-dashboard/module/softo-clients/add"
                className="flex items-center gap-2 px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4" />
                Add Client
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000] mx-auto mb-4"></div>
              <p>Loading clients...</p>
            </div>
          ) : error ? (
            <div className="text-center text-gray-500 py-8">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredClients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Portal Access
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.fullName}</div>
                        <div className="text-sm text-gray-500">ID: {client.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.whatsappNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{client.city}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{client.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.hasPassword ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Access
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/user-dashboard/module/softo-clients/view/${client.id}`}
                          className="text-[#800000] hover:text-[#800000]/80 transition-colors duration-200"
                          title="View Client"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/user-dashboard/module/softo-clients/edit/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="Edit Client"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Delete Client"
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
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No clients found. {searchTerm ? 'Try adjusting your search criteria.' : 'Add your first client to get started.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftoClients;
