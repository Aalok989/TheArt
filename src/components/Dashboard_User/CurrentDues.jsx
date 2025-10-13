import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { customerAPI } from '../../api/api';

const CurrentDues = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duesData, setDuesData] = useState(null);
  const [sortBy, setSortBy] = useState('Select');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current dues data
  const getCurrentDues = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getCurrentDues(); // Updated to use real API
      if (response.success) {
        setDuesData(response.data);
      }
    } catch (error) {
      console.error('Error fetching current dues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentDues();
  }, []);

  // Animation effect after data is loaded
  useEffect(() => {
    if (!loading && duesData) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, duesData]);

  // Simple search filter (applies to all labels across sections)
  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Sorting logic (within each section, sort by value if applicable)
  const sortItems = (items) => {
    if (sortBy === 'Select' || !items) return items;
    
    const sorted = [...items];
    const getNumericValue = (value) => parseFloat(value.replace(/,/g, '')) || 0;
    
    switch (sortBy) {
      case 'Due Amount':
        return sorted.sort((a, b) => getNumericValue(b.value) - getNumericValue(a.value)); // Descending for amounts
      case 'Paid Amount':
        return sorted.sort((a, b) => getNumericValue(b.value) - getNumericValue(a.value));
      case 'Pending Amount':
        return sorted.sort((a, b) => getNumericValue(b.value) - getNumericValue(a.value));
      default:
        return items;
    }
  };

  // Loading state
  if (loading || !duesData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading Dues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800 animate-slide-in-down" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Current Dues</h2>
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
                  className="appearance-none border border-gray-300 focus:outline-none w-full hover-scale btn-animate"
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
                className="border border-gray-300 focus:outline-none w-full hover-scale btn-animate"
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
      <div className="flex-1 overflow-y-auto min-h-0 section-animate animate-delay-300" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* Flat Dues Section */}
          <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
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
              {sortItems(filterItems(duesData.flatDues)).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
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
          <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
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
              {sortItems(filterItems(duesData.gstTaxDues)).map((charge, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
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
          <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
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
              {sortItems(filterItems(duesData.maintenanceDues)).map((charge, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
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
          <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
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
              {sortItems(filterItems(duesData.electricityDues)).map((charge, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
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
          <div className={`transition-all duration-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
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
              {sortItems(filterItems(duesData.waterDues)).map((charge, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
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