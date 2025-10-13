import React, { useState, useEffect } from 'react';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import { customerAPI } from '../../api/api';

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paymentScheduleData, setPaymentScheduleData] = useState(null);
  const [sortBy, setSortBy] = useState('Select');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payment schedule data
  const getPaymentSchedule = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getPaymentSchedule(); // Updated to use real API
      if (response.success) {
        setPaymentScheduleData(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentSchedule();
  }, []);

  // Animation effect after data is loaded
  useEffect(() => {
    if (!loading && paymentScheduleData) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, paymentScheduleData]);

  // Search filter
  const filteredPayments = paymentScheduleData?.payments.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.amountDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.amountPayable.includes(searchTerm) ||
    item.gst.includes(searchTerm)
  ) || [];

  // Sorting logic
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'Select') return 0;
    
    const getNumericValue = (value) => parseFloat(value.replace(/,/g, '')) || 0;
    
    switch (sortBy) {
      case 'Date': // Assuming description implies order; fallback to index if needed
        return a.description.localeCompare(b.description);
      case 'Amount':
        return getNumericValue(b.amountPayable) - getNumericValue(a.amountPayable); // Descending
      default:
        return 0;
    }
  });

  // Calculate totals based on sorted/filtered (or original if needed)
  const totalAmount = paymentScheduleData?.totalAmount || '0';
  const totalGST = paymentScheduleData?.totalGST || '0';

  // Loading state
  if (loading || !paymentScheduleData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading payment schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800 animate-slide-in-down" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Payment Schedule</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0" style={{ gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            {/* Sort Dropdown */}
            <div className="flex items-center w-full sm:w-auto" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              <span
                className="font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 focus:outline-none w-full hover-scale btn-animate"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                    height: 'clamp(2rem, 2.5rem, 3rem)',
                    paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                    paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                    minWidth: 'clamp(8rem, 10rem, 12rem)',
                    fontFamily: 'Montserrat',
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#313131',
                  }}
                >
                  <option value="Select">Select</option>
                  <option value="Date">Date</option>
                  <option value="Amount">Amount</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 focus:outline-none w-full hover-scale btn-animate"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  height: 'clamp(2rem, 2.5rem, 3rem)',
                  paddingLeft: 'clamp(2rem, 2.5rem, 3rem)',
                  paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)',
                  minWidth: 'clamp(8rem, 10rem, 12rem)',
                  fontFamily: 'Montserrat',
                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                  color: '#313131',
                }}
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto min-h-0 section-animate animate-delay-300" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        {/* Payment Schedule Table */}
        <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            PAYMENT SCHEDULE
          </h3>

          {/* Table Headers */}
          <div
            className="grid border-b border-gray-200"
            style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
          >
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              Description
            </div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              Amount Description
            </div>
            <div
              style={{
                fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                color: '#8C8C8C',
                fontWeight: 'bold',
                textAlign: 'right',
              }}
            >
              Amount Payable
            </div>
            <div
              style={{
                fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                color: '#8C8C8C',
                fontWeight: 'bold',
                textAlign: 'right',
              }}
            >
              GST
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {sortedPayments.map((item, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {item.description}
                </div>
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {item.amountDescription}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#000000',
                    fontWeight: '400',
                    textAlign: 'right',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: item.bgColor,
                      padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.375rem, 0.5rem, 0.625rem)',
                      borderRadius: 'clamp(0.125rem, 0.25rem, 0.375rem)',
                    }}
                  >
                    {item.amountPayable}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#000000',
                    fontWeight: '400',
                    textAlign: 'right',
                  }}
                >
                  {item.gst}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div
              className="grid border-t-2 border-gray-300"
              style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
            >
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: 'bold' }}>
                Total Amount
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: 'bold' }}></div>
              <div
                style={{
                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                  color: '#000000',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                {totalAmount}
              </div>
              <div
                style={{
                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                  color: '#000000',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                {totalGST}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;