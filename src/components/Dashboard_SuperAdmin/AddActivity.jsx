import React, { useState } from 'react';

const AddActivity = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Activity name is required'); return; }
    alert(`Flat handover activity added: ${name}`);
    setName('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Flat Handover Activity</h2>
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
      </div>
    </div>
  );
};

export default AddActivity;


