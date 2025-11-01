import React, { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';

const ManageBank = ({ onPageChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    bankCode: ''
  });

  const handleFilterClick = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
      setShowAddForm(false);
      setShowSuccessMessage(false);
    } else {
      setSelectedFilter(filter);
      setShowAddForm(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    // TODO: Add bank to the list
    console.log('Adding bank:', formData);
    // Reset form
    setFormData({
      bankName: '',
      bankCode: ''
    });
    // Show success message
    setShowAddForm(false);
    setShowSuccessMessage(true);
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSelectedFilter(null);
    }, 3000);
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT SECTION — FILTERS */}
        <div className="w-full lg:w-[20%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Manage Bank</h2>

             {/* Filter Button */}
             <div className="mb-[0.75rem]">
               <button
                 onClick={() => handleFilterClick('favouringBank')}
                 className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 w-full ${
                   selectedFilter === 'favouringBank' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                 }`}
                 style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
               >
                 <span>Favouring Bank</span>
                 <HiChevronRight className={`transition-transform ${selectedFilter === 'favouringBank' ? 'rotate-90' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)', marginLeft: 'auto' }} />
               </button>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION — FORM */}
        <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Add Bank</h2>
          </div>

           <div className="flex-1 overflow-auto min-h-0 flex items-center justify-center" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
             {showSuccessMessage && (
               <div className="text-center">
                 <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-8 max-w-md">
                   <div className="mb-4">
                     <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <h3 className="text-xl font-bold text-green-800 mb-2">Bank Added Successfully</h3>
                   <p className="text-green-600">The bank has been added to your list.</p>
                 </div>
               </div>
             )}
             
             {!showSuccessMessage && showAddForm && (
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-lg">
                 <div className="mb-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-1">Add New Bank</h3>
                   <p className="text-sm text-gray-500">Enter the bank details below</p>
                 </div>
                 <form onSubmit={handleAddBank} className="space-y-6">
                   {/* Bank Name */}
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Bank Name <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       value={formData.bankName}
                       onChange={(e) => handleInputChange('bankName', e.target.value)}
                       placeholder="Enter bank name"
                       className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                       required
                     />
                   </div>

                   {/* Bank Code */}
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Bank Code <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       value={formData.bankCode}
                       onChange={(e) => handleInputChange('bankCode', e.target.value)}
                       placeholder="Enter bank code"
                       className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                       required
                     />
                   </div>

                   {/* Add Bank Button */}
                   <div className="flex justify-end gap-3 pt-4">
                     <button
                       type="button"
                       onClick={() => {
                         setShowAddForm(false);
                         setSelectedFilter(null);
                         setFormData({ bankName: '', bankCode: '' });
                       }}
                       className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
                     >
                       Add Bank
                     </button>
                   </div>
                 </form>
               </div>
             )}
             
             {!showAddForm && !showSuccessMessage && (
               <div className="text-center">
                 <div className="mb-4">
                   <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                 </div>
                 <p className="text-gray-500 text-lg">Please select "Favouring Bank" to add a new bank</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </>
  );
};

export default ManageBank;

