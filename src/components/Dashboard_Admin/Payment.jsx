import React, { useState, useEffect } from 'react';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import { fetchPaymentSchedule } from '../../api/mockData';

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [paymentScheduleData, setPaymentScheduleData] = useState(null);
  const [sortBy, setSortBy] = useState('Select');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch payment schedule data
    const getPaymentSchedule = async () => {
      try {
        setLoading(true);
        const response = await fetchPaymentSchedule();
        if (response.success) {
          setPaymentScheduleData(response.data);
        }
      } catch (error) {
        console.error('Error fetching payment schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    getPaymentSchedule();
  }, []);

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
    <div className="h-full flex flex-col p-[1.5rem]">
      {/* Header Section */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-[1.5rem] space-y-4 lg:space-y-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800">Payment Schedule</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span
                className="text-[0.875rem] font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 px-3 pr-8 focus:outline-none w-full sm:w-[10rem]"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: '0.5rem',
                    height: '2.5rem',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
                    color: '#313131',
                  }}
                >
                  <option value="Select">Select</option>
                  <option value="Date">Date</option>
                  <option value="Amount">Amount</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-[2.5rem] pr-3 focus:outline-none w-full sm:w-[10rem]"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: '0.5rem',
                  height: '2.5rem',
                  fontFamily: 'Montserrat',
                  fontSize: '1rem',
                  color: '#313131',
                }}
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 space-y-[1.5rem] overflow-y-auto pr-[1rem] min-h-0">
        {/* Payment Schedule Table */}
        <div>
          <h3
            className="font-bold mb-[1rem] border-b pb-[0.5rem]"
            style={{
              color: '#8C8C8C',
              fontSize: '0.75rem',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
            }}
          >
            PAYMENT SCHEDULE
          </h3>

          {/* Table Headers */}
          <div
            className="grid gap-[1rem] py-[1rem] border-b border-gray-200"
            style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr' }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
              Description
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
              Amount Description
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#8C8C8C',
                fontWeight: 'bold',
                textAlign: 'right',
              }}
            >
              Amount Payable
            </div>
            <div
              style={{
                fontSize: '0.75rem',
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
            {paymentScheduleData.payments.map((item, index) => (
              <div
                key={index}
                className="grid gap-[1rem] py-[1rem] border-b border-gray-200 last:border-b-0"
                style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr' }}
              >
                <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {item.amountDescription}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#000000',
                    fontWeight: '400',
                    textAlign: 'right',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: item.bgColor,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                    }}
                  >
                    {item.amountPayable}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '1rem',
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
              className="grid gap-[1rem] py-[1rem] border-t-2 border-gray-300"
              style={{ gridTemplateColumns: '1.5fr 3.5fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}>
                Total Amount
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: 'bold' }}></div>
              <div
                style={{
                  fontSize: '1rem',
                  color: '#000000',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                {paymentScheduleData.totalAmount}
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  color: '#000000',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}
              >
                {paymentScheduleData.totalGST}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
