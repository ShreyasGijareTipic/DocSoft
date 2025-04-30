import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generates a clinic receipt PDF based on the provided data
 * @param {Object} data - Receipt data 
 */
export const generateClinicReceiptPDF = (data) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;
    
    // Add receipt header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINIC REGISTRATION RECEIPT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Add logo if available
    // Note: We don't have access to actual logo files here, but this structure would support it
    // if (clinicLogo) {
    //   doc.addImage(clinicLogo, 'PNG', 15, yPos, 50, 20);
    // }
    
    // Clinic information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Clinic Name: ${data.clinic_name}`, 15, yPos + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Address: ${data.clinic_address}`, 15, yPos + 16);
    doc.text(`Mobile: ${data.clinic_mobile}`, 15, yPos + 22);
    yPos += 30;
    
    // Receipt information
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Receipt Information', 15, yPos);
    yPos += 7;
    
    // Draw line
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;
    
    // Receipt details in two columns
    doc.setFont('helvetica', 'normal');
    const leftCol = 15;
    const rightCol = pageWidth / 2 + 10;
    
    // Left column
    doc.text(`Receipt ID: ${data.receipt_id || '-'}`, leftCol, yPos);
    yPos += 7;
    doc.text(`Transaction ID: ${data.transaction_id}`, leftCol, yPos);
    yPos += 7;
    doc.text(`Transaction Date: ${formatDate(data.transaction_date)}`, leftCol, yPos);
    yPos -= 14; // Reset y position for right column
    
    // Right column
    doc.text(`Plan Name: ${data.plan_name}`, rightCol, yPos);
    yPos += 7;
    doc.text(`Valid Till: ${formatDate(data.valid_till)}`, rightCol, yPos);
    yPos += 7;
    doc.text(`Status: ${data.transaction_status === 'success' ? 'Paid' : data.transaction_status}`, rightCol, yPos);
    yPos += 15;
    
    // Payment Details section
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 15, yPos);
    yPos += 7;
    
    // Draw line
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;
    
    // Use a table for payment breakdown
    const paymentTableData = [
      ['Description', 'Amount (₹)'],
      ['Subscription Fee', formatCurrency(data.total_amount)],
      ['GST (18%)', formatCurrency(data.gst)],
      ['Total Amount', formatCurrency(data.payable_amount)]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [paymentTableData[0]],
      body: paymentTableData.slice(1),
      margin: { left: 15, right: 15 },
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202], textColor: 255 },
      styles: { fontSize: 10 }
    });
    
    yPos = doc.previousAutoTable.finalY + 20;
    
    // Terms and conditions
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated receipt and does not require a physical signature.', 15, yPos);
    yPos += 5;
    doc.text('For any queries regarding this receipt, please contact support.', 15, yPos);
    
    // Save PDF with a meaningful filename
    const filename = `Clinic_Receipt_${data.clinic_name.replace(/\s+/g, '_')}_${formatDateForFilename(data.transaction_date)}.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Format date for display
 * @param {string} dateString 
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'dd-MM-yyyy');
  } catch (e) {
    return dateString || 'N/A';
  }
};

/**
 * Format date for filename
 * @param {string} dateString 
 * @returns {string} Formatted date for filename
 */
const formatDateForFilename = (dateString) => {
  try {
    if (!dateString) return 'unknown_date';
    const date = new Date(dateString);
    return format(date, 'yyyyMMdd');
  } catch (e) {
    return 'unknown_date';
  }
};

/**
 * Format currency value
 * @param {number} value 
 * @returns {string} Formatted currency
 */
const formatCurrency = (value) => {
  try {
    return value ? value.toLocaleString('en-IN') : '0';
  } catch (e) {
    return '0';
  }
};