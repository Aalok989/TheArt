import React, { useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import giriLogo from '../../assets/giri.png';
import artLogo from '../../assets/logo.png';

const defaultStages = [
  {
    id: 'bookingAdvance',
    label: 'Booking Advance',
    percentage: '10%',
    installmentAmount: 805020,
    tdsGhpl: 37891,
    tdsOrchid: 2249,
    gstGhpl: 52528,
    gstOrchid: 14993
  },
  {
    id: 'agreementOfSale',
    label: 'At the time of Agreement of Sale',
    percentage: '20%',
    installmentAmount: 1610040,
    tdsGhpl: 75600,
    tdsOrchid: 4500,
    gstGhpl: 105056,
    gstOrchid: 29986
  },
  {
    id: 'completion5thSlab',
    label: 'Completion of 5th Slab',
    percentage: '25%',
    installmentAmount: 2012550,
    tdsGhpl: 94500,
    tdsOrchid: 5625,
    gstGhpl: 131320,
    gstOrchid: 37500
  },
  {
    id: 'firstStageInternal',
    label: 'Completion of First Stage of Internal works',
    percentage: '5%',
    installmentAmount: 402510,
    tdsGhpl: 18900,
    tdsOrchid: 1125,
    gstGhpl: 26264,
    gstOrchid: 7497
  }
];

const bankInstructions = {
  installment: {
    payeeName: 'GIRIDHARI HOMES PVT LTD AND ORCHID ENTERPRISES ACCOUNT PROJECT THE ART',
    bank: 'HDFC BANK',
    account: '57500000303279',
    ifsc: 'HDFC0009817',
    branch: 'BANJARA HILLS BRANCH'
  },
  tds: {
    payeeName: 'GHPL PAN CARD: AADCG7151H / ORCHID PAN CARD: AABFO9650A'
  },
  gstGhpl: {
    payeeName: 'GIRIDHARI HOMES PVT LTD',
    bank: 'ICICI BANK',
    branch: 'ROAD NO.70, JUBILEE HILLS BRANCH',
    account: '000765009853',
    ifsc: 'ICIC0000070'
  },
  gstOrchid: {
    payeeName: 'ORCHID ENTERPRISES A/C GST BANK',
    bank: 'HDFC BANK LTD',
    branch: 'ANDHERI - WEST, LOKHANDWALA',
    account: '50200002301684',
    ifsc: 'HDFC0000159'
  }
};

const IndividualDemand = ({
  demandInfo = {},
  stages = defaultStages,
  selectedStageIds = []
}) => {
  const componentRef = useRef();
  const [selectedStages, setSelectedStages] = useState(
    selectedStageIds.length > 0
      ? stages.filter((stage) => selectedStageIds.includes(stage.id))
      : stages.slice(0, 1)
  );

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 });

  const totals = useMemo(() => {
    return selectedStages.reduce(
      (acc, stage) => {
        acc.installment += Number(stage.installmentAmount || 0);
        acc.tdsGhpl += Number(stage.tdsGhpl || 0);
        acc.tdsOrchid += Number(stage.tdsOrchid || 0);
        acc.gstGhpl += Number(stage.gstGhpl || 0);
        acc.gstOrchid += Number(stage.gstOrchid || 0);
        return acc;
      },
      { installment: 0, tdsGhpl: 0, tdsOrchid: 0, gstGhpl: 0, gstOrchid: 0 }
    );
  }, [selectedStages]);

  const constructionStageText = useMemo(() => {
    return selectedStages
      .map((stage) => `${stage.label} (${stage.percentage})`)
      .join(', ');
  }, [selectedStages]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Individual Demand - ${demandInfo?.flatNo || ''}`
  });

  const handleEmail = async () => {
    try {
      const element = componentRef.current;
      if (!element) return;

      const filename = `Individual_Demand_${demandInfo?.flatNo || 'Flat'}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
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
        const subject = encodeURIComponent(
          `Individual Demand Letter - ${demandInfo?.flatNo || ''}`
        );
        const body = encodeURIComponent(
          `Dear ${demandInfo?.customerName || 'Customer'},\n\n` +
            `Please find attached the individual demand letter.\n\n` +
            `Thank you,\nGiridhari Homes Pvt. Ltd.`
        );

        const gmailUrl = demandInfo?.email
          ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              demandInfo.email
            )}&su=${subject}&body=${body}`
          : `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

        window.open(gmailUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const todayStr = new Date().toLocaleDateString('en-GB');

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          margin: '10px',
          marginBottom: '15px',
          position: 'relative',
          zIndex: 10003
        }}
      >
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
            zIndex: 10003
          }}
          title="Send Email"
        >
          Email
        </button>
      </div>

      <div
        ref={componentRef}
        style={{
          width: '210mm',
          minHeight: '297mm',
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
            .individual-demand-table { width:100%; border-collapse:collapse; border:1px solid #333; margin-top:10px; }
            .individual-demand-table th, .individual-demand-table td { padding:6px; border:1px solid #333; vertical-align:top; }
            .individual-demand-table thead { display: table-header-group; }
            .individual-demand-table tr { page-break-inside: avoid; break-inside: avoid; }
            .page-header { display: none; }
            .page-footer { display: none; }
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
              .page-header { display: block; }
              .page-footer { display: block; }
            }
          `}
        </style>

        <div className="page-header">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              width: '100%'
            }}
          >
            <div style={{ flex: '0 0 auto' }}>
              <img
                src={giriLogo}
                alt="Giridhari Homes"
                style={{ maxWidth: '200px', height: 'auto', display: 'block' }}
              />
            </div>
            <div
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <img
                src={artLogo}
                alt="THE Art"
                style={{ maxWidth: '150px', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '8px', marginBottom: '12px', lineHeight: '1.8' }}>
          <div>To,</div>
          <div>{demandInfo?.customerName || 'Customer Name'}</div>
          {demandInfo?.coApplicant ? <div>{demandInfo.coApplicant}</div> : null}
          <div style={{ marginTop: '6px', textAlign: 'right' }}>Date: {todayStr}</div>
        </div>

        <div style={{ marginBottom: '10px', lineHeight: '1.6' }}>
          <p>Dear Sir/Mam,</p>
          <p style={{ marginBottom: '6px' }}>
            <strong>
              Sub: Demand Letter for release of payment - Reg.{' '}
              {selectedStages[0]?.label || ''}
            </strong>
          </p>
          <p style={{ marginBottom: '6px' }}>
            Ref: Flat No. {demandInfo?.flatNo || ''}, on {demandInfo?.floor || 'Ground'} FLOOR,
            BLOCK {demandInfo?.block || ''} - Giridhari Homes Pvt Ltd & Orchid Enterprises - The
            Art Project booked in name of {demandInfo?.customerName || 'Customer Name'}.
          </p>
          <p style={{ marginBottom: '6px', textAlign: 'justify' }}>
            This is in reference to the above flat booked in the Project - <strong>Giridhari Homes Pvt Ltd & Orchid Enterprises</strong> - The Art Project situated at <strong>Survey No. 29/2, BANDLAGUDA JAGIR & G.P., Rajendra Mandal, Ranga Reddy District</strong>. This is to inform you that the Project Work Progress is as per schedule and in full swing. Hence you are requested to release the payment as per the Schedule of the payments as mentioned below. Your timely payment will help us to complete the project as per the schedule.
          </p>
        </div>

        <table className="individual-demand-table" cellSpacing="0">
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
              <th style={{ width: '25%' }}>Construction Stage</th>
              <th style={{ width: '35%' }}>{constructionStageText || 'N/A'}</th>
              <th style={{ width: '40%' }}>The Cheque / PO shall be prepared as hereunder:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Installment Amount</strong>
              </td>
              <td>
                Rs. {formatCurrency(totals.installment)}/-
              </td>
              <td>
                <div>
                  <strong>Payee&apos;s Name:</strong> {bankInstructions.installment.payeeName}
                </div>
                <div>
                  <strong>Bank Name:</strong> {bankInstructions.installment.bank}
                </div>
                <div>
                  <strong>Bank Account No.:</strong> {bankInstructions.installment.account}
                </div>
                <div>
                  <strong>IFSC CODE:</strong> {bankInstructions.installment.ifsc}
                </div>
                <div>
                  <strong>Branch:</strong> {bankInstructions.installment.branch}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <strong>TDS 0.75% (Please deduct TDS and remit the balance)</strong>
              </td>
              <td>
                <div>Rs. {formatCurrency(totals.tdsGhpl + totals.tdsOrchid)}/-</div>
                <div>GHPL: Rs. {formatCurrency(totals.tdsGhpl)}/-</div>
                <div>ORCHID: Rs. {formatCurrency(totals.tdsOrchid)}/-</div>
              </td>
              <td>
                <div>
                  <strong>GHPL PAN CARD:</strong> AADCG7154H
                </div>
                <div>
                  <strong>ORCHID PAN CARD:</strong> AABFO5695A
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <strong>GST Amount (GHPL)</strong>
              </td>
              <td>
                Rs. {formatCurrency(totals.gstGhpl)}/-
              </td>
              <td>
                <div>
                  <strong>Payee&apos;s Name:</strong> {bankInstructions.gstGhpl.payeeName}
                </div>
                <div>
                  <strong>Bank Name:</strong> {bankInstructions.gstGhpl.bank}
                </div>
                <div>
                  <strong>Bank Account No.:</strong> {bankInstructions.gstGhpl.account}
                </div>
                <div>
                  <strong>IFSC CODE:</strong> {bankInstructions.gstGhpl.ifsc}
                </div>
                <div>
                  <strong>Branch:</strong> {bankInstructions.gstGhpl.branch}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <strong>GST Amount (ORCHID)</strong>
              </td>
              <td>
                Rs. {formatCurrency(totals.gstOrchid)}/-
              </td>
              <td>
                <div>
                  <strong>Payee&apos;s Name:</strong> {bankInstructions.gstOrchid.payeeName}
                </div>
                <div>
                  <strong>Bank Name:</strong> {bankInstructions.gstOrchid.bank}
                </div>
                <div>
                  <strong>Bank Account No.:</strong> {bankInstructions.gstOrchid.account}
                </div>
                <div>
                  <strong>IFSC CODE:</strong> {bankInstructions.gstOrchid.ifsc}
                </div>
                <div>
                  <strong>Branch:</strong> {bankInstructions.gstOrchid.branch}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '12px', fontWeight: 'bold' }}>
          Total Installment Amount: Rs. {formatCurrency(totals.installment)}
        </div>
        <div style={{ marginBottom: '12px', fontSize: '11px' }}>
          Note: Please ensure TDS and GST payments are made separately as specified above.
        </div>

        <div style={{ marginBottom: '10px', lineHeight: '1.6', textAlign: 'justify' }}>
          Note: Sale agreement clause 1.10 (If the allottee delays in payment towards any amount which is payable he shall be liable to pay interest)
        </div>

        <div style={{ marginBottom: '10px', lineHeight: '1.6' }}>
          Kindly do the needful at the earliest.
        </div>

        <div style={{ lineHeight: '1.6' }}>
          Thanks & Regards,
          <br />
          Yours Truly,
          <br />
          For Giridhari Homes Pvt Ltd & Orchid Enterprises
        </div>

        <div style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'right' }}>
          Authorised Signatory
        </div>

        <div className="page-footer" style={{ marginTop: 'auto' }}>
          <div
            style={{
              borderTop: '1px solid #333',
              paddingTop: '6px',
              textAlign: 'center',
              fontSize: '10px',
              marginTop: '12px'
            }}
          >
            <div>
              <strong>Corporate Office:</strong> 101/A, 4th Floor, Opp. TNN News Plus, Near Syndicate
              Bank, Journalist Colony, Road No.70, Jubilee Hills, Hyderabad- 500033., Phone:
              040-2352 9999
            </div>
            <div>For any clarification please contact @ 8008066444.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualDemand;

