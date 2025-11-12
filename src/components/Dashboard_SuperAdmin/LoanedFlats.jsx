import React, { useState, useEffect, useMemo } from 'react';
import { IoPrint } from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi';
import { fetchLoanedFlatsData, fetchMonths, fetchYears } from '../../api/mockData';

const LoanedFlats = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loanedDetails, setLoanedDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  
  useEffect(() => {
    const getLoanedFlats = async () => {
      try {
        setLoading(true);
        const [loansRes, monthsRes, yearsRes] = await Promise.all([
          fetchLoanedFlatsData(),
          fetchMonths(),
          fetchYears()
        ]);
        if (loansRes.success) {
          setLoanedDetails(loansRes.data.loans || []);
        }
        if (monthsRes.success) {
          setMonths(monthsRes.data || []);
        }
        if (yearsRes.success) {
          setYears(yearsRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching loaned flats:', error);
      } finally {
        setLoading(false);
      }
    };

    getLoanedFlats();
  }, []);

  const handleViewAll = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setExpandedFilters(new Set());
  };

  const handleFlatClick = (flat) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo: flat.flatNo }));
    try { sessionStorage.setItem('flatOrigin', 'loanedFlats'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const headers = ['S No', 'Flat No', 'Customer Name', 'Sanctioned Amount', 'Loan Bank', 'Loan Account no', 'Loan Interest', 'Loan Status'];

  const displayedRows = useMemo(() => {
    let filtered = loanedDetails;
    
    // Apply month filter if selected
    if (selectedMonth && selectedYear) {
      // Filter by month/year if needed (simplified - you may need to add month/year fields to data)
      // For now, we'll just show all data when month is selected
    }
    
    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      );
    }
    
    return filtered;
  }, [loanedDetails, searchQuery, selectedMonth, selectedYear]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayedRows.length / pageSize));
  }, [displayedRows.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, displayedRows.length]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading loaned flats...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* LEFT SECTION — FILTERS */}
      <div className="w-full lg:w-[20%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Loaned Flats</h2>

          {/* Filter Buttons */}
          <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <button
              onClick={() => {
                const isAlreadyOpen = expandedFilters.has('month');
                if (isAlreadyOpen) {
                  setExpandedFilters(new Set());
                } else {
                  setSelectedMonth(null);
                  setSelectedYear(null);
                  setExpandedFilters(new Set(['month']));
                }
              }}
              className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                expandedFilters.has('month') || (selectedMonth && selectedYear) ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
            >
              <span>Month Wise</span>
              <HiChevronDown className={`transition-transform ${expandedFilters.has('month') ? 'rotate-180' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
            </button>
            <button 
              onClick={handleViewAll}
              className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 inline-flex items-center justify-center text-center"
              style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
            >
              View All
            </button>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* MONTH WISE Section */}
          {expandedFilters.has('month') && (
            <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 3rem)' }}>
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
                MONTH WISE
              </h3>
              <div style={{ marginTop: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col min-w-0">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Select Year</label>
                    <select
                      value={selectedYear || ''}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                    >
                      <option value="" disabled>Select Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Select Month</label>
                    <select
                      value={selectedMonth || ''}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
                    >
                      <option value="" disabled>Select Month</option>
                      {months.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex md:justify-start">
                    <button
                      onClick={() => { 
                        setSelectedYear(null);
                        setSelectedMonth(null);
                        setExpandedFilters(new Set());
                      }}
                      className="bg-sky-400 hover:bg-sky-500 text-white font-semibold rounded-md px-4 py-2"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION — TABLE */}
      <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Loaned Flats Detail</h2>
            <div className="ml-auto flex items-center gap-3">
              <div className="min-w-[10rem]" style={{ width: 'clamp(10rem, 14rem, 18rem)' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                style={{ padding: '0' }}
                title="Print"
              >
                <IoPrint size={32} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="min-w-[800px]">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-200 text-gray-800">
                  {headers.map((h) => (
                    <th key={h} className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r, idx) => (
                    <tr key={idx} className="bg-white even:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                        <button onClick={() => handleFlatClick({ flatNo: r.flatNo })} className="hover:underline">{r.flatNo}</button>
                      </td>
                      <td className="border border-gray-200 px-3 py-2">{r.customerName}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.sanctionedAmount}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.loanBank}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.loanAccountNo}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.loanInterest}</td>
                      <td className="border border-gray-200 px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          r.status === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">No loaned flats found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Fixed-at-bottom pagination */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)', paddingLeft: 'clamp(2rem, 3rem, 4rem)' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, displayedRows.length)} of {displayedRows.length}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {[10, 20, 50, 100].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="First"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Previous"
                >
                  ‹
                </button>
                <span className="text-sm text-gray-700 px-2">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Next"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Last"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoanedFlats;

