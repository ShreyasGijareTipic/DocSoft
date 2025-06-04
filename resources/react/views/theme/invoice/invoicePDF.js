// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export function generatePDF(
//     grandTotal,
//     invoiceNo,
//     patient_name,
//     formData,
//     remainingAmount,
//     totalAmountWords,
//     descriptions,
//     doctorData,
//     clinicData,
//     healthDirectives,
//     patientExaminations,
//     billId,
//     billDate, // Changed from DeliveryDate to billDate for clarity
//     totalAmount,
//     isWhatsAppShare = false
// ) {
//     try {
//         const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//         const marginLeft = 15;
//         let y = 20;
//         const lineHeight = 7;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(0);
//             pdf.setLineWidth(0.5);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
//         }

//         function drawHeader() {
//             y = 10;
//             const logoSize = 40;
//             const leftMargin = marginLeft;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous"; // Handle CORS issues
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(16);
//             pdf.setFont("times", "bold");
//             pdf.text(clinicData?.clinic_name || "Clinic Name", pageWidth / 2, y + 7, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 5, { align: "right" });

//             const addressText = `Address: ${clinicData?.clinic_address || "N/A"}`;
//             const addressLines = pdf.splitTextToSize(addressText, 50);
//             addressLines.forEach((line, index) => {
//                 pdf.text(line, rightMargin, y + 10 + index * 5, { align: "right" });
//             });

//             const addressHeight = addressLines.length * 5;
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 10 + addressHeight, { align: "right" });

//             y += logoSize + addressHeight;
//             pdf.setDrawColor(0);
//             pdf.setLineWidth(0.5);
//             pdf.line(10, y-10, pageWidth - 10, y-10);
//             y += 8;
//         }

//         function drawPatientAndDoctorDetails() {
//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;
//             const lineSpacing = 5;

//             pdf.setDrawColor(0);
//             pdf.setFontSize(13);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 6);
//             pdf.setFontSize(11);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             pdf.setFontSize(13);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
//             pdf.setFontSize(11);
//             pdf.text(`Doctor Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * lineSpacing);
//             });

//             const eduOffset = educationLines.length * lineSpacing;
//             let boxHeight = 12 + eduOffset + 15;

//             pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             pdf.rect(doctorBoxX, y, boxWidth, boxHeight);
//             pdf.rect(patientBoxX, y, boxWidth, boxHeight);
//             y += boxHeight + lineHeight;

//             pdf.setFontSize(12);
//             pdf.text(`Bill No: ${billId || invoiceNo}`, marginLeft, y);
            
//             // Handle date formatting properly
//             let formattedDate = "Date Not Available";
//             if (formData?.visit_date) {
//                 formattedDate = formData.visit_date.includes("-") ? 
//                     formData.visit_date.split("-").reverse().join("-") : 
//                     formData.visit_date;
//             } else if (billDate) {
//                 formattedDate = billDate.includes("-") ? 
//                     billDate.split("-").reverse().join("-") : 
//                     billDate;
//             }
            
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
            
//             // Add delivery date if it's type 2 invoice
//             if (formData?.InvoiceType === 2 && formData?.DeliveryDate) {
//                 const deliveryFormatted = formData.DeliveryDate.includes("-") ? 
//                     formData.DeliveryDate.split("-").reverse().join("-") : 
//                     formData.DeliveryDate;
//                 pdf.text(`Delivery Date: ${deliveryFormatted}`, marginLeft, y + lineHeight * 2);
//                 y += lineHeight * 3;
//             } else {
//                 y += lineHeight * 2;
//             }
//         }

//         function drawPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return;
        
//             const patientData = patientExaminations[0] || {};
//             const fields = [
//                 { label: "BP", value: patientData?.bp },
//                 { label: "Pulse", value: patientData?.pulse },
//                 { label: "Height", value: patientData?.height },
//                 { label: "Weight", value: patientData?.weight },
//                 { label: "Past History", value: patientData?.past_history },
//                 { label: "Complaints", value: patientData?.complaints },
//                 { label: "Systemic Examination", value: patientData?.systemic_exam_general },
//                 { label: "Diagnosis", value: patientData?.systemic_exam_pa }
//             ];
        
//             // Filter out N/A, null, undefined, or empty values
//             const validFields = fields.filter(f => f.value && f.value !== "N/A" && f.value.toString().trim() !== "");
        
//             if (validFields.length === 0) return;
        
//             // Check if we need a new page
//             if (y > pageHeight - 100) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = 20;
//             }
        
//             pdf.setFontSize(13);
//             pdf.text("Medical Observation:", marginLeft, y);
//             y += lineHeight;
        
//             const bodyData = validFields.map(field => [
//                 { content: field.label, styles: { fontStyle: "bold", halign: "left" } },
//                 field.value
//             ]);
        
//             pdf.autoTable({
//                 startY: y,
//                 head: [["Field", "Value"]],
//                 body: bodyData,
//                 theme: "grid",
//                 styles: { fontSize: 10, font: "times", halign: "left" },
//                 headStyles: { fillColor: [173, 216, 230] },
//             });
        
