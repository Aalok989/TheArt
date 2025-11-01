import React, { useMemo, useState, useEffect } from 'react';
import { fetchActivityToSubactivity } from '../../api/mockData';

const AddSubactivity = () => {
  const [activity, setActivity] = useState('');
  const [subactivity, setSubactivity] = useState('');
  const [error, setError] = useState('');
  const [activityToSubs, setActivityToSubs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchActivityToSubactivity();
        if (response.success) {
          setActivityToSubs(response.data || {});
        }
      } catch (error) {
        console.error('Error fetching activity to subactivity:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!activity) { setError('Please select activity'); return; }
    if (!subactivity) { setError('Please select subactivity'); return; }
    alert(`Subactivity added: ${activity} → ${subactivity}`);
    setActivity('');
    setSubactivity('');
    setError('');
  };

  const subOptions = activity ? (activityToSubs[activity] || []) : [];

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
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.75rem,1rem,1.25rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Flat Handover Subactivity</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="max-w-xl mx-auto bg-amber-50 border border-amber-200 rounded-xl shadow-sm" style={{ padding:'clamp(1rem,1.25rem,1.5rem)' }}>
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800" style={{ fontSize:'clamp(0.95rem,1.05rem,1.15rem)' }}>Add Subactivity</h3>
          </div>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <select value={activity} onChange={(e)=>{ setActivity(e.target.value); setSubactivity(''); }} className="w-full border border-gray-300 rounded-md px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="" disabled>Select Activity *</option>
              {Object.keys(activityToSubs).map(a => (<option key={a} value={a}>{a}</option>))}
            </select>
            <div className="flex items-center gap-2">
              <input
                value={subactivity}
                onChange={(e)=>setSubactivity(e.target.value)}
                disabled={!activity}
                placeholder={activity ? 'Enter Subactivity *' : 'Select Activity first'}
                className={`w-full border border-gray-300 rounded-md px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${!activity ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="px-4 h-9 rounded-md bg-sky-400 hover:bg-sky-500 text-white text-sm">Submit</button>
            </div>
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddSubactivity;


