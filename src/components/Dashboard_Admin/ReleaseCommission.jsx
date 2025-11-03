import React, { useState } from 'react';
import { fetchChannelPartners } from '../../api/mockData';

const ReleaseCommission = ({ onPageChange }) => {
  const [paymentType, setPaymentType] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dealers, setDealers] = useState([]);

  // Cheque form data
  const [chequeData, setChequeData] = useState({
    dealerName: '',
    chequeAmount: '',
    chequeNo: '',
    chequeDate: '',
    bank: '',
    receivedDate: '',
    remarks: ''
  });

  // Cash form data
  const [cashData, setCashData] = useState({
    dealerName: '',
    amount: '',
    receivedBy: '',
    receivedDate: '',
    remarks: ''
  });

  // NEFT form data
  const [neftData, setNeftData] = useState({
    dealerName: '',
    neftBank: '',
    neftNumber: '',
    receivedDate: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch dealers on component mount
  React.useEffect(() => {
    const loadDealers = async () => {
      try {
        const response = await fetchChannelPartners();
        if (response.success) {
          // Transform dealers data
          const dealerList = response.data.map(partner => ({
            id: partner.id,
            name: partner.name,
            dealerId: partner.companyName ? partner.companyName.split(' ')[0].toUpperCase() : partner.id
          }));
          setDealers(dealerList);
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
      }
    };
    loadDealers();
  }, []);

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    setErrors({});
    // Reset form data when switching payment types
    setChequeData({
      dealerName: '',
      chequeAmount: '',
      chequeNo: '',
      chequeDate: '',
      bank: '',
      receivedDate: '',
      remarks: ''
    });
    setCashData({
      dealerName: '',
      amount: '',
      receivedBy: '',
      receivedDate: '',
      remarks: ''
    });
    setNeftData({
      dealerName: '',
      neftBank: '',
      neftNumber: '',
      receivedDate: '',
      remarks: ''
    });
  };

  const handleChequeInputChange = (field, value) => {
    setChequeData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCashInputChange = (field, value) => {
    setCashData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNeftInputChange = (field, value) => {
    setNeftData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateChequeForm = () => {
    const newErrors = {};
    if (!chequeData.dealerName.trim()) newErrors.dealerName = 'Dealer Name is required';
    if (!chequeData.chequeAmount.trim()) newErrors.chequeAmount = 'Cheque Amount is required';
    if (!chequeData.chequeNo.trim()) newErrors.chequeNo = 'Cheque No is required';
    if (!chequeData.chequeDate.trim()) newErrors.chequeDate = 'Cheque Date is required';
    if (!chequeData.bank.trim()) newErrors.bank = 'Bank is required';
    if (!chequeData.receivedDate.trim()) newErrors.receivedDate = 'Received Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCashForm = () => {
    const newErrors = {};
    if (!cashData.dealerName.trim()) newErrors.dealerName = 'Dealer Name is required';
    if (!cashData.amount.trim()) newErrors.amount = 'Amount is required';
    if (!cashData.receivedBy.trim()) newErrors.receivedBy = 'Received By is required';
    if (!cashData.receivedDate.trim()) newErrors.receivedDate = 'Received Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNeftForm = () => {
    const newErrors = {};
    if (!neftData.dealerName.trim()) newErrors.dealerName = 'Dealer Name is required';
    if (!neftData.neftBank.trim()) newErrors.neftBank = 'NEFT Bank is required';
    if (!neftData.neftNumber.trim()) newErrors.neftNumber = 'NEFT Number is required';
    if (!neftData.receivedDate.trim()) newErrors.receivedDate = 'Received Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChequeSubmit = (e) => {
    e.preventDefault();
    if (validateChequeForm()) {
      // TODO: Implement API call
      console.log('Submit Cheque:', chequeData);
      alert('Commission released successfully via Cheque!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        handlePaymentTypeChange('');
      }, 3000);
    }
  };

  const handleCashSubmit = (e) => {
    e.preventDefault();
    if (validateCashForm()) {
      // TODO: Implement API call
      console.log('Submit Cash:', cashData);
      alert('Commission released successfully via Cash!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        handlePaymentTypeChange('');
      }, 3000);
    }
  };

  const handleNeftSubmit = (e) => {
    e.preventDefault();
    if (validateNeftForm()) {
      // TODO: Implement API call
      console.log('Submit NEFT:', neftData);
      alert('Commission released successfully via NEFT!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        handlePaymentTypeChange('');
      }, 3000);
    }
  };

  const banks = ['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Kotak', 'PNB'];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          Release Commission
        </h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {showSuccessMessage ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-8 max-w-md">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Commission Released Successfully</h3>
                <p className="text-green-600">The commission has been released successfully.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Payment Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Select Payment Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('cheque')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    paymentType === 'cheque'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cheque
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('cash')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    paymentType === 'cash'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('neft')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    paymentType === 'neft'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  NEFT
                </button>
              </div>
            </div>

            {/* Cheque Form */}
            {paymentType === 'cheque' && (
              <form onSubmit={handleChequeSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Cheque Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Dealer Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={chequeData.dealerName}
                      onChange={(e) => handleChequeInputChange('dealerName', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dealerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Dealer</option>
                      {dealers.map(dealer => (
                        <option key={dealer.id} value={dealer.name}>{dealer.name} ({dealer.dealerId})</option>
                      ))}
                    </select>
                    {errors.dealerName && <p className="text-red-500 text-xs mt-1">{errors.dealerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cheque Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={chequeData.chequeAmount}
                      onChange={(e) => handleChequeInputChange('chequeAmount', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.chequeAmount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.chequeAmount && <p className="text-red-500 text-xs mt-1">{errors.chequeAmount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cheque No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={chequeData.chequeNo}
                      onChange={(e) => handleChequeInputChange('chequeNo', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.chequeNo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.chequeNo && <p className="text-red-500 text-xs mt-1">{errors.chequeNo}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Cheque Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={chequeData.chequeDate}
                      onChange={(e) => handleChequeInputChange('chequeDate', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.chequeDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.chequeDate && <p className="text-red-500 text-xs mt-1">{errors.chequeDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={chequeData.bank}
                      onChange={(e) => handleChequeInputChange('bank', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.bank ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    {errors.bank && <p className="text-red-500 text-xs mt-1">{errors.bank}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Received Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={chequeData.receivedDate}
                      onChange={(e) => handleChequeInputChange('receivedDate', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.receivedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.receivedDate && <p className="text-red-500 text-xs mt-1">{errors.receivedDate}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={chequeData.remarks}
                      onChange={(e) => handleChequeInputChange('remarks', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* Cash Form */}
            {paymentType === 'cash' && (
              <form onSubmit={handleCashSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Cash Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Dealer Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={cashData.dealerName}
                      onChange={(e) => handleCashInputChange('dealerName', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dealerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Dealer</option>
                      {dealers.map(dealer => (
                        <option key={dealer.id} value={dealer.name}>{dealer.name} ({dealer.dealerId})</option>
                      ))}
                    </select>
                    {errors.dealerName && <p className="text-red-500 text-xs mt-1">{errors.dealerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cashData.amount}
                      onChange={(e) => handleCashInputChange('amount', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Received By <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cashData.receivedBy}
                      onChange={(e) => handleCashInputChange('receivedBy', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.receivedBy ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.receivedBy && <p className="text-red-500 text-xs mt-1">{errors.receivedBy}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Received Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={cashData.receivedDate}
                      onChange={(e) => handleCashInputChange('receivedDate', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.receivedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.receivedDate && <p className="text-red-500 text-xs mt-1">{errors.receivedDate}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={cashData.remarks}
                      onChange={(e) => handleCashInputChange('remarks', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* NEFT Form */}
            {paymentType === 'neft' && (
              <form onSubmit={handleNeftSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">NEFT Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Dealer Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={neftData.dealerName}
                      onChange={(e) => handleNeftInputChange('dealerName', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dealerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Dealer</option>
                      {dealers.map(dealer => (
                        <option key={dealer.id} value={dealer.name}>{dealer.name} ({dealer.dealerId})</option>
                      ))}
                    </select>
                    {errors.dealerName && <p className="text-red-500 text-xs mt-1">{errors.dealerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      NEFT Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={neftData.neftBank}
                      onChange={(e) => handleNeftInputChange('neftBank', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.neftBank ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    {errors.neftBank && <p className="text-red-500 text-xs mt-1">{errors.neftBank}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      NEFT Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={neftData.neftNumber}
                      onChange={(e) => handleNeftInputChange('neftNumber', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.neftNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.neftNumber && <p className="text-red-500 text-xs mt-1">{errors.neftNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Received Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={neftData.receivedDate}
                      onChange={(e) => handleNeftInputChange('receivedDate', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.receivedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.receivedDate && <p className="text-red-500 text-xs mt-1">{errors.receivedDate}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={neftData.remarks}
                      onChange={(e) => handleNeftInputChange('remarks', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}

            {/* Empty State */}
            {!paymentType && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Select Payment Type</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Choose a payment method above to continue</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReleaseCommission;

