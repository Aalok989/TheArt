import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { fetchFlatStatus, fetchCancelledFlatsDetails, fetchRefundedFlats, fetchRefundedCheques, fetchMonths, fetchYears } from '../../api/mockData';

const CancelledFlats = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [onlyRefundedFlats, setOnlyRefundedFlats] = useState(false);
  const [onlyRefundedCheques, setOnlyRefundedCheques] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [details, setDetails] = useState([]);
  const [refundedFlatsRows, setRefundedFlatsRows] = useState([]);
  const [refundedChequesRows, setRefundedChequesRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const blockScrollRef = useRef(null);
  const [refundRow, setRefundRow] = useState(null);
  const [refundedSet, setRefundedSet] = useState(new Set());
  const [editContext, setEditContext] = useState(null); // { mode: 'refundedFlats'|'refundedCheques', index: number, row }
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statusRes, cancelRes, refundFlatsRes, refundChequesRes, monthsRes, yearsRes] = await Promise.all([
          fetchFlatStatus(),
          fetchCancelledFlatsDetails(),
          fetchRefundedFlats(),
          fetchRefundedCheques(),
          fetchMonths(),
          fetchYears(),
        ]);
        if (statusRes.success) setFlatStatusData(statusRes.data);
        if (cancelRes.success) setDetails(cancelRes.data || []);
        if (refundFlatsRes.success) setRefundedFlatsRows(refundFlatsRes.data || []);
        if (refundChequesRes.success) setRefundedChequesRows(refundChequesRes.data || []);
        if (monthsRes.success) setMonths(monthsRes.data || []);
        if (yearsRes.success) setYears(yearsRes.data || []);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleFlatClick = (flat) => {
    try { sessionStorage.setItem('selectedFlat', JSON.stringify(flat)); sessionStorage.setItem('flatOrigin','cancelledFlats'); } catch {}
    if (onPageChange) onPageChange('flat');
  };

  const handleViewAll = () => {
    setSelectedBlock(null); setSelectedMonth(null); setSelectedYear(null);
    setOnlyRefundedFlats(false); setOnlyRefundedCheques(false);
    setExpandedFilters(new Set());
  };

  const cancelledHeaders = ['Sr. No.','Flat No.','Customer Name','Paid amount','Dealer','Cancellation Date','Remarks','Status','Refund'];
  const refundHeaders = ['S.No','Flat No.','Cleared Amount','Refunded Amount','Refunded date','Cheque No','Cheque Bank','Cheque Date','Cheque Status','Remarks','Action'];

  const mergedRows = useMemo(() => {
    if (!flatStatusData) return [];
    const allFlats = flatStatusData.flats || [];
    return (details || []).map((d, idx) => {
      const flat = allFlats.find(f => f.flatNo === d.flatNo);
      return {
        srno: String(idx + 1),
        flatNo: d.flatNo,
        customerName: d.customerName || '-',
        paidAmount: d.paidAmount || '0',
        dealer: d.dealer || 'GHPL',
        cancellationDate: d.cancellationDate || '-',
        remarks: d.remarks || '',
        status: d.status || 'Cancelled',
        block: flat ? flat.block : null,
      };
    });
  }, [flatStatusData, details]);

  const blockOptions = useMemo(() => (flatStatusData ? flatStatusData.blocks : []), [flatStatusData]);

  const filterByUI = useMemo(() => {
    let rows = mergedRows;
    if (selectedBlock) rows = rows.filter(r => r.block === selectedBlock);
    // Month/year filters not applied to mock rows; can be wired to cancellationDate if needed
    if (onlyRefundedFlats) rows = rows.filter(r => Number(r.paidAmount) > 0);
    if (onlyRefundedCheques) rows = rows; // placeholder
    const q = searchQuery.toLowerCase();
    if (q) rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    return rows;
  }, [mergedRows, selectedBlock, selectedMonth, selectedYear, onlyRefundedFlats, onlyRefundedCheques, searchQuery]);

  const mode = onlyRefundedFlats ? 'refundedFlats' : (onlyRefundedCheques ? 'refundedCheques' : 'cancelled');

  const tableHeaders = mode === 'cancelled' ? cancelledHeaders : refundHeaders;

  const rowsForMode = useMemo(() => {
    if (mode === 'cancelled') return filterByUI;
    const base = mode === 'refundedFlats' ? refundedFlatsRows : refundedChequesRows;
    const q = searchQuery.toLowerCase();
    return !q ? base : base.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [mode, filterByUI, refundedFlatsRows, refundedChequesRows, searchQuery]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rowsForMode.length / pageSize)), [rowsForMode.length, pageSize]);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rowsForMode.slice(start, start + pageSize);
  }, [rowsForMode, currentPage, pageSize]);
  useEffect(() => setCurrentPage(1), [searchQuery, pageSize, selectedBlock, selectedMonth, selectedYear, onlyRefundedFlats, onlyRefundedCheques]);

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...filterByUI.map(r => [r.srno,r.flatNo,r.customerName,r.paidAmount,r.dealer,r.cancellationDate,r.remarks,r.status,''].join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(csv); setCopied(true); setTimeout(()=>setCopied(false),1500);} catch(e){ console.error(e); }
  };
  const handleExportCSV = () => {
    const csv = [headers.join(','), ...filterByUI.map(r => [r.srno,r.flatNo,r.customerName,r.paidAmount,r.dealer,r.cancellationDate,r.remarks,r.status,''].map(val=>`"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='cancelled-flats.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w=window.open('', '_blank'); if(!w) return; const tableHtml = tableRef.current?tableRef.current.outerHTML:''; w.document.write(`<!doctype html><html><head><title>Cancelled Flats</title><style>table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}thead{background:#dbeafe}</style></head><body>${tableHtml}</body></html>`); w.document.close(); w.focus(); w.print();
  };

  if (loading || !flatStatusData) {
    return <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center"><div className="flex items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div><p className="text-gray-600">Loading cancelled flats...</p></div></div>;
  }

  return (
    <>
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      {/* LEFT - Filters */}
      <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
        <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Cancelled Flats</h2>
          <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap:'clamp(0.5rem,0.75rem,1rem)' }}>
            {['month','block','refundedFlats','refundedCheques'].map(filter => {
              const isExpanded = expandedFilters.has(filter);
              const toggleExpanded = () => {
                setExpandedFilters(prev => { const o=prev.has(filter); if(o) return new Set(); return new Set([filter]); });
                if(filter!=='block'){ setSelectedBlock(null); }
                // Reset refunded flags when switching away
                if(filter !== 'refundedFlats') setOnlyRefundedFlats(false);
                if(filter !== 'refundedCheques') setOnlyRefundedCheques(false);
              };
              const label = filter==='month'?'Month Wise':filter==='block'?'Block Wise':filter==='refundedFlats'?'Refunded Flats':'Refunded Cheques';
              const showChevron = filter === 'month' || filter === 'block';
              return (
                <button key={filter} onClick={toggleExpanded} className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 ${isExpanded? 'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ height:'clamp(2.25rem,2.5rem,2.75rem)', paddingLeft:'clamp(0.875rem,1rem,1.25rem)', paddingRight: showChevron ? 'clamp(0.875rem,1rem,1.25rem)' : 'clamp(1rem,1.25rem,1.5rem)', whiteSpace:'nowrap', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>
                  <span>{label}</span>
                  {showChevron && (
                    <HiChevronDown className={`transition-transform ${isExpanded?'rotate-180':''}`} style={{ width:'1rem',height:'1rem' }} />
                  )}
                </button>
              );
            })}
            <button onClick={handleViewAll} className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 inline-flex items-center justify-center col-span-2 w-full text-center" style={{ height:'clamp(2.25rem,2.5rem,2.75rem)', paddingLeft:'clamp(0.875rem,1rem,1.25rem)', paddingRight:'clamp(0.875rem,1rem,1.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)', whiteSpace:'nowrap' }}>View All</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(1rem,1.5rem,2rem)' }}>
          {expandedFilters.has('month') && (
            <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
              <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>MONTH WISE</h3>
              <div style={{ marginTop:'clamp(0.5rem,0.75rem,1rem)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col min-w-0">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Select Year</label>
                    <select value={selectedYear||''} onChange={(e)=>setSelectedYear(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full">
                      <option value="" disabled>Select Year</option>
                      {years.map(y=>(<option key={y} value={y}>{y}</option>))}
                    </select>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="text-sm font-semibold text-gray-700 mb-1">Select Month</label>
                    <select value={selectedMonth||''} onChange={(e)=>setSelectedMonth(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full">
                      <option value="" disabled>Select Month</option>
                      {months.map(name=>(<option key={name} value={name}>{name}</option>))}
                    </select>
                  </div>
                  <div className="flex md:justify-start">
                    <button onClick={()=>{ setExpandedFilters(new Set()); setSelectedYear(null); setSelectedMonth(null); }} className="bg-sky-400 hover:bg-sky-500 text-white font-semibold rounded-md px-4 py-2">Check</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {expandedFilters.has('block') && (
            <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
              <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>BLOCK WISE</h3>
              <div className="relative flex items-center" style={{ marginTop:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                <button onClick={()=>{ if(blockScrollRef.current){ blockScrollRef.current.scrollBy({left:-200,behavior:'smooth'}); } }} className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronLeft style={{ width:'1rem',height:'1rem' }}/></button>
                <div ref={blockScrollRef} className="overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth:'none', msOverflowStyle:'none', marginLeft:'clamp(1.5rem,2rem,2.5rem)', marginRight:'clamp(1.5rem,2rem,2.5rem)' }}>
                  <div className="flex items-center w-max" style={{ gap:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                    {blockOptions.map(block=>(<button key={block} onClick={()=>setSelectedBlock(p=>p===block?null:block)} className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${selectedBlock===block?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ width:'clamp(2rem,2.5rem,3rem)', height:'clamp(1.75rem,2rem,2.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>{block}</button>))}
                  </div>
                </div>
                <button onClick={()=>{ if(blockScrollRef.current){ blockScrollRef.current.scrollBy({left:200,behavior:'smooth'}); } }} className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronRight style={{ width:'1rem',height:'1rem' }}/></button>
              </div>
            </div>
          )}
          {expandedFilters.has('refundedFlats') && (
            <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
              <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>REFUNDED FLATS</h3>
              <div className="mt-2"><button onClick={()=>{ setOnlyRefundedFlats(v=>!v); setExpandedFilters(new Set()); }} className={`px-4 py-2 rounded-md text-sm ${onlyRefundedFlats?'bg-gray-800 text-white':'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{onlyRefundedFlats?'Applied':'Apply Filter'}</button></div>
            </div>
          )}
          {expandedFilters.has('refundedCheques') && (
            <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
              <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>REFUNDED CHEQUES</h3>
              <div className="mt-2"><button onClick={()=>{ setOnlyRefundedCheques(v=>!v); setExpandedFilters(new Set()); }} className={`px-4 py-2 rounded-md text-sm ${onlyRefundedCheques?'bg-gray-800 text-white':'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{onlyRefundedCheques?'Applied':'Apply Filter'}</button></div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Table */}
      <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Cancelled Flats Detail</h2>
            <div className="ml-auto flex items-center gap-3">
              <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
                <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              </div>
              <div className="flex items-center gap-2 relative">
                <button onClick={handleCopy} aria-label="Copy" title="Copy" className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"><FiCopy size={14}/></button>
                {copied && (<span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">Copied</span>)}
                <button onClick={handleExportCSV} aria-label="Excel" title="Excel" className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 text-white"><FaFileExcel size={14}/></button>
                <button onClick={handleExportPDF} aria-label="PDF" title="PDF" className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white"><FaFilePdf size={14}/></button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
          <div className="min-w-[1100px]">
            <table ref={tableRef} className="w-full border-collapse text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-blue-200 text-gray-800">
                  {tableHeaders.map(h => (<th key={h} className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length>0 ? (
                  paginatedRows.map((r, idx) => (
                    <tr key={idx} className="bg-white even:bg-gray-50">
                      {mode === 'cancelled' ? (
                        <>
                          <td className="border border-gray-200 px-3 py-2">{(currentPage-1)*pageSize+idx+1}</td>
                          <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium"><button onClick={()=>handleFlatClick({ flatNo: r.flatNo })} className="hover:underline">{r.flatNo}</button></td>
                          <td className="border border-gray-200 px-3 py-2">{r.customerName}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.paidAmount}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.dealer}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.cancellationDate}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.remarks}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.status}</td>
                          <td className="border border-gray-200 px-3 py-2">
                            {refundedSet.has(r.flatNo) ? (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Refunded</span>
                            ) : (
                              <button onClick={()=>setRefundRow(r)} className="px-3 py-1 rounded border text-sm bg-[#ffd1d1]">Refund Amount</button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-200 px-3 py-2">{r.srNo || (currentPage-1)*pageSize+idx+1}</td>
                          <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium"><button onClick={()=>handleFlatClick({ flatNo: r.flatNo })} className="hover:underline">{r.flatNo}</button></td>
                          <td className="border border-gray-200 px-3 py-2">{r.clearedAmount}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.refundedAmount}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.refundedDate}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.chequeNo}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.chequeBank}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.chequeDate}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.chequeStatus}</td>
                          <td className="border border-gray-200 px-3 py-2">{r.remarks}</td>
                          <td className="border border-gray-200 px-3 py-2"><button onClick={()=>setEditContext({ mode, index:(currentPage-1)*pageSize+idx, row:r })} className="px-3 py-1 rounded border text-sm bg-white">Edit</button></td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom pagination with extra right padding to avoid chatbot */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {(currentPage-1)*pageSize+1} - {Math.min(currentPage*pageSize, rowsForMode.length)} of {rowsForMode.length}</div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page</label>
              <select value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))} className="border border-gray-300 rounded-md px-2 py-1 text-sm">{[10,20,50,100].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
              <div className="flex items-center gap-1 ml-2">
                <button onClick={()=>setCurrentPage(1)} disabled={currentPage===1} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1?'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="First">«</button>
                <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1?'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Previous">‹</button>
                <span className="text-sm text-gray-700 px-2">{currentPage} / {totalPages}</span>
                <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages?'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Next">›</button>
                <button onClick={()=>setCurrentPage(totalPages)} disabled={currentPage===totalPages} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages?'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Last">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {refundRow && (
      <RefundInlineForm row={refundRow} onClose={()=>setRefundRow(null)} onSuccess={(flatNo)=>{ setRefundedSet(prev=>{ const s=new Set(prev); s.add(flatNo); return s; }); setRefundRow(null); }} />
    )}
    {editContext && (
      <RefundChequeEditForm
        context={editContext}
        onClose={()=>setEditContext(null)}
        onSave={(updated)=>{
          if(editContext.mode==='refundedFlats'){
            setRefundedFlatsRows(prev=>{ const a=[...prev]; a[editContext.index] = { ...a[editContext.index], ...updated }; return a; });
          } else {
            setRefundedChequesRows(prev=>{ const a=[...prev]; a[editContext.index] = { ...a[editContext.index], ...updated }; return a; });
          }
          setEditContext(null);
        }}
      />
    )}
    </>
  );
};

export default CancelledFlats;

// Inline refund form component
const RefundInlineForm = ({ row, onClose, onSuccess }) => {
  const [mode, setMode] = useState('cheque'); // 'cheque' | 'cash' | 'neft'
  const [amount, setAmount] = useState(row?.paidAmount || '0');
  const [cancellationDate] = useState(row?.cancellationDate || '');
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [neftDate, setNeftDate] = useState('');
  const [refundDate, setRefundDate] = useState('');
  const [bank, setBank] = useState('HDFC');
  const [receiver, setReceiver] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      flatNo: row.flatNo,
      mode,
      amount,
      cancellationDate,
      chequeNo,
      chequeDate,
      neftDate,
      bank,
      refundDate,
      receiver,
      remarks,
    };
    console.log('Refund submit', payload);
    setSubmitted(true);
    if (onSuccess) onSuccess(row.flatNo);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[90%] max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Payment For Flat No. {row?.flatNo}</h3>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-800">
              <input type="radio" name="refundMode" checked={mode==='cheque'} onChange={()=>setMode('cheque')} disabled={submitted} />
              <span className={mode==='cheque' ? 'font-semibold' : ''}>Cheque Payment</span>
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input type="radio" name="refundMode" checked={mode==='cash'} onChange={()=>setMode('cash')} disabled={submitted} />
              <span className={mode==='cash' ? 'font-semibold' : ''}>Cash Payment</span>
            </label>
            <label className="flex items-center gap-2 text-gray-800">
              <input type="radio" name="refundMode" checked={mode==='neft'} onChange={()=>setMode('neft')} disabled={submitted} />
              <span className={mode==='neft' ? 'font-semibold' : ''}>Neft Payment</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pending Amount</label>
              <input readOnly value={row?.paidAmount || '0'} className="w-full border rounded px-3 py-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Amount</label>
              <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Cancellation Date</label>
              <input readOnly value={cancellationDate} className="w-full border rounded px-3 py-2 bg-gray-50" />
            </div>

            {mode==='cheque' && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cheque No.</label>
                  <input value={chequeNo} onChange={(e)=>setChequeNo(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cheque Date</label>
                  <input value={chequeDate} onChange={(e)=>setChequeDate(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Bank</label>
                  <select value={bank} onChange={(e)=>setBank(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted}>
                    {['HDFC','ICICI','SBI','PNB','FEDER'].map(b=>(<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
              </>
            )}

            {mode==='cash' && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Refund Date</label>
                  <input value={refundDate} onChange={(e)=>setRefundDate(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Receiver</label>
                  <input value={receiver} onChange={(e)=>setReceiver(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
              </>
            )}

            {mode==='neft' && (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">NEFT Date</label>
                  <input value={neftDate} onChange={(e)=>setNeftDate(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Bank</label>
                  <select value={bank} onChange={(e)=>setBank(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted}>
                    {['HDFC','ICICI','SBI','PNB','FEDER'].map(b=>(<option key={b} value={b}>{b}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Refund Date</label>
                  <input value={refundDate} onChange={(e)=>setRefundDate(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Remarks</label>
              <input value={remarks} onChange={(e)=>setRemarks(e.target.value)} className="w-full border rounded px-3 py-2" disabled={submitted} />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button type="submit" disabled={submitted} className={`px-4 py-2 rounded border text-sm ${submitted ? 'bg-green-600 text-white cursor-default' : 'bg-gray-800 text-white'}`}>{submitted ? 'Submitted' : 'Refund'}</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border bg-white text-gray-800 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Edit Cheque Details modal for refunded rows
const RefundChequeEditForm = ({ context, onClose, onSave }) => {
  const { row } = context;
  const [refundDate, setRefundDate] = useState(row.refundedDate || '');
  const [chequeNo, setChequeNo] = useState(row.chequeNo || '');
  const [bank, setBank] = useState(row.chequeBank || 'HDFC');
  const [chequeDate, setChequeDate] = useState(row.chequeDate || '');
  const [chequeStatus, setChequeStatus] = useState(row.chequeStatus || 'Cleared');
  const [clearingDate, setClearingDate] = useState(row.clearingDate || '');
  const [clearingBank, setClearingBank] = useState(row.clearingBank || 'SBI');

  const submit = (e) => {
    e.preventDefault();
    onSave({
      refundedDate: refundDate,
      chequeNo,
      chequeBank: bank,
      chequeDate,
      chequeStatus,
      clearingDate,
      clearingBank,
    });
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[95%] max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Cheque Details</h3>
        <form onSubmit={submit} className="overflow-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Flat No.</label>
              <input readOnly value={row.flatNo} className="w-full border rounded px-3 h-10 bg-gray-50 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Refund Date</label>
              <input value={refundDate} onChange={(e)=>setRefundDate(e.target.value)} className="w-full border rounded px-3 h-10 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Cheque No.</label>
              <input value={chequeNo} onChange={(e)=>setChequeNo(e.target.value)} className="w-full border rounded px-3 h-10 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Bank</label>
              <select value={bank} onChange={(e)=>setBank(e.target.value)} className="w-full border rounded px-3 h-10 text-sm">
                {['HDFC','ICICI','SBI','PNB','FEDER','SBP'].map(b=>(<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Cheque Date</label>
              <input value={chequeDate} onChange={(e)=>setChequeDate(e.target.value)} className="w-full border rounded px-3 h-10 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Cheque status</label>
              <select value={chequeStatus} onChange={(e)=>setChequeStatus(e.target.value)} className="w-full border rounded px-3 h-10 text-sm">
                {['Cleared','Pending','Bounced','Cancelled'].map(s=>(<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mt-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Clearing Date</label>
              <input value={clearingDate} onChange={(e)=>setClearingDate(e.target.value)} className="w-full border rounded px-3 h-10 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Clearing Bank</label>
              <select value={clearingBank} onChange={(e)=>setClearingBank(e.target.value)} className="w-full border rounded px-3 h-10 text-sm">
                {['SBI','HDFC','ICICI','PNB','FEDER','SBP'].map(b=>(<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div className="md:col-span-4 flex items-end gap-2">
              <button type="submit" className="px-4 h-10 rounded border bg-gray-800 text-white text-xs">Update</button>
              <button type="button" onClick={onClose} className="px-4 h-10 rounded border bg-white text-gray-800 text-xs">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


