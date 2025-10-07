import React, { useState, useEffect } from 'react';
import { HiX, HiSearch, HiSortDescending, HiDocumentText } from 'react-icons/hi';
import { fetchMyDocuments } from '../../api/mockData';

const MyDocumentsPopup = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [myDocuments, setMyDocuments] = useState([]);
  const [sortBy, setSortBy] = useState('Select');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleDocuments, setVisibleDocuments] = useState(0);

  // Fetch documents when modal opens
  useEffect(() => {
    if (isOpen) {
      const getMyDocuments = async () => {
        try {
          setLoading(true);
          const response = await fetchMyDocuments();
          if (response.success) {
            setMyDocuments(response.data);
          }
        } catch (error) {
          console.error('Error fetching my documents:', error);
        } finally {
          setLoading(false);
        }
      };

      getMyDocuments();
    } else {
      // Reset when popup closes
      setIsLoaded(false);
      setVisibleDocuments(0);
    }
  }, [isOpen]);

  // Animation effect after data is loaded
  useEffect(() => {
    if (!loading && myDocuments.length > 0 && isOpen) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        // Animate documents one by one
        const docTimer = setInterval(() => {
          setVisibleDocuments(prev => {
            if (prev < myDocuments.length) {
              return prev + 1;
            } else {
              clearInterval(docTimer);
              return prev;
            }
          });
        }, 80);
        return () => clearInterval(docTimer);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, myDocuments.length, isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-up p-[0.5rem] sm:p-[1rem]">
      <div className="bg-[#E8F3EB] rounded-[1rem] shadow-2xl p-[1rem] sm:p-[1.5rem] lg:p-[2rem] w-full max-w-[56rem] mx-[0.5rem] sm:mx-[1rem] max-h-[90vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-[1rem] sm:mb-[1.5rem]">
          <div className="flex items-center space-x-[0.5rem] sm:space-x-[0.75rem]">
            <div className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] bg-blue-100 rounded-full flex items-center justify-center">
              <HiDocumentText className="w-[1rem] h-[1rem] sm:w-[1.25rem] sm:h-[1.25rem] text-blue-600" />
            </div>
            <h2 className="text-[1.125rem] sm:text-[1.25rem] font-bold text-gray-800">My Documents</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-[2rem] h-[2rem] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <HiX className="w-[1.25rem] h-[1.25rem] text-gray-500" />
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col space-y-[0.75rem] sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-[1rem] sm:mb-[1.5rem] animate-fade-in-right">
          <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-[0.5rem] xs:space-y-0 xs:space-x-[1rem] sm:space-x-[1.5rem]">
            <div className="flex items-center space-x-[0.5rem] sm:space-x-[0.75rem]">
              <span className="text-[0.75rem] sm:text-[0.875rem] font-medium text-gray-700">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-[0.75rem] sm:text-[0.875rem] border border-gray-300 rounded-lg px-[0.5rem] sm:px-[1rem] py-[0.375rem] sm:py-[0.625rem] pr-[2rem] sm:pr-[2.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none bg-white min-w-[6.25rem] sm:min-w-[7.5rem] hover-lift btn-animate"
                >
                  <option value="Select">Select</option>
                  <option value="Date">Date</option>
                  <option value="Name">Name</option>
                  <option value="Type">Type</option>
                </select>
                <HiSortDescending className="w-[0.75rem] h-[0.75rem] sm:w-[1rem] sm:h-[1rem] text-gray-500 absolute right-[0.5rem] sm:right-[0.75rem] top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-[2rem] sm:pl-[2.5rem] pr-[0.5rem] sm:pr-[1rem] py-[0.375rem] sm:py-[0.625rem] text-[0.75rem] sm:text-[0.875rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[9.375rem] sm:min-w-[12.5rem] hover-lift btn-animate"
              />
              <HiSearch className="w-[0.75rem] h-[0.75rem] sm:w-[1rem] sm:h-[1rem] text-gray-400 absolute left-[0.5rem] sm:left-[0.75rem] top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-y-auto max-h-[calc(90vh-12.5rem)] sm:max-h-[calc(90vh-15.625rem)] pr-[0.25rem] sm:pr-[0.5rem]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : myDocuments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No documents available.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full sm:min-w-full">
                <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                  <tr className="border-b-[0.125rem] border-gray-200">
                    <th className="text-left py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] font-bold text-gray-800 text-[0.75rem] sm:text-[0.875rem]">S. No.</th>
                    <th className="text-left py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] font-bold text-gray-800 text-[0.75rem] sm:text-[0.875rem]">Document Name</th>
                    <th className="text-left py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] font-bold text-gray-800 text-[0.75rem] sm:text-[0.875rem]">Type</th>
                    <th className="text-left py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] font-bold text-gray-800 text-[0.75rem] sm:text-[0.875rem]">Date</th>
                    <th className="text-center py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] font-bold text-gray-800 text-[0.75rem] sm:text-[0.875rem]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myDocuments.map((doc, index) => (
                  <tr 
                    key={doc.id} 
                    className={`border-b border-gray-100 hover:bg-opacity-80 transition-colors hover-lift smooth-transition ${
                      index < visibleDocuments ? 'table-row-enter' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <td className="py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] text-gray-900 text-[0.75rem] sm:text-[0.875rem] leading-relaxed">
                      {index + 1}
                    </td>
                    <td className="py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] text-gray-800 text-[0.75rem] sm:text-[0.875rem] font-medium leading-relaxed truncate max-w-[7.5rem] sm:max-w-[12.5rem] lg:max-w-none">
                      {doc.fileName}
                    </td>
                    <td className="py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] text-gray-600 text-[0.75rem] sm:text-[0.875rem]">
                      <span className="px-[0.375rem] sm:px-[0.5rem] py-[0.125rem] sm:py-[0.25rem] bg-blue-100 text-blue-800 rounded-full text-[0.75rem]">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] text-gray-600 text-[0.75rem] sm:text-[0.875rem]">
                      {doc.date}
                    </td>
                    <td className="py-[0.5rem] sm:py-[0.75rem] lg:py-[1rem] px-[0.5rem] sm:px-[1rem] lg:px-[1.5rem] text-center">
                      <div className="w-[1.5rem] h-[1.75rem] sm:w-[2rem] sm:h-[2.5rem] bg-blue-500 rounded flex items-center justify-center text-white text-[0.75rem] font-bold relative hover-scale smooth-transition cursor-pointer mx-auto">
                        <span className="text-[0.75rem]">DOC</span>
                        <div className="absolute -bottom-[0.125rem] -right-[0.125rem] sm:-bottom-[0.25rem] sm:-right-[0.25rem] w-[0.75rem] h-[0.75rem] sm:w-[1rem] sm:h-[1rem] bg-white rounded-full flex items-center justify-center">
                          <HiDocumentText className="w-[0.375rem] h-[0.375rem] sm:w-[0.5rem] sm:h-[0.5rem] text-blue-500" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-[1rem] sm:mt-[1.5rem] pt-[0.75rem] sm:pt-[1rem] border-t border-gray-200">
          <div className="text-[0.75rem] sm:text-[0.875rem] text-gray-500 text-center">
            Total Documents: {myDocuments.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDocumentsPopup;
