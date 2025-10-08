import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";

const UploadLoanDoc = ({ onPageChange }) => {
  const [kycId, setKycId] = useState("TA76967SKV");
  const [employmentType, setEmploymentType] = useState("");

  // Document lists based on employment type
  const salariedDocuments = [
    "6 Photos",
    "Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)",
    "ID Proof (PAN card mandatory/Company Id Card)",
    "Last 3 Years ITR",
    "Form 16 of 3 years",
    "Bank Statement (12 months current)",
    "Salary Slip (6 months for salaried)",
    "Utility Bill (electricity bill, telephone bill, gas connection)",
    "LIC detail/Prop. Details",
    "Credit Card Statement",
    "Rent Agreement/Owner Electricity bill",
    "Visiting Card",
  ];

  const selfEmployedDocuments = [
    "6 Photos",
    "Address Proof (Voter Id Card/Passport/electricity bill/bank statement/Aadhar Card)",
    "ID Proof (PAN card mandatory/Company Id Card)",
    "ITR (3 years with balance sheet, computation P&L)",
    "Bank Statement (12 months current)",
    "Utility Bill (electricity bill, telephone bill, gas connection)",
    "LIC detail/Prop. Details",
    "Credit Card Statement",
    "Rent Agreement/Owner Electricity bill",
    "Builder Buyer Agreement",
    "Receipt/ Payment Schedule CLP",
    "Asset/Liabilities",
    "Visiting Card",
    "Tin No. PhotoCopy",
    "Bill of Firm",
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log("KYC ID:", kycId);
    console.log("Employment Type:", employmentType);
    // Add submission logic here
  };

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header Section with Back Button */}
      <div className="flex items-center" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)', gap: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
        <button
          onClick={() => onPageChange && onPageChange("loanDocuments")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <HiArrowLeft style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
        </button>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
          Upload Loan Document
        </h2>
      </div>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div className="bg-white border border-gray-200 max-w-2xl mx-auto" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* KYC ID Field */}
          <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            <label className="block font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', marginBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
              Enter KYC Id
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
              Please Select
            </label>
            <div className="flex" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
              <label className="flex items-center cursor-pointer">
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
                  className="text-blue-600 focus:ring-blue-500"
                  style={{ marginRight: 'clamp(0.375rem, 0.5rem, 0.625rem)', width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                />
                <span className="text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Salaried</span>
              </label>
              <label className="flex items-center cursor-pointer">
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
                    ? salariedDocuments
                    : selfEmployedDocuments
                  ).map((doc, index) => (
                    <div key={index} className="flex items-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
                      <span className="font-medium text-gray-600 text-right" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', width: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
                        {index + 1}.
                      </span>
                      <input
                        type="checkbox"
                        id={`doc-${index}`}
                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        style={{ width: 'clamp(0.875rem, 1rem, 1.125rem)', height: 'clamp(0.875rem, 1rem, 1.125rem)' }}
                      />
                      <label
                        htmlFor={`doc-${index}`}
                        className="text-gray-700 cursor-pointer flex-1"
                        style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                      >
                        {doc}
                      </label>
                    </div>
                  ))}
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
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLoanDoc;
