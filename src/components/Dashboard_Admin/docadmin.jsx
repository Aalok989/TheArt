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
    <div className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
        <h2 className="font-bold text-gray-800" style={{ fontSize: 'clamp(1rem, 1.125rem, 1.5rem)', marginBottom: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
          Documents Management
        </h2>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full font-medium transition-all duration-300 flex items-center justify-center whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              style={{
                height: 'clamp(2rem, 2.5rem, 3rem)',
                paddingLeft: 'clamp(0.5rem, 0.75rem, 1rem)',
                paddingRight: 'clamp(0.5rem, 0.75rem, 1rem)',
                fontSize: 'clamp(0.6875rem, 0.75rem, 0.875rem)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ paddingRight: 'clamp(0.25rem, 0.5rem, 1rem)' }}>
        <div className="bg-white border border-gray-200 h-full" style={{ borderRadius: 'clamp(0.5rem, 0.75rem, 1rem)', padding: 'clamp(0.75rem, 1rem, 1.5rem)' }}>
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