import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiPhotograph, HiX, HiChevronDown } from 'react-icons/hi';
import { propertiesAPI, projectHierarchyAPI, accountsAPI, billingAPI } from '../../api/api';

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
  coApplicants: {
    title: 'Co-Applicants & Nominee',
    subtitle: 'Add co-applicants and nominee (optional).'
  },
  payment: {
    title: 'Payment Information',
    subtitle: 'Enter payment details and select options.'
  }
};

const NewBooking = ({ onPageChange, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [projectHierarchy, setProjectHierarchy] = useState(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [selectedTowerId, setSelectedTowerId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [selectedFlatId, setSelectedFlatId] = useState('');
  const [formData, setFormData] = useState({
    project: '',
    unitType: '',
    unitName: '',
    unitId: '',
    customerType: 'existing', // 'existing' or 'new'
    existingCustomerId: '',
    customer: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      kycId: '',
      kycVerified: false,
      status: 'ACTIVE',
      fatherName: '',
      dateOfBirth: '',
      panNumber: '',
      occupation: '',
      companyName: '',
      annualIncome: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    },
    payment: {
      bookingDate: '',
      companyRate: '',
      loginRate: '',
      totalCost: '',
      logInitialAmount: '',
      discountAmount: '',
      paymentPlan: '',
      bank: '',
      channelPartner: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [customerImagePreview, setCustomerImagePreview] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedExistingCustomer, setSelectedExistingCustomer] = useState(null);
  const [coApplicants, setCoApplicants] = useState([]);
  const [nominee, setNominee] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [banks, setBanks] = useState([]);
  const [channelPartners, setChannelPartners] = useState([]);
  const [loadingPaymentOptions, setLoadingPaymentOptions] = useState(false);
  const [showCoApplicantForm, setShowCoApplicantForm] = useState(false);
  const [showNomineeForm, setShowNomineeForm] = useState(false);
  const [coApplicantForm, setCoApplicantForm] = useState({
    name: '',
    fatherName: '',
    dateOfBirth: '',
    gender: 'M',
    email: '',
    phoneNumber: '',
    address: '',
    panNumber: '',
    occupation: '',
    annualIncome: '',
    relationship: ''
  });
  const [nomineeForm, setNomineeForm] = useState({
    name: '',
    fatherHusbandName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    panNumber: '',
    relationship: ''
  });

  const stepSequence = ['project', 'unit', 'customer', 'coApplicants', 'payment'];
  const currentStepId = stepSequence[currentStep - 1] || stepSequence[0];

  useEffect(() => {
    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError('');
      try {
        const data = await propertiesAPI.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load projects', error);
        setProjects([]);
        setProjectsError(error.message || 'Unable to load projects');
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
      location: project.location || project.address || ''
    }));
  }, [projects]);

  // Load existing customers when project is selected
  useEffect(() => {
    const loadCustomers = async () => {
      if (!formData.project || formData.customerType !== 'existing') {
        setExistingCustomers([]);
        return;
      }
      
      try {
        setLoadingCustomers(true);
        const data = await accountsAPI.getCustomers(formData.project);
        setExistingCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading customers:', error);
        setExistingCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };
    
    loadCustomers();
  }, [formData.project, formData.customerType]);

  // Load payment options when payment step is reached
  useEffect(() => {
    const loadPaymentOptions = async () => {
      if (!formData.project || currentStepId !== 'payment') {
        return;
      }
      
      try {
        setLoadingPaymentOptions(true);
        const [paymentPlansData, banksData, channelPartnersData] = await Promise.all([
          billingAPI.getPaymentPlans(formData.project),
          billingAPI.getBanks(formData.project),
          accountsAPI.getChannelPartners(formData.project)
        ]);
        
        setPaymentPlans(Array.isArray(paymentPlansData) ? paymentPlansData : []);
        setBanks(Array.isArray(banksData) ? banksData : []);
        setChannelPartners(Array.isArray(channelPartnersData) ? channelPartnersData : []);
      } catch (error) {
        console.error('Error loading payment options:', error);
        setPaymentPlans([]);
        setBanks([]);
        setChannelPartners([]);
      } finally {
        setLoadingPaymentOptions(false);
      }
    };
    
    loadPaymentOptions();
  }, [formData.project, currentStepId]);

  const selectedProject = projectOptions.find(
    (project) => project.id?.toString() === formData.project
  );

  const towers = useMemo(() => projectHierarchy?.towers || [], [projectHierarchy]);
    const topLevelBlocks = useMemo(() => projectHierarchy?.blocks || [], [projectHierarchy]);
  const usingTowerFlow = useMemo(
    () =>
      towers.length > 0 &&
      projectDetails?.structure_type === 'tower_with_blocks' &&
      (projectDetails?.unit_type === 'flats' || !projectDetails?.unit_type),
    [towers.length, projectDetails?.structure_type, projectDetails?.unit_type]
  );
  const usesTowerFloorsFlow = useMemo(
    () =>
      towers.length > 0 &&
      projectDetails?.structure_type === 'tower_with_floors' &&
      (projectDetails?.unit_type === 'flats' || !projectDetails?.unit_type),
    [towers.length, projectDetails?.structure_type, projectDetails?.unit_type]
  );
  const selectedTower = useMemo(
    () => towers.find((tower) => String(tower.id) === selectedTowerId),
    [towers, selectedTowerId]
  );
  const blocks = useMemo(
    () => (usingTowerFlow ? selectedTower?.blocks || [] : topLevelBlocks),
    [usingTowerFlow, selectedTower, topLevelBlocks]
  );
  const selectedBlock = useMemo(
    () => blocks.find((block) => String(block.id) === selectedBlockId),
    [blocks, selectedBlockId]
  );
  const towerFloors = useMemo(() => {
    if (!usesTowerFloorsFlow) return [];
    const floorsFromTower = selectedTower?.floors || [];
    if (floorsFromTower.length > 0) return floorsFromTower;
    const globalFloors = projectHierarchy?.floors || [];
    if (globalFloors.length === 0) return [];
    return globalFloors.filter((floor) =>
      selectedTowerId ? String(floor.tower) === selectedTowerId : true
    );
  }, [usesTowerFloorsFlow, selectedTower, projectHierarchy, selectedTowerId]);
  const floors = useMemo(() => {
    if (usingTowerFlow) return selectedBlock?.floors || [];
    if (usesTowerFloorsFlow) return towerFloors;
    return selectedBlock?.floors || [];
  }, [usingTowerFlow, usesTowerFloorsFlow, selectedBlock, towerFloors]);
  const selectedFloor = useMemo(
    () => floors.find((floor) => String(floor.id) === selectedFloorId),
    [floors, selectedFloorId]
  );
  const allFlats = useMemo(() => {
    if (!selectedFloor?.flats) return [];
    return selectedFloor.flats;
  }, [selectedFloor]);
  const allVillas = useMemo(() => {
    if (projectDetails?.unit_type !== 'villas') return [];
    const blockVillas = selectedBlock?.villas || [];
    const topLevelVillas = projectHierarchy?.villas || [];
    return blockVillas.length ? blockVillas : topLevelVillas;
  }, [projectDetails?.unit_type, selectedBlock, projectHierarchy]);
  const selectedFlat = useMemo(
    () =>
      allFlats.find(
        (flat) => String(flat.id || flat.flat_number) === selectedFlatId
      ),
    [allFlats, selectedFlatId]
  );
  const selectedVilla = useMemo(() => {
    if (!allVillas.length) return null;
    const villa = allVillas.find(
      (v) => String(v.id || v.villa_number) === selectedFlatId
    );
    if (!villa) return null;
    return {
      id: villa.id,
      flat_number: villa.villa_number,
      flat_type: villa.villa_type || 'Villa',
      area_sqft: villa.land_area_sqft || villa.builtup_area_sqft,
      status: villa.is_available ? 'available' : villa.is_sold ? 'sold' : 'unavailable',
      price: villa.price
    };
  }, [allVillas, selectedFlatId]);
  const allPlots = useMemo(() => {
    if (projectDetails?.unit_type !== 'plots') return [];
    const blockPlots = selectedBlock?.plots || [];
    const topLevelPlots = projectHierarchy?.plots || [];
    return blockPlots.length ? blockPlots : topLevelPlots;
  }, [projectDetails?.unit_type, selectedBlock, projectHierarchy]);
  const selectedPlot = useMemo(() => {
    if (!allPlots.length) return null;
    const plot = allPlots.find(
      (p) => String(p.id || p.plot_number) === selectedFlatId
    );
    if (!plot) return null;
    return {
      id: plot.id,
      flat_number: plot.plot_number,
      flat_type: plot.plot_type || 'Plot',
      area_sqft: plot.area_sqft,
      status: plot.is_available ? 'available' : plot.is_sold ? 'sold' : 'unavailable',
      price: plot.total_price
    };
  }, [allPlots, selectedFlatId]);
  const selectedUnit = selectedFlat || selectedVilla || selectedPlot;

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
    if (field === 'project') {
      const normalizedValue = value ? String(value) : '';
      setFormData((prev) => ({
        ...prev,
        project: normalizedValue,
        unitType: '',
        unitName: '',
        unitId: ''
      }));
      setShowProjectDropdown(false);
      setProjectDetails(null);
      setProjectHierarchy(null);
      setHierarchyError('');
      setHierarchyLoading(false);
      setSelectedTowerId('');
      setSelectedBlockId('');
      setSelectedFloorId('');
      setSelectedFlatId('');
      if (errors.project) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.project;
          return next;
        });
      }
      return;
    }

    if (field === 'customerType') {
      setFormData((prev) => ({
        ...prev,
        customerType: value,
        existingCustomerId: '',
        customer: value === 'existing' ? prev.customer : {
          username: '',
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          address: '',
          kycId: '',
          kycVerified: false,
          status: 'ACTIVE',
          fatherName: '',
          dateOfBirth: '',
          panNumber: '',
          occupation: '',
          companyName: '',
          annualIncome: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelation: ''
        }
      }));
      if (errors.customerType || errors.existingCustomerId) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.customerType;
          delete next.existingCustomerId;
          return next;
        });
      }
      return;
    }

    if (field === 'existingCustomerId') {
      setFormData((prev) => ({
        ...prev,
        existingCustomerId: value
      }));
      if (errors.existingCustomerId) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.existingCustomerId;
          return next;
        });
      }
      return;
    }

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
    } else if (field.startsWith('payment.')) {
      const key = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
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
      if (!formData.unitId) newErrors.unitId = 'Please select an available unit';
    }
    if (stepId === 'customer') {
      if (formData.customerType === 'existing') {
        if (!formData.existingCustomerId) newErrors.existingCustomerId = 'Please select a customer';
      } else {
        if (!formData.customer.username.trim()) newErrors['customer.username'] = 'Username is required';
        if (!formData.customer.email.trim()) {
          newErrors['customer.email'] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
          newErrors['customer.email'] = 'Invalid email format';
        }
        if (!formData.customer.password.trim()) newErrors['customer.password'] = 'Password is required';
        if (!formData.customer.firstName.trim()) newErrors['customer.firstName'] = 'First name is required';
        if (!formData.customer.lastName.trim()) newErrors['customer.lastName'] = 'Last name is required';
        if (!formData.customer.phoneNumber.trim()) newErrors['customer.phoneNumber'] = 'Phone number is required';
        if (!formData.customer.address.trim()) newErrors['customer.address'] = 'Address is required';
        if (!formData.customer.fatherName.trim()) newErrors['customer.fatherName'] = 'Father name is required';
        if (!formData.customer.dateOfBirth.trim()) newErrors['customer.dateOfBirth'] = 'Date of birth is required';
        if (!formData.customer.panNumber.trim()) newErrors['customer.panNumber'] = 'PAN number is required';
      }
    }
    if (stepId === 'payment') {
      if (!formData.payment.bookingDate) newErrors['payment.bookingDate'] = 'Booking date is required';
      if (!formData.payment.companyRate.trim()) newErrors['payment.companyRate'] = 'Company rate is required';
      if (!formData.payment.loginRate.trim()) newErrors['payment.loginRate'] = 'Login rate is required';
      if (!formData.payment.totalCost.trim()) newErrors['payment.totalCost'] = 'Total cost is required';
      if (!formData.payment.logInitialAmount.trim()) newErrors['payment.logInitialAmount'] = 'Initial amount is required';
      if (!formData.payment.paymentPlan) newErrors['payment.paymentPlan'] = 'Payment plan is required';
      if (!formData.payment.bank) newErrors['payment.bank'] = 'Bank is required';
      if (!formData.payment.channelPartner) newErrors['payment.channelPartner'] = 'Channel partner is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = async () => {
    if (!validateStep(currentStepId)) {
      return;
    }

    // Handle customer creation when moving from customer step
    if (currentStepId === 'customer' && formData.customerType === 'new') {
      try {
        setLoadingCustomers(true);
        const createdCustomer = await accountsAPI.createCustomer(formData.project, formData.customer);
        
        // Update form data with the created customer ID
        setFormData((prev) => ({
          ...prev,
          existingCustomerId: String(createdCustomer.id || createdCustomer.customer_id),
          customerType: 'existing' // Switch to existing since customer is now created
        }));
        
        // Set the selected customer for preview
        setSelectedExistingCustomer({
          id: createdCustomer.id || createdCustomer.customer_id,
          full_name: `${createdCustomer.first_name} ${createdCustomer.last_name}`,
          email: createdCustomer.email,
          phone_number: createdCustomer.phone_number,
          kyc_id: createdCustomer.kyc_id,
          status: createdCustomer.status
        });
        
        alert('Customer created successfully!');
      } catch (error) {
        console.error('Error creating customer:', error);
        alert('Failed to create customer. Please try again.');
        return;
      } finally {
        setLoadingCustomers(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, stepSequence.length));
  };

  const goPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const fetchHierarchy = useCallback(async (projectId) => {
    if (!projectId) return;
    setHierarchyLoading(true);
    setHierarchyError('');
    try {
      const [detailsResponse, hierarchyResponse] = await Promise.all([
        projectHierarchyAPI.getProjectDetails(projectId),
        projectHierarchyAPI.getProjectHierarchy(projectId)
      ]);
      const detailData = Array.isArray(detailsResponse)
        ? detailsResponse[0]
        : detailsResponse;
      setProjectDetails(detailData || null);
      setProjectHierarchy(hierarchyResponse || null);
    } catch (error) {
      console.error('Failed to load project hierarchy', error);
      setProjectDetails(null);
      setProjectHierarchy(null);
      setHierarchyError(error.message || 'Unable to load unit hierarchy');
    } finally {
      setHierarchyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!formData.project) {
      setProjectDetails(null);
      setProjectHierarchy(null);
      return;
    }
    fetchHierarchy(formData.project);
  }, [formData.project, fetchHierarchy]);

  useEffect(() => {
    if (!selectedUnit) {
      setFormData((prev) => ({
        ...prev,
        unitType: '',
        unitName: '',
        unitId: ''
      }));
      return;
    }
    const unitLabelPrefix =
      projectDetails?.unit_type === 'villas' ? 'Villa' : 'Flat';
    const unitName =
      selectedUnit.flat_number || selectedUnit.name || selectedUnit.id || 'Unit';
    setFormData((prev) => ({
      ...prev,
      unitType: projectDetails?.unit_type || selectedUnit.flat_type || 'unit',
      unitName: `${unitLabelPrefix} ${unitName}${
        selectedUnit.flat_type ? ` (${selectedUnit.flat_type})` : ''
      }`,
      unitId: String(selectedUnit.id || unitName)
    }));
  }, [selectedUnit, projectDetails]);

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

  // Handle existing customer selection
  const handleExistingCustomerSelect = (customer) => {
    setSelectedExistingCustomer(customer);
    setFormData((prev) => ({
      ...prev,
      existingCustomerId: String(customer.id),
        customer: {
          username: customer.username,
          email: customer.email,
          password: '',
          firstName: customer.first_name,
          lastName: customer.last_name,
          phoneNumber: customer.phone_number,
          address: '',
          kycId: customer.kyc_id,
          kycVerified: customer.kyc_verified,
          status: customer.status,
          fatherName: customer.father_name,
          dateOfBirth: customer.date_of_birth,
          panNumber: customer.pan_number,
          occupation: customer.occupation,
          companyName: customer.company_name,
          annualIncome: customer.annual_income,
          emergencyContactName: customer.emergency_contact_name,
          emergencyContactPhone: customer.emergency_contact_phone,
          emergencyContactRelation: customer.emergency_contact_relation
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

  const handleSubmit = async () => {
    if (!validateStep('payment')) {
      return;
    }
    
    try {
      // Get the customer ID (either existing or newly created)
      const customerId = formData.existingCustomerId || selectedExistingCustomer?.id;
      
      if (!customerId) {
        alert('No customer selected. Please select or create a customer first.');
        return;
      }

      // Base payload structure
      const basePayload = {
        user_id: parseInt(customerId),
        project_id: parseInt(formData.project),
        payment_plan_id: parseInt(formData.payment.paymentPlan),
        bank_id: parseInt(formData.payment.bank),
        booking_date: formData.payment.bookingDate,
        company_rate: formData.payment.companyRate,
        login_rate: formData.payment.loginRate,
        total_cost: `${formData.payment.totalCost}.00`,
        log_initial_amount: `${formData.payment.logInitialAmount}.00`,
        discount_amount: formData.payment.discountAmount || "0",
        channel_partner_id: parseInt(formData.payment.channelPartner),
        status: "ACTIVE"
      };

      // Add unit-specific field based on project unit type
      let payload = { ...basePayload };
      
      if (projectDetails?.unit_type === 'flats' && selectedFlat) {
        payload.flat_id = parseInt(selectedFlat.id);
      } else if (projectDetails?.unit_type === 'villas' && selectedVilla) {
        payload.villa_id = parseInt(selectedVilla.id);
      } else if (projectDetails?.unit_type === 'plots' && selectedPlot) {
        payload.plot_id = parseInt(selectedPlot.id);
      } else {
        alert('Please select a valid unit before creating the booking.');
        return;
      }

      // Call the API
      await billingAPI.createBooking(payload);
      
      alert('Booking saved successfully. Confirmation email sent to customer.');
      
      if (onSuccess) {
        onSuccess({
          ...formData,
          selectedUnit: selectedFlat || selectedVilla || selectedPlot,
          customerImagePreview,
          uploadedDocs
        });
      }
      
      if (onPageChange) {
        onPageChange('dashboard');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(`Failed to create booking: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <>
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
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowProjectDropdown((prev) => !prev)}
                            className={`w-full px-3 py-2.5 bg-white border rounded-lg text-left flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              errors.project ? 'border-red-500' : 'border-gray-300 hover:border-orange-400 focus:border-orange-500'
                            }`}
                          >
                            <span className={selectedProject ? 'text-gray-900' : 'text-gray-400'}>
                              {selectedProject ? selectedProject.label : projectsLoading ? 'Loading projects...' : 'Select a project'}
                            </span>
                            <HiChevronDown
                              className={`text-gray-400 transition-all ${showProjectDropdown ? 'transform rotate-180 text-orange-500' : ''}`}
                              style={{ fontSize: '1.25rem' }}
                            />
                          </button>
                          {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
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
                                <div className="px-3 py-3 text-red-500 text-center text-sm">{projectsError}</div>
                              ) : projectOptions.length === 0 ? (
                                <div className="px-3 py-3 text-gray-500 text-center text-sm">No projects available</div>
                              ) : (
                                projectOptions.map((project) => (
                                  <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => handleInputChange('project', project.id)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-medium text-gray-900">{project.label}</div>
                                    <div className="text-xs text-gray-500">{projects.find((p) => p.id === project.id)?.location || projects.find((p) => p.id === project.id)?.address || 'Location unavailable'}</div>
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
                          <p className="text-gray-900 font-medium">{selectedProject.label}</p>
                          <p className="text-sm text-gray-600">
                            {projects.find((p) => p.id?.toString() === formData.project)?.location ||
                              projects.find((p) => p.id?.toString() === formData.project)?.address ||
                              'Address unavailable'}
                          </p>
                          {projects.find((p) => p.id?.toString() === formData.project)?.builderName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Builder:{' '}
                              <span className="font-medium text-gray-800">
                                {projects.find((p) => p.id?.toString() === formData.project)?.builderName}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!formData.project}
                        className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-base ${
                          formData.project
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
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
                      <p className="text-gray-500 text-sm">Select an available unit based on the project hierarchy.</p>
                    </div>
                    <div className="space-y-5">
                      {hierarchyLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                        </div>
                      ) : hierarchyError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex flex-col gap-3">
                          <span>{hierarchyError}</span>
                          <button
                            type="button"
                            onClick={() => fetchHierarchy(formData.project)}
                            className="self-start px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                          >
                            Retry
                          </button>
                        </div>
                      ) : !projectHierarchy ? (
                        <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4">
                          Select a project to load its unit hierarchy.
                        </div>
                      ) : usingTowerFlow ? (
                        <>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tower <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={selectedTowerId}
                                  onChange={(e) => {
                                    setSelectedTowerId(e.target.value);
                                    setSelectedBlockId('');
                                    setSelectedFloorId('');
                                    setSelectedFlatId('');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                  <option value="">Select tower</option>
                                  {towers.map((tower) => (
                                    <option key={tower.id} value={tower.id}>
                                      {tower.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {selectedTowerId && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Block <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={selectedBlockId}
                                    onChange={(e) => {
                                      setSelectedBlockId(e.target.value);
                                      setSelectedFloorId('');
                                      setSelectedFlatId('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                  >
                                    <option value="">Select block</option>
                                    {blocks.map((block) => (
                                      <option key={block.id} value={block.id}>
                                        {block.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              {selectedBlockId && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={selectedFloorId}
                                    onChange={(e) => {
                                      setSelectedFloorId(e.target.value);
                                      setSelectedFlatId('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                  >
                                    <option value="">Select floor</option>
                                    {floors.map((floor) => (
                                      <option key={floor.id} value={floor.id}>
                                        Floor {floor.floor_number}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                            {selectedFloorId && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Select Flat <span className="text-red-500">*</span>
                                </label>
                                {allFlats.length === 0 ? (
                                  <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    No available flats on this floor
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {allFlats.map((flat) => {
                                      const isSelected = selectedFlatId === String(flat.id || flat.flat_number);
                                      const isAvailable = (flat.status || '').toLowerCase() === 'available';
                                      const isBooked = !isAvailable;
                                      
                                      return (
                                        <button
                                          key={flat.id || flat.flat_number}
                                          type="button"
                                          onClick={() => {
                                            if (isAvailable) {
                                              setSelectedFlatId(String(flat.id || flat.flat_number));
                                            }
                                          }}
                                          disabled={isBooked}
                                          className={`p-3 border rounded-lg text-center transition-all ${
                                            isSelected && isAvailable
                                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                                              : isAvailable
                                              ? 'border-green-300 bg-green-50 text-green-700 hover:border-green-400'
                                              : 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-75'
                                          }`}
                                        >
                                          <div className="font-medium">{flat.flat_number}</div>
                                          <div className="text-xs">
                                            {flat.flat_type}
                                            <span className={`block mt-1 text-xs font-medium ${
                                              isAvailable ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                              {isAvailable ? 'Available' : 'Booked'}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {errors.unitId && (
                                  <p className="text-red-500 text-xs mt-2">{errors.unitId}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : usesTowerFloorsFlow ? (
                        <>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Tower <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={selectedTowerId}
                                  onChange={(e) => {
                                    setSelectedTowerId(e.target.value);
                                    setSelectedFloorId('');
                                    setSelectedFlatId('');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                  <option value="">Select tower</option>
                                  {towers.map((tower) => (
                                    <option key={tower.id} value={tower.id}>
                                      {tower.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {selectedTowerId && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={selectedFloorId}
                                    onChange={(e) => {
                                      setSelectedFloorId(e.target.value);
                                      setSelectedFlatId('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                  >
                                    <option value="">Select floor</option>
                                    {floors.map((floor) => (
                                      <option key={floor.id} value={floor.id}>
                                        Floor {floor.floor_number}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                            {selectedFloorId && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                  Select Flat <span className="text-red-500">*</span>
                                </label>
                                {allFlats.length === 0 ? (
                                  <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    No available flats on this floor
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {allFlats.map((flat) => {
                                      const isSelected = selectedFlatId === String(flat.id || flat.flat_number);
                                      const isAvailable = (flat.status || '').toLowerCase() === 'available';
                                      const isBooked = !isAvailable;
                                      
                                      return (
                                        <button
                                          key={flat.id || flat.flat_number}
                                          type="button"
                                          onClick={() => {
                                            if (isAvailable) {
                                              setSelectedFlatId(String(flat.id || flat.flat_number));
                                            }
                                          }}
                                          disabled={isBooked}
                                          className={`p-3 border rounded-lg text-center transition-all ${
                                            isSelected && isAvailable
                                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                                              : isAvailable
                                              ? 'border-green-300 bg-green-50 text-green-700 hover:border-green-400'
                                              : 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-75'
                                          }`}
                                        >
                                          <div className="font-medium">{flat.flat_number}</div>
                                          <div className="text-xs">
                                            {flat.flat_type}
                                            <span className={`block mt-1 text-xs font-medium ${
                                              isAvailable ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                              {isAvailable ? 'Available' : 'Booked'}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                {errors.unitId && (
                                  <p className="text-red-500 text-xs mt-2">{errors.unitId}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : projectDetails?.unit_type === 'villas' ? (
                        <>
                          <div className="space-y-4">
                            {blocks.length > 0 && (
                              <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Block (optional)
                                </label>
                                <select
                                  value={selectedBlockId}
                                  onChange={(e) => {
                                    setSelectedBlockId(e.target.value);
                                    setSelectedFlatId('');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                  <option value="">All Blocks</option>
                                  {blocks.map((block) => (
                                    <option key={block.id} value={block.id}>
                                      {block.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Villa <span className="text-red-500">*</span>
                              </label>
                              {allVillas.length === 0 ? (
                                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                  No villas {selectedBlockId ? 'in this block' : ''}
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {allVillas.map((villa) => {
                                    const villaId = String(villa.id || villa.villa_number);
                                    const isSelected = selectedFlatId === villaId;
                                    const isAvailable = villa.is_available !== undefined ? villa.is_available : true;
                                    const isBooked = villa.is_sold || !isAvailable;
                                    
                                    return (
                                      <button
                                        key={villaId}
                                        type="button"
                                        onClick={() => {
                                          if (!isBooked) {
                                            setSelectedFlatId(villaId);
                                          }
                                        }}
                                        disabled={isBooked}
                                        className={`p-3 border rounded-lg text-center transition-all ${
                                          isSelected && !isBooked
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : !isBooked
                                            ? 'border-green-300 bg-green-50 text-green-700 hover:border-green-400'
                                            : 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-75'
                                        }`}
                                      >
                                        <div className="font-medium">Villa {villa.villa_number}</div>
                                        <div className="text-xs">
                                          {villa.villa_type}
                                          <span className={`block mt-1 text-xs font-medium ${
                                            !isBooked ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {!isBooked ? 'Available' : 'Booked'}
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {errors.unitId && (
                                <p className="text-red-500 text-xs mt-2">{errors.unitId}</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : projectDetails?.unit_type === 'plots' ? (
                        <>
                          <div className="space-y-4">
                            {blocks.length > 0 && (
                              <div className="max-w-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Block (optional)
                                </label>
                                <select
                                  value={selectedBlockId}
                                  onChange={(e) => {
                                    setSelectedBlockId(e.target.value);
                                    setSelectedFlatId('');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                  <option value="">All Blocks</option>
                                  {blocks.map((block) => (
                                    <option key={block.id} value={block.id}>
                                      {block.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Plot <span className="text-red-500">*</span>
                              </label>
                              {allPlots.length === 0 ? (
                                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                  No plots {selectedBlockId ? 'in this block' : ''}
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {allPlots.map((plot) => {
                                    const plotId = String(plot.id || plot.plot_number);
                                    const isSelected = selectedFlatId === plotId;
                                    const isAvailable = plot.is_available !== undefined ? plot.is_available : true;
                                    const isBooked = plot.is_sold || !isAvailable;
                                    
                                    return (
                                      <button
                                        key={plotId}
                                        type="button"
                                        onClick={() => {
                                          if (!isBooked) {
                                            setSelectedFlatId(plotId);
                                          }
                                        }}
                                        disabled={isBooked}
                                        className={`p-3 border rounded-lg text-center transition-all ${
                                          isSelected && !isBooked
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : !isBooked
                                            ? 'border-green-300 bg-green-50 text-green-700 hover:border-green-400'
                                            : 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-75'
                                        }`}
                                      >
                                        <div className="font-medium">Plot {plot.plot_number}</div>
                                        <div className="text-xs">
                                          {plot.plot_type}
                                          <span className={`block mt-1 text-xs font-medium ${
                                            !isBooked ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {!isBooked ? 'Available' : 'Booked'}
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {errors.unitId && (
                                <p className="text-red-500 text-xs mt-2">{errors.unitId}</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (projectDetails?.unit_type === 'flats' || !projectDetails?.unit_type) &&
                        blocks.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Block <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={selectedBlockId}
                                onChange={(e) => {
                                  setSelectedBlockId(e.target.value);
                                  setSelectedFloorId('');
                                  setSelectedFlatId('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              >
                                <option value="">
                                  {blocks.length ? 'Select block' : 'No blocks found'}
                                </option>
                                {blocks.map((block) => (
                                  <option key={block.id} value={block.id}>
                                    {block.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {selectedBlockId && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Floor <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={selectedFloorId}
                                  onChange={(e) => {
                                    setSelectedFloorId(e.target.value);
                                    setSelectedFlatId('');
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                  <option value="">
                                    {floors.length ? 'Select floor' : 'No floors found'}
                                  </option>
                                  {floors.map((floor) => (
                                    <option key={floor.id} value={floor.id}>
                                      Floor {floor.floor_number} {floor.name ? `- ${floor.name}` : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                          {selectedFloorId && (
                            <div className="space-y-3">
                              <label className="block text-sm font-semibold text-gray-700">
                                Available Flats
                              </label>
                              {allFlats.length === 0 ? (
                                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4">
                                  No available flats on this floor. Please choose a different floor.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {allFlats.map((flat) => {
                                    const isSelected =
                                      selectedFlatId === String(flat.id || flat.flat_number);
                                    return (
                                      <button
                                        key={flat.id || flat.flat_number}
                                        type="button"
                                        onClick={() =>
                                          setSelectedFlatId(String(flat.id || flat.flat_number))
                                        }
                                        className={`p-4 border rounded-xl text-left transition-all ${
                                          isSelected
                                            ? 'border-orange-500 bg-orange-50 shadow'
                                            : 'border-gray-200 hover:border-orange-400'
                                        }`}
                                      >
                                        <div className="font-semibold text-gray-900">
                                          Flat {flat.flat_number}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {flat.flat_type || '—'} · {flat.area_sqft} sqft
                                        </div>
                                        <div className="text-xs text-green-600 font-medium mt-1">
                                          Status: {flat.status}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {errors.unitId && (
                                <p className="text-red-500 text-xs mt-1">{errors.unitId}</p>
                              )}
                            </div>
                          )}
                          {selectedFlat && (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Selected Unit Summary
                              </h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                <li>
                                  <span className="text-gray-500">Block:</span>{' '}
                                  {selectedBlock?.name || '—'}
                                </li>
                                <li>
                                  <span className="text-gray-500">Floor:</span>{' '}
                                  {selectedFloor?.name || selectedFloor?.floor_number || '—'}
                                </li>
                                <li>
                                  <span className="text-gray-500">Flat:</span>{' '}
                                  {selectedFlat.flat_number} ({selectedFlat.flat_type || 'Flat'})
                                </li>
                              </ul>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          Unit selection for this structure type (
                          {projectDetails?.structure_type || 'unknown'}) or unit type (
                          {projectDetails?.unit_type || 'unknown'}) is not yet supported.
                        </div>
                      )}

                      {selectedUnit && (
                        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-orange-700">
                              Selected: {selectedUnit.flat_number} ({selectedUnit.flat_type})
                            </span>
                          </div>
                        </div>
                      )}
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
                        disabled={!formData.unitId}
                        className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                          formData.unitId
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
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
                      <p className="text-gray-500 text-sm">Choose existing customer or create new customer.</p>
                    </div>
                    
                    {/* Customer Type Selection - Card Style */}
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleInputChange('customerType', 'existing')}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            formData.customerType === 'existing'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-orange-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              formData.customerType === 'existing'
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.customerType === 'existing' && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">Existing Customer</div>
                              <div className="text-xs text-gray-500">Select from existing customers</div>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange('customerType', 'new')}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            formData.customerType === 'new'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-orange-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                              formData.customerType === 'new'
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                            }`}>
                              {formData.customerType === 'new' && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">Create New Customer</div>
                              <div className="text-xs text-gray-500">Add a new customer</div>
                            </div>
                          </div>
                        </button>
                      </div>
                      {errors.customerType && (
                        <p className="text-red-500 text-xs mt-2">{errors.customerType}</p>
                      )}
                    </div>

                    {/* Existing Customer Selection */}
                    {formData.customerType === 'existing' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block font-medium text-gray-700 mb-3">
                            Select Customer <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={formData.existingCustomerId}
                              onChange={(e) => {
                                const customerId = e.target.value;
                                const customer = existingCustomers.find(c => c.id.toString() === customerId);
                                if (customer) {
                                  handleExistingCustomerSelect(customer);
                                } else {
                                  handleInputChange('existingCustomerId', customerId);
                                  setSelectedExistingCustomer(null);
                                }
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              disabled={loadingCustomers}
                            >
                              <option value="">
                                {loadingCustomers ? 'Loading customers...' : 'Choose a customer'}
                              </option>
                              {existingCustomers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                  {customer.full_name} • {customer.email}
                                </option>
                              ))}
                            </select>
                            {loadingCustomers && (
                              <div className="absolute right-4 top-3.5">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                              </div>
                            )}
                          </div>
                          {errors.existingCustomerId && (
                            <p className="text-red-500 text-xs mt-2">{errors.existingCustomerId}</p>
                          )}
                        </div>
                        
                        {/* Selected Customer Card */}
                        {selectedExistingCustomer && (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 font-semibold text-sm">
                                    {selectedExistingCustomer.full_name.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <h4 className="font-semibold text-gray-900">{selectedExistingCustomer.full_name}</h4>
                                  <p className="text-gray-600 text-sm">{selectedExistingCustomer.email}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                selectedExistingCustomer.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {selectedExistingCustomer.status}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-700 font-medium">Phone:</span>
                                <span className="text-gray-600 ml-1">{selectedExistingCustomer.phone_number}</span>
                              </div>
                              <div>
                                <span className="text-gray-700 font-medium">KYC:</span>
                                <span className="text-gray-600 ml-1">{selectedExistingCustomer.kyc_id || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* New Customer Form */}
                    {formData.customerType === 'new' && (
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="border border-gray-200 rounded-lg p-6 bg-white">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                First Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.customer.firstName}
                                onChange={(e) => handleInputChange('customer.firstName', e.target.value)}
                                placeholder="Enter first name"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.firstName'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.firstName'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.firstName']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Last Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.customer.lastName}
                                onChange={(e) => handleInputChange('customer.lastName', e.target.value)}
                                placeholder="Enter last name"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.lastName'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.lastName'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.lastName']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={formData.customer.email}
                                onChange={(e) => handleInputChange('customer.email', e.target.value)}
                                placeholder="Enter email address"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.email'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.email']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={formData.customer.phoneNumber}
                                onChange={(e) => handleInputChange('customer.phoneNumber', e.target.value)}
                                placeholder="Enter phone number"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.phoneNumber'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.phoneNumber'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.phoneNumber']}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Account & Personal Details */}
                        <div className="border border-gray-200 rounded-lg p-6 bg-white">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Account & Personal Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Username <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.customer.username}
                                onChange={(e) => handleInputChange('customer.username', e.target.value)}
                                placeholder="Enter username"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.username'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.username'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.username']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="password"
                                value={formData.customer.password}
                                onChange={(e) => handleInputChange('customer.password', e.target.value)}
                                placeholder="Enter password"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.password'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.password'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.password']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Father's Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.customer.fatherName}
                                onChange={(e) => handleInputChange('customer.fatherName', e.target.value)}
                                placeholder="Enter father's name"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.fatherName'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.fatherName'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.fatherName']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={formData.customer.dateOfBirth}
                                onChange={(e) => handleInputChange('customer.dateOfBirth', e.target.value)}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.dateOfBirth'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.dateOfBirth'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.dateOfBirth']}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block font-medium text-gray-700 mb-2">
                              Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={formData.customer.address}
                              onChange={(e) => handleInputChange('customer.address', e.target.value)}
                              placeholder="Enter complete address"
                              rows="2"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none bg-white ${
                                errors['customer.address'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['customer.address'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['customer.address']}</p>
                            )}
                          </div>
                        </div>

                        {/* Documents & Verification */}
                        <div className="border border-gray-200 rounded-lg p-6 bg-white">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Documents & Verification
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                PAN Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={formData.customer.panNumber}
                                onChange={(e) => handleInputChange('customer.panNumber', e.target.value.toUpperCase())}
                                placeholder="Enter PAN number"
                                maxLength="10"
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                  errors['customer.panNumber'] ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors['customer.panNumber'] && (
                                <p className="text-red-500 text-xs mt-1">{errors['customer.panNumber']}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                KYC ID
                              </label>
                              <input
                                type="text"
                                value={formData.customer.kycId}
                                onChange={(e) => handleInputChange('customer.kycId', e.target.value)}
                                placeholder="Enter KYC ID"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Status
                              </label>
                              <select
                                value={formData.customer.status}
                                onChange={(e) => handleInputChange('customer.status', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </div>
                            <div className="flex items-center pt-8">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.customer.kycVerified}
                                  onChange={(e) => handleInputChange('customer.kycVerified', e.target.checked)}
                                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="ml-2 font-medium text-gray-700">
                                  KYC Verified
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Optional Information */}
                        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Optional Information
                            <span className="ml-2 text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">Optional</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Occupation
                              </label>
                              <input
                                type="text"
                                value={formData.customer.occupation}
                                onChange={(e) => handleInputChange('customer.occupation', e.target.value)}
                                placeholder="Enter occupation"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Company Name
                              </label>
                              <input
                                type="text"
                                value={formData.customer.companyName}
                                onChange={(e) => handleInputChange('customer.companyName', e.target.value)}
                                placeholder="Enter company name"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Annual Income (₹)
                              </label>
                              <input
                                type="number"
                                value={formData.customer.annualIncome}
                                onChange={(e) => handleInputChange('customer.annualIncome', e.target.value)}
                                placeholder="Enter annual income"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Emergency Contact Name
                              </label>
                              <input
                                type="text"
                                value={formData.customer.emergencyContactName}
                                onChange={(e) => handleInputChange('customer.emergencyContactName', e.target.value)}
                                placeholder="Enter emergency contact name"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Emergency Contact Phone
                              </label>
                              <input
                                type="tel"
                                value={formData.customer.emergencyContactPhone}
                                onChange={(e) => handleInputChange('customer.emergencyContactPhone', e.target.value)}
                                placeholder="Enter emergency contact phone"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-2">
                                Emergency Contact Relationship
                              </label>
                              <select
                                value={formData.customer.emergencyContactRelation}
                                onChange={(e) => handleInputChange('customer.emergencyContactRelation', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                              >
                                <option value="">Select relationship</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Child">Child</option>
                                <option value="Friend">Friend</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                        disabled={loadingCustomers}
                        className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                          loadingCustomers
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow'
                        }`}
                      >
                        {loadingCustomers ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Customer...
                          </div>
                        ) : (
                          'Continue'
                        )}
                      </button>
                    </div>
                  </>
                )}

                {currentStepId === 'coApplicants' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Co-Applicants & Nominee
                      </h2>
                      <p className="text-gray-500 text-sm">Add co-applicants and nominee (optional).</p>
                    </div>

                    <div className="space-y-8">
                      {/* Co-Applicants Section */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Co-Applicants</h3>
                            <p className="text-gray-500 text-sm mt-1">Maximum 2 co-applicants allowed</p>
                          </div>
                        </div>
                        
                        {/* Existing Co-Applicants from Selected Customer */}
                        <div className="space-y-4">
                          {selectedExistingCustomer?.primary_coapplicant && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{selectedExistingCustomer.primary_coapplicant.name}</h4>
                                  <p className="text-gray-600 text-sm">{selectedExistingCustomer.primary_coapplicant.relationship} • Primary Co-Applicant</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div><span className="font-medium text-gray-700">Email:</span> {selectedExistingCustomer.primary_coapplicant.email}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {selectedExistingCustomer.primary_coapplicant.phone_number}</div>
                                <div><span className="font-medium text-gray-700">PAN:</span> {selectedExistingCustomer.primary_coapplicant.pan_number}</div>
                                <div><span className="font-medium text-gray-700">Income:</span> ₹{selectedExistingCustomer.primary_coapplicant.annual_income}</div>
                              </div>
                            </div>
                          )}

                          {selectedExistingCustomer?.secondary_coapplicant && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{selectedExistingCustomer.secondary_coapplicant.name}</h4>
                                  <p className="text-gray-600 text-sm">{selectedExistingCustomer.secondary_coapplicant.relationship} • Secondary Co-Applicant</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div><span className="font-medium text-gray-700">Email:</span> {selectedExistingCustomer.secondary_coapplicant.email}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {selectedExistingCustomer.secondary_coapplicant.phone_number}</div>
                                <div><span className="font-medium text-gray-700">PAN:</span> {selectedExistingCustomer.secondary_coapplicant.pan_number}</div>
                                <div><span className="font-medium text-gray-700">Income:</span> ₹{selectedExistingCustomer.secondary_coapplicant.annual_income}</div>
                              </div>
                            </div>
                          )}

                          {/* Newly Added Co-Applicants */}
                          {coApplicants.map((coApplicant, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{coApplicant.name}</h4>
                                  <p className="text-gray-600 text-sm">{coApplicant.relationship} • New Co-Applicant</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCoApplicants(prev => prev.filter((_, i) => i !== index))}
                                  className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div><span className="font-medium text-gray-700">Email:</span> {coApplicant.email}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {coApplicant.phoneNumber}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Co-Applicant Logic */}
                        {(() => {
                          const existingCount = (selectedExistingCustomer?.primary_coapplicant ? 1 : 0) + 
                                             (selectedExistingCustomer?.secondary_coapplicant ? 1 : 0);
                          const totalCount = existingCount + coApplicants.length;
                          
                          if (totalCount === 0) {
                            return (
                              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-gray-500 mb-4">No co-applicants added</p>
                                <button
                                  type="button"
                                  onClick={() => setShowCoApplicantForm(true)}
                                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                >
                                  Add Co-Applicant
                                </button>
                              </div>
                            );
                          } else if (totalCount < 2) {
                            return (
                              <button
                                type="button"
                                onClick={() => setShowCoApplicantForm(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                              >
                                + Add Another Co-Applicant
                              </button>
                            );
                          } else {
                            return (
                              <div className="text-center py-3 bg-gray-100 border border-gray-200 rounded-lg">
                                <p className="text-gray-600 text-sm">Maximum limit of 2 co-applicants reached</p>
                              </div>
                            );
                          }
                        })()}
                      </div>

                      {/* Nominee Section */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Nominee</h3>
                            <p className="text-gray-500 text-sm mt-1">Maximum 1 nominee allowed</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Existing Nominee from Selected Customer */}
                          {selectedExistingCustomer?.nominee && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{selectedExistingCustomer.nominee.name}</h4>
                                  <p className="text-gray-600 text-sm">{selectedExistingCustomer.nominee.relationship} • Existing Nominee</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div><span className="font-medium text-gray-700">Email:</span> {selectedExistingCustomer.nominee.email}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {selectedExistingCustomer.nominee.phone_number}</div>
                                <div><span className="font-medium text-gray-700">PAN:</span> {selectedExistingCustomer.nominee.pan_number}</div>
                                <div><span className="font-medium text-gray-700">DOB:</span> {selectedExistingCustomer.nominee.date_of_birth}</div>
                              </div>
                            </div>
                          )}

                          {/* Newly Added Nominee */}
                          {nominee && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{nominee.name}</h4>
                                  <p className="text-gray-600 text-sm">{nominee.relationship} • New Nominee</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setNominee(null)}
                                  className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div><span className="font-medium text-gray-700">Email:</span> {nominee.email}</div>
                                <div><span className="font-medium text-gray-700">Phone:</span> {nominee.phoneNumber}</div>
                              </div>
                            </div>
                          )}

                          {/* Add Nominee Logic */}
                          {(() => {
                            const hasExistingNominee = !!selectedExistingCustomer?.nominee;
                            const totalCount = (hasExistingNominee ? 1 : 0) + (nominee ? 1 : 0);
                            
                            if (totalCount === 0) {
                              return (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                  <p className="text-gray-500 mb-4">No nominee added</p>
                                  <button
                                    type="button"
                                    onClick={() => setShowNomineeForm(true)}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                  >
                                    Add Nominee
                                  </button>
                                </div>
                              );
                            } else if (totalCount >= 1) {
                              return (
                                <div className="text-center py-3 bg-gray-100 border border-gray-200 rounded-lg">
                                  <p className="text-gray-600 text-sm">Nominee has been added</p>
                                </div>
                              );
                            }
                          })()}
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

                {currentStepId === 'payment' && (
                  <>
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h2 className="font-bold text-gray-900 mb-1" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                        Payment Information
                      </h2>
                      <p className="text-gray-500 text-sm">Enter payment details and select options.</p>
                    </div>

                    <div className="space-y-8">
                      {/* Booking Details */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                          Booking Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Booking Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.payment.bookingDate}
                              onChange={(e) => handleInputChange('payment.bookingDate', e.target.value)}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.bookingDate'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['payment.bookingDate'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.bookingDate']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Total Cost (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.payment.totalCost}
                              onChange={(e) => handleInputChange('payment.totalCost', e.target.value)}
                              placeholder="₹ 50,00,000"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.totalCost'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['payment.totalCost'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.totalCost']}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rates & Amounts */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                          Rates & Amounts
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Company Rate (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.payment.companyRate}
                              onChange={(e) => handleInputChange('payment.companyRate', e.target.value)}
                              placeholder="₹ 200"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.companyRate'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['payment.companyRate'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.companyRate']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Login Rate (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.payment.loginRate}
                              onChange={(e) => handleInputChange('payment.loginRate', e.target.value)}
                              placeholder="₹ 500"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.loginRate'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['payment.loginRate'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.loginRate']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Initial Amount (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.payment.logInitialAmount}
                              onChange={(e) => handleInputChange('payment.logInitialAmount', e.target.value)}
                              placeholder="₹ 5,00,000"
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.logInitialAmount'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors['payment.logInitialAmount'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.logInitialAmount']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Discount Amount (₹)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.payment.discountAmount}
                              onChange={(e) => handleInputChange('payment.discountAmount', e.target.value)}
                              placeholder="₹ 40,000"
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Selection Options */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                          Payment Options
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Payment Plan <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.payment.paymentPlan}
                              onChange={(e) => handleInputChange('payment.paymentPlan', e.target.value)}
                              disabled={loadingPaymentOptions}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.paymentPlan'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">
                                {loadingPaymentOptions ? 'Loading plans...' : 'Select Payment Plan'}
                              </option>
                              {paymentPlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name} - {plan.plan_type} ({plan.duration_months}m)
                                </option>
                              ))}
                            </select>
                            {errors['payment.paymentPlan'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.paymentPlan']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Bank <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.payment.bank}
                              onChange={(e) => handleInputChange('payment.bank', e.target.value)}
                              disabled={loadingPaymentOptions}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.bank'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">
                                {loadingPaymentOptions ? 'Loading banks...' : 'Select Bank'}
                              </option>
                              {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                  {bank.name} • {bank.branch}
                                </option>
                              ))}
                            </select>
                            {errors['payment.bank'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.bank']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 mb-2">
                              Channel Partner <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.payment.channelPartner}
                              onChange={(e) => handleInputChange('payment.channelPartner', e.target.value)}
                              disabled={loadingPaymentOptions}
                              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white ${
                                errors['payment.channelPartner'] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">
                                {loadingPaymentOptions ? 'Loading partners...' : 'Select Channel Partner'}
                              </option>
                              {channelPartners.map((partner) => (
                                <option key={partner.id} value={partner.id}>
                                  {partner.first_name} {partner.last_name} • {partner.dealer_id}
                                </option>
                              ))}
                            </select>
                            {errors['payment.channelPartner'] && (
                              <p className="text-red-500 text-xs mt-1">{errors['payment.channelPartner']}</p>
                            )}
                          </div>
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
    {showProjectDropdown && (
      <div
        className="fixed inset-0 z-40"
        onClick={() => setShowProjectDropdown(false)}
      />
    )}

    {/* Co-Applicant Form Modal */}
    {showCoApplicantForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add Co-Applicant</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCoApplicantForm(false);
                  setCoApplicantForm({
                    name: '', fatherName: '', dateOfBirth: '', gender: 'M',
                    email: '', phoneNumber: '', address: '', panNumber: '',
                    occupation: '', annualIncome: '', relationship: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={coApplicantForm.name}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Father's Name *</label>
                  <input
                    type="text"
                    value={coApplicantForm.fatherName}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, fatherName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter father's name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={coApplicantForm.email}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={coApplicantForm.phoneNumber}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={coApplicantForm.dateOfBirth}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={coApplicantForm.gender}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={coApplicantForm.address}
                  onChange={(e) => setCoApplicantForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Enter complete address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">PAN Number *</label>
                  <input
                    type="text"
                    value={coApplicantForm.panNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().substring(0, 10); // Limit to 10 characters
                      setCoApplicantForm(prev => ({ ...prev, panNumber: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter PAN number (10 characters)"
                    maxLength="10"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Relationship *</label>
                  <select
                    value={coApplicantForm.relationship}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    value={coApplicantForm.occupation}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter occupation"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Annual Income</label>
                  <input
                    type="number"
                    value={coApplicantForm.annualIncome}
                    onChange={(e) => setCoApplicantForm(prev => ({ ...prev, annualIncome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter annual income"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCoApplicantForm(false);
                  setCoApplicantForm({
                    name: '', fatherName: '', dateOfBirth: '', gender: 'M',
                    email: '', phoneNumber: '', address: '', panNumber: '',
                    occupation: '', annualIncome: '', relationship: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!coApplicantForm.name || !coApplicantForm.fatherName || !coApplicantForm.email || 
                      !coApplicantForm.phoneNumber || !coApplicantForm.dateOfBirth || !coApplicantForm.address || 
                      !coApplicantForm.panNumber || !coApplicantForm.relationship) {
                    alert('Please fill all required fields');
                    return;
                  }
                  
                  try {
                    const customerId = formData.existingCustomerId || selectedExistingCustomer?.id;
                    
                    if (!customerId) {
                      alert('No customer selected. Please select a customer first.');
                      return;
                    }
                    
                    if (!formData.project) {
                      alert('No project selected. Please select a project first.');
                      return;
                    }
                    
                    
                    await accountsAPI.createCoApplicant(formData.project, customerId, coApplicantForm);
                    setCoApplicants(prev => [...prev, coApplicantForm]);
                    setShowCoApplicantForm(false);
                    setCoApplicantForm({
                      name: '', fatherName: '', dateOfBirth: '', gender: 'M',
                      email: '', phoneNumber: '', address: '', panNumber: '',
                      occupation: '', annualIncome: '', relationship: ''
                    });
                    alert('Co-applicant added successfully!');
                  } catch (error) {
                    console.error('Error creating co-applicant:', error);
                    alert(`Failed to add co-applicant: ${error.message || 'Please try again.'}`);
                  }
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add Co-Applicant
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Nominee Form Modal */}
    {showNomineeForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add Nominee</h3>
              <button
                type="button"
                onClick={() => {
                  setShowNomineeForm(false);
                  setNomineeForm({
                    name: '', fatherHusbandName: '', email: '', dateOfBirth: '',
                    phoneNumber: '', address: '', panNumber: '', relationship: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={nomineeForm.name}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Father/Husband Name *</label>
                  <input
                    type="text"
                    value={nomineeForm.fatherHusbandName}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, fatherHusbandName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter father/husband name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={nomineeForm.email}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={nomineeForm.phoneNumber}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={nomineeForm.dateOfBirth}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">Relationship *</label>
                  <select
                    value={nomineeForm.relationship}
                    onChange={(e) => setNomineeForm(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={nomineeForm.address}
                  onChange={(e) => setNomineeForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Enter complete address"
                />
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-2">PAN Number *</label>
                  <input
                    type="text"
                    value={nomineeForm.panNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().substring(0, 10); // Limit to 10 characters
                      setNomineeForm(prev => ({ ...prev, panNumber: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter PAN number (10 characters)"
                    maxLength="10"
                  />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowNomineeForm(false);
                  setNomineeForm({
                    name: '', fatherHusbandName: '', email: '', dateOfBirth: '',
                    phoneNumber: '', address: '', panNumber: '', relationship: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!nomineeForm.name || !nomineeForm.fatherHusbandName || !nomineeForm.email || 
                      !nomineeForm.phoneNumber || !nomineeForm.dateOfBirth || !nomineeForm.address || 
                      !nomineeForm.panNumber || !nomineeForm.relationship) {
                    alert('Please fill all required fields');
                    return;
                  }
                  
                  try {
                    const customerId = formData.existingCustomerId || selectedExistingCustomer?.id;
                    
                    if (!customerId) {
                      alert('No customer selected. Please select a customer first.');
                      return;
                    }
                    
                    if (!formData.project) {
                      alert('No project selected. Please select a project first.');
                      return;
                    }
                    
                    await accountsAPI.createNominee(formData.project, customerId, nomineeForm);
                    setNominee(nomineeForm);
                    setShowNomineeForm(false);
                    setNomineeForm({
                      name: '', fatherHusbandName: '', email: '', dateOfBirth: '',
                      phoneNumber: '', address: '', panNumber: '', relationship: ''
                    });
                    alert('Nominee added successfully!');
                  } catch (error) {
                    console.error('Error creating nominee:', error);
                    alert(`Failed to add nominee: ${error.message || 'Please try again.'}`);
                  }
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add Nominee
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default NewBooking;

