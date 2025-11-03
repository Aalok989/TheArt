import React, { useState, useEffect } from 'react';
import { HiChevronRight, HiChevronDown } from 'react-icons/hi';
import {
  fetchManageUserCategories,
  fetchManageUserRoles,
  fetchManageUserRoleDefaults,
  getManageUserUsernamesForRole
} from '../../api/mockData';

const ManageUser = ({ onPageChange }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    userLevel: ''
  });
  const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Disable User state
  const [disableUserAction, setDisableUserAction] = useState(null); // 'enable' or 'disable'
  const [disableUserRole, setDisableUserRole] = useState('');
  const [showDisableUserRoleDropdown, setShowDisableUserRoleDropdown] = useState(false);
  const [disableUserUsername, setDisableUserUsername] = useState('');
  const [showDisableUserUsernameDropdown, setShowDisableUserUsernameDropdown] = useState(false);
  const [showDisableUserSuccess, setShowDisableUserSuccess] = useState(false);

  // Define state for data from mockData
  const [categoriesData, setCategoriesData] = useState([]);
  const [userRoles, setUserRoles] = useState(['--Select User Level--']);
  const [roleDefaults, setRoleDefaults] = useState({});

  // Load data from mockData
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, rolesRes, roleDefaultsRes] = await Promise.all([
          fetchManageUserCategories(),
          fetchManageUserRoles(),
          fetchManageUserRoleDefaults()
        ]);
        
        if (categoriesRes.success) {
          setCategoriesData(categoriesRes.data);
        }
        if (rolesRes.success) {
          setUserRoles(rolesRes.data);
        }
        if (roleDefaultsRes.success) {
          setRoleDefaults(roleDefaultsRes.data);
        }
      } catch (error) {
        console.error('Error loading manage user data:', error);
      }
    };
    
    loadData();
  }, []);

  // Initialize checkbox states - flatten everything
  const getInitialCheckboxStates = () => {
    const states = {};
    categoriesData.forEach(cat => {
      states[cat.id] = false;
    });
    return states;
  };

  const getInitialSubCheckboxStates = () => {
    const states = {};
    
    const processCategory = (category) => {
      states[category.id] = {};
      
      if (category.hasSubcategories && category.subcategories) {
        category.subcategories.forEach(sub => {
          if (sub.hasSubcategories) {
            // This sub has children
            states[category.id][sub.name] = {};
            if (sub.subcategories) {
              sub.subcategories.forEach(subsub => {
                states[category.id][sub.name][subsub] = false;
              });
            }
          } else if (sub.name) {
            // This is a simple subcategory without children
            states[category.id][sub.name] = false;
          } else {
            // This is a flat sub
            if (Array.isArray(sub)) {
              sub.forEach(subName => {
                states[category.id][subName] = false;
              });
            }
          }
        });
      } else if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach(sub => {
          if (typeof sub === 'string') {
            states[category.id][sub] = false;
          }
        });
      }
    };
    
    categoriesData.forEach(cat => processCategory(cat));
    return states;
  };

  const [checkboxStates, setCheckboxStates] = useState({});
  const [subCheckboxStates, setSubCheckboxStates] = useState({});

  // Initialize states when categoriesData loads
  useEffect(() => {
    if (categoriesData.length > 0) {
      setCheckboxStates(getInitialCheckboxStates());
      setSubCheckboxStates(getInitialSubCheckboxStates());
    }
  }, [categoriesData]);

  // Auto-update parent checkbox when all subcategories change
  useEffect(() => {
    setCheckboxStates(prev => {
      const newCheckboxStates = { ...prev };
      
      categoriesData.forEach(category => {
        if (category.hasSubcategories && subCheckboxStates[category.id]) {
          // Check if all subcategories are checked
          const allSubsChecked = Object.keys(subCheckboxStates[category.id]).every(key => {
            const subValue = subCheckboxStates[category.id][key];
            if (typeof subValue === 'object' && subValue !== null) {
              // Nested subcategory - check if all children are checked
              return Object.values(subValue).every(v => v);
            } else {
              // Simple subcategory
              return subValue === true;
            }
          });
          
          newCheckboxStates[category.id] = allSubsChecked;
        }
      });
      
      return newCheckboxStates;
    });
  }, [subCheckboxStates, categoriesData]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleDropdown(false);
    
    if (role && role !== '--Select User Level--' && roleDefaults[role]) {
      const roleDefault = roleDefaults[role];
      
      // Set main checkbox states
      const mainStates = {};
      categoriesData.forEach(cat => {
        mainStates[cat.id] = roleDefault[cat.id] || false;
      });
      setCheckboxStates(mainStates);
      
      // Set subcategory states
      const newSubStates = getInitialSubCheckboxStates();
      Object.keys(newSubStates).forEach(catId => {
        Object.keys(newSubStates[catId]).forEach(subKey => {
          if (typeof newSubStates[catId][subKey] === 'object' && newSubStates[catId][subKey] !== null) {
            // Nested subcategory
            Object.keys(newSubStates[catId][subKey]).forEach(deepKey => {
              newSubStates[catId][subKey][deepKey] = roleDefault[deepKey] || false;
            });
    } else {
            // Simple subcategory
            newSubStates[catId][subKey] = roleDefault[subKey] || false;
          }
        });
      });
      setSubCheckboxStates(newSubStates);
    } else {
      setCheckboxStates(getInitialCheckboxStates());
      setSubCheckboxStates(getInitialSubCheckboxStates());
    }
  };

  const handleCheckboxChange = (checkboxId) => {
    const newValue = !checkboxStates[checkboxId];
    
    setCheckboxStates(prev => ({
      ...prev,
      [checkboxId]: newValue
    }));
    
    // Update all subcategories recursively
    const updateSubStates = (categoryId) => {
      if (subCheckboxStates[categoryId]) {
        const updated = {};
        Object.keys(subCheckboxStates[categoryId]).forEach(key => {
          if (typeof subCheckboxStates[categoryId][key] === 'object' && subCheckboxStates[categoryId][key] !== null) {
            updated[key] = {};
            Object.keys(subCheckboxStates[categoryId][key]).forEach(subkey => {
              updated[key][subkey] = newValue;
            });
          } else {
            updated[key] = newValue;
          }
        });
        return updated;
      }
      return subCheckboxStates[categoryId];
    };
    
    setSubCheckboxStates(prev => ({
      ...prev,
      [checkboxId]: updateSubStates(checkboxId)
    }));
  };

  const handleSubCheckboxChange = (parentId, subName) => {
    // Check if this subcategory has nested children
    const currentSubState = subCheckboxStates[parentId]?.[subName];
    const hasNestedChildren = typeof currentSubState === 'object' && currentSubState !== null;
    
    if (hasNestedChildren) {
      // This is a parent subcategory with children - toggle all children
      const allChecked = Object.values(currentSubState).every(v => v);
      const newValue = !allChecked;
      
      setSubCheckboxStates(prev => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          [subName]: Object.keys(currentSubState).reduce((acc, key) => {
            acc[key] = newValue;
            return acc;
          }, {})
        }
      }));
    } else {
      // Simple subcategory without children
      setSubCheckboxStates(prev => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          [subName]: !prev[parentId][subName]
        }
      }));
    }
  };

  const handleDeepSubCheckboxChange = (parentId, subName, deepSubName) => {
    setSubCheckboxStates(prev => ({
      ...prev,
      [parentId]: {
        ...prev[parentId],
        [subName]: {
          ...prev[parentId][subName],
          [deepSubName]: !prev[parentId][subName][deepSubName]
        }
      }
    }));
  };

  const handleSaveAccessRights = () => {
    console.log('Access rights saved for role:', selectedRole, checkboxStates, subCheckboxStates);
    alert('Access rights saved successfully!');
  };

  const handleFilterClick = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filter);
    }
  };

  const handleAddUserInputChange = (field, value) => {
    setAddUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!addUserForm.userName || !addUserForm.password || !addUserForm.confirmPassword || !addUserForm.userLevel) {
      alert('Please fill in all fields');
      return;
    }
    if (addUserForm.password !== addUserForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Add user to the system
    console.log('Adding user:', addUserForm);
    // Reset form
    setAddUserForm({
      userName: '',
      password: '',
      confirmPassword: '',
      userLevel: ''
    });
    // Show success message
    setShowSuccessMessage(true);
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleDisableUserSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!disableUserAction || !disableUserRole || !disableUserUsername) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: Enable/Disable user in the system
    console.log('User action:', disableUserAction, disableUserRole, disableUserUsername);
    // Reset form
    setDisableUserAction(null);
    setDisableUserRole('');
    setDisableUserUsername('');
    // Show success message
    setShowDisableUserSuccess(true);
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowDisableUserSuccess(false);
    }, 3000);
  };


  const getHeaderTitle = () => {
    switch (selectedFilter) {
      case 'accessRoles':
        return 'Access Roles';
      case 'addUser':
        return 'Add User';
      case 'disableUser':
        return 'Manage Action';
      default:
        return 'User Management';
    }
  };

  const renderSubcategories = (category) => {
    if (!category.hasSubcategories || !category.subcategories || category.subcategories.length === 0) {
      return null;
    }

    return (
      <div className="bg-gray-50 pl-6 pr-3 pb-2 space-y-0">
        {category.subcategories.map((sub) => {
          if (sub.hasSubcategories) {
            // Nested subcategory with children
            return (
              <div key={sub.name} className="border-b border-gray-200">
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id={`checkbox-${category.id}-${sub.name}`}
                    checked={subCheckboxStates[category.id]?.[sub.name] ? 
                      (typeof subCheckboxStates[category.id][sub.name] === 'object' ? 
                        Object.values(subCheckboxStates[category.id][sub.name]).every(v => v) : 
                        subCheckboxStates[category.id][sub.name]) : false}
                    onChange={() => handleSubCheckboxChange(category.id, sub.name)}
                    className="w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor={`checkbox-${category.id}-${sub.name}`} className="text-gray-700 font-medium cursor-pointer select-none text-xs flex-1">
                    {sub.name}
                  </label>
                </div>
                {/* Render children of nested sub */}
                {sub.subcategories && (
                  <div className="pl-6 pr-3 pb-2 space-y-0">
                    {sub.subcategories.map((deepSub) => (
                      <div key={deepSub} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id={`checkbox-${category.id}-${sub.name}-${deepSub}`}
                          checked={subCheckboxStates[category.id]?.[sub.name]?.[deepSub] || false}
                          onChange={() => handleDeepSubCheckboxChange(category.id, sub.name, deepSub)}
                          className="w-3 h-3 cursor-pointer"
                        />
                        <label htmlFor={`checkbox-${category.id}-${sub.name}-${deepSub}`} className="text-gray-600 cursor-pointer select-none text-xs flex-1">
                          {deepSub}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Simple subcategory without children - still render it
            return (
              <div key={sub.name} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id={`checkbox-${category.id}-${sub.name}`}
                  checked={subCheckboxStates[category.id]?.[sub.name] || false}
                  onChange={() => handleSubCheckboxChange(category.id, sub.name)}
                  className="w-3.5 h-3.5 cursor-pointer"
                />
                <label htmlFor={`checkbox-${category.id}-${sub.name}`} className="text-gray-700 cursor-pointer select-none text-xs flex-1">
                  {sub.name}
                </label>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // Organize into columns
  const getCategoriesByColumn = () => {
    return [
      [categoriesData[0], categoriesData[1], categoriesData[8], categoriesData[9], categoriesData[11]], // Manage, New Booking, Payment Received, Payment Status, Loan
      [categoriesData[12], categoriesData[13], categoriesData[10], categoriesData[17], categoriesData[2], categoriesData[5], categoriesData[6], categoriesData[7], categoriesData[18]], // Flats Status, Flats Summary, Flats Verification, Flat Customization, Block Inventory, Booked Flats, Blocked Flats, Cancelled Flats, Handover Activities
      [categoriesData[3], categoriesData[4], categoriesData[14], categoriesData[15], categoriesData[16], categoriesData[20]], // Customer, Channel Partners, Project Snapshot, Set Reminder, Construction Updates, Reports
      [categoriesData[19]] // Documents Section
    ];
  };

  const categoriesByColumn = getCategoriesByColumn();

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row h-full bg-white overflow-hidden w-full shadow-sm lg:shadow-md border lg:border-gray-200" style={{ borderRadius: 'clamp(1rem, 1.5rem, 2rem)' }}>
        {/* LEFT SECTION — FILTERS */}
        <div className="w-full lg:w-[70%] min-w-0 flex flex-col max-h-[50%] lg:max-h-none">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Manage User</h2>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 items-center mb-[0.75rem]" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
              {['accessRoles', 'addUser', 'disableUser'].map((filter) => {
                const filterLabels = {
                  accessRoles: 'Access Roles',
                  addUser: 'Add User',
                  disableUser: 'Activation'
                };

                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 w-full ${
                      selectedFilter === filter ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    style={{ height: 'clamp(2.25rem, 2.5rem, 2.75rem)', paddingLeft: 'clamp(0.875rem, 1rem, 1.25rem)', paddingRight: 'clamp(0.875rem, 1rem, 1.25rem)', fontSize: 'clamp(0.75rem, 0.875rem, 1rem)', whiteSpace: 'nowrap' }}
                  >
                    <span>{filterLabels[filter]}</span>
                    <HiChevronRight className={`transition-transform ${selectedFilter === filter ? 'rotate-90' : ''}`} style={{ width: 'clamp(0.875rem, 1rem, 1.25rem)', height: 'clamp(0.875rem, 1rem, 1.25rem)', marginLeft: 'auto' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — CONTENT */}
        <div className="w-full lg:w-[80%] min-w-0 bg-[#F3F3F3FE] border-t lg:border-t-0 lg:border-l border-gray-300 flex flex-col flex-1 lg:flex-none overflow-hidden">
          <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
            <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>{getHeaderTitle()}</h2>
            
            {/* Dropdown for User Level */}
            {selectedFilter === 'accessRoles' && (
              <div className="mt-3 mb-2">
                <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>Select User Level</label>
                <div className="relative w-full max-w-xs">
                  <button
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="w-full text-left bg-white border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${selectedRole ? 'text-gray-900' : 'text-gray-500'}`}>
                        {selectedRole || '--Select User Level--'}
                      </span>
                      <HiChevronDown className={`text-gray-600 transition-transform duration-200 ${showRoleDropdown ? 'rotate-180' : ''}`} size={16} />
                    </div>
                  </button>
                  
                  {showRoleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
                      {userRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            selectedRole === role 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
            {!selectedFilter && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Please select an option from the left to manage users</p>
                </div>
              </div>
            )}
            
            {selectedFilter === 'accessRoles' && (
              <div className="w-full max-w-7xl mx-auto pt-2">
                {selectedRole && selectedRole !== '--Select User Level--' && (
                  <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900">Access Rights Configuration</h3>
                      <p className="text-xs text-gray-600 mt-0.5">Configure permissions for: <span className="font-medium">{selectedRole}</span></p>
                    </div>
                    
                    <div className="p-3">
                      <div className="grid grid-cols-4 gap-4">
                        {categoriesByColumn.map((columnCategories, columnIndex) => (
                          <div key={columnIndex} className="space-y-0">
                            {columnCategories.map((category) => (
                              <div key={category.id}>
                                {/* Main Checkbox */}
                                <div className="flex items-center gap-2 p-2 transition-colors">
                            <input
                              type="checkbox"
                                    id={`checkbox-${category.id}`}
                                    checked={checkboxStates[category.id] || false}
                                    onChange={() => handleCheckboxChange(category.id)}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <label htmlFor={`checkbox-${category.id}`} className="text-gray-900 font-medium cursor-pointer select-none text-sm flex-1">
                                    {category.name}
                            </label>
                                </div>
                                
                                {/* Subcategories - wrapped in background */}
                                {renderSubcategories(category)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Save Button */}
                      <div className="mt-4 flex justify-end border-t border-gray-200 pt-3">
                        <button
                          onClick={handleSaveAccessRights}
                          className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                        >
                          SAVE CHANGES
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedFilter === 'addUser' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <form onSubmit={handleAddUserSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  {/* User Name */}
                  <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                      User Name
                    </label>
                    <input
                      type="text"
                      value={addUserForm.userName}
                      onChange={(e) => handleAddUserInputChange('userName', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter user name"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={addUserForm.password}
                      onChange={(e) => handleAddUserInputChange('password', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={addUserForm.confirmPassword}
                      onChange={(e) => handleAddUserInputChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Confirm password"
                    />
                  </div>

                  {/* Select User Level */}
                  <div className="mb-6">
                    <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                      Select User Level
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAddUserDropdown(!showAddUserDropdown)}
                        className="w-full text-left bg-white border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${addUserForm.userLevel ? 'text-gray-900' : 'text-gray-500'}`}>
                            {addUserForm.userLevel || '--Select User Level--'}
                          </span>
                          <HiChevronDown className={`text-gray-600 transition-transform duration-200 ${showAddUserDropdown ? 'rotate-180' : ''}`} size={16} />
                        </div>
                      </button>
                      
                      {showAddUserDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
                          {userRoles.filter(role => role !== '--Select User Level--').map((role, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                handleAddUserInputChange('userLevel', role);
                                setShowAddUserDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                addUserForm.userLevel === role 
                                  ? 'bg-blue-50 text-blue-700 font-medium' 
                                  : 'hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Success Message */}
                  {showSuccessMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm">User added successfully!</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                    >
                      SUBMIT
                    </button>
                  </div>
                  </form>
                </div>
              </div>
            )}

            {selectedFilter === 'disableUser' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <form onSubmit={handleDisableUserSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    {/* Enable/Disable User Checkboxes */}
                    <div className="mb-6">
                      <label className="block text-gray-800 font-semibold mb-3" style={{ fontSize: '0.9rem' }}>
                        Select Action
                      </label>
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableUser"
                            checked={disableUserAction === 'enable'}
                            onChange={() => setDisableUserAction(disableUserAction === 'enable' ? null : 'enable')}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="enableUser" className="ml-2 text-gray-700 cursor-pointer">
                            Enable User
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="disableUserAction"
                            checked={disableUserAction === 'disable'}
                            onChange={() => {
                              if (disableUserAction !== 'disable') {
                                setDisableUserAction('disable');
                              } else {
                                setDisableUserAction(null);
                              }
                            }}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="disableUserAction" className="ml-2 text-gray-700 cursor-pointer">
                            Disable User
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Select User Level */}
                    {disableUserAction && (
                      <div className="mb-4">
                        <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                          Select User Level
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDisableUserRoleDropdown(!showDisableUserRoleDropdown)}
                            className="w-full text-left bg-white border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow"
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${disableUserRole ? 'text-gray-900' : 'text-gray-500'}`}>
                                {disableUserRole || '--Select User Level--'}
                              </span>
                              <HiChevronDown className={`text-gray-600 transition-transform duration-200 ${showDisableUserRoleDropdown ? 'rotate-180' : ''}`} size={16} />
                            </div>
                          </button>
                          
                          {showDisableUserRoleDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
                              {userRoles.filter(role => role !== '--Select User Level--').map((role, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setDisableUserRole(role);
                                    setShowDisableUserRoleDropdown(false);
                                    setDisableUserUsername(''); // Reset username when role changes
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                    disableUserRole === role 
                                      ? 'bg-blue-50 text-blue-700 font-medium' 
                                      : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Select Username */}
                    {disableUserAction && disableUserRole && (
                      <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2" style={{ fontSize: '0.9rem' }}>
                          Select Username
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDisableUserUsernameDropdown(!showDisableUserUsernameDropdown)}
                            className="w-full text-left bg-white border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow"
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${disableUserUsername ? 'text-gray-900' : 'text-gray-500'}`}>
                                {disableUserUsername || '--Select Username--'}
                              </span>
                              <HiChevronDown className={`text-gray-600 transition-transform duration-200 ${showDisableUserUsernameDropdown ? 'rotate-180' : ''}`} size={16} />
                            </div>
                          </button>
                          
                          {showDisableUserUsernameDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto">
                              {getManageUserUsernamesForRole(disableUserRole).map((username, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setDisableUserUsername(username);
                                    setShowDisableUserUsernameDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                    disableUserUsername === username 
                                      ? 'bg-blue-50 text-blue-700 font-medium' 
                                      : 'hover:bg-gray-50 text-gray-700'
                                  }`}
                                >
                                  {username}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {showDisableUserSuccess && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">User {disableUserAction === 'enable' ? 'enabled' : 'disabled'} successfully!</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    {disableUserAction && disableUserRole && disableUserUsername && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                        >
                          SUBMIT
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUser;
