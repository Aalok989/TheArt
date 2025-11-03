import React, { useState, useEffect } from 'react';
import { HiPlus, HiChevronDown, HiX, HiPhotograph, HiTrash } from 'react-icons/hi';
import { fetchBlocksByProject, fetchFlatTemplates } from '../../api/mockData';
import { propertiesAPI } from '../../api/api';

const NewProject = ({ onPageChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    location: '',
    description: '',
    logo: null,
    headerImage: null,
    footerImage: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [footerImagePreview, setFooterImagePreview] = useState(null);
  const [projectStructureType, setProjectStructureType] = useState('');
  const [unitType, setUnitType] = useState('');
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [allBlocks, setAllBlocks] = useState([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [showCreateBlockForm, setShowCreateBlockForm] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [floors, setFloors] = useState([
    { id: 1, floorNumber: '', flats: [], selectedTemplate: '' }
  ]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState({});
  const [showAddTemplateForm, setShowAddTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateFlats, setNewTemplateFlats] = useState([{ flatNumber: '', type: '', area: '' }]);
  const [flatTemplates, setFlatTemplates] = useState([]);

  // Fetch projects data on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projects = await propertiesAPI.getProjects();
        if (Array.isArray(projects)) {
          setAllProjects(projects);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Fetch flat templates data on component mount
  useEffect(() => {
    const loadFlatTemplates = async () => {
      try {
        const response = await fetchFlatTemplates();
        if (response.success) {
          setFlatTemplates(response.data);
        }
      } catch (error) {
        console.error('Error loading flat templates:', error);
      }
    };

    loadFlatTemplates();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Select or Create Project',
      subtitle: 'Select an existing Project or Create New Project to continue.',
      completed: currentStep > 1,
      active: currentStep === 1
    },
    {
      number: 2,
      title: 'Project Type & Unit Type',
      subtitle: 'Choose your preferred Project type and Unit type.',
      completed: currentStep > 2,
      active: currentStep === 2
    },
    {
      number: 3,
      title: 'Select or Create Block',
      subtitle: 'Select an existing Block or Create New Block to continue.',
      completed: currentStep > 3,
      active: currentStep === 3
    },
    {
      number: 4,
      title: 'Floors & Flats',
      subtitle: 'Please provide Floor Number and Flat Details.',
      completed: currentStep > 4,
      active: currentStep === 4
    }
  ];

  const handleProjectSelect = (project) => {
    setSelectedProject(project.id || project.name); // Store ID for API calls, fallback to name
    setShowProjectDropdown(false);
  };

  const handleCreateNewProject = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setNewProjectData({
      name: '',
      location: '',
      description: '',
      logo: null,
      headerImage: null,
      footerImage: null
    });
    setLogoPreview(null);
    setHeaderImagePreview(null);
    setFooterImagePreview(null);
  };

  const handleInputChange = (field, value) => {
    setNewProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      setNewProjectData(prev => ({
        ...prev,
        [field]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          setLogoPreview(reader.result);
        } else if (field === 'headerImage') {
          setHeaderImagePreview(reader.result);
        } else if (field === 'footerImage') {
          setFooterImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (field) => {
    setNewProjectData(prev => ({
      ...prev,
      [field]: null
    }));
    if (field === 'logo') {
      setLogoPreview(null);
    } else if (field === 'headerImage') {
      setHeaderImagePreview(null);
    } else if (field === 'footerImage') {
      setFooterImagePreview(null);
    }
  };

  const handleSubmitNewProject = async (e) => {
    e.preventDefault();
    try {
      // Call the real API to create the project
      const response = await propertiesAPI.createProject(newProjectData);
      
      // Refresh the projects list
      const projects = await propertiesAPI.getProjects();
      if (Array.isArray(projects)) {
        setAllProjects(projects);
      }
      
      // Select the newly created project
      if (response && response.id) {
        setSelectedProject(response.id);
      }
      
      alert('Project created successfully!');
      handleCloseCreateForm();
      // Optionally continue to next step
      // setCurrentStep(2);
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleContinue = () => {
    // Validate step requirements
    if (currentStep === 1 && !selectedProject) {
      return;
    }
    if (currentStep === 2 && (!projectStructureType || !unitType)) {
      return;
    }
    if (currentStep === 3 && !selectedBlock) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit form
      console.log('Form submitted');
    }
  };

  const handleStructureSelect = (type) => {
    setProjectStructureType(type);
    setShowStructureDropdown(false);
    // Reset unit type when structure type changes
    setUnitType('');
  };

  const handleUnitSelect = (type) => {
    setUnitType(type);
    setShowUnitDropdown(false);
  };

  // Get available unit types based on project structure
  const getAvailableUnitTypes = () => {
    if (projectStructureType === 'Tower(High-rise with Blocks)') {
      return ['Flats(Apartments)'];
    } else if (projectStructureType === 'Block(Direct Unit Management)') {
      return ['Flats(Apartments)', 'Plots(Land Parcels)', 'Villas(Independent Houses)'];
    }
    return [];
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    // Allow clicking on completed steps or current step to navigate
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Fetch blocks when step 3 is reached
  useEffect(() => {
    if (currentStep === 3 && selectedProject) {
      const loadBlocks = async () => {
        try {
          setBlocksLoading(true);
          const response = await fetchBlocksByProject(selectedProject);
          if (response.success) {
            setAllBlocks(response.data);
          }
          setBlocksLoading(false);
        } catch (error) {
          console.error('Error loading blocks:', error);
          setBlocksLoading(false);
        }
      };
      loadBlocks();
    }
  }, [currentStep, selectedProject]);

  const handleBlockSelect = (block) => {
    setSelectedBlock(block.name);
    setShowBlockDropdown(false);
  };

  const handleCreateNewBlock = () => {
    setShowCreateBlockForm(true);
  };

  const handleCloseCreateBlockForm = () => {
    setShowCreateBlockForm(false);
    setNewBlockName('');
  };

  const handleSubmitNewBlock = (e) => {
    e.preventDefault();
    if (newBlockName.trim()) {
      // Create new block - in real app, make API call
      const newBlock = {
        id: Date.now(),
        name: newBlockName.trim()
      };
      setAllBlocks(prev => [...prev, newBlock]);
      setSelectedBlock(newBlock.name);
      handleCloseCreateBlockForm();
      // Optionally show success message
      alert('Block created successfully!');
    }
  };

  const handleTemplateSelect = (floorId, template) => {
    setShowTemplateDropdown(prev => ({ ...prev, [floorId]: false }));
    // Apply template to the specific floor
    setFloors(floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, selectedTemplate: template.name, flats: [...template.flats] }
        : floor
    ));
  };

  const handleClearTemplate = (floorId) => {
    setShowTemplateDropdown(prev => ({ ...prev, [floorId]: false }));
    // Clear template selection and remove flats added from template
    setFloors(floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, selectedTemplate: '', flats: [] }
        : floor
    ));
  };

  const handleOpenAddTemplateForm = () => {
    setShowAddTemplateForm(true);
    setNewTemplateName('');
    setNewTemplateFlats([{ flatNumber: '', type: '', area: '' }]);
  };

  const handleCloseAddTemplateForm = () => {
    setShowAddTemplateForm(false);
    setNewTemplateName('');
    setNewTemplateFlats([{ flatNumber: '', type: '', area: '' }]);
  };

  const handleAddFlatToTemplate = () => {
    setNewTemplateFlats([...newTemplateFlats, { flatNumber: '', type: '', area: '' }]);
  };

  const handleRemoveFlatFromTemplate = (index) => {
    if (newTemplateFlats.length > 1) {
      setNewTemplateFlats(newTemplateFlats.filter((_, idx) => idx !== index));
    }
  };

  const handleFlatChangeInTemplate = (index, field, value) => {
    setNewTemplateFlats(newTemplateFlats.map((flat, idx) => 
      idx === index ? { ...flat, [field]: value } : flat
    ));
  };

  const handleSubmitNewTemplate = (e) => {
    e.preventDefault();
    if (newTemplateName.trim() && newTemplateFlats.length > 0) {
      const newTemplate = {
        id: Date.now(), // Generate unique ID
        name: newTemplateName.trim(),
        flats: newTemplateFlats.filter(flat => flat.flatNumber || flat.type || flat.area)
      };
      setFlatTemplates(prev => [...prev, newTemplate]);
      handleCloseAddTemplateForm();
      alert('Template created successfully!');
      // In a real app, you would also call an API to save the template
      // await saveTemplate(newTemplate);
    }
  };

  const handleAddFloor = () => {
    const newFloor = {
      id: Date.now(),
      floorNumber: '',
      flats: [],
      selectedTemplate: ''
    };
    setFloors([...floors, newFloor]);
  };

  const handleRemoveFloor = (floorId) => {
    if (floors.length > 1) {
      setFloors(floors.filter(floor => floor.id !== floorId));
    }
  };

  const handleFloorNumberChange = (floorId, value) => {
    setFloors(floors.map(floor => 
      floor.id === floorId ? { ...floor, floorNumber: value } : floor
    ));
  };

  const handleAddFlat = (floorId) => {
    setFloors(floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, flats: [...floor.flats, { flatNumber: '', type: '', area: '' }] }
        : floor
    ));
  };

  const handleRemoveFlat = (floorId, flatIndex) => {
    setFloors(floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, flats: floor.flats.filter((_, idx) => idx !== flatIndex) }
        : floor
    ));
  };

  const handleFlatChange = (floorId, flatIndex, field, value) => {
    setFloors(floors.map(floor => 
      floor.id === floorId 
        ? { 
            ...floor, 
            flats: floor.flats.map((flat, idx) => 
              idx === flatIndex ? { ...flat, [field]: value } : flat
            )
          }
        : floor
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Left Side - Step Bar */}
      <div className="w-full lg:w-[30%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          <h2 className="font-bold text-gray-800 break-words" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>Project Setup</h2>
          <p className="text-gray-600 break-words" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Follow the steps to create your project</p>
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

      {/* Right Side - Project Form */}
      <div className="w-full lg:w-[70%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
        <div className="flex-shrink-0" style={{ padding: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            {steps.find(s => s.active)?.title || 'Project Setup'}
          </h2>
        </div>
        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
          <div className="flex items-center justify-center min-h-full">
            <div className="w-full max-w-lg flex flex-col">
              {/* Project Form Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col" style={{ padding: 'clamp(2rem, 2.5rem, 3rem)' }}>
               {/* Step 1: Project Selection */}
               {currentStep === 1 && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                       Project
                     </h2>
                     <p className="text-gray-500 text-sm">
                       Select or create a project to continue
                     </p>
                   </div>

                   {/* Form Content */}
                   <div className="space-y-5">
                     {/* Select Existing Project */}
                 <div>
                   <label
                     className="block font-medium text-gray-700 mb-2 text-base"
                   >
                     Select an existing Project <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <button
                       type="button"
                       onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                       className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                     >
                       <span className={`${selectedProject ? 'text-gray-900' : 'text-gray-400'}`}>
                         {selectedProject ? (allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.name || selectedProject) : 'Select a Project'}
                       </span>
                       <HiChevronDown
                         className={`text-gray-400 transition-all ${
                           showProjectDropdown ? 'transform rotate-180 text-orange-500' : ''
                         }`}
                         style={{ fontSize: '1.25rem' }}
                       />
                     </button>

                    {/* Dropdown Menu */}
                    {showProjectDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {loading ? (
                         <div className="px-3 py-3 text-gray-500 text-center text-sm">
                             <div className="flex items-center justify-center gap-2">
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                               <span>Loading...</span>
                             </div>
                           </div>
                         ) : allProjects.length === 0 ? (
                           <div className="px-3 py-3 text-gray-500 text-center text-sm">No projects available</div>
                         ) : (
                           allProjects.map((project) => (
                             <button
                               key={project.id}
                               type="button"
                               onClick={() => handleProjectSelect(project)}
                               className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                             >
                               <div className="font-medium text-gray-900 mb-0.5">{project.name}</div>
                               <div className="text-sm text-gray-600">{project.location}</div>
                             </button>
                           ))
                         )}
                       </div>
                     )}
                   </div>
                 </div>

                 {/* OR Separator */}
                 <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-300"></div>
                   </div>
                   <div className="relative flex justify-center">
                     <span className="px-3 bg-white text-gray-500 font-medium uppercase text-sm">
                       OR
                     </span>
                   </div>
                 </div>

                 {/* Create New Project Button */}
                 <div className="flex justify-center">
                   <button
                     type="button"
                     onClick={handleCreateNewProject}
                     className="px-3 py-1.5 border border-dashed border-orange-400 bg-orange-50/30 rounded-md font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-1.5 text-sm"
                   >
                     <HiPlus style={{ fontSize: '1rem' }} />
                     <span>Create New Project</span>
                   </button>
                 </div>

                     {/* Navigation Buttons */}
                     <div className="pt-4 flex justify-end">
                       {/* Continue Button */}
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

               {/* Step 2: Project Type & Unit Type */}
               {currentStep === 2 && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                       Project Type & Unit Type
                     </h2>
                     <p className="text-gray-500 text-sm">
                       Choose your preferred Project type and Unit type
                     </p>
                   </div>

                   {/* Form Content */}
                   <div className="space-y-5">
                     {/* Project Structure Type */}
                     <div>
                       <label className="block font-medium text-gray-700 mb-2 text-base">
                         Project Structure Type <span className="text-red-500">*</span>
                       </label>
                       <div className="relative">
                         <button
                           type="button"
                           onClick={() => {
                             setShowStructureDropdown(!showStructureDropdown);
                             setShowUnitDropdown(false);
                           }}
                           className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                         >
                           <span className={projectStructureType ? 'text-gray-900' : 'text-gray-400'}>
                             {projectStructureType || 'Select Project Structure Type'}
                           </span>
                           <HiChevronDown
                             className={`text-gray-400 transition-all ${
                               showStructureDropdown ? 'transform rotate-180 text-orange-500' : ''
                             }`}
                             style={{ fontSize: '1.125rem' }}
                           />
                         </button>

                         {/* Dropdown Menu */}
                         {showStructureDropdown && (
                           <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                             {['Tower(High-rise with Blocks)', 'Block(Direct Unit Management)'].map((type) => (
                               <button
                                 key={type}
                                 type="button"
                                 onClick={() => handleStructureSelect(type)}
                                 className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                               >
                                 <div className="font-medium text-gray-900">{type}</div>
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Unit Type */}
                     <div>
                       <label className="block font-medium text-gray-700 mb-2 text-base">
                         Unit Type <span className="text-red-500">*</span>
                       </label>
                       <div className="relative">
                         <button
                           type="button"
                           onClick={() => {
                             if (projectStructureType) {
                               setShowUnitDropdown(!showUnitDropdown);
                               setShowStructureDropdown(false);
                             }
                           }}
                           disabled={!projectStructureType}
                           className={`w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all text-base ${
                             !projectStructureType
                               ? 'bg-gray-50 cursor-not-allowed border-gray-200'
                               : 'hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                           }`}
                         >
                           <span className={unitType ? 'text-gray-900' : 'text-gray-400'}>
                             {unitType || (!projectStructureType ? 'Select Project Structure first' : 'Select Unit Type')}
                           </span>
                           <HiChevronDown
                             className={`text-gray-400 transition-all ${
                               showUnitDropdown ? 'transform rotate-180 text-orange-500' : ''
                             }`}
                             style={{ fontSize: '1.125rem' }}
                           />
                         </button>

                         {/* Dropdown Menu */}
                         {showUnitDropdown && projectStructureType && (
                           <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                             {getAvailableUnitTypes().map((type) => (
                               <button
                                 key={type}
                                 type="button"
                                 onClick={() => handleUnitSelect(type)}
                                 className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                               >
                                 <div className="font-medium text-gray-900">{type}</div>
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Navigation Buttons */}
                     <div className="pt-4 flex justify-between items-center">
                       {/* Previous Button */}
                       <button
                         type="button"
                         onClick={handlePrevious}
                         className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                       >
                         Previous
                       </button>
                       
                       {/* Continue Button */}
                       <div className="ml-auto">
                         <button
                           type="button"
                           onClick={handleContinue}
                           disabled={!projectStructureType || !unitType}
                           className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                             projectStructureType && unitType
                               ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           }`}
                         >
                           Continue
                         </button>
                       </div>
                     </div>
                   </div>
                 </>
               )}

               {/* Step 3: Select or Create Block */}
               {currentStep === 3 && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                       Select or Create Block
                     </h2>
                     <p className="text-gray-500 text-sm">
                       Select an existing Block or Create New Block to continue
                     </p>
                   </div>

                   {/* Form Content */}
                   <div className="space-y-5">
                     {/* Select Existing Block */}
                     <div>
                       <label className="block font-medium text-gray-700 mb-2 text-base">
                         Select an existing Block <span className="text-red-500">*</span>
                       </label>
                       <div className="relative">
                         <button
                           type="button"
                           onClick={() => {
                             setShowBlockDropdown(!showBlockDropdown);
                           }}
                           className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                         >
                           <span className={selectedBlock ? 'text-gray-900' : 'text-gray-400'}>
                             {selectedBlock || 'Select a Block'}
                           </span>
                           <HiChevronDown
                             className={`text-gray-400 transition-all ${
                               showBlockDropdown ? 'transform rotate-180 text-orange-500' : ''
                             }`}
                             style={{ fontSize: '1.125rem' }}
                           />
                         </button>

                         {/* Dropdown Menu */}
                         {showBlockDropdown && (
                           <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                             {blocksLoading ? (
                               <div className="px-3 py-3 text-gray-500 text-center text-sm">
                                 <div className="flex items-center justify-center gap-2">
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                   <span>Loading...</span>
                                 </div>
                               </div>
                             ) : allBlocks.length === 0 ? (
                               <div className="px-3 py-3 text-gray-500 text-center text-sm">No blocks available</div>
                             ) : (
                               allBlocks.map((block) => (
                                 <button
                                   key={block.id}
                                   type="button"
                                   onClick={() => handleBlockSelect(block)}
                                   className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                                 >
                                   <div className="font-medium text-gray-900">{block.name}</div>
                                 </button>
                               ))
                             )}
                           </div>
                         )}
                       </div>
                     </div>

                     {/* OR Separator */}
                     <div className="relative">
                       <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-gray-300"></div>
                       </div>
                       <div className="relative flex justify-center">
                         <span className="px-3 bg-white text-gray-500 font-medium uppercase text-sm">
                           OR
                         </span>
                       </div>
                     </div>

                     {/* Create New Block Button */}
                     <div className="flex justify-center">
                       <button
                         type="button"
                         onClick={handleCreateNewBlock}
                         className="px-3 py-1.5 border border-dashed border-orange-400 bg-orange-50/30 rounded-md font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-1.5 text-sm"
                       >
                         <HiPlus style={{ fontSize: '1rem' }} />
                         <span>Create New Block</span>
                       </button>
                     </div>

                     {/* Navigation Buttons */}
                     <div className="pt-4 flex justify-between items-center">
                       {/* Previous Button */}
                       <button
                         type="button"
                         onClick={handlePrevious}
                         className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                       >
                         Previous
                       </button>
                       
                       {/* Continue Button */}
                       <div className="ml-auto">
                         <button
                           type="button"
                           onClick={handleContinue}
                           disabled={!selectedBlock}
                           className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                             selectedBlock
                               ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           }`}
                         >
                           Continue
                         </button>
                       </div>
                     </div>
                   </div>
                 </>
               )}

               {/* Step 4: Floors & Flats */}
               {currentStep === 4 && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                       Floors & Flats
                     </h2>
                     <p className="text-gray-500 text-sm">
                       Please provide Floor Number and Flat Details
                     </p>
                   </div>

                   {/* Form Content */}
                   <div className="space-y-6">
                     {/* Floors Grid */}
                     <div className="space-y-4">
                       {floors.map((floor, floorIndex) => (
                         <div
                           key={floor.id}
                           className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
                         >
                           {/* Floor Header */}
                           <div className="flex items-end justify-between mb-4 pb-3 border-b border-gray-300 gap-4">
                             <div className="flex items-end gap-4 flex-1">
                               {/* Floor Number */}
                               <div className="flex-shrink-0">
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                                   Floor Number <span className="text-red-500">*</span>
                                 </label>
                                 <input
                                   type="text"
                                   value={floor.floorNumber}
                                   onChange={(e) => handleFloorNumberChange(floor.id, e.target.value)}
                                   placeholder="Floor number"
                                   className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm h-[38px]"
                                 />
                               </div>
                               
                               {/* Template Selection */}
                               <div className="flex-1 relative">
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                                   Select Template <span className="text-gray-500 text-xs">(Optional)</span>
                                 </label>
                                 <button
                                   type="button"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setShowTemplateDropdown(prev => ({ ...prev, [floor.id]: !prev[floor.id] }));
                                   }}
                                   className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm h-[38px]"
                                 >
                                   <span className={`truncate ${floor.selectedTemplate ? 'text-gray-900' : 'text-gray-400'}`}>
                                     {floor.selectedTemplate || 'Select template'}
                                   </span>
                                   <HiChevronDown
                                     className={`text-gray-400 transition-all flex-shrink-0 ${
                                       showTemplateDropdown[floor.id] ? 'transform rotate-180 text-orange-500' : ''
                                     }`}
                                     style={{ fontSize: '0.875rem' }}
                                   />
                                 </button>

                                 {/* Template Dropdown */}
                                 {showTemplateDropdown[floor.id] && (
                                   <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                     {/* Clear Template Option - Only show when template is selected */}
                                     {floor.selectedTemplate && (
                                       <button
                                         type="button"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleClearTemplate(floor.id);
                                         }}
                                         className="w-full px-3 py-2.5 text-left hover:bg-gray-100 transition-colors border-b border-gray-200 text-sm first:rounded-t-lg"
                                       >
                                         <div className="font-medium text-gray-600">Clear Template</div>
                                         <div className="text-xs text-gray-400">
                                           Remove selected template
                                         </div>
                                       </button>
                                     )}
                                     {flatTemplates.map((template, idx) => (
                                       <button
                                         key={template.id || idx}
                                         type="button"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleTemplateSelect(floor.id, template);
                                         }}
                                         className={`w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm ${idx === 0 && !floor.selectedTemplate ? 'first:rounded-t-lg' : ''} last:rounded-b-lg`}
                                       >
                                         <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                                         <div className="text-xs text-gray-500">
                                           {template.flats.length} flats
                                         </div>
                                       </button>
                                     ))}
                                   </div>
                                 )}
                               </div>
                             </div>
                             
                             {floors.length > 1 && (
                               <button
                                 type="button"
                                 onClick={() => handleRemoveFloor(floor.id)}
                                 className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                 title="Remove Floor"
                               >
                                 <HiTrash className="w-5 h-5" />
                               </button>
                             )}
                           </div>

                           {/* Flats Grid */}
                           <div className="space-y-3">
                             <div className="flex items-center justify-between mb-2">
                               <label className="font-medium text-gray-700 text-sm">Flat Details</label>
                               <button
                                 type="button"
                                 onClick={() => handleAddFlat(floor.id)}
                                 className="px-3 py-1 text-xs font-medium text-orange-600 border border-orange-400 rounded-md hover:bg-orange-50 transition-colors flex items-center gap-1"
                               >
                                 <HiPlus className="w-3 h-3" />
                                 Add Flat
                               </button>
                             </div>

                             {floor.flats.length === 0 ? (
                               <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                                 <p className="text-gray-500 text-sm">No flats added yet. Click "Add Flat" to get started.</p>
                               </div>
                             ) : (
                               <div className="bg-white border border-gray-300 rounded-lg p-3 overflow-x-auto">
                                 <div className="space-y-3 min-w-max">
                                   {floor.flats.map((flat, flatIndex) => (
                                     <div
                                       key={flatIndex}
                                       className="flex items-center gap-3"
                                     >
                                       {/* Flat Number */}
                                       <div className="flex-shrink-0" style={{ width: '200px' }}>
                                         <input
                                           type="text"
                                           value={flat.flatNumber}
                                           onChange={(e) => handleFlatChange(floor.id, flatIndex, 'flatNumber', e.target.value)}
                                           placeholder="Flat Number (e.g., 101)"
                                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                         />
                                       </div>

                                       {/* Type */}
                                       <div className="flex-shrink-0" style={{ width: '150px' }}>
                                         <input
                                           type="text"
                                           value={flat.type}
                                           onChange={(e) => handleFlatChange(floor.id, flatIndex, 'type', e.target.value)}
                                           placeholder="Type (e.g., 2BHK)"
                                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                         />
                                       </div>

                                       {/* Area */}
                                       <div className="flex-shrink-0" style={{ width: '180px' }}>
                                         <input
                                           type="text"
                                           value={flat.area}
                                           onChange={(e) => handleFlatChange(floor.id, flatIndex, 'area', e.target.value)}
                                           placeholder="Area (sqft) (e.g., 1171)"
                                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                                         />
                                       </div>

                                       {/* Remove Button */}
                                       <button
                                         type="button"
                                         onClick={() => handleRemoveFlat(floor.id, flatIndex)}
                                         className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                         title="Remove Flat"
                                       >
                                         <HiX className="w-5 h-5" />
                                       </button>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Add Floor and Template Buttons */}
                     <div className="flex justify-center gap-4 pt-2 border-t border-gray-200">
                       <button
                         type="button"
                         onClick={handleAddFloor}
                         className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-dashed border-orange-400 bg-orange-50/30 rounded-md hover:bg-orange-50 hover:border-orange-500 transition-all flex items-center gap-2"
                       >
                         <HiPlus className="w-4 h-4" />
                         <span>Add Another Floor</span>
                       </button>
                       <button
                         type="button"
                         onClick={handleOpenAddTemplateForm}
                         className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-dashed border-orange-400 bg-orange-50/30 rounded-md hover:bg-orange-50 hover:border-orange-500 transition-all flex items-center gap-2"
                       >
                         <HiPlus className="w-4 h-4" />
                         <span>Add New Template</span>
                       </button>
                     </div>

                     {/* Navigation Buttons */}
                     <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                       {/* Previous Button */}
                       <button
                         type="button"
                         onClick={handlePrevious}
                         className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all text-base bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md"
                       >
                         Previous
                       </button>
                       
                       {/* Submit Button */}
                       <div className="ml-auto">
                         <button
                           type="button"
                           onClick={handleContinue}
                           className="px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                         >
                           Submit
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

      {/* Click outside to close dropdowns */}
      {(showProjectDropdown || showStructureDropdown || showUnitDropdown || showBlockDropdown || Object.keys(showTemplateDropdown).some(key => showTemplateDropdown[key])) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProjectDropdown(false);
            setShowStructureDropdown(false);
            setShowUnitDropdown(false);
            setShowBlockDropdown(false);
            setShowTemplateDropdown({});
          }}
        />
      )}

      {/* Create New Project Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Create New Project</h2>
              <button
                onClick={handleCloseCreateForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitNewProject} className="p-4 space-y-4">
              {/* Basic Info - Grid Layout */}
              <div className="grid grid-cols-1 gap-4">
                {/* Project Name */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProjectData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProjectData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter project location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newProjectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 text-sm mb-3">Images (Optional)</h3>
                
                {/* Project Logo */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-xs">
                    Project Logo
                  </label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('logo')}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-gray-50">
                      <HiPhotograph className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Upload Logo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('logo', e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Header & Footer Images - Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Header Image */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1.5 text-xs">
                      Header Image
                    </label>
                    {headerImagePreview ? (
                      <div className="relative">
                        <img
                          src={headerImagePreview}
                          alt="Header preview"
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('headerImage')}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-gray-50">
                        <HiPhotograph className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Header</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('headerImage', e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Footer Image */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1.5 text-xs">
                      Footer Image
                    </label>
                    {footerImagePreview ? (
                      <div className="relative">
                        <img
                          src={footerImagePreview}
                          alt="Footer preview"
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('footerImage')}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                        >
                          <HiX className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition-colors bg-gray-50">
                        <HiPhotograph className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Footer</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('footerImage', e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateForm}
                  className="px-4 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Block Form Modal */}
      {showCreateBlockForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Create New Block</h2>
              <button
                onClick={handleCloseCreateBlockForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitNewBlock} className="p-4 space-y-4">
              {/* Block Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Block Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="Enter block name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateBlockForm}
                  className="px-4 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Template Form Modal */}
      {showAddTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Create New Template</h2>
              <button
                onClick={handleCloseAddTemplateForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitNewTemplate} className="p-4 space-y-4">
              {/* Template Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  required
                />
              </div>

              {/* Flats Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium text-gray-700 text-sm">
                    Flat Details <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFlatToTemplate}
                    className="px-3 py-1 text-xs font-medium text-orange-600 border border-orange-400 rounded-md hover:bg-orange-50 transition-colors flex items-center gap-1"
                  >
                    <HiPlus className="w-3 h-3" />
                    Add Flat
                  </button>
                </div>

                <div className="space-y-3">
                  {newTemplateFlats.map((flat, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      {/* Flat Number */}
                      <div className="flex-shrink-0" style={{ width: '180px' }}>
                        <input
                          type="text"
                          value={flat.flatNumber}
                          onChange={(e) => handleFlatChangeInTemplate(index, 'flatNumber', e.target.value)}
                          placeholder="Flat Number (e.g., 101)"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        />
                      </div>

                      {/* Type */}
                      <div className="flex-shrink-0" style={{ width: '150px' }}>
                        <input
                          type="text"
                          value={flat.type}
                          onChange={(e) => handleFlatChangeInTemplate(index, 'type', e.target.value)}
                          placeholder="Type (e.g., 2BHK)"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        />
                      </div>

                      {/* Area */}
                      <div className="flex-shrink-0" style={{ width: '180px' }}>
                        <input
                          type="text"
                          value={flat.area}
                          onChange={(e) => handleFlatChangeInTemplate(index, 'area', e.target.value)}
                          placeholder="Area (sqft) (e.g., 1171)"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                        />
                      </div>

                      {/* Remove Button */}
                      {newTemplateFlats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFlatFromTemplate(index)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Remove Flat"
                        >
                          <HiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseAddTemplateForm}
                  className="px-4 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;

