import React, { useMemo, useState } from 'react';

const ViewCustomization = ({ onPageChange }) => {
  const [rows, setRows] = useState([
    { id: 1, flatNo: 'A-101', taxAmount: '5000' },
    { id: 2, flatNo: 'B-202', taxAmount: '3500' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return rows;
    return rows.filter(r => [r.flatNo, r.taxAmount].some(v => String(v).toLowerCase().includes(q)));
  }, [rows, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>View Customization</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
          </div>
        </div>
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
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-6">No customizations found.</td>
              </tr>
            ) : (
              displayedRows.map((r, idx) => (
                <tr key={r.id} className="bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2">{idx + 1}</td>
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
    </div>
  );
};

export default ViewCustomization;


