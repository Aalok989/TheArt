import React, { useState, useEffect } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { fetchChannelPartners } from '../../api/mockData';

const ManageCommission = ({ onPageChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [channelPartners, setChannelPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showChannelPartnerDropdown, setShowChannelPartnerDropdown] = useState(false);
  const [showProceeded, setShowProceeded] = useState(false);
  const [commissionType, setCommissionType] = useState('percentage'); // 'percentage' or 'fixed'
  const [percentageValue, setPercentageValue] = useState('');
  const [fixedValues, setFixedValues] = useState({});
  const [loading, setLoading] = useState(false);

  // Load channel partners
  useEffect(() => {
    const loadChannelPartners = async () => {
      try {
        setLoading(true);
        const res = await fetchChannelPartners();
        if (res.success) {
          setChannelPartners(res.data || []);
        }
      } catch (error) {
        console.error('Error loading channel partners:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChannelPartners();
  }, []);

  // Initialize fixed values when partner is selected
  useEffect(() => {
    if (selectedPartner && selectedPartner.flatTypes) {
      const initialFixedValues = {};
      selectedPartner.flatTypes.forEach(flatType => {
        initialFixedValues[flatType] = '';
      });
      setFixedValues(initialFixedValues);
    }
  }, [selectedPartner]);

  const handleFilterClick = () => {
    if (showAddForm) {
      setShowAddForm(false);
      setShowSuccessMessage(false);
      setSelectedPartnerId('');
      setSelectedPartner(null);
      setShowProceeded(false);
      setCommissionType('percentage');
      setPercentageValue('');
      setFixedValues({});
    } else {
      setShowAddForm(true);
    }
  };

  const handlePartnerSelect = (partnerId) => {
    const partner = channelPartners.find(p => p.id === partnerId);
    setSelectedPartnerId(partnerId);
    setSelectedPartner(partner);
    setShowChannelPartnerDropdown(false);
    setShowProceeded(false); // Reset proceed state when partner changes
  };

  const handleProceed = () => {
    if (selectedPartner) {
      setShowProceeded(true);
    }
  };

  const handleCommissionTypeChange = (type) => {
    setCommissionType(type);
  };

  const handlePercentageChange = (value) => {
    setPercentageValue(value);
  };

  const handleFixedValueChange = (flatType, value) => {
    setFixedValues(prev => ({
      ...prev,
      [flatType]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPartner) {
      alert('Please select a channel partner');
      return;
    }

    if (!showProceeded) {
      alert('Please proceed after selecting channel partner');
      return;
    }

    if (commissionType === 'percentage' && !percentageValue) {
      alert('Please enter percentage value');
      return;
    }

    if (commissionType === 'fixed') {
      const hasEmptyValues = Object.values(fixedValues).some(val => !val);
      if (hasEmptyValues) {
      alert('Please fill all fixed commission values');
        return;
      }
    }

    const commissionData = {
      partnerId: selectedPartner.id,
      partnerName: selectedPartner.name,
      companyName: selectedPartner.companyName,
      userId: selectedPartner.userId,
      commissionType,
      ...(commissionType === 'percentage' 
        ? { percentage: percentageValue }
        : { fixedValues }
      )
    };

    // TODO: Submit commission data
    console.log('Commission data:', commissionData);

    // Reset form
    setShowAddForm(false);
    setShowSuccessMessage(true);
    setSelectedPartnerId('');
    setSelectedPartner(null);
    setShowProceeded(false);
    setCommissionType('percentage');
    setPercentageValue('');
    setFixedValues({});

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Organize flat types into 3 columns
  const getFlatTypesByColumns = () => {
    if (!selectedPartner || !selectedPartner.flatTypes) return [[], [], []];
    
    const flatTypes = selectedPartner.flatTypes;
    const columns = [[], [], []];
    
    flatTypes.forEach((flatType, index) => {
      columns[index % 3].push(flatType);
    });
    
    return columns;
  };

  const flatTypesColumns = getFlatTypesByColumns();

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
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Manage Commission</h2>

            {/* Filter Button */}
            <div className="mb-[0.75rem]">
              <button
                onClick={handleFilterClick}
                className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 w-full ${
                  showAddForm ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
              >
                <span>Add Commission</span>
                <HiChevronRight className={`transition-transform ${showAddForm ? 'rotate-90' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)', marginLeft: 'auto' }} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — FORM */}
        <div className="w-full lg:w-[85%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Add Commission</h2>
          </div>

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            {showSuccessMessage && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6 max-w-md">
                    <div className="mb-3">
                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-green-800 mb-1.5">Commission Added Successfully</h3>
                    <p className="text-green-600 text-sm">The commission has been added successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {!showSuccessMessage && showAddForm && (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 w-full">
                  <div className="space-y-6">
                    {/* Channel Partner Dropdown */}
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2.5 text-sm">
                        Select Channel Partner
                      </label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() => setShowChannelPartnerDropdown(!showChannelPartnerDropdown)}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between text-sm"
                        >
                          <span className={selectedPartnerId ? 'text-gray-800' : 'text-gray-500'}>
                            {selectedPartnerId && selectedPartner 
                              ? `${selectedPartner.name} - ${selectedPartner.companyName}`
                              : '-- Select Channel Partner --'}
                          </span>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showChannelPartnerDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showChannelPartnerDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                            {loading ? (
                              <div className="p-3 text-center text-gray-500 text-sm">Loading...</div>
                            ) : channelPartners.length === 0 ? (
                              <div className="p-3 text-center text-gray-500 text-sm">No channel partners available</div>
                            ) : (
                              channelPartners.map((partner) => (
                                <button
                                  key={partner.id}
                                  type="button"
                                  onClick={() => handlePartnerSelect(partner.id)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                                >
                                  <div className="font-medium text-gray-800">{partner.name}</div>
                                  <div className="text-gray-600 text-xs mt-0.5">{partner.companyName}</div>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* Display Selected Partner Info */}
                      {selectedPartner && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-600 text-xs mb-1 font-medium">Channel Partner Name</label>
                              <p className="text-gray-800 font-semibold text-sm">{selectedPartner.name}</p>
                            </div>
                            <div>
                              <label className="block text-gray-600 text-xs mb-1 font-medium">Company Name</label>
                              <p className="text-gray-800 font-semibold text-sm">{selectedPartner.companyName}</p>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleProceed}
                            disabled={showProceeded}
                            className={`mt-3 px-4 py-1.5 rounded-md font-medium transition-colors text-sm ${
                              showProceeded 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                          >
                            {showProceeded ? 'Proceeded' : 'Proceed'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User ID Display (after proceed) */}
                    {showProceeded && selectedPartner && (
                      <div>
                        <label className="block text-gray-600 text-xs mb-1.5 font-medium">User ID</label>
                        <p className="text-gray-800 font-semibold text-base">{selectedPartner.userId}</p>
                      </div>
                    )}

                    {/* Commission Type Selection (after proceed) */}
                    {showProceeded && (
                      <div>
                        <label className="block text-gray-800 font-semibold mb-3 text-sm">
                          Commission Type
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="commissionType"
                              value="percentage"
                              checked={commissionType === 'percentage'}
                              onChange={(e) => handleCommissionTypeChange(e.target.value)}
                              className="w-4 h-4 text-gray-800 focus:ring-gray-500 focus:ring-2"
                            />
                            <span className="ml-2 text-gray-700 text-sm">Percentage</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="commissionType"
                              value="fixed"
                              checked={commissionType === 'fixed'}
                              onChange={(e) => handleCommissionTypeChange(e.target.value)}
                              className="w-4 h-4 text-gray-800 focus:ring-gray-500 focus:ring-2"
                            />
                            <span className="ml-2 text-gray-700 text-sm">Fixed</span>
                          </label>
                        </div>

                        {/* Percentage Input */}
                        {commissionType === 'percentage' && (
                          <div className="mt-4">
                            <label className="block text-gray-800 font-semibold mb-2.5 text-sm">
                              Percentage Value
                            </label>
                            <input
                              type="number"
                              value={percentageValue}
                              onChange={(e) => handlePercentageChange(e.target.value)}
                              placeholder="Enter percentage"
                              className="w-full max-w-xs bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        )}

                        {/* Fixed Input Fields in 3-Column Grid */}
                        {commissionType === 'fixed' && (
                          <div className="mt-4">
                            <label className="block text-gray-800 font-semibold mb-3 text-sm">
                              Fixed Commission Values
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                              {flatTypesColumns.map((column, colIndex) => (
                                <div key={colIndex} className="space-y-2">
                                  {column.map((flatType) => (
                                    <div key={flatType}>
                                      <label className="block text-gray-700 text-xs mb-1 font-medium">{flatType}</label>
                                      <input
                                        type="number"
                                        value={fixedValues[flatType] || ''}
                                        onChange={(e) => handleFixedValueChange(flatType, e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                                        min="0"
                                        step="0.01"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    {showProceeded && (
                      <div className="flex justify-end pt-2 border-t border-gray-200">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors text-sm"
                        >
                          Submit Commission
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}

            {!showAddForm && !showSuccessMessage && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Click "Add Commission" to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCommission;

