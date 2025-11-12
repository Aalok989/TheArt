import React, { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { IoMail } from 'react-icons/io5';
import giriLogo from '../../assets/giri.png';
import artLogo from '../../assets/logo.png';

const defaultSchedule = [
  { instNo: 1, description: 'Booking Advance', date: '11-10-2021', amountDesc: '10% of (BSP+Amenities+Car Parking)', amountPayable: '805020', tax: '40251 - GST' },
  { instNo: 2, description: 'At the time of Agreement of Sale', date: '30-11-2001', amountDesc: '20% of (BSP+Amenities+Car Parking)', amountPayable: '1610040', tax: '80502 - GST' },
  { instNo: 3, description: 'Completion of Cellar Slab', date: '01-01-1970', amountDesc: '15% of (BSP+Amenities+Car Parking)', amountPayable: '1207530', tax: '60377 - GST' },
  { instNo: 4, description: 'Completion of 5th Slab', date: '14-01-2020', amountDesc: '25% of (BSP+Amenities+Car Parking)', amountPayable: '2012550', tax: '100628 - GST' },
  { instNo: 5, description: 'Completion of First Stage of Internal works', date: '28-02-2020', amountDesc: '5% of (BSP+Amenities+Car Parking)', amountPayable: '402510', tax: '20126 - GST' },
  { instNo: 6, description: 'Completion of 2nd Stage of Internal works', date: '-', amountDesc: '5% of (BSP+Amenities+Car Parking)', amountPayable: '402510', tax: '20126 - GST' },
  { instNo: 7, description: 'Completion of external works', date: '-', amountDesc: '5% of (BSP+Amenities+Car Parking)', amountPayable: '402510', tax: '20126 - GST' },
  { instNo: 8, description: 'Completion of hardware works', date: '-', amountDesc: '10% of (BSP+Amenities+Car Parking)', amountPayable: '805020', tax: '40251 - GST' },
  { instNo: 9, description: 'At the time of registration', date: '-', amountDesc: '5% of (BSP+Amenities+Car Parking)', amountPayable: '402510', tax: '20126 - GST' },
  { instNo: 10, description: 'At the time of registration', date: '-', amountDesc: '100% EWSW Cost', amountPayable: '138600', tax: '0 - GST' },
  { instNo: 11, description: 'At the time of registration', date: '-', amountDesc: '100% of Home Automation Cost', amountPayable: '0', tax: '0 - GST' },
  { instNo: 12, description: 'Corpus Fund', date: '-', amountDesc: '100% Corpus Fund', amountPayable: '97200', tax: '0 - GST' },
  { instNo: 13, description: 'Maintenance for 1st year', date: '-', amountDesc: '100% Maintenance Charges', amountPayable: '55440', tax: '0 - GST' },
  { instNo: 14, description: 'Maintenance for 2nd year', date: '-', amountDesc: '100% Maintenance Charges', amountPayable: '55440', tax: '0 - GST' }
];

const PaymentSchedule = ({ paymentData = {}, schedule = defaultSchedule }) => {
  const componentRef = useRef();

  const customerName = paymentData?.name || 'CHANDRASEKHAR VEERASWAMI DONTHA';
  const coApplicantName = paymentData?.coApplicant || 'LAKSHMI PRIYA';
  const flatNo = paymentData?.flatNo || 'A-101';
  const email = paymentData?.email || '';

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const customerId = `TA${flatNo.replace(/[^0-9]/g, '')}${dateStr.replace(/-/g, '')}`;

  const totals = useMemo(() => {
    const toNumber = (value) => {
      if (!value) return 0;
      const cleansed = value.toString().replace(/[^0-9.]/g, '');
      return Number(cleansed || 0);
    };

    const amountPayable = schedule.reduce((sum, row) => sum + toNumber(row.amountPayable), 0);
    const tax = schedule.reduce((sum, row) => sum + toNumber(row.tax), 0);

    return {
      amountPayable,
      tax
    };
  }, [schedule]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Payment Schedule - ${flatNo}`
  });

  const handleEmail = async () => {
    try {
      const element = componentRef.current;
      if (!element) return;

      const filename = `Payment_Schedule_${flatNo}_${dateStr.replace(/-/g, '')}.pdf`;
      const opt = {
        margin: [0, 0, 0, 0],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        const subject = encodeURIComponent(`Payment Schedule - Flat No: ${flatNo}`);
        const body = encodeURIComponent(
          `Dear ${customerName},\n\n` +
          `Please find attached the payment schedule for Flat No: ${flatNo}.\n\n` +
          `Thank you,\nGiridhari Homes Pvt. Ltd.`
        );

        const gmailUrl = email
          ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`
          : `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

        window.open(gmailUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

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

      <div
        ref={componentRef}
        style={{
          width: '210mm',
          height: '297mm',
          margin: '0 auto',
          padding: '8mm',
          fontFamily: 'Arial',
          fontSize: '11px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <style>
          {`
            body, table { padding:0; margin:0; font-family:Arial; font-size:11px; }
            .schedule_table { width:100%; border-collapse:collapse; border:1px solid #333; margin-top:10px; }
            .schedule_table th, .schedule_table td { padding:4px; border:1px solid #333; }
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
          <div style={{ flex: '0 0 auto' }}>
            <img src={giriLogo} alt="Giridhari Homes" style={{ maxWidth: '200px', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <img src={artLogo} alt="THE Art" style={{ maxWidth: '150px', height: 'auto', display: 'block' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
            <div style={{ width: '40%' }}></div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <div style={{ marginBottom: '3px' }}>
                <strong style={{ fontSize: '14px', color: '#0066CC', textTransform: 'uppercase' }}>
                  PAYMENT SCHEDULE FOR
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

        <div style={{ marginBottom: '10px', fontSize: '11px', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '3px' }}><strong>Customer :</strong> {customerName}</div>
          <div style={{ marginBottom: '3px' }}><strong>Co-Applicant :</strong> {coApplicantName}</div>
          <div style={{ marginBottom: '3px' }}><strong>Customer ID :</strong> {customerId}</div>
          <div><strong>Email :</strong> {email || 'N/A'}</div>
        </div>

        <table className="schedule_table" cellSpacing="0">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <th style={{ width: '6%', textAlign: 'center' }}>Inst No.</th>
              <th style={{ width: '22%', textAlign: 'left' }}>Description</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Date</th>
              <th style={{ width: '30%', textAlign: 'center' }}>Amount Description</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Amount Payable</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Tax</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={`${row.instNo}-${index}`}>
                <td style={{ textAlign: 'center' }}>{row.instNo}</td>
                <td>{row.description}</td>
                <td style={{ textAlign: 'center' }}>{row.date}</td>
                <td style={{ textAlign: 'center' }}>{row.amountDesc}</td>
                <td style={{ textAlign: 'right' }}>{Number(row.amountPayable || 0).toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'right' }}>{row.tax}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td colSpan={4} style={{ textAlign: 'right' }}>Total Amount</td>
              <td style={{ textAlign: 'right' }}>{totals.amountPayable.toLocaleString('en-IN')}</td>
              <td style={{ textAlign: 'right' }}>{totals.tax.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ marginTop: '12px', borderTop: '1px solid #333', paddingTop: '6px', textAlign: 'center', fontSize: '10px' }}>
            <div>
              <strong>Corporate Office:</strong> 101/A, 4th Floor, Opp. TNN News Plus, Near Syndicate Bank,
              Journalist Colony, Road No.70, Jubilee Hills, Hyderabad- 500033., Phone: 040-2352 9999
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSchedule;

