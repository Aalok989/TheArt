import React, { useState, useEffect } from 'react';
import { HiX, HiCalendar, HiLocationMarker, HiClock, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiEye } from 'react-icons/hi';
import { fetchConstructionUpdates } from '../api/mockData';

const ConstructionUpdatesPopup = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);

  // Fetch construction updates when modal opens
  useEffect(() => {
    if (isOpen) {
      const getConstructionUpdates = async () => {
        try {
          setLoading(true);
          const response = await fetchConstructionUpdates();
          if (response.success) {
            setUpdates(response.data);
          }
        } catch (error) {
          console.error('Error fetching construction updates:', error);
        } finally {
          setLoading(false);
        }
      };

      getConstructionUpdates();
    }
  }, [isOpen]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="w-[1.25rem] h-[1.25rem] text-green-500" />;
      case 'in-progress':
        return <HiClock className="w-[1.25rem] h-[1.25rem] text-blue-500" />;
      case 'scheduled':
        return <HiCalendar className="w-[1.25rem] h-[1.25rem] text-orange-500" />;
      default:
        return <HiInformationCircle className="w-[1.25rem] h-[1.25rem] text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-[#E8F3EB] rounded-[1rem] shadow-2xl p-[2rem] w-full max-w-[56rem] mx-[1rem] max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-[1.5rem]">
          <div className="flex items-center space-x-[0.75rem]">
            <div className="w-[2.5rem] h-[2.5rem] bg-orange-100 rounded-full flex items-center justify-center">
              <HiExclamationCircle className="w-[1.25rem] h-[1.25rem] text-orange-600" />
            </div>
            <h2 className="text-[1.25rem] font-bold text-gray-800">Construction Updates</h2>
          </div>
          <button
            onClick={onClose}
            className="w-[2rem] h-[2rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <HiX className="w-[1.25rem] h-[1.25rem] text-gray-500" />
          </button>
        </div>

        {/* Updates List */}
        <div className="overflow-y-auto max-h-[calc(90vh-7.5rem)] pr-[0.5rem]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="text-gray-600">Loading construction updates...</p>
              </div>
            </div>
          ) : updates.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No construction updates available.</p>
            </div>
          ) : (
            <div className="space-y-[1rem]">
              {updates.map((update, index) => (
              <div 
                key={update.id}
                className="bg-white rounded-xl p-[1.5rem] shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-[0.75rem]">
                  <div className="flex items-start space-x-[0.75rem]">
                    {getStatusIcon(update.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-[0.5rem]">
                        <h4 className="text-[0.875rem] font-medium text-blue-600 bg-blue-50 px-[0.75rem] py-[0.25rem] rounded-full">
                          {update.albumName}
                        </h4>
                        <div className="flex items-center space-x-[0.25rem] text-gray-500 text-[0.875rem]">
                          <HiEye className="w-[1rem] h-[1rem]" />
                          <span>{update.viewCount} views</span>
                        </div>
                      </div>
                      <h3 className="text-[1.125rem] font-semibold text-gray-800 mb-[0.5rem]">
                        {update.title}
                      </h3>
                      <p className="text-gray-600 text-[0.875rem] leading-relaxed">
                        {update.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-[1rem]">
                    {/* Date & Time */}
                    <div className="flex items-center space-x-[0.5rem] text-[0.875rem] text-gray-500">
                      <HiCalendar className="w-[1rem] h-[1rem]" />
                      <span>{update.date}</span>
                      <HiClock className="w-[1rem] h-[1rem] ml-[0.5rem]" />
                      <span>{update.time}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-[0.5rem] text-[0.875rem] text-gray-500">
                      <HiLocationMarker className="w-[1rem] h-[1rem]" />
                      <span>{update.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-[0.5rem]">
                    {/* Status Badge */}
                    <span className={`px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-medium ${getStatusColor(update.status)}`}>
                      {update.status.replace('-', ' ').toUpperCase()}
                    </span>

                    {/* Priority Badge */}
                    <span className={`px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-medium ${getPriorityColor(update.priority)}`}>
                      {update.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-[1.5rem] pt-[1rem] border-t border-gray-200">
          <div className="text-[0.875rem] text-gray-500 text-center">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstructionUpdatesPopup;