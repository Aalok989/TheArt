import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { HiChevronDown, HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi';
import { fetchMonths, fetchYears, fetchChequeData } from '../../api/mockData';

const Cheque = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chequeData, setChequeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingCheque, setEditingCheque] = useState(null);
  const [editFormData, setEditFormData] = useState({
    flatNo: '',
    chequeNo: '',
    amount: '',
    onAccountOf: '',
    favor: '',
    bank: '',
    date: '',
    receivingDate: '',
    chequeStatus: '',
    clearingDate: '',
    receiverBank: '',
    account: '',
    remarks: ''
  });

  const statusScrollRef = useRef(null);

  const statuses = ['In Process', 'Cleared', 'Bounced'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [monthsRes, yearsRes, chequeRes] = await Promise.all([
          fetchMonths(),
          fetchYears(),
          fetchChequeData()
        ]);
        if (monthsRes.success) {
          setMonths(monthsRes.data || []);
        }
        if (yearsRes.success) {
          setYears(yearsRes.data || []);
        }
        if (chequeRes.success) {
          setChequeData(chequeRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching cheque data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAll = () => {
    setSelectedStatus(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setExpandedFilters(new Set());
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const headers = ['SR. No.', 'Flat No.', 'Customer', 'Payment Plan', 'Channel Partner', 'Cheque No.', 'Cheque Amount', 'Amount', 'On Account Of', 'Bank', 'Date', 'Status', 'Account', 'Remarks', 'Updated By', 'Action'];

  const filteredData = useMemo(() => {
    let filtered = chequeData;

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Month/Year filter
    if (selectedYear && selectedMonth) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.toLocaleString('default', { month: 'long' });
        return itemYear === parseInt(selectedYear) && itemMonth === selectedMonth;
      });
    }

    return filtered;
  }, [chequeData, selectedStatus, selectedMonth, selectedYear]);

  const displayedRows = useMemo(() => {
    if (!searchQuery) return filteredData;
    const q = searchQuery.toLowerCase();
    return filteredData.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }, [filteredData, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return displayedRows;
    
    return [...displayedRows].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      
      if (sortColumn === 'date') {
        aVal = new Date(a.date);
        bVal = new Date(b.date);
      } else if (sortColumn === 'chequeAmount' || sortColumn === 'amount') {
        aVal = parseFloat(a[sortColumn] || 0);
        bVal = parseFloat(b[sortColumn] || 0);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [displayedRows, sortColumn, sortDirection]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [sortedData.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, sortedData.length, selectedStatus, selectedMonth, selectedYear]);

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...sortedData.map(r => [
      r.srNo || '', r.flatNo || '', r.customer || '', r.paymentPlan || '', r.channelPartner || '', r.chequeNo || '', r.chequeAmount || '', r.amount || '', r.onAccountOf || '', r.bank || '', r.date || '', r.status || '', r.account || '', r.remarks || '', r.updatedBy || ''
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
    const csv = [headers.join(','), ...sortedData.map(r => [
      r.srNo || '', r.flatNo || '', r.customer || '', r.paymentPlan || '', r.channelPartner || '', r.chequeNo || '', r.chequeAmount || '', r.amount || '', r.onAccountOf || '', r.bank || '', r.date || '', r.status || '', r.account || '', r.remarks || '', r.updatedBy || ''
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cheque.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>Cheque</title>
      <style>
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#dbeafe}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.print();
  };

  const handleEdit = (cheque) => {
    setEditingCheque(cheque);
    // Convert status to match form (In Process -> InProcess, etc.)
    const statusForForm = cheque.status === 'In Process' ? 'InProcess' : cheque.status;
    setEditFormData({
      flatNo: cheque.flatNo || '',
      chequeNo: cheque.chequeNo || '',
      amount: cheque.amount || '',
      onAccountOf: cheque.onAccountOf || '',
      favor: cheque.favor || 'ORCHID',
      bank: cheque.bank || 'HDFC',
      date: cheque.date || '',
      receivingDate: cheque.receivingDate || '',
      chequeStatus: statusForForm || 'InProcess',
      clearingDate: cheque.clearingDate || '',
      receiverBank: cheque.receiverBank || 'NA',
      account: cheque.account || '',
      remarks: cheque.remarks || ''
    });
    setShowEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEditingCheque(null);
    setEditFormData({
      flatNo: '',
      chequeNo: '',
      amount: '',
      onAccountOf: '',
      favor: '',
      bank: '',
      date: '',
      receivingDate: '',
      chequeStatus: '',
      clearingDate: '',
      receiverBank: '',
      account: '',
      remarks: ''
    });
  };

  const handleFormInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateCheque = () => {
    if (!editingCheque) return;

    // Update the cheque data
    const updatedData = chequeData.map(item => {
      if (item.srNo === editingCheque.srNo) {
        // Convert form status back to display format (InProcess -> In Process)
        const displayStatus = editFormData.chequeStatus === 'InProcess' ? 'In Process' : editFormData.chequeStatus;
        return {
          ...item,
          amount: editFormData.amount,
          favor: editFormData.favor,
          bank: editFormData.bank,
          date: editFormData.date,
          receivingDate: editFormData.receivingDate,
          status: displayStatus,
          clearingDate: editFormData.clearingDate,
          receiverBank: editFormData.receiverBank,
          account: editFormData.account,
          remarks: editFormData.remarks
        };
      }
      return item;
    });

    setChequeData(updatedData);
    handleCloseEditPopup();
  };

  const banks = ['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'];
  const receiverBanks = ['NA', 'HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'];
  const chequeStatuses = ['InProcess', 'Cleared', 'Bounced'];


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
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT SECTION — FILTERS */}
        <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Cheque</h2>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              {/* Status Filters - In Process, Cleared, Bounced */}
              {['status', 'month'].map((filter) => {
                const isExpanded = expandedFilters.has(filter);
                const isSelected = (
                  filter === 'status' && selectedStatus !== null
                ) || isExpanded;
                
                const toggleExpanded = () => {
                  setExpandedFilters(prev => {
                    const isAlreadyOpen = prev.has(filter);
                    if (isAlreadyOpen) {
                      return new Set();
                    }
                    setSelectedStatus(null);
                    setSelectedMonth(null);
                    setSelectedYear(null);
                    return new Set([filter]);
                  });
                };
                
                return (
                  <button
                    key={filter}
                    onClick={toggleExpanded}
                    className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                      isSelected ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
                  >
                    <span>
                      {filter === 'status' ? 'Status Wise' : 'Month Wise'}
                    </span>
                    <HiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                );
              })}
              <button 
                onClick={handleViewAll}
                className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 inline-flex items-center justify-center col-span-2 w-full text-center"
                style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
              >
                View All
              </button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {/* STATUS WISE Section */}
            {expandedFilters.has('status') && (
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
                  STATUS WISE
                </h3>
                <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                  <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                    {/* Left Arrow */}
                    <button
                      onClick={() => handleScroll(statusScrollRef, 'left')}
                      className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                      style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                    >
                      <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                    </button>
                    
                    {/* Scrollable Content */}
                    <div 
                      ref={statusScrollRef}
                      className="overflow-x-scroll scrollbar-hide"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                    >
                      <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(prev => (prev === status ? null : status))}
                            className={`rounded-md font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                              selectedStatus === status
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.65rem, 0.75rem, 0.875rem)' }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Right Arrow */}
                    <button
                      onClick={() => handleScroll(statusScrollRef, 'right')}
                      className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                      style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                    >
                      <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

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
              <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Cheque Detail</h2>
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

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <div className="min-w-[1400px]">
              <table ref={tableRef} className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-200 text-gray-800">
                    {headers.map((h, idx) => {
                      const columnKey = idx === 0 ? 'srNo' : 
                        idx === 1 ? 'flatNo' :
                        idx === 2 ? 'customer' :
                        idx === 3 ? 'paymentPlan' :
                        idx === 4 ? 'channelPartner' :
                        idx === 5 ? 'chequeNo' :
                        idx === 6 ? 'chequeAmount' :
                        idx === 7 ? 'amount' :
                        idx === 8 ? 'onAccountOf' :
                        idx === 9 ? 'bank' :
                        idx === 10 ? 'date' :
                        idx === 11 ? 'status' :
                        idx === 12 ? 'account' :
                        idx === 13 ? 'remarks' :
                        idx === 14 ? 'updatedBy' : null;
                      
                      return (
                        <th 
                          key={h} 
                          className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap"
                          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {h}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((r, idx) => (
                      <tr key={idx} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.flatNo}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.customer}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.paymentPlan}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.channelPartner}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.chequeNo}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.chequeAmount}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.amount}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.onAccountOf}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.bank}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.date}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.status}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.account}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.remarks}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.updatedBy}</td>
                        <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(r)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={16} className="text-center text-gray-500 py-8">No cheque data found for the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)', paddingLeft: 'clamp(2rem, 3rem, 4rem)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
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
      </div>

      {/* Edit Cheque Popup */}
      {showEditPopup && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          style={{ zIndex: 99999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseEditPopup();
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
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" style={{ zIndex: 100001 }}>
              <h3 className="text-lg font-bold text-gray-800">Edit Cheque</h3>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation?.();
                  handleCloseEditPopup();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                style={{ 
                  zIndex: 100002,
                  position: 'relative'
                }}
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateCheque(); }} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Flat No.</label>
                    <input
                      type="text"
                      value={editFormData.flatNo}
                      readOnly
                      disabled
                      className="w-full border rounded px-3 h-10 bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Cheque No.</label>
                    <input
                      type="text"
                      value={editFormData.chequeNo}
                      readOnly
                      disabled
                      className="w-full border rounded px-3 h-10 bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Amount</label>
                    <input
                      type="text"
                      value={editFormData.amount}
                      onChange={(e) => handleFormInputChange('amount', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">On Account</label>
                    <input
                      type="text"
                      value={editFormData.onAccountOf}
                      readOnly
                      disabled
                      className="w-full border rounded px-3 h-10 bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Favor</label>
                    <input
                      type="text"
                      value={editFormData.favor}
                      onChange={(e) => handleFormInputChange('favor', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Bank</label>
                    <select
                      value={editFormData.bank}
                      onChange={(e) => handleFormInputChange('bank', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => handleFormInputChange('date', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Receiving Date</label>
                    <input
                      type="date"
                      value={editFormData.receivingDate}
                      onChange={(e) => handleFormInputChange('receivingDate', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Cheque status</label>
                    <select
                      value={editFormData.chequeStatus}
                      onChange={(e) => handleFormInputChange('chequeStatus', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {chequeStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Clearing Date</label>
                    <input
                      type="date"
                      value={editFormData.clearingDate}
                      onChange={(e) => handleFormInputChange('clearingDate', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Receiver Bank</label>
                    <select
                      value={editFormData.receiverBank}
                      onChange={(e) => handleFormInputChange('receiverBank', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {receiverBanks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Account</label>
                    <input
                      type="text"
                      value={editFormData.account}
                      onChange={(e) => handleFormInputChange('account', e.target.value)}
                      className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 4 - Remarks (full width) */}
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    value={editFormData.remarks}
                    onChange={(e) => handleFormInputChange('remarks', e.target.value)}
                    className="w-full border rounded px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Update Button */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpdateCheque();
                    }}
                    className="px-4 py-2 rounded border text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseEditPopup();
                    }}
                    className="px-4 py-2 rounded border bg-white text-gray-800 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Cheque;
