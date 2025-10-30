import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { fetchFlatStatus, fetchBookedFlatsDetails } from '../../api/mockData';

const FlatVerification = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [details, setDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [verifiedSet, setVerifiedSet] = useState(new Set());
  const [verifyTarget, setVerifyTarget] = useState(null); // flatNo
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statusRes, bookedRes] = await Promise.all([
          fetchFlatStatus(),
          fetchBookedFlatsDetails(),
        ]);
        if (statusRes.success) setFlatStatusData(statusRes.data);
        if (bookedRes.success) setDetails(bookedRes.data || []);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const rows = useMemo(() => {
    if (!flatStatusData) return [];
    const flats = flatStatusData.flats || [];
    return flats.map((f, idx) => {
      const d = details.find(b => b.flatNo === f.flatNo) || {};
      return {
        sr: idx + 1,
        flatNo: f.flatNo,
        name: d.customerName || '-',
        contactNo: d.contactNo || '-',
        email: d.email || '-',
        remarks: d.remarks || '',
        status: verifiedSet.has(f.flatNo) ? 'Verified' : 'Pending',
      };
    });
  }, [flatStatusData, details, verifiedSet]);

  const displayedRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return rows;
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [rows, searchQuery]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(displayedRows.length / pageSize)), [displayedRows.length, pageSize]);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedRows.slice(start, start + pageSize);
  }, [displayedRows, currentPage, pageSize]);
  useEffect(() => setCurrentPage(1), [searchQuery, pageSize, rows.length]);

  const handleCopy = async () => {
    const headers = ['Sr.No.','Flat No','Name','Contact No','Email','Remarks','Status'];
    const csv = [headers.join('\t'), ...displayedRows.map(r => [r.sr, r.flatNo, r.name, r.contactNo, r.email, r.remarks, r.status].join('\t'))].join('\n');
    try { await navigator.clipboard.writeText(csv); setCopied(true); setTimeout(()=>setCopied(false),1500);} catch(e){ console.error(e); }
  };
  const handleExportCSV = () => {
    const headers = ['Sr.No.','Flat No','Name','Contact No','Email','Remarks','Status'];
    const csv = [headers.join(','), ...displayedRows.map(r => [r.sr, r.flatNo, r.name, r.contactNo, r.email, r.remarks, r.status].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='flat-verification.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
  const handleExportPDF = () => {
    const w=window.open('', '_blank'); if(!w) return; const tableHtml = tableRef.current?tableRef.current.outerHTML:''; w.document.write(`<!doctype html><html><head><title>Flat Verification</title><style>table{width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px}th,td{border:1px solid #ccc;padding:6px;text-align:left}thead{background:#dbeafe}</style></head><body>${tableHtml}</body></html>`); w.document.close(); w.focus(); w.print();
  };

  const handleFlatClick = (flatNo) => {
    try { sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo })); sessionStorage.setItem('flatOrigin','flatVerification'); } catch {}
    onPageChange && onPageChange('flat');
  };

  const toggleVerify = (flatNo) => {
    setVerifiedSet(prev => { const s = new Set(prev); if (s.has(flatNo)) s.delete(flatNo); else s.add(flatNo); return s; });
  };

  const openVerifyModal = (flatNo) => {
    setVerifyTarget(flatNo);
    setVerifyRemarks('');
  };

  const submitVerify = (e) => {
    e.preventDefault();
    if (verifyTarget) {
      setVerifiedSet(prev => { const s = new Set(prev); s.add(verifyTarget); return s; });
      // In real app, send remarks: verifyRemarks
      setVerifyTarget(null);
      setVerifyRemarks('');
    }
  };

  if (loading || !flatStatusData) {
    return <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center"><div className="flex items-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div><p className="text-gray-600">Loading verification list...</p></div></div>;
  }

  const headers = ['Sr. No.','Flat No','Name','Contact No','Email','Remarks','Status'];

  return (
    <>
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Verification Status</h2>
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
        <div className="min-w-[1000px]">
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
                    <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium"><button onClick={()=>handleFlatClick(r.flatNo)} className="hover:underline">{r.flatNo}</button></td>
                    <td className="border border-gray-200 px-3 py-2">{r.name}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.contactNo}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.email}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.remarks}</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {verifiedSet.has(r.flatNo) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">Verified</span>
                      ) : (
                        <button onClick={()=>openVerifyModal(r.flatNo)} className="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100">Verify</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={headers.length} className="text-center text-gray-500 py-8">No data found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)', paddingLeft:'clamp(3rem,4rem,5rem)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {(currentPage-1)*pageSize+1} - {Math.min(currentPage*pageSize, displayedRows.length)} of {displayedRows.length}</div>
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
      {verifyTarget && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setVerifyTarget(null)}></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[90%] max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
            <h3 className="text-center font-bold text-gray-800 mb-4" style={{ fontSize:'clamp(1rem,1.125rem,1.25rem)' }}>Add Remarks</h3>
            <form onSubmit={submitVerify}>
              <textarea value={verifyRemarks} onChange={(e)=>setVerifyRemarks(e.target.value)} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ minHeight:'10rem' }} placeholder="Enter verification remarks (optional)" />
              <div className="flex items-center justify-center gap-3 mt-4">
                <button type="button" onClick={()=>setVerifyTarget(null)} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FlatVerification;


