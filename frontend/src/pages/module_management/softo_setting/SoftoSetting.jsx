import { 
  Cog6ToothIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CloudArrowUpIcon 
} from '@heroicons/react/24/outline';

const SoftoSetting = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SOFTO Settings</h2>
        <p className="text-gray-600">
          Configure SOFTO module settings and preferences.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <BellIcon className="w-5 h-5 text-[#c79a6f]/70 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive email alerts for important updates</p>
                </div>
              </div>
              <button className="bg-[#c79a6f]/90 hover:bg-[#c79a6f] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm">
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-[#c79a6f]/70 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">User Permissions</h4>
                  <p className="text-sm text-gray-600">Manage user access and roles</p>
                </div>
              </div>
              <button className="bg-[#c79a6f]/90 hover:bg-[#c79a6f] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm">
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <CloudArrowUpIcon className="w-5 h-5 text-[#c79a6f]/70 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Backup Settings</h4>
                  <p className="text-sm text-gray-600">Configure automatic backup schedules</p>
                </div>
              </div>
              <button className="bg-[#c79a6f]/90 hover:bg-[#c79a6f] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftoSetting;