//             y = pdf.autoTable.previous.finalY + lineHeight;
//         }
        
//         function drawBillingDetails() {
//             // Check if we need a new page
//             if (y > pageHeight - 150) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = 20;
//             }

//             pdf.setFontSize(13);
//             pdf.text("Billing Details:", marginLeft, y);
//             y += lineHeight;

//             // Ensure descriptions is an array and has content
//             const billingData = Array.isArray(descriptions) && descriptions.length > 0 ? descriptions : [];
            
//             if (billingData.length === 0) {
//                 pdf.setFontSize(11);
//                 pdf.text("No billing items found.", marginLeft, y);
//                 y += lineHeight * 2;
//                 return;
//             }

//             const tableData = billingData.map((product, index) => [
//                 index + 1,
//                 product.description || "N/A",
//                 product.quantity?.toString() || "0",
//                 `${parseFloat(product.price || 0).toFixed(2)} /-`,
//                 product.gst?.toString() || "0",
//                 `${parseFloat(product.total || 0).toFixed(2)} /-`
//             ]);

//             // Add grand total row
//             tableData.push([
//                 "", 
//                 "", 
//                 billingData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toString(),
//                 billingData.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2),
//                 "Grand Total", 
//                 `${(parseFloat(totalAmount) || 0).toFixed(2)} /-`
//             ]);

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
//                 body: tableData,
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//                 headStyles: { fillColor: [144, 238, 144] }, // Light green
//                 footStyles: { fillColor: [255, 255, 0] }, // Yellow for total row
//             });

//             y = pdf.autoTable.previous.finalY + lineHeight * 2;
//         }

//         function drawPrescription() {
//             const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//             if (!hasPrescription) return false;

//             // Check if we need a new page
//             if (y > pageHeight - 100) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = 20;
//             }

//             pdf.setFontSize(13);
//             pdf.text("Prescription:", marginLeft, y);
//             y += lineHeight;

//             const prescriptionData = healthDirectives.map((item, index) => [
//                 index + 1,
//                 item.medicine || "N/A",
//                 item.strength || "N/A",
//                 item.dosage || "N/A",
//                 item.timing || "N/A",
//                 item.frequency || "N/A",
//                 item.duration || "N/A"
//             ]);

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency", "Duration"]],
//                 body: prescriptionData,
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//                 headStyles: { fillColor: [173, 216, 230] }, // Light blue
//             });

//             y = pdf.autoTable.previous.finalY + lineHeight;
//             return true;
//         }

//         function drawSignature() {
//             // Ensure signature is at the bottom of the current page
//             const currentY = Math.max(y, pageHeight - 30);
//             pdf.text("Authorized Signature", pageWidth - 50, currentY);
//         }

//         // ====== Build PDF Content ======
//         try {
//             drawBorder();
//             drawHeader();
//             drawPatientAndDoctorDetails();
//             drawPatientExamination();
//             drawBillingDetails();
            
//             // Draw prescription on same page if it fits, otherwise new page
//             const prescriptionAdded = drawPrescription();
            
//             // If prescription was added on a new page, draw border and signature there
//             if (prescriptionAdded && pdf.internal.getNumberOfPages() > 1) {
//                 drawBorder();
//             }
            
//             drawSignature();

//             // ====== Footer on all pages ======
//             const totalPages = pdf.internal.getNumberOfPages();
//             for (let i = 1; i <= totalPages; i++) {
//                 pdf.setPage(i);
//                 pdf.setFontSize(9);
//                 pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
//             }

//             // Return appropriate output based on usage
//             if (isWhatsAppShare) {
//                 console.log('Generating PDF blob for WhatsApp sharing...');
//                 const blob = pdf.output('blob');
//                 console.log('PDF blob generated, size:', blob.size);
//                 return blob;
//             } else {
//                 // Regular download
//                 const filename = `${invoiceNo}-${patient_name || 'Patient'}.pdf`;
//                 pdf.save(filename);
//                 return pdf;
//             }

//         } catch (pdfError) {
//             console.error('Error during PDF generation:', pdfError);
//             throw new Error('PDF generation failed: ' + pdfError.message);
//         }

//     } catch (error) {
//         console.error('Error in generatePDF function:', error);
//         throw error;
//     }
// }

// ------------------------------------------------------------------------------------------- 


// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export function generatePDF(
//     grandTotal,
//     invoiceNo,
//     patient_name,
//     formData,
//     remainingAmount,
//     totalAmountWords,
//     descriptions,
//     doctorData,
//     clinicData,
//     healthDirectives,
//     patientExaminations,
//      AyurvedicExaminations,
//     billId,
//     billDate,
//     totalAmount,
//     isWhatsAppShare = false
// ) {
//     try {
//         const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//         const marginLeft = 15;
//         const lineHeight = 7;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const headerHeight = 120; // Fixed header height
//         const footerHeight = 40; // Fixed footer height
//         const contentStartY = headerHeight + 10;
//         const contentEndY = pageHeight - footerHeight;

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(0);
//             pdf.setLineWidth(0.5);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
//         }

