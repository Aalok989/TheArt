import React, { useState, useEffect } from 'react';
import { HiX, HiCalendar, HiLocationMarker, HiClock, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiEye, HiBell } from 'react-icons/hi';
import { customerAPI } from '../../api/api';

const ConstructionUpdatesPopup = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      const getNotifications = async () => {
        try {
          setLoading(true);
          const response = await customerAPI.getNotifications();
          // API returns array directly, no success wrapper
          if (Array.isArray(response)) {
            setUpdates(response);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      };

      getNotifications();
    }
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CONSTRUCTION_UPDATE':
        return <HiExclamationCircle className="w-[1.25rem] h-[1.25rem] text-orange-500" />;
      case 'PAYMENT_DUE':
        return <HiClock className="w-[1.25rem] h-[1.25rem] text-red-500" />;
      case 'GENERAL':
        return <HiBell className="w-[1.25rem] h-[1.25rem] text-blue-500" />;
      default:
        return <HiInformationCircle className="w-[1.25rem] h-[1.25rem] text-gray-500" />;
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'CONSTRUCTION_UPDATE':
        return 'bg-orange-100 text-orange-800';
      case 'PAYMENT_DUE':
        return 'bg-red-100 text-red-800';
      case 'GENERAL':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-[#E8F3EB] rounded-[1rem] shadow-2xl p-[2rem] w-full max-w-[56rem] mx-[1rem] max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-[1.5rem]">
          <div className="flex items-center space-x-[0.75rem]">
            <div className="w-[2.5rem] h-[2.5rem] bg-orange-100 rounded-full flex items-center justify-center">
              <HiBell className="w-[1.25rem] h-[1.25rem] text-orange-600" />
            </div>
            <h2 className="text-[1.25rem] font-bold text-gray-800">Notifications</h2>
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
                <p className="text-gray-600">Loading notifications...</p>
              </div>
            </div>
          ) : updates.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No notifications available.</p>
            </div>
          ) : (
            <div className="space-y-[1rem]">
              {updates.map((notification, index) => (
              <div 
                key={notification.id}
                className={`bg-white rounded-xl p-[1.5rem] shadow-sm border ${
                  notification.is_read ? 'border-gray-200' : 'border-orange-300 bg-orange-50'
                } hover:shadow-md transition-shadow duration-200 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-[0.75rem]">
                  {getNotificationIcon(notification.notification_type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-[0.5rem]">
                      <h3 className="text-[1.125rem] font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      {notification.is_important && (
                        <span className="px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-medium bg-red-100 text-red-800">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-[0.875rem] leading-relaxed mb-[0.75rem]">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-[0.5rem] text-[0.875rem] text-gray-500">
                        <HiClock className="w-[1rem] h-[1rem]" />
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-[0.5rem]">
                        {/* Notification Type Badge */}
                        <span className={`px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-medium ${getNotificationTypeColor(notification.notification_type)}`}>
                          {notification.notification_type.replace('_', ' ')}
                        </span>
                        
                        {/* Read/Unread Badge */}
                        {!notification.is_read && (
                          <span className="px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-medium bg-blue-100 text-blue-800">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
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
