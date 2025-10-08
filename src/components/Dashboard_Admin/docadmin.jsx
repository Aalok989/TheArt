import React, { useState } from 'react';
import CommonDocs from './CommonDocs';
import FlatDocs from './FlatDocs';
import LegalDocs from './LegalDocs';
import FlatLegalDocs from './FlatLegalDocs';

const DocAdmin = () => {
  const [activeTab, setActiveTab] = useState('common');

  const tabs = [
    { key: 'common', label: 'Common Docs' },
    { key: 'flats', label: 'Flats Docs' },
    { key: 'legal', label: 'Legal Docs' },
    { key: 'flatsLegal', label: 'Flats Legal Docs' },
  ];

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.25rem, 1.5rem)', marginBottom: 'clamp(1rem, 1.5rem, 2rem)' }}>
          Documents Management
        </h2>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center" style={{ gap: 'clamp(0.5rem, 0.75rem, 1rem)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap shadow-sm rounded-full font-medium font-montserrat ${
                activeTab === tab.key
                  ? "text-white transform scale-105"
                  : "text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 hover:shadow-lg"
              }`}
              style={{
                width: 'clamp(7rem, 9rem, 11rem)',
                height: 'clamp(2.25rem, 2.8125rem, 3.25rem)',
                fontSize: 'clamp(0.75rem, 0.875rem, 1rem)',
                background:
                  activeTab === tab.key
                    ? 'linear-gradient(0deg, #FC7117 0%, #FF8C42 100%)'
                    : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.5rem, 1rem, 1.5rem)' }}>
        <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(1rem, 1.5rem, 2rem)' }}>
          {/* Render content based on active tab */}
          {activeTab === 'common' && <CommonDocs />}
          {activeTab === 'flats' && <FlatDocs />}
          {activeTab === 'legal' && <LegalDocs />}
          {activeTab === 'flatsLegal' && <FlatLegalDocs />}
        </div>
      </div>
    </div>
  );
};

export default DocAdmin;