import { DocumentTextIcon } from '@heroicons/react/24/outline';

const SoftoQuotations = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">SOFTO Quotations</h2>
        <p className="text-gray-600">
          Create and manage SOFTO project quotations and pricing proposals.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Quotation Management</h3>
            <button className="bg-[#800000]/90 hover:bg-[#800000] text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm">
              Create New Quotation
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No quotations found. Create your first SOFTO quotation to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftoQuotations;
