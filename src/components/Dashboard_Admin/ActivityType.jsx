import React, { useState } from 'react';

const ActivityType = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [activities, setActivities] = useState([]); // {id, name}
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Activity name is required'); return; }
    setActivities(prev => [...prev, { id: Date.now(), name: name.trim() }]);
    setName('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Activity Type</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl shadow-sm" style={{ padding:'clamp(1rem,1.25rem,1.5rem)' }}>
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800" style={{ fontSize:'clamp(0.95rem,1.05rem,1.15rem)' }}>Add Activity</h3>
          </div>
          <form onSubmit={submit} className="flex items-center gap-3">
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Activity Name *"
              className="flex-1 border border-gray-300 rounded-md px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button type="submit" className="px-4 h-9 rounded-md bg-sky-400 hover:bg-sky-500 text-white text-sm">Submit</button>
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Activities Table */}
        <div className="mt-6">
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
                  <td colSpan={3} className="text-center text-gray-500 py-6">No activities added yet.</td>
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

export default ActivityType;


