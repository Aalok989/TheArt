import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { fetchFlatStatus } from '../../api/mockData';

const FlatStatus = () => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [selectedFlatDetails, setSelectedFlatDetails] = useState(null);
  const [isFlatDetailsOpen, setIsFlatDetailsOpen] = useState(false);
  
  // Refs for scroll containers
  const floorScrollRef = useRef(null);
  const blockScrollRef = useRef(null);
  const sizeScrollRef = useRef(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const getFlatStatus = async () => {
      try {
        setLoading(true);
        const response = await fetchFlatStatus();
        if (response.success) {
          setFlatStatusData(response.data);
        }
      } catch (error) {
        console.error('Error fetching flat status:', error);
      } finally {
        setLoading(false);
      }
    };

    getFlatStatus();
  }, []);
  
  // Scroll function
  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200; // pixels to scroll
      const newScrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // View All handler - clear all filters
  const handleViewAll = () => {
    setSelectedFloor(null);
    setSelectedBlock(null);
    setSelectedSize(null);
  };

  // Handle flat number click - open details popup
  const handleFlatClick = (flat) => {
    setSelectedFlatDetails(flat);
    setIsFlatDetailsOpen(true);
  };

  // Close flat details popup
  const closeFlatDetails = () => {
    setIsFlatDetailsOpen(false);
    setSelectedFlatDetails(null);
  };

  // Filter flats based on selected floor, block, and size
  const filteredFlatsData = useMemo(() => {
    if (!flatStatusData) return [];
    
    const allFlatsData = flatStatusData.flats;
    let filtered = allFlatsData;

    // Apply floor filter
    if (selectedFloor !== null) {
      filtered = filtered.filter(flat => flat.floor === selectedFloor);
    }

    // Apply block filter
    if (selectedBlock !== null) {
      filtered = filtered.filter(flat => flat.block === selectedBlock);
    }

    // Apply size filter
    if (selectedSize !== null) {
      filtered = filtered.filter(flat => flat.size === selectedSize);
    }

    return filtered;
  }, [flatStatusData, selectedFloor, selectedBlock, selectedSize]);

  // Loading state
  if (loading || !flatStatusData) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading flat status...</p>
        </div>
      </div>
    );
  }

  const { floors, blocks, sizes } = flatStatusData;

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* LEFT SECTION — FLAT STATUS */}
      <div className="w-full lg:w-[55%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Flat Status</h2>

        {/* Filter Buttons */}
          <div className="grid grid-cols-3 mb-[0.75rem] lg:mb-[1rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          {['floor', 'block', 'size'].map((filter) => {
            const isExpanded = expandedFilters.has(filter);
            const isSelected =
              (filter === 'floor' && selectedFloor !== null) ||
              (filter === 'block' && selectedBlock !== null) ||
              (filter === 'size' && selectedSize !== null);
            
            const toggleExpanded = () => {
              setExpandedFilters(prev => {
                const newSet = new Set(prev);
                if (newSet.has(filter)) {
                  newSet.delete(filter);
                } else {
                  newSet.add(filter);
                }
                return newSet;
              });
            };
            
            return (
              <button
                key={filter}
                onClick={toggleExpanded}
                className={`rounded-full font-medium transition-all duration-300 flex items-center justify-between ${
                  isSelected ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                style={{ height: 'clamp(2rem, 2.5rem, 3rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
              >
                <span>
                  {filter === 'floor'
                    ? 'Floor Wise'
                    : filter === 'block'
                    ? 'Block Wise'
                    : 'Size Wise'}
                </span>
                <HiChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              </button>
            );
          })}
        </div>

          <div className="grid grid-cols-3 mb-[0.75rem] lg:mb-[1rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <button className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 col-span-1" style={{ height: 'clamp(2rem, 2.5rem, 3rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
            Mortgaged
          </button>
            <button 
              onClick={handleViewAll}
              className="rounded-full font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 col-span-1"
              style={{ height: 'clamp(2rem, 2.5rem, 3rem)', paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
            View All
          </button>
          <div></div>
          </div>
        </div>

        {/* Filter Sections with Fixed Spacing */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* FLOOR WISE Section */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 3rem)' }}>
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
              FLOOR WISE
            </h3>
            <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              {expandedFilters.has('floor') && (
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={floorScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          onClick={() => setSelectedFloor(prev => (prev === floor ? null : floor))}
                          className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedFloor === floor
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                        >
                          {floor}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'right')}
                    className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BLOCK WISE Section */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 3rem)' }}>
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
              BLOCK WISE
            </h3>
            <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              {expandedFilters.has('block') && (
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={blockScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {blocks.map((block) => (
                        <button
                          key={block}
                          onClick={() => setSelectedBlock(prev => (prev === block ? null : block))}
                          className={`flex items-center justify-center rounded-md font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedBlock === block
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                        >
                          {block}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'right')}
                    className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SIZE WISE Section */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 3rem)' }}>
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
              SIZE WISE
            </h3>
            <div style={{ minHeight: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              {expandedFilters.has('size') && (
                <div className="relative flex items-center" style={{ marginTop: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'left')}
                    className="absolute left-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronLeft style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={sizeScrollRef}
                    className="overflow-x-scroll scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: 'clamp(1.5rem, 2rem, 2.5rem)', marginRight: 'clamp(1.5rem, 2rem, 2.5rem)' }}
                  >
                    <div className="flex items-center w-max" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(prev => (prev === size ? null : size))}
                          className={`rounded-md font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                            selectedSize === size
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', height: 'clamp(1.75rem, 2rem, 2.25rem)', fontSize: 'clamp(0.65rem, 0.75rem, 0.875rem)' }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'right')}
                    className="absolute right-0 z-10 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                    style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                  >
                    <HiChevronRight style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — FLATS SUMMARY */}
      <div className="w-full lg:w-[45%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Flats Summary</h2>

        {/* Legend */}
        <div className="flex items-center flex-wrap" style={{ gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            <div className="bg-red-500 rounded-full" style={{ width: 'clamp(0.625rem, 0.75rem, 0.875rem)', height: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}></div>
            <span className="text-gray-800 font-semibold font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Booked</span>
          </div>
          <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            <div className="bg-yellow-500 rounded-full" style={{ width: 'clamp(0.625rem, 0.75rem, 0.875rem)', height: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}></div>
            <span className="text-gray-800 font-semibold font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Blocked</span>
          </div>
          <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            <div className="bg-green-500 rounded-full" style={{ width: 'clamp(0.625rem, 0.75rem, 0.875rem)', height: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}></div>
            <span className="text-gray-800 font-semibold font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Vacant</span>
          </div>
          <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
            <div className="bg-blue-500 rounded-full" style={{ width: 'clamp(0.625rem, 0.75rem, 0.875rem)', height: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}></div>
            <span className="text-gray-800 font-semibold font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>BBA Signed</span>
          </div>
          </div>
        </div>

        {/* Scrollable content starting from table header */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarGutter: 'stable', paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* Sticky header */}
          <div
            className="grid border-b sticky top-0 z-10"
            style={{
              gridTemplateColumns: '1fr 2fr',
              gap: 'clamp(1rem, 2rem, 4rem)',
              paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)',
              paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              backgroundColor: '#F3F3F3FE'
            }}
          >
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>Flat No.</div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>Status</div>
          </div>

          {/* Rows */}
          <div className="space-y-0" style={{ marginTop: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            {filteredFlatsData.length > 0 ? (
              filteredFlatsData.map((flat, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                style={{ gridTemplateColumns: '1fr 2fr', gap: 'clamp(1rem, 2rem, 4rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
              >
                  <button
                    onClick={() => handleFlatClick(flat)}
                    className={`font-medium ${flat.color} font-montserrat text-left hover:underline cursor-pointer transition-all duration-200`}
                    style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                  >
                  {flat.flatNo}
                  </button>
                  <div className="text-gray-700 font-montserrat" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>{flat.status}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm font-montserrat">
                  No flats found matching the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FlatStatus;