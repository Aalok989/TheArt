import React, { useState, useEffect, useMemo } from 'react';
import { IoPrint } from 'react-icons/io5';
import { HiMail } from 'react-icons/hi';

const ViewCoupons = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [couponData, setCouponData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data on component mount
  useEffect(() => {
    const getCoupons = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = [
          { flatNo: 'A1', customer: 'V.REVATHI', email: 'revathi@gmail.com', couponCode: 'COUPON001' },
          { flatNo: 'A10', customer: 'Mukul Sagar', email: 'mukul@gmail.com', couponCode: 'COUPON002' },
          { flatNo: 'A101', customer: 'SMT. Z SINCY', email: 'sincy@gmail.com', couponCode: 'COUPON003' },
          { flatNo: 'A102', customer: 'S V NARASIMHA SWAMY', email: 'swamy@gmail.com', couponCode: 'COUPON004' },
          { flatNo: 'A103', customer: 'RAJ KUMAR REDDY KOMMIDI', email: 'rajkumar@gmail.com', couponCode: 'COUPON005' },
          { flatNo: 'A104', customer: 'D. SAI AKSHAY RAJ', email: 'akshay@gmail.com', couponCode: 'COUPON006' },
          { flatNo: 'A105', customer: 'ARASANI SREEKANTH REDDY', email: 'sreekanth@smail.iitm.ac.in', couponCode: 'COUPON007' },
          { flatNo: 'A106', customer: 'RAVINDRANATH MEDISETTI', email: 'ravindranath@gmail.com', couponCode: 'COUPON008' },
          { flatNo: 'A107', customer: 'John Doe', email: 'john.doe@gmail.com', couponCode: 'COUPON009' },
          { flatNo: 'A108', customer: 'Jane Smith', email: 'jane.smith@gmail.com', couponCode: 'COUPON010' },
          { flatNo: 'B1', customer: 'Robert Johnson', email: 'robert@gmail.com', couponCode: 'COUPON011' },
          { flatNo: 'B2', customer: 'Emily Davis', email: 'emily@gmail.com', couponCode: 'COUPON012' }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setCouponData(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setLoading(false);
      }
    };

    getCoupons();
  }, []);

  // Filter data based on search term
  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return couponData;
    return couponData.filter(item =>
      item.flatNo.toLowerCase().includes(q) ||
      item.customer.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.couponCode.toLowerCase().includes(q)
    );
  }, [couponData, searchQuery]);

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
    try { sessionStorage.setItem('flatOrigin', 'viewCoupons'); } catch {}
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const handleEmailClick = (coupon) => {
    // TODO: Implement email functionality
    alert(`Sending coupon code ${coupon.couponCode} to ${coupon.email}`);
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
          <h2 className="font-bold text-gray-800" style={{ fontSize:'clamp(1rem,1.25rem,1.5rem)' }}>View Coupons</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="min-w-[10rem]" style={{ width:'clamp(10rem,14rem,18rem)' }}>
              <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
            </div>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              style={{ padding: '0' }}
              title="Print"
            >
              <IoPrint size={32} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft:'clamp(1rem,1.5rem,2rem)', paddingRight:'clamp(1rem,1.5rem,2rem)' }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-gray-800">
              <th className="border border-gray-300 px-3 py-2 text-left">Sr. No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Flat No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Customer</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Coupon Code</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-500 py-6">No data found.</td></tr>
            ) : paginatedRows.map((coupon, idx) => (
              <tr key={idx} className="bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="border border-gray-200 px-3 py-2 text-blue-600 font-medium">
                  <button onClick={()=>handleFlatClick(coupon)} className="hover:underline">{coupon.flatNo}</button>
                </td>
                <td className="border border-gray-200 px-3 py-2">{coupon.customer}</td>
                <td className="border border-gray-200 px-3 py-2">{coupon.email}</td>
                <td className="border border-gray-200 px-3 py-2">
                  <button 
                    onClick={() => handleEmailClick(coupon)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition-colors"
                  >
                    <HiMail size={16} />
                    Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ViewCoupons;

