import React, { useState, useEffect, useMemo } from 'react';
import { fetchViewActivities } from '../../api/mockData';

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchViewActivities();
        if (response.success) {
          setActivities(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching view activities:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(activities.length / pageSize));
  }, [activities.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activities.slice(start, start + pageSize);
  }, [activities, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, activities.length]);

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
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-6">No activities found.</td>
                </tr>
              ) : (
                paginatedRows.map((a, idx) => (
                  <tr key={a.id} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
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
      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)', paddingLeft:'clamp(2rem,3rem,4rem)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, activities.length)} of {activities.length}
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

export default ViewActivities;


