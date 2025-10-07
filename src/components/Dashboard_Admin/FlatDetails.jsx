import React, { useState, useEffect } from 'react';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { fetchFlatDetails } from '../../api/mockData';

const FlatDetails = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flatData, setFlatData] = useState(null);
  const [sortBy, setSortBy] = useState('Select');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch flat details data
    const getFlatDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchFlatDetails();
        if (response.success) {
          setFlatData(response.data);
        }
      } catch (error) {
        console.error('Error fetching flat details:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsLoaded(true);
        }, 100);
      }
    };

    getFlatDetails();
  }, []);

  // Loading state
  if (loading || !flatData) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading flat details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-[1.5rem]">
      {/* Header Section */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-[1.5rem] space-y-4 lg:space-y-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800">Flat Details</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span
                className="text-[0.875rem] font-medium text-gray-700 whitespace-nowrap"
                style={{ fontFamily: 'Montserrat' }}
              >
                Sort by
              </span>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-gray-300 px-3 pr-8 focus:outline-none w-full sm:w-[10rem]"
                  style={{
                    backgroundColor: '#EFF1F6',
                    borderRadius: '0.5rem',
                    height: '2.5rem',
                    fontFamily: 'Montserrat',
                    fontSize: '1rem',
                    color: '#313131',
                  }}
                >
                  <option value="Select">Select</option>
                  <option value="Area">Area</option>
                  <option value="Booking Date">Booking Date</option>
                  <option value="Unit Cost">Unit Cost</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 border border-gray-300 text-[0.875rem] focus:outline-none w-full sm:w-[10rem]"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: '0.5rem',
                  height: '2.5rem',
                  fontFamily: 'Montserrat',
                }}
              />
              <HiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 space-y-[1.5rem] overflow-y-auto pr-[1rem] min-h-0">
        {/* Flat Information Section */}
        <div>
          <h3
            className="font-bold mb-[1rem] border-b pb-[0.5rem]"
            style={{
              color: '#8C8C8C',
              fontSize: '0.75rem',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
            }}
          >
            FLAT INFORMATION
          </h3>
          <div className="space-y-0">
            {flatData.flatInfo.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-[1rem] border-b border-gray-200 last:border-b-0"
              >
                <span style={{ fontSize: '1rem', color: '#000000', fontWeight: '500' }}>
                  {item.label}:
                </span>
                <span style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charges Information Section */}
        <div>
          <h3
            className="font-bold mb-[1rem] border-b pb-[0.5rem]"
            style={{
              color: '#8C8C8C',
              fontSize: '0.75rem',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
            }}
          >
            CHARGES INFORMATION
          </h3>
          <div className="space-y-0">
            {flatData.chargesInfo.map((charge, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-[1rem] border-b border-gray-200 last:border-b-0"
              >
                <span style={{ fontSize: '1rem', color: '#000000', fontWeight: '500' }}>
                  {charge.label}:
                </span>
                <span style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {charge.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatDetails;
