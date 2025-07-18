import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import authService from '../services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/leads') return 'Leads';
    if (path === '/clients') return 'Clients';
    if (path === '/user-dashboard' || path === '/user-dashboard/') return 'Dashboard';
    if (path.startsWith('/user-dashboard/module/softo-dashboard')) return 'Dashboard';
    if (path.startsWith('/user-dashboard/module/softo-leads')) return 'Leads';
    if (path.startsWith('/user-dashboard/module/softo-clients')) return 'Clients';
    if (path.startsWith('/user-dashboard/module/softo-quotations')) return 'Quotations';
    if (path.startsWith('/user-dashboard/module/softo-packages')) return 'Packages';
    if (path.startsWith('/user-dashboard/module/softo-settings')) return 'Settings';
    if (path.startsWith('/module/softo-dashboard')) return 'Dashboard';
    if (path.startsWith('/module/softo-leads')) return 'Leads';
    if (path.startsWith('/module/softo-clients')) return 'Clients';
    if (path.startsWith('/module/softo-quotations')) return 'Quotations';
    if (path.startsWith('/module/softo-packages')) return 'Packages';
    if (path.startsWith('/module/softo-settings')) return 'Settings';
    return 'Dashboard';
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        authService.logout();
        setCurrentUser(null);
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        // Still redirect to login even if there's an error
        navigate('/login');
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Page Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-medium text-gray-900">
                {currentUser?.fullName || currentUser?.name || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#800000]/90 hover:bg-[#800000] rounded-lg transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
