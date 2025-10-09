import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { fetchCurrentDues } from '../../api/mockData';

const CurrentDues = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duesData, setDuesData] = useState(null);
  const [sortBy, setSortBy] = useState('Select');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch current dues data
    const getCurrentDues = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrentDues();
        if (response.success) {
          setDuesData(response.data);
        }
      } catch (error) {
        console.error('Error fetching current dues:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsLoaded(true);
        }, 100);
      }
    };

    getCurrentDues();
  }, []);

  // Loading state
  if (loading || !duesData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading dues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Current Dues</h2>
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
                  className="appearance-none border border-gray-300 focus:outline-none w-full"
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
                  <option value="Due Amount">Due Amount</option>
                  <option value="Paid Amount">Paid Amount</option>
                  <option value="Pending Amount">Pending Amount</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 focus:outline-none w-full"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                  height: 'clamp(2rem, 2.5rem, 3rem)',
                  paddingLeft: 'clamp(1.5rem, 2rem, 2.5rem)',
                  paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)',
                  minWidth: 'clamp(8rem, 10rem, 12rem)',
                  fontFamily: 'Montserrat',
                  fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                }}
              />
              <HiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* Flat Dues Section */}
        <div>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            FLAT DUES
          </h3>
          <div className="space-y-0">
            {duesData.flatDues.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                  {item.label}:
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GST/Tax Dues Section */}
        <div>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            GST/TAX DUES
          </h3>
          <div className="space-y-0">
            {duesData.gstTaxDues.map((charge, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                  {charge.label}:
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {charge.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Dues Section */}
        <div>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            MAINTENANCE DUES
          </h3>
          <div className="space-y-0">
            {duesData.maintenanceDues.map((charge, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                  {charge.label}:
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {charge.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Electricity Dues Section */}
        <div>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            ELECTRICITY DUES
          </h3>
          <div className="space-y-0">
            {duesData.electricityDues.map((charge, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                  {charge.label}:
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {charge.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Water Dues Section */}
        <div>
          <h3
            className="font-bold border-b"
            style={{
              color: '#8C8C8C',
              fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
            }}
          >
            WATER DUES
          </h3>
          <div className="space-y-0">
            {duesData.waterDues.map((charge, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                style={{ paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '500' }}>
                  {charge.label}:
                </span>
                <span style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {charge.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentDues; 
