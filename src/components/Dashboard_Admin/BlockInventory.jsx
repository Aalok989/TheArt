import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { fetchFlatStatus } from '../../api/mockData';

const BlockInventory = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryFlats, setInventoryFlats] = useState([]);
  const [copied, setCopied] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef(null);
  const floorScrollRef = useRef(null);
  const blockScrollRef = useRef(null);
  const sizeScrollRef = useRef(null);
  const [blockTarget, setBlockTarget] = useState(null); // flat object
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDealer, setFormDealer] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const statusRes = await fetchFlatStatus();
        if (statusRes.success) { setFlatStatusData(statusRes.data); setInventoryFlats(statusRes.data.flats || []); }
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleScroll = (ref, direction) => {
    if (!ref.current) return;
    const amount = 200;
    ref.current.scrollTo({ left: direction === 'left' ? ref.current.scrollLeft - amount : ref.current.scrollLeft + amount, behavior: 'smooth' });
  };

  const filteredFlats = useMemo(() => {
    if (!flatStatusData) return [];
    let rows = inventoryFlats || [];
    if (selectedFloor !== null) rows = rows.filter(f => f.floor === selectedFloor);
    if (selectedBlock !== null) rows = rows.filter(f => f.block === selectedBlock);
    if (selectedSize !== null) rows = rows.filter(f => f.size === selectedSize);
    const q = searchQuery.toLowerCase();
    if (q) rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    return rows;
  }, [flatStatusData, inventoryFlats, selectedFloor, selectedBlock, selectedSize, searchQuery]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredFlats.length / pageSize)), [filteredFlats.length, pageSize]);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFlats.slice(start, start + pageSize);
  }, [filteredFlats, currentPage, pageSize]);
  useEffect(() => setCurrentPage(1), [searchQuery, pageSize, selectedFloor, selectedBlock, selectedSize]);

  const headers = ['Sr. No.','Flat No.','Block','Floor','Size','Status'];

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...filteredFlats.map((r, idx) => [idx+1, r.flatNo, r.block, r.floor, r.size, r.status].join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(csv); setCopied(true); setTimeout(()=>setCopied(false),1500);} catch(e){ console.error(e); }
  };
  const handleExportCSV = () => {
    const csv = [headers.join(','), ...filteredFlats.map((r, idx) => [idx+1, r.flatNo, r.block, r.floor, r.size, r.status].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='block-inventory.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w=window.open('', '_blank'); if(!w) return; const tableHtml = tableRef.current?tableRef.current.outerHTML:''; w.document.write(`<!doctype html><html><head><title>Block Inventory</title><style>table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}thead{background:#dbeafe}</style></head><body>${tableHtml}</body></html>`); w.document.close(); w.focus(); w.print();
  };

  const handleFlatClick = (flatNo) => {
    try { sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo })); sessionStorage.setItem('flatOrigin','blockInventory'); } catch {}
    onPageChange && onPageChange('flat');
  };

  const statusColorClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'booked') return 'text-red-600';
    if (s === 'blocked') return 'text-amber-600';
    if (s === 'vacant') return 'text-green-600';
    if (s.includes('bba')) return 'text-blue-600';
    return 'text-gray-700';
  };

  const handleBlockFlat = (flatNo) => {
    const flat = (inventoryFlats || []).find(f=>f.flatNo===flatNo);
    setBlockTarget(flat || { flatNo });
    setFormName('');
    setFormPhone('');
    setFormDealer('');
  };

  const submitBlock = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formDealer.trim()) return;
    setInventoryFlats(prev => prev.map(f => f.flatNo === blockTarget.flatNo ? { ...f, status: 'Blocked', blockedBy: formName, blockedPhone: formPhone, dealerId: formDealer, blockedDate: new Date().toISOString().slice(0,10) } : f));
    setBlockTarget(null);
  };

  if (loading || !flatStatusData) {
    return <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center"><div className="flex items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div><p className="text-gray-600">Loading block inventory...</p></div></div>;
  }

  const { floors, blocks, sizes } = flatStatusData;

  return (
    <>
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      {/* LEFT FILTERS */}
      <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
        <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Block Inventory</h2>
          <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap:'clamp(0.5rem,0.75rem,1rem)' }}>
            {['floor','block','size'].map(filter => {
              const isExpanded = expandedFilters.has(filter);
              const toggle = () => {
                setExpandedFilters(prev => {
                  const willOpen = !prev.has(filter);
                  const next = willOpen ? new Set([filter]) : new Set();
                  if (filter === 'block') {
                    setSelectedFloor(null);
                  }
                  return next;
                });
              };
              const label = filter==='floor'?'Floor Wise':filter==='block'?'Block Wise':'Size Wise';
              return (
                <button key={filter} onClick={toggle} className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 ${isExpanded?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} style={{ height:'clamp(2.25rem,2.5rem,2.75rem)', paddingLeft:'clamp(0.875rem,1rem,1.25rem)', paddingRight:'clamp(0.875rem,1rem,1.25rem)', whiteSpace:'nowrap', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}>
                  <span>{label}</span>
                  <HiChevronDown className={`transition-transform ${isExpanded?'rotate-180':''}`} style={{ width:'1rem',height:'1rem' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections */}
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
                      <button
                        key={block}
                        onClick={()=>{ setSelectedBlock(p=>p===block?null:block); setSelectedFloor(null);} }
                        className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${selectedBlock===block?'bg-gray-800 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        style={{ width:'clamp(2rem,2.5rem,3rem)', height:'clamp(1.75rem,2rem,2.25rem)', fontSize:'clamp(0.75rem,0.875rem,1rem)' }}
                      >{block}</button>
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
            <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Block Inventory Detail</h2>
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
                      <td className={`border border-gray-200 px-3 py-2 font-medium ${statusColorClass(r.status)}`}>
                        {String(r.status).toLowerCase()==='vacant' ? (
                          <button onClick={()=>handleBlockFlat(r.flatNo)} className="hover:underline">{r.flatNo}</button>
                        ) : (
                          <span>{r.flatNo}</span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-2">{r.block}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.floor}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.size}</td>
                      <td className="border border-gray-200 px-3 py-2">{r.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={headers.length} className="text-center text-gray-500 py-8">No data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)' }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">Showing {(currentPage-1)*pageSize+1} - {Math.min(currentPage*pageSize, filteredFlats.length)} of {filteredFlats.length}</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-red-700"></span><span className="text-sm text-gray-700">Booked Flat</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-amber-500"></span><span className="text-sm text-gray-700">Blocked Flat</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-green-600"></span><span className="text-sm text-gray-700">Vacant Flat</span></div>
                <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-blue-600"></span><span className="text-sm text-gray-700">BBA Signed</span></div>
              </div>
            </div>
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
    {blockTarget && (
      <div className="fixed inset-0 z-[100]">
        <div className="absolute inset-0 bg-black/50" onClick={()=>setBlockTarget(null)}></div>
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-[92%] max-w-md bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <h3 className="text-center font-bold text-blue-700 mb-1" style={{ fontSize:'clamp(0.95rem,1.05rem,1.15rem)' }}>Block Inventory Form For Flat No. {blockTarget?.flatNo}</h3>
          <h4 className="text-center text-gray-800 mb-3" style={{ fontSize:'clamp(0.85rem,0.95rem,1.05rem)' }}>User Details</h4>
          <form onSubmit={submitBlock} className="grid grid-cols-1 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
              <input value={formName} onChange={e=>setFormName(e.target.value)} className="w-full border rounded px-3 h-9" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
              <input value={formPhone} onChange={e=>setFormPhone(e.target.value)} className="w-full border rounded px-3 h-9" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Dealer ID<span className="text-red-500">*</span></label>
              <select value={formDealer} onChange={e=>setFormDealer(e.target.value)} className="w-full border rounded px-3 h-9">
                <option value="" disabled>Select Dealer</option>
                {['D001','D002','D003','D004'].map(id=>(<option key={id} value={id}>{id}</option>))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Date</label>
              <input readOnly value={new Date().toISOString().slice(0,10)} className="w-full border rounded px-3 h-9 bg-gray-50" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 mt-1">
              <button type="submit" className="px-3 py-2 rounded border bg-gray-800 text-white text-xs">Block</button>
              <button type="button" className="px-3 py-2 rounded border bg-white text-gray-800 text-xs" onClick={()=>setBlockTarget(null)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default BlockInventory;


