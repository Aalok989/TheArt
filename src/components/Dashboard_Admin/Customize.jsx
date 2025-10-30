import React, { useEffect, useMemo, useState } from 'react';

const Customize = () => {
  const initialTarget = (() => {
    try {
      // URL query params take precedence if present
      const params = new URLSearchParams(window.location.search);
      const qb = params.get('block');
      const qf = params.get('flat');
      if (qb || qf) {
        return {
          block: String(qb || '').trim().toUpperCase(),
          flat: String(qf || '').trim(),
          locked: true,
          hadPayload: true,
        };
      }

      let payload = sessionStorage.getItem('customizeTarget');
      if (!payload) payload = localStorage.getItem('customizeTarget');
      if (payload) {
        const { block: b, flat: f } = JSON.parse(payload);
        return {
          block: String(b || '').trim().toUpperCase(),
          flat: String(f || '').trim(),
          locked: true,
          hadPayload: true,
        };
      }
    } catch {}
    return { block: '', flat: '', locked: false, hadPayload: false };
  })();

  const [block, setBlock] = useState(initialTarget.block);
  const [flat, setFlat] = useState(initialTarget.flat);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [uom, setUom] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [rows, setRows] = useState([]);
  const [locked, setLocked] = useState(initialTarget.locked); // when navigated from ViewCustomization

  const amount = useMemo(() => {
    const q = Number(qty || 0);
    const r = Number(rate || 0);
    return (q * r).toFixed(2);
  }, [qty, rate]);

  const addRow = () => {
    if (!type || !description || !qty || !rate || !uom) return;
    setRows(prev => [
      ...prev,
      { id: Date.now(), type, description, qty, rate, uom, requestDate, completionDate, amount }
    ]);
    setType(''); setDescription(''); setQty(''); setRate(''); setUom(''); setRequestDate(''); setCompletionDate('');
  };

  useEffect(() => {
    if (initialTarget.hadPayload) {
      sessionStorage.removeItem('customizeTarget');
      localStorage.removeItem('customizeTarget');
    }
  }, [initialTarget.hadPayload]);

  const submit = (e) => {
    e.preventDefault();
    // Mock submit
    if (!block || !flat) { alert('Please select Block and Flat'); return; }
    console.log('Customization submit', { block, flat, rows, taxAmount });
    alert('Customization saved (mock).');
    setRows([]); setTaxAmount('');
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius:'clamp(1rem,1.5rem,2rem)' }}>
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Add Customization</h2>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ padding:'clamp(1rem,1.5rem,2rem)' }}>
        {/* Top selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select value={block} onChange={(e)=>{ setBlock(e.target.value); setFlat(''); }} disabled={locked} className={`w-full border rounded px-3 h-10 ${locked?'bg-gray-100 cursor-not-allowed text-gray-500':''}`}>
            <option value="" disabled>Select Block</option>
            {['A','B','C','D'].map(b=> (<option key={b} value={b}>{b}</option>))}
          </select>
          <select value={flat} onChange={(e)=>setFlat(e.target.value)} disabled={locked || !block} className={`w-full border rounded px-3 h-10 ${(locked || !block)?'bg-gray-100 cursor-not-allowed text-gray-500':''}`}>
            <option value="" disabled>{block ? 'Select Flat' : 'Select Block first'}</option>
            {Array.from({length:300},(_,i)=>String(i+1)).map(n=> (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>

        {/* Form row */}
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-3 items-end">
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Customization Type</label>
              <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border rounded px-3 h-10">
                <option value="">Please Select Type</option>
                {['Flooring','Painting','Plumbing','Electrical','Other'].map(t=>(<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-700 mb-1">Description</label>
              <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Quantity</label>
              <input value={qty} onChange={(e)=>setQty(e.target.value)} placeholder="Quantity" className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Rate</label>
              <input value={rate} onChange={(e)=>setRate(e.target.value)} placeholder="Rate" className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">UOM</label>
              <input value={uom} onChange={(e)=>setUom(e.target.value)} placeholder="UOM" className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Request Date</label>
              <input type="date" value={requestDate} onChange={(e)=>setRequestDate(e.target.value)} className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs text-gray-700 mb-1">Completion Date</label>
              <input type="date" value={completionDate} onChange={(e)=>setCompletionDate(e.target.value)} className="w-full border rounded px-3 h-10" />
            </div>
            <div className="lg:col-span-1 flex lg:justify-start">
              <button type="button" onClick={addRow} className="px-4 h-10 inline-flex items-center justify-center rounded bg-emerald-500 hover:bg-emerald-600 text-white text-sm">Add</button>
            </div>
          </div>

          {/* Rows table */}
          <div className="mt-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-200 text-gray-800">
                  {['Type','Description','Qty','Rate','UOM','Request Date','Completion Date','Amount','Action'].map(h=> (
                    <th key={h} className="border border-gray-300 px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length===0 ? (
                  <tr><td colSpan={9} className="text-center text-gray-500 py-6">No customization items added.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">{r.type}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.description}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.qty}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.rate}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.uom}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.requestDate || '-'}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.completionDate || '-'}</td>
                    <td className="border border-gray-200 px-3 py-2">{r.amount}</td>
                    <td className="border border-gray-200 px-3 py-2">
                      <button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))} className="px-3 py-1 rounded border bg-white text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 items-center">
            <div className="md:col-span-1 flex items-center gap-2">
              <input value={taxAmount} onChange={(e)=>setTaxAmount(e.target.value)} placeholder="Tax Amount" className="border rounded px-3 h-10 w-40 md:w-56" />
              <button type="submit" className="px-5 h-10 rounded bg-sky-400 hover:bg-sky-500 text-white">submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Customize;


