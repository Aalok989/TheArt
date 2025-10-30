import React, { useMemo, useState } from 'react';

// Sample handover structure
const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    title: 'Main Door',
    subs: [
      'Main door frame & beeding',
      'Door shutter & frame polish',
      'Lock fixing',
      'Tower bolt fixing',
      'Stopper',
    ],
  },
  {
    id: 2,
    title: 'Drawing Room',
    subs: [
      'Upvc window fixing with mesh',
      'Grills fixing',
      'Electrical db door',
      'Communication box',
      'Electrical switches',
    ],
  },
];

const FlatHandover = () => {
  const [block, setBlock] = useState('');
  const [flat, setFlat] = useState('');

  // Build state map: key `${i}.${j}`
  const keys = useMemo(() => {
    const list = [];
    DEFAULT_ACTIVITIES.forEach((a, ai) => a.subs.forEach((_, si) => list.push(`${ai + 1}.${si + 1}`)));
    return list;
  }, []);

  const [status, setStatus] = useState({});
  const [date, setDate] = useState({});
  const [remarks, setRemarks] = useState({});

  const handleToggle = (k) => setStatus((s) => ({ ...s, [k]: !s[k] }));
  const handleDate = (k, v) => setDate((s) => ({ ...s, [k]: v }));
  const handleRemark = (k, v) => setRemarks((s) => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!block || !flat) { alert('Please select Block and Flat'); return; }
    const payload = { block, flat, status, date, remarks };
    console.log('Flat handover submit', payload);
    alert('Flat handover saved (mock).');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Flat Handover</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        {/* Block/Flat selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <select value={block} onChange={(e)=>{ setBlock(e.target.value); setFlat(''); }} className="w-full border rounded px-3 h-10">
            <option value="" disabled>Select Block</option>
            {['A','B','C','D'].map(b => (<option key={b} value={b}>{b}</option>))}
          </select>
          <select value={flat} onChange={(e)=>setFlat(e.target.value)} disabled={!block} className={`w-full border rounded px-3 h-10 ${!block?'bg-gray-100 cursor-not-allowed text-gray-500':''}`}>
            <option value="" disabled>{block ? 'Select Flat' : 'Select Block first'}</option>
            {Array.from({length:30},(_,i)=>String(i+1)).map(n => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>

        {block && flat ? (
        <form onSubmit={submit}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                <th className="border border-gray-300 px-3 py-2 text-left" style={{ width:'5%' }}>Sno</th>
                <th className="border border-gray-300 px-3 py-2 text-left" style={{ width:'35%' }}>Particulars</th>
                <th className="border border-gray-300 px-3 py-2 text-left" style={{ width:'10%' }}>Status</th>
                <th className="border border-gray-300 px-3 py-2 text-left" style={{ width:'15%' }}>Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {DEFAULT_ACTIVITIES.map((a, ai) => (
                <React.Fragment key={a.id}>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 font-semibold">{ai + 1}</td>
                    <td className="border border-gray-200 px-3 py-2 font-semibold" colSpan={4}>{a.title}</td>
                  </tr>
                  {a.subs.map((s, si) => {
                    const k = `${ai + 1}.${si + 1}`;
                    return (
                      <tr key={k}>
                        <td className="border border-gray-200 px-3 py-2">{k}</td>
                        <td className="border border-gray-200 px-3 py-2">{s}</td>
                        <td className="border border-gray-200 px-3 py-2">
                          <label className="inline-flex items-center gap-2">
                            <input type="checkbox" checked={!!status[k]} onChange={()=>handleToggle(k)} />
                            <span className="text-xs text-gray-700">Done</span>
                          </label>
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                          <input type="date" value={date[k]||''} onChange={(e)=>handleDate(k,e.target.value)} className="w-full border rounded px-3 h-9" />
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                          <input type="text" value={remarks[k]||''} onChange={(e)=>handleRemark(k,e.target.value)} placeholder="Remarks" className="w-full border rounded px-3 h-9" />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button type="submit" className="px-5 h-10 rounded bg-sky-400 hover:bg-sky-500 text-white">Save</button>
          </div>
        </form>
        ) : (
          <div className="mt-6 text-gray-600">Please select Block and Flat to view handover checklist.</div>
        )}
      </div>
    </div>
  );
};

export default FlatHandover;


