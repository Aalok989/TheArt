import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { IoMail } from 'react-icons/io5';
import giriLogo from '../../assets/giri.png';
import artLogo from '../../assets/logo.png';

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return numeric.toLocaleString('en-IN');
};

const Reciept = ({ receiptData = {} }) => {
  const componentRef = useRef();

  const {
    receiptNo = 'A1603',
    date = '23-11-2021',
    customerName = 'V.REVATHI',
    guardianName = 'V.RAMA MOHAN RAO',
    flatNo = 'A1',
    address = 'Flat No-16-104 Near Saibaba Temple, Huzusnagar, at Suryapet.',
    ghplAmount = 376500,
    orchidAmount = 223500,
    totalAmount = 600000,
    bank = 'HDFC',
    chequeNo = '000003',
    chequeDate = '20-11-2021'
  } = receiptData || {};

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Payment Receipt - ${flatNo}-${receiptNo}`
  });

  const handleEmail = async () => {
    try {
      const element = componentRef.current;
      if (!element) return;

      const filename = `Payment_Receipt_${flatNo}_${receiptNo}.pdf`;
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
        const subject = encodeURIComponent(`Payment Receipt - Flat No: ${flatNo}`);
        const body = encodeURIComponent(
          `Dear ${customerName},\n\n` +
          `Please find attached the payment receipt for Flat No: ${flatNo}.\n\n` +
          `Thank you,\nGiridhari Homes Pvt. Ltd.`
        );

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const formattedTotal = formatNumber(totalAmount);
  const formattedGhpl = formatNumber(ghplAmount);
  const formattedOrchid = formatNumber(orchidAmount);

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
          padding: '12mm 18mm',
          fontFamily: 'Arial',
          fontSize: '12px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <style>
          {`
            body { margin: 0; padding: 0; font-family: Arial; font-size: 12px; }
            .receipt-container p { margin: 0 0 8px 0; line-height: 1.6; }
            .receipt-container .highlight { font-weight: bold; text-decoration: underline; }
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

        <div className="receipt-container" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ flex: '0 0 auto' }}>
              <img src={giriLogo} alt="Giridhari Homes" style={{ maxWidth: '200px', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <img src={artLogo} alt="THE Art" style={{ maxWidth: '150px', height: 'auto', display: 'block' }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
              Payment Receipt Flat No :- {flatNo}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold' }}>
              Receipt No:- <span className="highlight">{receiptNo}</span>
            </div>
            <div style={{ fontWeight: 'bold' }}>
              Date:- <span className="highlight">{date}</span>
            </div>
          </div>

          <p>
            Received with thanks from Mr./Ms./Mrs.{' '}
            <span className="highlight">{customerName}</span> S/D/W/O:-{' '}
            <span className="highlight">{guardianName}</span>.
          </p>

          <p>
            Address:- <span className="highlight">{address}</span>
          </p>

          <p>
            Rs. <span className="highlight">{formattedTotal}</span>/- Rupees
          </p>

          <p>
            ( Flat Cost (GHPL) - <span className="highlight">{formattedGhpl}</span>/- + Flat Cost (ORCHID) -{' '}
            <span className="highlight">{formattedOrchid}</span>/- ).
          </p>

          <p>
            By Cheque No./DD No. <span className="highlight">{chequeNo}</span> Bank{' '}
            <span className="highlight">{bank}</span> Drawn on{' '}
            <span className="highlight">{chequeDate}</span>.
          </p>

          <p>
            Against the Flat No. <span className="highlight">{flatNo}</span>.
          </p>

          <p style={{ fontWeight: 'bold', marginTop: '24px' }}>
            Amount Rs. <span className="highlight">{formattedTotal}</span>/-
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
          <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
            <div>For Giridhari Homes Pvt Ltd &amp; Orchid Enterprises</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '40px' }}></div>
            <div style={{ fontWeight: 'bold' }}>Authorized Signatory</div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', fontSize: '10px', lineHeight: '1.4', borderTop: '1px solid #000', paddingTop: '8px' }}>
          <div>*Subject to realization of cheque/draft.</div>
          <div>*Terms and conditions applied.</div>
        </div>
      </div>
    </>
  );
};

export default Reciept;

