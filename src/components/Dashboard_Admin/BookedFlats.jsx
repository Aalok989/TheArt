import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { fetchFlatStatus, fetchBookedFlatsDetails, fetchMonths, fetchYears } from '../../api/mockData';

const BookedFlats = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [bookedDetails, setBookedDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  
  const floorScrollRef = useRef(null);
  const blockScrollRef = useRef(null);
  const sizeScrollRef = useRef(null);
  
  useEffect(() => {
    const getFlatStatus = async () => {
      try {
        setLoading(true);
        const [statusRes, detailsRes, monthsRes, yearsRes] = await Promise.all([
          fetchFlatStatus(),
          fetchBookedFlatsDetails(),
          fetchMonths(),
          fetchYears()
        ]);
        if (statusRes.success) {
          setFlatStatusData(statusRes.data);
        }
        if (detailsRes.success) {
          setBookedDetails(detailsRes.data || []);
        }
        if (monthsRes.success) {
          setMonths(monthsRes.data || []);
        }
        if (yearsRes.success) {
          setYears(yearsRes.data || []);
        }
      } catch (error) {
        console.error('Error fetching booked flats:', error);
      } finally {
        setLoading(false);
      }
    };

    getFlatStatus();
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
    setSelectedFloor(null);
    setSelectedBlock(null);
    setSelectedSize(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setExpandedFilters(new Set());
  };

  const handleFlatClick = (flat) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify(flat));
    try { sessionStorage.setItem('flatOrigin', 'bookedFlats'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const filteredFlatsData = useMemo(() => {
    if (!flatStatusData) return [];
    let filtered = flatStatusData.flats.filter(f => f.status === 'Booked');

    if (selectedFloor !== null) {
      filtered = filtered.filter(flat => flat.floor === selectedFloor);
    }
    if (selectedBlock !== null) {
      filtered = filtered.filter(flat => flat.block === selectedBlock);
    }
    if (selectedSize !== null) {
      filtered = filtered.filter(flat => flat.size === selectedSize);
    }

    return filtered;
  }, [flatStatusData, selectedFloor, selectedBlock, selectedSize]);

  const headers = ['Sr. No.','Flat No.','Customer Name','Co-Applicant Name','Email Id','Contact No.','PAN No.','Booking Date','Dealer','Payment Plan','Area','Company Rate','Login Rate','Total Cost','Due Amount','Pending Amount','Paid Amount','Cleared','Due Tax','Pending Tax','Paid Tax','Cleared Tax','Total Pending'];

  const mergedRows = useMemo(() => {
    return filteredFlatsData.map((flat, idx) => {
      const d = bookedDetails.find(b => b.flatNo === flat.flatNo) || {};
      const row = {
        srno: String(idx + 1),
        flatNo: flat.flatNo,
        customerName: d.customerName || '-',
        coApplicantName: d.coApplicantName || '-',
        email: d.email || '-',
        contactNo: d.contactNo || '-',
        panNo: d.panNo || '-',
        bookingDate: d.bookingDate || '-',
        dealer: d.dealer || 'GHPL',
        paymentPlan: d.paymentPlan || 'CLP',
        area: d.area || (flat.size?.split('_')[1] || '-'),
        companyRate: d.companyRate || '5000',
        loginRate: d.loginRate || (flat.size?.includes('2BHK') ? '5600' : '5500'),
        totalCost: d.totalCost || '-',
        dueAmount: d.dueAmount || '-',
        pendingAmount: d.pendingAmount || '-',
        paidAmount: d.paidAmount || '0',
        cleared: d.cleared || '0',
        dueTax: d.dueTax || '0',
        pendingTax: d.pendingTax || '0',
        paidTax: d.paidTax || '0',
        clearedTax: d.clearedTax || '0',
        totalPending: d.totalPending || '0',
      };
      return row;
    });
  }, [filteredFlatsData, bookedDetails]);

  const displayedRows = useMemo(() => {
    if (!searchQuery) return mergedRows;
    const q = searchQuery.toLowerCase();
    return mergedRows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }, [mergedRows, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayedRows.length / pageSize));
  }, [displayedRows.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, currentPage, pageSize]);

  useEffect(() => {
    // reset to first page when filter/search changes or pageSize changes
    setCurrentPage(1);
  }, [searchQuery, pageSize, mergedRows.length]);

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayedRows.map(r => [
      r.srno,r.flatNo,r.customerName,r.coApplicantName,r.email,r.contactNo,r.panNo,r.bookingDate,r.dealer,r.paymentPlan,r.area,r.companyRate,r.loginRate,r.totalCost,r.dueAmount,r.pendingAmount,r.paidAmount,r.cleared,r.dueTax,r.pendingTax,r.paidTax,r.clearedTax,r.totalPending
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
    const csv = [headers.join(','), ...displayedRows.map(r => [
      r.srno,r.flatNo,r.customerName,r.coApplicantName,r.email,r.contactNo,r.panNo,r.bookingDate,r.dealer,r.paymentPlan,r.area,r.companyRate,r.loginRate,r.totalCost,r.dueAmount,r.pendingAmount,r.paidAmount,r.cleared,r.dueTax,r.pendingTax,r.paidTax,r.clearedTax,r.totalPending
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booked-flats.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>Booked Flats</title>
      <style>
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#dbeafe}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  if (loading || !flatStatusData) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading booked flats...</p>
        </div>
      </div>
    );
  }

  const { floors, blocks, sizes } = flatStatusData;

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
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Booked Flats</h2>

          {/* Filter Buttons */}
          <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          {['floor', 'block', 'size', 'month'].map((filter) => {
            const isExpanded = expandedFilters.has(filter);
            const isSelected = (
              (filter === 'floor' && selectedFloor !== null) ||
              (filter === 'block' && selectedBlock !== null) ||
              (filter === 'size' && selectedSize !== null)
            ) || isExpanded; // Month should only highlight when expanded
            
            const toggleExpanded = () => {
              setExpandedFilters(prev => {
                // make expansion exclusive: open only the clicked one
                const isAlreadyOpen = prev.has(filter);
                if (isAlreadyOpen) {
                  return new Set();
                }
                // switching to a different filter: reset all selections
                setSelectedFloor(null);
                setSelectedBlock(null);
                setSelectedSize(null);
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
                  {filter === 'floor'
                    ? 'Floor Wise'
                    : filter === 'block'
                    ? 'Block Wise'
                    : filter === 'size'
                    ? 'Size Wise'
                    : 'Month Wise'}
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
          {/* FLOOR WISE Section */}
          {expandedFilters.has('floor') && (
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
                FLOOR WISE
              </h3>
              <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={floorScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          onClick={() => setSelectedFloor(prev => (prev === floor ? null : floor))}
                          className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedFloor === floor
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                        >
                          {floor}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'right')}
                    className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BLOCK WISE Section */}
          {expandedFilters.has('block') && (
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
                BLOCK WISE
              </h3>
              <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={blockScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {blocks.map((block) => (
                        <button
                          key={block}
                          onClick={() => setSelectedBlock(prev => (prev === block ? null : block))}
                          className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedBlock === block
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                        >
                          {block}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'right')}
                    className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIZE WISE Section */}
          {expandedFilters.has('size') && (
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
                SIZE WISE
              </h3>
              <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={sizeScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(prev => (prev === size ? null : size))}
                          className={`rounded-md font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                            selectedSize === size
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.65rem, 0.75rem, 0.875rem)' }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'right')}
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
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Booked Flats Detail</h2>
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
          <div className="min-w-[1200px]">
            <table ref={tableRef} className="w-full border-collapse text-sm">
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
                      <td className="border border-gray-200 px-3 py-2">{r.coApplicantName}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.email}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.contactNo}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.panNo}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.bookingDate}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.dealer}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.paymentPlan}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.area}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.companyRate}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.loginRate}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.totalCost}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.dueAmount}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.pendingAmount}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.paidAmount}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.cleared}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.dueTax}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.pendingTax}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.paidTax}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.clearedTax}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.totalPending}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={23} className="text-center text-gray-500 py-8">No booked flats found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Fixed-at-bottom pagination (outside scrollable area) */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)' }}>
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

export default BookedFlats;


