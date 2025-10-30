import React, { useMemo, useState } from 'react';

const DEFAULT_ROWS = [
  { id: 1, flatNo: 'A-101' },
  { id: 2, flatNo: 'A-102' },
  { id: 3, flatNo: 'B-201' },
];

const ViewHandover = ({ onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return DEFAULT_ROWS;
    return DEFAULT_ROWS.filter(r => String(r.flatNo).toLowerCase().includes(q));
  }, [searchQuery]);

  const handleView = (flatNo) => {
    try {
      const m = String(flatNo).trim().match(/^([A-Za-z]+)[-\s]?([0-9]+)$/);
      const blk = m ? m[1].toUpperCase() : String(flatNo).trim().charAt(0).toUpperCase();
      const num = m ? m[2] : String(flatNo).trim().slice(1);
      const payload = JSON.stringify({ block: blk, flat: String(num) });
      sessionStorage.setItem('customizeTarget', payload);
      localStorage.setItem('customizeTarget', payload);
    } catch {}
    if (onPageChange) onPageChange('flatHandover');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>View Handover</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
            <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search flat no..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
          </div>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-gray-800">
              <th className="border border-gray-300 px-3 py-2 text-left">Sr No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Flat No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={3} className="text-center text-gray-500 py-6">No data found.</td></tr>
            ) : displayed.map((r, idx) => (
              <tr key={r.id} className="bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">{idx + 1}</td>
                <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">{r.flatNo}</td>
                <td className="border border-gray-200 px-3 py-2">
                  <button onClick={()=>handleView(r.flatNo)} className="px-3 py-1 rounded border bg-white">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewHandover;


