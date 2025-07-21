import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CubeIcon,
  CogIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const ClientSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const menuItems = [
    { name: 'Dashboard', path: '/user-dashboard/softo-dashboard', icon: ChartBarIcon },
    { name: 'Leads', path: '/user-dashboard/softo-leads', icon: UserGroupIcon },
    { name: 'Clients', path: '/user-dashboard/softo-clients', icon: UserGroupIcon },
    { name: 'Quotations', path: '/user-dashboard/softo-quotations', icon: DocumentTextIcon },
    { name: 'Packages', path: '/user-dashboard/softo-packages', icon: CubeIcon },
    { name: 'Settings', path: '/user-dashboard/softo-settings', icon: CogIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#c79a6f]/90 hover:bg-[#c79a6f] text-white shadow-lg transition-colors duration-200"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-[#c79a6f]/90 shadow-sm">
          <div className="text-2xl font-bold text-white tracking-wide">SOFTO</div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {/* Main Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-[#800000]/90 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
};

export default ClientSidebar; 