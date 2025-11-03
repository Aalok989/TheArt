import React, { useState, useEffect } from 'react';
import { HiUpload, HiEye, HiDownload, HiChevronLeft } from 'react-icons/hi';
import { fetchFlatLegalDocuments, fetchBlocks, fetchFlatStatus } from '../../api/mockData';
import FlatSelectionPopup from './FlatSelectionPopup';
import UploadDocumentPopup from './UploadDocumentPopup';

const FlatLegalDocs = ({ onPageChange }) => {
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]); // Store all documents
  const [loading, setLoading] = useState(true);
  const [isFlatSelectionOpen, setIsFlatSelectionOpen] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [selectedFlatInfo, setSelectedFlatInfo] = useState(null);
  
  // Selection form states for viewing documents
  // Check sessionStorage immediately to see if we should auto-select (for view from Flat page)
  const viewFlatNoFromStorage = sessionStorage.getItem('viewFlatNo');
  const viewBlockFromStorage = sessionStorage.getItem('viewBlock');
  const viewFromFlatFromStorage = sessionStorage.getItem('viewFromFlat');
  const viewLegalDocsFromStorage = sessionStorage.getItem('viewLegalDocs');
  const [selectedBlock, setSelectedBlock] = useState(viewBlockFromStorage || '');
  const [selectedFlat, setSelectedFlat] = useState(viewFlatNoFromStorage || '');
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState({});
  const [hasSelectedFlat, setHasSelectedFlat] = useState(viewFlatNoFromStorage && viewFromFlatFromStorage === 'true' && viewLegalDocsFromStorage === 'true' ? true : false); // Track if flat has been selected

  useEffect(() => {
    const getDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchFlatLegalDocuments();
        if (response.success) {
          setAllDocuments(response.data);
          
          // If we have view flags from Flat page, filter immediately
          const viewFlatNo = sessionStorage.getItem('viewFlatNo');
          const viewBlock = sessionStorage.getItem('viewBlock');
          const viewFromFlat = sessionStorage.getItem('viewFromFlat');
          const viewLegalDocs = sessionStorage.getItem('viewLegalDocs');
          
          if (viewFlatNo && viewFromFlat === 'true' && viewLegalDocs === 'true') {
            // Filter documents by selected flat
            const flatNo = `${viewBlock || 'A'}${viewFlatNo}`;
            const filteredDocs = response.data.filter(doc => 
              doc.flatNo === flatNo || doc.flatNo === `${viewBlock || 'A'}-${viewFlatNo}`
            );
            setDocuments(filteredDocs);
            console.log('FlatLegalDocs - Filtered documents immediately:', { block: viewBlock, flatNo: viewFlatNo, docCount: filteredDocs.length, constructedFlatNo: flatNo });
          } else {
            setDocuments(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching flat legal documents:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load blocks and flats for selection
    const loadSelectionData = async () => {
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
            // Extract just the flat number (remove block prefix if present)
            const flatNoOnly = flat.flatNo.replace(/^[A-Z]-?/, ''); // Remove block prefix like "A-" or "A"
            if (!flatsMap[flat.block].includes(flatNoOnly)) {
              flatsMap[flat.block].push(flatNoOnly);
            }
          });
          setFlats(flatsMap);
        }
      } catch (error) {
        console.error('Error loading selection data:', error);
      }
    };

    getDocuments();
    loadSelectionData();
  }, []);

  // Check for view flat number from Flat page - auto-select and show documents (runs after loading)
  useEffect(() => {
    if (loading) return; // Wait for loading to complete
    
    // Use a small delay to ensure component is fully rendered
    const timer = setTimeout(() => {
      // Check for view flat number from Flat page
      const viewFlatNo = sessionStorage.getItem('viewFlatNo');
      const viewBlock = sessionStorage.getItem('viewBlock');
      const viewFromFlat = sessionStorage.getItem('viewFromFlat');
      const viewLegalDocs = sessionStorage.getItem('viewLegalDocs');
      
      console.log('FlatLegalDocs - Checking view flags after load:', { viewFlatNo, viewBlock, viewFromFlat, viewLegalDocs, loading, allDocumentsLength: allDocuments.length });
      
      if (viewFlatNo && viewFromFlat === 'true' && viewLegalDocs === 'true' && allDocuments && allDocuments.length > 0) {
        // Set the selected block and flat
        setSelectedBlock(viewBlock || 'A');
        setSelectedFlat(viewFlatNo);
        
        // Filter documents by selected flat
        const flatNo = `${viewBlock || 'A'}${viewFlatNo}`;
        const filteredDocs = allDocuments.filter(doc => 
          doc.flatNo === flatNo || doc.flatNo === `${viewBlock || 'A'}-${viewFlatNo}`
        );
        setDocuments(filteredDocs);
        setHasSelectedFlat(true);
        
        // Clear the sessionStorage flags FIRST to prevent multiple checks
        sessionStorage.removeItem('viewFlatNo');
        sessionStorage.removeItem('viewBlock');
        sessionStorage.removeItem('viewFromFlat');
        sessionStorage.removeItem('viewLegalDocs');
        
        console.log('FlatLegalDocs - Auto-selected flat and showing documents:', { block: viewBlock, flatNo: viewFlatNo, docCount: filteredDocs.length, constructedFlatNo: flatNo });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [loading, allDocuments]);

  const handleUpload = () => {
    // If block and flat are already selected, use them directly
    if (selectedBlock && selectedFlat) {
      const flatInfo = {
        block: selectedBlock,
        flatNo: selectedFlat
      };
      setSelectedFlatInfo(flatInfo);
      setIsUploadPopupOpen(true);
    } else {
      // If not selected, show selection popup
      setIsFlatSelectionOpen(true);
    }
  };

  const handleFlatSelect = (flatInfo) => {
    setSelectedFlatInfo(flatInfo);
    setIsFlatSelectionOpen(false);
    setIsUploadPopupOpen(true);
  };

  // Handle Continue button for viewing documents
  const handleContinue = () => {
    if (!selectedBlock || !selectedFlat) {
      alert('Please select both Block and Flat No.');
      return;
    }
    
    // Filter documents by selected flat
    const flatNo = `${selectedBlock}${selectedFlat}`;
    const filteredDocs = allDocuments.filter(doc => 
      doc.flatNo === flatNo || doc.flatNo === `${selectedBlock}-${selectedFlat}`
    );
    setDocuments(filteredDocs);
    setHasSelectedFlat(true);
  };

  // Handle Reset button
  const handleReset = () => {
    setSelectedBlock('');
    setSelectedFlat('');
    setDocuments(allDocuments);
    setHasSelectedFlat(false);
  };

  // Handle back button - navigate back to Flat page if we came from there
  const handleBack = () => {
    const fromFlatPage = sessionStorage.getItem('fromFlatPage');
    const flatNoForBack = sessionStorage.getItem('flatNoForBack');
    
    // Clear view flags
    sessionStorage.removeItem('viewFlatNo');
    sessionStorage.removeItem('viewBlock');
    sessionStorage.removeItem('viewFromFlat');
    sessionStorage.removeItem('viewLegalDocs');
    sessionStorage.removeItem('fromFlatPage');
    
    if (fromFlatPage === 'true' && flatNoForBack && onPageChange) {
      // Store flat number for Flat page to restore
      sessionStorage.setItem('flatNo', flatNoForBack);
      sessionStorage.removeItem('flatNoForBack');
      // Navigate to Flat page
      onPageChange('flat');
    } else {
      // If not from Flat page, just reset to show selection form
      handleReset();
    }
  };

  const handleView = (doc) => {
    console.log('View document:', doc);
  };

  const handleDownload = (doc) => {
    console.log('Download document:', doc);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            Flat Legal Documents
          </h2>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
          <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-600">Loading flat legal documents...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show selection form if flat hasn't been selected
  if (!hasSelectedFlat) {
    return (
      <div className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            Flat Legal Documents
          </h2>
        </div>

        {/* Selection Form */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
          <div className="bg-white border border-gray-200 h-full flex items-center justify-center" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <div className="w-full max-w-md" style={{ padding: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              <h3 className="font-semibold text-gray-700 mb-6 text-center" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                Select Block and Flat
              </h3>
              
              <div className="space-y-4">
              {/* Block Selection */}
              <div>
                <label className="block font-medium text-gray-700 mb-2" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
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
              <div>
                <label className="block font-medium text-gray-700 mb-2" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
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

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  onClick={handleContinue}
                  className="bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 w-full"
                  style={{ 
                    paddingTop: 'clamp(0.5rem, 0.625rem, 0.75rem)', 
                    paddingBottom: 'clamp(0.5rem, 0.625rem, 0.75rem)', 
                    borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                    fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' 
                  }}
                >
                  Continue
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            {/* Back Button */}
            {(sessionStorage.getItem('fromFlatPage') === 'true') && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                style={{ width: 'clamp(2rem, 2.5rem, 3rem)', height: 'clamp(2rem, 2.5rem, 3rem)' }}
              >
                <HiChevronLeft style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} className="text-gray-600" />
              </button>
            )}
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
              Flat Legal Documents {selectedBlock && selectedFlat && `- Block ${selectedBlock} - Flat ${selectedFlat}`}
            </h2>
          </div>
          
          <div className="flex gap-2">
            {/* Reset Button */}
            <button 
              onClick={handleReset}
              className="bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
              style={{ 
                paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', 
                paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' 
              }}
            >
              Reset
            </button>
            
            {/* Upload Button */}
            <button 
              onClick={handleUpload}
              className="bg-green-500 text-white font-medium hover:bg-green-600 transition-colors duration-200 flex items-center"
              style={{ 
                paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', 
                paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', 
                gap: 'clamp(0.25rem, 0.375rem, 0.5rem)' 
              }}
            >
              <HiUpload style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
        <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          {/* Table Section */}
          <div className="flex-1 overflow-y-auto min-h-0">
        {/* Table Headers */}
        <div
          className="grid border-b sticky top-0 z-10 bg-white"
          style={{ 
            gridTemplateColumns: '0.5fr 1fr 2fr 1.5fr 1fr 1fr 1fr',
            gap: 'clamp(0.5rem, 1rem, 1.5rem)',
            paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
            paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
            borderBottomColor: '#616161',
            borderBottomWidth: '0.1875rem'
          }}
        >
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            SR. No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Flat No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Document Name
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Legal Type
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Upload Date
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Status
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Actions
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              style={{ 
                gridTemplateColumns: '0.5fr 1fr 2fr 1.5fr 1fr 1fr 1fr',
                gap: 'clamp(0.5rem, 1rem, 1.5rem)',
                paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)',
                paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)'
              }}
            >
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.srNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.flatNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.documentName}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.legalType}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.uploadDate}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                <span
                  style={{
                    backgroundColor: doc.status === 'Approved' ? '#E4FFE5' : '#FFF8D4',
                    color: doc.status === 'Approved' ? '#16A34A' : '#D97706',
                    padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                    borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                    fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  {doc.status}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
                <button
                  onClick={() => handleView(doc)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  title="View Document"
                >
                  <HiEye style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="text-green-600 hover:text-green-800 transition-colors duration-200"
                  title="Download Document"
                >
                  <HiDownload style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

          {/* No Results Message */}
          {documents.length === 0 && (
            <div className="text-center" style={{ paddingTop: 'clamp(1.5rem, 2rem, 2.5rem)', paddingBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              <p className="text-gray-500 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>No flat legal documents found.</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Flat Selection Popup */}
      <FlatSelectionPopup 
        isOpen={isFlatSelectionOpen}
        onClose={() => setIsFlatSelectionOpen(false)}
        onSelect={handleFlatSelect}
      />

      {/* Upload Document Popup */}
      <UploadDocumentPopup 
        isOpen={isUploadPopupOpen}
        onClose={() => {
          setIsUploadPopupOpen(false);
          setSelectedFlatInfo(null);
        }}
        documentType={`Documents - ${selectedFlatInfo?.block || ''}${selectedFlatInfo?.flatNo || ''}`}
      />
    </div>
  );
};

export default FlatLegalDocs;