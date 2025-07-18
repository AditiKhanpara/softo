import { UserGroupIcon } from '@heroicons/react/24/outline';

const SoftoLeads = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4"> Leads</h2>
        <p className="text-gray-600">
          Manage  leads and track their progress through the sales pipeline.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900"> Lead Management</h3>
            <button className="bg-[#800000]/90 hover:bg-[#800000] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm">
              Add  Lead
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <UserGroupIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No  leads found. Add your first  lead to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftoLeads;
