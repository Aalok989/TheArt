import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { fetchLoanDetails } from '../../api/mockData';

const LoanDetails = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [loanData, setLoanData] = useState(null);
  const [sortByYear, setSortByYear] = useState('Select Year');
  const [sortByMonth, setSortByMonth] = useState('Select Month');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const getLoanDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchLoanDetails();
        if (response.success) {
          setLoanData(response.data);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
      } finally {
        setLoading(false);
      }
    };

    getLoanDetails();
  }, []);

  // Filter data based on search term
  const filteredData = loanData?.loans?.filter(item =>
    item.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.loanBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.loanAccountNo.includes(searchTerm)
  ) || [];

  // Loading state
  if (loading || !loanData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Loan Details</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0" style={{ gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            {/* Sort Dropdowns */}
            <div className="flex items-center w-full sm:w-auto" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              <span
                className="font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortByYear}
                  onChange={(e) => setSortByYear(e.target.value)}
                  className="appearance-none border border-gray-300 focus:outline-none w-full"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                    height: 'clamp(2rem, 2.5rem, 3rem)',
                    paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                    paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                    minWidth: 'clamp(6rem, 8rem, 10rem)',
                    fontFamily: 'Montserrat',
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#313131',
                  }}
                >
                  <option value="Select Year">Select Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortByMonth}
                  onChange={(e) => setSortByMonth(e.target.value)}
                  className="appearance-none border border-gray-300 focus:outline-none w-full"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                    height: 'clamp(2rem, 2.5rem, 3rem)',
                    paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                    paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                    minWidth: 'clamp(6rem, 8rem, 10rem)',
                    fontFamily: 'Montserrat',
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#313131',
                  }}
                >
                  <option value="Select Month">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              <button className="bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                Check
              </button>
              <button 
                className="bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200"
                onClick={() => onPageChange && onPageChange('loanDocuments')}
                style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Loan Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        {/* Table Headers */}
        <div
          className="grid border-b sticky top-0 z-10 bg-white"
          style={{ 
            gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr 1fr',
            gap: 'clamp(0.5rem, 1rem, 1.5rem)',
            paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
            paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
            borderBottomColor: '#616161',
            borderBottomWidth: '0.1875rem'
          }}
        >
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            S. No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Flat No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Customer name
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Sanctioned Amount
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Bank
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan A/c No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Interest
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Status
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {filteredData.map((loan, index) => (
            <div
              key={index}
              className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              style={{ gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)', paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)' }}
            >
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.srNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.flatNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.customerName}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.sanctionedAmount}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.loanBank}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.loanAccountNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.loanInterest}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                <span
                  style={{
                    backgroundColor: loan.status === 'Successful' ? '#E4FFE5' : '#FFEBEB',
                    color: loan.status === 'Successful' ? '#16A34A' : '#DC2626',
                    padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                    borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                    fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  {loan.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredData.length === 0 && (
          <div className="text-center" style={{ paddingTop: 'clamp(1.5rem, 2rem, 2.5rem)', paddingBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <p className="text-gray-500 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>No loan details found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
