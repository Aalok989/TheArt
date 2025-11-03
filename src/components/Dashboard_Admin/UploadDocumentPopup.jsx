import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiUpload } from 'react-icons/hi';

const UploadDocumentPopup = ({ isOpen, onClose, documentType = "Document" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');

  // Log when popup should be visible
  useEffect(() => {
    console.log('UploadDocumentPopup - isOpen changed:', isOpen, 'documentType:', documentType);
  }, [isOpen, documentType]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !documentName) {
      alert('Please fill all required fields');
      return;
    }

    console.log('Uploading:', {
      file: selectedFile,
      documentName,
      category,
      documentType
    });

    // Reset form
    setSelectedFile(null);
    setDocumentName('');
    setCategory('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDocumentName('');
    setCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 99999 }}
        onClick={handleCancel}
      >
        {/* Popup */}
        <div 
          className="bg-white shadow-xl relative"
          style={{ 
            borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', 
            width: 'clamp(20rem, 30rem, 35rem)', 
            maxWidth: '90vw', 
            maxHeight: '90vh', 
            overflow: 'auto',
            zIndex: 100000
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
            Upload {documentType}
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
          {/* Document Name */}
          <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Document Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ 
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', 
                fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' 
              }}
              placeholder="Enter document name"
            />
          </div>

          {/* Category (Optional) */}
          <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Category (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ 
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', 
                fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' 
              }}
              placeholder="Enter category"
            />
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Select File <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <HiUpload className="text-gray-400" style={{ width: 'clamp(2rem, 3rem, 4rem)', height: 'clamp(2rem, 3rem, 4rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }} />
                <p className="text-gray-600 text-center" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)', marginBottom: 'clamp(0.25rem, 0.375rem, 0.5rem)' }}>
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-400 text-center" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                  PDF, DOC, DOCX, JPG, PNG (max. 10MB)
                </p>
              </label>
            </div>
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
              onClick={handleSubmit}
              className="bg-green-500 text-white font-medium hover:bg-green-600 transition-colors duration-200"
              style={{ 
                paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingRight: 'clamp(1rem, 1.5rem, 2rem)', 
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                borderRadius: 'clamp(0.375rem, 0.5rem, 0.625rem)', 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' 
              }}
            >
              Upload Document
            </button>
          </div>
        </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default UploadDocumentPopup;
