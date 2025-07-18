import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  CubeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeQuotations: 0,
    completedPackages: 0,
    pendingSettings: 0
  });

  useEffect(() => {
    // TODO: Fetch user-specific stats from API
    // For now, using mock data
    setStats({
      totalProjects: 12,
      activeQuotations: 5,
      completedPackages: 8,
      pendingSettings: 2
    });
  }, []);

  const moduleCards = [
    {
      title: 'Dashboard',
      description: 'View your project overview and analytics',
      icon: ChartBarIcon,
      link: '/user-dashboard/module/softo-dashboard',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Leads',
      description: 'Manage your lead information and status',
      icon: UserGroupIcon,
      link: '/user-dashboard/module/softo-leads',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Clients',
      description: 'Access client management tools',
      icon: UserGroupIcon,
      link: '/user-dashboard/module/softo-clients',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Quotations',
      description: 'View and manage your quotations',
      icon: DocumentTextIcon,
      link: '/user-dashboard/module/softo-quotations',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Packages',
      description: 'Browse available service packages',
      icon: CubeIcon,
      link: '/user-dashboard/module/softo-packages',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Configure your account settings',
      icon: CogIcon,
      link: '/user-dashboard/module/softo-settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
        <p className="text-gray-600">
          Access your project information, quotations, and manage your account settings.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeQuotations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Packages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedPackages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CogIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Settings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingSettings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.color} ${card.hoverColor} transition-colors duration-200`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="ml-4 text-lg font-medium text-gray-900 group-hover:text-[#800000] transition-colors duration-200">
                    {card.title}
                  </h4>
                </div>
              </div>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentDuplicateIcon className="w-4 h-4 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">New quotation received</p>
              <p className="text-sm text-gray-600">Project: Website Development</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CubeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Package completed</p>
              <p className="text-sm text-gray-600">SEO Optimization Package</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">1 day ago</span>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CogIcon className="w-4 h-4 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Settings updated</p>
              <p className="text-sm text-gray-600">Notification preferences changed</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
