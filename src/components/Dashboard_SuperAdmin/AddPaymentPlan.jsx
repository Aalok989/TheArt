import React, { useState, useMemo, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { propertiesAPI, billingAPI } from '../../api/api';

const STEP_META = {
  project: {
    title: 'Select Project',
    subtitle: 'Choose the project you want to attach this plan to.'
  },
  plan: {
    title: 'Payment Plan Details',
    subtitle: 'Fill in the billing fields required by the API.'
  }
};

const PLAN_TYPE_OPTIONS = [
  { value: 'CLP', label: 'Construction Linked Plan (CLP)' },
  { value: 'PLP', label: 'Possession Linked Plan (PLP)' },
  { value: 'TIME_LINKED', label: 'Time Linked Plan' },
  { value: 'SUBVENTION', label: 'Subvention Plan' }
];

const AddPaymentPlan = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState('');

  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    durationMonths: '',
    interestRate: '',
    planType: '',
    downPaymentPercentage: '',
    bookingAmountPercentage: '',
    bankId: '',
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

  useEffect(() => {
    if (!selectedProject) {
      setBanks([]);
      return;
    }
    const loadBanks = async () => {
      setBanksLoading(true);
      setBanksError('');
      try {
        const response = await billingAPI.getBanks(selectedProject.id);
        const list = Array.isArray(response) ? response : (response?.results || []);
        setBanks(list);
      } catch (error) {
        console.error('Error loading banks:', error);
        setBanks([]);
        setBanksError(error.message || 'Failed to load banks for this project');
      } finally {
        setBanksLoading(false);
      }
    };

    loadBanks();
  }, [selectedProject]);

  const stepSequence = ['project', 'plan'];
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
    setPlanForm(prev => ({
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
    setPlanForm(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const validatePercentage = (value) => {
    if (!value && value !== 0) return false;
    const numeric = Number(value);
    return !isNaN(numeric) && numeric >= 0 && numeric <= 100;
  };

  const validateStep = (stepId) => {
    const newErrors = {};
    if (stepId === 'project' && !selectedProject) {
      newErrors.project = 'Please select a project first';
    }
    if (stepId === 'plan') {
      if (!planForm.name.trim()) newErrors.name = 'Plan name is required';
      if (!planForm.description.trim()) newErrors.description = 'Description is required';

      if (!planForm.durationMonths || isNaN(Number(planForm.durationMonths)) || Number(planForm.durationMonths) <= 0) {
        newErrors.durationMonths = 'Duration must be a positive number';
      }

      if (!planForm.interestRate.trim() || isNaN(Number(planForm.interestRate))) {
        newErrors.interestRate = 'Interest rate is required';
      }

      if (!planForm.planType.trim()) {
        newErrors.planType = 'Plan type is required';
      }

      if (!validatePercentage(planForm.downPaymentPercentage)) {
        newErrors.downPaymentPercentage = 'Enter a percentage between 0 and 100';
      }

      if (!validatePercentage(planForm.bookingAmountPercentage)) {
        newErrors.bookingAmountPercentage = 'Enter a percentage between 0 and 100';
      }

      if (!planForm.bankId) {
        newErrors.bankId = 'Bank selection is required';
      }
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
    if (!validateStep('plan')) {
      setCurrentStep(stepSequence.indexOf('plan') + 1);
      return;
    }
    try {
      setSubmitting(true);
      const response = await billingAPI.createPaymentPlan(selectedProject?.id, planForm);
      alert('Payment plan created successfully!');
      if (onSuccess) {
        onSuccess(response);
      }
      if (onPageChange) {
        onPageChange('manageBank');
      }
    } catch (error) {
      console.error('Error creating payment plan:', error);
      alert(error.message || 'Failed to create payment plan');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProjectLabel = selectedProject?.name || 'Select a Project';

  return (
    <div
      className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200"
      style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}
    >
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div
          className="flex-shrink-0"
          style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}
        >
          <h2
            className="font-bold text-gray-800 break-words"
            style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}
          >
            Add Payment Plan
          </h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
            Follow the steps to register a billing payment plan.
          </p>
        </div>
        <div
          className="flex-1 overflow-auto min-h-0"
          style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}
        >
          <div
            className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl flex flex-col shadow-inner w-full min-h-full overflow-hidden"
            style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}
          >
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
                          step.active ? 'text-orange-600' : step.completed ? 'text-gray-800' : 'text-gray-500'
                        }`}
                        style={{ fontSize: 'clamp(0.9375rem, 1.0625rem, 1.1875rem)' }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`leading-relaxed transition-colors duration-300 break-words overflow-wrap-anywhere ${
                          step.active ? 'text-gray-700' : step.completed ? 'text-gray-600' : 'text-gray-500'
                        }`}
                        style={{ fontSize: 'clamp(0.8125rem, 0.9375rem, 1rem)' }}
                      >
                        {step.subtitle}
                      </p>
                      {step.active && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
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
        <div
          className="flex-shrink-0"
          style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}
        >
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find(step => step.active)?.title || 'Add Payment Plan'}
          </h2>
        </div>
        <div
          className="flex-1 overflow-auto min-h-0"
          style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}
        >
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
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

                {currentStepId === 'plan' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Payment Plan Details
                      </h2>
                      <p className="text-gray-500 text-sm">Provide the fields required by the billing API</p>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Plan Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={planForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Standard Construction Linked Plan"
                            className={`w-full border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Plan Type <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={planForm.planType}
                              onChange={(e) => handleInputChange('planType', e.target.value)}
                              className={`w-full border ${errors.planType ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none`}
                            >
                              <option value="">Select plan type</option>
                              {PLAN_TYPE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.planType && <p className="text-xs text-red-500 mt-1">{errors.planType}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={planForm.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          placeholder="24-month construction linked payment plan"
                          className={`w-full border ${errors.description ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (months) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={planForm.durationMonths}
                            onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                            placeholder="24"
                            className={`w-full border ${errors.durationMonths ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.durationMonths && <p className="text-xs text-red-500 mt-1">{errors.durationMonths}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Interest Rate (%) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={planForm.interestRate}
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            placeholder="5.25"
                            className={`w-full border ${errors.interestRate ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.interestRate && <p className="text-xs text-red-500 mt-1">{errors.interestRate}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Bank <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={planForm.bankId}
                              onChange={(e) => handleInputChange('bankId', e.target.value)}
                              className={`w-full border ${errors.bankId ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none`}
                            >
                              <option value="">{banksLoading ? 'Loading banks...' : 'Select bank'}</option>
                              {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                  {bank.name} {bank.branch ? `- ${bank.branch}` : ''}
                                </option>
                              ))}
                            </select>
                            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {banksError && <p className="text-xs text-red-500 mt-1">{banksError}</p>}
                          {errors.bankId && <p className="text-xs text-red-500 mt-1">{errors.bankId}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Down Payment % <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={planForm.downPaymentPercentage}
                            onChange={(e) => handleInputChange('downPaymentPercentage', e.target.value)}
                            placeholder="20.00"
                            className={`w-full border ${errors.downPaymentPercentage ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.downPaymentPercentage && <p className="text-xs text-red-500 mt-1">{errors.downPaymentPercentage}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Booking Amount % <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={planForm.bookingAmountPercentage}
                            onChange={(e) => handleInputChange('bookingAmountPercentage', e.target.value)}
                            placeholder="10.00"
                            className={`w-full border ${errors.bookingAmountPercentage ? 'border-red-400' : 'border-gray-300'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                          />
                          {errors.bookingAmountPercentage && <p className="text-xs text-red-500 mt-1">{errors.bookingAmountPercentage}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                          <button
                            type="button"
                            onClick={handleToggleActive}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              planForm.isActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                planForm.isActive ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium text-gray-700">
                            {planForm.isActive ? 'Active' : 'Inactive'}
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
                            {submitting ? 'Saving...' : 'Save Plan'}
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

export default AddPaymentPlan;


