import { useLocation } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/leads') return 'Leads';
    if (path === '/clients') return 'Clients';
    if (path.startsWith('/module/softo-dashboard')) return ' Dashboard';
    if (path.startsWith('/module/softo-leads')) return ' Leads';
    if (path.startsWith('/module/softo-clients')) return ' Clients';
    if (path.startsWith('/module/softo-quotations')) return ' Quotations';
    if (path.startsWith('/module/softo-packages')) return ' Packages';
    if (path.startsWith('/module/softo-settings')) return ' Settings';
    return 'Dashboard';
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Page Title */}
          <div className="flex items-center lg:ml-0 ml-12">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#800000]/90 hover:bg-[#800000] rounded-lg transition-colors duration-200 shadow-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
