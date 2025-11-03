import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { HiEye } from 'react-icons/hi';
import { fetchChannelPartners } from '../../api/mockData';

const ViewAll = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [channelPartners, setChannelPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadChannelPartners = async () => {
      try {
        setLoading(true);
        const response = await fetchChannelPartners();
        if (response.success) {
          // Transform data to include additional fields
          const transformedData = response.data.map((partner, index) => {
            // Extract dealer ID from company name - take the first word/abbreviation
            // e.g., "GHPL Constructions" -> "GHPL", "HDFC Realty" -> "HDFC"
            let dealerId = partner.id;
            if (partner.companyName) {
              const companyWords = partner.companyName.split(' ');
              const firstWord = companyWords[0];
              // Use the first word as dealer ID (e.g., "GHPL", "HDFC", "ICICI")
              dealerId = firstWord.toUpperCase();
            }
            
            return {
              ...partner,
              dealerId: dealerId,
              dealerName: partner.name,
              email: partner.email || `${partner.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
              contact: partner.contact || `+91${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
              company: partner.companyName,
              flatBooked: partner.flatBooked || Math.floor(Math.random() * 50) + 1,
              srNo: index + 1
            };
          });
          setChannelPartners(transformedData);
        }
      } catch (error) {
        console.error('Error fetching channel partners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChannelPartners();
  }, []);

  // Filter data based on search term
  const displayed = useMemo(() => {
    if (!channelPartners.length) return [];
    
    const q = searchQuery.toLowerCase();
    if (!q) return channelPartners;
    
    return channelPartners.filter(partner =>
      partner.dealerId?.toLowerCase().includes(q) ||
      partner.dealerName?.toLowerCase().includes(q) ||
      partner.email?.toLowerCase().includes(q) ||
      partner.contact?.includes(q) ||
      partner.company?.toLowerCase().includes(q)
    );
  }, [channelPartners, searchQuery]);

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

  const headers = ['Sr No.', 'Dealer ID', 'Dealer Name', 'Email', 'Contact', 'Company', 'Flat Booked', 'View Bill'];

  const handleCopy = async () => {
    const csv = [headers.join('\t'), ...displayed.map(r => [
      r.srNo || '',
      r.dealerId || '',
      r.dealerName || '',
      r.email || '',
      r.contact || '',
      r.company || '',
      r.flatBooked || '',
      ''
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
      r.srNo || '',
      r.dealerId || '',
      r.dealerName || '',
      r.email || '',
      r.contact || '',
      r.company || '',
      r.flatBooked || '',
      ''
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'channel-partners.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const tableHtml = tableRef.current ? tableRef.current.outerHTML : '';
    w.document.write(`<!doctype html><html><head><title>Channel Partners</title>
      <style>
        table{width:100%;border-collapse:collapse;font-family:Arial, sans-serif;font-size:12px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        thead{background:#dbeafe}
      </style></head><body>${tableHtml}</body></html>`);
    w.document.close();
    w.print();
  };

  const handleViewBill = (partner) => {
    // TODO: Navigate to bill view page or open bill modal
    console.log('View Bill for:', partner);
    alert(`View Bill for ${partner.dealerName} (${partner.dealerId})`);
  };

  const handleDealerClick = (partner) => {
    // TODO: Navigate to dealer details page or open dealer details modal
    console.log('Dealer clicked:', partner);
    // For now, we can navigate or show details
    // You can add navigation logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
            Channel Partners
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width: 'clamp(10rem, 14rem, 18rem)' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex items-center gap-2 relative">
              <button
                onClick={handleCopy}
                aria-label="Copy"
                title="Copy"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <FiCopy size={14} />
              </button>
              {copied && (
                <span className="absolute -top-7 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow">
                  Copied
                </span>
              )}
              <button
                onClick={handleExportCSV}
                aria-label="Export Excel"
                title="Export Excel"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 hover:bg-green-600 text-white"
              >
                <FaFileExcel size={14} />
              </button>
              <button
                onClick={handleExportPDF}
                aria-label="Export PDF"
                title="Export PDF"
                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                <FaFilePdf size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                <th className="border border-gray-300 px-3 py-2 text-left">Sr No.</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Dealer ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Dealer Name</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Contact</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Company</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Flat Booked</th>
                <th className="border border-gray-300 px-3 py-2 text-left">View Bill</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-6">
                    No channel partners found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((partner, idx) => (
                  <tr key={partner.id || idx} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 font-medium">
                      <button
                        onClick={() => handleDealerClick(partner)}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
                      >
                        {partner.dealerId || partner.id}
                      </button>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <button
                        onClick={() => handleDealerClick(partner)}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer"
                      >
                        {partner.dealerName || partner.name}
                      </button>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {partner.email}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {partner.contact}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {partner.company || partner.companyName}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {partner.flatBooked || 0}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <button
                        onClick={() => handleViewBill(partner)}
                        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center"
                        title="View Bill"
                      >
                        <HiEye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)', paddingLeft: 'clamp(2rem, 3rem, 4rem)' }}>
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
              {[10, 20, 50, 100].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                title="First"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                title="Previous"
              >
                ‹
              </button>
              <span className="text-sm text-gray-700 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                title="Next"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
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

export default ViewAll;

