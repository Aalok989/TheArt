import React, { useState, useEffect } from 'react';
import { HiStar } from 'react-icons/hi';
import { fetchUpdates } from '../api/mockData';

const Updates = () => {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleUpdates, setVisibleUpdates] = useState(0);
  const [starredUpdates, setStarredUpdates] = useState({}); // Track starred updates with timestamps

  // Fetch updates from API
  useEffect(() => {
    const getUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetchUpdates();
        if (response.success) {
          setUpdates(response.data);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };

    getUpdates();
  }, []);

  // Sort updates: starred items first (by oldest first - FIFO), then unstarred items
  const sortedUpdates = updates
    .map((update, index) => ({ ...update, originalIndex: index }))
    .sort((a, b) => {
      const aStarred = starredUpdates[a.originalIndex];
      const bStarred = starredUpdates[b.originalIndex];
      
      // Both starred: sort by timestamp (oldest first - FIFO)
      if (aStarred && bStarred) {
        return aStarred - bStarred;
      }
      // Only a starred: a comes first
      if (aStarred) return -1;
      // Only b starred: b comes first
      if (bStarred) return 1;
      // Neither starred: keep original order
      return a.originalIndex - b.originalIndex;
    });

  // Animation effect after data is loaded
  useEffect(() => {
    if (!loading && updates.length > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        const updateTimer = setInterval(() => {
          setVisibleUpdates(prev => {
            if (prev < updates.length) {
              return prev + 1;
            } else {
              clearInterval(updateTimer);
              return prev;
            }
          });
        }, 100);
        return () => clearInterval(updateTimer);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, updates.length]);

  const toggleStar = (originalIndex) => {
    setStarredUpdates(prev => {
      const newStarred = { ...prev };
      if (newStarred[originalIndex]) {
        // Unstar: remove the timestamp
        delete newStarred[originalIndex];
      } else {
        // Star: add current timestamp
        newStarred[originalIndex] = Date.now();
      }
      return newStarred;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-[1rem] lg:mb-[1.5rem] animate-slide-in-down">
        <h2 className="text-[1.125rem] lg:text-[1.25rem] font-bold text-gray-800 animate-fade-in-left animate-delay-200">
          Updates
        </h2>
        <button
          className="px-[0.75rem] lg:px-[1rem] py-[0.375rem] lg:py-[0.5rem] bg-orange-100 text-orange-600 text-[0.75rem] lg:text-[0.875rem] font-medium rounded-full border border-orange-300 hover:bg-orange-200 transition-colors animate-fade-in-right animate-delay-300 hover-lift btn-animate"
        >
          Construction
        </button>
      </div>

      {/* Updates List with Vertical Scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-[1rem] section-animate animate-delay-300">
        <div className="space-y-[0.75rem] lg:space-y-[1rem]">
          {sortedUpdates.map((update, index) => (
            <div
              key={update.originalIndex}
              className={`${
                starredUpdates[update.originalIndex] ? 'bg-[#FFF8D4]' : update.bgColor
              } rounded-xl p-[0.75rem] lg:p-[1rem] transition-all duration-300 hover:scale-[1.02] shadow-sm hover-lift section-animate ${
                index < visibleUpdates ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-[0.5rem] lg:pr-[0.75rem]">
                  <h3 className="font-bold text-gray-800 mb-[0.25rem] lg:mb-[0.5rem] text-[1rem] leading-tight">
                    {update.title}
                  </h3>
                  <p className="text-[1rem] text-gray-600 leading-relaxed">{update.description}</p>
                </div>
                <button
                  onClick={() => toggleStar(update.originalIndex)}
                  className={`transition-colors flex-shrink-0 hover-scale btn-animate ${
                    starredUpdates[update.originalIndex] ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <HiStar className="w-[1rem] h-[1rem] lg:w-[1.25rem] lg:h-[1.25rem]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Updates;