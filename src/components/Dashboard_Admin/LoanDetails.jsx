import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { fetchLoanDetails } from '../../api/mockData';

const LoanDetails = () => {
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
    <div className="h-full flex flex-col p-[1.5rem]">
      {/* Header Section */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-[1.5rem] space-y-4 lg:space-y-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800">Loan Details</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Sort Dropdowns */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span
                className="text-[0.875rem] font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortByYear}
                  onChange={(e) => setSortByYear(e.target.value)}
                  className="appearance-none border border-gray-300 px-3 pr-8 focus:outline-none w-full sm:w-[8rem]"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: '0.5rem',
                    height: '2.5rem',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
                    color: '#313131',
                  }}
                >
                  <option value="Select Year">Select Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500 pointer-events-none" />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortByMonth}
                  onChange={(e) => setSortByMonth(e.target.value)}
                  className="appearance-none border border-gray-300 px-3 pr-8 focus:outline-none w-full sm:w-[8rem]"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: '0.5rem',
                    height: '2.5rem',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
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
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                Check
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200">
                Loan Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto pr-[1rem] min-h-0">
        {/* Table Headers */}
        <div
          className="grid gap-[1rem] py-[1rem] border-b sticky top-0 z-10 bg-white"
          style={{ 
            gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr 1fr',
            borderBottomColor: '#616161',
            borderBottomWidth: '0.1875rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            S. No.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Flat No.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Customer name
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Sanctioned Amount
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Bank
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan A/c No.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Interest
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Status
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {filteredData.map((loan, index) => (
            <div
              key={index}
              className="grid gap-[1rem] py-[1.25rem] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              style={{ gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr 1fr' }}
            >
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.srNo}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.flatNo}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.customerName}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.sanctionedAmount}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.loanBank}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.loanAccountNo}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                {loan.loanInterest}
              </div>
              <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                <span
                  style={{
                    backgroundColor: loan.status === 'Successful' ? '#E4FFE5' : '#FFEBEB',
                    color: loan.status === 'Successful' ? '#16A34A' : '#DC2626',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
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
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm font-montserrat">No loan details found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetails;
