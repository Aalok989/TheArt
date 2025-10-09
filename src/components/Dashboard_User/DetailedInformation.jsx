import React, { useState, useEffect } from 'react';
import { HiUser, HiCalendar, HiLocationMarker } from 'react-icons/hi';
import circleIcon from '../../assets/circle.png';
import userIcon from '../../assets/user.png';
import user2Icon from '../../assets/user 2.png';
import calIcon from '../../assets/cal.png';
import addressIcon from '../../assets/address.png';
import { fetchDetailedInformation } from '../../api/mockData';

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
      className="bg-white shadow-sm border border-gray-200 h-full hover-lift section-animate w-full"
      style={{ borderRadius: 'clamp(1.25rem, 1.75rem, 2rem)' }}
    >
      <div className="h-full flex flex-col" style={{ padding: 'clamp(0.875rem, 1.25rem, 1.5rem)' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 'clamp(0.875rem, 1.25rem, 1.5rem)' }}>
          <h3 className="font-bold text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.125rem)' }}>
            Detailed Information
          </h3>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-h-0 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.375rem, 0.5rem, 0.625rem)' }}>
          {/* Full Name */}
          <div
            className="border border-[rgba(240,220,211,0.5)] flex items-center"
            style={{ padding: 'clamp(0.625rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.75rem, 0.9375rem, 1.125rem)', height: 'clamp(3.5rem, 4.375rem, 5rem)' }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center" style={{ gap: 'clamp(0.625rem, 1rem, 1.25rem)' }}>
                <img
                  src={circleIcon}
                  alt="Circle"
                  style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
                />
                <div>
                  <div className="text-gray-600 font-montserrat" style={{ marginBottom: 'clamp(0.125rem, 0.25rem, 0.375rem)', fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                    Full Name
                  </div>
                  <div className="font-medium text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.1875rem)' }}>
                    {detailData.fullName}
                  </div>
                </div>
              </div>
              <img
                src={userIcon}
                alt="User"
                style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
              />
            </div>
          </div>

          {/* Father / Husband Name */}
          <div
            className="border border-[rgba(240,220,211,0.5)] flex items-center"
            style={{ padding: 'clamp(0.625rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.75rem, 0.9375rem, 1.125rem)', height: 'clamp(3.5rem, 4.375rem, 5rem)' }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center" style={{ gap: 'clamp(0.625rem, 1rem, 1.25rem)' }}>
                <img
                  src={circleIcon}
                  alt="Circle"
                  style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
                />
                <div>
                  <div className="text-gray-600 font-montserrat" style={{ marginBottom: 'clamp(0.125rem, 0.25rem, 0.375rem)', fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                    Father / Husband Name
                  </div>
                  <div className="font-medium text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.1875rem)' }}>
                    {detailData.fatherHusbandName}
                  </div>
                </div>
              </div>
              <img
                src={user2Icon}
                alt="User"
                style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
              />
            </div>
          </div>

          {/* PAN No. */}
          <div
            className="border border-[rgba(240,220,211,0.5)] flex items-center"
            style={{ padding: 'clamp(0.625rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.75rem, 0.9375rem, 1.125rem)', height: 'clamp(3.5rem, 4.375rem, 5rem)' }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center" style={{ gap: 'clamp(0.625rem, 1rem, 1.25rem)' }}>
                <img
                  src={circleIcon}
                  alt="Circle"
                  style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
                />
                <div>
                  <div className="text-gray-600 font-montserrat" style={{ marginBottom: 'clamp(0.125rem, 0.25rem, 0.375rem)', fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                    PAN No.
                  </div>
                  <div className="font-medium text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.1875rem)' }}>
                    {detailData.panNo}
                  </div>
                </div>
              </div>
              <img
                src={userIcon}
                alt="User2"
                style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
              />
            </div>
          </div>

          {/* DOB */}
          <div
            className="border border-[rgba(240,220,211,0.5)] flex items-center"
            style={{ padding: 'clamp(0.625rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.75rem, 0.9375rem, 1.125rem)', height: 'clamp(3.5rem, 4.375rem, 5rem)' }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center" style={{ gap: 'clamp(0.625rem, 1rem, 1.25rem)' }}>
                <img
                  src={circleIcon}
                  alt="Circle"
                  style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
                />
                <div>
                  <div className="text-gray-600 font-montserrat" style={{ marginBottom: 'clamp(0.125rem, 0.25rem, 0.375rem)', fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                    DOB
                  </div>
                  <div className="font-medium text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.1875rem)' }}>
                    {detailData.dob}
                  </div>
                </div>
              </div>
              <img
                src={calIcon}
                alt="Calendar"
                style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
              />
            </div>
          </div>

          {/* Address */}
          <div
            className="border border-[rgba(240,220,211,0.5)] flex items-center"
            style={{ padding: 'clamp(0.625rem, 1rem, 1.25rem)', borderRadius: 'clamp(0.75rem, 0.9375rem, 1.125rem)', height: 'clamp(3.5rem, 4.375rem, 5rem)' }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center" style={{ gap: 'clamp(0.625rem, 1rem, 1.25rem)' }}>
                <img
                  src={circleIcon}
                  alt="Circle"
                  style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
                />
                <div>
                  <div className="text-gray-600 font-montserrat" style={{ marginBottom: 'clamp(0.125rem, 0.25rem, 0.375rem)', fontSize: 'clamp(0.625rem, 0.75rem, 0.875rem)' }}>
                    Address
                  </div>
                  <div className="font-medium text-gray-800" style={{ fontSize: 'clamp(0.875rem, 1rem, 1.1875rem)' }}>
                    {detailData.address}
                  </div>
                </div>
              </div>
              <img
                src={addressIcon}
                alt="Address"
                style={{ width: 'clamp(1.5rem, 2rem, 2.17375rem)', height: 'clamp(1.5rem, 2rem, 2.17375rem)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedInformation;
