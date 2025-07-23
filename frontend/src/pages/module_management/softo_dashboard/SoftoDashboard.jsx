import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  CogIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const SoftoDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const moduleCards = [
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Softo</h2>
        <p className="text-gray-600">
          Manage your leads, clients, quotations, and packages from one place.
        </p>
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
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${card.color} ${card.hoverColor} transition-colors duration-200`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="ml-4 text-lg font-medium text-gray-900 group-hover:text-[#800000] transition-colors duration-200">
                  {card.title}
                </h4>
              </div>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoftoDashboard;
