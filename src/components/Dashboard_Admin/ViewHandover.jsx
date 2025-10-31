import React, { useMemo, useState } from 'react';

const DEFAULT_ROWS = [
  { id: 1, flatNo: 'A-101' },
  { id: 2, flatNo: 'A-102' },
  { id: 3, flatNo: 'B-201' },
];

const ViewHandover = ({ onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlat, setSelectedFlat] = useState(null);
  
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return DEFAULT_ROWS;
    return DEFAULT_ROWS.filter(r => String(r.flatNo).toLowerCase().includes(q));
  }, [searchQuery]);

  const handleView = (flatNo) => {
    setSelectedFlat(flatNo);
  };

  const handleCloseTemplate = () => {
    setSelectedFlat(null);
  };

  return (
    <>
      {selectedFlat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Handover Template - {selectedFlat}</h3>
              <button 
                onClick={handleCloseTemplate}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              {/* Template will be implemented here later */}
              <p className="text-gray-500">Template for {selectedFlat} will be displayed here.</p>
            </div>
          </div>
        </div>
      )}
      
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
                    <button onClick={()=>handleView(r.flatNo)} className="px-3 py-1 rounded border bg-white hover:bg-gray-100">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewHandover;


