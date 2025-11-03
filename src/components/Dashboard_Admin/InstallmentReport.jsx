import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { IoPrint } from 'react-icons/io5';

const InstallmentReport = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // All table headers
  const headers = [
    'Sr.No.', 'Flat No.', 'Tower', 'App No.', 'Floor', 'Customer', 'Contact No.', 'Email', 'Address', 
    'Payment Plan', 'Loan Bank', 'Flat Cost', 
    'Inst-1', 'TAX-1', 'Inst-2', 'TAX-2', 'Inst-3', 'TAX-3', 'Inst-4', 'TAX-4',
    'Inst-5', 'TAX-5', 'Inst-6', 'TAX-6', 'Inst-7', 'TAX-7', 'Inst-8', 'TAX-8', 
    'Inst-9', 'TAX-9', 'Inst-10', 'TAX-10', 'Inst-11', 'TAX-11', 'Inst-12', 'TAX-12',
    'Inst-13', 'TAX-13', 'Inst-14', 'TAX-14',
    'Total Inst', 'Total S.T.', 'Total Due', 'Paid Inst', 'Paid S.T.', 'Total Paid'
  ];

  // Fetch data on component mount
  useEffect(() => {
    const getInstallmentReport = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = [
          {
            srNo: 1,
            flatNo: 'A1',
            tower: 'A',
            appNo: '1',
            floor: 'Ground',
            customer: 'V.REVATHI',
            contactNo: '9966801523',
            email: 'vure.rama.mohan.rao@gmail.com',
            address: 'Flat No-16-104 Near Saibaba Temple, Huzusnagar, at Suryapet.',
            paymentPlan: 'CLP',
            loanBank: 'self',
            flatCost: 8396700,
            inst1: 805020, tax1: 40251,
            inst2: 1610040, tax2: 80502,
            inst3: 1207530, tax3: 60377,
            inst4: 2012550, tax4: 100628,
            inst5: 402510, tax5: 20126,
            inst6: 138600, tax6: 0,
            inst7: 0, tax7: 0,
            inst8: 0, tax8: 0,
            inst9: 0, tax9: 0,
            inst10: 0, tax10: 0,
            inst11: 0, tax11: 0,
            inst12: 0, tax12: 0,
            inst13: 0, tax13: 0,
            inst14: 0, tax14: 0,
            totalInst: 6176250,
            totalST: 301884,
            totalDue: 6478134,
            paidInst: 8219625,
            paidST: 0,
            totalPaid: 8219625
          },
          {
            srNo: 2,
            flatNo: 'A10',
            tower: 'A',
            appNo: '10',
            floor: 'Ground',
            customer: 'Mukul Sagar',
            contactNo: '9467676327',
            email: 'ph23m006@smail.iitm.ac.in',
            address: '141, Ganga IIT Madras',
            paymentPlan: 'CLP',
            loanBank: 'self',
            flatCost: 6140000,
            inst1: 614000, tax1: 30700,
            inst2: 1228000, tax2: 61400,
            inst3: 921000, tax3: 46050,
            inst4: 1535000, tax4: 76750,
            inst5: 307000, tax5: 15350,
            inst6: 0, tax6: 0,
            inst7: 0, tax7: 0,
            inst8: 0, tax8: 0,
            inst9: 0, tax9: 0,
            inst10: 0, tax10: 0,
            inst11: 0, tax11: 0,
            inst12: 0, tax12: 0,
            inst13: 0, tax13: 0,
            inst14: 0, tax14: 0,
            totalInst: 4605000,
            totalST: 230250,
            totalDue: 4835250,
            paidInst: 0,
            paidST: 0,
            totalPaid: 0
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setReportData(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching installment report:', error);
        setLoading(false);
      }
    };

    getInstallmentReport();
  }, []);

  // Filter data based on search term
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return reportData;
    return reportData.filter(item =>
      item.flatNo.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.contactNo.includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  }, [reportData, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(displayed.length / pageSize));
  }, [displayed.length, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayed.slice(start, start + pageSize);
  }, [displayed, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, displayed.length]);

  const handleFlatClick = (flat) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify({ flatNo: flat.flatNo }));
    try { sessionStorage.setItem('flatOrigin', 'installmentReport'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayed.map(r => [
      r.srNo || '', r.flatNo || '', r.tower || '', r.appNo || '', r.floor || '', 
      r.customer || '', r.contactNo || '', r.email || '', r.address || '', 
      r.paymentPlan || '', r.loanBank || '', r.flatCost || '',
      r.inst1 || 0, r.tax1 || 0, r.inst2 || 0, r.tax2 || 0,
      r.inst3 || 0, r.tax3 || 0, r.inst4 || 0, r.tax4 || 0,
      r.inst5 || 0, r.tax5 || 0, r.inst6 || 0, r.tax6 || 0,
      r.inst7 || 0, r.tax7 || 0, r.inst8 || 0, r.tax8 || 0,
      r.inst9 || 0, r.tax9 || 0, r.inst10 || 0, r.tax10 || 0,
      r.inst11 || 0, r.tax11 || 0, r.inst12 || 0, r.tax12 || 0,
      r.inst13 || 0, r.tax13 || 0, r.inst14 || 0, r.tax14 || 0,
      r.totalInst || 0, r.totalST || 0, r.totalDue || 0,
      r.paidInst || 0, r.paidST || 0, r.totalPaid || 0
    ].join('\t'))].join('\n');
    try {
      await navigator.clipboard.writeText(csv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleExportCSV = () => {
    const csv = [headers.join(','), ...displayed.map(r => [
      r.srNo || '', r.flatNo || '', r.tower || '', r.appNo || '', r.floor || '', 
      r.customer || '', r.contactNo || '', r.email || '', r.address || '', 
      r.paymentPlan || '', r.loanBank || '', r.flatCost || '',
      r.inst1 || 0, r.tax1 || 0, r.inst2 || 0, r.tax2 || 0,
      r.inst3 || 0, r.tax3 || 0, r.inst4 || 0, r.tax4 || 0,
      r.inst5 || 0, r.tax5 || 0, r.inst6 || 0, r.tax6 || 0,
      r.inst7 || 0, r.tax7 || 0, r.inst8 || 0, r.tax8 || 0,
      r.inst9 || 0, r.tax9 || 0, r.inst10 || 0, r.tax10 || 0,
      r.inst11 || 0, r.tax11 || 0, r.inst12 || 0, r.tax12 || 0,
      r.inst13 || 0, r.tax13 || 0, r.inst14 || 0, r.tax14 || 0,
      r.totalInst || 0, r.totalST || 0, r.totalDue || 0,
      r.paidInst || 0, r.paidST || 0, r.totalPaid || 0
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'installment_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>Installment Report</title>
      <style>
        @page { size: A4 landscape; margin: 1cm; }
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:10px}
        th,td{border:1px solid #ccc;padding:4px;text-align:left}
        thead{background:#bfdbfe}
        th{font-weight:bold}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.print();
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading state
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
      <div className="flex-shrink-0" style={{ padding:'clamp(1rem,1.5rem,2rem)', paddingBottom:'clamp(0.5rem,0.75rem,1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>Installment Report</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <div className="flex items-center gap-2 relative">
              <button onClick={handleCopy} aria-label="Copy" title="Copy"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800">
                <FiCopy size={14} />
              </button>
              {copied && (
                <span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">Copied</span>
              )}
              <button onClick={handleExportCSV} aria-label="Export Excel" title="Export Excel"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 text-white">
                <FaFileExcel size={14} />
              </button>
              <button onClick={handleExportPDF} aria-label="Export PDF" title="Export PDF"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white">
                <FaFilePdf size={14} />
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors w-8 h-8"
                title="Print"
              >
                <IoPrint size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <div className="min-w-full">
          <table ref={tableRef} className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                {headers.map((h) => (
                  <th key={h} className="border border-gray-300 px-2 py-2 text-left whitespace-nowrap" style={{ fontSize: '0.75rem' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr><td colSpan={headers.length} className="text-center text-gray-500 py-6">No data found.</td></tr>
              ) : paginatedRows.map((row, idx) => (
                <tr key={idx} className="bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="border border-gray-200 px-2 py-2 text-blue-600 font-medium">
                    <button onClick={()=>handleFlatClick(row)} className="hover:underline">{row.flatNo}</button>
                  </td>
                  <td className="border border-gray-200 px-2 py-2">{row.tower}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.appNo}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.floor}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.customer}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.contactNo}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.email}</td>
                  <td className="border border-gray-200 px-2 py-2" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.address}>{row.address}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.paymentPlan}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.loanBank}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.flatCost?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst1?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax1?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst2?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax2?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst3?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax3?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst4?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax4?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst5?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax5?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst6?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax6?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst7?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax7?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst8?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax8?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst9?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax9?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst10?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax10?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst11?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax11?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst12?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax12?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst13?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax13?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.inst14?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2">{row.tax14?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.totalInst?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.totalST?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.totalDue?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.paidInst?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.paidST?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-2 py-2 font-medium">{row.totalPaid?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight:'clamp(2rem,4rem,5rem)', paddingLeft:'clamp(2rem,3rem,4rem)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, displayed.length)} of {displayed.length}
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

export default InstallmentReport;