//         function drawHeader() {
//             let y = 10;
//             const logoSize = 40;
//             const leftMargin = marginLeft;
//             const rightMargin = pageWidth - marginLeft;

//             // Clinic Logo
//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             // Clinic Name (Center)
//             pdf.setFontSize(16);
//             pdf.setFont("times", "bold");
//             pdf.text(clinicData?.clinic_name || "Clinic Name", pageWidth / 2, y + 7, { align: "center" });

//             // Clinic Registration (Right)
//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 5, { align: "right" });

//             // Clinic Address (Right)
//             const addressText = `Address: ${clinicData?.clinic_address || "N/A"}`;
//             const addressLines = pdf.splitTextToSize(addressText, 50);
//             addressLines.forEach((line, index) => {
//                 pdf.text(line, rightMargin, y + 10 + index * 5, { align: "right" });
//             });

//             const addressHeight = addressLines.length * 5;
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 10 + addressHeight, { align: "right" });

//             y += logoSize + 5;

//             // Separator line
//             pdf.setDrawColor(0);
//             pdf.setLineWidth(0.5);
//             pdf.line(10, y, pageWidth - 10, y);
//             y += 8;

//             // Patient and Doctor Details Boxes
//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;
//             const lineSpacing = 5;

//             // Patient Details Box
//             pdf.setDrawColor(0);
//             pdf.setFontSize(13);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 6);
//             pdf.setFontSize(11);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             // Doctor Details Box
//             pdf.setFontSize(13);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
//             pdf.setFontSize(11);
//             pdf.text(`Doctor Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * lineSpacing);
//             });

//             const eduOffset = educationLines.length * lineSpacing;
//             let boxHeight = 12 + eduOffset + 15;

//             pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             // Draw boxes
//             pdf.rect(doctorBoxX, y, boxWidth, boxHeight);
//             pdf.rect(patientBoxX, y, boxWidth, boxHeight);
//             y += boxHeight + lineHeight;

//             // Bill Information
//             pdf.setFontSize(12);
//             pdf.text(`Bill No: ${billId || invoiceNo}`, marginLeft, y);
            
//             // Handle date formatting properly
//             let formattedDate = "Date Not Available";
//             if (formData?.visit_date) {
//                 formattedDate = formData.visit_date.includes("-") ? 
//                     formData.visit_date.split("-").reverse().join("-") : 
//                     formData.visit_date;
//             } else if (billDate) {
//                 formattedDate = billDate.includes("-") ? 
//                     billDate.split("-").reverse().join("-") : 
//                     billDate;
//             }
            
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
            
//             // Add delivery date if it's type 2 invoice
//             if (formData?.InvoiceType === 2 && formData?.DeliveryDate) {
//                 const deliveryFormatted = formData.DeliveryDate.includes("-") ? 
//                     formData.DeliveryDate.split("-").reverse().join("-") : 
//                     formData.DeliveryDate;
//                 pdf.text(`Delivery Date: ${deliveryFormatted}`, marginLeft, y + lineHeight * 2);
//             }

//             return contentStartY;
//         }

//         function drawFixedFooter() {
//             const footerY = pageHeight - 30;
            
//             // Signature
//             pdf.setFontSize(12);
//             pdf.text("Authorized Signature", pageWidth - 50, footerY);
            
//             // Computer generated text
//             pdf.setFontSize(9);
//             pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
//         }

//     // ====== Build First Page ======
//     drawBorder();
//     drawHeader();
//      drawPatientAndDoctorDetails();
//     // drawPatientExamination();
//     // drawAyurvedicExamination();
//     drawBillingDetails();
//     drawSignature();


    

//         // ====== Conditionally Add Patient Examination Page ======
// const hasPatientExam = Array.isArray(patientExaminations) && patientExaminations.length > 0;

// if (hasPatientExam) {
//     pdf.addPage();
//     drawHeader();
//      drawPatientAndDoctorDetails();

    
//     function drawPatientExamination() {
//     if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return;

//     const patientData = patientExaminations[0] || {};
//     const fields = [
//         { label: "BP", value: patientData?.bp },
//         { label: "Pulse", value: patientData?.pulse },
//         { label: "Height", value: patientData?.height },
//         { label: "Weight", value: patientData?.weight },
//         { label: "Past History", value: patientData?.past_history },
//         { label: "Complaints", value: patientData?.complaints },
//         { label: "Systemic Examination", value: patientData?.systemic_exam_general },
//         { label: "Diagnosis", value: patientData?.systemic_exam_pa }
//     ];

//     // Filter out empty or N/A values
//     const validFields = fields.filter(f =>
//         f.value && typeof f.value === "string" &&
//         f.value.trim().toUpperCase() !== "NA" &&
//         f.value.trim().toUpperCase() !== "N/A" &&
//         f.value.trim() !== ""
//     );

//     if (validFields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Medical Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];

//     // Format into two columns per row (4 cells per row)
//     for (let i = 0; i < validFields.length; i += 2) {
//         const row = [];

//         const field1 = validFields[i];
//         row.push({ content: field1.label, styles: { fontStyle: "bold" } });
//         row.push(field1.value);

