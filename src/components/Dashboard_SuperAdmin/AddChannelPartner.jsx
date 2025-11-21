import React, { useState, useMemo, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { propertiesAPI, accountsAPI } from '../../api/api';

const STEP_META = {
  project: {
    title: 'Select Project',
    subtitle: 'Choose the project this channel partner belongs to.'
  },
  account: {
    title: 'Account Credentials',
    subtitle: 'Provide dealer ID and login information.'
  },
  details: {
    title: 'Contact & Verification Info',
    subtitle: 'Fill in personal details, addresses, and status.'
  }
};

const AddChannelPartner = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    dealerId: '',
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userAddress: '',
    fatherOrHusbandName: '',
    dob: '',
    phoneNo2: '',
    address: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError('');
      try {
        const data = await propertiesAPI.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
        setProjectsError(error.message || 'Failed to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const stepSequence = ['project', 'account', 'details'];
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

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectDropdown(false);
    if (errors.project) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.project;
        return next;
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPartnerForm(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleToggleActive = () => {
    setPartnerForm(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validateStep = (stepId) => {
    const newErrors = {};

    if (stepId === 'project') {
      if (!selectedProject) newErrors.project = 'Please select a project first';
    }

    if (stepId === 'account') {
      if (!partnerForm.dealerId.trim()) newErrors.dealerId = 'Dealer ID is required';
      if (!partnerForm.username.trim()) newErrors.username = 'Username is required';
      if (!partnerForm.email.trim() || !validateEmail(partnerForm.email)) newErrors.email = 'Valid email is required';
      if (!partnerForm.password.trim() || partnerForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }

    if (stepId === 'details') {
      if (!partnerForm.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!partnerForm.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!partnerForm.phoneNumber.trim() || !/^\d{10}$/.test(partnerForm.phoneNumber.trim())) newErrors.phoneNumber = 'Phone must be 10 digits';
      if (partnerForm.phoneNo2 && !/^\d{10}$/.test(partnerForm.phoneNo2.trim())) newErrors.phoneNo2 = 'Alt phone must be 10 digits';
      if (!partnerForm.userAddress.trim()) newErrors.userAddress = 'User address is required';
      if (!partnerForm.fatherOrHusbandName.trim()) newErrors.fatherOrHusbandName = 'Father/Husband name is required';
      if (!partnerForm.dob.trim()) newErrors.dob = 'Date of birth is required';
      if (!partnerForm.address.trim()) newErrors.address = 'Office address is required';
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

  const handleSubmit = async () => {
    if (!validateStep('details')) {
      setCurrentStep(stepSequence.indexOf('details') + 1);
      return;
    }

    try {
      setSubmitting(true);
      const response = await accountsAPI.createChannelPartner(selectedProject?.id, {
        project_id: selectedProject?.id,
        dealer_id: partnerForm.dealerId,
        username: partnerForm.username,
        email: partnerForm.email,
        password: partnerForm.password,
        first_name: partnerForm.firstName,
        last_name: partnerForm.lastName,
        phone_number: partnerForm.phoneNumber,
        user_address: partnerForm.userAddress,
        father_or_husband_name: partnerForm.fatherOrHusbandName,
        dob: partnerForm.dob,
        phone_no_2: partnerForm.phoneNo2,
        address: partnerForm.address,
        is_active: partnerForm.isActive
      });

      alert('Channel partner created successfully!');
      if (onSuccess) {
        onSuccess(response);
      }
      if (onPageChange) {
        onPageChange('manageChannelPartner');
      }
    } catch (error) {
      console.error('Error creating channel partner:', error);
      alert(error.message || 'Failed to create channel partner');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProjectLabel = selectedProject?.name || 'Select a Project';

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800 break-words" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>Add Channel Partner</h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Follow the steps to add a channel partner.</p>
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
                        boxShadow:
                          step.completed || step.active ? '0 4px 12px rgba(249, 115, 22, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
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
                        className={`relative mt-2 transition-all duration-300 ${step.completed ? 'bg-orange-500' : 'bg-gray-300'}`}
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

      <div className="w-full lg:w-[70%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find(step => step.active)?.title || 'Add Channel Partner'}
          </h2>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-3xl flex flex-col">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
                {currentStepId === 'project' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Select Project
                      </h2>
                      <p className="text-gray-500 text-sm">Choose a project to continue</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Project <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowProjectDropdown(prev => !prev)}
                            className={`w-full px-3 py-2.5 bg-white border ${
                              errors.project ? 'border-red-400' : 'border-gray-300'
                            } rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base`}
                          >
                            <span className={selectedProject ? 'text-gray-900' : 'text-gray-400'}>{selectedProjectLabel}</span>
                            <HiChevronDown
                              className={`text-gray-400 transition-all ${showProjectDropdown ? 'transform rotate-180 text-orange-500' : ''}`}
                              style={{ fontSize: '1.25rem' }}
                            />
                          </button>
                          {errors.project && <p className="mt-1 text-sm text-red-500">{errors.project}</p>}
                          {showProjectDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                              {projectsLoading ? (
                                <div className="px-3 py-3 text-gray-500 text-center text-sm">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                    <span>Loading...</span>
                                  </div>
                                </div>
                              ) : projectsError ? (
                                <div className="px-3 py-3 text-red-500 text-sm text-center">{projectsError}</div>
                              ) : projects.length === 0 ? (
                                <div className="px-3 py-3 text-gray-500 text-sm text-center">No projects available</div>
                              ) : (
                                projects.map(project => (
                                  <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => handleProjectSelect(project)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 text-base"
                                  >
                                    <div className="font-medium text-gray-900">{project.name}</div>
                                    <div className="text-sm text-gray-600">{project.location || project.address || 'No address provided'}</div>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedProject && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-1">Project Snapshot</h3>
                          <p className="text-gray-900 font-medium">{selectedProject.name}</p>
                          <p className="text-sm text-gray-600">{selectedProject.location || selectedProject.address || 'Address unavailable'}</p>
                          {selectedProject.builderName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Builder: <span className="font-medium text-gray-800">{selectedProject.builderName}</span>
                            </p>
                          )}
                        </div>
                      )}
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleContinue}
                          disabled={!selectedProject}
                          className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                            selectedProject
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {currentStepId === 'account' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Account Credentials
                      </h2>
                      <p className="text-gray-500 text-sm">Enter dealer ID and login details</p>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Dealer ID <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.dealerId}
                            onChange={(e) => handleInputChange('dealerId', e.target.value)}
                            placeholder="DLR-9"
                            className={`w-full border ${errors.dealerId ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.dealerId && <p className="text-xs text-red-500 mt-1">{errors.dealerId}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            placeholder="dealer02"
                            className={`w-full border ${errors.username ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={partnerForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="dealer02@example.com"
                            className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            value={partnerForm.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="••••••"
                            className={`w-full border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>
                      </div>
                      <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <div className="ml-auto">
                          <button
                            type="button"
                            onClick={handleContinue}
                            className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStepId === 'details' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Contact & Verification Info
                      </h2>
                      <p className="text-gray-500 text-sm">Provide personal details and addresses</p>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Shivam"
                            className={`w-full border ${errors.firstName ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Anant"
                            className={`w-full border ${errors.lastName ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="1234567890"
                            className={`w-full border ${errors.phoneNumber ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Alternate Phone
                          </label>
                          <input
                            type="text"
                            value={partnerForm.phoneNo2}
                            onChange={(e) => handleInputChange('phoneNo2', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="9444444444"
                            className={`w-full border ${errors.phoneNo2 ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.phoneNo2 && <p className="text-xs text-red-500 mt-1">{errors.phoneNo2}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          User Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={partnerForm.userAddress}
                          onChange={(e) => handleInputChange('userAddress', e.target.value)}
                          rows={2}
                          placeholder="Channel Partner Office, Sector 10"
                          className={`w-full border ${errors.userAddress ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                        />
                        {errors.userAddress && <p className="text-xs text-red-500 mt-1">{errors.userAddress}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Father / Husband Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={partnerForm.fatherOrHusbandName}
                            onChange={(e) => handleInputChange('fatherOrHusbandName', e.target.value)}
                            placeholder="Vikas Mehta"
                            className={`w-full border ${errors.fatherOrHusbandName ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.fatherOrHusbandName && <p className="text-xs text-red-500 mt-1">{errors.fatherOrHusbandName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={partnerForm.dob}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                            className={`w-full border ${errors.dob ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Office Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={partnerForm.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={2}
                          placeholder="Suite 10, Business Plaza"
                          className={`w-full border ${errors.address ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                        />
                        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Active Status
                        </label>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                          <button
                            type="button"
                            onClick={handleToggleActive}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              partnerForm.isActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                partnerForm.isActive ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium text-gray-700">
                            {partnerForm.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                        >
                          Previous
                        </button>
                        <div className="ml-auto">
                          <button
                            type="button"
                            onClick={handleContinue}
                            disabled={submitting}
                            className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                              submitting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                            }`}
                          >
                            {submitting ? 'Saving...' : 'Create Channel Partner'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showProjectDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProjectDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default AddChannelPartner;


