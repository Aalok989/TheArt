import React, { useState, useEffect, useMemo } from 'react';
import { HiPlus, HiChevronDown, HiX, HiPhotograph, HiTrash } from 'react-icons/hi';

// Structure keys that require tower step (based on API response project_type === 'tower')
const TOWER_STRUCTURE_KEYS = ['tower_with_blocks', 'multiple_towers', 'tower_with_floors'];

const STEP_META = {
  project: {
    title: 'Select or Create Project',
    subtitle: 'Select an existing Project or Create New Project to continue.'
  },
  structure: {
    title: 'Project Structure Type',
    subtitle: 'Choose the structure type that best fits your project.'
  },
  tower: {
    title: 'Select or Create Tower',
    subtitle: 'Select an existing Tower or Create New Tower to continue.'
  },
  block: {
    title: 'Select or Create Block',
    subtitle: 'Select an existing Block or Create New Block to continue.'
  },
  floors: {
    title: 'Floors & Flats',
    subtitle: 'Please provide Floor Number and Flat Details.'
  }
};
import { propertiesAPI, buildersAPI } from '../../api/api';

const NewProject = ({ onPageChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    address: '',
    contactDetails: '',
    supportContactDetails: '',
    description: '',
    logo: null,
    headerImage: null,
    footerImage: null,
    assignedBuilderId: '',
    assignedBuilderName: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [footerImagePreview, setFooterImagePreview] = useState(null);
  const [projectStructureType, setProjectStructureType] = useState('');
  const [projectStructureData, setProjectStructureData] = useState(null); // Store full structure data
  const [structureOptions, setStructureOptions] = useState([]);
  const [structureOptionsLoading, setStructureOptionsLoading] = useState(false);
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);
  const [allTowers, setAllTowers] = useState([]);
  const [towersLoading, setTowersLoading] = useState(false);
  const [selectedTower, setSelectedTower] = useState('');
  const [selectedTowerId, setSelectedTowerId] = useState(null);
  const [showTowerDropdown, setShowTowerDropdown] = useState(false);
  const [showCreateTowerForm, setShowCreateTowerForm] = useState(false);
  const [newTowerData, setNewTowerData] = useState({
    name: '',
    number: '',
    description: ''
  });
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [allBlocks, setAllBlocks] = useState([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [showCreateBlockForm, setShowCreateBlockForm] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockDescription, setNewBlockDescription] = useState('');
  const [floors, setFloors] = useState([
    { id: 1, floorNumber: '', flats: [], selectedTemplate: '' }
  ]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState({});
  const [showAddTemplateForm, setShowAddTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateFlats, setNewTemplateFlats] = useState([{ flatNumber: '', type: '', area: '' }]);
  const [flatTemplates, setFlatTemplates] = useState([]);
  const [villas, setVillas] = useState([{ 
    id: 1, 
    villaNumber: '', 
    landArea: '', 
    buildUpArea: '', 
    bedrooms: '', 
    bathrooms: '', 
    villaType: '', 
    facing: '', 
    cornerUnit: false, 
    mainRoadFacing: false, 
    price: '' 
  }]);
  const [plots, setPlots] = useState([{ 
    id: 1, 
    plotNumber: '', 
    area: '', 
    plotType: '', 
    facing: '', 
    cornerUnit: false, 
    mainRoadFacing: false, 
    pricePerSqft: '', 
    totalPrice: '' 
  }]);
  const [customBuilders, setCustomBuilders] = useState([]);
  const [showCreateBuilderForm, setShowCreateBuilderForm] = useState(false);
  const [newBuilderData, setNewBuilderData] = useState({
    name: '',
    address: '',
    contactEmail: ''
  });
  const builderOptions = useMemo(() => {
    const builderMap = new Map();

    allProjects.forEach(project => {
      const id = project.builderId || project.builder;
      const name = project.builderName || project.builder || '';
      if (!name) return;
      const key = id ? `api-${id}` : `api-name-${name.toLowerCase()}`;
      if (!builderMap.has(key)) {
        builderMap.set(key, {
          key,
          id: id ? String(id) : '',
          name,
          source: 'api'
        });
      }
    });

    customBuilders.forEach(builder => {
      const key = builder.id ? `custom-${builder.id}` : `custom-name-${builder.name.toLowerCase()}`;
      if (!builderMap.has(key)) {
        builderMap.set(key, {
          key,
          id: builder.id ? String(builder.id) : '',
          name: builder.name,
          source: 'custom'
        });
      }
    });

    return Array.from(builderMap.values());
  }, [allProjects, customBuilders]);

  const selectedBuilderOptionKey = useMemo(() => {
    if (newProjectData.assignedBuilderId) {
      const option = builderOptions.find(
        opt => opt.id && opt.id === String(newProjectData.assignedBuilderId)
      );
      if (option) {
        return option.key;
      }
    }
    if (newProjectData.assignedBuilderName) {
      const option = builderOptions.find(opt => opt.name === newProjectData.assignedBuilderName);
      if (option) {
        return option.key;
      }
    }
    return '';
  }, [builderOptions, newProjectData.assignedBuilderId, newProjectData.assignedBuilderName]);

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

  // Fetch flat templates data when a project is selected
  useEffect(() => {
    const loadFlatTemplates = async () => {
      if (!selectedProject) {
        setFlatTemplates([]);
        return;
      }

      try {
        // Get project ID
        const projectId = typeof selectedProject === 'number' 
          ? selectedProject 
          : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
            ? parseInt(selectedProject) 
            : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);

        if (!projectId) {
          return;
        }

        const response = await propertiesAPI.getFlatTemplates(projectId);
        
        // Transform API response to match component expectations
        // API returns: [{ id, name, description, flat_items: [{ flat_number_pattern, flat_type, area_sqft }] }]
        // Component expects: [{ id, name, flats: [{ flatNumber, type, area }] }]
        const templates = Array.isArray(response) ? response : (response ? [response] : []);
        const formattedTemplates = templates.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          flats: (template.flat_items || []).map(item => ({
            flatNumber: item.flat_number_pattern || '',
            type: item.flat_type || '',
            area: item.area_sqft || ''
          }))
        }));

        setFlatTemplates(formattedTemplates);
      } catch (error) {
        console.error('Error loading flat templates:', error);
        setFlatTemplates([]);
      }
    };

    loadFlatTemplates();
  }, [selectedProject, allProjects]);

  const stepSequence = useMemo(() => {
    const base = ['project', 'structure'];
    // Check if selected structure requires tower step (project_type === 'tower')
    if (projectStructureData && projectStructureData.project_type === 'tower') {
      base.push('tower');
    }
    // Skip block step for "Tower with Flats" (id:4 or structure_key: "tower_with_floors")
    if (!projectStructureData || projectStructureData.id !== 4) {
      base.push('block');
    }
    base.push('floors');
    return base;
  }, [projectStructureData]);

  useEffect(() => {
    if (currentStep > stepSequence.length) {
      setCurrentStep(stepSequence.length);
    }
  }, [currentStep, stepSequence]);

  const currentStepId = stepSequence[currentStep - 1] || stepSequence[stepSequence.length - 1];

  useEffect(() => {
    // Reset tower selection if structure doesn't require towers
    if (projectStructureData && projectStructureData.project_type !== 'tower') {
      setSelectedTower('');
      setSelectedTowerId(null);
      setAllTowers([]);
    }
  }, [projectStructureData]);

  useEffect(() => {
    setSelectedTower('');
    setSelectedTowerId(null);
    setAllTowers([]);
    // Reset structure selection when project changes
    setProjectStructureType('');
    setProjectStructureData(null);
    setStructureOptions([]);
    // Reset block selection
    setSelectedBlock('');
    setSelectedBlockId(null);
  }, [selectedProject]);

  // Fetch structure options when project is selected
  useEffect(() => {
    if (selectedProject) {
      const loadStructureOptions = async () => {
        try {
          setStructureOptionsLoading(true);
          // Get project ID - selectedProject should be numeric ID from first step
          const projectId = typeof selectedProject === 'number' 
            ? selectedProject 
            : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
              ? parseInt(selectedProject) 
              : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);
          
          if (projectId) {
            const response = await propertiesAPI.getStructureOptions(projectId);
            if (Array.isArray(response)) {
              setStructureOptions(response);
            }
          }
          setStructureOptionsLoading(false);
        } catch (error) {
          console.error('Error loading structure options:', error);
          setStructureOptionsLoading(false);
        }
      };
      loadStructureOptions();
    }
  }, [selectedProject, allProjects]);

  const steps = useMemo(
    () =>
      stepSequence.map((id, index) => {
        let title = STEP_META[id].title;
        let subtitle = STEP_META[id].subtitle;
        
        // Update title and subtitle for floors step based on unit_type
        if (id === 'floors' && projectStructureData) {
          if (projectStructureData.unit_type === 'villas') {
            title = 'Villas';
            subtitle = 'Please provide Villa Details';
          } else if (projectStructureData.unit_type === 'plots') {
            title = 'Plots';
            subtitle = 'Please provide Plot Details';
          }
        }
        
        return {
        id,
        number: index + 1,
          title,
          subtitle,
        completed: currentStep > index + 1,
        active: currentStep === index + 1
        };
      }),
    [stepSequence, currentStep, projectStructureData]
  );

  const handleProjectSelect = (project) => {
    // Always store the project ID (numeric) for API calls
    setSelectedProject(project.id);
    setShowProjectDropdown(false);
  };

  const handleCreateNewProject = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setNewProjectData({
      name: '',
      address: '',
      contactDetails: '',
      supportContactDetails: '',
      description: '',
      logo: null,
      headerImage: null,
      footerImage: null,
      assignedBuilderId: '',
      assignedBuilderName: ''
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

  const handleBuilderSelect = (optionKey) => {
    const option = builderOptions.find(opt => opt.key === optionKey);
    if (!option) {
      setNewProjectData(prev => ({
        ...prev,
        assignedBuilderId: '',
        assignedBuilderName: ''
      }));
      return;
    }

    if (option.source === 'api' && option.id) {
      setNewProjectData(prev => ({
        ...prev,
        assignedBuilderId: option.id,
        assignedBuilderName: option.name
      }));
    } else {
      setNewProjectData(prev => ({
        ...prev,
        assignedBuilderId: '',
        assignedBuilderName: option.name
      }));
    }
  };

  const handleOpenCreateBuilderForm = () => {
    setShowCreateBuilderForm(true);
    setNewBuilderData({
      name: '',
      address: '',
      contactEmail: ''
    });
  };

  const handleCloseCreateBuilderForm = () => {
    setShowCreateBuilderForm(false);
    setNewBuilderData({
      name: '',
      address: '',
      contactEmail: ''
    });
  };

  const handleNewBuilderChange = (field, value) => {
    setNewBuilderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewBuilder = async (e) => {
    e.preventDefault();
    const trimmedName = newBuilderData.name.trim();
    if (!trimmedName) {
      return;
    }

    try {
      // Call the real API to create the builder
      const response = await buildersAPI.createBuilder({
        name: trimmedName,
        address: newBuilderData.address.trim(),
        contactEmail: newBuilderData.contactEmail.trim()
      });

      // Update the project data with the newly created builder
      if (response && response.id) {
        setNewProjectData(prev => ({
          ...prev,
          assignedBuilderId: String(response.id),
          assignedBuilderName: response.name || trimmedName
        }));
      } else {
        // Fallback if response doesn't have id
        setNewProjectData(prev => ({
          ...prev,
          assignedBuilderId: '',
          assignedBuilderName: trimmedName
        }));
      }

      // Also add to custom builders list for local state
    setCustomBuilders(prev => {
      const exists =
        prev.some(builder => builder.name.toLowerCase() === trimmedName.toLowerCase()) ||
        allProjects.some(project => (project.builderName || project.builder || '').toLowerCase() === trimmedName.toLowerCase());

      if (exists) {
        return prev;
      }

      const newBuilder = {
          id: response?.id ? String(response.id) : `custom-${Date.now()}`,
          name: response?.name || trimmedName,
          address: response?.address || newBuilderData.address.trim(),
          contactEmail: response?.contact_email || response?.contactEmail || newBuilderData.contactEmail.trim()
      };

      return [
        ...prev,
        newBuilder
      ];
    });

      alert('Builder created successfully!');
    handleCloseCreateBuilderForm();
    } catch (error) {
      console.error('Error creating builder:', error);
      alert(`Failed to create builder: ${error.message || 'Unknown error'}`);
    }
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
        // Structure options will be fetched automatically via useEffect when selectedProject changes
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

  const handleContinue = async () => {
    const activeStepId = currentStepId;
    if (activeStepId === 'project' && !selectedProject) {
      return;
    }
    if (activeStepId === 'structure' && !projectStructureType) {
      return;
    }
    if (activeStepId === 'tower' && !selectedTower) {
      return;
    }
    if (activeStepId === 'block' && !selectedBlock) {
      return;
    }

    if (currentStep < stepSequence.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - submit creation hub data (for tower with blocks structure)
      await handleSubmitCreationHub();
    }
  };

  const handleSubmitCreationHub = async () => {
    if (!projectStructureData || !projectStructureData.id) {
      alert('Please select a structure type first');
      return;
    }

    try {
      // Get project ID
      const projectId = typeof selectedProject === 'number' 
        ? selectedProject 
        : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
          ? parseInt(selectedProject) 
          : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);

      if (!projectId) {
        alert('Please select a project first');
        return;
      }

      // Prepare base creation hub data
      const creationData = {
        project_id: projectId,
        structure_id: projectStructureData.id
      };

      // Handle different unit types
      if (projectStructureData.unit_type === 'flats') {
        // Flats require tower/block based on structure type
        // Only require tower_id if structure requires tower step (project_type === 'tower')
        if (projectStructureData.project_type === 'tower' && !selectedTowerId) {
          alert('Please select a tower first');
          return;
        }

        // Only require block_id if structure requires block step (id !== 4, Tower with Flats skips block)
        if (projectStructureData.id !== 4 && !selectedBlockId) {
          alert('Please select a block first');
          return;
        }

        // Format floors data according to API format
        const formattedFloors = floors
          .filter(floor => floor.floorNumber && floor.floorNumber.trim() !== '')
          .map(floor => {
            const floorNumber = parseInt(floor.floorNumber.trim());
            if (isNaN(floorNumber)) {
              return null;
            }

            // Format flats data
            const formattedFlats = floor.flats
              .filter(flat => flat.flatNumber && flat.flatNumber.trim() !== '')
              .map(flat => {
                const areaSqft = parseInt(flat.area.trim()) || 0;
                return {
                  flat_number: flat.flatNumber.trim(),
                  flat_type: flat.type.trim() || '',
                  area_sqft: areaSqft
                };
              });

            return {
              floor_number: floorNumber,
              flats: formattedFlats
            };
          })
          .filter(floor => floor !== null && floor.flats.length > 0);

        if (formattedFloors.length === 0) {
          alert('Please add at least one floor with flats');
          return;
        }

        creationData.floors = formattedFloors;

        // Only include tower_id if structure requires tower step (project_type === 'tower')
        if (projectStructureData.project_type === 'tower' && selectedTowerId) {
          creationData.tower_id = selectedTowerId;
        }

        // Only include block_id if structure requires block step (id !== 4, Tower with Flats skips block)
        if (projectStructureData.id !== 4 && selectedBlockId) {
          creationData.block_id = selectedBlockId;
        }
      } else if (projectStructureData.unit_type === 'villas') {
        // Villas require block_id
        if (!selectedBlockId) {
          alert('Please select a block first');
          return;
        }

        // Format villas data according to API format
        const formattedVillas = villas
          .filter(villa => villa.villaNumber && villa.villaNumber.trim() !== '')
          .map(villa => ({
            villa_number: villa.villaNumber.trim(),
            land_area_sqft: parseInt(villa.landArea.trim()) || 0,
            builtup_area_sqft: parseInt(villa.buildUpArea.trim()) || 0,
            bedrooms: parseInt(villa.bedrooms.trim()) || 0,
            bathrooms: parseInt(villa.bathrooms.trim()) || 0,
            villa_type: villa.villaType.trim() || '',
            facing: villa.facing.trim() || '',
            corner_unit: villa.cornerUnit || false,
            main_road_facing: villa.mainRoadFacing || false,
            price: parseInt(villa.price.trim()) || 0
          }))
          .filter(villa => villa.villa_number !== '');

        if (formattedVillas.length === 0) {
          alert('Please add at least one villa');
          return;
        }

        creationData.villas = formattedVillas;
        creationData.block_id = selectedBlockId;
      } else if (projectStructureData.unit_type === 'plots') {
        // Plots require block_id (similar structure to villas)
        if (!selectedBlockId) {
          alert('Please select a block first');
          return;
        }

        // Format plots data according to API format
        const formattedPlots = plots
          .filter(plot => plot.plotNumber && plot.plotNumber.trim() !== '')
          .map(plot => ({
            plot_number: plot.plotNumber.trim(),
            area_sqft: parseInt(plot.area.trim()) || 0,
            plot_type: plot.plotType.trim() || '',
            facing: plot.facing.trim() || '',
            corner_plot: plot.cornerUnit || false,
            main_road_facing: plot.mainRoadFacing || false,
            price_per_sqft: parseInt(plot.pricePerSqft.trim()) || 0,
            total_price: parseInt(plot.totalPrice.trim()) || 0
          }))
          .filter(plot => plot.plot_number !== '');

        if (formattedPlots.length === 0) {
          alert('Please add at least one plot');
          return;
        }

        creationData.plots = formattedPlots;
        creationData.block_id = selectedBlockId;
      }

      // Call the API
      await propertiesAPI.submitCreationHub(creationData);

      alert('Project setup completed successfully!');
      // Optionally reset form or navigate
    } catch (error) {
      console.error('Error submitting creation hub:', error);
      alert(`Failed to submit: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStructureSelect = (structure) => {
    // structure is now the full structure object from API
    setProjectStructureType(structure.structure_type);
    setProjectStructureData(structure);
    setShowStructureDropdown(false);
    setSelectedTower('');
    setSelectedTowerId(null);
    setAllTowers([]);
    setSelectedBlock('');
    setSelectedBlockId(null);
    setAllBlocks([]);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    // Allow clicking on completed steps or current step to navigate
    if (stepNumber <= currentStep && stepNumber <= stepSequence.length) {
      setCurrentStep(stepNumber);
    }
  };

  // Fetch towers when the tower step is active
  useEffect(() => {
    if (currentStepId === 'tower' && selectedProject) {
      const loadTowers = async () => {
        try {
          setTowersLoading(true);
          // Get project ID - selectedProject should be numeric ID from first step
          const projectId = typeof selectedProject === 'number' 
            ? selectedProject 
            : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
              ? parseInt(selectedProject) 
              : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);
          
          if (projectId) {
            const response = await propertiesAPI.getTowers(projectId);
            if (Array.isArray(response)) {
              setAllTowers(response);
            } else if (response && Array.isArray(response.data)) {
            setAllTowers(response.data);
            } else {
              setAllTowers([]);
            }
          }
          setTowersLoading(false);
        } catch (error) {
          console.error('Error loading towers:', error);
          setTowersLoading(false);
        }
      };
      loadTowers();
    }
  }, [currentStepId, selectedProject, allProjects]);

  const handleTowerSelect = (tower) => {
    const towerName = typeof tower === 'string' ? tower : tower.name;
    const towerId = typeof tower === 'object' && tower.id ? tower.id : null;
    setSelectedTower(towerName);
    setSelectedTowerId(towerId);
    setShowTowerDropdown(false);
  };

  const handleCreateNewTower = () => {
    setShowCreateTowerForm(true);
  };

  const handleCloseCreateTowerForm = () => {
    setShowCreateTowerForm(false);
    setNewTowerData({
      name: '',
      number: '',
      description: ''
    });
  };

  const handleNewTowerChange = (field, value) => {
    setNewTowerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewTower = async (e) => {
    e.preventDefault();
    if (!newTowerData.name.trim()) {
      return;
    }

    try {
      // Get project ID
      const projectId = typeof selectedProject === 'number' 
        ? selectedProject 
        : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
          ? parseInt(selectedProject) 
          : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);

      if (!projectId) {
        alert('Please select a project first');
        return;
      }

      // Prepare tower data
      const towerData = {
        project: projectId,
        name: newTowerData.name.trim(),
        description: newTowerData.description.trim()
      };

      // Include tower_number if provided
      if (newTowerData.number && newTowerData.number.trim() !== '') {
        const towerNumber = parseInt(newTowerData.number.trim());
        if (!isNaN(towerNumber)) {
          towerData.tower_number = towerNumber;
        }
      }

      // Call the API to create the tower
      const response = await propertiesAPI.createTower(towerData);

      // Refresh the towers list
      const towersResponse = await propertiesAPI.getTowers(projectId);
      if (Array.isArray(towersResponse)) {
        setAllTowers(towersResponse);
      } else if (towersResponse && Array.isArray(towersResponse.data)) {
        setAllTowers(towersResponse.data);
      }

      // Select the newly created tower
      if (response && response.id) {
        setSelectedTower(response.name || newTowerData.name.trim());
        setSelectedTowerId(response.id);
      } else {
        setSelectedTower(newTowerData.name.trim());
        setSelectedTowerId(null);
      }

      alert('Tower created successfully!');
      handleCloseCreateTowerForm();
    } catch (error) {
      console.error('Error creating tower:', error);
      alert(`Failed to create tower: ${error.message || 'Unknown error'}`);
    }
  };

  // Fetch blocks when the block step is active
  useEffect(() => {
    if (currentStepId === 'block' && selectedProject) {
      const loadBlocks = async () => {
        try {
          setBlocksLoading(true);
          // Get project ID - selectedProject should be numeric ID from first step
          const projectId = typeof selectedProject === 'number' 
            ? selectedProject 
            : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
              ? parseInt(selectedProject) 
              : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);
          
          if (projectId) {
            // Get tower ID if tower is required and selected
            let towerId = null;
            if (projectStructureData && projectStructureData.project_type === 'tower' && selectedTowerId) {
              towerId = selectedTowerId;
            }
            
            const response = await propertiesAPI.getBlocks(projectId, towerId);
            if (Array.isArray(response)) {
              setAllBlocks(response);
            } else if (response && Array.isArray(response.data)) {
            setAllBlocks(response.data);
            } else {
              setAllBlocks([]);
            }
          }
          setBlocksLoading(false);
        } catch (error) {
          console.error('Error loading blocks:', error);
          setBlocksLoading(false);
        }
      };
      loadBlocks();
    }
  }, [currentStepId, selectedProject, allProjects, projectStructureData, selectedTowerId]);

  const handleBlockSelect = (block) => {
    setSelectedBlock(block.name);
    setSelectedBlockId(block.id || null);
    setShowBlockDropdown(false);
  };

  const handleCreateNewBlock = () => {
    setShowCreateBlockForm(true);
  };

  const handleCloseCreateBlockForm = () => {
    setShowCreateBlockForm(false);
    setNewBlockName('');
    setNewBlockDescription('');
  };

  const handleSubmitNewBlock = async (e) => {
    e.preventDefault();
    if (!newBlockName.trim()) {
      return;
    }

    try {
      // Get project ID - selectedProject should be numeric ID from first step
      const projectId = typeof selectedProject === 'number' 
        ? selectedProject 
        : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
          ? parseInt(selectedProject) 
          : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);

      if (!projectId) {
        alert('Please select a project first');
        return;
      }

      // Prepare block data
      const blockData = {
        project: projectId,
        name: newBlockName.trim(),
        description: newBlockDescription.trim()
      };

      // Only include tower field if structure requires tower step (project_type === 'tower')
      if (projectStructureData && projectStructureData.project_type === 'tower') {
        if (!selectedTowerId) {
          alert('Please select a tower first');
          return;
        }
        blockData.tower = selectedTowerId;
      }

      // Call the API to create the block
      const response = await propertiesAPI.createBlock(blockData);

      // Refresh the blocks list
      let towerId = null;
      if (projectStructureData && projectStructureData.project_type === 'tower' && selectedTowerId) {
        towerId = selectedTowerId;
      }
      
      const blocksResponse = await propertiesAPI.getBlocks(projectId, towerId);
      if (Array.isArray(blocksResponse)) {
        setAllBlocks(blocksResponse);
      } else if (blocksResponse && Array.isArray(blocksResponse.data)) {
        setAllBlocks(blocksResponse.data);
      }

      // Select the newly created block
      if (response && response.id) {
        setSelectedBlock(response.name || newBlockName.trim());
        setSelectedBlockId(response.id);
      } else {
        setSelectedBlock(newBlockName.trim());
        setSelectedBlockId(null);
      }

      alert('Block created successfully!');
      handleCloseCreateBlockForm();
    } catch (error) {
      console.error('Error creating block:', error);
      alert(`Failed to create block: ${error.message || 'Unknown error'}`);
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
    setNewTemplateDescription('');
    setNewTemplateFlats([{ flatNumber: '', type: '', area: '' }]);
  };

  const handleCloseAddTemplateForm = () => {
    setShowAddTemplateForm(false);
    setNewTemplateName('');
    setNewTemplateDescription('');
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

  const handleSubmitNewTemplate = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }

    if (!newTemplateName.trim() || newTemplateFlats.length === 0) {
      alert('Please provide template name and at least one flat');
      return;
    }

    try {
      // Get project ID
      const projectId = typeof selectedProject === 'number' 
        ? selectedProject 
        : (typeof selectedProject === 'string' && !isNaN(selectedProject) 
          ? parseInt(selectedProject) 
          : allProjects.find(p => p.id === selectedProject || p.name === selectedProject)?.id);

      if (!projectId) {
        alert('Please select a project first');
        return;
      }

      // Filter out empty flats
      const validFlats = newTemplateFlats.filter(flat => 
        flat.flatNumber && flat.flatNumber.trim() !== '' && 
        flat.type && flat.type.trim() !== ''
      );

      if (validFlats.length === 0) {
        alert('Please provide at least one valid flat with flat number and type');
        return;
      }

      // Format flat_items according to API format
      const flatItems = validFlats.map(flat => ({
        flat_number_pattern: flat.flatNumber.trim(),
        flat_type: flat.type.trim(),
        area_sqft: parseInt(flat.area.trim()) || 0
      }));

      // Call the API to create template
      await propertiesAPI.createFlatTemplate({
        name: newTemplateName.trim(),
        description: newTemplateDescription.trim() || '',
        project_id: projectId,
        is_active: true,
        flat_items: flatItems
      });

      // Refetch templates to get the updated list
      const response = await propertiesAPI.getFlatTemplates(projectId);
      const templates = Array.isArray(response) ? response : (response ? [response] : []);
      const formattedTemplates = templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        flats: (template.flat_items || []).map(item => ({
          flatNumber: item.flat_number_pattern || '',
          type: item.flat_type || '',
          area: item.area_sqft || ''
        }))
      }));
      setFlatTemplates(formattedTemplates);

      handleCloseAddTemplateForm();
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert(`Failed to create template: ${error.message || 'Unknown error'}`);
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

  // Villa handlers
  const handleAddVilla = () => {
    const newVilla = {
      id: Date.now(),
      villaNumber: '',
      landArea: '',
      buildUpArea: '',
      bedrooms: '',
      bathrooms: '',
      villaType: '',
      facing: '',
      cornerUnit: false,
      mainRoadFacing: false,
      price: ''
    };
    setVillas([...villas, newVilla]);
  };

  const handleRemoveVilla = (villaId) => {
    if (villas.length > 1) {
      setVillas(villas.filter(villa => villa.id !== villaId));
    }
  };

  const handleVillaChange = (villaId, field, value) => {
    setVillas(villas.map(villa => 
      villa.id === villaId ? { ...villa, [field]: value } : villa
    ));
  };

  // Plot handlers
  const handleAddPlot = () => {
    const newPlot = {
      id: Date.now(),
      plotNumber: '',
      area: '',
      plotType: '',
      facing: '',
      cornerUnit: false,
      mainRoadFacing: false,
      pricePerSqft: '',
      totalPrice: ''
    };
    setPlots([...plots, newPlot]);
  };

  const handleRemovePlot = (plotId) => {
    if (plots.length > 1) {
      setPlots(plots.filter(plot => plot.id !== plotId));
    }
  };

  const handlePlotChange = (plotId, field, value) => {
    setPlots(plots.map(plot => 
      plot.id === plotId ? { ...plot, [field]: value } : plot
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
               {currentStepId === 'project' && (
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
                              <div className="text-sm text-gray-600">
                                {project.builderName || project.builder || 'Builder not available'}
                              </div>
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

              {/* Step 2: Project Structure Type */}
              {currentStepId === 'structure' && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                      Project Structure Type
                     </h2>
                     <p className="text-gray-500 text-sm">
                      Choose the structure type that best fits your project
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
                             {structureOptionsLoading ? (
                               <div className="px-3 py-3 text-gray-500 text-center text-sm">
                                 <div className="flex items-center justify-center gap-2">
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                   <span>Loading...</span>
                                 </div>
                               </div>
                             ) : structureOptions.length === 0 ? (
                               <div className="px-3 py-3 text-gray-500 text-center text-sm">No structure options available</div>
                             ) : (
                               structureOptions.filter(structure => structure.id !== 3).map((structure) => (
                               <button
                                   key={structure.id}
                                 type="button"
                                   onClick={() => handleStructureSelect(structure)}
                                 className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                               >
                                   <div className="font-medium text-gray-900">{structure.structure_type}</div>
                               </button>
                               ))
                             )}
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
                           disabled={!projectStructureType}
                           className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                             projectStructureType
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

              {/* Step (Conditional): Select or Create Tower */}
              {currentStepId === 'tower' && (
                <>
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2
                      className="font-bold text-gray-900 mb-1"
                      style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                    >
                      Select or Create Tower
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Select an existing Tower or Create New Tower to continue
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2 text-base">
                        Select an existing Tower <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setShowTowerDropdown(!showTowerDropdown);
                          }}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between transition-all hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                        >
                          <span className={selectedTower ? 'text-gray-900' : 'text-gray-400'}>
                            {selectedTower || 'Select a Tower'}
                          </span>
                          <HiChevronDown
                            className={`text-gray-400 transition-all ${
                              showTowerDropdown ? 'transform rotate-180 text-orange-500' : ''
                            }`}
                            style={{ fontSize: '1.125rem' }}
                          />
                        </button>

                        {showTowerDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {towersLoading ? (
                              <div className="px-3 py-3 text-gray-500 text-center text-sm">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                  <span>Loading...</span>
                                </div>
                              </div>
                            ) : allTowers.length === 0 ? (
                              <div className="px-3 py-3 text-gray-500 text-center text-sm">
                                No towers available
                              </div>
                            ) : (
                              allTowers.map((tower) => {
                                const towerName = tower.name || tower;
                                const towerNumber = tower.number || '';
                                const towerDescription = tower.description || '';
                                return (
                                  <button
                                    key={tower.id || towerName}
                                    type="button"
                                    onClick={() => handleTowerSelect(tower)}
                                    className="w-full px-3 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg text-base"
                                  >
                                    <div className="font-medium text-gray-900">
                                      {towerName}
                                      {towerNumber ? ` (${towerNumber})` : ''}
                                    </div>
                                    {towerDescription && (
                                      <div className="text-gray-500 text-sm mt-0.5">
                                        {towerDescription}
                                      </div>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>

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

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleCreateNewTower}
                        className="px-3 py-1.5 border border-dashed border-orange-400 bg-orange-50/30 rounded-md font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-1.5 text-sm"
                      >
                        <HiPlus style={{ fontSize: '1rem' }} />
                        <span>Create New Tower</span>
                      </button>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
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
                          disabled={!selectedTower}
                          className={`px-4 py-1.5 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all text-base ${
                            selectedTower
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

              {/* Step: Select or Create Block */}
              {currentStepId === 'block' && (
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

              {/* Step: Floors & Flats / Villas / Plots */}
              {currentStepId === 'floors' && (
                 <>
                   {/* Header Section */}
                   <div className="mb-6 pb-4 border-b border-gray-200">
                     <h2
                       className="font-bold text-gray-900 mb-1"
                       style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}
                     >
                       {projectStructureData?.unit_type === 'villas' ? 'Villas' : 
                        projectStructureData?.unit_type === 'plots' ? 'Plots' : 
                        'Floors & Flats'}
                     </h2>
                     <p className="text-gray-500 text-sm">
                       {projectStructureData?.unit_type === 'villas' ? 'Please provide Villa Details' : 
                        projectStructureData?.unit_type === 'plots' ? 'Please provide Plot Details' : 
                        'Please provide Floor Number and Flat Details'}
                     </p>
                   </div>

                   {/* Form Content - Conditional based on unit_type */}
                   <div className="space-y-6">
                   {projectStructureData?.unit_type === 'villas' ? (
                     /* Villas Form */
                     <div className="space-y-6">
                       <div className="space-y-4">
                         {villas.map((villa, index) => (
                           <div key={villa.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                             <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                               <h3 className="font-semibold text-gray-800">Villa {index + 1}</h3>
                               {villas.length > 1 && (
                                 <button
                                   type="button"
                                   onClick={() => handleRemoveVilla(villa.id)}
                                   className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                 >
                                   <HiTrash className="w-5 h-5" />
                                 </button>
                               )}
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Villa Number <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.villaNumber} onChange={(e) => handleVillaChange(villa.id, 'villaNumber', e.target.value)} placeholder="Villa Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Land Area (sqft) <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.landArea} onChange={(e) => handleVillaChange(villa.id, 'landArea', e.target.value)} placeholder="Land area" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Build-up Area (sqft) <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.buildUpArea} onChange={(e) => handleVillaChange(villa.id, 'buildUpArea', e.target.value)} placeholder="Build-up area" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Bedrooms <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.bedrooms} onChange={(e) => handleVillaChange(villa.id, 'bedrooms', e.target.value)} placeholder="Bedrooms" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Bathrooms <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.bathrooms} onChange={(e) => handleVillaChange(villa.id, 'bathrooms', e.target.value)} placeholder="Bathrooms" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Villa Type <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.villaType} onChange={(e) => handleVillaChange(villa.id, 'villaType', e.target.value)} placeholder="Villa Type" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Facing <span className="text-red-500">*</span></label>
                                 <select value={villa.facing} onChange={(e) => handleVillaChange(villa.id, 'facing', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                                   <option value="">Select Facing</option>
                                   <option value="north">North</option>
                                   <option value="south">South</option>
                                   <option value="east">East</option>
                                   <option value="west">West</option>
                                   <option value="north-east">North-East</option>
                                   <option value="north-west">North-West</option>
                                   <option value="south-east">South-East</option>
                                   <option value="south-west">South-West</option>
                                 </select>
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Price <span className="text-red-500">*</span></label>
                                 <input type="text" value={villa.price} onChange={(e) => handleVillaChange(villa.id, 'price', e.target.value)} placeholder="Price" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div className="col-span-2">
                                 <label className="block font-medium text-gray-700 mb-2 text-sm">Options</label>
                                 <div className="flex gap-6">
                                   <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" name={`corner-${villa.id}`} checked={villa.cornerUnit} onChange={() => handleVillaChange(villa.id, 'cornerUnit', true)} className="w-4 h-4 text-orange-500" />
                                     <span className="text-sm text-gray-700">Corner Unit</span>
                                   </label>
                                   <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" name={`corner-${villa.id}`} checked={!villa.cornerUnit && villa.mainRoadFacing} onChange={() => { handleVillaChange(villa.id, 'cornerUnit', false); handleVillaChange(villa.id, 'mainRoadFacing', true); }} className="w-4 h-4 text-orange-500" />
                                     <span className="text-sm text-gray-700">Main Road Facing</span>
                                   </label>
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="flex justify-center pt-2 border-t border-gray-200">
                         <button type="button" onClick={handleAddVilla} className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-dashed border-orange-400 bg-orange-50/30 rounded-md hover:bg-orange-50 transition-all flex items-center gap-2">
                           <HiPlus className="w-4 h-4" />
                           <span>Add Another Villa</span>
                         </button>
                       </div>
                     </div>
                   ) : projectStructureData?.unit_type === 'plots' ? (
                     /* Plots Form */
                     <div className="space-y-6">
                       <div className="space-y-4">
                         {plots.map((plot, index) => (
                           <div key={plot.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                             <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                               <h3 className="font-semibold text-gray-800">Plot {index + 1}</h3>
                               {plots.length > 1 && (
                                 <button type="button" onClick={() => handleRemovePlot(plot.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                   <HiTrash className="w-5 h-5" />
                                 </button>
                               )}
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Plot Number <span className="text-red-500">*</span></label>
                                 <input type="text" value={plot.plotNumber} onChange={(e) => handlePlotChange(plot.id, 'plotNumber', e.target.value)} placeholder="Plot Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Area (sqft) <span className="text-red-500">*</span></label>
                                 <input type="text" value={plot.area} onChange={(e) => handlePlotChange(plot.id, 'area', e.target.value)} placeholder="Area" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Plot Type <span className="text-red-500">*</span></label>
                                 <select value={plot.plotType} onChange={(e) => handlePlotChange(plot.id, 'plotType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                                   <option value="">Select Plot Type</option>
                                   <option value="residential">Residential</option>
                                   <option value="commercial">Commercial</option>
                                   <option value="industrial">Industrial</option>
                                   <option value="mixed_use">Mixed Use</option>
                                 </select>
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Facing <span className="text-red-500">*</span></label>
                                 <select value={plot.facing} onChange={(e) => handlePlotChange(plot.id, 'facing', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                                   <option value="">Select Facing</option>
                                   <option value="north">North</option>
                                   <option value="south">South</option>
                                   <option value="east">East</option>
                                   <option value="west">West</option>
                                   <option value="north-east">North-East</option>
                                   <option value="north-west">North-West</option>
                                   <option value="south-east">South-East</option>
                                   <option value="south-west">South-West</option>
                                 </select>
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Price per sqft <span className="text-red-500">*</span></label>
                                 <input type="text" value={plot.pricePerSqft} onChange={(e) => handlePlotChange(plot.id, 'pricePerSqft', e.target.value)} placeholder="Price per sqft" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div>
                                 <label className="block font-medium text-gray-700 mb-1.5 text-sm">Total Price <span className="text-red-500">*</span></label>
                                 <input type="text" value={plot.totalPrice} onChange={(e) => handlePlotChange(plot.id, 'totalPrice', e.target.value)} placeholder="Total Price" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                               </div>
                               <div className="col-span-2">
                                 <label className="block font-medium text-gray-700 mb-2 text-sm">Options</label>
                                 <div className="flex gap-6">
                                   <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" name={`corner-${plot.id}`} checked={plot.cornerUnit} onChange={() => handlePlotChange(plot.id, 'cornerUnit', true)} className="w-4 h-4 text-orange-500" />
                                     <span className="text-sm text-gray-700">Corner Unit</span>
                                   </label>
                                   <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" name={`corner-${plot.id}`} checked={!plot.cornerUnit && plot.mainRoadFacing} onChange={() => { handlePlotChange(plot.id, 'cornerUnit', false); handlePlotChange(plot.id, 'mainRoadFacing', true); }} className="w-4 h-4 text-orange-500" />
                                     <span className="text-sm text-gray-700">Main Road Facing</span>
                                   </label>
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="flex justify-center pt-2 border-t border-gray-200">
                         <button type="button" onClick={handleAddPlot} className="px-4 py-2 text-sm font-medium text-orange-600 border-2 border-dashed border-orange-400 bg-orange-50/30 rounded-md hover:bg-orange-50 transition-all flex items-center gap-2">
                           <HiPlus className="w-4 h-4" />
                           <span>Add Another Plot</span>
                         </button>
                       </div>
                     </div>
                   ) : (
                     /* Floors & Flats Form (default) */
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
                   </div>
                   )}

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
      {(showProjectDropdown || showStructureDropdown || showTowerDropdown || showBlockDropdown || Object.keys(showTemplateDropdown).some(key => showTemplateDropdown[key])) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProjectDropdown(false);
            setShowStructureDropdown(false);
            setShowTowerDropdown(false);
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

                {/* Address */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newProjectData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter project address"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                    required
                  />
                </div>

                {/* Contact Details */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Contact Details <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProjectData.contactDetails}
                    onChange={(e) => handleInputChange('contactDetails', e.target.value)}
                    placeholder="Enter primary contact details (e.g., name, phone, email)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    required
                  />
                </div>

                {/* Support Contact Details */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Support Contact Details <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newProjectData.supportContactDetails}
                    onChange={(e) => handleInputChange('supportContactDetails', e.target.value)}
                    placeholder="Enter support contact details"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
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

              {/* Assign Builder */}
              <div className="pt-2 border-t border-gray-200">
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Assign a Builder
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="relative w-full sm:max-w-xs">
                    <select
                      value={selectedBuilderOptionKey}
                      onChange={(e) => handleBuilderSelect(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white appearance-none"
                    >
                      <option value="">Select a builder</option>
                      {builderOptions.map((builder) => (
                        <option key={builder.key} value={builder.key}>
                          {builder.name}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateBuilderForm}
                    className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-400 rounded-md hover:bg-orange-50 transition-colors self-start sm:self-center sm:ml-auto"
                  >
                    Create Builder
                  </button>
                </div>
                {builderOptions.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    No builders available from existing projects.
                  </p>
                )}
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

      {/* Create New Tower Form Modal */}
      {showCreateTowerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Create New Tower</h2>
              <button
                onClick={handleCloseCreateTowerForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewTower} className="p-4 space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Tower Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTowerData.name}
                  onChange={(e) => handleNewTowerChange('name', e.target.value)}
                  placeholder="Enter tower name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Tower Number <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newTowerData.number}
                  onChange={(e) => handleNewTowerChange('number', e.target.value)}
                  placeholder="Enter tower number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Description <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={newTowerData.description}
                  onChange={(e) => handleNewTowerChange('description', e.target.value)}
                  placeholder="Enter tower description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateTowerForm}
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

              {/* Tower Field - Only show if structure requires tower step */}
              {projectStructureData && projectStructureData.project_type === 'tower' && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                    Tower <span className="text-red-500">*</span>
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700">
                    {selectedTower || 'No tower selected'}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Tower is selected from the previous step
                  </p>
                </div>
              )}

              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Description <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={newBlockDescription}
                  onChange={(e) => setNewBlockDescription(e.target.value)}
                  placeholder="Enter block description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
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

      {/* Create Builder Form Modal */}
      {showCreateBuilderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Create Builder</h2>
              <button
                onClick={handleCloseCreateBuilderForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewBuilder} className="p-4 space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Builder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBuilderData.name}
                  onChange={(e) => handleNewBuilderChange('name', e.target.value)}
                  placeholder="Enter builder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Address
                </label>
                <textarea
                  value={newBuilderData.address}
                  onChange={(e) => handleNewBuilderChange('address', e.target.value)}
                  placeholder="Enter builder address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={newBuilderData.contactEmail}
                  onChange={(e) => handleNewBuilderChange('contactEmail', e.target.value)}
                  placeholder="Enter contact email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateBuilderForm}
                  className="px-4 py-2 rounded-md font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm"
                >
                  Create
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

              {/* Template Description */}
              <div>
                <label className="block font-medium text-gray-700 mb-1.5 text-sm">
                  Description
                </label>
                <input
                  type="text"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
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

