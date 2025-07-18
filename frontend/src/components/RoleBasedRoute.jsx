import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';

const RoleBasedRoute = ({ children, allowedRoles = ['admin', 'client'] }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const authCheck = await authService.checkAuth();
        if (authCheck.isAuthenticated && authCheck.user) {
          // TODO: Replace with actual role from backend
          // For now, we'll use a mock role based on user data
          const role = authCheck.user.role || 'admin'; // Default to admin for now
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  if (!userRole) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // User doesn't have the required role
    // Redirect based on their role
    if (userRole === 'client') {
      return <Navigate to="/user-dashboard" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute; 