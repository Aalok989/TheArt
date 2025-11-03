import React, { useState, useEffect } from 'react';
import { HiX, HiChevronRight } from 'react-icons/hi';
import {
  fetchPaymentPlans,
  fetchLoanBanks,
  fetchConstructionStagesBlocks,
  fetchConstructionStagesInstallments
} from '../../api/mockData';

const ConstructionStages = ({ onPageChange }) => {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loanBanks, setLoanBanks] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [selectedLoanBank, setSelectedLoanBank] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [showPaymentPlanDropdown, setShowPaymentPlanDropdown] = useState(false);
  const [showLoanBankDropdown, setShowLoanBankDropdown] = useState(false);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    installment: '',
    status: '',
    completionDate: ''
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const statusOptions = ['Cleared', 'In Process'];

  const handleFilterClick = () => {
    if (showForm) {
      setShowForm(false);
      setShowSuccessMessage(false);
    } else {
      setShowForm(true);
    }
  };

  // Load dropdown options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [paymentPlansRes, loanBanksRes, blocksRes] = await Promise.all([
          fetchPaymentPlans(),
          fetchLoanBanks(),
          fetchConstructionStagesBlocks()
        ]);

        if (paymentPlansRes.success) {
          setPaymentPlans(paymentPlansRes.data);
        }
        if (loanBanksRes.success) {
          setLoanBanks(loanBanksRes.data);
        }
        if (blocksRes.success) {
          setBlocks(blocksRes.data);
        }
      } catch (error) {
        console.error('Error loading construction stages options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Load installments when payment plan is selected
  useEffect(() => {
    const loadInstallments = async () => {
      if (selectedPaymentPlan) {
        try {
          setLoading(true);
          const res = await fetchConstructionStagesInstallments(selectedPaymentPlan);
          if (res.success) {
            setInstallments(res.data);
          }
        } catch (error) {
          console.error('Error loading installments:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setInstallments([]);
      }
    };

    loadInstallments();
  }, [selectedPaymentPlan]);

  const handleEdit = (installment) => {
    setEditingInstallment(installment);
    setEditFormData({
      installment: installment.installmentNo.toString(),
      status: installment.status,
      completionDate: installment.completionDate
    });
    setEditFormOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!editFormData.installment || !editFormData.status || !editFormData.completionDate) {
      alert('Please fill in all fields');
      return;
    }

    // TODO: Update installment data
    console.log('Updating installment:', editFormData);
    
    // Update local state
    setInstallments(prev => 
      prev.map(inst => 
        inst.installmentNo === editingInstallment.installmentNo
          ? { ...inst, status: editFormData.status, completionDate: editFormData.completionDate }
          : inst
      )
    );

    // Close form and reset
    setEditFormOpen(false);
    setEditingInstallment(null);
    setEditFormData({ installment: '', status: '', completionDate: '' });
  };

  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setEditingInstallment(null);
    setEditFormData({ installment: '', status: '', completionDate: '' });
  };

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT SECTION — BUTTON */}
        <div className="w-full lg:w-[15%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Construction Stages</h2>

            {/* Filter Button */}
            <div className="mb-[0.75rem]">
              <button
                onClick={handleFilterClick}
                className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 w-full ${
                  showForm ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
              >
                <span>Installment Status</span>
                <HiChevronRight className={`transition-transform ${showForm ? 'rotate-90' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)', marginLeft: 'auto' }} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — FORM */}
        <div className="w-full lg:w-[85%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Installment Status</h2>
          </div>

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            {!showSuccessMessage && showForm && (
              <form className="w-full">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 w-full">
                  <div className="space-y-6">
                    {/* Form Section */}
                    <div className="space-y-5">
                  {/* Payment Plan Dropdown */}
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2.5 text-sm">
                      Select Payment Plan
                    </label>
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPaymentPlanDropdown(!showPaymentPlanDropdown);
                          setShowLoanBankDropdown(false);
                          setShowBlockDropdown(false);
                        }}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
                      >
                        <span className={selectedPaymentPlan ? 'text-gray-800' : 'text-gray-500'}>
                          {selectedPaymentPlan || '-- Select Payment Plan --'}
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPaymentPlanDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {showPaymentPlanDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                          {loading ? (
                            <div className="p-3 text-center text-gray-500 text-sm">Loading...</div>
                          ) : paymentPlans.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">No payment plans available</div>
                          ) : (
                            paymentPlans.map((plan) => (
                              <button
                                key={plan}
                                type="button"
                                onClick={() => {
                                  setSelectedPaymentPlan(plan);
                                  setShowPaymentPlanDropdown(false);
                                  // Reset subsequent selections
                                  setSelectedLoanBank('');
                                  setSelectedBlock('');
                                  setInstallments([]);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                              >
                                {plan}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Loan Bank Dropdown - Only show after Payment Plan is selected */}
                  {selectedPaymentPlan && (
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2.5 text-sm">
                        Select Loan Bank
                      </label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLoanBankDropdown(!showLoanBankDropdown);
                            setShowPaymentPlanDropdown(false);
                            setShowBlockDropdown(false);
                          }}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
                        >
                          <span className={selectedLoanBank ? 'text-gray-800' : 'text-gray-500'}>
                            {selectedLoanBank || '-- Select Loan Bank --'}
                          </span>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showLoanBankDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showLoanBankDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                            {loading ? (
                              <div className="p-3 text-center text-gray-500 text-sm">Loading...</div>
                            ) : loanBanks.length === 0 ? (
                              <div className="p-3 text-center text-gray-500 text-sm">No loan banks available</div>
                            ) : (
                              loanBanks.map((bank) => (
                                <button
                                  key={bank}
                                  type="button"
                                  onClick={() => {
                                    setSelectedLoanBank(bank);
                                    setShowLoanBankDropdown(false);
                                    // Reset subsequent selection
                                    setSelectedBlock('');
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                                >
                                  {bank}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Block Dropdown - Only show after Loan Bank is selected */}
                  {selectedLoanBank && (
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2.5 text-sm">
                        Select Block
                      </label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setShowBlockDropdown(!showBlockDropdown);
                            setShowPaymentPlanDropdown(false);
                            setShowLoanBankDropdown(false);
                          }}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
                        >
                          <span className={selectedBlock ? 'text-gray-800' : 'text-gray-500'}>
                            {selectedBlock || '-- Select Block --'}
                          </span>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showBlockDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showBlockDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                            {loading ? (
                              <div className="p-3 text-center text-gray-500 text-sm">Loading...</div>
                            ) : blocks.length === 0 ? (
                              <div className="p-3 text-center text-gray-500 text-sm">No blocks available</div>
                            ) : (
                              blocks.map((block) => (
                                <button
                                  key={block}
                                  type="button"
                                  onClick={() => {
                                    setSelectedBlock(block);
                                    setShowBlockDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                                >
                                  {block}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description Table - Only show after all selections are made */}
                {installments.length > 0 && selectedPaymentPlan && selectedLoanBank && selectedBlock && (
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Payment Mode</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Installment No.</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Completion Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {installments.map((installment) => (
                            <tr key={installment.installmentNo} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{selectedPaymentPlan || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{installment.installmentNo}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{installment.description}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{installment.amount}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  installment.status === 'Cleared' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {installment.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{installment.completionDate}</td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEdit(installment);
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {installments.length === 0 && selectedPaymentPlan && selectedLoanBank && selectedBlock && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 text-sm">No installments found for the selected payment plan.</p>
                  </div>
                )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form Popup */}
      {editFormOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseEditForm();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Installment</h3>
              <button
                type="button"
                onClick={handleCloseEditForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Installment Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  Installment:
                </label>
                <input
                  type="text"
                  value={editFormData.installment}
                  onChange={(e) => handleEditFormChange('installment', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  Status:
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
                  >
                    <span className={editFormData.status ? 'text-gray-800' : 'text-gray-500'}>
                      {editFormData.status || '-- Select Status --'}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            handleEditFormChange('status', status);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">
                  Completion Date:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.completionDate}
                    onChange={(e) => handleEditFormChange('completionDate', e.target.value)}
                    placeholder="dd-mm-yyyy"
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors text-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ConstructionStages;

