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
    <div className="h-full flex flex-col p-[1.5rem]">
      {/* Header Section with Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => onPageChange && onPageChange("loanDocuments")}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-gray-800">
          Upload Loan Document
        </h2>
      </div>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto pr-[1rem] min-h-0">
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl mx-auto">
          {/* KYC ID Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter KYC Id
            </label>
            <input
              type="text"
              value={kycId}
              onChange={(e) => setKycId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter KYC ID"
            />
          </div>

          {/* Employment Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Please Select
            </label>
            <div className="flex gap-6">
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
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Salaried</span>
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
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Self Employed</span>
              </label>
            </div>
          </div>

          {/* Document Checklist */}
          {employmentType && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Required Documents (
                {employmentType === "salaried" ? "Salaried" : "Self Employed"})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-80 overflow-y-auto">
                <div className="space-y-3">
                  {(employmentType === "salaried"
                    ? salariedDocuments
                    : selfEmployedDocuments
                  ).map((doc, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-6 text-right">
                        {index + 1}.
                      </span>
                      <input
                        type="checkbox"
                        id={`doc-${index}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`doc-${index}`}
                        className="text-sm text-gray-700 cursor-pointer flex-1"
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
              className="px-8 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
