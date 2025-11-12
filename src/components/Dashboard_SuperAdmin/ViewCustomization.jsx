import React, { useMemo, useState, useEffect } from 'react';
import { fetchViewCustomization } from '../../api/mockData';

const ViewCustomization = ({ onPageChange }) => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchViewCustomization();
        if (response.success) {
          setRows(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching view customization:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayedRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return rows;
    return rows.filter(r => [r.flatNo, r.taxAmount].some(v => String(v).toLowerCase().includes(q)));
  }, [rows, searchQuery]);

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
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>View Customization</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-gray-800">
              <th className="border border-gray-300 px-3 py-2 text-left">S.No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Flat No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Tax Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">No customizations found.</td>
              </tr>
            ) : (
              paginatedRows.map((r, idx) => (
                <tr key={r.id} className="bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2">{r.flatNo}</td>
                  <td className="border border-gray-200 px-3 py-2">{r.taxAmount}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button onClick={()=>{ try { const m = String(r.flatNo).trim().match(/^([A-Za-z]+)[-\s]?([0-9]+)$/); const blk = m ? m[1].toUpperCase() : String(r.flatNo).trim().charAt(0).toUpperCase(); const num = m ? m[2] : String(r.flatNo).trim().slice(1); const payload = JSON.stringify({ block: blk, flat: String(num) }); sessionStorage.setItem('customizeTarget', payload); localStorage.setItem('customizeTarget', payload); const url = '/dashboard/customize'; if (typeof window !== 'undefined' && window.location) { window.location.assign(url); return; } } catch {} onPageChange && onPageChange('customize'); }} className="px-3 py-1 rounded border bg-white">Edit</button>
                      <button className="px-3 py-1 rounded border bg-white">View</button>
                      <button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))} className="px-3 py-1 rounded border bg-white text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)', paddingLeft:'clamp(2rem,3rem,4rem)' }}>
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
  );
};

export default ViewCustomization;


