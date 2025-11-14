import React, { useEffect, useMemo, useState } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';
import { fetchProjects } from '../../api/mockData';

const STEP_META = {
  project: {
    title: 'Select Project',
    subtitle: 'Choose the project for this booking.'
  },
  unit: {
    title: 'Choose Available Unit',
    subtitle: 'Select villa, plot, tower or other available unit.'
  },
  customer: {
    title: 'Customer Details',
    subtitle: 'Enter complete customer information.'
  },
  booking: {
    title: 'Booking Details',
    subtitle: 'Confirm booking date, costs and payment plan.'
  }
};

const NewBooking = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [formData, setFormData] = useState({
    project: '',
    unitType: '',
    unitName: '',
    unitId: '',
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      image: null,
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      }
    },
    booking: {
      bookingDate: '',
      totalCost: '',
      initialAmount: '',
      paymentPlan: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [customerImagePreview, setCustomerImagePreview] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);

  const stepSequence = ['project', 'unit', 'customer', 'booking'];
  const currentStepId = stepSequence[currentStep - 1] || stepSequence[0];

  useEffect(() => {
    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const response = await fetchProjects();
        if (response.success) {
          setProjects(response.data || []);
        } else {
          setProjectsError('Unable to load projects');
        }
      } catch (error) {
        console.error('Failed to load projects', error);
        setProjectsError('Unable to load projects');
      } finally {
        setProjectsLoading(false);
      }
    };
    loadProjects();
  }, []);

  const projectOptions = useMemo(() => {
    return projects.map((project) => ({
      id: project.id,
      label: project.name,
      units: project.unitTypes || project.availableUnits || [
        { id: `${project.id}-villa`, name: 'Premium Villa', type: 'Villa', code: `V-${project.id}` },
        { id: `${project.id}-plot`, name: 'Luxury Plot', type: 'Plot', code: `P-${project.id}` },
        { id: `${project.id}-tower`, name: 'Residential Tower', type: 'Tower', code: `T-${project.id}` }
      ],
      towers: project.towers || []
    }));
  }, [projects]);

  const selectedProject = projectOptions.find(
    (project) => project.id?.toString() === formData.project
  );

  const availableUnits = useMemo(() => {
    if (!selectedProject) return [];
    const typeEntries = [];
    if (selectedProject.units && selectedProject.units.length > 0) {
      selectedProject.units.forEach((unit) => {
        typeEntries.push({
          id: unit.id || unit.name,
          name: unit.name || unit.type || 'Unit',
          type: unit.type || 'Custom',
          code: unit.code || unit.id,
          size: unit.size,
          price: unit.price
        });
      });
    } else if (selectedProject.towers && selectedProject.towers.length) {
      selectedProject.towers.forEach((tower) => {
        typeEntries.push({
          id: tower.id,
          name: tower.name,
          type: 'Tower',
          code: tower.code,
          size: tower.units?.length,
          price: tower.basePrice
        });
      });
    }
    return typeEntries;
  }, [selectedProject]);

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
    if (field.startsWith('customer.address.')) {
      const key = field.split('.')[2];
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          address: {
            ...prev.customer.address,
            [key]: value
          }
        }
      }));
    } else if (field.startsWith('customer.')) {
      const key = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          [key]: value
        }
      }));
    } else if (field.startsWith('booking.')) {
      const key = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        booking: {
          ...prev.booking,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (stepId) => {
    const newErrors = {};
    if (stepId === 'project') {
      if (!formData.project) newErrors.project = 'Project selection is required';
    }
    if (stepId === 'unit') {
      if (!formData.unitType) newErrors.unitType = 'Unit type is required';
      if (!formData.unitName) newErrors.unitName = 'Unit name is required';
    }
    if (stepId === 'customer') {
      if (!formData.customer.firstName.trim()) newErrors['customer.firstName'] = 'First name is required';
      if (!formData.customer.lastName.trim()) newErrors['customer.lastName'] = 'Last name is required';
      if (!formData.customer.email.trim()) {
        newErrors['customer.email'] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
        newErrors['customer.email'] = 'Invalid email format';
      }
      if (!formData.customer.phone.trim()) newErrors['customer.phone'] = 'Phone number is required';
      if (!formData.customer.address.street.trim()) newErrors['customer.address.street'] = 'Street is required';
      if (!formData.customer.address.city.trim()) newErrors['customer.address.city'] = 'City is required';
      if (!formData.customer.address.state.trim()) newErrors['customer.address.state'] = 'State is required';
      if (!formData.customer.address.country.trim()) newErrors['customer.address.country'] = 'Country is required';
      if (!formData.customer.address.pincode.trim()) newErrors['customer.address.pincode'] = 'Pincode is required';
    }
    if (stepId === 'booking') {
      if (!formData.booking.bookingDate) newErrors['booking.bookingDate'] = 'Booking date is required';
      if (!formData.booking.totalCost.trim()) newErrors['booking.totalCost'] = 'Total cost is required';
      if (!formData.booking.initialAmount.trim()) newErrors['booking.initialAmount'] = 'Initial amount is required';
      if (!formData.booking.paymentPlan.trim()) newErrors['booking.paymentPlan'] = 'Payment plan is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStepId)) {
      setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length));
    }
  };

  const goPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCustomerImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, customerImage: 'Image must be smaller than 5MB' }));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        image: file
      }
    }));
    setCustomerImagePreview(objectUrl);
  };

  const removeCustomerImage = () => {
    if (customerImagePreview) URL.revokeObjectURL(customerImagePreview);
    setCustomerImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        image: null
      }
    }));
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });
    setUploadedDocs((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        type: ''
      }))
    ]);
  };

  const handleDocTypeChange = (id, type) => {
    setUploadedDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, type } : doc)));
  };

  const handleDocRemove = (id) => {
    setUploadedDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleSubmit = () => {
    if (!validateStep('booking')) {
      setCurrentStep(stepSequence.length);
      return;
    }
    const payload = {
      ...formData,
      customerImagePreview,
      uploadedDocs
    };
    alert('Booking saved successfully. Confirmation email sent to customer.');
    if (onSuccess) {
      onSuccess(payload);
    }
    if (onPageChange) {
      onPageChange('dashboard');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Stepper */}
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800 break-words" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>New Booking</h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Complete the steps to create a new booking</p>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl flex flex-col shadow-inner w-full min-h-full overflow-hidden" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
            <div className="flex flex-col gap-6">
              {steps.map((step, index) => (
                <div key={step.number} className={`relative flex items-start gap-4 flex-shrink-0 ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}`} onClick={() => step.number <= currentStep && setCurrentStep(step.number)}>
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

      {/* Form Section */}
      <div className="w-full lg:w-[70%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find((s) => s.active)?.title || 'New Booking'}
          </h2>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-2xl flex flex-col">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
                {currentStepId === 'project' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Select Project
                      </h2>
                      <p className="text-gray-500 text-sm">Choose a project for this booking.</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Project <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.project}
                          onChange={(e) => handleInputChange('project', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                            errors.project ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">{projectsLoading ? 'Loading projects...' : 'Select a project'}</option>
                          {projectsError && <option value="" disabled>{projectsError}</option>}
                          {projectOptions.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.label}
                            </option>
                          ))}
                        </select>
                        {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={goNext}
                        className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {currentStepId === 'unit' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Choose Available Unit
                      </h2>
                      <p className="text-gray-500 text-sm">Select the unit type and specific unit.</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Unit Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.unitType}
                          onChange={(e) => handleInputChange('unitType', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                            errors.unitType ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">
                            {selectedProject
                              ? availableUnits.length > 0
                                ? 'Select unit type'
                                : 'No units defined for project'
                              : 'Select project first'}
                          </option>
                          {availableUnits.map((unit) => (
                            <option key={unit.id} value={unit.type}>
                              {unit.type} - {unit.name}
                            </option>
                          ))}
                        </select>
                        {errors.unitType && <p className="text-red-500 text-xs mt-1">{errors.unitType}</p>}
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Unit Name/Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.unitName}
                          onChange={(e) => handleInputChange('unitName', e.target.value)}
                          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                            errors.unitName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Villa 12A or Tower B - 804"
                        />
                        {errors.unitName && <p className="text-red-500 text-xs mt-1">{errors.unitName}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Unit ID / Inventory Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.unitId}
                            onChange={(e) => handleInputChange('unitId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={goPrevious}
                        className="px-4 py-1.5 rounded-md font-medium border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="px-4 py-1.5 rounded-md font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {currentStepId === 'customer' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Customer Details
                      </h2>
                      <p className="text-gray-500 text-sm">Enter complete customer information.</p>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-medium text-gray-700 mb-3 text-base">
                          Customer Photo
                        </label>
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => document.getElementById('customer-image-input').click()}
                              className={`w-32 h-32 rounded-full border-2 border-dashed ${
                                customerImagePreview ? 'border-orange-400 bg-white' : 'border-gray-300 bg-gray-50'
                              } flex items-center justify-center overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`}
                            >
                              {customerImagePreview ? (
                                <img
                                  src={customerImagePreview}
                                  alt="Customer preview"
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
                            {customerImagePreview && (
                              <button
                                type="button"
                                onClick={removeCustomerImage}
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
                            id="customer-image-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCustomerImageUpload}
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
                            value={formData.customer.firstName}
                            onChange={(e) => handleInputChange('customer.firstName', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['customer.firstName'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['customer.firstName'] && <p className="text-red-500 text-xs mt-1">{errors['customer.firstName']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.customer.lastName}
                            onChange={(e) => handleInputChange('customer.lastName', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['customer.lastName'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['customer.lastName'] && <p className="text-red-500 text-xs mt-1">{errors['customer.lastName']}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.customer.email}
                            onChange={(e) => handleInputChange('customer.email', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['customer.email'] && <p className="text-red-500 text-xs mt-1">{errors['customer.email']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.customer.phone}
                            onChange={(e) => handleInputChange('customer.phone', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['customer.phone'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['customer.phone'] && <p className="text-red-500 text-xs mt-1">{errors['customer.phone']}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Address
                        </label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={formData.customer.address.street}
                            onChange={(e) => handleInputChange('customer.address.street', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                              errors['customer.address.street'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Street"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={formData.customer.address.city}
                              onChange={(e) => handleInputChange('customer.address.city', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                                errors['customer.address.city'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="City"
                            />
                            <input
                              type="text"
                              value={formData.customer.address.state}
                              onChange={(e) => handleInputChange('customer.address.state', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                                errors['customer.address.state'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="State"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={formData.customer.address.country}
                              onChange={(e) => handleInputChange('customer.address.country', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                                errors['customer.address.country'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Country"
                            />
                            <input
                              type="text"
                              value={formData.customer.address.pincode}
                              onChange={(e) => handleInputChange('customer.address.pincode', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 ${
                                errors['customer.address.pincode'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-2 text-base">
                          Support Documents
                        </label>
                        <div className="flex flex-col gap-3">
                          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition bg-gray-50">
                            <p className="text-sm text-gray-600">Upload documents</p>
                            <p className="text-xs text-gray-400">Max size 10MB per file</p>
                            <input
                              type="file"
                              multiple
                              className="hidden"
                              onChange={handleDocUpload}
                            />
                          </label>
                          {uploadedDocs.length > 0 && (
                            <div className="space-y-2">
                              {uploadedDocs.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                  <div>
                                    <p className="font-medium text-gray-900">{doc.name}</p>
                                    <select
                                      value={doc.type}
                                      onChange={(e) => handleDocTypeChange(doc.id, e.target.value)}
                                      className="mt-1 text-xs border border-gray-300 rounded px-2 py-1"
                                    >
                                      <option value="">Document type</option>
                                      <option value="ID Proof">ID Proof</option>
                                      <option value="Address Proof">Address Proof</option>
                                      <option value="Income Proof">Income Proof</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDocRemove(doc.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={goPrevious}
                        className="px-4 py-1.5 rounded-md font-medium border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="px-4 py-1.5 rounded-md font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow"
                      >
                        Continue
                      </button>
                    </div>
                  </>
                )}

                {currentStepId === 'booking' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Booking Details
                      </h2>
                      <p className="text-gray-500 text-sm">Confirm financial information.</p>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Booking Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.booking.bookingDate}
                            onChange={(e) => handleInputChange('booking.bookingDate', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['booking.bookingDate'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors['booking.bookingDate'] && <p className="text-red-500 text-xs mt-1">{errors['booking.bookingDate']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Total Cost (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.booking.totalCost}
                            onChange={(e) => handleInputChange('booking.totalCost', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['booking.totalCost'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="₹ 10,00,000"
                          />
                          {errors['booking.totalCost'] && <p className="text-red-500 text-xs mt-1">{errors['booking.totalCost']}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Initial Amount Paid (₹) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.booking.initialAmount}
                            onChange={(e) => handleInputChange('booking.initialAmount', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['booking.initialAmount'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="₹ 1,00,000"
                          />
                          {errors['booking.initialAmount'] && <p className="text-red-500 text-xs mt-1">{errors['booking.initialAmount']}</p>}
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-2 text-base">
                            Payment Plan <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.booking.paymentPlan}
                            onChange={(e) => handleInputChange('booking.paymentPlan', e.target.value)}
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base ${
                              errors['booking.paymentPlan'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select payment plan</option>
                            <option value="CLP">Construction Linked Plan (CLP)</option>
                            <option value="Possession">Possession Linked Plan</option>
                            <option value="40_60">40-60 Plan</option>
                            <option value="Custom">Custom Plan</option>
                          </select>
                          {errors['booking.paymentPlan'] && <p className="text-red-500 text-xs mt-1">{errors['booking.paymentPlan']}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={goPrevious}
                        className="px-4 py-1.5 rounded-md font-medium border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-1.5 rounded-md font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow"
                      >
                        Save Booking
                      </button>
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

export default NewBooking;

