import React, { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { fetchBlocks, fetchFlatStatus } from '../../api/mockData';

const FlatSelectionPopup = ({ isOpen, onClose, onSelect }) => {
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [blocksRes, flatStatusRes] = await Promise.all([
          fetchBlocks(),
          fetchFlatStatus()
        ]);
        
        if (blocksRes.success) {
          setBlocks(blocksRes.data || []);
        }
        
        if (flatStatusRes.success && flatStatusRes.data) {
          const flatsMap = {};
          (flatStatusRes.data.flats || []).forEach(flat => {
            if (!flatsMap[flat.block]) {
              flatsMap[flat.block] = [];
            }
            if (!flatsMap[flat.block].includes(flat.flatNo)) {
              flatsMap[flat.block].push(flat.flatNo);
            }
          });
          setFlats(flatsMap);
        }
      } catch (error) {
        console.error('Error loading flat selection data:', error);
      }
    };
    
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleProceed = () => {
    if (!selectedBlock || !selectedFlat) {
      alert('Please select both Block and Flat No.');
      return;
    }

    onSelect({ block: selectedBlock, flatNo: selectedFlat });
    
    // Reset selections
    setSelectedBlock('');
    setSelectedFlat('');
  };

  const handleCancel = () => {
    setSelectedBlock('');
    setSelectedFlat('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleCancel}
      ></div>

      {/* Popup */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl z-50" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', width: 'clamp(20rem, 28rem, 32rem)', maxWidth: '90vw' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
            Select Block & Flat
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiX style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* Block Selection */}
          <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Select Block <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setSelectedFlat(''); // Reset flat selection when block changes
              }}
              className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ 
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', 
                fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' 
              }}
            >
              <option value="">Select Block</option>
              {blocks.map((block) => (
                <option key={block} value={block}>
                  Block {block}
                </option>
              ))}
            </select>
          </div>

          {/* Flat Selection */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Select Flat No. <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedFlat}
              onChange={(e) => setSelectedFlat(e.target.value)}
              disabled={!selectedBlock}
              className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ 
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', 
                fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' 
              }}
            >
              <option value="">
                {selectedBlock ? 'Select Flat No.' : 'Select Block First'}
              </option>
              {selectedBlock && flats[selectedBlock]?.map((flat) => (
                <option key={flat} value={flat}>
                  {flat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors duration-200"
              style={{ 
                paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingRight: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' 
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200"
              style={{ 
                paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingRight: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' 
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlatSelectionPopup;
