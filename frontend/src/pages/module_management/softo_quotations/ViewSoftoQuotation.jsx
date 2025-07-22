import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  CubeIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  PhoneIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate, useParams } from 'react-router-dom';
import softoQuotationsService from '../../../services/softoQuotationsService';
import softoPackagesService from '../../../services/softoPackagesService';
import softoClientsService from '../../../services/softoClientsService';

const ViewSoftoQuotation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [packages, setPackages] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchQuotationData();
    fetchDropdownData();
  }, [id]);

  const fetchQuotationData = async () => {
    try {
      setLoading(true);
      const data = await softoQuotationsService.getQuotationById(id);
      setQuotation(data);
    } catch (error) {
      console.error('Error fetching quotation:', error);
      alert('Failed to fetch quotation details');
      navigate('/user-dashboard/softo-quotations');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [packagesData, clientsData] = await Promise.all([
        softoPackagesService.getAllPackages(),
        softoClientsService.getAllSoftoClients()
      ]);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      setPackages([]);
      setClients([]);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || client?.fullName || 'Unknown Client';
  };

  const getPackageName = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg?.name || 'Unknown Package';
  };

  const handleDownloadPDF = async (isPrint = false) => {
    try {
      setDownloading(true);
      const response = await softoQuotationsService.generatePDF(id, isPrint);
      
      // Create download link
      const clientName = getClientName(quotation.softoClientId).replace(/\s+/g, '_');
      const packageName = getPackageName(quotation.packageId).replace(/\s+/g, '_');
      const projectCode = (quotation.projectCode || '').replace(/\s+/g, '_');
      const filename = `${clientName}_${packageName}_${projectCode}.pdf`;
      
      // Handle PDF download (assuming response contains PDF data)
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
          <span className="text-gray-700">Loading quotation details...</span>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quotation Not Found</h3>
          <p className="text-gray-600 mb-4">The quotation you're looking for doesn't exist.</p>
          <Link
            to="/user-dashboard/softo-quotations"
            className="bg-[#800000]/90 hover:bg-[#800000] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Quotations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/user-dashboard/softo-quotations"
              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{quotation.name}</h2>
              <p className="text-sm text-gray-600">Quotation Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to={`/user-dashboard/softo-quotations/edit/${id}`}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center text-sm"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={() => handleDownloadPDF(false)}
              disabled={downloading}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center text-sm disabled:opacity-50"
            >
              {downloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              ) : (
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              )}
              Download PDF
            </button>
            <button
              onClick={() => handleDownloadPDF(true)}
              disabled={downloading}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center text-sm disabled:opacity-50"
            >
              <PrinterIcon className="w-4 h-4 mr-1" />
              Print PDF
            </button>
          </div>
        </div>
      </div>

      {/* Quotation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Quotation Name</label>
              <p className="text-sm text-gray-900 mt-1">{quotation.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Project Name</label>
              <p className="text-sm text-gray-900 mt-1">{quotation.projectName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Project Code</label>
              <p className="text-sm text-gray-900 mt-1">{quotation.projectCode || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Area</label>
              <p className="text-sm text-gray-900 mt-1">
                {quotation.area ? `${quotation.area} Sq. Ft.` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Client & Package Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Client & Package
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Client</label>
              <p className="text-sm text-gray-900 mt-1">{getClientName(quotation.softoClientId)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Package</label>
              <p className="text-sm text-gray-900 mt-1">{getPackageName(quotation.packageId)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Created By</label>
              <p className="text-sm text-gray-900 mt-1">
                {quotation.createdByUser?.name || quotation.createdByUser?.fullName || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Created Date</label>
              <p className="text-sm text-gray-900 mt-1">{formatDate(quotation.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyRupeeIcon className="w-5 h-5 mr-2" />
            Pricing Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Total Amount</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(quotation.amount)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Discount</label>
              <p className="text-sm text-green-600 mt-1">
                {quotation.discount > 0 ? `-${formatCurrency(quotation.discount)}` : 'No discount'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Final Amount</label>
              <p className="text-xl font-bold text-[#800000] mt-1">{formatCurrency(quotation.discountedPrice)}</p>
            </div>
          </div>
        </div>

        {/* Sales Person Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2" />
            Sales Person Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Sales Person Name</label>
              <p className="text-sm text-gray-900 mt-1">{quotation.salesPersonName || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Sales Person Mobile</label>
              <p className="text-sm text-gray-900 mt-1">{quotation.salesPersonMobile || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Validity Period
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Valid From Date</label>
              <p className="text-sm text-gray-900 mt-1">{formatDate(quotation.validFromDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Valid To Date</label>
              <p className="text-sm text-gray-900 mt-1">{formatDate(quotation.validToDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay for PDF download */}
      {downloading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800000]"></div>
            <span className="text-gray-700">Generating PDF...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSoftoQuotation; 