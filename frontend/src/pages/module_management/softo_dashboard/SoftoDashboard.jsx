import { 
  ChartBarIcon, 
  FolderIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const SoftoDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SOFTO Dashboard</h2>
        <p className="text-gray-600">
          Welcome to the SOFTO module dashboard. This is where you can manage SOFTO-specific analytics and data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* SOFTO Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-[#c79a6f]/80 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SOFTO Users</p>
              <p className="text-2xl font-bold text-gray-900">456</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-[#800000]/80 rounded-lg">
              <FolderIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-[#c79a6f]/80 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45.2K</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftoDashboard;
