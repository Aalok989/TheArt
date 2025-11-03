import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { fetchBBASigned } from '../../api/mockData';

const BBASigned = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [bbaSignedData, setBbaSignedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const getBBASigned = async () => {
      try {
        setLoading(true);
        const response = await fetchBBASigned();
        if (response.success) {
          setBbaSignedData(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching BBA signed:', error);
      } finally {
        setLoading(false);
      }
    };

    getBBASigned();
  }, []);

  // Filter data based on search term
  const displayedRows = useMemo(() => {
    let filtered = bbaSignedData || [];
    
    // Apply search filter
    const q = searchQuery.toLowerCase();
    if (q) {
      filtered = filtered.filter(item =>
        item.flatNo?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.contactNo?.includes(q)
      );
    }
    
    return filtered;
  }, [bbaSignedData, searchQuery]);

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

  const headers = [
    { key: 'srNo', label: 'Sr. No.' },
    { key: 'flatNo', label: 'Flat No.' },
    { key: 'name', label: 'Name' },
    { key: 'contactNo', label: 'Contact No.' }
  ];

  const handleCopy = async () => {
    const csv = [headers.map(h => h.label).join('\t'), ...displayedRows.map(r => [
      r.srNo || '', r.flatNo || '', r.name || '', r.contactNo || ''
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
    const csv = [headers.map(h => h.label).join(','), ...displayedRows.map(r => [
      r.srNo || '', r.flatNo || '', r.name || '', r.contactNo || ''
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bba-signed.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>BBA Signed</title>
      <style>
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#dbeafe}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const handleFlatClick = (flat) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo: flat.flatNo }));
    try { sessionStorage.setItem('flatOrigin', 'signedBBA'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };


  // Loading state
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
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>BBA Signed</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e)=>setSearchQuery(e.target.value)} 
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

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                {headers.map((header) => (
                  <th 
                    key={header.key}
                    className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center text-gray-500 py-6">
                    No data found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((item, idx) => (
                  <tr key={idx} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                      <button 
                        onClick={() => handleFlatClick(item)} 
                        className="hover:underline"
                      >
                        {item.flatNo}
                      </button>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">{item.name}</td>
                    <td className="border border-gray-200 px-3 py-2">{item.contactNo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

export default BBASigned;

