import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { IoPrint } from 'react-icons/io5';

const CLPReport = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Table headers
  const headers = [
    'Sr. No.', 'Flat No.', 'Customer', 'Contact No', 'Loan', 
    '1', '2', '3', '4', '5', 
    'Total Due', 'Total Paid', 'Pending'
  ];

  // Fetch data on component mount
  useEffect(() => {
    const getCLPReport = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = [
          {
            srNo: 1,
            flatNo: 'A1',
            customer: 'V.REVATHI',
            contactNo: '9966801523',
            loan: 'self',
            inst1: 805020,
            inst2: 1610040,
            inst3: 1207530,
            inst4: 2012550,
            inst5: 402510,
            totalDue: 6176250,
            totalPaid: 8219625,
            pending: -2043375,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 2,
            flatNo: 'A10',
            customer: 'Mukul Sagar',
            contactNo: '9467676327',
            loan: 'self',
            inst1: 614000,
            inst2: 1228000,
            inst3: 921000,
            inst4: 1535000,
            inst5: 307000,
            totalDue: 4605000,
            totalPaid: 0,
            pending: 4605000,
            inst1Paid: false,
            inst2Paid: false,
            inst3Paid: false,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 3,
            flatNo: 'A101',
            customer: 'SMT. Z SINCY',
            contactNo: '9876543210',
            loan: 'self',
            inst1: 500000,
            inst2: 1000000,
            inst3: 750000,
            inst4: 1250000,
            inst5: 250000,
            totalDue: 3750000,
            totalPaid: 3750000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 4,
            flatNo: 'A102',
            customer: 'S V NARASIMHA SWAMY',
            contactNo: '9876543211',
            loan: 'self',
            inst1: 450000,
            inst2: 900000,
            inst3: 675000,
            inst4: 1125000,
            inst5: 225000,
            totalDue: 3375000,
            totalPaid: 2250000,
            pending: -1125000,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 5,
            flatNo: 'A103',
            customer: 'RAJ KUMAR REDDY KOMMIDI',
            contactNo: '9876543212',
            loan: 'self',
            inst1: 600000,
            inst2: 1200000,
            inst3: 900000,
            inst4: 1500000,
            inst5: 300000,
            totalDue: 4500000,
            totalPaid: 2700000,
            pending: 1800000,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 6,
            flatNo: 'A104',
            customer: 'D. SAI AKSHAY RAJ',
            contactNo: '9876543213',
            loan: 'self',
            inst1: 550000,
            inst2: 1100000,
            inst3: 825000,
            inst4: 1375000,
            inst5: 275000,
            totalDue: 4125000,
            totalPaid: 4125000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 7,
            flatNo: 'A105',
            customer: 'ARASANI SREEKANTH REDDY',
            contactNo: '9876543214',
            loan: 'self',
            inst1: 700000,
            inst2: 1400000,
            inst3: 1050000,
            inst4: 1750000,
            inst5: 350000,
            totalDue: 5250000,
            totalPaid: 2100000,
            pending: 3150000,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: false,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 8,
            flatNo: 'A106',
            customer: 'RAVINDRANATH MEDISETTI',
            contactNo: '9876543215',
            loan: 'self',
            inst1: 650000,
            inst2: 1300000,
            inst3: 975000,
            inst4: 1625000,
            inst5: 325000,
            totalDue: 4875000,
            totalPaid: 4875000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 9,
            flatNo: 'A107',
            customer: 'John Doe',
            contactNo: '9876543216',
            loan: 'self',
            inst1: 480000,
            inst2: 960000,
            inst3: 720000,
            inst4: 1200000,
            inst5: 240000,
            totalDue: 3600000,
            totalPaid: 2400000,
            pending: 1200000,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 10,
            flatNo: 'A108',
            customer: 'Jane Smith',
            contactNo: '9876543217',
            loan: 'self',
            inst1: 520000,
            inst2: 1040000,
            inst3: 780000,
            inst4: 1300000,
            inst5: 260000,
            totalDue: 3900000,
            totalPaid: 3900000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 11,
            flatNo: 'A109',
            customer: 'Robert Johnson',
            contactNo: '9876543218',
            loan: 'self',
            inst1: 580000,
            inst2: 1160000,
            inst3: 870000,
            inst4: 1450000,
            inst5: 290000,
            totalDue: 4350000,
            totalPaid: 4350000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 12,
            flatNo: 'A110',
            customer: 'Ashu',
            contactNo: '9876543219',
            loan: 'self',
            inst1: 158400,
            inst2: 316800,
            inst3: 237600,
            inst4: 396000,
            inst5: 79200,
            totalDue: 1188000,
            totalPaid: 0,
            pending: 1188000,
            inst1Paid: false,
            inst2Paid: false,
            inst3Paid: false,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 13,
            flatNo: 'A111',
            customer: 'Emily Davis',
            contactNo: '9876543220',
            loan: 'self',
            inst1: 620000,
            inst2: 1240000,
            inst3: 930000,
            inst4: 1550000,
            inst5: 310000,
            totalDue: 4650000,
            totalPaid: 4650000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          },
          {
            srNo: 14,
            flatNo: 'A112',
            customer: 'Michael Brown',
            contactNo: '9876543221',
            loan: 'self',
            inst1: 540000,
            inst2: 1080000,
            inst3: 810000,
            inst4: 1350000,
            inst5: 270000,
            totalDue: 4050000,
            totalPaid: 2700000,
            pending: 1350000,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: false,
            inst5Paid: false
          },
          {
            srNo: 15,
            flatNo: 'A113',
            customer: 'Sarah Wilson',
            contactNo: '9876543222',
            loan: 'self',
            inst1: 560000,
            inst2: 1120000,
            inst3: 840000,
            inst4: 1400000,
            inst5: 280000,
            totalDue: 4200000,
            totalPaid: 4200000,
            pending: 0,
            inst1Paid: true,
            inst2Paid: true,
            inst3Paid: true,
            inst4Paid: true,
            inst5Paid: true
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setReportData(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching CLP report:', error);
        setLoading(false);
      }
    };

    getCLPReport();
  }, []);

  // Filter data based on search term
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return reportData;
    return reportData.filter(item =>
      item.flatNo.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.contactNo.includes(q)
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
    try { sessionStorage.setItem('flatOrigin', 'clpReport'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayed.map(r => [
      r.srNo || '', r.flatNo || '', r.customer || '', r.contactNo || '', r.loan || '',
      r.inst1 || 0, r.inst2 || 0, r.inst3 || 0, r.inst4 || 0, r.inst5 || 0,
      r.totalDue || 0, r.totalPaid || 0, r.pending || 0
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
      r.srNo || '', r.flatNo || '', r.customer || '', r.contactNo || '', r.loan || '',
      r.inst1 || 0, r.inst2 || 0, r.inst3 || 0, r.inst4 || 0, r.inst5 || 0,
      r.totalDue || 0, r.totalPaid || 0, r.pending || 0
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clp_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>CLP Report</title>
      <style>
        @page { size: A4 landscape; margin: 1cm; }
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:11px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#bfdbfe}
        th{font-weight:bold}
        .paid{background-color:#d1fae5}
        .unpaid{background-color:#fee2e2}
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
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>CLP Report</h2>
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
                  <th key={h} className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">
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
                  <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                    <button onClick={()=>handleFlatClick(row)} className="hover:underline">{row.flatNo}</button>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">{row.customer}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.contactNo}</td>
                  <td className="border border-gray-200 px-3 py-2">{row.loan}</td>
                  <td className={`border border-gray-200 px-3 py-2 ${row.inst1Paid ? 'bg-green-100' : 'bg-red-100'}`}>
                    {row.inst1?.toLocaleString() || 0}
                  </td>
                  <td className={`border border-gray-200 px-3 py-2 ${row.inst2Paid ? 'bg-green-100' : 'bg-red-100'}`}>
                    {row.inst2?.toLocaleString() || 0}
                  </td>
                  <td className={`border border-gray-200 px-3 py-2 ${row.inst3Paid ? 'bg-green-100' : 'bg-red-100'}`}>
                    {row.inst3?.toLocaleString() || 0}
                  </td>
                  <td className={`border border-gray-200 px-3 py-2 ${row.inst4Paid ? 'bg-green-100' : 'bg-red-100'}`}>
                    {row.inst4?.toLocaleString() || 0}
                  </td>
                  <td className={`border border-gray-200 px-3 py-2 ${row.inst5Paid ? 'bg-green-100' : 'bg-red-100'}`}>
                    {row.inst5?.toLocaleString() || 0}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.totalDue?.toLocaleString() || 0}</td>
                  <td className="border border-gray-200 px-3 py-2 font-medium">{row.totalPaid?.toLocaleString() || 0}</td>
                  <td className={`border border-gray-200 px-3 py-2 font-medium ${row.pending < 0 ? 'text-green-600' : row.pending > 0 ? 'text-red-600' : ''}`}>
                    {row.pending?.toLocaleString() || 0}
                  </td>
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

export default CLPReport;

