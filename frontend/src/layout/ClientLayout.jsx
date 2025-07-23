import { Outlet } from 'react-router-dom';
import ClientSidebar from '../components/ClientSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Sidebar */}
      <ClientSidebar />

      {/* Main Content Area */}
      <div className="xl:ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 md:pt-20 lg:pt-20 xl:pt-20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout; 