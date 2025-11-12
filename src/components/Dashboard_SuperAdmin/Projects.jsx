import React, { useState, useEffect } from 'react';
import { HiPlus, HiChevronDown } from 'react-icons/hi';
import { fetchProjects } from '../../api/mockData';

const Projects = ({ onPageChange }) => {
  const [builderFilter, setBuilderFilter] = useState('builder');
  const [isActiveFilter, setIsActiveFilter] = useState('is active');
  const [createdAtFilter, setCreatedAtFilter] = useState('created at');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);
  const [formData, setFormData] = useState({
    builder: '',
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      name: 'Block A',
      description: 'Block A of Green Gardens',
      isEdit: false,
      selected: false
    },
    {
      id: 2,
      name: 'Block B',
      description: 'Block B of Green Gardens',
      isEdit: false,
      selected: false
    },
    {
      id: 3,
      name: '',
      description: '',
      isEdit: true,
      isNew: true,
      selected: false
    }
  ]);

  // Fetch projects data on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetchProjects();
        if (response.success) {
          setAllProjects(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    loadProjects();
  }, []);


  // Filter projects based on search criteria
  const filteredProjects = allProjects.filter(project => {
    const matchesBuilder = builderFilter === 'builder' || project.builder.toLowerCase().includes(builderFilter.toLowerCase());
    const matchesActive = isActiveFilter === 'is active' || 
      (isActiveFilter === 'active' && project.isActive) || 
      (isActiveFilter === 'inactive' && !project.isActive);
    const matchesCreatedAt = createdAtFilter === 'created at' || project.createdAt.includes(createdAtFilter);
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.builder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBuilder && matchesActive && matchesCreatedAt && matchesSearch;
  });

  // Handle individual row selection
  const handleRowSelect = (projectId) => {
    setSelectedRows(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedRows.length === filteredProjects.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredProjects.map(project => project.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRows.length > 0) {
      // Here you would typically make an API call to delete the selected projects
      console.log('Deleting projects:', selectedRows);
      // For now, just clear the selection
      setSelectedRows([]);
      alert(`Deleted ${selectedRows.length} project(s)`);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the project
    console.log('Adding project:', formData);
    // For now, just close the form and reset
    setShowAddForm(false);
    setFormData({
      builder: '',
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
    alert('Project added successfully!');
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle block input changes
  const handleBlockChange = (blockId, field, value) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, [field]: value } : block
    ));
  };

  // Handle block edit toggle
  const handleBlockEdit = (blockId) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, isEdit: !block.isEdit } : block
    ));
  };

  // Handle add new block
  const handleAddBlock = () => {
    const newBlock = {
      id: Date.now(),
      name: '',
      description: '',
      isEdit: true,
      isNew: true
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  // Handle remove block
  const handleRemoveBlock = (blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  // Handle block selection
  const handleBlockSelection = (blockId, isSelected) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, selected: isSelected } : block
    ));
  };

  // Handle delete selected blocks
  const handleDeleteSelectedBlocks = () => {
    const selectedBlocks = blocks.filter(block => block.selected && !block.isNew);
    if (selectedBlocks.length > 0) {
      // Here you would typically make an API call to delete the selected blocks
      console.log('Deleting blocks:', selectedBlocks);
      setBlocks(prev => prev.filter(block => !block.selected || block.isNew));
      alert(`Deleted ${selectedBlocks.length} block(s)`);
    } else {
      alert('No blocks selected for deletion');
    }
  };

  // Get selected blocks count (excluding new blocks)
  const selectedBlocksCount = blocks.filter(block => block.selected && !block.isNew).length;

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white lg:bg-transparent shadow-sm lg:shadow-none border lg:border-0 border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0" style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
            Projects Management
          </h2>
          
          {/* Add Project Button - Responsive */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 transition-colors shadow-sm hover:shadow-md w-full lg:w-auto"
            style={{ 
              fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
              paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
              height: 'clamp(2rem, 2.5rem, 3rem)'
            }}
          >
            <HiPlus style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            <span>Add Project</span>
          </button>
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-3 lg:space-y-0" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          {/* Builder Filter */}
          <div className="relative">
            <select
              value={builderFilter}
              onChange={(e) => setBuilderFilter(e.target.value)}
              className="appearance-none bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                color: '#6B7280',
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                minWidth: 'clamp(6rem, 8rem, 10rem)',
                height: 'clamp(2rem, 2.5rem, 3rem)'
              }}
            >
              <option value="builder">builder</option>
              <option value="GHPL Constructions">GHPL Constructions</option>
              <option value="Orchid Developers">Orchid Developers</option>
              <option value="Green Homes">Green Homes</option>
            </select>
            <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
          </div>

          {/* Is Active Filter */}
          <div className="relative">
            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className="appearance-none bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                color: '#6B7280',
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                minWidth: 'clamp(6rem, 8rem, 10rem)',
                height: 'clamp(2rem, 2.5rem, 3rem)'
              }}
            >
              <option value="is active">is active</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
          </div>

          {/* Created At Filter */}
          <div className="relative">
            <select
              value={createdAtFilter}
              onChange={(e) => setCreatedAtFilter(e.target.value)}
              className="appearance-none bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                color: '#6B7280',
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingRight: 'clamp(1.5rem, 2rem, 2.5rem)',
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                minWidth: 'clamp(6rem, 8rem, 10rem)',
                height: 'clamp(2rem, 2.5rem, 3rem)'
              }}
            >
              <option value="created at">created at</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
            <HiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)' }} />
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                color: '#6B7280',
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                minWidth: 'clamp(6rem, 8rem, 10rem)',
                height: 'clamp(2rem, 2.5rem, 3rem)'
              }}
            />
          </div>

          {/* Search Button */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
            style={{ 
              fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
              paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)',
              paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
              paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
              height: 'clamp(2rem, 2.5rem, 3rem)'
            }}
          >
            Search
          </button>

          {/* Bulk Delete Button - Only show when rows are selected */}
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
              style={{ 
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                paddingLeft: 'clamp(0.75rem, 1rem, 1.25rem)',
                paddingRight: 'clamp(0.75rem, 1rem, 1.25rem)',
                paddingTop: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                paddingBottom: 'clamp(0.375rem, 0.5rem, 0.625rem)',
                height: 'clamp(2rem, 2.5rem, 3rem)'
              }}
            >
              Delete ({selectedRows.length})
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        {/* Table Headers - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:grid border-b sticky top-0 z-10 bg-white" style={{ 
          gridTemplateColumns: '0.5fr 0.5fr 2fr 1.5fr 1.5fr 1fr 1.2fr',
          gap: 'clamp(0.375rem, 1rem, 1.5rem)',
          paddingTop: 'clamp(0.75rem, 1rem, 1.25rem)',
          paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)',
          borderBottomColor: '#616161',
          borderBottomWidth: '0.1875rem'
        }}>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
            <input
              type="checkbox"
              checked={selectedRows.length === filteredProjects.length && filteredProjects.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold', textAlign: 'center' }}>
            SR.No.
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Name
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Builder
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Location
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Is Active
          </div>
          <div style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)', color: '#8C8C8C', fontWeight: 'bold' }}>
            Created At
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0">
          {filteredProjects.map((project, index) => (
            <div key={project.id}>
              {/* Desktop/Tablet View */}
              <div className="hidden md:grid border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200" style={{ 
                gridTemplateColumns: '0.5fr 0.5fr 2fr 1.5fr 1.5fr 1fr 1.2fr',
                gap: 'clamp(0.375rem, 1rem, 1.5rem)',
                paddingTop: 'clamp(0.875rem, 1.25rem, 1.5rem)',
                paddingBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)'
              }}>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(project.id)}
                    onChange={() => handleRowSelect(project.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400', textAlign: 'center' }}>
                  {index + 1}
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {project.name}
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {project.builder}
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {project.location}
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  <span
                    style={{
                      backgroundColor: project.isActive ? '#E4FFE5' : '#FFEBEB',
                      color: project.isActive ? '#16A34A' : '#DC2626',
                      padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                      borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                      fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                      fontWeight: '500',
                    }}
                  >
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1rem, 1.125rem)', color: '#000000', fontWeight: '400' }}>
                  {project.createdAt}
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(project.id)}
                      onChange={() => handleRowSelect(project.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                        {project.name}
                      </h3>
                      <p className="text-gray-600" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                        {project.builder}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: project.isActive ? '#E4FFE5' : '#FFEBEB',
                      color: project.isActive ? '#16A34A' : '#DC2626',
                      padding: 'clamp(0.125rem, 0.25rem, 0.375rem) clamp(0.5rem, 0.75rem, 1rem)',
                      borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)',
                      fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                      fontWeight: '500',
                    }}
                  >
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Location:</span>
                    <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>Created:</span>
                    <span className="text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>{project.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* No Results Message */}
          {filteredProjects.length === 0 && (
            <div className="text-center" style={{ paddingTop: 'clamp(1.5rem, 2rem, 2.5rem)', paddingBottom: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
              <p className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                No projects found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Project Form Modal */}
      {showAddForm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ margin: 'clamp(-1rem, -1.5rem, -2rem)', borderRadius: 'clamp(1rem, 1.5rem, 1.75rem)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Add New Project</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'general' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                General
              </button>
              <button 
                onClick={() => setActiveTab('blocks')}
                className={`px-4 py-2 font-medium border-b-2 ${
                  activeTab === 'blocks' 
                    ? 'text-blue-600 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                Blocks
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleFormSubmit} className="p-4 space-y-3">
              {activeTab === 'general' ? (
                <>
                  {/* Builder Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Builder <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.builder}
                        onChange={(e) => handleInputChange('builder', e.target.value)}
                        placeholder="Select or enter builder name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter project name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Location Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter project location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Start Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('startDate', getTodayDate())}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Today
                        </button>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Note: You are 5.5 hours ahead of server time.</p>
                  </div>

                  {/* End Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange('endDate', getTodayDate())}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Today
                        </button>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Note: You are 5.5 hours ahead of server time.</p>
                  </div>

                  {/* Is Active Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Is Active
                    </label>
                  </div>
                </>
              ) : (
                /* Blocks Tab Content */
                <div className="space-y-4">
                  {/* Blocks Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200">
                      <div className="col-span-1 px-3 py-2 text-xs font-medium text-gray-700"></div>
                      <div className="col-span-3 px-3 py-2 text-xs font-medium text-gray-700">Name</div>
                      <div className="col-span-6 px-3 py-2 text-xs font-medium text-gray-700">Description</div>
                      <div className="col-span-2 px-3 py-2 text-xs font-medium text-gray-700">Delete?</div>
                    </div>
                    
                    {/* Table Body */}
                    {blocks.map((block) => (
                      <div key={block.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                        <div className="col-span-1 px-3 py-2 flex items-center justify-center">
                          {block.isNew ? (
                            <button type="button" className="text-green-600 hover:text-green-800">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={() => handleBlockEdit(block.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        <div className="col-span-3 px-3 py-2">
                          <input
                            type="text"
                            value={block.name}
                            onChange={(e) => handleBlockChange(block.id, 'name', e.target.value)}
                            placeholder="Enter block name"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="col-span-6 px-3 py-2">
                          <textarea
                            value={block.description}
                            onChange={(e) => handleBlockChange(block.id, 'description', e.target.value)}
                            placeholder="Enter block description"
                            rows={2}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        
                        <div className="col-span-2 px-3 py-2 flex items-center">
                          {block.isNew ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveBlock(block.id)}
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            >
                              Remove
                            </button>
                          ) : (
                            <input
                              type="checkbox"
                              checked={block.selected}
                              onChange={(e) => handleBlockSelection(block.id, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    {/* Delete Selected Blocks Button - Only show when blocks are selected */}
                    {selectedBlocksCount > 0 && (
                      <button
                        type="button"
                        onClick={handleDeleteSelectedBlocks}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Delete Selected ({selectedBlocksCount})
                      </button>
                    )}
                    
                    {/* Add Another Block Button */}
                    <button
                      type="button"
                      onClick={handleAddBlock}
                      className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Add another Block
                    </button>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
