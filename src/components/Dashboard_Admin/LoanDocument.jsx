import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch, HiArrowLeft } from 'react-icons/hi';
import { fetchLoanDocuments } from '../../api/mockData';

const LoanDocument = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [loanData, setLoanData] = useState(null);
  const [sortByYear, setSortByYear] = useState('Select Payment Plan');
  const [sortByMonth, setSortByMonth] = useState('Select Status');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const getLoanDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchLoanDocuments();
        if (response.success) {
          setLoanData(response.data);
        }
      } catch (error) {
        console.error('Error fetching loan documents:', error);
      } finally {
        setLoading(false);
      }
    };

    getLoanDocuments();
  }, []);

  // Filter data based on search term
  const filteredData = loanData?.loans?.filter(item =>
    item.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contactNo.includes(searchTerm)
  ) || [];

  // Loading state
  if (loading || !loanData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading loan documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            <button 
              onClick={() => onPageChange && onPageChange('banking')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <HiArrowLeft style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            </button>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Loan Documents</h2>
          </div>
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
                  <option value="Select Payment Plan">Select Payment Plan</option>
                  <option value="CLP">CLP</option>
                  <option value="EMI">EMI</option>
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
                  <option value="Select Status">Select Status</option>
                  <option value="BBA Signed">BBA Signed</option>
                  <option value="Documents Received">Documents Received</option>
                  <option value="Loan Required">Loan Required</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              <button className="bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                Check
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
            gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr',
            gap: 'clamp(0.375rem, 1rem, 1.5rem)',
            paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
            paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
            borderBottomColor: '#616161',
            borderBottomWidth: '0.1875rem'
          }}
        >
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            SR.No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Flat No
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Name
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Contact No
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Payment Plan
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            BBA Signed
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Loan Required
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Documents Received
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Documents
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {filteredData.map((loan, index) => (
            <div
              key={index}
              className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              style={{ gridTemplateColumns: '0.5fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 'clamp(0.375rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)', paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)' }}
            >
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.srNo}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.flatNo}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.name}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.contactNo}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.paymentPlan}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                <span
                  style={{
                    backgroundColor: loan.bbaSigned === 'Yes' ? '#E4FFE5' : '#FFEBEB',
                    color: loan.bbaSigned === 'Yes' ? '#16A34A' : '#DC2626',
                    padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                    borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                    fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  {loan.bbaSigned}
                </span>
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {loan.loanRequired === 'Yes' ? (
                  <span
                    style={{
                      backgroundColor: '#E4FFE5',
                      color: '#16A34A',
                      padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                      borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                      fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                      fontWeight: '500',
                    }}
                  >
                    {loan.loanRequired}
                  </span>
                ) : loan.loanRequired === 'No' ? (
                  <span
                    style={{
                      backgroundColor: '#FFEBEB',
                      color: '#DC2626',
                      padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                      borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                      fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                      fontWeight: '500',
                    }}
                  >
                    {loan.loanRequired}
                  </span>
                ) : (
                  loan.loanRequired
                )}
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                <span
                  style={{
                    backgroundColor: loan.documentsReceived === 'Yes' ? '#E4FFE5' : '#FFEBEB',
                    color: loan.documentsReceived === 'Yes' ? '#16A34A' : '#DC2626',
                    padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                    borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                    fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  {loan.documentsReceived}
                </span>
              </div>
              <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                <button 
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  onClick={() => onPageChange && onPageChange('uploadLoanDoc')}
                >
                  Loan Documents
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredData.length === 0 && (
          <div className="text-center" style={{ paddingTop: 'clamp(1.5rem, 2rem, 2.5rem)', paddingBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <p className="text-gray-500 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>No loan documents found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDocument;