//         if (i + 1 < validFields.length) {
//             const field2 = validFields[i + 1];
//             row.push({ content: field2.label, styles: { fontStyle: "bold" } });
//             row.push(field2.value);
//         } else {
//             row.push("", ""); // fill empty if only one field in last row
//         }

//         bodyData.push(row);
//     }

//     pdf.autoTable({
//         startY: y,
//         head: [["Field", "Value", "Field", "Value"]],
//         body: bodyData,
//         theme: "grid",
//         styles: { fontSize: 10, font: "times", halign: "left" },
//         headStyles: { fillColor: [173, 216, 230] } // Light blue
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }

    

//    function drawAyurvedicExamination() {
//     if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return;

//     const observation = AyurvedicExaminations[0] || {};
//     const fields = [
//         { label: "Occupation", value: observation?.occupation },
//         { label: "Pincode", value: observation?.pincode },
//         { label: "Past History", value: observation?.ayurPastHistory },
//         { label: "Prasavvedan Parikshayein", value: observation?.prasavvedan_parikshayein },
//         { label: "Habits", value: observation?.habits },
//         { label: "Lab Investigation", value: observation?.lab_investigation },
//         { label: "Personal History", value: observation?.personal_history },
//         { label: "Food & Drug Allergy", value: observation?.food_and_drug_allergy },
//         { label: "LMP", value: observation?.lmp },
//         { label: "EDD", value: observation?.edd }
//     ];

//     // Filter out "NA", "N/A", or empty/null values
//     const validFields = fields.filter(f =>
//         f.value && typeof f.value === "string" &&
//         f.value.trim().toUpperCase() !== "NA" &&
//         f.value.trim().toUpperCase() !== "N/A" &&
//         f.value.trim() !== ""
//     );

//     if (validFields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Ayurvedic Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];

//     // Combine fields into two columns per row (4 cells per row)
//     for (let i = 0; i < validFields.length; i += 2) {
//         const row = [];

//         const field1 = validFields[i];
//         row.push({ content: field1.label, styles: { fontStyle: "bold" } });
//         row.push(field1.value);

//         if (i + 1 < validFields.length) {
//             const field2 = validFields[i + 1];
//             row.push({ content: field2.label, styles: { fontStyle: "bold" } });
//             row.push(field2.value);
//         } else {
//             // Fill empty cells if odd number of fields
//             row.push("", "");
//         }

//         bodyData.push(row);
//     }

//     pdf.autoTable({
//         startY: y,
//         head: [['Field', 'Value', 'Field', 'Value']],
//         body: bodyData,
//         theme: "grid",
//         styles: { fontSize: 10, font: "times", halign: "left" },
//         headStyles: { fillColor: [144, 238, 144] } // Light green for header
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }
// drawPatientExamination();
//      drawAyurvedicExamination();
//     drawBorder();
//     drawSignature();
// }




//     // ====== Conditionally Add Prescription Page ======
//     const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//         function addNewPageWithFixedElements() {
//             pdf.addPage();
//             drawBorder();
//             // drawFixedHeader();
//             drawHeader();
//             drawFixedFooter();
//             return contentStartY;
//         }

//         function drawPatientExamination(startY) {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return startY;
        
//             const patientData = patientExaminations[0] || {};
//             const fields = [
//                 { label: "BP", value: patientData?.bp },
//                 { label: "Pulse", value: patientData?.pulse },
//                 { label: "Height", value: patientData?.height },
//                 { label: "Weight", value: patientData?.weight },
//                 { label: "Past History", value: patientData?.past_history },
//                 { label: "Complaints", value: patientData?.complaints },
//                 { label: "Systemic Examination", value: patientData?.systemic_exam_general },
//                 { label: "Diagnosis", value: patientData?.systemic_exam_pa }
//             ];
        
//             // Filter out N/A, null, undefined, or empty values
//             const validFields = fields.filter(f => f.value && f.value !== "N/A" && f.value.toString().trim() !== "");
        
//             if (validFields.length === 0) return startY;

//             // Check if we need a new page
//             const estimatedHeight = (validFields.length * 8) + 30; // Rough estimation
//             if (startY + estimatedHeight > contentEndY) {
//                 startY = addNewPageWithFixedElements();
//             }
        
//             pdf.setFontSize(13);
//             pdf.text("Medical Observation:", marginLeft, startY);
//             startY += lineHeight;
        
//             const bodyData = validFields.map(field => [
//                 { content: field.label, styles: { fontStyle: "bold", halign: "left" } },
//                 field.value
//             ]);
        
//             pdf.autoTable({
//                 startY: startY,
//                 head: [["Field", "Value"]],
//                 body: bodyData,
//                 theme: "grid",
//                 styles: { fontSize: 10, font: "times", halign: "left" },
//                 headStyles: { fillColor: [173, 216, 230] },
//                 margin: { top: contentStartY, bottom: footerHeight },
//             });
        
//             return pdf.autoTable.previous.finalY + lineHeight;
//         }
        
//         function drawBillingDetails(startY) {
//             // Check if we need a new page
//             const billingData = Array.isArray(descriptions) && descriptions.length > 0 ? descriptions : [];
//             const estimatedHeight = (billingData.length * 8) + 50; // Rough estimation
            
