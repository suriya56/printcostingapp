import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quotation } from '../types';

export const generateQuotationPDF = (quote: Quotation) => {
  const doc = new jsPDF();
  
  // Header: Logo / Company Info
  doc.setFontSize(28);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(20, 184, 166); // Teal/Green
  doc.text("Dream", 14, 25);
  doc.setTextColor(236, 72, 153); // Pink
  doc.text("Big", 52, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // Black
  doc.text("printing professionals", 14, 30);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("No. 408/1, Kotte Road, Pitakotte, Sri Lanka", 14, 38);
  doc.text("Phone: +94 11 281 5454 • +94 77 756 7890 | Email: info@dreambigprinters.com", 14, 42);
  doc.text("Web: www.dreambigprinters.com", 14, 46);
  
  // Header Right
  doc.setFontSize(18);
  doc.setTextColor(236, 72, 153); // Pink
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION", 196, 25, { align: "right" });
  
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref: FQC-${new Date(quote.date).getFullYear()}-${quote.id.substring(0,4)}`, 196, 32, { align: "right" });
  doc.text(`Date: ${new Date(quote.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, 196, 37, { align: "right" });
  doc.text(`Validity: 30 Days (from issue date)`, 196, 42, { align: "right" });
  
  doc.setTextColor(22, 163, 74);
  doc.setFont("helvetica", "bold");
  doc.text(`Status: `, 175, 47, { align: "right" });
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Approved`, 196, 47, { align: "right" });

  // Divider line
  doc.setDrawColor(236, 72, 153);
  doc.setLineWidth(0.5);
  doc.line(14, 52, 196, 52);
  
  // Grey boxes area
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 60, 182, 35, 3, 3, "FD");
  
  // Left Box
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); 
  doc.setFont("helvetica", "bold");
  doc.text("PREPARED FOR:", 20, 68);
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(quote.customerName || "Valued Client", 20, 75);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("Authorized Customer Reference", 20, 82);
  
  // Vertical line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(100, 65, 100, 90);
  
  // Right Box
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT OVERVIEW:", 105, 68);
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(quote.jobName || "Custom Project", 105, 75); 
  
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  
  const quantity = quote.inputs.quantity;
  const pages = quote.mode === 'B' ? quote.inputs.modeB?.totalPages : 1;
  const printSides = quote.mode === 'A' ? (quote.inputs.modeA?.printSides === 'both' ? 'Front & Back' : 'Front Only') : 'Front & Back';
  
  doc.text(`Total Quantity: ${quantity.toLocaleString()} units`, 105, 82);
  doc.text(`Total Pages: ${pages}`, 155, 82);
  doc.text(`Print Sides: ${printSides}`, 105, 88);
  doc.text(`Color Type: Multicolor`, 155, 88);

  // ITEMIZED QUOTATION BREAKDOWN
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("ITEMIZED QUOTATION BREAKDOWN", 14, 105);
  
  // Table
  const tableData: any[][] = [];
  const ppCosts = quote.mode === 'A' ? quote.inputs.modeA?.postPressCosts : quote.inputs.modeB?.postPressCosts;
  const ppDetails = ppCosts && ppCosts.length > 0 ? ppCosts.map((c: any) => c.name === 'Others' ? (c.otherName || 'Others') : c.name).join(', ') : 'Scoring, binding, pack & transportation charges';
  
  if (quote.mode === 'A') {
    tableData.push([
      "1.1",
      `Paper Stock Supply`,
      `${(quote.results?.fullSheets || 0).toFixed(1)} full sheets x Rs. ${((quote.results?.paperCost || 0) / (quote.results?.fullSheets || 1)).toFixed(2)} / sheet`,
      `Rs. ${(quote.results?.paperCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "2",
      "Commercial Offset Printing",
      `${(quote.results?.impressions || 0).toLocaleString()} impressions calculated`,
      `Rs. ${(quote.results?.printingCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "3",
      "Plates Setup & Development",
      `${quote.results?.platesCount || 0} plates developed`,
      `Rs. ${(quote.results?.plateCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "4",
      "Post-Press Finishing & Delivery",
      `${ppDetails}`,
      `Rs. ${(quote.results?.miscCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
  } else {
    tableData.push([
      "1.1",
      `Inner Paper Stock`,
      `${(quote.results?.fullSheetsInner || 0).toFixed(1)} full sheets`,
      `Rs. ${(quote.results?.innerPaperCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "1.2",
      `Wrapper Paper Stock`,
      `${(quote.results?.fullSheetsWrapper || 0).toFixed(1)} full sheets`,
      `Rs. ${(quote.results?.wrapperPaperCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "1.3",
      `Lamination`,
      `Covers Lamination (${(quote.results?.laminationAreaSqIn || 0).toFixed(1)} sq in)`,
      `Rs. ${(quote.results?.laminationCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "2",
      "Commercial Offset Printing",
      `${(quote.results?.impressions || 0).toLocaleString()} impressions calculated`,
      `Rs. ${(quote.results?.printingCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "3",
      "Plates Setup & Development",
      `${quote.results?.platesCount || 0} plates developed`,
      `Rs. ${(quote.results?.plateCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
    tableData.push([
      "4",
      "Post-Press Finishing & Delivery",
      `${ppDetails}`,
      `Rs. ${(quote.results?.miscCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ]);
  }

  // add Manufacturing Subtotal
  tableData.push([
    "",
    "",
    "Manufacturing Subtotal:",
    `Rs. ${(quote.results?.totalProductionCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  ]);
  
  // Profit margin
  const marginAmt = (quote.results?.finalTotalPrice || 0) - (quote.results?.totalProductionCost || 0);
  tableData.push([
    "",
    "",
    `Profit Margin Markup (${quote.inputs.marginPercent}%):`,
    `+Rs. ${marginAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
  ]);

  autoTable(doc, {
    startY: 110,
    head: [['NO.', 'ITEM DESCRIPTION', 'DETAILS / CALCULATION BASIS', 'SUBTOTAL (RS.)']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [50, 50, 50],
      font: 'helvetica',
    },
    headStyles: {
      textColor: [100, 116, 139],
      fontStyle: 'bold',
      fillColor: [241, 245, 249],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
      2: { cellWidth: 70, halign: 'right', font: 'courier' }, 
      3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    },
    didDrawCell: function(data) {
      // Custom draw if needed
    },
    willDrawCell: function(data) {
      if (data.row.section === 'body') {
        const rowIndex = data.row.index;
        const isSubtotal = tableData[rowIndex][2].includes('Manufacturing Subtotal');
        const isMargin = tableData[rowIndex][2].includes('Profit Margin');
        
        if (isSubtotal) {
          data.cell.styles.fontStyle = 'bold';
          if (data.column.index === 2) {
            data.cell.styles.halign = 'right';
            data.cell.styles.font = 'helvetica';
          }
        }
        if (isMargin) {
          data.cell.styles.textColor = [225, 29, 72]; // Rose 600
          data.cell.styles.fontStyle = 'bold';
          if (data.column.index === 2) {
            data.cell.styles.halign = 'right';
            data.cell.styles.font = 'helvetica';
          }
        }
      }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  // Grand total section
  doc.setFillColor(253, 242, 248); // Pink 50
  doc.rect(14, finalY, 182, 20, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total Payable:", 150, finalY + 12, { align: "right" });
  
  doc.setFontSize(14);
  doc.setTextColor(236, 72, 153); // Pink
  doc.text(`Rs.\n${(quote.results?.finalTotalPrice || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 190, finalY + 8, { align: "right" });

  // Guaranteed unit price box
  const guppY = finalY + 30;
  doc.setFillColor(240, 253, 244); // Green 50
  doc.roundedRect(14, guppY, 182, 20, 3, 3, "F");
  
  doc.setFontSize(10);
  doc.setTextColor(22, 163, 74); // Green 600
  doc.setFont("helvetica", "bold");
  doc.text("GUARANTEED UNIT PRICE", 20, guppY + 9);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Per piece rate calculated based on economy of scale", 20, guppY + 14);
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${(quote.results?.perPieceCost || 0).toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3})}`, 190, guppY + 10, { align: "right" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`for ${quantity.toLocaleString()} units`, 190, guppY + 14, { align: "right" });

  // Technical Calculation Parameters box
  const techY = guppY + 30;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, techY, 182, 25, 3, 3, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("TECHNICAL CALCULATION PARAMETERS", 20, techY + 8);
  
  doc.setFont("helvetica", "normal");
  doc.text("Feeding Sheets:", 20, techY + 15);
  doc.setFont("courier", "normal");
  doc.text(`${(quote.results?.feedingSheets || 0).toLocaleString()} sheets`, 20, techY + 20);

  doc.setFont("helvetica", "normal");
  doc.text("Full Sheets:", 80, techY + 15);
  doc.setFont("courier", "normal");
  doc.text(`${(quote.results?.fullSheets || 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})} sheets`, 80, techY + 20);

  doc.setFont("helvetica", "normal");
  doc.text("Impressions:", 140, techY + 15);
  doc.setFont("courier", "normal");
  doc.text(`${(quote.results?.impressions || 0).toLocaleString()} imp`, 140, techY + 20);

  // Terms and Conditions & Signatures
  const termsY = techY + 40;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("TERMS & CONDITIONS", 14, termsY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("• Pricing includes layout sizing and technical division parameters specified.", 14, termsY + 6);
  doc.text("• Deliverables will be packed and shipped to the logged client destination.", 14, termsY + 11);
  doc.text("• This is an official digital estimate valid for 30 calendar days from the date of issue.", 14, termsY + 16);

  // Signatures
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.line(120, termsY + 13, 150, termsY + 13);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("AUTHORIZED SIGNATORY", 135, termsY + 17, { align: "center" });

  doc.line(160, termsY + 13, 196, termsY + 13);
  doc.text("CLIENT ACCEPTANCE", 178, termsY + 17, { align: "center" });
  
  doc.save(`Quotation_${quote.customerName}_${quote.id.slice(-6)}.pdf`);
};
