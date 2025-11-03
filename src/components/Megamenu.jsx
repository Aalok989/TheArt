import React, { useState, useRef, useEffect } from 'react';

const Megamenu = ({ isOpen, onClose, triggerRef, type = 'services', onPageChange, onMouseEnter, onMouseLeave }) => {
  const megamenuRef = useRef(null);

  // Close megamenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        megamenuRef.current &&
        !megamenuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Prevent closing when hovering over megamenu
  const handleMouseEnter = () => {
    // Keep megamenu open when hovering over it
    // This prevents the megamenu from closing when moving from button to megamenu
    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    // Close megamenu when leaving it
    if (onMouseLeave) {
      onMouseLeave();
    }
    onClose();
  };

  if (!isOpen) return null;

  // Render Projects megamenu
  if (type === 'projects') {
    return (
      <div
        ref={megamenuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute top-full left-0 bg-white shadow-2xl border border-gray-200 z-50 animate-fade-in-down rounded-lg overflow-hidden"
        style={{ 
          top: 'calc(100% + 4px)',
          left: '0',
          transform: 'none',
          width: 'auto',
          minWidth: '600px',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1 - Customer */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Customer
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                 <ul className="space-y-1">
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('noDiscount');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       No Discount
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('extraDiscount');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Extra Discount
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('extraPayment');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Extra Payment
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('signedBBA');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Signed BBA
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('unsignedBBA');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Unsigned BBA
                     </button>
                   </li>
                 </ul>
              </div>
            </div>

            {/* Column 2 - Channel Partners */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Channel Partners
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                 <ul className="space-y-1">
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('addPartner');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Add Partner
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         onPageChange('viewAll');
                         onClose();
                       }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       View All
                     </button>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Release Commission
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Paid Commission
                     </a>
                   </li>
                 </ul>
              </div>
            </div>

            {/* Column 3 - Project Snapshots */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Project Snapshots
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                 <ul className="space-y-1">
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       View All Snapshots
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Upload New Snapshot
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Progress Gallery
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Before & After
                     </a>
                   </li>
                 </ul>
              </div>
            </div>

            {/* Column 4 - Reports */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Reports
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                 <ul className="space-y-1">
                   <li>
                     <button
                       onClick={() => { onPageChange('userLogs'); onClose(); }}
                       className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                     >
                       User Logs
                     </button>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       View Coupons
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Installment Reports
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       CLP Report
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Final Report
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Today Report
                     </a>
                   </li>
                   <li>
                     <a
                       href="#"
                       className="text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat block py-1 px-2 rounded hover:bg-gray-50"
                     >
                       Datewise Report
                     </a>
                   </li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Documents megamenu
  if (type === 'documents') {
    return (
      <div
        ref={megamenuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="documents-megamenu absolute top-full left-0 bg-white shadow-2xl border border-gray-200 z-50 animate-fade-in-down rounded-lg overflow-hidden"
        style={{ 
          top: 'calc(100% + 4px)',
          left: '0',
          transform: 'none',
          width: 'auto',
          minWidth: '200px',
          maxWidth: '300px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div className="px-4 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
              Documents
            </h3>
            <div className="border-t border-gray-200 mb-3"></div>
             <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      onPageChange('commonDocs');
                      onClose();
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                  >
                    Common Docs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onPageChange('flatDocs');
                      onClose();
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                  >
                    Flat Docs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onPageChange('legalDocs');
                      onClose();
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                  >
                    Legal Docs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onPageChange('flatLegalDocs');
                      onClose();
                    }}
                    className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                  >
                    Flat Legal Docs
                  </button>
                </li>
             </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render Banking megamenu
  if (type === 'banking') {
    return (
      <div
        ref={megamenuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="banking-megamenu absolute top-full left-0 bg-white shadow-2xl border border-gray-200 z-50 animate-fade-in-down rounded-lg overflow-hidden"
        style={{ 
          top: 'calc(100% + 4px)',
          left: '0',
          transform: 'none',
          width: 'auto',
          minWidth: '800px',
          maxWidth: '1000px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div className="px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1 - Loan */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Loan
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('loanedFlats');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Loaned Flats
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('loanDocuments');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Loan Documents
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2 - Payment Status */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Payment Status
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('completePayment');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Complete Payment
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('balancePayment');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Balance Payment
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('noPayment');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      No Payment
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3 - Payment Received */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Payment Received
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('cheque');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Cheque
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('cash');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Cash
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('neft');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      NEFT
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4 - Manage */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat">
                  Manage
                </h3>
                <div className="border-t border-gray-200 mb-3"></div>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('manageBank');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Manage Bank
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('manageUser');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Manage User
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('manageChannelPartner');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Manage Channel Partner
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('manageCommission');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Manage Commission
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('calculateInterest');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Calculate Interest
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onPageChange('constructionStages');
                        onClose();
                      }}
                      className="block w-full text-left text-sm text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
                    >
                      Construction Stages
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Services megamenu (default)
  return (
    <div
      ref={megamenuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute top-full left-0 bg-white shadow-2xl border border-gray-200 z-50 animate-fade-in-down rounded-lg overflow-hidden"
      style={{ 
        top: 'calc(100% + 4px)',
        left: '0',
        transform: 'none',
        width: 'auto',
        minWidth: '900px',
        maxWidth: '1200px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1 - Flat Management */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat border-b border-gray-200 pb-2">
              Flat Management
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onPageChange('flatStatus');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Flat Status
              </button>
              <button
                onClick={() => {
                  onPageChange('flatSummary');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Flat Summary
              </button>
              <button
                onClick={() => {
                  onPageChange('blockInventory');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Block Inventory
              </button>
              <button
                onClick={() => {
                  onPageChange('flatVerification');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Flat Verification
              </button>
            </div>
          </div>

          {/* Column 2 - Flat Status */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat border-b border-gray-200 pb-2">
              Flat Status
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onPageChange('bookedFlats');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Booked Flats
              </button>
              <button
                onClick={() => {
                  onPageChange('blockedFlats');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Blocked Flats
              </button>
              <button
                onClick={() => {
                  onPageChange('cancelledFlats');
                  onClose();
                }}
                className="block w-full text-left text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200 font-montserrat py-2 px-3 rounded hover:bg-gray-50"
              >
                Cancelled Flats
              </button>
            </div>
          </div>

          {/* Column 3 - Flat Customization */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat border-b border-gray-200 pb-2">
              Flat Customization
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onPageChange('activityType');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                Activity Type
              </button>
              <button
                onClick={() => {
                  onPageChange('viewActivities');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                View Activities
              </button>
              <button
                onClick={() => {
                  onPageChange('customize');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                Customize
              </button>
              <button
                onClick={() => {
                  onPageChange('viewCustomization');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                View Customization
              </button>
            </div>
          </div>

          {/* Column 4 - Handover Activities */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 mb-3 font-montserrat border-b border-gray-200 pb-2">
              Handover Activities
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onPageChange('flatHandoverActivity');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                Add Activity
              </button>
              <button
                onClick={() => {
                  onPageChange('addSubactivity');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                Add Subactivity
              </button>
              <button
                onClick={() => {
                  onPageChange('viewActivity');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                View Activity
              </button>
              <button
                onClick={() => {
                  onPageChange('flatHandover');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                Flat Hand Over Activity
              </button>
              
              <button
                onClick={() => {
                  onPageChange('viewHandover');
                  onClose();
                }}
                className="block w-full text-left text-xs text-gray-700 hover:text-orange-600 transition-colors duration-200 font-montserrat py-1 px-2 rounded hover:bg-gray-50"
              >
                View Flat Handover Activity
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Megamenu;
