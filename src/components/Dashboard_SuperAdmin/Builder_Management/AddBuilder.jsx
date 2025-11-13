import React, { useState, useMemo } from 'react';
import { HiPlus, HiChevronDown, HiX, HiPhotograph, HiTrash, HiCloudUpload } from 'react-icons/hi';

const STEP_META = {
  basic: {
    title: 'Basic Information',
    subtitle: 'Enter builder name, company, type, and contact details.'
  },
  address: {
    title: 'Address Details',
    subtitle: 'Provide complete address information.'
  },
  business: {
    title: 'Business Details',
    subtitle: 'Add business information, website, GST, and commission.'
  },
  documents: {
    title: 'Documents & Logo',
    subtitle: 'Upload company logo and legal documents.'
  },
  review: {
    title: 'Review & Submit',
    subtitle: 'Review all information before submitting.'
  }
};

const AddBuilder = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    builderType: '',
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
    website: '',
    gstNumber: '',
    defaultCommission: '',
    businessDescription: '',
    logo: null,
    documents: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const stepSequence = ['basic', 'address', 'business', 'documents', 'review'];
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
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    // Clear error when user starts typing
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

    if (stepId === 'basic') {
      if (!formData.name.trim()) newErrors.name = 'Builder name is required';
      if (!formData.builderType) newErrors.builderType = 'Builder type is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }

    if (stepId === 'address') {
      if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
      if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
      if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
      if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
      if (!formData.address.pincode.trim()) newErrors['address.pincode'] = 'Pincode is required';
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'Logo size should be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: '',
      name: file.name
    }))]);
  };

  const handleRemoveDocument = (id) => {
    setUploadedFiles(prev => prev.filter(doc => doc.id !== id));
  };

  const handleDocumentTypeChange = (id, type) => {
    setUploadedFiles(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, type } : doc))
    );
  };

  const handleSubmit = () => {
    // Final validation
    if (!validateStep('basic') || !validateStep('address')) {
      setCurrentStep(1); // Go back to first step with errors
      return;
    }

    // Create builder object
    const newBuilder = {
      id: Date.now(),
      name: formData.name,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      type: formData.builderType,
      status: 'Pending',
      totalProjects: 0,
      joinedOn: new Date().toISOString().split('T')[0],
      avatar: logoPreview,
      address: formData.address,
      website: formData.website,
      gstNumber: formData.gstNumber,
      defaultCommission: formData.defaultCommission,
      businessDescription: formData.businessDescription,
      documents: uploadedFiles,
      notes: formData.notes
    };

    if (onSuccess) {
      onSuccess(newBuilder);
    }
    
    // Navigate back to builders page
    if (onPageChange) {
      onPageChange('builders');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Left Side - Step Bar */}
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800 break-words" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>Add Builder</h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Follow the steps to add a new builder</p>
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
                  {/* Step Number and Connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    {/* Step Number Circle */}
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

                    {/* Vertical Line (except for last step) */}
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
                          boxShadow: step.completed 
                            ? '0 2px 4px rgba(249, 115, 22, 0.3)' 
                            : 'none'
                        }}
                      />
                    )}
                  </div>

                  {/* Step Content */}
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
                      
                      {/* Active step indicator */}
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

      {/* Right Side - Form */}
      <div className="w-full lg:w-[70%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find(s => s.active)?.title || 'Add Builder'}
          </h2>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-lg flex flex-col">
              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
                {/* Step 1: Basic Information */}
                {currentStepId === 'basic' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Basic Information
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Enter builder name, company, type, and contact details
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Builder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter builder name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Builder Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className={`w-full px-3 py-2.5 bg-white border rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                              errors.builderType ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <span className={formData.builderType ? 'text-gray-900' : 'text-gray-400'}>
                              {formData.builderType || 'Select Builder Type'}
                            </span>
                            <HiChevronDown
                              className={`text-gray-400 transition-all ${
                                showTypeDropdown ? 'transform rotate-180 text-orange-500' : ''
                              }`}
                              style={{ fontSize: '1.25rem' }}
                            />
                          </button>
                          {showTypeDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                              {['Company', 'Individual', 'Developer'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('builderType', type);
                                    setShowTypeDropdown(false);
                                  }}
                                  className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                                >
                                  <div className="font-medium text-gray-900">{type}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.builderType && <p className="text-red-500 text-xs mt-1">{errors.builderType}</p>}
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="builder@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Phone <span className="text-red-500">*</span>
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

                {/* Step 2: Address Details */}
                {currentStepId === 'address' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Address Details
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Provide complete address information
                      </p>
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
                          placeholder="Street Address"
                        />
                        {errors['address.street'] && <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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

                      <div className="grid grid-cols-2 gap-4">
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

                {/* Step 3: Business Details */}
                {currentStepId === 'business' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Business Details
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Add business information, website, GST, and commission
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                          placeholder="https://www.example.com"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          GST / Tax Number
                        </label>
                        <input
                          type="text"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                          placeholder="Enter GST number"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Default Commission %
                        </label>
                        <input
                          type="number"
                          value={formData.defaultCommission}
                          onChange={(e) => handleInputChange('defaultCommission', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                          placeholder="5"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Business Description
                        </label>
                        <textarea
                          value={formData.businessDescription}
                          onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-base"
                          placeholder="Describe the business..."
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Internal Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-base"
                          placeholder="Add internal notes (visible only to admins)..."
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

                {/* Step 4: Documents & Logo */}
                {currentStepId === 'documents' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Documents & Logo
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Upload company logo and legal documents
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Company Logo
                        </label>
                        {logoPreview ? (
                          <div className="relative inline-block">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                            >
                              <HiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-gray-50">
                            <HiPhotograph className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Upload Logo</p>
                            <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Legal Documents
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-gray-50">
                          <HiCloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload documents</p>
                          <p className="text-xs text-gray-400 mt-1">Max size per file: 10MB</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleDocumentUpload}
                            className="hidden"
                          />
                        </label>

                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((doc) => (
                              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                  <select
                                    value={doc.type}
                                    onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                                    className="mt-1 text-xs px-2 py-1 border border-gray-300 rounded"
                                  >
                                    <option value="">Select document type</option>
                                    <option value="PAN">PAN</option>
                                    <option value="GST">GST</option>
                                    <option value="RERA">RERA</option>
                                    <option value="Identity">Identity Proof</option>
                                    <option value="Registration">Company Registration</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <HiTrash className="w-5 h-5" />
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
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 5: Review & Submit */}
                {currentStepId === 'review' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Review & Submit
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Review all information before submitting
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Basic Info Review */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Basic Information</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {formData.name || 'N/A'}</div>
                          <div><span className="font-medium">Company:</span> {formData.companyName || 'N/A'}</div>
                          <div><span className="font-medium">Type:</span> {formData.builderType || 'N/A'}</div>
                          <div><span className="font-medium">Email:</span> {formData.email || 'N/A'}</div>
                          <div><span className="font-medium">Phone:</span> {formData.phone || 'N/A'}</div>
                          {formData.alternatePhone && (
                            <div><span className="font-medium">Alternate Phone:</span> {formData.alternatePhone}</div>
                          )}
                        </div>
                      </div>

                      {/* Address Review */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Address</h3>
                        <div className="text-sm">
                          <div>{formData.address.street || 'N/A'}</div>
                          <div>{formData.address.city}, {formData.address.state}</div>
                          <div>{formData.address.country} - {formData.address.pincode}</div>
                        </div>
                      </div>

                      {/* Business Details Review */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Business Details</h3>
                        <div className="space-y-2 text-sm">
                          {formData.website && <div><span className="font-medium">Website:</span> {formData.website}</div>}
                          {formData.gstNumber && <div><span className="font-medium">GST:</span> {formData.gstNumber}</div>}
                          {formData.defaultCommission && <div><span className="font-medium">Commission:</span> {formData.defaultCommission}%</div>}
                          {formData.businessDescription && (
                            <div><span className="font-medium">Description:</span> {formData.businessDescription}</div>
                          )}
                        </div>
                      </div>

                      {/* Documents Review */}
                      {(logoPreview || uploadedFiles.length > 0) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Uploads</h3>
                          <div className="space-y-2 text-sm">
                            {logoPreview && <div><span className="font-medium">Logo:</span> Uploaded</div>}
                            {uploadedFiles.length > 0 && (
                              <div><span className="font-medium">Documents:</span> {uploadedFiles.length} file(s)</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                        >
                          Submit
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

      {/* Click outside to close dropdowns */}
      {showTypeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTypeDropdown(false)}
        />
      )}
    </div>
  );
};

export default AddBuilder;

