import React, { useState, useEffect, useMemo } from 'react';
import { fetchChannelPartners } from '../../api/mockData';

const PaidCommission = ({ onPageChange }) => {
  const [selectedDealer, setSelectedDealer] = useState('');
  const [dealers, setDealers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dealers on component mount
  useEffect(() => {
    const loadDealers = async () => {
      try {
        setLoading(true);
        const response = await fetchChannelPartners();
        if (response.success) {
          const dealerList = response.data.map(partner => ({
            id: partner.id,
            name: partner.name,
            dealerId: partner.companyName ? partner.companyName.split(' ')[0].toUpperCase() : partner.id
          }));
          setDealers(dealerList);
        }
      } catch (error) {
        console.error('Error fetching dealers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDealers();
  }, []);

  // Mock data for table - replace with actual API call
  useEffect(() => {
    if (showTable && selectedDealer) {
      // Generate mock data
      const mockData = [
        { sNo: 1, particulars: 'Commission Payment', date: '2024-01-15', amount: 10000, balance: 100000 },
        { sNo: 2, particulars: 'Commission Payment', date: '2024-02-15', amount: 12000, balance: 88000 },
        { sNo: 3, particulars: 'Commission Payment', date: '2024-03-15', amount: 15000, balance: 73000 },
        { sNo: 4, particulars: 'Commission Payment', date: '2024-04-15', amount: 18000, balance: 55000 },
        { sNo: 5, particulars: 'Commission Payment', date: '2024-05-15', amount: 20000, balance: 35000 },
        { sNo: 6, particulars: 'Commission Payment', date: '2024-06-15', amount: 25000, balance: 10000 },
        { sNo: 7, particulars: 'Commission Payment', date: '2024-07-15', amount: 10000, balance: 0 }
      ];
      setTableData(mockData);
    }
  }, [showTable, selectedDealer]);

  const handleContinue = () => {
    if (selectedDealer) {
      setShowTable(true);
      setCurrentPage(1);
    }
  };

  const handleReset = () => {
    setSelectedDealer('');
    setShowTable(false);
    setTableData([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const headers = ['S.No.', 'Particulars', 'Date', 'Amount', 'Balance'];

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    const q = searchQuery.toLowerCase();
    return tableData.filter(item =>
      item.particulars.toLowerCase().includes(q) ||
      item.date.includes(q) ||
      String(item.amount).includes(q) ||
      String(item.balance).includes(q)
    );
  }, [tableData, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredData.length / pageSize));
  }, [filteredData.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, filteredData.length]);

  // Calculate total commission
  const totalCommission = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredData]);

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
      {/* Header - Always visible */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          Paid Commission
        </h2>
      </div>

      {!showTable ? (
        // Channel Partner Selection Screen
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Select Channel Partner
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Channel Partner <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDealer}
                onChange={(e) => setSelectedDealer(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Channel Partner</option>
                {dealers.map(dealer => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name} ({dealer.dealerId})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleContinue}
                disabled={!selectedDealer}
                className={`flex-1 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDealer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Table Display Screen
        <div className="flex flex-col h-full">
          {/* Total Commission and Reset Button */}
          <div className="flex-shrink-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-gray-800">
                Total Commission: {totalCommission.toLocaleString()}
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex-shrink-0 px-4 pb-4" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="min-w-full">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-200 text-gray-800">
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="border border-gray-300 px-3 py-2 text-center whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row, idx) => (
                      <tr key={idx} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                          {row.particulars}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                          {row.amount.toLocaleString()}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center whitespace-nowrap">
                          {row.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-8">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)', paddingLeft: 'clamp(2rem, 3rem, 4rem)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
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
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    title="First"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    title="Previous"
                  >
                    ‹
                  </button>
                  <span className="text-sm text-gray-700 px-2">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    title="Next"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    title="Last"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidCommission;

