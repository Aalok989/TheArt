import React, { useState, useEffect } from 'react';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import { fetchReports } from '../../api/mockData';

const Report = () => {
  const [sortBy, setSortBy] = useState('Select');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const getReports = async () => {
      try {
        setLoading(true);
        const response = await fetchReports();
        if (response.success) {
          setReportsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, []);

  const filteredData = reportsData.filter(item =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ipAddress.includes(searchTerm) ||
    item.dateTime.includes(searchTerm)
  );

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Reports</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0" style={{ gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
            {/* Sort Dropdown */}
            <div className="flex items-center w-full sm:w-auto" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              <span
                className="font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none focus:outline-none w-full"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                    height: 'clamp(2rem, 2.5rem, 3rem)',
                    paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                    paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                    minWidth: 'clamp(8rem, 10rem, 12rem)',
                    fontFamily: 'Montserrat',
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                    color: '#313131',
                  }}
                >
                  <option value="Select">Select</option>
                  <option value="username">Username</option>
                  <option value="ipAddress">IP Address</option>
                  <option value="dateTime">Date & Time</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:outline-none w-full"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  height: 'clamp(2rem, 2.5rem, 3rem)',
                  paddingLeft: 'clamp(2rem, 2.5rem, 3rem)',
                  paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)',
                  minWidth: 'clamp(8rem, 10rem, 12rem)',
                  fontFamily: 'Montserrat',
                  fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                  color: '#313131',
                }}
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        {/* Table Headers */}
          <div
            className="grid border-b sticky top-0 z-10 bg-white"
            style={{ 
              gridTemplateColumns: '1fr 1.5fr 2fr 2fr',
              gap: 'clamp(0.5rem, 1rem, 1.5rem)',
              paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem'
            }}
          >
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              Sr. No.
            </div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              Username
            </div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              IP Address
            </div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              Date & Time
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {filteredData.map((report, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                style={{ 
                  gridTemplateColumns: '1fr 1.5fr 2fr 2fr',
                  gap: 'clamp(0.5rem, 1rem, 1.5rem)',
                  paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)',
                  paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)'
                }}
              >
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {report.srNo}
                </div>
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {report.username}
                </div>
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {report.ipAddress}
                </div>
                <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {report.dateTime}
                </div>
              </div>
            ))}
          </div>

        {/* No Results Message */}
        {filteredData.length === 0 && (
          <div className="text-center" style={{ paddingTop: 'clamp(1.5rem, 2rem, 2.5rem)', paddingBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <p className="text-gray-500 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>No reports found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
