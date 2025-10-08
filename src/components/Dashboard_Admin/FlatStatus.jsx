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
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full">
      {/* LEFT SECTION — FLAT STATUS (55%) */}
      <div className="w-[55%] min-w-0 flex flex-col">
        <div className="p-6 flex-shrink-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800 mb-[1rem]">Flat Status</h2>

          {/* Filter Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-[1rem]">
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
                className={`h-10 px-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                  isSelected ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <span>
                  {filter === 'floor'
                    ? 'Floor Wise'
                    : filter === 'block'
                    ? 'Block Wise'
                    : 'Size Wise'}
                </span>
                <HiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            );
          })}
        </div>

          <div className="grid grid-cols-3 gap-4 mb-[1rem]">
            <button className="h-10 px-3 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 col-span-1">
              Mortgaged
            </button>
            <button 
              onClick={handleViewAll}
              className="h-10 px-3 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 col-span-1"
            >
              View All
            </button>
            <div></div>
          </div>
        </div>

        {/* Filter Sections with Fixed Spacing */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          {/* FLOOR WISE Section */}
          <div className="mb-12">
            <h3
              className="font-bold mb-[1rem] border-b pb-[0.5rem]"
              style={{
                color: '#8C8C8C',
                fontSize: '0.75rem',
                borderBottomColor: '#616161',
                borderBottomWidth: '0.1875rem',
              }}
            >
              FLOOR WISE
            </h3>
            <div className="min-h-[2rem]">
              {expandedFilters.has('floor') && (
                <div className="mt-2 relative flex items-center">
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'left')}
                    className="absolute left-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={floorScrollRef}
                    className="overflow-x-scroll scrollbar-hide mx-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex items-center gap-2 w-max">
                      {floors.map((floor) => (
                        <button
                          key={floor}
                          onClick={() => setSelectedFloor(prev => (prev === floor ? null : floor))}
                          className={`w-10 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedFloor === floor
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {floor}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(floorScrollRef, 'right')}
                    className="absolute right-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BLOCK WISE Section */}
          <div className="mb-12">
            <h3
              className="font-bold mb-[1rem] border-b pb-[0.5rem]"
              style={{
                color: '#8C8C8C',
                fontSize: '0.75rem',
                borderBottomColor: '#616161',
                borderBottomWidth: '0.1875rem',
              }}
            >
              BLOCK WISE
            </h3>
            <div className="min-h-[2rem]">
              {expandedFilters.has('block') && (
                <div className="mt-2 relative flex items-center">
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'left')}
                    className="absolute left-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={blockScrollRef}
                    className="overflow-x-scroll scrollbar-hide mx-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex items-center gap-2 w-max">
                      {blocks.map((block) => (
                        <button
                          key={block}
                          onClick={() => setSelectedBlock(prev => (prev === block ? null : block))}
                          className={`w-10 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                            selectedBlock === block
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {block}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(blockScrollRef, 'right')}
                    className="absolute right-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SIZE WISE Section */}
          <div className="mb-12">
            <h3
              className="font-bold mb-[1rem] border-b pb-[0.5rem]"
              style={{
                color: '#8C8C8C',
                fontSize: '0.75rem',
                borderBottomColor: '#616161',
                borderBottomWidth: '0.1875rem',
              }}
            >
              SIZE WISE
            </h3>
            <div className="min-h-[2rem]">
              {expandedFilters.has('size') && (
                <div className="mt-2 relative flex items-center">
                  {/* Left Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'left')}
                    className="absolute left-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Scrollable Content */}
                  <div 
                    ref={sizeScrollRef}
                    className="overflow-x-scroll scrollbar-hide mx-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex items-center gap-2 w-max">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(prev => (prev === size ? null : size))}
                          className={`px-4 h-8 rounded-md text-xs font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                            selectedSize === size
                              ? 'bg-gray-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={() => handleScroll(sizeScrollRef, 'right')}
                    className="absolute right-0 z-10 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-200"
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — FLATS SUMMARY (45%) */}
      <div className="w-[45%] min-w-0 bg-[#F3F3F3FE] border-l border-gray-300 flex flex-col">
        <div className="p-6 flex-shrink-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800 mb-[1rem]">Flats Summary</h2>

          {/* Legend */}
          <div className="flex items-center gap-6 pb-[1rem]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-semibold font-montserrat">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-semibold font-montserrat">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-semibold font-montserrat">Vacant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-800 font-semibold font-montserrat">BBA Signed</span>
          </div>
          </div>
        </div>

        {/* Scrollable content starting from table header */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0" style={{ scrollbarGutter: 'stable' }}>
          {/* Sticky header */}
          <div
            className="grid gap-[8rem] py-[1rem] border-b sticky top-0 z-10"
            style={{
              gridTemplateColumns: '1fr 3fr',
              borderBottomColor: '#616161',
              borderBottomWidth: '0.1875rem',
              backgroundColor: '#F3F3F3FE'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>Flat No.</div>
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>Status</div>
          </div>

          {/* Rows */}
          <div className="space-y-0 mt-[1rem]">
            {filteredFlatsData.length > 0 ? (
              filteredFlatsData.map((flat, index) => (
                <div
                  key={index}
                  className="grid gap-[8rem] py-[1.25rem] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                  style={{ gridTemplateColumns: '1fr 3fr' }}
                >
                  <button
                    onClick={() => handleFlatClick(flat)}
                    className={`text-base font-medium ${flat.color} font-montserrat text-left hover:underline cursor-pointer transition-all duration-200`}
                  >
                    {flat.flatNo}
                  </button>
                  <div className="text-base text-gray-700 font-montserrat">{flat.status}</div>
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