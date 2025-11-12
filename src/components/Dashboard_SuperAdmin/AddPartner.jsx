import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

const AddPartner = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
    // Main Form Fields
    dealerId: '',
    name: '',
    fatherHusbandName: '',
    dateOfBirth: '',
    residentialAddress: '',
    cityName: '',
    state: '',
    pinCode: '',
    companyName: '',
    companyAddress: '',
    profession: '',
    designation: '',
    emailId: '',
    phoneNumber1: '',
    phoneNumber2: '',
    panNo: '',
    nationality: '',
    accountNumber: '',
    bankName: '',
    // Nominee Details
    nomineeName: '',
    nomineeEmail: '',
    nomineePhoneNumber: '',
    nomineePanNo: '',
    nomineeFatherHusbandName: '',
    nomineeDateOfBirth: '',
    nomineeAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Indian states list
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.dealerId.trim()) newErrors.dealerId = 'Dealer ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.fatherHusbandName.trim()) newErrors.fatherHusbandName = 'Father/Husband Name is required';
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = 'Residential Address is required';
    if (!formData.cityName.trim()) newErrors.cityName = 'City Name is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin Code is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!formData.companyAddress.trim()) newErrors.companyAddress = 'Company Address is required';
    if (!formData.emailId.trim()) newErrors.emailId = 'Email ID is required';
    if (!formData.phoneNumber1.trim()) newErrors.phoneNumber1 = 'Phone Number1 is required';
    if (!formData.panNo.trim()) newErrors.panNo = 'PAN No. is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    
    // Nominee required fields
    if (!formData.nomineePanNo.trim()) newErrors.nomineePanNo = 'Nominee PAN No. is required';
    if (!formData.nomineeFatherHusbandName.trim()) newErrors.nomineeFatherHusbandName = 'Nominee Father/Husband Name is required';
    if (!formData.nomineeDateOfBirth.trim()) newErrors.nomineeDateOfBirth = 'Nominee Date of Birth is required';
    if (!formData.nomineeAddress.trim()) newErrors.nomineeAddress = 'Nominee Address is required';
    
    // Email validation
    if (formData.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Invalid email format';
    }
    if (formData.nomineeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.nomineeEmail)) {
      newErrors.nomineeEmail = 'Invalid email format';
    }
    
    // Phone validation (10 digits)
    if (formData.phoneNumber1 && !/^\d{10}$/.test(formData.phoneNumber1.replace(/\D/g, ''))) {
      newErrors.phoneNumber1 = 'Phone number must be 10 digits';
    }
    if (formData.phoneNumber2 && !/^\d{10}$/.test(formData.phoneNumber2.replace(/\D/g, ''))) {
      newErrors.phoneNumber2 = 'Phone number must be 10 digits';
    }
    if (formData.nomineePhoneNumber && !/^\d{10}$/.test(formData.nomineePhoneNumber.replace(/\D/g, ''))) {
      newErrors.nomineePhoneNumber = 'Phone number must be 10 digits';
    }
    
    // PAN validation (10 characters alphanumeric)
    if (formData.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo.toUpperCase())) {
      newErrors.panNo = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    if (formData.nomineePanNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.nomineePanNo.toUpperCase())) {
      newErrors.nomineePanNo = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Call API to create channel partner
      console.log('Channel Partner Data:', formData);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setFormData({
          dealerId: '',
          name: '',
          fatherHusbandName: '',
          dateOfBirth: '',
          residentialAddress: '',
          cityName: '',
          state: '',
          pinCode: '',
          companyName: '',
          companyAddress: '',
          profession: '',
          designation: '',
          emailId: '',
          phoneNumber1: '',
          phoneNumber2: '',
          panNo: '',
          nationality: '',
          accountNumber: '',
          bankName: '',
          nomineeName: '',
          nomineeEmail: '',
          nomineePhoneNumber: '',
          nomineePanNo: '',
          nomineeFatherHusbandName: '',
          nomineeDateOfBirth: '',
          nomineeAddress: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating channel partner:', error);
      alert('Failed to create channel partner. Please try again.');
    }
  };

  const handleStateSelect = (state) => {
    handleInputChange('state', state);
    setShowStateDropdown(false);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          Add New Channel Partner
        </h2>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {showSuccessMessage ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6 max-w-md">
                <div className="mb-3">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-1.5">Channel Partner Added Successfully</h3>
                <p className="text-green-600 text-sm">The channel partner has been added successfully.</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full p-6">
              {/* Main Form Section */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.25rem)' }}>
                  Channel Partner Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Dealer ID */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        DealerID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.dealerId}
                        onChange={(e) => handleInputChange('dealerId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.dealerId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dealerId && (
                        <p className="text-red-500 text-xs mt-1">{errors.dealerId}</p>
                      )}
                    </div>

                    {/* Father/Husband Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Father/ Husband Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fatherHusbandName}
                        onChange={(e) => handleInputChange('fatherHusbandName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.fatherHusbandName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.fatherHusbandName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fatherHusbandName}</p>
                      )}
                    </div>

                    {/* Residential Address */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Residential Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.residentialAddress}
                        onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm ${
                          errors.residentialAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.residentialAddress && (
                        <p className="text-red-500 text-xs mt-1">{errors.residentialAddress}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        State
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowStateDropdown(!showStateDropdown)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                        >
                          <span className={formData.state ? 'text-gray-900' : 'text-gray-400'}>
                            {formData.state || '--Select State--'}
                          </span>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showStateDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {states.map((state) => (
                              <button
                                key={state}
                                type="button"
                                onClick={() => handleStateSelect(state)}
                                className="w-full px-3 py-2 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-sm"
                              >
                                {state}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                      )}
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Profession
                      </label>
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Email Id */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Email Id <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.emailId}
                        onChange={(e) => handleInputChange('emailId', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.emailId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.emailId && (
                        <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
                      )}
                    </div>

                    {/* Phone Number 2 */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Phone Number2
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber2}
                        onChange={(e) => handleInputChange('phoneNumber2', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.phoneNumber2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={10}
                      />
                      {errors.phoneNumber2 && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber2}</p>
                      )}
                    </div>

                    {/* Nationality */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                      />
                    </div>

                    {/* City Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        City Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cityName}
                        onChange={(e) => handleInputChange('cityName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.cityName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cityName && (
                        <p className="text-red-500 text-xs mt-1">{errors.cityName}</p>
                      )}
                    </div>

                    {/* Pin Code */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Pin Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pinCode}
                        onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.pinCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={6}
                      />
                      {errors.pinCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
                      )}
                    </div>

                    {/* Company Address */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Company Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm ${
                          errors.companyAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.companyAddress && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyAddress}</p>
                      )}
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Phone Number 1 */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Phone Number1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber1}
                        onChange={(e) => handleInputChange('phoneNumber1', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.phoneNumber1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={10}
                      />
                      {errors.phoneNumber1 && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber1}</p>
                      )}
                    </div>

                    {/* PAN No. */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        PAN No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.panNo}
                        onChange={(e) => handleInputChange('panNo', e.target.value.toUpperCase().slice(0, 10))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.panNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                      />
                      {errors.panNo && (
                        <p className="text-red-500 text-xs mt-1">{errors.panNo}</p>
                      )}
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nominee Details Section */}
              <div className="border-t border-gray-300 pt-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.25rem)' }}>
                  Nominee Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Column - Nominee */}
                  <div className="space-y-4">
                    {/* Nominee Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.nomineeName}
                        onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Nominee Email */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.nomineeEmail}
                        onChange={(e) => handleInputChange('nomineeEmail', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.nomineeEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nomineeEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineeEmail}</p>
                      )}
                    </div>

                    {/* Nominee Phone Number */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.nomineePhoneNumber}
                        onChange={(e) => handleInputChange('nomineePhoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.nomineePhoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={10}
                      />
                      {errors.nomineePhoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineePhoneNumber}</p>
                      )}
                    </div>

                    {/* Nominee PAN No. */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        PAN No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nomineePanNo}
                        onChange={(e) => handleInputChange('nomineePanNo', e.target.value.toUpperCase().slice(0, 10))}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.nomineePanNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                      />
                      {errors.nomineePanNo && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineePanNo}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Nominee */}
                  <div className="space-y-4">
                    {/* Nominee Father/Husband Name */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Father/Husband Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nomineeFatherHusbandName}
                        onChange={(e) => handleInputChange('nomineeFatherHusbandName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm ${
                          errors.nomineeFatherHusbandName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nomineeFatherHusbandName && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineeFatherHusbandName}</p>
                      )}
                    </div>

                    {/* Nominee Date of Birth */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.nomineeDateOfBirth}
                        onChange={(e) => handleInputChange('nomineeDateOfBirth', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white ${
                          errors.nomineeDateOfBirth ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nomineeDateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineeDateOfBirth}</p>
                      )}
                    </div>

                    {/* Nominee Address */}
                    <div>
                      <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.nomineeAddress}
                        onChange={(e) => handleInputChange('nomineeAddress', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm ${
                          errors.nomineeAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.nomineeAddress && (
                        <p className="text-red-500 text-xs mt-1">{errors.nomineeAddress}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-300">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                >
                  Add Partner
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showStateDropdown && (
        <div
          className="fixed inset-0 z-[1]"
          onClick={() => setShowStateDropdown(false)}
        />
      )}
    </div>
  );
};

export default AddPartner;

