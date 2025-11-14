import React, { useState, useMemo, useRef } from 'react';
import { HiX, HiPhotograph, HiTrash, HiCloudUpload } from 'react-icons/hi';

const STEP_META = {
  personal: {
    title: 'Personal Information',
    subtitle: 'Enter user basic and contact details.'
  },
  address: {
    title: 'Address Details',
    subtitle: 'Provide residential address information.'
  },
  professional: {
    title: 'Professional Detail',
    subtitle: 'Add job, role, and professional identifiers.'
  },
  bank: {
    title: 'Bank Details',
    subtitle: 'Enter salary payout banking information.'
  },
  assignment: {
    title: 'Assign Company',
    subtitle: 'Map the user to a company and responsibilities.'
  },
  documents: {
    title: 'Signature & Documents',
    subtitle: 'Upload signature sample and important documents.'
  }
};

const AVAILABLE_COMPANIES = [
  'The Art Estates',
  'ABC Developers',
  'Metro Constructions',
  'Golden Properties',
  'Premier Builders'
];

const AddUser = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profileImage: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
  professional: {
    employeeId: '',
    panNumber: '',
    aadharNumber: '',
    gstNumber: '',
    reraNumber: '',
    dateOfAssigning: '',
    notes: ''
  },
    bank: {
      accountName: '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      branch: '',
      upiId: ''
    },
  assignment: {
    company: '',
    notes: ''
  },
    signature: null
  });

  const [errors, setErrors] = useState({});
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const profileInputRef = useRef(null);

  const stepSequence = ['personal', 'address', 'professional', 'bank', 'assignment', 'documents'];
  const currentStepId = stepSequence[currentStep - 1] || stepSequence[stepSequence.length - 1];

  const steps = useMemo(
    () =>
      stepSequence.map((id, index) => ({
        id,
        number: index + 1,
        title: STEP_META[id].title,
        subtitle: STEP_META[id].subtitle,
        completed: currentStep > index + 1,
        active: currentStep === index + 1
      })),
    [currentStep]
  );

  const handleInputChange = (field, value) => {
    const [section, key] = field.split('.');
    if (['address', 'professional', 'bank', 'assignment'].includes(section) && key) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (stepId) => {
    const newErrors = {};

    if (stepId === 'personal') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (stepId === 'address') {
      if (!formData.address.street.trim()) newErrors['address.street'] = 'Street is required';
      if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
      if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
      if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
      if (!formData.address.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
    }

    if (stepId === 'professional') {
      const professionalData = formData.professional || {};
      const trimmedEmployeeId = (professionalData.employeeId || '').trim();
      const trimmedPan = (professionalData.panNumber || '').trim();
      const trimmedAadhar = (professionalData.aadharNumber || '').trim();
      const trimmedGst = (professionalData.gstNumber || '').trim();
      const trimmedDateAssign = (professionalData.dateOfAssigning || '').trim();

      if (!trimmedEmployeeId) {
        newErrors['professional.employeeId'] = 'Employee ID is required';
      }

      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
      if (trimmedPan && !panPattern.test(trimmedPan)) {
        newErrors['professional.panNumber'] = 'Invalid PAN format';
      }

      const aadharPattern = /^[0-9]{12}$/;
      if (trimmedAadhar && !aadharPattern.test(trimmedAadhar)) {
        newErrors['professional.aadharNumber'] = 'Aadhaar must be 12 digits';
      }

      const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
      if (trimmedGst && !gstPattern.test(trimmedGst)) {
        newErrors['professional.gstNumber'] = 'Invalid GST format';
      }

      if (!trimmedDateAssign) {
        newErrors['professional.dateOfAssigning'] = 'Date of assigning is required';
      }
    }

    if (stepId === 'bank') {
      if (!formData.bank.accountName.trim()) newErrors['bank.accountName'] = 'Account holder name is required';
      if (!formData.bank.accountNumber.trim()) newErrors['bank.accountNumber'] = 'Account number is required';
      if (!formData.bank.ifsc.trim()) newErrors['bank.ifsc'] = 'IFSC code is required';
      if (!formData.bank.bankName.trim()) newErrors['bank.bankName'] = 'Bank name is required';
    }

    if (stepId === 'assignment') {
      if (!formData.assignment.company.trim()) newErrors['assignment.company'] = 'Company assignment is required';
    }

    if (stepId === 'documents') {
      if (!formData.signature) newErrors.signature = 'Signature is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep(currentStepId)) {
      if (currentStep < stepSequence.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep && stepNumber <= stepSequence.length) {
      setCurrentStep(stepNumber);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Profile image should be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, profileImage: file }));
    const objectUrl = URL.createObjectURL(file);
    setProfilePreview(objectUrl);
  };

  const handleRemoveProfile = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfilePreview(null);
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, signature: 'Signature should be less than 5MB' }));
      return;
    }
    setFormData(prev => ({ ...prev, signature: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignaturePreview(reader.result);
    };
    reader.readAsDataURL(file);
    if (errors.signature) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.signature;
        return newErrors;
      });
    }
  };

  const handleRemoveSignature = () => {
    setFormData(prev => ({ ...prev, signature: null }));
    setSignaturePreview(null);
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setUploadedDocuments(prev => [
      ...prev,
      ...validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        type: '',
        name: file.name
      }))
    ]);
  };

  const handleRemoveDocument = (id) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleDocumentTypeChange = (id, type) => {
    setUploadedDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, type } : doc))
    );
  };

  const handleSubmit = () => {
    if (!validateStep('documents')) {
      setCurrentStep(stepSequence.length);
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      profileImage: profilePreview,
      createdOn: new Date().toISOString(),
      documents: uploadedDocuments
    };

    alert(`User created successfully. Login credentials have been sent via email to ${formData.email || 'the user'}.`);

    if (onSuccess) {
      onSuccess(newUser);
    }

    if (onPageChange) {
      onPageChange('manageUser');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Stepper */}
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800 break-words" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>Add User</h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Follow the steps to onboard a new user.</p>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl flex flex-col shadow-inner w-full min-h-full overflow-hidden" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
            <div className="flex flex-col gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex items-start gap-4 flex-shrink-0 ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleStepClick(step.number)}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`rounded-xl flex items-center justify-center font-bold transition-all duration-300 shadow-md ${
                        step.completed || step.active
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                      style={{
                        width: 'clamp(2.5rem, 3rem, 3.5rem)',
                        height: 'clamp(2.5rem, 3rem, 3.5rem)',
                        fontSize: 'clamp(1rem, 1.125rem, 1.25rem)',
                        boxShadow: step.completed || step.active
                          ? '0 4px 12px rgba(249, 115, 22, 0.4)'
                          : '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {step.completed ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`relative mt-2 transition-all duration-300 ${
                          step.completed ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                        style={{
                          width: '3px',
                          flex: '1',
                          minHeight: 'clamp(3rem, 4rem, 5rem)',
                          borderRadius: '2px',
                          boxShadow: step.completed ? '0 2px 4px rgba(249, 115, 22, 0.3)' : 'none'
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pt-1 min-w-0">
                    <div className="transition-all duration-300">
                      <h3
                        className={`font-bold mb-2 transition-colors duration-300 break-words overflow-wrap-anywhere ${
                          step.active
                            ? 'text-orange-600'
                            : step.completed
                            ? 'text-gray-800'
                            : 'text-gray-500'
                        }`}
                        style={{ fontSize: 'clamp(0.9375rem, 1.0625rem, 1.1875rem)' }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`leading-relaxed transition-colors duration-300 break-words overflow-wrap-anywhere ${
                          step.active
                            ? 'text-gray-700'
                            : step.completed
                            ? 'text-gray-600'
                            : 'text-gray-500'
                        }`}
                        style={{ fontSize: 'clamp(0.8125rem, 0.9375rem, 1rem)' }}
                      >
                        {step.subtitle}
                      </p>
                      {step.active && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-orange-600 text-xs font-medium">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-[70%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find(s => s.active)?.title || 'Add User'}
          </h2>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-lg flex flex-col">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
                {/* Personal Information */}
                {currentStepId === 'personal' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Personal Information
                      </h2>
                      <p className="text-gray-500 text-sm">Capture user identity details</p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block font-medium text-gray-700 mb-3 text-base">
                          Profile Image
                        </label>
                        <div className="flex flex-col items-center gap-4 text-center">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => profileInputRef.current?.click()}
                              className={`w-32 h-32 rounded-full border-2 border-dashed ${profilePreview ? 'border-orange-400 bg-white' : 'border-gray-300 bg-gray-50'} flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                            >
                              {profilePreview ? (
                                <img
                                  src={profilePreview}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover block pointer-events-none"
                                />
                              ) : (
                                <div className="text-center space-y-1 px-3">
                                  <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center border border-gray-200">
                                    <HiPhotograph className="text-orange-500 w-5 h-5" />
                                  </div>
                                  <p className="text-xs text-gray-600">Upload photo</p>
                                </div>
                              )}
                            </button>
                            {profilePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveProfile}
                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-red-500"
                              >
                                <HiX className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">
                            PNG or JPG up to 5MB. Recommended size 320x320 px.
                          </p>
                          <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileUpload}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors.firstName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Priya"
                          />
                          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors.lastName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Mehta"
                          />
                          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="user@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="+91 9876543210"
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Alternate Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.alternatePhone}
                            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                            placeholder="+91 9876543211"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Address Details */}
                {currentStepId === 'address' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Address Details
                      </h2>
                      <p className="text-gray-500 text-sm">Provide user residential details</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => handleInputChange('address.street', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Street address"
                        />
                        {errors['address.street'] && <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="City"
                          />
                          {errors['address.city'] && <p className="text-red-500 text-xs mt-1">{errors['address.city']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => handleInputChange('address.state', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="State"
                          />
                          {errors['address.state'] && <p className="text-red-500 text-xs mt-1">{errors['address.state']}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.country}
                            onChange={(e) => handleInputChange('address.country', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['address.country'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Country"
                          />
                          {errors['address.country'] && <p className="text-red-500 text-xs mt-1">{errors['address.country']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.pincode}
                            onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['address.pincode'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Pincode"
                          />
                          {errors['address.pincode'] && <p className="text-red-500 text-xs mt-1">{errors['address.pincode']}</p>}
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Professional Detail */}
                {currentStepId === 'professional' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Professional Detail
                      </h2>
                      <p className="text-gray-500 text-sm">Role-specific information</p>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Employee ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.professional.employeeId}
                            onChange={(e) => handleInputChange('professional.employeeId', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['professional.employeeId'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="EMP-00124"
                          />
                          {errors['professional.employeeId'] && <p className="text-red-500 text-xs mt-1">{errors['professional.employeeId']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            PAN Number
                          </label>
                          <input
                            type="text"
                            value={formData.professional.panNumber}
                            onChange={(e) => handleInputChange('professional.panNumber', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base uppercase tracking-wide ${
                              errors['professional.panNumber'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="ABCDE1234F"
                          />
                          {errors['professional.panNumber'] && <p className="text-red-500 text-xs mt-1">{errors['professional.panNumber']}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Aadhaar Number
                          </label>
                          <input
                            type="text"
                            value={formData.professional.aadharNumber}
                            onChange={(e) => handleInputChange('professional.aadharNumber', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['professional.aadharNumber'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="XXXX XXXX XXXX"
                          />
                          {errors['professional.aadharNumber'] && <p className="text-red-500 text-xs mt-1">{errors['professional.aadharNumber']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            GST Number
                          </label>
                          <input
                            type="text"
                            value={formData.professional.gstNumber}
                            onChange={(e) => handleInputChange('professional.gstNumber', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base uppercase tracking-wide ${
                              errors['professional.gstNumber'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="27ABCDE1234F1Z5"
                          />
                          {errors['professional.gstNumber'] && <p className="text-red-500 text-xs mt-1">{errors['professional.gstNumber']}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            RERA Number
                          </label>
                          <input
                            type="text"
                            value={formData.professional.reraNumber}
                            onChange={(e) => handleInputChange('professional.reraNumber', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base uppercase tracking-wide"
                            placeholder="MHMRE/123456/2024"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Date of Assigning
                          </label>
                          <input
                            type="date"
                            value={formData.professional.dateOfAssigning}
                            onChange={(e) => handleInputChange('professional.dateOfAssigning', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['professional.dateOfAssigning'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['professional.dateOfAssigning'] && <p className="text-red-500 text-xs mt-1">{errors['professional.dateOfAssigning']}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Additional Notes
                        </label>
                        <textarea
                          value={formData.professional.notes}
                          onChange={(e) => handleInputChange('professional.notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base resize-none"
                          placeholder="Mention authority, license status, or remarks"
                        />
                      </div>
                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Bank Details */}
                {currentStepId === 'bank' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Bank Details
                      </h2>
                      <p className="text-gray-500 text-sm">Salary credit information</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.bank.accountName}
                          onChange={(e) => handleInputChange('bank.accountName', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors['bank.accountName'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Priya Mehta"
                        />
                        {errors['bank.accountName'] && <p className="text-red-500 text-xs mt-1">{errors['bank.accountName']}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Account Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.bank.accountNumber}
                            onChange={(e) => handleInputChange('bank.accountNumber', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['bank.accountNumber'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="XXXX XXXX XXXX"
                          />
                          {errors['bank.accountNumber'] && <p className="text-red-500 text-xs mt-1">{errors['bank.accountNumber']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            IFSC Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.bank.ifsc}
                            onChange={(e) => handleInputChange('bank.ifsc', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['bank.ifsc'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="HDFC0001234"
                          />
                          {errors['bank.ifsc'] && <p className="text-red-500 text-xs mt-1">{errors['bank.ifsc']}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Bank Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.bank.bankName}
                            onChange={(e) => handleInputChange('bank.bankName', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors['bank.bankName'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="HDFC Bank"
                          />
                          {errors['bank.bankName'] && <p className="text-red-500 text-xs mt-1">{errors['bank.bankName']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Branch
                          </label>
                          <input
                            type="text"
                            value={formData.bank.branch}
                            onChange={(e) => handleInputChange('bank.branch', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                            placeholder="Bandra West"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          UPI ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.bank.upiId}
                          onChange={(e) => handleInputChange('bank.upiId', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                          placeholder="user@bank"
                        />
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Assign Company */}
                {currentStepId === 'assignment' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Assign Company
                      </h2>
                      <p className="text-gray-500 text-sm">Link user to company or builder</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Select Company <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.assignment.company}
                          onChange={(e) => handleInputChange('assignment.company', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors['assignment.company'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Choose company</option>
                          {AVAILABLE_COMPANIES.map(company => (
                            <option key={company} value={company}>
                              {company}
                            </option>
                          ))}
                        </select>
                        {errors['assignment.company'] && <p className="text-red-500 text-xs mt-1">{errors['assignment.company']}</p>}
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Notes / Responsibilities
                        </label>
                        <textarea
                          value={formData.assignment.notes}
                          onChange={(e) => handleInputChange('assignment.notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base resize-none"
                          placeholder="Assignment details, responsibilities, or additional context"
                        />
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Documents */}
                {currentStepId === 'documents' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Signature & Documents
                      </h2>
                      <p className="text-gray-500 text-sm">Upload signature sample and supporting documents</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-3 text-base">
                          Signature (PNG/JPG) <span className="text-red-500">*</span>
                        </label>
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${errors.signature ? 'border-red-500' : 'border-gray-300'} bg-gray-50`}>
                          {signaturePreview ? (
                            <div className="flex flex-col items-center space-y-4">
                              <img src={signaturePreview} alt="Signature" className="max-h-32 object-contain" />
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('signature-upload-input').click()}
                                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRemoveSignature}
                                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                                <HiPhotograph className="text-orange-500 w-6 h-6" />
                              </div>
                              <p className="text-gray-600 text-sm">
                                Drag & drop or <span className="text-orange-600 font-semibold cursor-pointer" onClick={() => document.getElementById('signature-upload-input').click()}>browse</span> to upload signature.
                              </p>
                              <p className="text-gray-400 text-xs">PNG or JPG up to 5MB</p>
                            </div>
                          )}
                          <input id="signature-upload-input" type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
                          {errors.signature && <p className="text-red-500 text-xs mt-2">{errors.signature}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-3 text-base">
                          Supporting Documents
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 text-center mb-4">
                          <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center mb-3 border border-gray-200">
                            <HiCloudUpload className="text-orange-500 w-6 h-6" />
                          </div>
                          <p className="text-gray-600 text-sm mb-1">Upload ID, certificates, approvals, etc.</p>
                          <p className="text-gray-400 text-xs mb-4">PDF, PNG, or JPG up to 10MB each</p>
                          <button
                            type="button"
                            onClick={() => document.getElementById('user-documents-input').click()}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                          >
                            Select Files
                          </button>
                          <input id="user-documents-input" type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleDocumentUpload} />
                        </div>
                        {uploadedDocuments.length > 0 && (
                          <div className="space-y-3">
                            {uploadedDocuments.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <label className="text-xs text-gray-500">Document Type:</label>
                                    <select
                                      value={doc.type}
                                      onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                      <option value="">Select</option>
                                      <option value="ID Proof">ID Proof</option>
                                      <option value="Employment Letter">Employment Letter</option>
                                      <option value="Educational">Educational</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                                >
                                  <HiTrash className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-6 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Save User
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

