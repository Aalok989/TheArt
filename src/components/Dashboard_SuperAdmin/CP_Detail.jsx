import React, { useState, useEffect, useMemo } from 'react';
import { IoPrint } from 'react-icons/io5';
import { HiPencil, HiX } from 'react-icons/hi';
import { fetchCPDetail } from '../../api/mockData';

const CP_Detail = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [cpData, setCpData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDealerId, setSelectedDealerId] = useState(null);
  const [selectedDealerName, setSelectedDealerName] = useState(null);
  const [showEditCommissionForm, setShowEditCommissionForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editCommissionData, setEditCommissionData] = useState({
    oldCommission: '',
    newCommission: ''
  });

  // Get dealer ID and name from sessionStorage on component mount
  useEffect(() => {
    const dealerId = sessionStorage.getItem('selectedDealerId');
    const dealerName = sessionStorage.getItem('selectedDealerName');
    setSelectedDealerId(dealerId);
    setSelectedDealerName(dealerName);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const getCPDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchCPDetail(selectedDealerId);
        if (response.success) {
          setCpData(response.data);
        }
      } catch (error) {
        console.error('Error fetching CP details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDealerId) {
      getCPDetails();
    }
  }, [selectedDealerId]);

  // Filter data based on search term
  const displayed = useMemo(() => {
    let items = cpData?.records || [];
    
    const q = searchQuery.toLowerCase();
    if (!q) return items;
    return items.filter(item =>
      item.flatNo.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.contactNo.includes(q)
    );
  }, [cpData, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayed.length / pageSize));
  }, [displayed.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayed.slice(start, start + pageSize);
  }, [displayed, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, displayed.length]);

  const handleFlatClick = (record) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo: record.flatNo }));
    try { sessionStorage.setItem('flatOrigin', 'cpDetail'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    // Calculate old commission - you might need to adjust this based on your commission calculation logic
    const oldCommission = record.totalCommission || record.commissionAfterTDS || 0;
    setEditCommissionData({
      oldCommission: oldCommission,
      newCommission: oldCommission
    });
    setShowEditCommissionForm(true);
  };

  const handleEditCommissionSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update commission
    console.log('Update commission for Flat:', selectedRecord?.flatNo, editCommissionData);
    alert(`Commission updated successfully for Flat ${selectedRecord?.flatNo}!`);
    setShowEditCommissionForm(false);
    setEditCommissionData({ oldCommission: '', newCommission: '' });
    setSelectedRecord(null);
    // Optionally refresh the data here
  };

  const handleCloseEditForm = () => {
    setShowEditCommissionForm(false);
    setEditCommissionData({ oldCommission: '', newCommission: '' });
    setSelectedRecord(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading state
  if (loading || !cpData) {
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
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>
            Channel Partner Details - {selectedDealerName || 'Unknown'} ({selectedDealerId || 'N/A'})
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
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

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-gray-800">
              <th className="border border-gray-300 px-3 py-2 text-center">S.N.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Flat No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Customer Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Contact No</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Payment Plan</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Company Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Login Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Deal Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Due Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Cleared Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Total Commission</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Commission After TDS</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Total</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr><td colSpan={14} className="text-center text-gray-500 py-6">No data found.</td></tr>
            ) : paginatedRows.map((record, idx) => (
              <tr key={idx} className="bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2 text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                  <button onClick={()=>handleFlatClick(record)} className="hover:underline">{record.flatNo}</button>
                </td>
                <td className="border border-gray-200 px-3 py-2">{record.customerName}</td>
                <td className="border border-gray-200 px-3 py-2">{record.contactNo}</td>
                <td className="border border-gray-200 px-3 py-2">{record.paymentPlan}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.companyRate}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.loginRate}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.dealRate}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.dueAmount}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.clearedAmount}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.totalCommission}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.commissionAfterTDS}</td>
                <td className="border border-gray-200 px-3 py-2 text-right">{record.total}</td>
                <td className="border border-gray-200 px-3 py-2 text-center">
                  <button 
                    onClick={() => handleEditClick(record)}
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center mx-auto"
                    title="Edit"
                  >
                    <HiPencil size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)', paddingLeft:'clamp(2rem,3rem,4rem)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, displayed.length)} of {displayed.length}
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

      {/* Edit Commission Form Modal */}
      {showEditCommissionForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseEditForm();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Edit Commission - Flat {selectedRecord?.flatNo}
              </h3>
              <button
                onClick={handleCloseEditForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>
            <form onSubmit={handleEditCommissionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Old Commission</label>
                <input
                  type="text"
                  value={editCommissionData.oldCommission}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Commission</label>
                <input
                  type="text"
                  value={editCommissionData.newCommission}
                  onChange={(e) => setEditCommissionData({ ...editCommissionData, newCommission: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CP_Detail;

