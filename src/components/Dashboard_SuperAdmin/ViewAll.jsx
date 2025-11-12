import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiCopy } from 'react-icons/fi';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { HiEye, HiX } from 'react-icons/hi';
import { fetchChannelPartners, fetchChannelPartnerByDealerId } from '../../api/mockData';

const ViewAll = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [channelPartners, setChannelPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const tableRef = useRef(null);
  const [showPartnerPopup, setShowPartnerPopup] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [loadingPartner, setLoadingPartner] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [showDisableLoginConfirm, setShowDisableLoginConfirm] = useState(false);
  const [showEditCommissionForm, setShowEditCommissionForm] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editCommissionData, setEditCommissionData] = useState({
    flatType: '',
    oldCommission: '',
    newCommission: ''
  });

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
    // Store dealer ID and name in sessionStorage for CP_Detail page
    sessionStorage.setItem('selectedDealerId', partner.dealerId || partner.id);
    sessionStorage.setItem('selectedDealerName', partner.dealerName || partner.name);
    try { sessionStorage.setItem('cpDetailOrigin', 'viewAll'); } catch {}
    if (onPageChange) {
      onPageChange('cpDetail');
    }
  };

  const handleDealerClick = (partner) => {
    // Store dealer ID and name in sessionStorage for filtering
    sessionStorage.setItem('selectedDealerId', partner.dealerId || partner.id);
    sessionStorage.setItem('selectedDealerName', partner.dealerName || partner.name);
    try { sessionStorage.setItem('flatDetailCPOrigin', 'viewAll'); } catch {}
    if (onPageChange) {
      onPageChange('flatDetailCP');
    }
  };

  const handleDealerNameClick = async (partner) => {
    const dealerId = partner.dealerId || partner.id;
    if (!dealerId) return;

    setLoadingPartner(true);
    setShowPartnerPopup(true);

    try {
      const response = await fetchChannelPartnerByDealerId(dealerId);
      if (response.success) {
        setPartnerDetails(response.data);
      } else {
        alert('Failed to load channel partner details');
        setShowPartnerPopup(false);
      }
    } catch (error) {
      console.error('Error fetching channel partner details:', error);
      alert('Error loading channel partner details');
      setShowPartnerPopup(false);
    } finally {
      setLoadingPartner(false);
    }
  };

  const handleClosePopup = () => {
    setShowPartnerPopup(false);
    setPartnerDetails(null);
    setShowResetPasswordForm(false);
    setShowDisableLoginConfirm(false);
    setShowEditCommissionForm(false);
    setResetPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setEditCommissionData({ flatType: '', oldCommission: '', newCommission: '' });
  };

  const handleResetPasswordClick = () => {
    setShowResetPasswordForm(true);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    // TODO: Implement API call to reset password
    console.log('Reset password:', resetPasswordData);
    alert('Password reset successfully!');
    setShowResetPasswordForm(false);
    setResetPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDisableLoginClick = () => {
    setShowDisableLoginConfirm(true);
  };

  const handleDisableLoginConfirm = () => {
    // TODO: Implement API call to disable/enable login
    const currentState = partnerDetails?.loginDisabled || false;
    const newState = !currentState;
    
    // Update partner details state
    setPartnerDetails({
      ...partnerDetails,
      loginDisabled: newState
    });
    
    console.log(`${newState ? 'Disable' : 'Enable'} login for:`, partnerDetails?.dealerId);
    alert(`Login ${newState ? 'disabled' : 'enabled'} successfully!`);
    setShowDisableLoginConfirm(false);
  };

  const handleEditCommissionClick = (commission) => {
    setSelectedCommission(commission);
    setEditCommissionData({
      flatType: commission.flatType,
      oldCommission: commission.commissionAmount,
      newCommission: commission.commissionAmount
    });
    setShowEditCommissionForm(true);
  };

  const handleEditCommissionSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update commission
    console.log('Update commission:', editCommissionData);
    alert('Commission updated successfully!');
    setShowEditCommissionForm(false);
    setEditCommissionData({ flatType: '', oldCommission: '', newCommission: '' });
    setSelectedCommission(null);
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
                        onClick={() => handleDealerNameClick(partner)}
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

      {/* Channel Partner Personal Information Popup */}
      {showPartnerPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClosePopup();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-800">Channel Partner Personal Information</h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>

            {loadingPartner ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                <p className="ml-2 text-sm text-gray-600">Loading...</p>
              </div>
            ) : partnerDetails ? (
              <div className="p-5">
                {/* Action Links */}
                <div className="flex gap-3 mb-4 pb-3 border-b border-gray-200">
                  <button 
                    onClick={handleResetPasswordClick}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Reset Password
                  </button>
                  <button 
                    onClick={handleDisableLoginClick}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline font-medium"
                  >
                    {partnerDetails?.loginDisabled ? 'Enable Login' : 'Disable Login'}
                  </button>
                </div>

                {/* Personal Information Section */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Personal Information</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Dealer Id</label>
                      <div className="text-sm text-gray-800 font-medium">{partnerDetails.dealerId}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Name</label>
                      <div className="text-sm text-gray-800">{partnerDetails.name}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Contact No.</label>
                      <div className="text-sm text-gray-800">{partnerDetails.contactNo}</div>
                    </div>
                    <div className="space-y-1 col-span-3">
                      <label className="block text-xs font-bold text-gray-500">Address</label>
                      <div className="text-sm text-gray-800">{partnerDetails.address}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">City</label>
                      <div className="text-sm text-gray-800">{partnerDetails.city}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">State</label>
                      <div className="text-sm text-gray-800">{partnerDetails.state}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">PIN</label>
                      <div className="text-sm text-gray-800">{partnerDetails.pin || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Email ID</label>
                      <div className="text-sm text-gray-800 break-all">{partnerDetails.emailId}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">PAN No.</label>
                      <div className="text-sm text-gray-800 font-mono">{partnerDetails.panNo}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Company</label>
                      <div className="text-sm text-gray-800">{partnerDetails.company || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Profession</label>
                      <div className="text-sm text-gray-800">{partnerDetails.profession || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-500">Designation</label>
                      <div className="text-sm text-gray-800">{partnerDetails.designation || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Commission Details Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center uppercase tracking-wide">Commission Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-blue-50 border border-gray-300">
                          <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">Commission Type</th>
                          <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">Flat Type</th>
                          <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700">Commission Amount</th>
                          <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {partnerDetails.commissionDetails && partnerDetails.commissionDetails.length > 0 ? (
                          partnerDetails.commissionDetails.map((commission, idx) => (
                            <tr key={idx} className="bg-white even:bg-gray-50 border border-gray-200">
                              <td className="border border-gray-200 px-2 py-1.5 text-gray-800">{commission.commissionType}</td>
                              <td className="border border-gray-200 px-2 py-1.5 text-gray-800">{commission.flatType}</td>
                              <td className="border border-gray-200 px-2 py-1.5 text-gray-800 font-medium">{commission.commissionAmount}</td>
                              <td className="border border-gray-200 px-2 py-1.5 text-center">
                                <button 
                                  onClick={() => handleEditCommissionClick(commission)}
                                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-gray-500 py-3 text-xs">No commission details found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No channel partner details found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Form Modal */}
      {showResetPasswordForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResetPasswordForm(false);
              setResetPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Reset Password</h3>
              <button
                onClick={() => {
                  setShowResetPasswordForm(false);
                  setResetPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Enter Old Password</label>
                <input
                  type="password"
                  value={resetPasswordData.oldPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, oldPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={resetPasswordData.newPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPasswordForm(false);
                    setResetPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disable Login Confirmation Modal */}
      {showDisableLoginConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDisableLoginConfirm(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Confirm Action</h3>
              <button
                onClick={() => setShowDisableLoginConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to {partnerDetails?.loginDisabled ? 'enable' : 'disable'} login for <span className="font-semibold">{partnerDetails?.name} ({partnerDetails?.dealerId})</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisableLoginConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDisableLoginConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                {partnerDetails?.loginDisabled ? 'Enable Login' : 'Disable Login'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Commission Form Modal */}
      {showEditCommissionForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditCommissionForm(false);
              setEditCommissionData({ flatType: '', oldCommission: '', newCommission: '' });
              setSelectedCommission(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Commission</h3>
              <button
                onClick={() => {
                  setShowEditCommissionForm(false);
                  setEditCommissionData({ flatType: '', oldCommission: '', newCommission: '' });
                  setSelectedCommission(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            </div>
            <form onSubmit={handleEditCommissionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Flat Type</label>
                <input
                  type="text"
                  value={editCommissionData.flatType}
                  onChange={(e) => setEditCommissionData({ ...editCommissionData, flatType: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Old Commission</label>
                <input
                  type="text"
                  value={editCommissionData.oldCommission}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Commission</label>
                <input
                  type="text"
                  value={editCommissionData.newCommission}
                  onChange={(e) => setEditCommissionData({ ...editCommissionData, newCommission: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCommissionForm(false);
                    setEditCommissionData({ flatType: '', oldCommission: '', newCommission: '' });
                    setSelectedCommission(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAll;

