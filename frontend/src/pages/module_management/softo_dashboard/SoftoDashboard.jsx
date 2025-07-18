import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  CubeIcon,
  DocumentDuplicateIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const SoftoDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeQuotations: 0,
    completedPackages: 0,
    pendingSettings: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProjects: 15,
        activeQuotations: 8,
        completedPackages: 12,
        pendingSettings: 3
      });
      
      setRecentActivity([
        {
          id: 1,
          type: 'quotation',
          title: 'New quotation received',
          description: 'Website Development Project',
          time: '2 hours ago',
          icon: DocumentDuplicateIcon,
          color: 'bg-green-100 text-green-600'
        },
        {
          id: 2,
          type: 'package',
          title: 'Package completed',
          description: 'SEO Optimization Package',
          time: '1 day ago',
          icon: CubeIcon,
          color: 'bg-blue-100 text-blue-600'
        },
        {
          id: 3,
          type: 'settings',
          title: 'Settings updated',
          description: 'Notification preferences changed',
          time: '3 days ago',
          icon: CogIcon,
          color: 'bg-orange-100 text-orange-600'
        },
        {
          id: 4,
          type: 'client',
          title: 'New client added',
          description: 'John Doe - E-commerce Project',
          time: '5 days ago',
          icon: UserGroupIcon,
          color: 'bg-purple-100 text-purple-600'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const moduleCards = [
    {
      title: 'Leads',
      description: 'Manage your lead information and status',
      icon: UserGroupIcon,
      link: '/user-dashboard/module/softo-leads',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      count: 25
    },
    {
      title: 'Clients',
      description: 'Access client management tools',
      icon: UserGroupIcon,
      link: '/user-dashboard/module/softo-clients',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      count: 18
    },
    {
      title: 'Quotations',
      description: 'View and manage your quotations',
      icon: DocumentTextIcon,
      link: '/user-dashboard/module/softo-quotations',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      count: 12
    },
    {
      title: 'Packages',
      description: 'Browse available service packages',
      icon: CubeIcon,
      link: '/user-dashboard/module/softo-packages',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      count: 8
    },
    {
      title: 'Settings',
      description: 'Configure your account settings',
      icon: CogIcon,
      link: '/user-dashboard/module/softo-settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      count: 5
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Dashboard</h2>
        <p className="text-gray-600">
          Welcome to your project management dashboard. Monitor your projects, quotations, and client activities.
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
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-600 ml-1">+12%</span>
            <span className="text-gray-500 ml-2">from last month</span>
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
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-600 ml-1">+8%</span>
            <span className="text-gray-500 ml-2">from last month</span>
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
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-600 ml-1">+15%</span>
            <span className="text-gray-500 ml-2">from last month</span>
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
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownIcon className="w-4 h-4 text-red-500" />
            <span className="text-red-600 ml-1">-3%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Module Access */}
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
                <span className="text-sm font-medium text-gray-500">{card.count}</span>
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
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Project Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Website Development</h4>
              <p className="text-sm text-gray-600">E-commerce Platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">75%</p>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Mobile App Development</h4>
              <p className="text-sm text-gray-600">iOS & Android App</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">45%</p>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">SEO Optimization</h4>
              <p className="text-sm text-gray-600">Search Engine Optimization</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">90%</p>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftoDashboard;
