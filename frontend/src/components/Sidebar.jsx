import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  UserIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleModule = () => setIsModuleOpen(!isModuleOpen);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Leads', path: '/leads', icon: UserGroupIcon },
    { name: 'Clients', path: '/clients', icon: UserIcon },
  ];

  const moduleItems = [
    { name: ' Dashboard', path: '/module/softo-dashboard', icon: ChartBarIcon },
    { name: ' Leads', path: '/module/softo-leads', icon: UserGroupIcon },
    { name: ' Clients', path: '/module/softo-clients', icon: UserIcon },
    { name: ' Quotations', path: '/module/softo-quotations', icon: FolderIcon },
    { name: ' Packages', path: '/module/softo-packages', icon: FolderIcon },
    { name: ' Settings', path: '/module/softo-settings', icon: CogIcon },
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

          {/* Module Management Dropdown */}
          <div className="mt-6">
            <button
              onClick={toggleModule}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isModuleOpen || location.pathname.startsWith('/module')
                  ? 'bg-[#800000]/90 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center">
                <FolderIcon className="w-5 h-5 mr-3" />
                Module Management
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${isModuleOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Items */}
            <div className={`mt-1 space-y-1 ${isModuleOpen ? 'block' : 'hidden'}`}>
              {moduleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-8 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-[#c79a6f]/90 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
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

export default Sidebar;
