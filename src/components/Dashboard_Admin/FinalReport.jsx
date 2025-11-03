import React, { useState, useEffect } from 'react';
import { HiHome, HiCheckCircle, HiXCircle, HiExclamationCircle } from 'react-icons/hi';

const FinalReport = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  
  // Flat Status Data
  const [statusCards, setStatusCards] = useState([
    {
      id: 'booked',
      title: 'Booked Flat',
      value: 227,
      color: 'bg-emerald-500',
      icon: 'check'
    },
    {
      id: 'blocked',
      title: 'Blocked Flat',
      value: 2,
      color: 'bg-blue-500',
      icon: 'block'
    },
    {
      id: 'vacant',
      title: 'Vacant Flat',
      value: 10,
      color: 'bg-yellow-400',
      icon: 'exclamation'
    },
    {
      id: 'cancelled',
      title: 'Cancelled Flat',
      value: 9,
      color: 'bg-red-500',
      icon: 'cancel'
    }
  ]);

  // Financial Summary Data
  const [financialData, setFinancialData] = useState({
    totalCashAmount: 0,
    totalNeftAmount: 944258369,
    totalChequeAmount: 515316648,
    chequesReceived: 2371,
    totalReceivedAmount: 1459575017
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching final report:', error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'booked':
        if (onPageChange) onPageChange('bookedFlats');
        break;
      case 'blocked':
        if (onPageChange) onPageChange('blockedFlats');
        break;
      case 'cancelled':
        if (onPageChange) onPageChange('cancelledFlats');
        break;
      default:
        break;
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return <HiCheckCircle size={24} className="text-white" />;
      case 'cancel':
        return <HiXCircle size={24} className="text-white" />;
      case 'block':
        return <HiExclamationCircle size={24} className="text-white" />;
      case 'exclamation':
        return <HiExclamationCircle size={24} className="text-white" />;
      default:
        return <HiHome size={24} className="text-white" />;
    }
  };

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
          Final Report
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="bg-white overflow-hidden">
          {/* Top horizontal line */}
          <div className="border-b border-gray-200"></div>
          
          {/* Status Cards Container - Same as Dashboard */}
          <div className="flex">
            {statusCards.map((card, index) => (
              <React.Fragment key={card.id}>
                <button
                  onClick={() => handleCardClick(card.id)}
                  className="flex-1 p-4 hover:bg-gray-50 transition-colors duration-200 flex items-center group relative"
                  style={{ minHeight: 'clamp(4rem, 5rem, 6rem)' }}
                >
                  {/* Icon - Left Side */}
                  <div className="flex items-center justify-center mr-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:opacity-80 transition-all duration-200 ${card.color}`}>
                      {getIcon(card.icon)}
                    </div>
                  </div>
                  
                  {/* Content - Right Side */}
                  <div className="flex-1 text-left">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{card.title}</div>
                  </div>
                </button>
                
                {/* Vertical divider */}
                {index < statusCards.length - 1 && (
                  <div className="border-r border-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Bottom horizontal line */}
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Financial Summary Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            
            <div className="flex items-center justify-between py-3 pt-4 border-t-2 border-gray-300">
              <span className="text-gray-900 font-bold text-xl">Total Received Amount:</span>
              <span className="text-blue-600 font-bold text-2xl">{formatCurrency(financialData.totalReceivedAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalReport;

