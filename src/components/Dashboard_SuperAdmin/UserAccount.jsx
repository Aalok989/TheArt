import React, { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineSearch,
  HiEye,
  HiPencil,
  HiX,
  HiCheckCircle,
  HiXCircle,
  HiBan,
  HiRefresh
} from 'react-icons/hi';
import { fetchBuilderAdmins, fetchBuilders, updateBuilderAdmin } from '../../api/mockData';

const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800',
  Suspended: 'bg-red-100 text-red-800',
  Inactive: 'bg-gray-100 text-gray-800'
};

const STATUS_OPTIONS = ['Active', 'Inactive', 'Suspended'];

const initialPasswordState = { newPassword: '', confirmPassword: '' };

const UserAccount = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [passwordFields, setPasswordFields] = useState(initialPasswordState);
  const [passwordError, setPasswordError] = useState('');
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      try {
        const response = await fetchBuilderAdmins();
        if (response.success) {
          setAdmins(response.data);
        }
      } catch (error) {
        console.error('Error fetching builder admins:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const response = await fetchBuilders();
        if (response.success) {
          const options = response.data.map((builder) => ({
            id: builder.id,
            label: builder.name || builder.companyName || builder.email || `Builder ${builder.id}`
          }));
          setCompanyOptions(options);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setCompaniesLoading(false);
      }
    };

    loadAdmins();
    loadCompanies();
  }, []);

  useEffect(() => {
    let filtered = [...admins];
    if (searchTerm) {
      filtered = filtered.filter((admin) => {
        const haystack = `${admin.fullName} ${admin.builderCode} ${admin.assignedCompany} ${admin.email} ${admin.phone}`.toLowerCase();
        return haystack.includes(searchTerm.toLowerCase());
      });
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((admin) => admin.status.toLowerCase() === statusFilter.toLowerCase());
    }
    setFilteredAdmins(filtered);
  }, [admins, searchTerm, statusFilter]);

  const statusCards = useMemo(() => {
    const total = admins.length || 1;
    return STATUS_OPTIONS.map((status) => {
      const count = admins.filter((admin) => admin.status === status).length;
      return {
        id: status,
        title: status,
        value: count,
        percentage: Math.round((count / total) * 100)
      };
    });
  }, [admins]);

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setIsDrawerOpen(true);
  };

  const handleEdit = (admin) => {
    setEditForm(JSON.parse(JSON.stringify(admin)));
    setPasswordFields(initialPasswordState);
    setPasswordError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm(null);
    setPasswordFields(initialPasswordState);
    setPasswordError('');
  };

  const handleEditChange = (field, value) => {
    if (!editForm) return;
    const [section, key] = field.split('.');
    if (['personal', 'address', 'professional', 'bank', 'assignment'].includes(section) && key) {
      setEditForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswordFields((prev) => ({
      ...prev,
      [field]: value
    }));
    setPasswordError('');
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    if (!editForm.assignment?.company?.trim()) {
      setPasswordError('Company selection is required.');
      return;
    }
    if (!STATUS_OPTIONS.includes(editForm.status)) {
      setPasswordError('Please select a valid account status.');
      return;
    }

    if (passwordFields.newPassword || passwordFields.confirmPassword) {
      if (passwordFields.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters.');
        return;
      }
      if (passwordFields.newPassword !== passwordFields.confirmPassword) {
        setPasswordError('Passwords do not match.');
        return;
      }
      // Simulate password update by attaching placeholder field
      editForm.passwordLastUpdated = new Date().toISOString();
    }

    try {
      const response = await updateBuilderAdmin(editForm.id, editForm);
      if (response.success) {
        setAdmins((prev) =>
          prev.map((admin) => (admin.id === editForm.id ? response.data : admin))
        );
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating builder admin:', error);
      setPasswordError('Unable to save changes. Please try again.');
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value || '-'}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
      <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>
              Builder Admin Accounts
            </h2>
            <p className="text-sm text-gray-500">Manage all builder_admin profiles and access</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search admin..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-100" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingTop: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusCards.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-gradient-to-br from-white to-gray-50 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">of {admins.length} admins</p>
                <p className="text-sm font-semibold text-orange-600">{card.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  {['SR No', 'Full Name', 'Builder ID', 'Assigned Company', 'Email', 'Phone', 'Status', 'Created On', 'Actions'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left font-semibold border-b border-gray-200 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Loading builder admins...
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No builder admins found.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, index) => (
                    <tr key={admin.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{admin.fullName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{admin.builderCode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{admin.assignedCompany}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{admin.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{admin.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={admin.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {admin.createdOn ? new Date(admin.createdOn).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(admin)}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                            title="View Details"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end" onClick={() => setIsDrawerOpen(false)}>
          <div
            className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedAdmin.fullName}</h3>
                <p className="text-sm text-gray-500">{selectedAdmin.builderCode}</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Account Status</h4>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedAdmin.status} />
                  <span className="text-sm text-gray-500">Created on {new Date(selectedAdmin.createdOn).toLocaleDateString()}</span>
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <InfoRow label="Full Name" value={selectedAdmin.fullName} />
                  <InfoRow label="Email" value={selectedAdmin.email} />
                  <InfoRow label="Phone" value={selectedAdmin.phone} />
                  <InfoRow label="Alternate Phone" value={selectedAdmin.personal?.alternatePhone} />
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <InfoRow label="Street" value={selectedAdmin.address?.street} />
                  <InfoRow label="City" value={selectedAdmin.address?.city} />
                  <InfoRow label="State" value={selectedAdmin.address?.state} />
                  <InfoRow label="Country" value={selectedAdmin.address?.country} />
                  <InfoRow label="Pincode" value={selectedAdmin.address?.pincode} />
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Professional</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <InfoRow label="Employee ID" value={selectedAdmin.professional?.employeeId} />
                  <InfoRow label="PAN" value={selectedAdmin.professional?.panNumber} />
                  <InfoRow label="Aadhaar" value={selectedAdmin.professional?.aadharNumber} />
                  <InfoRow label="GST" value={selectedAdmin.professional?.gstNumber} />
                  <InfoRow label="RERA" value={selectedAdmin.professional?.reraNumber} />
                  <InfoRow label="Assigned On" value={selectedAdmin.professional?.dateOfAssigning} />
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Bank Details</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <InfoRow label="Account Name" value={selectedAdmin.bank?.accountName} />
                  <InfoRow label="Account Number" value={selectedAdmin.bank?.accountNumber} />
                  <InfoRow label="IFSC" value={selectedAdmin.bank?.ifsc} />
                  <InfoRow label="Bank" value={selectedAdmin.bank?.bankName} />
                  <InfoRow label="Branch" value={selectedAdmin.bank?.branch} />
                  <InfoRow label="UPI" value={selectedAdmin.bank?.upiId} />
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Assignment</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <InfoRow label="Assigned Company" value={selectedAdmin.assignment?.company} />
                  <div className="py-2">
                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">
                      {selectedAdmin.assignment?.notes || 'No notes available'}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={closeEditModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Edit Builder Admin</h3>
                <p className="text-sm text-gray-500">Update profile, account status, or assignments</p>
              </div>
              <button onClick={closeEditModal} className="p-2 rounded-full hover:bg-gray-100">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <section className="border border-gray-200 rounded-xl p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleEditChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editForm.assignment?.company || ''}
                      onChange={(e) => handleEditChange('assignment.company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    >
                      <option value="">
                        {companiesLoading ? 'Loading companies...' : 'Select company'}
                      </option>
                      {companyOptions.map((company) => (
                        <option key={company.id} value={company.label}>
                          {company.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editForm.personal?.firstName || ''}
                      onChange={(e) => handleEditChange('personal.firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editForm.personal?.lastName || ''}
                      onChange={(e) => handleEditChange('personal.lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => handleEditChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Professional IDs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Employee ID', field: 'professional.employeeId' },
                    { label: 'PAN Number', field: 'professional.panNumber' },
                    { label: 'Aadhaar Number', field: 'professional.aadharNumber' },
                    { label: 'GST Number', field: 'professional.gstNumber' },
                    { label: 'RERA Number', field: 'professional.reraNumber' }
                  ].map((item) => (
                    <div key={item.field}>
                      <label className="block text-sm text-gray-600 mb-1">{item.label}</label>
                      <input
                        type="text"
                        value={item.field.split('.').reduce((acc, key) => acc?.[key], editForm) || ''}
                        onChange={(e) => handleEditChange(item.field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date of Assigning</label>
                    <input
                      type="date"
                      value={editForm.professional?.dateOfAssigning || ''}
                      onChange={(e) => handleEditChange('professional.dateOfAssigning', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordFields.newPassword}
                      onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="******"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordFields.confirmPassword}
                      onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder="******"
                    />
                  </div>
                </div>
                {passwordError && <p className="text-sm text-red-600 mt-2">{passwordError}</p>}
              </section>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;

