import React, { useState, useEffect } from 'react';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import documentsIcon from '../../assets/doc.png';
import { customerAPI } from '../../api/api';

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [sortBy, setSortBy] = useState('Select');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch documents data
  const getDocuments = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getDocuments(); // Updated to use real API
      if (response.success) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  // Animation effect after data is loaded
  useEffect(() => {
    if (!loading && documents !== null) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, documents]);

  // Search filter
  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'Select') return 0;
    
    switch (sortBy) {
      case 'Date':
        // Assuming future field like doc.date; fallback to index
        return 0; // Placeholder if no date
      case 'Name':
        return a.fileName.localeCompare(b.fileName);
      case 'Type':
        // Assuming future field like doc.type
        return 0; // Placeholder
      default:
        return 0;
    }
  });

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800 animate-slide-in-down" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Documents</h2>
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
                  <option value="Date">Date</option>
                  <option value="Name">Name</option>
                  <option value="Type">Type</option>
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
                className="border border-gray-300 focus:outline-none w-full hover-scale btn-animate"
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
      <div className="flex-1 overflow-y-auto min-h-0 section-animate animate-delay-300" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        {/* Documents Table */}
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
            DOCUMENTS
          </h3>

          {/* Table Headers */}
          <div
            className="grid border-b border-gray-200"
            style={{ gridTemplateColumns: '1fr 2fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
          >
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              S. No.
            </div>
            <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
              File Name
            </div>
            <div
              style={{
                fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)',
                color: '#8C8C8C',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Document
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {sortedDocuments.length > 0 ? (
              sortedDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  className="grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  style={{ gridTemplateColumns: '1fr 2fr 1fr', gap: 'clamp(0.5rem, 1rem, 1.5rem)', paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
                >
                  <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                    {doc.fileName}
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(0.875rem, 1rem, 1.125rem)',
                      color: '#000000',
                      fontWeight: '400',
                      textAlign: 'center',
                    }}
                  >
                    <img
                      src={documentsIcon}
                      alt="Document"
                      className="mx-auto hover-scale btn-animate cursor-pointer"
                      style={{ width: 'clamp(1.25rem, 1.5rem, 1.75rem)', height: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}
                      onClick={() => window.open(doc.fileUrl, '_blank')} // Assuming future fileUrl; adjust when data arrives
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                No documents available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;