//             if (startY + estimatedHeight > contentEndY) {
//                 startY = addNewPageWithFixedElements();
//             }

//             pdf.setFontSize(13);
//             pdf.text("Billing Details:", marginLeft, startY);
//             startY += lineHeight;
            
//             if (billingData.length === 0) {
//                 pdf.setFontSize(11);
//                 pdf.text("No billing items found.", marginLeft, startY);
//                 return startY + lineHeight * 2;
//             }

//             const tableData = billingData.map((product, index) => [
//                 index + 1,
//                 product.description || "N/A",
//                 product.quantity?.toString() || "0",
//                 `${parseFloat(product.price || 0).toFixed(2)} /-`,
//                 product.gst?.toString() || "0",
//                 `${parseFloat(product.total || 0).toFixed(2)} /-`
//             ]);

//             // Add grand total row
//             tableData.push([
//                 "", 
//                 "", 
//                 billingData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toString(),
//                 billingData.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2),
//                 "Grand Total", 
//                 `${(parseFloat(totalAmount) || 0).toFixed(2)} /-`
//             ]);

//             pdf.autoTable({
//                 startY: startY,
//                 head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
//                 body: tableData,
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//                 headStyles: { fillColor: [144, 238, 144] }, // Light green
//                 footStyles: { fillColor: [255, 255, 0] }, // Yellow for total row
//                 margin: { top: contentStartY, bottom: footerHeight },
//             });

//             return pdf.autoTable.previous.finalY + lineHeight * 2;
//         }

//         function drawPrescription() {
//             const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//             if (!hasPrescription) return false;

//             // Always create a new page for prescription
//             const startY = addNewPageWithFixedElements();

//             pdf.setFontSize(13);
//             pdf.text("Prescription:", marginLeft, startY);

//             const prescriptionData = healthDirectives.map((item, index) => [
//                 index + 1,
//                 item.medicine || "N/A",
//                 item.strength || "N/A",
//                 item.dosage || "N/A",
//                 item.timing || "N/A",
//                 item.frequency || "N/A",
//                 item.duration || "N/A"
//             ]);

//             pdf.autoTable({
//                 startY: startY + lineHeight,
//                 head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency", "Duration"]],
//                 body: prescriptionData,
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//                 headStyles: { fillColor: [173, 216, 230] }, // Light blue
//                 margin: { top: contentStartY, bottom: footerHeight },
//             });

//             return true;
//         }

//         // ====== Build PDF Content ======
//         try {
//             // First page setup
//             drawBorder();
//             let currentY = drawHeader();
//             drawFixedFooter();
            
//             // Draw patient examination
//             currentY = drawPatientExamination(currentY);
            
//             // Draw billing details
//             currentY = drawBillingDetails(currentY);
            
//             // Draw prescription on separate page
//             drawPrescription();

//             // Return appropriate output based on usage
//             if (isWhatsAppShare) {
//                 console.log('Generating PDF blob for WhatsApp sharing...');
//                 const blob = pdf.output('blob');
//                 console.log('PDF blob generated, size:', blob.size);
//                 return blob;
//             } else {
//                 // Regular download
//                 const filename = `${invoiceNo}-${patient_name || 'Patient'}.pdf`;
//                 pdf.save(filename);
//                 return pdf;
//             }

//         } catch (pdfError) {
//             console.error('Error during PDF generation:', pdfError);
//             throw new Error('PDF generation failed: ' + pdfError.message);
//         }

//     } catch (error) {
//         console.error('Error in generatePDF function:', error);
//         throw error;
//     }



//     // ====== Footer on all pages ======
//     const totalPages = pdf.internal.getNumberOfPages();
//     for (let i = 1; i <= totalPages; i++) {
//         pdf.setPage(i);
//         pdf.setFontSize(9);
//         pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
//     }

//     pdf.save(`${invoiceNo}-${patient_name}.pdf`);
// }

//  --------------------------------------------------------------------------- 

