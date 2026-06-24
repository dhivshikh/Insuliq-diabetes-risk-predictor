import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type PredictionResponse, type PatientData } from '../services/api';

// --- Color Constants (RGB) ---
const COLOR_PRIMARY: [number, number, number] = [11, 85, 99]; // Deep medical teal (#0B5563)
const COLOR_ACCENT: [number, number, number] = [14, 124, 134]; // Lighter teal (#0E7C86)
const COLOR_TEXT_DARK: [number, number, number] = [26, 26, 26]; // Dark charcoal (#1A1A1A)
const COLOR_TEXT_LIGHT: [number, number, number] = [113, 113, 122]; // Gray (#71717A)
const COLOR_NORMAL: [number, number, number] = [46, 125, 50]; // Green (#2E7D32)
const COLOR_MEDIUM: [number, number, number] = [184, 134, 11]; // Amber (#B8860B)
const COLOR_HIGH: [number, number, number] = [198, 40, 40]; // Red (#C62828)
const COLOR_BG_LIGHT: [number, number, number] = [245, 247, 250]; // Light grey band (#F5F7FA)

const MARGIN = 15;

/**
 * Draws the top full-width header band
 */
const drawHeaderBand = (doc: jsPDF, pageWidth: number, reportId: string, dateStr: string) => {
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 25, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('InsuliQ', MARGIN, 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('AI-Assisted Diabetes Risk Assessment', MARGIN, 18);

  doc.setFontSize(9);
  doc.text(`Report ID: ${reportId}`, pageWidth - MARGIN, 12, { align: 'right' });
  doc.text(`Date: ${dateStr}`, pageWidth - MARGIN, 18, { align: 'right' });

  // Thin accent line below header
  doc.setDrawColor(...COLOR_ACCENT);
  doc.setLineWidth(0.5);
  doc.line(0, 25, pageWidth, 25);
};

/**
 * Draws the bordered patient info panel
 */
const drawPatientInfoPanel = (doc: jsPDF, patientData: PatientData, pageWidth: number, startY: number): number => {
  const panelHeight = 25;
  
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(MARGIN, startY, pageWidth - (MARGIN * 2), panelHeight, 'FD');

  const midX = pageWidth / 2;
  const textYTop = startY + 8;
  const textYBot = startY + 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEXT_LIGHT);
  
  doc.text('PATIENT NAME', MARGIN + 5, textYTop);
  doc.text('REPORT GENERATED ON', midX + 5, textYTop);
  doc.text('AGE / GENDER', MARGIN + 5, textYBot);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_DARK);

  const nameText = patientData.name && patientData.name.trim() !== '' ? patientData.name : 'Not Provided';
  doc.text(nameText, MARGIN + 35, textYTop);
  doc.text(new Date().toLocaleDateString(), midX + 45, textYTop);
  doc.text(`${patientData.age} Years / ${patientData.gender}`, MARGIN + 35, textYBot);

  return startY + panelHeight;
};

/**
 * Draws a standard section heading
 */
const drawSectionHeading = (doc: jsPDF, text: string, yPos: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(text.toUpperCase(), MARGIN, yPos);
  
  // Underline
  const textWidth = doc.getTextWidth(text.toUpperCase());
  doc.setDrawColor(...COLOR_ACCENT);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, yPos + 2, MARGIN + textWidth, yPos + 2);
  
  return yPos + 10;
};

/**
 * Maps string status to RGB color tuple
 */
const getStatusRgb = (status: string): [number, number, number] => {
  if (status === 'Normal') return COLOR_NORMAL;
  if (status === 'Low' || status === 'Medium') return COLOR_MEDIUM;
  if (status === 'High') return COLOR_HIGH;
  return COLOR_TEXT_DARK;
};

