import React, { useState, useEffect } from 'react';
import { HiUpload, HiEye, HiDownload } from 'react-icons/hi';
import { fetchLegalDocuments } from '../../api/mockData';
import UploadDocumentPopup from './UploadDocumentPopup';

const LegalDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchLegalDocuments();
        if (response.success) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error('Error fetching legal documents:', error);
      } finally {
        setLoading(false);
      }
    };

    getDocuments();
  }, []);

  const handleUpload = () => {
    setIsUploadPopupOpen(true);
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
            Legal Documents
          </h2>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
          <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-600">Loading legal documents...</p>
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
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          Legal Documents
        </h2>

        {/* Upload Button */}
        <div className="flex justify-end">
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

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
        <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          {/* Table Section */}
          <div className="flex-1 overflow-y-auto min-h-0">
        {/* Table Headers */}
        <div
          className="grid border-b sticky top-0 z-10 bg-white"
          style={{ 
            gridTemplateColumns: '0.5fr 2fr 1fr 1.5fr 1fr 1fr 1fr',
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
            Document Name
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Type
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Category
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
                gridTemplateColumns: '0.5fr 2fr 1fr 1.5fr 1fr 1fr 1fr',
                gap: 'clamp(0.5rem, 1rem, 1.5rem)',
                paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)',
                paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)'
              }}
            >
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.srNo}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.documentName}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.type}
              </div>
              <div style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                {doc.category}
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
              <p className="text-gray-500 font-montserrat" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>No legal documents found.</p>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Upload Document Popup */}
      <UploadDocumentPopup 
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
        documentType="Legal Document"
      />
    </div>
  );
};

export default LegalDocs;