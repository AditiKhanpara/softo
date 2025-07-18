import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/layout';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import Leads from '../pages/leads/leads';
import Clients from '../pages/clients/clients';
import SoftoDashboard from '../pages/module_management/softo_dashboard/SoftoDashboard';
import SoftoLeads from '../pages/module_management/softo_leads/SoftoLeads';
import SoftoClients from '../pages/module_management/softo_clients/softo_clients';
import SoftoQuotations from '../pages/module_management/softo_quotations/SoftoQuotations';
import SoftoPackages from '../pages/module_management/softo_packages/SoftoPackages';
import SoftoSetting from '../pages/module_management/softo_setting/SoftoSetting';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
        path: 'clients',
        element: <Clients />,
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
        path: 'module/softo-clients',
        element: <SoftoClients />,
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
]);

export default router;
