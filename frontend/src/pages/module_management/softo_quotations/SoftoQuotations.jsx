import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import softoQuotationsService from "../../../services/softoQuotationsService";
import softoPackagesService from "../../../services/softoPackagesService";
import softoClientsService from "../../../services/softoClientsService";

const SoftoQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [clients, setClients] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  // Fetch quotations on component mount
  useEffect(() => {
    fetchQuotations();
    fetchDropdownData();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await softoQuotationsService.getAllQuotations();

      const quotationsArray = Array.isArray(data) ? data : [];

      setQuotations(quotationsArray);
      setFilteredQuotations(quotationsArray);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]);
      setFilteredQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [packagesData, clientsData] = await Promise.all([
        softoPackagesService.getAllPackages(),
        softoClientsService.getAllSoftoClients(),
      ]);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setPackages([]);
      setClients([]);
    }
  };

  // Filter quotations based on search
  useEffect(() => {
    const filtered = quotations.filter(
      (q) =>
        q.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        q.projectName?.toLowerCase().includes(searchText.toLowerCase()) ||
        q.projectCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        getClientName(q.softoClientId)
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        getPackageName(q.packageId)
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
    );
    setFilteredQuotations(filtered);
  }, [searchText, quotations, clients, packages]);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || client?.fullName || "Unknown Client";
  };

  const getPackageName = (packageId) => {
    const pkg = packages.find((p) => p.id === packageId);
    return pkg?.name || "Unknown Package";
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        await softoQuotationsService.deleteQuotation(quotationId);
        setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
      } catch (error) {
        console.error("Error deleting quotation:", error);
        alert("Failed to delete quotation. Please try again.");
      }
    }
  };

  const handleDownloadPDF = async (quotation, isPrint = false) => {
    try {
      setDownloadingId(quotation.id);

      const response = await softoQuotationsService.generatePDF(
        quotation.id,
        isPrint
      ); // this is already a Blob

      const clientName = getClientName(quotation.softoClientId).replace(
        /\s+/g,
        "_"
      );
      const packageName = getPackageName(quotation.packageId).replace(
        /\s+/g,
        "_"
      );
      const projectCode = (quotation.projectCode || "").replace(/\s+/g, "_");
      const filename = `${clientName}_${packageName}_${projectCode}.pdf`;

      const blob = response;
      const url = window.URL.createObjectURL(blob);

      if (isPrint) {
        // 👁️ Preview in new tab
        window.open(url, "_blank");
      } else {
        // ⬇️ Download the PDF
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      window.URL.revokeObjectURL(url);
      alert(`PDF ${isPrint ? "opened" : "downloaded"} successfully`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              SOFTO Quotations
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Create and manage project quotations and pricing proposals.
            </p>
            {/* Search in header */}
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] transition-colors duration-200 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("/user-dashboard/softo-quotations/add")}
              className="bg-[#800000]/90 hover:bg-[#800000] text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Create Quotation
            </button>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800000]"></div>
                      <span className="ml-2">Loading quotations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      {searchText
                        ? "No quotations found matching your search."
                        : "No quotations found. Create your first quotation to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quotation.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{quotation.id?.slice(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getClientName(quotation.softoClientId)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPackageName(quotation.packageId)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quotation.projectName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quotation.projectCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(quotation.amount)}
                      </div>
                      {quotation.discount > 0 && (
                        <div className="text-xs text-green-600">
                          -{formatCurrency(quotation.discount)} discount
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(quotation.validToDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(quotation.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/user-dashboard/softo-quotations/view/${quotation.id}`}
                          className="text-[#800000] hover:text-[#800000]/80 p-1 rounded"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/user-dashboard/softo-quotations/edit/${quotation.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(quotation, false)}
                          disabled={downloadingId === quotation.id}
                          className="text-green-600 hover:text-green-800 p-1 rounded disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingId === quotation.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(quotation, true)}
                          disabled={downloadingId === quotation.id}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded disabled:opacity-50"
                          title="Print PDF"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuotation(quotation.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading overlay for PDF download */}
      {downloadingId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#800000]"></div>
            <span className="text-gray-700">Generating PDF...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftoQuotations;
