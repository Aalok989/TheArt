import React, { useState, useEffect } from 'react';
import { HiPlus, HiEye, HiPencil, HiTrash, HiCheckCircle, HiXCircle, HiArrowLeft, HiX, HiCloudUpload, HiOfficeBuilding, HiCollection, HiClock } from 'react-icons/hi';
import { fetchBuilders } from '../../../api/mockData';

const BuildersPage = ({ onPageChange }) => {
  const [builders, setBuilders] = useState([]);
  const [filteredBuilders, setFilteredBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null); // 'delete'
  

  // Load builders from mockData
  useEffect(() => {
    const loadBuilders = async () => {
      setLoading(true);
      try {
        const response = await fetchBuilders();
        if (response.success) {
          setBuilders(response.data);
        }
      } catch (error) {
        console.error('Error loading builders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBuilders();
  }, []);

  // Filter and sort builders
  useEffect(() => {
    let filtered = [...builders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(builder =>
        builder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(builder => builder.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.joinedOn) - new Date(a.joinedOn);
        case 'oldest':
          return new Date(a.joinedOn) - new Date(b.joinedOn);
        case 'most-projects':
          return b.totalProjects - a.totalProjects;
        default:
          return 0;
      }
    });

    setFilteredBuilders(filtered);
  }, [builders, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBuilders.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBuilders = filteredBuilders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, pageSize, filteredBuilders.length]);

  // Actions
  const handleView = (builder) => {
    setSelectedBuilder(builder);
    setShowDetailsPage(true);
  };

  const handleEdit = (builder) => {
    setSelectedBuilder(builder);
    setShowEditModal(true);
  };

  const handleDelete = (builder) => {
    setSelectedBuilder(builder);
    setDeleteAction('delete');
    setShowDeleteModal(true);
  };

  const handleVerify = (builder) => {
    const updatedBuilder = { ...builder, status: 'Verified' };
    setBuilders(prev =>
      prev.map(b =>
        b.id === builder.id ? updatedBuilder : b
      )
    );
    // Update selectedBuilder if we're viewing this builder's details
    if (selectedBuilder && selectedBuilder.id === builder.id) {
      setSelectedBuilder(updatedBuilder);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      Verified: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Suspended: 'bg-red-100 text-red-800',
      Rejected: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.Pending}`}>
        {status}
      </span>
    );
  };

  // Delete Confirmation Modal Component
  const DeleteBuilderModal = ({ isOpen, builder, action, onClose, onConfirm }) => {
    if (!isOpen || !builder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <HiX className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="font-bold text-gray-900" style={{ fontSize: 'clamp(1.125rem, 1.25rem, 1.5rem)' }}>
                Delete Builder?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
                <p className="text-gray-700 mb-4" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                  Are you sure you want to delete <strong>{builder.name}</strong>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This action cannot be undone. This will permanently remove:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-red-700 space-y-1">
                    <li>All builder information and profile</li>
                    <li>All associated projects and data</li>
                    <li>All documents and files</li>
                    <li>All historical records</li>
                  </ul>
                </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {builder.avatar ? (
                    <img src={builder.avatar} alt={builder.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-gray-600 font-semibold">
                      {builder.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{builder.name}</p>
                  {builder.companyName && (
                    <p className="text-sm text-gray-600">{builder.companyName}</p>
                  )}
                  <p className="text-sm text-gray-500">{builder.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 rounded-lg text-white font-medium transition-colors bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Builder Modal Component - Inline
  const EditBuilderModalInline = ({ builder, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
      name: builder?.name || '',
      companyName: builder?.companyName || '',
      email: builder?.email || '',
      phone: builder?.phone || '',
      alternatePhone: builder?.alternatePhone || '',
      address: builder?.address || { street: '', city: '', state: '', country: '', pincode: '' },
      website: builder?.website || '',
      gstNumber: builder?.gstNumber || '',
      defaultCommission: builder?.defaultCommission || '',
      businessDescription: builder?.businessDescription || '',
      notes: ''
    });
    const [errors, setErrors] = useState({});
    const [logoPreview, setLogoPreview] = useState(builder?.avatar || null);

    const handleInputChange = (field, value) => {
      if (field.startsWith('address.')) {
        const addressField = field.split('.')[1];
        setFormData(prev => ({
          ...prev,
          address: { ...prev.address, [addressField]: value }
        }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, logo: 'Logo size should be less than 5MB' }));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Builder name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const updatedBuilder = {
        ...builder,
        ...formData,
        type: 'Company', // Builders are always companies in this project
        avatar: logoPreview
      };
      onSuccess(updatedBuilder);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h2 className="font-bold text-gray-900" style={{ fontSize: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
              Edit Builder
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Builder Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Builder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Country"
                    />
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST / Tax Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission %</label>
                  <input
                    type="number"
                    value={formData.defaultCommission}
                    onChange={(e) => handleInputChange('defaultCommission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Upload Logo</h3>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-lg border border-gray-300" />
                    <button
                      type="button"
                      onClick={() => setLogoPreview(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
                    <HiCloudUpload className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}
                <div>
                  <p className="text-sm text-gray-600">Upload company logo</p>
                  <p className="text-xs text-gray-400">Max size: 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Details view state
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');

  // Show details view if selected
  if (showDetailsPage && selectedBuilder) {
    const builder = selectedBuilder;
    const notes = builder.notes || [];
    const projects = builder.projects || [];
    const documents = builder.documents || [];
    const activityLog = builder.activityLog || [];
    
    // Calculate company statistics
    const totalUnits = projects.reduce((sum, p) => sum + (p.units || 0), 0);
    const activeUnits = projects
      .filter(p => p.status === 'Active')
      .reduce((sum, p) => sum + (p.units || 0), 0);
    
    // Status cards for company
    const statusCards = [
      {
        id: 'total-projects',
        title: 'Total Projects',
        value: projects.length,
        color: 'bg-blue-100',
        icon: 'office',
        iconColor: 'text-blue-600'
      },
      {
        id: 'active-projects',
        title: 'Active Projects',
        value: projects.filter(p => p.status === 'Active').length,
        color: 'bg-green-100',
        icon: 'check',
        iconColor: 'text-green-600'
      },
      {
        id: 'completed-projects',
        title: 'Completed Projects',
        value: projects.filter(p => p.status === 'Completed').length,
        color: 'bg-purple-100',
        icon: 'check',
        iconColor: 'text-purple-600'
      },
      {
        id: 'total-units',
        title: 'Total Units',
        value: totalUnits,
        color: 'bg-orange-100',
        icon: 'collection',
        iconColor: 'text-orange-600'
      },
      {
        id: 'active-units',
        title: 'Active Units',
        value: activeUnits,
        color: 'bg-emerald-100',
        icon: 'clock',
        iconColor: 'text-emerald-600'
      },
      {
        id: 'company-status',
        title: 'Company Status',
        value: builder.status,
        color: builder.status === 'Verified' ? 'bg-green-100' : builder.status === 'Suspended' ? 'bg-red-100' : 'bg-yellow-100',
        icon: 'status',
        iconColor: builder.status === 'Verified' ? 'text-green-600' : builder.status === 'Suspended' ? 'text-red-600' : 'text-yellow-600'
      }
    ];

    const getStatusIcon = (iconType) => {
      switch (iconType) {
        case 'office':
          return <HiOfficeBuilding className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />;
        case 'check':
          return <HiCheckCircle className="text-green-600 group-hover:text-green-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />;
        case 'collection':
          return <HiCollection className="text-orange-600 group-hover:text-orange-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />;
        case 'clock':
          return <HiClock className="text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />;
        case 'status':
          return builder.status === 'Verified' ? (
            <HiCheckCircle className="text-green-600 group-hover:text-green-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />
          ) : builder.status === 'Suspended' ? (
            <HiXCircle className="text-red-600 group-hover:text-red-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />
          ) : (
            <HiClock className="text-yellow-600 group-hover:text-yellow-700 transition-colors duration-200" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />
          );
        default:
          return <HiOfficeBuilding className="text-gray-600" style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }} />;
      }
    };

    const handleAddNote = () => {
      if (newNote.trim()) {
        const note = {
          id: Date.now(),
          note: newNote,
          timestamp: new Date().toLocaleString(),
          admin: 'Current Admin'
        };
        setBuilders(prev =>
          prev.map(b =>
            b.id === builder.id
              ? { ...b, notes: [...(b.notes || []), note] }
              : b
          )
        );
        setNewNote('');
      }
    };

    return (
      <div className="h-full flex flex-col bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDetailsPage(false);
                  setSelectedBuilder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
                Builder/Company Details
              </h2>
              </div>
            <div className="flex items-center gap-1.5 relative z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEdit(builder);
                }}
                className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors p-0 cursor-pointer relative z-10"
                style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem', pointerEvents: 'auto' }}
                title="Edit Builder"
                type="button"
              >
                <HiPencil className="text-blue-600" style={{ width: '1rem', height: '1rem', pointerEvents: 'none' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 bg-gray-50" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Company Details Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {builder.avatar ? (
                <img src={builder.avatar} alt={builder.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                  <span className="text-gray-600 font-bold" style={{ fontSize: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                  {builder.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-bold text-gray-900" style={{ fontSize: 'clamp(1.125rem, 1.375rem, 1.625rem)' }}>
                  {builder.name}
                </h2>
                <StatusBadge status={builder.status} />
              </div>
              {builder.companyName && (
                  <p className="text-gray-600 mb-3 text-sm">Legal Name: {builder.companyName}</p>
              )}
                <div className="space-y-2 text-sm">
                <div>
                    <span className="text-gray-500">Company Email:</span>
                  <span className="text-gray-900 ml-2">{builder.email}</span>
                </div>
                <div>
                    <span className="text-gray-500">Company Phone:</span>
                  <span className="text-gray-900 ml-2">{builder.phone}</span>
                </div>
                {builder.address && (
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <span className="text-gray-900 ml-2">
                      {builder.address.street}, {builder.address.city}, {builder.address.state}
                    </span>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Company Owner Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex gap-4">
              {builder.companyOwner ? (
                <>
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold" style={{ fontSize: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                      {builder.companyOwner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Company Owner (Actual Owner)</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="text-gray-900 ml-2">{builder.companyOwner.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 ml-2">{builder.companyOwner.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900 ml-2">{builder.companyOwner.phone}</span>
                      </div>
                      {builder.companyOwner.alternatePhone && (
                        <div>
                          <span className="text-gray-500">Alternate Phone:</span>
                          <span className="text-gray-900 ml-2">{builder.companyOwner.alternatePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 mb-2">Company Owner Not Added</div>
                    <p className="text-sm text-gray-500">Record the actual owner of this builder/company for clarity.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Builder Admin Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex gap-4">
              {builder.builderAdmin ? (
                <>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold" style={{ fontSize: 'clamp(1.5rem, 2rem, 2.5rem)' }}>
                      {builder.builderAdmin.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">Builder Admin (Assigned Person)</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="text-gray-900 ml-2">{builder.builderAdmin.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 ml-2">{builder.builderAdmin.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900 ml-2">{builder.builderAdmin.phone}</span>
                      </div>
                      {builder.builderAdmin.alternatePhone && (
                        <div>
                          <span className="text-gray-500">Alternate Phone:</span>
                          <span className="text-gray-900 ml-2">{builder.builderAdmin.alternatePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 mb-2">No Builder Admin Assigned</div>
                    <p className="text-sm text-gray-500">Assign a builder admin to keep company contacts up to date.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="flex gap-1" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {['overview', 'projects', 'documents', 'notes', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors text-sm ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingTop: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Company Statistics - Status Cards */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Company Statistics</h3>
                <div className="bg-white overflow-hidden">
                  {/* Top horizontal line */}
                  <div className="border-b border-gray-200"></div>
                  
                  {/* Status Cards Container */}
                  <div className="flex">
                    {statusCards.map((card, index) => (
                      <React.Fragment key={card.id}>
                        <div
                          className="flex-1 p-4 flex items-center group relative"
                          style={{ minHeight: 'clamp(4rem, 5rem, 6rem)' }}
                        >
                          {/* Icon - Left Side */}
                          <div className="flex items-center justify-center mr-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:opacity-80 transition-all duration-200 ${card.color}`}>
                              {getStatusIcon(card.icon)}
                  </div>
                  </div>
                          
                          {/* Text Content - Right Side */}
                          <div className="flex-1 flex flex-col justify-center text-left">
                            {/* Title */}
                            <div 
                              className="text-gray-600 font-medium mb-1 group-hover:text-gray-700 transition-colors duration-200"
                              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                            >
                              {card.title}
                  </div>
                            
                            {/* Value */}
                            <div 
                              className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200"
                              style={{ fontSize: 'clamp(1.5rem, 2rem, 2.5rem)', lineHeight: '1' }}
                            >
                              {card.value}
                  </div>
                  </div>
                        </div>
                        
                        {/* Vertical separator line (except for last card) */}
                        {index < statusCards.length - 1 && (
                          <div className="w-px bg-gray-200 my-8"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* Bottom horizontal line */}
                  <div className="border-t border-gray-200"></div>
                </div>
              </div>

              {/* Company Information Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>Company Information</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Company Name:</span>
                      <span className="text-gray-900 ml-2">{builder.name}</span>
                  </div>
                    {builder.companyName && (
                      <div>
                        <span className="text-gray-500 font-medium">Legal Name:</span>
                        <span className="text-gray-900 ml-2">{builder.companyName}</span>
                </div>
                    )}
                    <div>
                      <span className="text-gray-500 font-medium">Email:</span>
                      <span className="text-gray-900 ml-2">{builder.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Phone:</span>
                      <span className="text-gray-900 ml-2">{builder.phone}</span>
                    </div>
                    {builder.alternatePhone && (
                      <div>
                        <span className="text-gray-500 font-medium">Alternate Phone:</span>
                        <span className="text-gray-900 ml-2">{builder.alternatePhone}</span>
                      </div>
                    )}
                    {builder.gstNumber && (
                      <div>
                        <span className="text-gray-500 font-medium">GST Number:</span>
                        <span className="text-gray-900 ml-2">{builder.gstNumber}</span>
                      </div>
                    )}
                    {builder.reraNumber && (
                      <div>
                        <span className="text-gray-500 font-medium">RERA Number:</span>
                        <span className="text-gray-900 ml-2">{builder.reraNumber}</span>
                      </div>
                    )}
                    {builder.website && (
                      <div>
                        <span className="text-gray-500 font-medium">Website:</span>
                        <a href={builder.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 ml-2">
                          {builder.website}
                        </a>
                      </div>
                    )}
                    {builder.address && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500 font-medium">Address:</span>
                        <span className="text-gray-900 ml-2">
                          {builder.address.street}, {builder.address.city}, {builder.address.state} - {builder.address.pincode}, {builder.address.country}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 font-medium">Joined On:</span>
                      <span className="text-gray-900 ml-2">
                        {new Date(builder.joinedOn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'projects' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Projects ({projects.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-200 text-gray-800">
                      <th className="border border-gray-300 px-3 py-2 text-left">Project Name</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Units</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-orange-600 hover:text-orange-700 font-medium">{project.name}</td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{project.type}</td>
                        <td className="border border-gray-200 px-3 py-2"><StatusBadge status={project.status} /></td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{project.units}</td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{new Date(project.createdOn).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'documents' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Documents ({documents.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-200 text-gray-800">
                      <th className="border border-gray-300 px-3 py-2 text-left">Document Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">File</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Uploaded On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900">{doc.type}</td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{doc.fileName}</td>
                        <td className="border border-gray-200 px-3 py-2"><StatusBadge status={doc.status} /></td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{new Date(doc.uploadedOn).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'notes' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Internal Notes</h3>
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Add a new note..."
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 mb-2">{note.note}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{note.admin}</span>
                      <span>•</span>
                      <span>{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Activity Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-200 text-gray-800">
                      <th className="border border-gray-300 px-3 py-2 text-left">Activity</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Performed By</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map((activity) => (
                      <tr key={activity.id} className="bg-white even:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-900">{activity.activity}</td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{activity.performedBy}</td>
                        <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{activity.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Builder/Company</h2>
          <div className="ml-auto flex items-center gap-3">
          {/* Search */}
            <div className="min-w-[10rem]" style={{ width: 'clamp(10rem, 14rem, 18rem)' }}>
            <input
              type="text"
                placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
            <button
              onClick={() => onPageChange('addBuilder')}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
            >
              <HiPlus className="w-4 h-4" />
              Add Builder Company
            </button>
              </div>
          </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading builders...</div>
          </div>
        ) : paginatedBuilders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: 'clamp(2rem, 3rem, 4rem)' }}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HiXCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
              No builder companies found
            </h3>
            <p className="text-gray-500 mb-4" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              {searchTerm
                ? 'Try adjusting your search'
                : 'Get started by adding your first builder company'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => onPageChange('addBuilder')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                <HiPlus className="w-5 h-5" />
                Add Builder Company
              </button>
            )}
          </div>
        ) : (
          <div className="min-w-[1400px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-200 text-gray-800">
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">SR No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Company Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Email</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Contact No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">GST No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Total Projects</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Created On</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Assigned Admin</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Admin Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Admin Email</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">RERA No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBuilders.map((builder, index) => (
                  <tr key={builder.id} className="bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-700">
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          {builder.avatar ? (
                            <img src={builder.avatar} alt={builder.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-600 font-semibold text-xs">
                              {builder.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900 text-sm whitespace-nowrap">
                            {builder.name}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">{builder.email || '-'}</span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">{builder.phone || '-'}</span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">{builder.gstNumber || '-'}</span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <button
                        onClick={() => handleView(builder)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm whitespace-nowrap"
                      >
                        {builder.totalProjects || 0}
                      </button>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        {builder.joinedOn ? new Date(builder.joinedOn).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <StatusBadge status={builder.status} />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        {builder.builderAdmin ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">
                        {builder.builderAdmin?.name || '-'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">
                        {builder.builderAdmin?.email || '-'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <span className="text-sm text-gray-900 whitespace-nowrap">
                        {builder.reraNumber || '-'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <div className="flex items-center justify-start gap-1.5">
                        <button
                          onClick={() => handleView(builder)}
                          className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors p-0"
                          style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem' }}
                          title="View Details"
                        >
                          <HiEye className="text-blue-600" style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(builder)}
                          className="flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors p-0"
                          style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem' }}
                          title="Edit Builder"
                        >
                          <HiPencil className="text-blue-600" style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        {builder.status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(builder)}
                            className="flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors p-0"
                            style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem' }}
                            title="Verify Builder"
                          >
                            <HiCheckCircle className="text-green-600" style={{ width: '1rem', height: '1rem' }} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(builder)}
                          className="flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors p-0"
                          style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem' }}
                          title="Delete Builder"
                        >
                          <HiTrash className="text-red-600" style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredBuilders.length > 0 && (
        <div className="flex-shrink-0 border-t border-gray-200 py-2 px-4" style={{ paddingRight: 'clamp(2rem, 4rem, 5rem)', paddingLeft: 'clamp(2rem, 3rem, 4rem)' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredBuilders.length)} of {filteredBuilders.length}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                {[10, 20, 50, 100].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="First"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===1? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Previous"
                >
                  ‹
                </button>
                <span className="text-sm text-gray-700 px-2">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Next"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage===totalPages? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  title="Last"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Builder Modal - Inline */}
      {showEditModal && selectedBuilder && (
        <EditBuilderModalInline
          builder={selectedBuilder}
          onClose={() => {
            setShowEditModal(false);
            // Don't clear selectedBuilder if we're on the details page
            if (!showDetailsPage) {
            setSelectedBuilder(null);
            }
          }}
          onSuccess={(updatedBuilder) => {
            setBuilders(prev =>
              prev.map(b => (b.id === updatedBuilder.id ? updatedBuilder : b))
            );
            setSelectedBuilder(updatedBuilder);
            setShowEditModal(false);
            // Keep details page open if it was already open
            if (showDetailsPage) {
              // Details page will automatically update with new selectedBuilder
            }
          }}
        />
      )}

      {showDeleteModal && selectedBuilder && (
        <DeleteBuilderModal
          isOpen={showDeleteModal}
          builder={selectedBuilder}
          action={deleteAction}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBuilder(null);
            setDeleteAction(null);
          }}
          onConfirm={() => {
              setBuilders(prev => prev.filter(b => b.id !== selectedBuilder.id));
            setShowDetailsPage(false);
            setShowDeleteModal(false);
            setSelectedBuilder(null);
            setDeleteAction(null);
          }}
        />
      )}

    </div>
  );
};

export default BuildersPage;