import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePDF(
    grandTotal,
    invoiceNo,
    patient_name,
    formData,
    remainingAmount,
    totalAmountWords,
    descriptions,
    doctorData,
    clinicData,
    healthDirectives,
    patientExaminations,
    AyurvedicExaminations,
    billId,
    billDate,
    DeliveryDate,
    totalAmount,
    isWhatsAppShare = false
) {
    try {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const marginLeft = 15;
        let y = 20;
        const lineHeight = 7;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * marginLeft;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.setFont("times", "normal");

        function drawBorder() {
            pdf.setDrawColor(0);
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
        }

        function drawHeader() {
            y = 10;
            const logoSize = 40;
            const leftMargin = marginLeft;
            const rightMargin = pageWidth - marginLeft;

            if (clinicData?.logo) {
                try {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = clinicData.logo;
                    pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
                } catch (imgError) {
                    console.warn('Logo could not be added:', imgError);
                }
            }

            pdf.setFontSize(16);
            pdf.setFont("times", "bold");
            pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 7, { align: "center" });

            pdf.setFontSize(10);
            pdf.setFont("times", "normal");
            pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 5, { align: "right" });

            const addressText = `Address: ${clinicData?.clinic_address || "N/A"}`;
            const addressLines = pdf.splitTextToSize(addressText, 50);
            addressLines.forEach((line, index) => {
                pdf.text(line, rightMargin, y + 10 + index * 5, { align: "right" });
            });

            const addressHeight = addressLines.length * 5;
            pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 10 + addressHeight, { align: "right" });

            y += logoSize + addressHeight;
            pdf.setDrawColor(0);
            pdf.setLineWidth(0.5);
            pdf.line(10, y-10, pageWidth - 10, y-10);
            y += 8;
        }

        function drawPatientAndDoctorDetails() {
            const boxWidth = (contentWidth / 2) - 5;
            const patientBoxX = marginLeft;
            const doctorBoxX = marginLeft + boxWidth + 10;
            const lineSpacing = 5;

            pdf.setDrawColor(0);
            pdf.setFontSize(13);
            pdf.text("Patient Details:", patientBoxX + 3, y + 6);
            pdf.setFontSize(11);
            pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
            pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
            pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

            pdf.setFontSize(13);
            pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
            pdf.setFontSize(11);
            pdf.text(`Doctor Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

            const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
            educationLines.forEach((line, index) => {
                pdf.text(line, doctorBoxX + 3, y + 18 + index * lineSpacing);
            });

            const eduOffset = educationLines.length * lineSpacing;
            let boxHeight = 12 + eduOffset + 15;

            pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
            pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

            pdf.rect(doctorBoxX, y, boxWidth, boxHeight);
            pdf.rect(patientBoxX, y, boxWidth, boxHeight);
            y += boxHeight + lineHeight;

            pdf.setFontSize(12);
            pdf.text(`Bill No: ${billId}`, marginLeft, y);
            const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
            pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
            y += lineHeight * 3;
        }

        function drawBillingDetails() {
            pdf.setFontSize(13);
            pdf.text("Billing Details:", marginLeft, y);
            y += lineHeight;

            pdf.autoTable({
                startY: y,
                head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
                body: [
                    ...descriptions.map((product, index) => [
                        index + 1,
                        product.description || "N/A",
                        product.quantity?.toString() || "N/A",
                        `${parseFloat(product.price || 0).toFixed(2)} /-`,
                        product.gst?.toString() || "N/A",
                        `${parseFloat(product.total || 0).toFixed(2)} /-`
                    ]),
                    ["", "", "", "", "Grand Total", `${(parseFloat(DeliveryDate) || 0).toFixed(2)} /-`]
                ],
                theme: "grid",
                styles: { halign: "center", fontSize: 10, font: "times" },
            });

            y = pdf.autoTable.previous.finalY + lineHeight * 2;
        }

        function drawSignature() {
            y = pdf.internal.pageSize.getHeight() - 30;
            pdf.text("Authorized Signature", pageWidth - 50, y);
        }

        function drawPatientExamination() {
            if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return;

            const patientData = patientExaminations[0] || {};
            const fields = [
                { label: "BP", value: patientData?.bp },
                { label: "Pulse", value: patientData?.pulse },
                { label: "Height", value: patientData?.height },
                { label: "Weight", value: patientData?.weight },
                { label: "Past History", value: patientData?.past_history },
                { label: "Complaints", value: patientData?.complaints },
                { label: "Systemic Examination", value: patientData?.systemic_exam_general },
                { label: "Diagnosis", value: patientData?.systemic_exam_pa }
            ];

            // Filter out empty or N/A values
            const validFields = fields.filter(f =>
                f.value && typeof f.value === "string" &&
                f.value.trim().toUpperCase() !== "NA" &&
                f.value.trim().toUpperCase() !== "N/A" &&
                f.value.trim() !== ""
            );

            if (validFields.length === 0) return;

            pdf.setFontSize(13);
            pdf.text("Medical Observation:", marginLeft, y);
            y += lineHeight;

            const bodyData = [];

            // Format into two columns per row (4 cells per row)
            for (let i = 0; i < validFields.length; i += 2) {
                const row = [];

                const field1 = validFields[i];
                row.push({ content: field1.label, styles: { fontStyle: "bold" } });
                row.push(field1.value);

                if (i + 1 < validFields.length) {
                    const field2 = validFields[i + 1];
                    row.push({ content: field2.label, styles: { fontStyle: "bold" } });
                    row.push(field2.value);
                } else {
                    row.push("", ""); // fill empty if only one field in last row
                }

                bodyData.push(row);
            }

            pdf.autoTable({
                startY: y,
                head: [["Field", "Value", "Field", "Value"]],
                body: bodyData,
                theme: "grid",
                styles: { fontSize: 10, font: "times", halign: "left" },
                headStyles: { fillColor: [173, 216, 230] } // Light blue
            });

            y = pdf.autoTable.previous.finalY + lineHeight;
        }

        function drawAyurvedicExamination() {
            if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return;

            const observation = AyurvedicExaminations[0] || {};
            const fields = [
                { label: "Occupation", value: observation?.occupation },
                { label: "Pincode", value: observation?.pincode },
                { label: "Past History", value: observation?.ayurPastHistory },
                { label: "Prasavvedan Parikshayein", value: observation?.prasavvedan_parikshayein },
                { label: "Habits", value: observation?.habits },
                { label: "Lab Investigation", value: observation?.lab_investigation },
                { label: "Personal History", value: observation?.personal_history },
                { label: "Food & Drug Allergy", value: observation?.food_and_drug_allergy },
                { label: "LMP", value: observation?.lmp },
                { label: "EDD", value: observation?.edd }
            ];

            // Filter out "NA", "N/A", or empty/null values
            const validFields = fields.filter(f =>
                f.value && typeof f.value === "string" &&
                f.value.trim().toUpperCase() !== "NA" &&
                f.value.trim().toUpperCase() !== "N/A" &&
                f.value.trim() !== ""
            );

            if (validFields.length === 0) return;

            pdf.setFontSize(13);
            pdf.text("Ayurvedic Observation:", marginLeft, y);
            y += lineHeight;

            const bodyData = [];

            // Combine fields into two columns per row (4 cells per row)
            for (let i = 0; i < validFields.length; i += 2) {
                const row = [];

                const field1 = validFields[i];
                row.push({ content: field1.label, styles: { fontStyle: "bold" } });
                row.push(field1.value);

                if (i + 1 < validFields.length) {
                    const field2 = validFields[i + 1];
                    row.push({ content: field2.label, styles: { fontStyle: "bold" } });
                    row.push(field2.value);
                } else {
                    // Fill empty cells if odd number of fields
                    row.push("", "");
                }

                bodyData.push(row);
            }

            pdf.autoTable({
                startY: y,
                head: [['Field', 'Value', 'Field', 'Value']],
                body: bodyData,
                theme: "grid",
                styles: { fontSize: 10, font: "times", halign: "left" },
                headStyles: { fillColor: [144, 238, 144] } // Light green for header
            });

            y = pdf.autoTable.previous.finalY + lineHeight;
        }

        // ====== Build First Page ======
        drawBorder();
        drawHeader();
        drawPatientAndDoctorDetails();
        drawBillingDetails();
        drawSignature();

        // ====== Conditionally Add Patient Examination Page ======
        const hasPatientExam = Array.isArray(patientExaminations) && patientExaminations.length > 0;

        if (hasPatientExam) {
            pdf.addPage();
            drawHeader();
            drawPatientAndDoctorDetails();
            drawPatientExamination();
            drawAyurvedicExamination();
            drawBorder();
            drawSignature();
        }

        // ====== Conditionally Add Prescription Page ======
        const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;

        if (hasPrescription) {
            pdf.addPage();
            drawHeader();
            drawPatientAndDoctorDetails();

            pdf.setFontSize(13);
            pdf.text("Prescription:", marginLeft, y);
            y += lineHeight;

            pdf.autoTable({
                startY: y,
                head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency", "Duration"]],
                body: healthDirectives.map((item, index) => [
                    index + 1,
                    item.medicine || "N/A",
                    item.strength || "N/A",
                    item.dosage || "N/A",
                    item.timing || "N/A",
                    item.frequency || "N/A",
                    item.duration || "N/A"
                ]),
                theme: "grid",
                styles: { halign: "center", fontSize: 10, font: "times" },
            });

            drawBorder();
            drawSignature();
        }

        // ====== Footer on all pages ======
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
        }

        // Return appropriate output based on usage
        if (isWhatsAppShare) {
            console.log('Generating PDF blob for WhatsApp sharing...');
            try {
                const blob = pdf.output('blob');
                console.log('PDF blob generated successfully, size:', blob.size);
                
                // Validate blob
                if (!blob || blob.size === 0) {
                    throw new Error('Generated blob is empty or invalid');
                }
                
                return blob;
                
            } catch (blobError) {
                console.error('Error generating PDF blob:', blobError);
                throw new Error(`PDF blob generation failed: ${blobError.message}`);
            }
        } 
        else {
            // Regular download
            const filename = `${invoiceNo}-${patient_name}.pdf`;
            pdf.save(filename);
            return pdf;
        }

    } catch (error) {
        console.error('Error in generatePDF function:', error);
        throw new Error(`PDF generation failed: ${error.message}`);
    }
}

// Enhanced helper function to get PDF blob specifically for WhatsApp
export async function generatePDFBlob(
    grandTotal,
    invoiceNo,
    patient_name,
    formData,
    remainingAmount,
    totalAmountWords,
    descriptions,
    doctorData,
    clinicData,
    healthDirectives,
    patientExaminations,
    AyurvedicExaminations,
    billId,
    billDate,
    DeliveryDate,
    totalAmount
) {
    try {
        console.log('Starting PDF blob generation...');
        
        // Validate required parameters
        if (!invoiceNo || !patient_name) {
            throw new Error('Invoice number and patient name are required');
        }

        const blob =  generatePDF(
            grandTotal,
            invoiceNo,
            patient_name,
            formData,
            remainingAmount,
            totalAmountWords,
            descriptions,
            doctorData,
            clinicData,
            healthDirectives,
            patientExaminations,
            AyurvedicExaminations,
            billId,
            billDate,
            DeliveryDate,
            totalAmount,
            true // isWhatsAppShare = true
        );

        // Additional validation
        if (!blob) {
            throw new Error('PDF generation returned null or undefined');
        }

        if (!(blob instanceof Blob)) {
            throw new Error('PDF generation did not return a valid Blob object');
        }

        if (blob.size === 0) {
            throw new Error('Generated PDF blob is empty');
        }

        console.log('PDF blob generated successfully for WhatsApp sharing');
        return blob;

    } catch (error) {
        console.error('Error in generatePDFBlob:', error);
        throw new Error(`PDF blob generation failed: ${error.message}`);
    }
}

// Helper function to save PDF to device
export function savePDF(
    grandTotal,
    invoiceNo,
    patient_name,
    formData,
    remainingAmount,
    totalAmountWords,
    descriptions,
    doctorData,
    clinicData,
    healthDirectives,
    patientExaminations,
    AyurvedicExaminations,
    billId,
    billDate,
    DeliveryDate,
    totalAmount
) {
    return generatePDF(
        grandTotal,
        invoiceNo,
        patient_name,
        formData,
        remainingAmount,
        totalAmountWords,
        descriptions,
        doctorData,
        clinicData,
        healthDirectives,
        patientExaminations,
        AyurvedicExaminations,
        billId,
        billDate,
        DeliveryDate,
        totalAmount,
        false // isWhatsAppShare = false
    );
}

// Enhanced WhatsApp sharing utility function
export async function shareOnWhatsApp(
    phoneNumber, 
    pdfBlob, 
    message = "Please find attached medical bill/prescription"
) {
    try {
        console.log('Starting WhatsApp sharing process...');
        
        // Validate inputs
        if (!phoneNumber || phoneNumber.trim() === '') {
            throw new Error('Phone number is required for WhatsApp sharing');
        }

        if (!pdfBlob || !(pdfBlob instanceof Blob)) {
            throw new Error('Valid PDF blob is required for sharing');
        }

        if (pdfBlob.size === 0) {
            throw new Error('PDF blob is empty');
        }

        // Create a File object from the blob
        const filename = `medical-bill-${Date.now()}.pdf`;
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        
        // Check if Web Share API is available and supports files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            console.log('Using Web Share API...');
            await navigator.share({
                title: 'Medical Bill/Prescription',
                text: message,
                files: [file]
            });
            return { success: true, method: 'web-share-api' };
        }
        
        // Fallback: Create WhatsApp URL (without file attachment)
        console.log('Using fallback method...');
        
        // Clean phone number (remove spaces, dashes, etc.)
        const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
        const whatsappURL = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Create download link for the PDF
        const url = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        return { 
            success: true, 
            method: 'fallback',
            message: 'PDF downloaded and WhatsApp opened. Please attach the downloaded file manually.'
        };
        
    } catch (error) {
        console.error('Error sharing on WhatsApp:', error);
        return { 
            success: false, 
            error: error.message,
            message: 'Failed to share on WhatsApp. Please try downloading the PDF manually.'
        };
    }
}

// Enhanced utility function to share PDF with phone number validation
export async function sharePDFOnWhatsApp(
    phoneNumber,
    grandTotal,
    invoiceNo,
    patient_name,
    formData,
    remainingAmount,
    totalAmountWords,
    descriptions,
    doctorData,
    clinicData,
    healthDirectives,
    patientExaminations,
    AyurvedicExaminations,
    billId,
    billDate,
    DeliveryDate,
    totalAmount,
    customMessage = null
) {
    try {
        console.log('Starting sharePDFOnWhatsApp process...');
        
        // Validate phone number
        if (!phoneNumber || phoneNumber.trim() === '') {
            throw new Error('Phone number is required for WhatsApp sharing');
        }

        // Validate required data
        if (!invoiceNo || !patient_name) {
            throw new Error('Invoice number and patient name are required');
        }

        console.log('Generating PDF blob...');
        
        // Generate PDF blob
        const pdfBlob = await generatePDFBlob(
            grandTotal,
            invoiceNo,
            patient_name,
            formData,
            remainingAmount,
            totalAmountWords,
            descriptions,
            doctorData,
            clinicData,
            healthDirectives,
            patientExaminations,
            AyurvedicExaminations,
            billId,
            billDate,
            DeliveryDate,
            totalAmount
        );

        console.log('PDF blob generated, proceeding to share...');

        // Create custom message
        const message = customMessage || 
            `Hello ${patient_name || 'Patient'}, your medical bill/prescription (Bill No: ${billId || invoiceNo}) is ready. Please find the attached document.`;

        // Share on WhatsApp
        const result = await shareOnWhatsApp(phoneNumber, pdfBlob, message);
        return result;

    } catch (error) {
        console.error('Error in sharePDFOnWhatsApp:', error);
        return {
            success: false,
            error: error.message,
            message: `Failed to share PDF on WhatsApp: ${error.message}`
        };
    }
}
