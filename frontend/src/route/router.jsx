import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/layout';
import ClientLayout from '../layout/ClientLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import UserDashboard from '../pages/dashboard/UserDashboard';
import Leads from '../pages/leads/leads';
import AddLead from '../pages/leads/AddLead';
import EditLead from '../pages/leads/EditLead';
import ViewLead from '../pages/leads/ViewLead';
import Clients from '../pages/clients/clients';
import AddClient from '../pages/clients/AddClient';
import EditClient from '../pages/clients/EditClient';
import ViewClient from '../pages/clients/ViewClient';
import SoftoDashboard from '../pages/module_management/softo_dashboard/SoftoDashboard';
import SoftoLeads from '../pages/module_management/softo_leads/SoftoLeads';
import AddSoftoLead from '../pages/module_management/softo_leads/AddSoftoLead';
import EditSoftoLead from '../pages/module_management/softo_leads/EditSoftoLead';
import ViewSoftoLead from '../pages/module_management/softo_leads/ViewSoftoLead';
import SoftoClients from '../pages/module_management/softo_clients/Softo_clients';
import AddSoftoClient from '../pages/module_management/softo_clients/AddSoftoClient';
import EditSoftoClient from '../pages/module_management/softo_clients/EditSoftoClient';
import ViewSoftoClient from '../pages/module_management/softo_clients/ViewSoftoClient';
import SoftoQuotations from '../pages/module_management/softo_quotations/SoftoQuotations';
import SoftoPackages from '../pages/module_management/softo_packages/SoftoPackages';
import SoftoSetting from '../pages/module_management/softo_setting/SoftoSetting';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // Admin Routes (Admin Layout)
  {
    path: '/',
    element: (
      <RoleBasedRoute allowedRoles={['admin']}>
        <Layout />
      </RoleBasedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'leads',
        element: <Leads />,
      },
      {
        path: 'leads/add',
        element: <AddLead />,
      },
      {
        path: 'leads/edit/:id',
        element: <EditLead />,
      },
      {
        path: 'leads/view/:id',
        element: <ViewLead />,
      },
      {
        path: 'clients',
        element: <Clients />,
      },
      {
        path: 'clients/add',
        element: <AddClient />,
      },
      {
        path: 'clients/edit/:id',
        element: <EditClient />,
      },
      {
        path: 'clients/view/:id',
        element: <ViewClient />,
      },
    ],
  },
  // Client Routes (Client Layout)
  {
    path: '/user-dashboard',
    element: (
      <RoleBasedRoute allowedRoles={['client']}>
        <ClientLayout />
      </RoleBasedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: 'module/softo-dashboard',
        element: <SoftoDashboard />,
      },
      {
        path: 'module/softo-leads',
        element: <SoftoLeads />,
      },
      {
        path: 'module/softo-leads/add',
        element: <AddSoftoLead />,
      },
      {
        path: 'module/softo-leads/edit/:id',
        element: <EditSoftoLead />,
      },
      {
        path: 'module/softo-leads/view/:id',
        element: <ViewSoftoLead />,
      },
      {
        path: 'module/softo-clients',
        element: <SoftoClients />,
      },
      {
        path: 'module/softo-clients/add',
        element: <AddSoftoClient />,
      },
      {
        path: 'module/softo-clients/edit/:id',
        element: <EditSoftoClient />,
      },
      {
        path: 'module/softo-clients/view/:id',
        element: <ViewSoftoClient />,
      },
      {
        path: 'module/softo-quotations',
        element: <SoftoQuotations />,
      },
      {
        path: 'module/softo-packages',
        element: <SoftoPackages />,
      },
      {
        path: 'module/softo-settings',
        element: <SoftoSetting />,
      },
    ],
  },
  // Shared module routes (accessible by both admin and client)
  {
    path: '/module',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'softo-dashboard',
        element: <SoftoDashboard />,
      },
      {
        path: 'softo-leads',
        element: <SoftoLeads />,
      },
      {
        path: 'softo-leads/add',
        element: <AddSoftoLead />,
      },
      {
        path: 'softo-leads/edit/:id',
        element: <EditSoftoLead />,
      },
      {
        path: 'softo-leads/view/:id',
        element: <ViewSoftoLead />,
      },
      {
        path: 'softo-clients',
        element: <SoftoClients />,
      },
      {
        path: 'softo-clients/add',
        element: <AddSoftoClient />,
      },
      {
        path: 'softo-clients/edit/:id',
        element: <EditSoftoClient />,
      },
      {
        path: 'softo-clients/view/:id',
        element: <ViewSoftoClient />,
      },
      {
        path: 'softo-quotations',
        element: <SoftoQuotations />,
      },
      {
        path: 'softo-packages',
        element: <SoftoPackages />,
      },
      {
        path: 'softo-settings',
        element: <SoftoSetting />,
      },
    ],
  },
]);

export default router;
