import React, { useState, useEffect } from 'react';
import { HiPlus, HiSearch, HiChevronDown, HiEye, HiPencil, HiTrash, HiCheckCircle, HiXCircle, HiBan, HiDownload, HiArrowLeft, HiX, HiCloudUpload } from 'react-icons/hi';
import { fetchBuilders } from '../../../api/mockData';

const BuildersPage = ({ onPageChange }) => {
  const [builders, setBuilders] = useState([]);
  const [filteredBuilders, setFilteredBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null); // 'delete' or 'suspend'
  
  // Dropdown states
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);

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

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(builder => builder.type.toLowerCase() === typeFilter.toLowerCase());
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
    setCurrentPage(1); // Reset to first page on filter change
  }, [builders, searchTerm, statusFilter, typeFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedBuilders = filteredBuilders.slice(startIndex, endIndex);

  // Row selection
  const handleRowSelect = (builderId) => {
    setSelectedRows(prev =>
      prev.includes(builderId)
        ? prev.filter(id => id !== builderId)
        : [...prev, builderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedBuilders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedBuilders.map(builder => builder.id));
    }
  };

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

  const handleSuspend = (builder) => {
    setSelectedBuilder(builder);
    setDeleteAction('suspend');
    setShowDeleteModal(true);
  };

  const handleVerify = (builder) => {
    setBuilders(prev =>
      prev.map(b =>
        b.id === builder.id ? { ...b, status: 'Verified' } : b
      )
    );
  };

  // Bulk actions
  const handleBulkVerify = () => {
    setBuilders(prev =>
      prev.map(builder =>
        selectedRows.includes(builder.id) ? { ...builder, status: 'Verified' } : builder
      )
    );
    setSelectedRows([]);
  };

  const handleBulkSuspend = () => {
    setBuilders(prev =>
      prev.map(builder =>
        selectedRows.includes(builder.id) ? { ...builder, status: 'Suspended' } : builder
      )
    );
    setSelectedRows([]);
  };

  const handleBulkDelete = () => {
    setBuilders(prev => prev.filter(builder => !selectedRows.includes(builder.id)));
    setSelectedRows([]);
  };

  const handleExport = () => {
    const selectedBuildersData = builders.filter(b => selectedRows.includes(b.id));
    // Convert to CSV and download
    console.log('Exporting:', selectedBuildersData);
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

  // Delete/Suspend Confirmation Modal Component
  const DeleteBuilderModal = ({ isOpen, builder, action, onClose, onConfirm }) => {
    if (!isOpen || !builder) return null;

    const isDelete = action === 'delete';
    const isSuspend = action === 'suspend';

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
                {isDelete ? 'Delete Builder?' : 'Suspend Builder?'}
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
            {isDelete ? (
              <>
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
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                  Are you sure you want to suspend <strong>{builder.name}</strong>?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Suspending this builder will:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-yellow-700 space-y-1">
                    <li>Restrict builder access to the system</li>
                    <li>Hide builder from public listings</li>
                    <li>Prevent new project creation</li>
                    <li>Builder can be reactivated later</li>
                  </ul>
                </div>
              </>
            )}

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
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                isDelete
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {isDelete ? 'Delete Permanently' : 'Suspend Builder'}
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
      builderType: builder?.type || '',
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
      if (!formData.builderType) newErrors.builderType = 'Builder type is required';
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
        type: formData.builderType,
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
                    Builder Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.builderType}
                    onChange={(e) => handleInputChange('builderType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${errors.builderType ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Type</option>
                    <option value="Company">Company</option>
                    <option value="Individual">Individual</option>
                    <option value="Developer">Developer</option>
                  </select>
                  {errors.builderType && <p className="text-red-500 text-xs mt-1">{errors.builderType}</p>}
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
    
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'Active').length,
      completedProjects: projects.filter(p => p.status === 'Completed').length,
      totalBookings: 245,
      totalRevenue: '₹12,50,00,000',
      lastActive: builder.joinedOn
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
      <div className="h-full flex flex-col bg-white" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
        <div className="flex-shrink-0 border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowDetailsPage(false);
                  setSelectedBuilder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
                  Builder Details
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(builder)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <HiPencil className="w-4 h-4" />
                Edit Builder
              </button>
              {builder.status !== 'Verified' && (
                <button
                  onClick={() => handleVerify(builder)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <HiCheckCircle className="w-4 h-4" />
                  Verify
                </button>
              )}
              {builder.status !== 'Suspended' ? (
                <button
                  onClick={() => handleSuspend(builder)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  <HiBan className="w-4 h-4" />
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => handleVerify(builder)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <HiCheckCircle className="w-4 h-4" />
                  Activate
                </button>
              )}
              <button
                onClick={() => handleDelete(builder)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <HiTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {builder.avatar ? (
                <img src={builder.avatar} alt={builder.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-gray-600 font-bold text-2xl">
                  {builder.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-bold text-gray-900" style={{ fontSize: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
                  {builder.name}
                </h2>
                <StatusBadge status={builder.status} />
              </div>
              {builder.companyName && (
                <p className="text-gray-600 mb-2">{builder.companyName}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900 ml-2 font-medium">{builder.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900 ml-2">{builder.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
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
        </div>

        <div className="flex-shrink-0 border-b border-gray-200">
          <div className="flex gap-1" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {['overview', 'projects', 'documents', 'notes', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
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

        <div className="flex-1 overflow-auto min-h-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeProjects}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.completedProjects}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{stats.totalRevenue}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Last Active</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(stats.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'projects' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Projects ({projects.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Project Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Units</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-orange-600 hover:text-orange-700 font-medium">{project.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{project.type}</td>
                        <td className="px-4 py-3"><StatusBadge status={project.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-700">{project.units}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{new Date(project.createdOn).toLocaleDateString()}</td>
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
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Document Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">File</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Uploaded On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.type}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{doc.fileName}</td>
                        <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-700">{new Date(doc.uploadedOn).toLocaleDateString()}</td>
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
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Activity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Performed By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activityLog.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{activity.activity}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{activity.performedBy}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{activity.timestamp}</td>
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
    <div className="h-full flex flex-col bg-white" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1.25rem, 1.5rem, 1.75rem)' }}>
              Builders
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              Manage all builders registered in the system
            </p>
          </div>
          <button
            onClick={() => onPageChange('addBuilder')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
            style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
          >
            <HiPlus style={{ width: 'clamp(1rem, 1.25rem, 1.5rem)', height: 'clamp(1rem, 1.25rem, 1.5rem)' }} />
            Add Builder
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <HiChevronDown className="w-4 h-4 rotate-[-90deg]" />
          <span className="text-gray-800 font-medium">Builders</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex-shrink-0 border-b border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" style={{ width: '1.25rem', height: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
                setShowSortDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
              {statusFilter === 'all' ? 'All Status' : statusFilter}
              <HiChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                {['all', 'Pending', 'Verified', 'Suspended', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      statusFilter === status ? 'bg-orange-50 text-orange-600' : ''
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
                setShowSortDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
              {typeFilter === 'all' ? 'All Types' : typeFilter}
              <HiChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                {['all', 'Company', 'Individual', 'Developer'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setShowTypeDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      typeFilter === type ? 'bg-orange-50 text-orange-600' : ''
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowStatusDropdown(false);
                setShowTypeDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
            >
              Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Most Projects'}
              <HiChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                {[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'most-projects', label: 'Most Projects' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortBy === option.value ? 'bg-orange-50 text-orange-600' : ''
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">
              {selectedRows.length} selected
            </span>
            <button
              onClick={handleBulkVerify}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <HiCheckCircle className="w-4 h-4" />
              Verify Selected
            </button>
            <button
              onClick={handleBulkSuspend}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <HiBan className="w-4 h-4" />
              Suspend Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <HiTrash className="w-4 h-4" />
              Delete Selected
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <HiDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
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
              No builders found
            </h3>
            <p className="text-gray-500 mb-4" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first builder'}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={() => onPageChange('addBuilder')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                <HiPlus className="w-5 h-5" />
                Add Builder
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedBuilders.length && paginatedBuilders.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Builder Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Builder Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Projects
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBuilders.map((builder) => (
                  <tr key={builder.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(builder.id)}
                        onChange={() => handleRowSelect(builder.id)}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {builder.avatar ? (
                            <img src={builder.avatar} alt={builder.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-600 font-semibold" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                              {builder.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                            {builder.name}
                          </div>
                          {builder.companyName && (
                            <div className="text-sm text-gray-500">{builder.companyName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{builder.email}</div>
                      <div className="text-sm text-gray-500">{builder.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{builder.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(builder)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        {builder.totalProjects}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={builder.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">
                        {new Date(builder.joinedOn).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(builder)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(builder)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit Builder"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                        {builder.status !== 'Verified' && (
                          <button
                            onClick={() => handleVerify(builder)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Verify Builder"
                          >
                            <HiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {builder.status !== 'Suspended' ? (
                          <button
                            onClick={() => handleSuspend(builder)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                            title="Suspend Builder"
                          >
                            <HiBan className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(builder)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Activate Builder"
                          >
                            <HiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(builder)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Builder"
                        >
                          <HiTrash className="w-4 h-4" />
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
        <div className="flex-shrink-0 border-t border-gray-200" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRowsDropdown(!showRowsDropdown);
                  }}
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  {rowsPerPage}
                  <HiChevronDown className={`w-4 h-4 transition-transform ${showRowsDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showRowsDropdown && (
                  <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {[5, 10, 25, 50, 100].map((rows) => (
                      <button
                        key={rows}
                        onClick={() => {
                          setRowsPerPage(rows);
                          setShowRowsDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          rowsPerPage === rows ? 'bg-orange-50 text-orange-600' : ''
                        }`}
                        style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}
                      >
                        {rows}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBuilders.length)} of {filteredBuilders.length} builders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? 'bg-orange-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
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
            setSelectedBuilder(null);
          }}
          onSuccess={(updatedBuilder) => {
            setBuilders(prev =>
              prev.map(b => (b.id === updatedBuilder.id ? updatedBuilder : b))
            );
            setShowEditModal(false);
            setSelectedBuilder(null);
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
            if (deleteAction === 'delete') {
              setBuilders(prev => prev.filter(b => b.id !== selectedBuilder.id));
            } else if (deleteAction === 'suspend') {
              setBuilders(prev =>
                prev.map(b =>
                  b.id === selectedBuilder.id ? { ...b, status: 'Suspended' } : b
                )
              );
            }
            setShowDeleteModal(false);
            setSelectedBuilder(null);
            setDeleteAction(null);
          }}
        />
      )}

      {/* Click outside to close dropdowns */}
      {(showStatusDropdown || showTypeDropdown || showSortDropdown || showRowsDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowStatusDropdown(false);
            setShowTypeDropdown(false);
            setShowSortDropdown(false);
            setShowRowsDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default BuildersPage;

