import React, { useMemo, useState } from 'react';

const DEFAULT_ROWS = [
  { id: 1, activity: 'Main Door', subs: ['Main door frame & beeding', 'Door shutter & frame polish', 'Lock fixing', 'Tower bolt fixing', 'Stopper'] },
  { id: 2, activity: 'Drawing Room', subs: ['Upvc window fixing with mesh', 'Grills fixing', 'Electrical DB door', 'Communication box', 'Electrical switches', 'Paint', 'Flooring & skirting'] },
  { id: 3, activity: 'Dining', subs: ['Sliding door', 'Flooring & skirting', 'Electrical switches', 'Half wash basin with fittings', 'Paint'] },
];

const ViewActivity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const rows = DEFAULT_ROWS;
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return rows;
    return rows.filter(r => [r.activity, r.subs.join(', ')].some(v => String(v).toLowerCase().includes(q)));
  }, [rows, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>View Flat Handover Activity</h2>
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
              <th className="border border-gray-300 px-3 py-2 text-left">S.N.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Activity</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Subactivities</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={3} className="text-center text-gray-500 py-6">No activities found.</td></tr>
            ) : displayed.map((r, idx) => (
              <tr key={r.id} className="bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">{idx + 1}</td>
                <td className="border border-gray-200 px-3 py-2 whitespace-nowrap">{r.activity}</td>
                <td className="border border-gray-200 px-3 py-2">{r.subs.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewActivity;


