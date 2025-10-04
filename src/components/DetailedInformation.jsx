import React, { useState, useEffect } from 'react';
import { HiUser, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import circleIcon from '../assets/circle.png';
import userIcon from '../assets/user.png';
import user2Icon from '../assets/user 2.png';
import calIcon from '../assets/cal.png';
import addressIcon from '../assets/address.png';
import { fetchDetailedInformation } from '../api/mockData';

const DetailedInformation = () => {
  const [detailInfoLoaded, setDetailInfoLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    // Fetch detailed information data
    const getDetailedInformation = async () => {
      try {
        setLoading(true);
        const response = await fetchDetailedInformation();
        if (response.success) {
          setDetailData(response.data);
        }
      } catch (error) {
        console.error('Error fetching detailed information:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setDetailInfoLoaded(true);
        }, 200);
      }
    };

    getDetailedInformation();
  }, []);

  // Loading state
  if (loading || !detailData) {
    return (
      <div
        className="bg-white shadow-sm border border-gray-200 h-full flex items-center justify-center"
        style={{ borderRadius: '1.75rem' }}
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading information...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white shadow-sm border border-gray-200 h-full hover-lift section-animate"
      style={{ borderRadius: '1.75rem' }}
    >
      <div className="h-full flex flex-col p-[1rem] sm:p-[1.25rem] lg:p-[1.5rem]">
        {/* Header Section */}
        <div className="mb-[1rem] sm:mb-[1.25rem] lg:mb-[1.5rem]">
          <h3 className="text-[1rem] sm:text-[1.125rem] font-bold text-gray-800">
            Detailed Information
          </h3>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-h-0 space-y-2 sm:space-y-2 lg:space-y-[0.625rem] overflow-y-auto">
          {/* Full Name */}
          <div
            className="p-[0.75rem] sm:p-[1rem] rounded-[0.9375rem] border border-[rgba(240,220,211,0.5)] h-[4rem] sm:h-[4.375rem] lg:h-[4.75rem] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={circleIcon}
                  alt="Circle"
                  className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
                />
                <div>
                  <div className="text-gray-600 mb-1 text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] font-montserrat">
                    Full Name
                  </div>
                  <div className="font-medium text-gray-800 text-[0.875rem] sm:text-[1rem] lg:text-[1.1875rem]">
                    {detailData.fullName}
                  </div>
                </div>
              </div>
              <img
                src={userIcon}
                alt="User"
                className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
              />
            </div>
          </div>

          {/* Father / Husband Name */}
          <div
            className="p-[0.75rem] sm:p-[1rem] rounded-[0.9375rem] border border-[rgba(240,220,211,0.5)] h-[4rem] sm:h-[4.375rem] lg:h-[4.75rem] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={circleIcon}
                  alt="Circle"
                  className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
                />
                <div>
                  <div className="text-gray-600 mb-1 text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] font-montserrat">
                    Father / Husband Name
                  </div>
                  <div className="font-medium text-gray-800 text-[0.875rem] sm:text-[1rem] lg:text-[1.1875rem]">
                    {detailData.fatherHusbandName}
                  </div>
                </div>
              </div>
              <img
                src={user2Icon}
                alt="User"
                className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
              />
            </div>
          </div>

          {/* PAN No. */}
          <div
            className="p-[0.75rem] sm:p-[1rem] rounded-[0.9375rem] border border-[rgba(240,220,211,0.5)] h-[4rem] sm:h-[4.375rem] lg:h-[4.75rem] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={circleIcon}
                  alt="Circle"
                  className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
                />
                <div>
                  <div className="text-gray-600 mb-1 text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] font-montserrat">
                    PAN No.
                  </div>
                  <div className="font-medium text-gray-800 text-[0.875rem] sm:text-[1rem] lg:text-[1.1875rem]">
                    {detailData.panNo}
                  </div>
                </div>
              </div>
              <img
                src={userIcon}
                alt="User2"
                className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
              />
            </div>
          </div>

          {/* DOB */}
          <div
            className="p-[0.75rem] sm:p-[1rem] rounded-[0.9375rem] border border-[rgba(240,220,211,0.5)] h-[4rem] sm:h-[4.375rem] lg:h-[4.75rem] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={circleIcon}
                  alt="Circle"
                  className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
                />
                <div>
                  <div className="text-gray-600 mb-1 text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] font-montserrat">
                    DOB
                  </div>
                  <div className="font-medium text-gray-800 text-[0.875rem] sm:text-[1rem] lg:text-[1.1875rem]">
                    {detailData.dob}
                  </div>
                </div>
              </div>
              <img
                src={calIcon}
                alt="Calendar"
                className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
              />
            </div>
          </div>

          {/* Address */}
          <div
            className="p-[0.75rem] sm:p-[1rem] rounded-[0.9375rem] border border-[rgba(240,220,211,0.5)] h-[4rem] sm:h-[4.375rem] lg:h-[4.75rem] flex items-center"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={circleIcon}
                  alt="Circle"
                  className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
                />
                <div>
                  <div className="text-gray-600 mb-1 text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] font-montserrat">
                    Address
                  </div>
                  <div className="font-medium text-gray-800 text-[0.875rem] sm:text-[1rem] lg:text-[1.1875rem]">
                    {detailData.address}
                  </div>
                </div>
              </div>
              <img
                src={addressIcon}
                alt="Address"
                className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] lg:w-[2.17375rem] lg:h-[2.17375rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedInformation;