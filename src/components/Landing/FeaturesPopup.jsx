import React from 'react';
import { HiXMark, HiChevronRight } from 'react-icons/hi2';

const FeaturesPopup = ({ isOpen, onClose }) => {
  const modules = [
    'Lead Management',
    'Quality Control', 
    'Project Scheduling',
    'CRM (Core Module)',
    'Material Management',
    'Accounts Integration',
    'Inventory Management',
    'Supplier Management',
    'Analytics',
    'Purchase Management',
    'Contractor Management'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-7xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <HiXMark className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 uppercase pr-8">Features</h2>

        {/* Description */}
        <p className="text-gray-800 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
          <strong>"PROPRITE-THE BUILDER"</strong> is a complete ERP Solution for Real Estate Developers that covers all the modules from managing new leads, tracking sales, managing flat inventories, payment collection from customers, execution, inventory management, purchase order creation, overall purchase management, supplier/contractor management etc.
        </p>

        {/* Subtitle */}
        <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">The software comprises of following main modules:</h3>
        
        {/* Separator Line */}
        <div className="border-t-2 border-gray-900 mb-4 sm:mb-6"></div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {modules.map((module, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-2 py-2 sm:py-3">
                <HiChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black-800 flex-shrink-0" />
                <span className="text-black-800 text-sm sm:text-base">{module}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPopup;
