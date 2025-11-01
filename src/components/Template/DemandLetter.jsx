import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { IoMail } from 'react-icons/io5';
import giriLogo from '../../assets/giri.png';
import artLogo from '../../assets/logo.png';

const DemandLetter = ({ paymentData }) => {
  const componentRef = useRef();

  // Mock data for demand letter template
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  
  const flatNo = paymentData?.flatNo;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Payment Demand Letter - ${flatNo}`,
  });

  const handleEmail = async () => {
    try {
      const element = componentRef.current;
      if (!element) return;

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `Payment_Demand_Letter_${flatNo}_${dateStr.replace(/-/g, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate PDF blob
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Payment_Demand_Letter_${flatNo}_${dateStr.replace(/-/g, '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Wait a moment for download to start, then open Gmail compose window
      setTimeout(() => {
        const email = paymentData?.email || '';
        const subject = encodeURIComponent(`Payment Demand Letter - Flat No: ${flatNo}`);
        const body = encodeURIComponent(
          `Dear ${customerName},\n\n` +
          `Please find attached the payment demand letter for Flat No: ${flatNo}.\n\n` +
          `Thank you,\nGiridhari Homes Pvt. Ltd.`
        );
        
        // Open Gmail compose window
        const gmailUrl = email 
          ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`
          : `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
        
        window.open(gmailUrl, '_blank');
        
        // Clean up blob URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const customerName = paymentData?.name || 'CHANDRASEKHAR VEERASWAMI DONTHA';
  const customerId = `TA${flatNo.replace(/[^0-9]/g, '')}${dateStr.replace(/-/g, '')}`;
  const refNo = `${flatNo}${dateStr.replace(/-/g, '')}0`;

  // Mock installment data
  const installments = [
    { instNo: 1, description: 'Booking Advance', date: '07-10-2019', amountDesc: '10%', dueAmount: '683565', tax: '34179', amountPayable: '717744', received: '717744', balance: '0' },
    { instNo: 2, description: 'At the time of Agreement of Sale', date: '07-10-2019', amountDesc: '20%', dueAmount: '1367130', tax: '68357', amountPayable: '1435487', received: '1435487', balance: '0' },
    { instNo: 3, description: 'Completion of Cellar Slab', date: '12-12-2019', amountDesc: '15%', dueAmount: '1025348', tax: '51267', amountPayable: '1076615', received: '1076615', balance: '0' },
    { instNo: 4, description: 'Completion of 5th Slab', date: '28-06-2020', amountDesc: '25%', dueAmount: '1708913', tax: '85446', amountPayable: '1794359', received: '1794359', balance: '0' },
    { instNo: 5, description: 'Completion of First Stage of Internal works', date: '15-01-2021', amountDesc: '5%', dueAmount: '341783', tax: '17089', amountPayable: '358872', received: '358872', balance: '0' },
    { instNo: 6, description: 'Completion of 2nd Stage of Internal works', date: '12-03-2021', amountDesc: '5%', dueAmount: '341783', tax: '17089', amountPayable: '358872', received: '358872', balance: '0' },
    { instNo: 7, description: 'Completion of external works', date: '12-05-2021', amountDesc: '5%', dueAmount: '341783', tax: '17089', amountPayable: '358872', received: '358872', balance: '0' },
    { instNo: 8, description: 'Completion of hardware works', date: '12-08-2021', amountDesc: '5%', dueAmount: '341783', tax: '17089', amountPayable: '358872', received: '358872', balance: '0' }
  ];

  const totalDueAmount = installments.reduce((sum, inst) => sum + parseInt(inst.dueAmount), 0).toString();
  const totalTax = installments.reduce((sum, inst) => sum + parseInt(inst.tax), 0).toString();
  const totalAmountPayable = installments.reduce((sum, inst) => sum + parseInt(inst.amountPayable), 0).toString();
  const totalReceived = installments.reduce((sum, inst) => sum + parseInt(inst.received), 0).toString();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px', marginBottom: '15px', position: 'relative', zIndex: 10003 }}>
        <button 
          type="button"
          className="print" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrint();
          }}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 10003
          }}
          title="Print"
        >
          Print
        </button>
        <button 
          type="button"
          className="print" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEmail();
          }}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 10003,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Send Email"
        >
          <IoMail size={18} />
          Email
        </button>
      </div>

      <div ref={componentRef} style={{ width: '210mm', height: '297mm', margin: '0 auto', padding: '8mm', fontFamily: 'Arial', fontSize: '11px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
        <style>
          {`
            body, table { padding:0; margin:0; font-family:Arial; font-size:11px; }
            .bill_container { margin:10px; border:1px solid #333; padding:10px; page-break-after:always; }
            .bill_format { width:100%; border-collapse:collapse; border:1px solid #333; margin-top:10px; }
            .bill_format th, .bill_format td { padding:2px; border:1px solid #333; }
            .bill_format_2 { width:100%; border-collapse:collapse; border:1px solid #333; }
            .bill_format_2 th, .bill_format_2 td { padding:2px; border:1px solid #333; }
            @media print { 
              .print { display:none; }
              body { margin: 0; padding: 0; }
              @page { 
                size: A4; 
                margin: 0; 
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `}
        </style>

        {/* Header with Logos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', width: '100%', position: 'relative' }}>
          <div style={{ flex: '0 0 auto' }}>
            <img src={giriLogo} alt="Giridhari Homes" style={{ maxWidth: '200px', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <img src={artLogo} alt="THE Art" style={{ maxWidth: '150px', height: 'auto', display: 'block' }} />
          </div>
        </div>

        {/* Document Title */}
        <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
            <div style={{ width: '40%' }}></div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <div style={{ marginBottom: '3px' }}>
                <strong style={{ fontSize: '14px', color: '#0066CC', textTransform: 'uppercase' }}>
                  PAYMENT DEMAND Letter FOR
                </strong>
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0066CC', textTransform: 'uppercase' }}>
                  FLAT NO:- {flatNo}
                </strong>
              </div>
            </div>
            <div style={{ width: '40%', textAlign: 'right', fontSize: '11px' }}>
              Date: {dateStr}
            </div>
          </div>
        </div>

        {/* Reference Details */}
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <div style={{ marginBottom: '3px' }}><strong>Ref No :</strong> {refNo}</div>
          <div style={{ marginBottom: '3px' }}><strong>Flat No :</strong> {flatNo}</div>
          <div><strong>Customer ID :</strong> {customerId}</div>
        </div>

        {/* Salutation and Introduction */}
        <div style={{ marginBottom: '10px', lineHeight: '1.5' }}>
          <p style={{ marginBottom: '6px' }}>
            <strong>Dear {customerName.toUpperCase()},</strong>
          </p>
          <p style={{ marginBottom: '0', textAlign: 'justify', fontSize: '11px' }}>
            Please refer to the application for the above mentioned flat. As per the terms agreed on; 
            further payments are to be made by you in accordance with payment plan CLP. As per the payment 
            plan the following installments (s) is/are due and payable by you as per dates mentioned against them.
          </p>
          </div>

        {/* Payment Schedule Table */}
        <table className="bill_format" cellSpacing="0" style={{ marginTop: '10px', marginBottom: '10px' }}>
              <thead>
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>Inst No.</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'left', fontSize: '10px' }}>Description</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>Date</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>Amount Description</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Due Amount</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Tax</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Amount Payable</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Received</th>
              <th style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
            {installments.map((inst, idx) => (
              <tr key={idx}>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>{inst.instNo}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'left', fontSize: '10px' }}>{inst.description}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>{inst.date}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'center', fontSize: '10px' }}>{inst.amountDesc} (BSP+Amenities+Car Parking)</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(inst.dueAmount).toLocaleString('en-IN')}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(inst.tax).toLocaleString('en-IN')} GST</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(inst.amountPayable).toLocaleString('en-IN')}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(inst.received).toLocaleString('en-IN')}</td>
                <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{inst.balance}</td>
                      </tr>
                    ))}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td colSpan="4" style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>Total Amount</td>
              <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(totalDueAmount).toLocaleString('en-IN')}</td>
              <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(totalTax).toLocaleString('en-IN')}</td>
              <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(totalAmountPayable).toLocaleString('en-IN')}</td>
              <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>{parseInt(totalReceived).toLocaleString('en-IN')}</td>
              <td style={{ padding: '4px', border: '1px solid #333', textAlign: 'right', fontSize: '10px' }}>0</td>
            </tr>
            </tbody>
          </table>

        {/* Payment Instructions */}
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <p style={{ marginBottom: '6px', fontWeight: 'bold', fontSize: '11px' }}>The Cheque/PO shall be prepared as hereunder:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '3px 0', width: '30%', textAlign: 'left', fontSize: '11px' }}><strong>Payee's Name:</strong></td>
                <td style={{ padding: '3px 0', width: '70%', textAlign: 'left', fontSize: '11px' }}>GIRIDHARI HOMES PVT LTD AND ORCHID ENTERPRISES ACCOUNT PROJECT THE ART</td>
              </tr>
              <tr>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}><strong>Bank:</strong></td>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}>HDFC BANK</td>
                </tr>
              <tr>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}><strong>IFSC Code:</strong></td>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}>HDFC0009817</td>
              </tr>
              <tr>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}><strong>Bank Account No:</strong></td>
                <td style={{ padding: '3px 0', textAlign: 'left', fontSize: '11px' }}>57500000303279</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Notes */}
        <div style={{ marginTop: '10px', marginBottom: '10px', lineHeight: '1.5' }}>
          <p style={{ marginBottom: '6px', textAlign: 'justify', fontSize: '11px' }}>
            In this connection we would like to mention that payment from you in time would enable us to complete 
            the project as planned. Therefore we would appreciate your remitting the aforesaid amount(s) on or before the due date.
          </p>
          <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '11px' }}>
            Note : Kindly provide separate cheque for GST with each Installment.
          </p>
        </div>

        {/* Signatory Information */}
        <div style={{ marginTop: 'auto', paddingTop: '15px', textAlign: 'right' }}>
          <div style={{ marginBottom: '4px', fontSize: '11px' }}>Mohini Verma</div>
          <div style={{ marginBottom: '4px', fontSize: '11px' }}>Authorised Signatory</div>
          <div style={{ fontSize: '11px' }}>Giridhari Homes Pvt. Ltd.</div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '12px', borderTop: '1px solid #333', paddingTop: '6px', textAlign: 'center', fontSize: '10px' }}>
          <div>
            <strong>Corporate Office:</strong> 101/A, 4th Floor, Opp. TNN News Plus, Near Syndicate Bank, 
            Journalist Colony, Road No.70, Jubilee Hills, Hyderabad- 500033., Phone: 040-2352 9999
          </div>
        </div>
      </div>
    </>
  );
};

export default DemandLetter;
