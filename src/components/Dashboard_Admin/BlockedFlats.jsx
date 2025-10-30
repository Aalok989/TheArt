import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { fetchFlatStatus, fetchBlockedFlatsDetails } from '../../api/mockData';

const BlockedFlats = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);

  const floorScrollRef = useRef(null);
  const blockScrollRef = useRef(null);
  const sizeScrollRef = useRef(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const [statusRes, detailRes] = await Promise.all([
          fetchFlatStatus(),
          fetchBlockedFlatsDetails(),
        ]);
        if (statusRes.success) setFlatStatusData(statusRes.data);
        if (detailRes.success) setDetails(detailRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      ref.current.scrollTo({
        left: direction === 'left' ? ref.current.scrollLeft - scrollAmount : ref.current.scrollLeft + scrollAmount,
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
    try { sessionStorage.setItem('selectedFlat', JSON.stringify(flat)); sessionStorage.setItem('flatOrigin','blockedFlats'); } catch {}
    if (onPageChange) onPageChange('flat');
  };

  const filteredFlatsData = useMemo(() => {
    if (!flatStatusData) return [];
    let filtered = flatStatusData.flats.filter(f => f.status === 'Blocked');
    if (selectedFloor !== null) filtered = filtered.filter(f => f.floor === selectedFloor);
    if (selectedBlock !== null) filtered = filtered.filter(f => f.block === selectedBlock);
    if (selectedSize !== null) filtered = filtered.filter(f => f.size === selectedSize);
    return filtered;
  }, [flatStatusData, selectedFloor, selectedBlock, selectedSize]);

  const headers = ['Sr. No.','Flat No.','Customer Name','Contact No.','Booking Date','Dealer','Action'];

  const mergedRows = useMemo(() => {
    return filteredFlatsData.map((flat, idx) => {
      const d = details.find(b => b.flatNo === flat.flatNo) || {};
      return {
        srno: String(idx + 1),
        flatNo: flat.flatNo,
        customerName: d.customerName || '-',
        contactNo: d.contactNo || '-',
        bookingDate: d.bookingDate || '-',
        dealer: d.dealer || 'GHPL',
      };
    });
  }, [filteredFlatsData, details]);

  const displayedRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return !q ? mergedRows : mergedRows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [mergedRows, searchQuery]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(displayedRows.length / pageSize)), [displayedRows.length, pageSize]);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, currentPage, pageSize]);
  useEffect(() => setCurrentPage(1), [searchQuery, pageSize, mergedRows.length]);

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayedRows.map(r => [r.srno, r.flatNo, r.customerName, r.contactNo, r.bookingDate, r.dealer, ''].join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(csv); setCopied(true); setTimeout(()=>setCopied(false),1500);} catch(e){ console.error(e); }
  };
  const handleExportCSV = () => {
    const csv = [headers.join(','), ...displayedRows.map(r => [r.srno, r.flatNo, r.customerName, r.contactNo, r.bookingDate, r.dealer, ''].map(val=>`"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='blocked-flats.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w=window.open('', '_blank'); if(!w) return; const tableHtml = tableRef.current?tableRef.current.outerHTML:''; w.document.write(`<!doctype html><html><head><title>Blocked Flats</title><style>table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}thead{background:#dbeafe}</style></head><body>${tableHtml}</body></html>`); w.document.close(); w.focus(); w.print();
  };

  const handleUnblock = (flatNo) => {
    alert(`Unblocked ${flatNo}`);
  };

  if (loading || !flatStatusData) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading blocked flats...</p>
        </div>
      </div>
    );
  }

  const { floors, blocks, sizes } = flatStatusData;

  return (
    <>
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT FILTERS - same behavior as Booked */}
        <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Blocked Flats</h2>
            <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              {['floor','block','size'].map(filter => {
                const isExpanded = expandedFilters.has(filter);
                const toggleExpanded = () => {
                  setExpandedFilters(prev => {
                    const open = prev.has(filter); if(open) return new Set();
                    setSelectedFloor(null); setSelectedBlock(null); setSelectedSize(null); setSelectedMonth(null); setSelectedYear(null);
                    return new Set([filter]);
                  });
                };
                return (
                  <button key={filter} onClick={toggleExpanded} className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 ${isExpanded? 'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ height:'clamp(2.25rem,2.5rem,2.75rem)', paddingLeft:'clamp(0.875rem,1rem,1.25rem)', paddingRight:'clamp(0.875rem,1rem,1.25rem)', whiteSpace:'nowrap', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>
                    <span>{filter==='floor'?'Floor Wise':filter==='block'?'Block Wise':'Size Wise'}</span>
                    <HiChevronDown className={`transition-transform ${isExpanded?'rotate-180':''}`} style={{ width:'1rem',height:'1rem' }} />
                  </button>
                );
              })}
              <button onClick={handleViewAll} className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 inline-flex items-center justify-center col-span-2 w-full text-center" style={{ height:'clamp(2.25rem,2.5rem,2.75rem)', paddingLeft:'clamp(0.875rem,1rem,1.25rem)', paddingRight:'clamp(0.875rem,1rem,1.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)', whiteSpace:'nowrap' }}>View All</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(1rem,1.5rem,2rem)' }}>
            {expandedFilters.has('floor') && (
              <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
                <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>FLOOR WISE</h3>
                <div className="relative flex items-center" style={{ marginTop:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                  <button onClick={()=>handleScroll(floorScrollRef,'left')} className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronLeft style={{ width:'1rem',height:'1rem' }}/></button>
                  <div ref={floorScrollRef} className="overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth:'none', msOverflowStyle:'none', marginLeft:'clamp(1.5rem,2rem,2.5rem)', marginRight:'clamp(1.5rem,2rem,2.5rem)' }}>
                    <div className="flex items-center w-max" style={{ gap:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                      {floors.map(floor => (
                        <button key={floor} onClick={()=>setSelectedFloor(p=>p===floor?null:floor)} className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${selectedFloor===floor?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ width:'clamp(2rem,2.5rem,3rem)', height:'clamp(1.75rem,2rem,2.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>{floor}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>handleScroll(floorScrollRef,'right')} className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronRight style={{ width:'1rem',height:'1rem' }}/></button>
                </div>
              </div>
            )}
            {expandedFilters.has('block') && (
              <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
                <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>BLOCK WISE</h3>
                <div className="relative flex items-center" style={{ marginTop:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                  <button onClick={()=>handleScroll(blockScrollRef,'left')} className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronLeft style={{ width:'1rem',height:'1rem' }}/></button>
                  <div ref={blockScrollRef} className="overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth:'none', msOverflowStyle:'none', marginLeft:'clamp(1.5rem,2rem,2.5rem)', marginRight:'clamp(1.5rem,2rem,2.5rem)' }}>
                    <div className="flex items-center w-max" style={{ gap:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                      {blocks.map(block => (
                        <button key={block} onClick={()=>setSelectedBlock(p=>p===block?null:block)} className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${selectedBlock===block?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ width:'clamp(2rem,2.5rem,3rem)', height:'clamp(1.75rem,2rem,2.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>{block}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>handleScroll(blockScrollRef,'right')} className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronRight style={{ width:'1rem',height:'1rem' }}/></button>
                </div>
              </div>
            )}
            {expandedFilters.has('size') && (
              <div style={{ marginBottom:'clamp(1.5rem,2rem,3rem)' }}>
                <h3 className="font-bold border-b" style={{ color:'#8C8C8C', fontSize:'clamp(0.625rem,0.75rem,0.875rem)', borderBottomColor:'#616161', borderBottomWidth:'0.1875rem', marginBottom:'clamp(0.75rem,1rem,1.25rem)', paddingBottom:'clamp(0.375rem,0.5rem,0.625rem)' }}>SIZE WISE</h3>
                <div className="relative flex items-center" style={{ marginTop:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                  <button onClick={()=>handleScroll(sizeScrollRef,'left')} className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronLeft style={{ width:'1rem',height:'1rem' }}/></button>
                  <div ref={sizeScrollRef} className="overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth:'none', msOverflowStyle:'none', marginLeft:'clamp(1.5rem,2rem,2.5rem)', marginRight:'clamp(1.5rem,2rem,2.5rem)' }}>
                    <div className="flex items-center w-max" style={{ gap:'clamp(0.375rem,0.5rem,0.625rem)' }}>
                      {sizes.map(size => (
                        <button key={size} onClick={()=>setSelectedSize(p=>p===size?null:size)} className={`rounded-md font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedSize===size?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ paddingLeft:'clamp(0.75rem,1rem,1.25rem)', paddingRight:'clamp(0.75rem,1rem,1.25rem)', height:'clamp(1.75rem,2rem,2.25rem)', fontSize:'clamp(0.65rem,0.75rem,0.875rem)' }}>{size}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>handleScroll(sizeScrollRef,'right')} className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200" style={{ width:'1.5rem',height:'1.5rem' }}><HiChevronRight style={{ width:'1rem',height:'1rem' }}/></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Header + Table */}
        <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Blocked Flats Detail</h2>
              <div className="ml-auto flex items-center gap-3">
                <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
                  <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button onClick={handleCopy} aria-label="Copy" title="Copy" className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"><FiCopy size={14}/></button>
                  {copied && (<span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">Copied</span>)}
                  <button onClick={handleExportCSV} aria-label="Export Excel" title="Export Excel" className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 text-white"><FaFileExcel size={14}/></button>
                  <button onClick={handleExportPDF} aria-label="Export PDF" title="Export PDF" className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white"><FaFilePdf size={14}/></button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
            <div className="min-w-[900px]">
              <table ref={tableRef} className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-blue-200 text-gray-800">
                    {headers.map(h => (<th key={h} className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length>0 ? (
                    paginatedRows.map((r, idx) => (
                      <tr key={idx} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2">{(currentPage-1)*pageSize+idx+1}</td>
                        <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium"><button onClick={()=>handleFlatClick({ flatNo: r.flatNo })} className="hover:underline">{r.flatNo}</button></td>
                        <td className="border border-gray-200 px-3 py-2">{r.customerName}</td>
                        <td className="border border-gray-200 px-3 py-2">{r.contactNo}</td>
                        <td className="border border-gray-200 px-3 py-2">{r.bookingDate}</td>
                        <td className="border border-gray-200 px-3 py-2">{r.dealer}</td>
                        <td className="border border-gray-200 px-3 py-2"><button onClick={()=>handleUnblock(r.flatNo)} className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100">Unblock</button></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={headers.length} className="text-center text-gray-500 py-8">No blocked flats found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Fixed-at-bottom pagination (outside scrollable area) */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {(currentPage-1)*pageSize+1} - {Math.min(currentPage*pageSize, displayedRows.length)} of {displayedRows.length}</div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows per page</label>
                <select value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))} className="border border-gray-300 rounded-md px-2 py-1 text-sm">{[10,20,50,100].map(s=>(<option key={s} value={s}>{s}</option>))}</select>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={()=>setCurrentPage(1)} disabled={currentPage===1} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="First">«</button>
                  <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Previous">‹</button>
                  <span className="text-sm text-gray-700 px-2">{currentPage} / {totalPages}</span>
                  <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Next">›</button>
                  <button onClick={()=>setCurrentPage(totalPages)} disabled={currentPage===totalPages} className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Last">»</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedFlats;


