import React, { useState, useEffect } from 'react';

const TodayReport = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);

  // Financial Summary Data
  const [financialData, setFinancialData] = useState({
    totalCashAmount: 0,
    totalNeftAmount: 0,
    totalChequeAmount: 0,
    chequesReceived: 0,
    totalReceivedAmount: 0,
    totalCurrentDateCheque: 0,
    totalPDC: 0
  });

  useEffect(() => {
    const fetchTodayReport = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // Simulate API delay
        setTimeout(() => {
          // Mock data - replace with actual API call
          setFinancialData({
            totalCashAmount: 500000,
            totalNeftAmount: 1200000,
            totalChequeAmount: 850000,
            chequesReceived: 15,
            totalReceivedAmount: 2550000,
            totalCurrentDateCheque: 300000,
            totalPDC: 200000
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching today report:', error);
        setLoading(false);
      }
    };

    fetchTodayReport();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          Today Report
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* Financial Summary Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Total Cash Amount:</span>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalCashAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Total NEFT Amount:</span>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalNeftAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="text-gray-700 font-medium">Total Cheque Amount:</span>
                <span className="text-sm text-gray-500 mt-1">(Cheques received: {financialData.chequesReceived})</span>
              </div>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalChequeAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Total Received Amount:</span>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalReceivedAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Total Current Date Cheque:</span>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalCurrentDateCheque)}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 pt-4 border-t-2 border-gray-300">
              <span className="text-gray-700 font-medium">Total PDC:</span>
              <span className="text-gray-900 font-semibold text-lg">{formatCurrency(financialData.totalPDC)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayReport;

