import React, { useState, useEffect } from 'react';

const DatewiseReport = ({ onPageChange }) => {
  // Restore state from sessionStorage on mount
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    return sessionStorage.getItem('datewiseFromDate') || '';
  });
  const [toDate, setToDate] = useState(() => {
    return sessionStorage.getItem('datewiseToDate') || '';
  });
  const [showReport, setShowReport] = useState(() => {
    return sessionStorage.getItem('datewiseShowReport') === 'true';
  });
  
  // Report Data
  const [reportData, setReportData] = useState(() => {
    const savedReportData = sessionStorage.getItem('datewiseReportData');
    if (savedReportData) {
      try {
        return JSON.parse(savedReportData);
      } catch (e) {
        console.error('Error parsing saved report data:', e);
      }
    }
    return {
      flats: {
        bookedFlats: 164,
        blockedFlats: 0,
        vacantFlats: 9
      },
      receivedAmount: {
        totalReceivedAmount: 652325813,
        totalChequeAmount: 217865455,
        totalNoOfChequeReceived: 876,
        totalCashAmount: 0,
        totalNeftAmount: 434460358
      }
    };
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (fromDate) {
      sessionStorage.setItem('datewiseFromDate', fromDate);
    }
  }, [fromDate]);

  useEffect(() => {
    if (toDate) {
      sessionStorage.setItem('datewiseToDate', toDate);
    }
  }, [toDate]);

  useEffect(() => {
    sessionStorage.setItem('datewiseShowReport', showReport.toString());
  }, [showReport]);

  useEffect(() => {
    if (showReport && reportData) {
      sessionStorage.setItem('datewiseReportData', JSON.stringify(reportData));
    }
  }, [showReport, reportData]);

  const handleContinue = () => {
    if (fromDate && toDate) {
      setLoading(true);
      // TODO: Replace with actual API call with date range
      setTimeout(() => {
        // Mock data - replace with actual API call
        const newReportData = {
          flats: {
            bookedFlats: 164,
            blockedFlats: 0,
            vacantFlats: 9
          },
          receivedAmount: {
            totalReceivedAmount: 652325813,
            totalChequeAmount: 217865455,
            totalNoOfChequeReceived: 876,
            totalCashAmount: 0,
            totalNeftAmount: 434460358
          }
        };
        setReportData(newReportData);
        setShowReport(true);
        setLoading(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setShowReport(false);
    setReportData({
      flats: {
        bookedFlats: 0,
        blockedFlats: 0,
        vacantFlats: 0
      },
      receivedAmount: {
        totalReceivedAmount: 0,
        totalChequeAmount: 0,
        totalNoOfChequeReceived: 0,
        totalCashAmount: 0,
        totalNeftAmount: 0
      }
    });
    // Clear sessionStorage
    sessionStorage.removeItem('datewiseFromDate');
    sessionStorage.removeItem('datewiseToDate');
    sessionStorage.removeItem('datewiseShowReport');
    sessionStorage.removeItem('datewiseReportData');
  };

  const formatCurrency = (amount) => {
    if (amount === 0 || !amount) return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header - Always visible */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          Datewise Report
        </h2>
      </div>

      {!showReport ? (
        // Date Selection Screen
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Select Date Range
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  To Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={fromDate}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleContinue}
                  disabled={!fromDate || !toDate || loading}
                  className={`flex-1 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    fromDate && toDate && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Report Display Screen
        <div className="flex flex-col h-full">
          {/* Date Range and Reset Button */}
          <div className="flex-shrink-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {fromDate} to {toDate}
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {/* Flats Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Flats</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('bookedFlats');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Booked Flats:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{reportData.flats.bookedFlats}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('blockedFlats');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Blocked Flats:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{reportData.flats.blockedFlats}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('flatStatus');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Vacant Flats:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{reportData.flats.vacantFlats}</span>
                  </div>
                </div>
              </div>

              {/* Received Amount Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Received Amount</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700 font-medium">Total Received Amount:</span>
                    <span className="text-base text-gray-900 font-semibold">{formatCurrency(reportData.receivedAmount.totalReceivedAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 pl-4">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          // Store date range and filter flag for Cheque page
                          sessionStorage.setItem('fromDatewiseReport', 'true');
                          sessionStorage.setItem('reportFromDate', fromDate);
                          sessionStorage.setItem('reportToDate', toDate);
                          onPageChange('cheque');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Total Cheque Amount:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{formatCurrency(reportData.receivedAmount.totalChequeAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 pl-4">
                    <span className="text-sm text-gray-700 font-medium">Total No. Of Cheque Received:</span>
                    <span className="text-base text-gray-900 font-semibold">{reportData.receivedAmount.totalNoOfChequeReceived}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('cash');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Total Cash Amount:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{formatCurrency(reportData.receivedAmount.totalCashAmount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        if (onPageChange) {
                          onPageChange('neft');
                        }
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800 underline cursor-pointer"
                    >
                      Total NEFT Amount:
                    </button>
                    <span className="text-base text-gray-900 font-semibold">{formatCurrency(reportData.receivedAmount.totalNeftAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatewiseReport;

