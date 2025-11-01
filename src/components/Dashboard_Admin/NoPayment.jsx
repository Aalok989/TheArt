import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { FaUpload } from 'react-icons/fa';
import { MdPublishedWithChanges } from 'react-icons/md';
import { fetchCompletePayment } from '../../api/mockData';
import DemandLetter from '../Template/DemandLetter';
import UploadDocumentPopup from './UploadDocumentPopup';

const NoPayment = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('View All');
  const [showDemandLetter, setShowDemandLetter] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedPaymentForUpload, setSelectedPaymentForUpload] = useState(null);
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const getNoPayment = async () => {
      try {
        setLoading(true);
        const response = await fetchCompletePayment();
        if (response.success) {
          setPaymentData(response.data);
        }
      } catch (error) {
        console.error('Error fetching no payment:', error);
      } finally {
        setLoading(false);
      }
    };

    getNoPayment();
  }, []);

  // Filter data based on search term and filter
  const displayed = useMemo(() => {
    let filtered = paymentData?.payments || [];
    
    // Apply CLP filter if selected
    if (selectedFilter === 'CLP') {
      filtered = filtered.filter(item => item.paymentPlan === 'CLP');
    }
    
    // Apply search filter
    const q = searchQuery.toLowerCase();
    if (q) {
      filtered = filtered.filter(item =>
        item.flatNo.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phnNo.includes(q)
      );
    }
    
    return filtered;
  }, [paymentData, searchQuery, selectedFilter]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayed.length / pageSize));
  }, [displayed.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayed.slice(start, start + pageSize);
  }, [displayed, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, displayed.length, selectedFilter]);

  const headers = ['Sr No.', 'Flat No.', 'Name', 'Email', 'Phn No.', 'Due Amount', 'Pending Amount', 'Cleared Amount', 'In Process', 'Due Tax', 'Pending Tax', 'Paid Tax', 'Cleared Tax', 'Total Dues'];

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayed.map(r => [
      r.srNo || '', r.flatNo || '', r.name || '', r.email || '', r.phnNo || '', r.dueAmount || '', r.pendingAmount || '', r.clearedAmount || '', r.inProcess || '', r.dueTax || '', r.pendingTax || '', r.paidTax || '', r.clearedTax || '', r.totalDues || ''
    ].join('\t'))].join('\n');
    try {
      await navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleExportCSV = () => {
    const csv = [headers.join(','), ...displayed.map(r => [
      r.srNo || '', r.flatNo || '', r.name || '', r.email || '', r.phnNo || '', r.dueAmount || '', r.pendingAmount || '', r.clearedAmount || '', r.inProcess || '', r.dueTax || '', r.pendingTax || '', r.paidTax || '', r.clearedTax || '', r.totalDues || ''
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'no-payment.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>No Payment</title>
      <style>
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#dbeafe}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.print();
  };

  const handleFlatClick = (payment) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo: payment.flatNo }));
    try { sessionStorage.setItem('flatOrigin', 'noPayment'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const handleEmailDemand = (payment) => {
    setSelectedPayment(payment);
    setShowDemandLetter(true);
  };

  const handleCloseDemandLetter = () => {
    setShowDemandLetter(false);
    setSelectedPayment(null);
  };

  const handleUploadDocuments = (payment) => {
    setSelectedPaymentForUpload(payment);
    setShowUploadPopup(true);
  };

  const handleCloseUploadPopup = () => {
    setShowUploadPopup(false);
    setSelectedPaymentForUpload(null);
  };

  const handleChangeConstruction = (payment) => {
    // Handle change construction stages action
    console.log('Change construction stages for:', payment);
  };

  // Loading state
  if (loading || !paymentData) {
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
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>No Payment</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              style={{ minWidth: 'clamp(7rem, 9rem, 11rem)' }}
            >
              <option value="CLP">CLP</option>
              <option value="View All">View All</option>
            </select>
            <div className="flex items-center gap-2 relative">
              <button onClick={handleCopy} aria-label="Copy" title="Copy"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800">
                <FiCopy size={14} />
              </button>
              {copied && (
                <span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">Copied</span>
              )}
              <button onClick={handleExportCSV} aria-label="Export Excel" title="Export Excel"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 text-white">
                <FaFileExcel size={14} />
              </button>
              <button onClick={handleExportPDF} aria-label="Export PDF" title="Export PDF"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white">
                <FaFilePdf size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                <th className="border border-gray-300 px-3 py-2 text-left">Sr No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Flat No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Phn No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Due Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Pending Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Cleared Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left">In Process</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Due Tax</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Pending Tax</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Paid Tax</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Cleared Tax</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Total Dues</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr><td colSpan={15} className="text-center text-gray-500 py-6">No data found.</td></tr>
              ) : paginatedRows.map((payment, idx) => (
                <tr key={idx} className="bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                    <button onClick={() => handleFlatClick(payment)} className="hover:underline">{payment.flatNo}</button>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{payment.name}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.email}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.phnNo}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.dueAmount}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.pendingAmount}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.clearedAmount}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.inProcess}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.dueTax}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.pendingTax}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.paidTax}</td>
                  <td className="border border-gray-200 px-3 py-2">{payment.clearedTax}</td>
                  <td className="border border-gray-200 px-3 py-2 font-semibold">{payment.totalDues}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEmailDemand(payment)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Email Demand Letter"
                      >
                        <IoMail size={20} />
                      </button>
                      <button
                        onClick={() => handleUploadDocuments(payment)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Upload Documents"
                      >
                        <FaUpload size={20} />
                      </button>
                      <button
                        onClick={() => handleChangeConstruction(payment)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                        title="Change Construction Stages"
                      >
                        <MdPublishedWithChanges size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* Demand Letter Modal */}
      {showDemandLetter && selectedPayment && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseDemandLetter();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto relative"
            style={{ zIndex: 100000 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001, position: 'relative' }}>
              <h3 className="text-lg font-bold">Demand Letter - {selectedPayment.flatNo}</h3>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCloseDemandLetter();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                style={{ 
                  zIndex: 100002, 
                  position: 'relative', 
                  pointerEvents: 'auto'
                }}
              >
                Close
              </button>
            </div>
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <DemandLetter paymentData={selectedPayment} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Document Popup */}
      {selectedPaymentForUpload && (
        <UploadDocumentPopup
          isOpen={showUploadPopup}
          onClose={handleCloseUploadPopup}
          documentType={`Block ${selectedPaymentForUpload.flatNo.match(/^[A-Z]/)?.[0] || ''} - Flat No: ${selectedPaymentForUpload.flatNo}`}
        />
      )}
    </div>
  );
};

export default NoPayment;

