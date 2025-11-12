import React, { useState, useEffect } from 'react';
import { HiHome, HiOfficeBuilding, HiCheckCircle, HiXCircle, HiExclamationCircle, HiCalendar, HiEye, HiClock, HiPencil, HiTrash } from 'react-icons/hi';

const Dashboard = ({ onPageChange }) => {
  // Status cards data
  const [statusCards, setStatusCards] = useState([
    {
      id: 'booked',
      title: 'Booked Flat',
      value: 230,
      color: 'bg-emerald-500',
      icon: 'check'
    },
    {
      id: 'cancelled',
      title: 'Cancelled Flat',
      value: 9,
      color: 'bg-red-500',
      icon: 'cancel'
    },
    {
      id: 'blocked',
      title: 'Blocked Flat',
      value: 1,
      color: 'bg-amber-500',
      icon: 'block'
    }
  ]);

  // Payment reminder states
  const [activeReminderTab, setActiveReminderTab] = useState('today');
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    remarks: ''
  });
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Give Money',
      date: '2025-10-29',
      amount: '$70',
      status: 'today',
      type: 'payment'
    },
    {
      id: 2,
      title: 'Monthly Maintenance',
      date: '2025-10-30',
      amount: '$500',
      status: 'future',
      type: 'maintenance'
    },
    {
      id: 3,
      title: 'Property Tax',
      date: '2025-10-25',
      amount: '$1200',
      status: 'unseen',
      type: 'tax'
    }
  ]);

  // Handle card click
  const handleCardClick = (cardId) => {
    console.log(`Clicked on ${cardId} card`);
    // You can add navigation or other functionality here
    switch (cardId) {
      case 'booked':
        // Navigate to booked flats page or show details
        break;
      case 'cancelled':
        // Navigate to cancelled flats page or show details
        break;
      case 'blocked':
        // Navigate to blocked flats page or show details
        break;
      default:
        break;
    }
  };

  // Handle reminder actions
  const handleReschedule = (reminderId) => {
    const reminder = reminders.find(r => r.id === reminderId);
    setSelectedReminder(reminder);
    setRescheduleData({
      newDate: reminder?.date || '',
      remarks: reminder?.title || ''
    });
    setShowReschedulePopup(true);
  };

  const handleDismiss = (reminderId) => {
    console.log(`Dismiss reminder ${reminderId}`);
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const handleRescheduleSubmit = () => {
    if (selectedReminder && rescheduleData.newDate) {
      // Update the reminder with new date and remarks
      setReminders(prev => prev.map(reminder => 
        reminder.id === selectedReminder.id 
          ? { 
              ...reminder, 
              date: rescheduleData.newDate,
              title: rescheduleData.remarks || reminder.title
            }
          : reminder
      ));
      setShowReschedulePopup(false);
      setSelectedReminder(null);
      setRescheduleData({ newDate: '', remarks: '' });
    }
  };

  const handleCloseReschedulePopup = () => {
    setShowReschedulePopup(false);
    setSelectedReminder(null);
    setRescheduleData({ newDate: '', remarks: '' });
  };

  const handleRescheduleInputChange = (field, value) => {
    setRescheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter reminders based on active tab
  const filteredReminders = reminders.filter(reminder => reminder.status === activeReminderTab);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReschedulePopup && event.target.classList.contains('bg-black')) {
        handleCloseReschedulePopup();
      }
    };

    if (showReschedulePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReschedulePopup]);

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Desktop: Show both sections side by side with gap */}
      <div className="hidden lg:flex h-full" style={{ gap: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <div className="basis-[60%] min-w-0 bg-white shadow-sm border border-gray-200" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', maxHeight: '100%', overflow: 'hidden' }}>
          {/* LEFT SECTION — DASHBOARD OVERVIEW */}
          <div className="w-full min-w-0 flex flex-col h-full">
            <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)' }}>Dashboard Overview</h2>
                <span className="text-xs sm:text-sm font-semibold text-orange-600 whitespace-nowrap">Role: builder_admin</span>
              </div>
            </div>
            
            {/* Status Cards */}
            <div className="flex-shrink-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
              <div className="bg-white overflow-hidden">
                {/* Top horizontal line */}
                <div className="border-b border-gray-200"></div>
                
                {/* Status Cards Container */}
                <div className="flex">
                  {statusCards.map((card, index) => (
                    <React.Fragment key={card.id}>
                      <button
                        onClick={() => handleCardClick(card.id)}
                        className="flex-1 p-4 hover:bg-gray-50 transition-colors duration-200 flex items-center group relative"
                        style={{ minHeight: 'clamp(4rem, 5rem, 6rem)' }}
                      >
                        {/* Icon - Left Side */}
                        <div className="flex items-center justify-center mr-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:opacity-80 transition-all duration-200 ${
                            card.icon === 'check' 
                              ? 'bg-green-100' 
                              : card.icon === 'cancel' 
                              ? 'bg-red-100' 
                              : 'bg-amber-100'
                          }`}>
                            {card.icon === 'check' ? (
                              <HiCheckCircle 
                                className="text-green-600 group-hover:text-green-700 transition-colors duration-200" 
                                style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }}
                              />
                            ) : card.icon === 'cancel' ? (
                              <HiXCircle 
                                className="text-red-600 group-hover:text-red-700 transition-colors duration-200" 
                                style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }}
                              />
                            ) : (
                              <HiExclamationCircle 
                                className="text-amber-600 group-hover:text-amber-700 transition-colors duration-200" 
                                style={{ width: 'clamp(1.5rem, 1.75rem, 2rem)', height: 'clamp(1.5rem, 1.75rem, 2rem)' }}
                              />
                            )}
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
                      </button>
                      
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
            
            {/* Graph Section */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* First Graph */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex items-center justify-center" style={{ height: 'clamp(18rem, 24rem, 32rem)' }}>
                  <img 
                    src="/src/assets/1.png" 
                    alt="Graph 1" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Second Graph */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex items-center justify-center" style={{ height: 'clamp(18rem, 24rem, 32rem)' }}>
                  <img 
                    src="/src/assets/2.png" 
                    alt="Graph 2" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="basis-[40%] min-w-0 bg-white shadow-sm border border-gray-200" style={{ borderRadius: 'clamp(0.75rem, 1rem, 1.25rem)', maxHeight: '100%', overflow: 'hidden' }}>
          {/* RIGHT SECTION — PAYMENT REMINDER */}
          <div className="w-full min-w-0 bg-[#F3F3F3FE] flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
              <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>Payment Reminder</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-shrink-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
              <div className="flex bg-gray-100 rounded-lg p-0.5" style={{ gap: 'clamp(0.125rem, 0.25rem, 0.5rem)' }}>
                {[
                  { key: 'today', label: 'Today', icon: HiCalendar, count: reminders.filter(r => r.status === 'today').length },
                  { key: 'unseen', label: 'Unseen', icon: HiEye, count: reminders.filter(r => r.status === 'unseen').length },
                  { key: 'future', label: 'Future', icon: HiClock, count: reminders.filter(r => r.status === 'future').length }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveReminderTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-300 relative ${
                        activeReminderTab === tab.key
                          ? 'bg-white text-gray-800 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                      style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
                    >
                      <Icon style={{ width: 'clamp(0.75rem, 0.875rem, 1rem)', height: 'clamp(0.75rem, 0.875rem, 1rem)' }} />
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                          activeReminderTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reminder Banner */}
            <div className="flex-shrink-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(0.75rem, 1rem, 1.25rem)' }}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 w-fit">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <h3 className="font-medium text-gray-700" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                    {activeReminderTab.charAt(0).toUpperCase() + activeReminderTab.slice(1)} Reminders
                  </h3>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Reminders List */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingLeft: 'clamp(1rem, 1.5rem, 2rem)', paddingRight: 'clamp(1rem, 1.5rem, 2rem)', paddingBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
              {filteredReminders.length > 0 ? (
                <div className="space-y-2">
                  {filteredReminders.map((reminder) => (
                    <div key={reminder.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                      {/* Compact Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                              {reminder.amount}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-medium" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                              {reminder.date}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Compact Content */}
                      <div className="px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
                              {reminder.title}
                            </h4>
                            <p className="text-gray-500 text-xs">
                              {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Payment
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReschedule(reminder.id)}
                              className="flex items-center gap-1 bg-blue-600 text-white py-1.5 px-3 rounded-md font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-sm"
                              style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
                            >
                              <HiPencil className="w-3 h-3" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleDismiss(reminder.id)}
                              className="flex items-center gap-1 bg-red-600 text-white py-1.5 px-3 rounded-md font-medium hover:bg-red-700 transition-all duration-300 hover:shadow-sm"
                              style={{ fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}
                            >
                              <HiTrash className="w-3 h-3" />
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <HiCalendar className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium" style={{ fontSize: 'clamp(0.75rem, 0.875rem, 1rem)' }}>
                    No reminders for {activeReminderTab}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    All caught up! 🎉
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Show message to select sub-item */}
      <div className="lg:hidden h-full flex items-center justify-center">
        <div className="text-center text-gray-500 p-8">
          <p className="text-lg font-medium mb-2">Dashboard</p>
          <p className="text-sm">Please view on desktop for the full dashboard experience</p>
        </div>
      </div>

      {/* Reschedule Popup */}
      {showReschedulePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Reschedule Reminder</h3>
            </div>
            
            {/* Form */}
            <div className="px-6 py-4 space-y-4">
              {/* New Date Field */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 w-32">Enter New Date:</label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => handleRescheduleInputChange('newDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Remarks Field */}
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 mt-2">Remarks:</label>
                <textarea
                  value={rescheduleData.remarks}
                  onChange={(e) => handleRescheduleInputChange('remarks', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter remarks..."
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <button
                onClick={handleRescheduleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
