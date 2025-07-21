import { useState, useEffect } from 'react';
import { 
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

const SoftoSetting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [packageType, setPackageType] = useState('description');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('description');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Tech Solutions Inc.',
    position: 'Project Manager'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    projectUpdates: true,
    quotationAlerts: true,
    systemAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  });

  // Fetch current package type on component mount
  useEffect(() => {
    fetchPackageType();
  }, []);

  const fetchPackageType = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:5000/api/package-form/get');
      // const data = await response.json();
      // setPackageType(data.type || 'description');
      
      // For now, using localStorage as fallback
      const savedType = localStorage.getItem('packageType');
      if (savedType) {
        setPackageType(savedType);
        setSelectedType(savedType);
      }
    } catch (error) {
      console.error('Error fetching package type:', error);
    }
  };

  const handlePackageTypeSelection = (newType) => {
    setSelectedType(newType);
    setShowConfirmation(true);
  };

  const handlePackageTypeConfirm = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch('http://localhost:5000/api/package-form/update-type', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ type: selectedType })
      // });
      
      setPackageType(selectedType);
      localStorage.setItem('packageType', selectedType);
      setShowConfirmation(false);
      
      // Show success message
      alert(`Package type updated to ${selectedType === 'description' ? 'Description-based' : 'Square Footage-based'}`);
    } catch (error) {
      console.error('Error updating package type:', error);
      alert('Failed to update package type. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageTypeCancel = () => {
    setSelectedType(packageType); // Reset to current type
    setShowConfirmation(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSecurityChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleProfileSave = () => {
    // TODO: Implement API call
    alert('Profile updated successfully!');
  };

  const handlePasswordSave = () => {
    // TODO: Implement API call
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'packages', name: 'Package Settings', icon: ArchiveBoxIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-600">
          Manage your account settings, security preferences, and notification preferences.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={profileData.position}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handlePasswordSave}
                    className="px-6 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        securitySettings.twoFactorAuth ? 'bg-[#800000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                    </div>
                    <button
                      onClick={() => handleSecurityChange('loginAlerts', !securitySettings.loginAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        securitySettings.loginAlerts ? 'bg-[#800000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        value ? 'bg-[#800000]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Settings Tab */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Package Type Configuration</h3>
                <p className="text-gray-600 mb-6">
                  Choose how you want to manage your package details. This setting will determine the table structure when you add new packages.
                </p>
                
                <div className="space-y-4">
                  {/* Description-based Option */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedType === 'description' 
                      ? 'border-[#800000] bg-[#800000]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            id="description-type"
                            name="packageType"
                            value="description"
                            checked={selectedType === 'description'}
                            onChange={(e) => handlePackageTypeSelection(e.target.value)}
                            className="w-4 h-4 text-[#800000] border-gray-300 focus:ring-[#800000]"
                          />
                          <label htmlFor="description-type" className="ml-3 text-lg font-medium text-gray-900">
                            Description-based Packages
                          </label>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Use this option for packages that require detailed descriptions and specifications.
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Table Structure:</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• Sr No | Carpentry Work | Description | Size | Price | Actions</p>
                            <p>• Manual price entry</p>
                            <p>• Detailed descriptions for each item</p>
                            <p>• Flexible size specifications</p>
                          </div>
                        </div>
                      </div>
                      {selectedType === 'description' && (
                        <div className="ml-4">
                          <CheckIcon className="w-6 h-6 text-[#800000]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Square Footage-based Option */}
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedType === 'squareNet' 
                      ? 'border-[#800000] bg-[#800000]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            id="squareNet-type"
                            name="packageType"
                            value="squareNet"
                            checked={selectedType === 'squareNet'}
                            onChange={(e) => handlePackageTypeSelection(e.target.value)}
                            className="w-4 h-4 text-[#800000] border-gray-300 focus:ring-[#800000]"
                          />
                          <label htmlFor="squareNet-type" className="ml-3 text-lg font-medium text-gray-900">
                            Square Footage-based Packages
                          </label>
                        </div>
                        <p className="text-gray-600 mb-3">
                          Use this option for packages that require area calculations and square footage pricing.
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Table Structure:</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• Sr No | Item | Nos | Width | Length | Sq. Ft. | Rs./sFt. | Total | Actions</p>
                            <p>• Automatic square footage calculation</p>
                            <p>• Price per square foot</p>
                            <p>• Automatic total calculation</p>
                          </div>
                        </div>
                      </div>
                      {selectedType === 'squareNet' && (
                        <div className="ml-4">
                          <CheckIcon className="w-6 h-6 text-[#800000]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isLoading && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#800000] mr-2"></div>
                      <span className="text-sm text-blue-800">Updating package type...</span>
                    </div>
                  </div>
                )}

                {showConfirmation && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2">Confirm Package Type Change</h4>
                    <p className="text-sm text-yellow-800">
                      You are about to change the package type to <strong>{selectedType === 'description' ? 'Description-based' : 'Square Footage-based'}</strong>. This action cannot be undone.
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        onClick={handlePackageTypeCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePackageTypeConfirm}
                        className="px-4 py-2 bg-[#800000]/90 hover:bg-[#800000] text-white rounded-lg transition-colors duration-200 shadow-sm"
                      >
                        Confirm Change
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Note:</h4>
                  <p className="text-sm text-yellow-800">
                    Changing the package type will affect how new packages are created. Existing packages will retain their current structure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    id="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Account Information</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Account Type: Client</p>
                    <p>Member Since: January 2024</p>
                    <p>Last Login: Today at 10:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftoSetting;
