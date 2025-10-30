import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { fetchFlatStatus } from '../../api/mockData';

const FlatSummary = ({ onPageChange }) => {
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flatStatusData, setFlatStatusData] = useState(null);
  const [selectedFlatDetails, setSelectedFlatDetails] = useState(null);
  const [isFlatDetailsOpen, setIsFlatDetailsOpen] = useState(false);
  
  const floorScrollRef = useRef(null);
  const blockScrollRef = useRef(null);
  const sizeScrollRef = useRef(null);
  
  useEffect(() => {
    const getFlatStatus = async () => {
      try {
        setLoading(true);
        const response = await fetchFlatStatus();
        if (response.success) {
          setFlatStatusData(response.data);
        }
      } catch (error) {
        console.error('Error fetching flat summary:', error);
      } finally {
        setLoading(false);
      }
    };

    getFlatStatus();
  }, []);
  
  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? ref.current.scrollLeft - scrollAmount 
        : ref.current.scrollLeft + scrollAmount;
      
      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAll = () => {
    setSelectedFloor(null);
    setSelectedBlock(null);
    setSelectedSize(null);
  };

  const handleFlatClick = (flat) => {
    sessionStorage.setItem('selectedFlat', JSON.stringify(flat));
    if (onPageChange) {
      onPageChange('flat');
    }
  };

  const closeFlatDetails = () => {
    setIsFlatDetailsOpen(false);
    setSelectedFlatDetails(null);
  };

  const filteredFlatsData = useMemo(() => {
    if (!flatStatusData) return [];
    const allFlatsData = flatStatusData.flats;
    let filtered = allFlatsData;

    if (selectedFloor !== null) {
      filtered = filtered.filter(flat => flat.floor === selectedFloor);
    }
    if (selectedBlock !== null) {
      filtered = filtered.filter(flat => flat.block === selectedBlock);
    }
    if (selectedSize !== null) {
      filtered = filtered.filter(flat => flat.size === selectedSize);
    }

    return filtered;
  }, [flatStatusData, selectedFloor, selectedBlock, selectedSize]);

  if (loading || !flatStatusData) {
    return (
      <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-md w-full items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading flat summary...</p>
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
      {/* LEFT SECTION — FLAT SUMMARY (filters) */}
      <div className="w-full lg:w-[20%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Flat Summary</h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" style={{ paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="space-y-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(prev => (prev === size ? null : size))}
                className={`w-full text-left rounded-md transition-colors duration-200 px-3 py-2 font-montserrat text-sm ${
                  selectedSize === size ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={size}
              >
                <span className="block truncate">{size}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — SUMMARY TABLE */}
      <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
            Flats Summary{selectedSize ? ` - ${selectedSize}` : ''}
          </h2>
        </div>

        {(() => {
          const computeStatsForFloor = (floor) => {
            const items = filteredFlatsData.filter(f => f.floor === floor);
            const booked = items.filter(f => f.status === 'Booked').length;
            const vacant = items.filter(f => f.status === 'Vacant').length;
            const blocked = items.filter(f => f.status === 'Blocked').length;
            const others = items.filter(f => f.status !== 'Booked' && f.status !== 'Vacant' && f.status !== 'Blocked').length;
            const total = items.length;
            return { booked, vacant, blocked, others, total };
          };

          const rows = (floors || []).map((floor) => ({ floor, ...computeStatsForFloor(floor) }));

          return (
            <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm font-semibold bg-blue-200 text-gray-800">
                    <th className="border border-gray-300 px-3 py-2">Floor No.</th>
                    <th className="border border-gray-300 px-3 py-2">Booked</th>
                    <th className="border border-gray-300 px-3 py-2">Vacant</th>
                    <th className="border border-gray-300 px-3 py-2">Blocked</th>
                    <th className="border border-gray-300 px-3 py-2">Others</th>
                    <th className="border border-gray-300 px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className="text-sm bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2">{r.floor}</td>
                      <td className="border border-gray-300 px-3 py-2">{r.booked}</td>
                      <td className="border border-gray-300 px-3 py-2">{r.vacant}</td>
                      <td className="border border-gray-300 px-3 py-2">{r.blocked}</td>
                      <td className="border border-gray-300 px-3 py-2">{r.others}</td>
                      <td className="border border-gray-300 px-3 py-2">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
    </>
  );
};

export default FlatSummary;


