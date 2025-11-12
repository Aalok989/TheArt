import React, { useState, useEffect } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { fetchLoanDocumentLists, updateLoanDocuments } from "../../api/mockData";

const UploadLoanDoc = ({ onPageChange }) => {
  const [kycId, setKycId] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [documentLists, setDocumentLists] = useState({
    salariedDocuments: [],
    selfEmployedDocuments: []
  });
  const [loading, setLoading] = useState(true);
  const [checkedDocuments, setCheckedDocuments] = useState({
    salaried: {},
    selfEmployed: {}
  });
  const [viewMode, setViewMode] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [flatNo, setFlatNo] = useState("");
  const [documentsReceived, setDocumentsReceived] = useState("No");

  useEffect(() => {
    const getDocumentLists = async () => {
      try {
        setLoading(true);
        const response = await fetchLoanDocumentLists();
        if (response.success) {
          setDocumentLists(response.data);
        }
      } catch (error) {
        console.error('Error fetching loan document lists:', error);
      } finally {
        setLoading(false);
      }
    };

    getDocumentLists();

    // Check if we're in view mode from sessionStorage
    const loanDetails = sessionStorage.getItem('loanDocumentDetails');
    if (loanDetails) {
      try {
        const details = JSON.parse(loanDetails);
        setKycId(details.kycId || "");
        setEmploymentType(details.employmentType || "");
        setFlatNo(details.flatNo || "");
        setDocumentsReceived(details.documentsReceived || "No");
        if (details.documentsReceived === 'Yes') {
          setViewMode(true);
          setUploadedDocuments(details.uploadedDocuments || []);
        }
      } catch (error) {
        console.error('Error parsing loan document details:', error);
      }
    }
  }, []);

  // Pre-check uploaded documents in view mode
  useEffect(() => {
    if (viewMode && employmentType && uploadedDocuments.length > 0 && 
        (documentLists.salariedDocuments.length > 0 || documentLists.selfEmployedDocuments.length > 0)) {
      const currentDocList = employmentType === "salaried" 
        ? documentLists.salariedDocuments 
        : documentLists.selfEmployedDocuments;
      
      const checked = {};
      currentDocList.forEach((doc, index) => {
        if (uploadedDocuments.includes(doc)) {
          checked[index] = true;
        }
      });
      
      setCheckedDocuments(prev => ({
        salaried: {},
        selfEmployed: {},
        [employmentType]: checked
      }));
    } else if (employmentType && !viewMode) {
      // Clear checked documents when employment type changes in edit mode
      setCheckedDocuments({
        salaried: {},
        selfEmployed: {}
      });
    }
  }, [employmentType, viewMode, uploadedDocuments, documentLists.salariedDocuments.length, documentLists.selfEmployedDocuments.length]);

  const handleCheckboxChange = (index, type) => {
    setCheckedDocuments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [index]: !prev[type][index]
      }
    }));
  };

  const handleSubmit = async () => {
    // Get list of checked document names
    const currentDocList = employmentType === "salaried" 
      ? documentLists.salariedDocuments 
      : documentLists.selfEmployedDocuments;
    
    const selectedDocs = [];
    Object.keys(checkedDocuments[employmentType] || {}).forEach(index => {
      if (checkedDocuments[employmentType][index]) {
        selectedDocs.push(currentDocList[index]);
      }
    });

    // Update the loan documents
    if (flatNo && kycId && employmentType && selectedDocs.length > 0) {
      try {
        const response = await updateLoanDocuments(flatNo, kycId, employmentType, selectedDocs);
        if (response.success) {
          alert('Documents submitted successfully!');
          sessionStorage.removeItem('loanDocumentDetails');
          if (onPageChange) {
            onPageChange('loanDocuments');
          }
        } else {
          alert('Failed to submit documents');
        }
      } catch (error) {
        console.error('Error updating loan documents:', error);
        alert('An error occurred while submitting documents');
      }
    } else {
      alert('Please fill all fields and select at least one document');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading document lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:p-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section with Back Button */}
      <div className="flex items-center" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
        <button
          onClick={() => {
            sessionStorage.removeItem('loanDocumentDetails');
            onPageChange && onPageChange("loanDocuments");
          }}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <HiArrowLeft style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
        </button>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          {viewMode ? 'View Loan Document' : 'Upload Loan Document'}
        </h2>
      </div>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div className="bg-white border border-gray-200 max-w-2xl mx-auto" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* KYC ID Field */}
          <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              {viewMode ? 'KYC Id' : 'Enter KYC Id'}
            </label>
            <input
              type="text"
              value={kycId}
              onChange={(e) => setKycId(e.target.value)}
              className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)', paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)', paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}
              placeholder="Enter KYC ID"
            />
          </div>

          {/* Employment Type Selection */}
          <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              {viewMode ? 'Employment Type' : 'Please Select'}
            </label>
            <div className="flex" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
              <label className={`flex items-center ${viewMode && employmentType !== "salaried" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={employmentType === "salaried"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEmploymentType("salaried");
                    } else {
                      setEmploymentType("");
                    }
                  }}
                  disabled={viewMode && employmentType !== "salaried"}
                  className="text-blue-600 focus:ring-blue-500"
                  style={{ marginRight: 'clamp(0.375rem, 0.5rem, 0.625rem)', width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                />
                <span className="text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Salaried</span>
              </label>
              <label className={`flex items-center ${viewMode && employmentType !== "selfEmployed" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={employmentType === "selfEmployed"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEmploymentType("selfEmployed");
                    } else {
                      setEmploymentType("");
                    }
                  }}
                  disabled={viewMode && employmentType !== "selfEmployed"}
                  className="text-blue-600 focus:ring-blue-500"
                  style={{ marginRight: 'clamp(0.375rem, 0.5rem, 0.625rem)', width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                />
                <span className="text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Self Employed</span>
              </label>
            </div>
          </div>

          {/* Document Checklist */}
          {employmentType && (
            <div style={{ marginBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              <h3 className="font-semibold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.25rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
                Required Documents (
                {employmentType === "salaried" ? "Salaried" : "Self Employed"})
              </h3>
              <div className="bg-gray-50 border border-gray-200 overflow-y-auto" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.25rem)', maxHeight: 'clamp(18rem, 20rem, 22rem)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                  {(employmentType === "salaried"
                    ? documentLists.salariedDocuments
                    : documentLists.selfEmployedDocuments
                  ).map((doc, index) => {
                    const currentType = employmentType === "salaried" ? "salaried" : "selfEmployed";
                    return (
                      <div key={index} className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                        <span className="font-medium text-gray-600 text-right" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', width: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
                          {index + 1}.
                        </span>
                        <input
                          type="checkbox"
                          id={`doc-${currentType}-${index}`}
                          checked={checkedDocuments[currentType][index] || false}
                          onChange={() => handleCheckboxChange(index, currentType)}
                          className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                        />
                        <label
                          htmlFor={`doc-${currentType}-${index}`}
                          className="text-gray-700 cursor-pointer flex-1"
                          style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                        >
                          {doc}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!employmentType}
              className="bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ paddingLeft: 'clamp(1.5rem, 2rem, 2.5rem)', paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)', paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)', paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)', borderRadius: 'clamp(0.25rem, 0.375rem, 0.5rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
              {viewMode ? 'Update' : 'submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLoanDoc;
