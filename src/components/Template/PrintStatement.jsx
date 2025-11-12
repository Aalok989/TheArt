import React, { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { IoMail } from 'react-icons/io5';
import giriLogo from '../../assets/giri.png';
import artLogo from '../../assets/logo.png';

const defaultStatementRows = [
  { srNo: 1, receiptNo: 'A1301', chequeNo: '811778', amount: 447000, bank: 'HDFC', chequeDate: '15-11-2021', status: 'Cleared' },
  { srNo: 2, receiptNo: 'A1301', chequeNo: '811778', amount: 753000, bank: 'HDFC', chequeDate: '15-11-2021', status: 'Cleared' },
  { srNo: 3, receiptNo: 'A1601', chequeNo: '000001', amount: 235000, bank: 'HDFC', chequeDate: '20-11-2021', status: 'Cleared' },
  { srNo: 4, receiptNo: 'A1602', chequeNo: '000001', amount: 376500, bank: 'HDFC', chequeDate: '20-11-2021', status: 'Cleared' },
  { srNo: 5, receiptNo: 'A1603', chequeNo: '000003', amount: 223500, bank: 'HDFC', chequeDate: '27-11-2021', status: 'Cleared' },
  { srNo: 6, receiptNo: 'A1603', chequeNo: '000003', amount: 357600, bank: 'HDFC', chequeDate: '30-11-2021', status: 'Cleared' },
  { srNo: 7, receiptNo: 'A1204', chequeNo: '000002', amount: 74500, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 8, receiptNo: 'A1504', chequeNo: '000004', amount: 223500, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 9, receiptNo: 'A1105', chequeNo: '000024', amount: 372500, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 10, receiptNo: 'A1506', chequeNo: '000048', amount: 165250, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 11, receiptNo: 'A1506', chequeNo: '000048', amount: 156250, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 12, receiptNo: 'A1607', chequeNo: '000049', amount: 313750, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 13, receiptNo: 'A1607', chequeNo: '000049', amount: 313750, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 14, receiptNo: 'A1608', chequeNo: '811780', amount: 156250, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 15, receiptNo: 'A1608', chequeNo: '811780', amount: 313750, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 16, receiptNo: 'A1608', chequeNo: '811781', amount: 376500, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 17, receiptNo: 'A1509', chequeNo: 'NEFT', amount: 156250, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 18, receiptNo: 'A1509', chequeNo: 'NEFT', amount: 313750, bank: 'HDFC', chequeDate: '13-12-2021', status: 'Cleared' },
  { srNo: 19, receiptNo: 'A1509', chequeNo: 'NEFT', amount: 63111, bank: 'HDFC', chequeDate: '17-12-2021', status: 'Cleared' },
  { srNo: 20, receiptNo: 'A1509', chequeNo: 'NEFT', amount: 106314, bank: 'HDFC', chequeDate: '17-12-2021', status: 'Cleared' },
  { srNo: 21, receiptNo: 'A1511', chequeNo: '000025', amount: 186250, bank: 'HDFC', chequeDate: '18-12-2021', status: 'Cleared' },
  { srNo: 22, receiptNo: 'A1511', chequeNo: '000025', amount: 313750, bank: 'HDFC', chequeDate: '18-12-2021', status: 'Cleared' },
  { srNo: 23, receiptNo: 'A1512', chequeNo: '000005', amount: 113824, bank: 'HDFC', chequeDate: '10-01-2022', status: 'Cleared' },
  { srNo: 24, receiptNo: 'A1512', chequeNo: '000005', amount: 188376, bank: 'HDFC', chequeDate: '10-01-2022', status: 'Cleared' },
  { srNo: 25, receiptNo: 'A1713', chequeNo: '000049', amount: 260750, bank: 'HDFC', chequeDate: '10-01-2022', status: 'Cleared' },
  { srNo: 26, receiptNo: 'A1713', chequeNo: '000049', amount: 439350, bank: 'HDFC', chequeDate: '10-01-2022', status: 'Cleared' },
  { srNo: 27, receiptNo: 'A1814', chequeNo: '050377', amount: 298000, bank: 'HDFC', chequeDate: '11-01-2022', status: 'Cleared' },
  { srNo: 28, receiptNo: 'A1814', chequeNo: '050377', amount: 502000, bank: 'HDFC', chequeDate: '11-01-2022', status: 'Cleared' },
  { srNo: 29, receiptNo: 'A1415', chequeNo: '811783', amount: 316625, bank: 'HDFC', chequeDate: '11-01-2022', status: 'Cleared' },
  { srNo: 30, receiptNo: 'A1415', chequeNo: '811783', amount: 533375, bank: 'HDFC', chequeDate: '11-01-2022', status: 'Cleared' }
];

const defaultStatementInfo = {
  customerName: 'V.REVATHI',
  fatherHusbandName: 'V.RAMA MOHAN RAO',
  contactNo: '9966801523',
  coApplicant: 'V.RAMA MOHAN RAO',
  area: '1386 Sq.Ft.',
  paymentPlan: 'CLP',
  totalAmount: '8396700',
  paidAmount: '8219625',
  uniqueId: 'TA21143V',
  date: '11-11-2025',
  title: 'Payment Statement A1'
};

const PrintStatement = ({ statementInfo = defaultStatementInfo, rows = defaultStatementRows }) => {
  const componentRef = useRef();

  const totals = useMemo(() => {
    const amountTotal = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return {
      amount: amountTotal
    };
  }, [rows]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${statementInfo?.title || 'Payment Statement'} - ${statementInfo?.uniqueId || ''}`
  });

  const handleEmail = async () => {
    try {
      const element = componentRef.current;
      if (!element) return;

      const filename = `${(statementInfo?.title || 'Payment_Statement').replace(/\s+/g, '_')}_${statementInfo?.uniqueId || ''}.pdf`;
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
        const subject = encodeURIComponent(`${statementInfo?.title || 'Payment Statement'} - ${statementInfo?.customerName || ''}`);
        const body = encodeURIComponent(
          `Dear ${statementInfo?.customerName || 'Customer'},\n\n` +
          `Please find attached the payment statement.\n\n` +
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
            .statement-table { width:100%; border-collapse:collapse; border:1px solid #333; margin-top:10px; }
            .statement-table th, .statement-table td { padding:4px; border:1px solid #333; }
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

        <div style={{ textAlign: 'center', marginTop: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div style={{ width: '40%' }}></div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ fontSize: '14px', color: '#0066CC', textTransform: 'uppercase' }}>
                  PAYMENT STATEMENT FOR
                </strong>
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: '#0066CC', textTransform: 'uppercase' }}>
                  {statementInfo?.title || 'Payment Statement'}
                </strong>
              </div>
            </div>
            <div style={{ width: '40%', textAlign: 'right', fontSize: '11px' }}>
              Date: {statementInfo?.date || ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 20px', marginBottom: '10px', fontSize: '11px' }}>
          <div><strong>Customer Name :</strong> {statementInfo?.customerName}</div>
          <div><strong>Father/Husband Name :</strong> {statementInfo?.fatherHusbandName}</div>
          <div><strong>Contact No :</strong> {statementInfo?.contactNo}</div>
          <div><strong>Co-Applicant :</strong> {statementInfo?.coApplicant}</div>
          <div><strong>Area (Sq.Ft.) :</strong> {statementInfo?.area}</div>
          <div><strong>Payment Plan :</strong> {statementInfo?.paymentPlan}</div>
          <div><strong>Total Amount :</strong> {Number(statementInfo?.totalAmount || 0).toLocaleString('en-IN')}</div>
          <div><strong>Paid Amount :</strong> {Number(statementInfo?.paidAmount || 0).toLocaleString('en-IN')}</div>
          <div><strong>Unique ID :</strong> {statementInfo?.uniqueId}</div>
        </div>

        <table className="statement-table" cellSpacing="0">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <th style={{ width: '6%', textAlign: 'center' }}>SR No.</th>
              <th style={{ width: '17%', textAlign: 'center' }}>Receipt No</th>
              <th style={{ width: '17%', textAlign: 'center' }}>Cheque No.</th>
              <th style={{ width: '18%', textAlign: 'right' }}>Amount</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Bank</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Cheque Date</th>
              <th style={{ width: '15%', textAlign: 'center' }}>Cheque Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.srNo}-${row.receiptNo}-${row.chequeNo}`}>
                <td style={{ textAlign: 'center' }}>{row.srNo}</td>
                <td style={{ textAlign: 'center' }}>{row.receiptNo}</td>
                <td style={{ textAlign: 'center' }}>{row.chequeNo}</td>
                <td style={{ textAlign: 'right' }}>{Number(row.amount || 0).toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'center' }}>{row.bank}</td>
                <td style={{ textAlign: 'center' }}>{row.chequeDate}</td>
                <td style={{ textAlign: 'center' }}>{row.status}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <td colSpan={3} style={{ textAlign: 'right' }}>Total</td>
              <td style={{ textAlign: 'right' }}>{totals.amount.toLocaleString('en-IN')}</td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '10px', fontSize: '10px', lineHeight: '1.4' }}>
          <div>*Subject to realization of cheque/draft.</div>
          <div>*Terms and conditions applied.</div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '11px', fontWeight: 'bold' }}>
          Authorized Signatory
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '6px', textAlign: 'center', fontSize: '10px' }}>
          <div>
            <strong>Corporate Office:</strong> 101/A, 4th Floor, Opp. TNN News Plus, Near Syndicate Bank,
            Journalist Colony, Road No.70, Jubilee Hills, Hyderabad- 500033., Phone: 040-2352 9999
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintStatement;

