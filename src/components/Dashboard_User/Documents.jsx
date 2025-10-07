import React, { useState, useEffect } from 'react';
import { HiSearch, HiChevronDown } from 'react-icons/hi';
import documentsIcon from '../../assets/doc.png';
import { fetchDocuments } from '../../api/mockData';

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [sortBy, setSortBy] = useState('Select');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch documents data
    const getDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchDocuments();
        if (response.success) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    getDocuments();
  }, []);

  // Loading state
  if (loading || !documents) {
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
    <div className="h-full flex flex-col p-[1.5rem]">
      {/* Header Section */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-[1.5rem] space-y-4 lg:space-y-0">
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800">Documents</h2>
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
                  <option value="Date">Date</option>
                  <option value="Name">Name</option>
                  <option value="Type">Type</option>
                </select>
                <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-[2.5rem] pr-3 focus:outline-none w-full sm:w-[10rem]"
                style={{
                  backgroundColor: '#EFF1F6',
                  borderRadius: '0.5rem',
                  height: '2.5rem',
                  fontFamily: 'Montserrat',
                  fontSize: '1rem',
                  color: '#313131',
                }}
              />
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-[1rem] h-[1rem] text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 space-y-[1.5rem] overflow-y-auto pr-[1rem] min-h-0">
        {/* Documents Table */}
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
            DOCUMENTS
          </h3>

          {/* Table Headers */}
          <div
            className="grid gap-[1rem] py-[1rem] border-b border-gray-200"
            style={{ gridTemplateColumns: '1fr 2fr 1fr' }}
          >
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
              S. No.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8C8C8C', fontWeight: 'bold' }}>
              File Name
            </div>
            <div
              style={{
                fontSize: '0.75rem',
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
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="grid gap-[1rem] py-[1rem] border-b border-gray-200 last:border-b-0"
                style={{ gridTemplateColumns: '1fr 2fr 1fr' }}
              >
                <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: '1rem', color: '#000000', fontWeight: '400' }}>
                  {doc.fileName}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#000000',
                    fontWeight: '400',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={documentsIcon}
                    alt="Document"
                    className="w-[1.5rem] h-[1.5rem] mx-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