export const generatePDFReport = (patientData: PatientData, result: PredictionResponse) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const reportId = `RPT-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}-${Math.floor(Math.random() * 10000)}`;
  const dateStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();

  // Draw Header
  drawHeaderBand(doc, pageWidth, reportId, dateStr);

  let yPos = 35; // Start below header

  // Patient Info
  yPos = drawPatientInfoPanel(doc, patientData, pageWidth, yPos) + 15;

  // --- RISK ASSESSMENT SUMMARY ---
  yPos = drawSectionHeading(doc, 'Risk Assessment Summary', yPos);
  
  // Risk Box
  const isHighRisk = result.riskLevel === 'High';
  const riskColor = isHighRisk ? COLOR_HIGH : COLOR_NORMAL;
  
  doc.setDrawColor(...riskColor);
  doc.setLineWidth(0.5);
  doc.rect(MARGIN, yPos, 45, 10);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...riskColor);
  doc.text(`RISK LEVEL: ${result.riskLevel.toUpperCase()}`, MARGIN + 4, yPos + 6.5);

  // Confidence text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_TEXT_DARK);
  doc.text(`Confidence: ${Math.round(result.probability * 100)}%`, MARGIN + 55, yPos + 6.5);

  yPos += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_DARK);
  const splitMessage = doc.splitTextToSize(result.message, pageWidth - (MARGIN * 2));
  doc.text(splitMessage, MARGIN, yPos);
  
  yPos += (splitMessage.length * 5) + 10;

  // --- DETAILED PARAMETER ANALYSIS ---
  yPos = drawSectionHeading(doc, 'Detailed Parameter Analysis', yPos);

  const tableData = result.parameterBreakdown.map(p => [
    p.parameter,
    `${p.patientValue} ${p.unit}`,
    p.normalRange,
    p.status.toUpperCase(),
    p.status === 'Normal' ? '—' : p.recommendation
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['PARAMETER', 'YOUR VALUE', 'NORMAL RANGE', 'RESULT LEVEL', 'REMARKS']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLOR_TEXT_DARK,
    },
    alternateRowStyles: {
      fillColor: COLOR_BG_LIGHT
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      3: { fontStyle: 'bold' } // Result level column
    },
    margin: { left: MARGIN, right: MARGIN },
    didParseCell: function (data) {
      // Color-code the RESULT LEVEL column (index 3)
      if (data.section === 'body' && data.column.index === 3) {
        const rawStatus = result.parameterBreakdown[data.row.index].status;
        data.cell.styles.textColor = getStatusRgb(rawStatus);
      }
    }
  });

  // @ts-expect-error - jspdf-autotable adds lastAutoTable to doc
  yPos = doc.lastAutoTable.finalY + 15;

  // --- CLINICAL RECOMMENDATIONS ---
  // Check if we need a new page for recommendations
  if (yPos > pageHeight - 50) {
    doc.addPage();
    drawHeaderBand(doc, pageWidth, reportId, dateStr);
    yPos = 35;
  }

  yPos = drawSectionHeading(doc, 'Clinical Recommendations', yPos);

  const flaggedParams = result.parameterBreakdown.filter(p => p.status !== 'Normal' && p.recommendation);

  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_DARK);
  
  if (flaggedParams.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('All parameters are within normal range. Continue maintaining a healthy lifestyle.', MARGIN, yPos);
  } else {
    flaggedParams.forEach((param, index) => {
      // Check page break during loop
      if (yPos > pageHeight - 30) {
        doc.addPage();
        drawHeaderBand(doc, pageWidth, reportId, dateStr);
        yPos = 35;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${param.parameter}:`, MARGIN, yPos);
      
      doc.setFont('helvetica', 'normal');
      const recText = doc.splitTextToSize(param.recommendation, pageWidth - MARGIN - 40);
      doc.text(recText, MARGIN + 35, yPos);
      
      yPos += (recText.length * 5) + 2;
    });
  }

  // --- FOOTER (All Pages) ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Top border line for footer
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, pageHeight - 15, pageWidth - MARGIN, pageHeight - 15);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    
    const disclaimer = "Generated by InsuliQ — for informational purposes only, not a medical diagnosis.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - MARGIN * 2 - 20);
    
    doc.text(splitDisclaimer, MARGIN, pageHeight - 11);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - MARGIN, pageHeight - 11, { align: 'right' });
    doc.text('InsuliQ', pageWidth - MARGIN, pageHeight - 8, { align: 'right' });
  }

  doc.save('InsuliQ_Report.pdf');
};
