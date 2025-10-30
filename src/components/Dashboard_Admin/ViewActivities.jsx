import React, { useState } from 'react';

const ViewActivities = () => {
  const [activities, setActivities] = useState([
    { id: 1, name: 'Flooring' },
    { id: 2, name: 'Painting' },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Customization Activities</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="mt-0">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                <th className="border border-gray-300 px-3 py-2 text-left">S.No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Activity</th>
                <th className="border border-gray-300 px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-6">No activities found.</td>
                </tr>
              ) : (
                activities.map((a, idx) => (
                  <tr key={a.id} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">{idx + 1}</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {editingId === a.id ? (
                        <input value={editingName} onChange={(e)=>setEditingName(e.target.value)} className="w-full border rounded px-2 py-1" />
                      ) : (
                        a.name
                      )}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-right">
                      {editingId === a.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button onClick={()=>{ if(editingName.trim()){ setActivities(prev=>prev.map(x=>x.id===a.id?{...x,name:editingName.trim()}:x)); setEditingId(null); setEditingName(''); } }} className="px-3 py-1 rounded border bg-green-600 text-white">Save</button>
                          <button onClick={()=>{ setEditingId(null); setEditingName(''); }} className="px-3 py-1 rounded border bg-white text-gray-800">Cancel</button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button onClick={()=>{ setEditingId(a.id); setEditingName(a.name); }} className="px-3 py-1 rounded border bg-white">Edit</button>
                          <button onClick={()=>setActivities(prev=>prev.filter(x=>x.id!==a.id))} className="px-3 py-1 rounded border bg-white text-red-600">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewActivities;


