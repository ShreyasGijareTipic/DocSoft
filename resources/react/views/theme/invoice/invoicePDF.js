
// ######################################### 



// import jsPDF from "jspdf";
// import "jspdf-autotable";


// export async  function generatePDF(
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
//     AyurvedicExaminations,
//     billId,
//     billIds,
//     billDate,
//     DeliveryDate,
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
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(16);
//             pdf.setFont("times", "bold");
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 7, { align: "center" });

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
//             // pdf.text(`Bill No: ${billId}`, marginLeft, y);
//             const billText =
//   billId && billIds
//     ? `Bill No: ${billId} || Previous: ${billIds}`
//     : billId
//     ? `Bill No: ${billId}`
//     : billIds
//     ? `Previous Bill No: ${billIds}`
//     : '';
//     if (billText) {
//   pdf.text(billText, marginLeft, y);
// }
//             const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
//              y += lineHeight * 1;
//             //  pdf.text(`Follow-Up Date: ${formData.followup_date}`, marginLeft, y + lineHeight);
//             if (isValidValue(formData?.followup_date)) {
//   pdf.text(`Follow-Up Date: ${formData.followup_date}`, marginLeft, y + lineHeight);
//   y += lineHeight; // increase y position after printing
// } 
//             y += lineHeight * 3;
//         }

//         function drawBillingDetails() {
//             pdf.setFontSize(13);
//             pdf.text("Billing Details:", marginLeft, y);
//             y += lineHeight;

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
//                 body: [
//                     ...descriptions.map((product, index) => [
//                         index + 1,
//                         product.description || "N/A",
//                         product.quantity?.toString() || "N/A",
//                         `${parseFloat(product.price || 0).toFixed(2)} /-`,
//                         product.gst?.toString() || "N/A",
//                         `${parseFloat(product.total || 0).toFixed(2)} /-`
//                     ]),
//                     ["", "", "", "", "Grand Total", `${(parseFloat(DeliveryDate) || 0).toFixed(2)} /-`]
//                 ],
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//             });

//             y = pdf.autoTable.previous.finalY + lineHeight * 2;
//         }

//         function drawSignature() {
//             y = pdf.internal.pageSize.getHeight() - 30;
//             pdf.text("Authorized Signature", pageWidth - 50, y);
//         }

// // Validation Functions
// function isValidValue(value) {
//     if (!value) return false;
//     if (typeof value === 'string') {
//         const upper = value.trim().toUpperCase();
//         return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//     }
//     if (typeof value === 'object') return Object.keys(value).length > 0;
//     return true;
// }

// function hasValidPatientExamination() {
//     if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//     const data = patientExaminations[0] || {};
//     return [
//         data?.bp, data?.pulse, data?.height, data?.weight,
//         data?.past_history, data?.complaints,
//         data?.systemic_exam_general, data?.systemic_exam_pa
//     ].some(isValidValue);
// }

// function hasValidAyurvedicExamination() {
//     if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//     const obs = AyurvedicExaminations[0] || {};
//     return [
//         obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//         obs?.prasavvedan_parikshayein, obs?.habits,
//         obs?.lab_investigation, obs?.personal_history,
//         obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//     ].some(isValidValue);
// }

// // Draw Medical Observation
// function drawPatientExamination() {
//     if (!hasValidPatientExamination()) return;

//     const data = patientExaminations[0] || {};
//     const fields = [
//         { label: "BP", value: data?.bp },
//         { label: "Pulse", value: data?.pulse },
//         { label: "Height", value: data?.height },
//         { label: "Weight", value: data?.weight },
//         { label: "Past History", value: data?.past_history },
//         { label: "Complaints", value: data?.complaints },
//         { label: "Systemic Examination", value: data?.systemic_exam_general },
//         { label: "Diagnosis", value: data?.systemic_exam_pa }
//     ].filter(f => isValidValue(f.value));

//     if (fields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Medical Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];
//     for (let i = 0; i < fields.length; i += 2) {
//         const row = [];
//         row.push({ content: fields[i].label, styles: { fontStyle: "bold" } });
//         row.push(fields[i].value);
//         if (fields[i + 1]) {
//             row.push({ content: fields[i + 1].label, styles: { fontStyle: "bold" } });
//             row.push(fields[i + 1].value);
//         } else {
//             row.push("", "");
//         }
//         bodyData.push(row);
//     }

//     pdf.autoTable({
//         startY: y,
//         head: [["Field", "Value", "Field", "Value"]],
//         body: bodyData,
//         theme: "grid",
//         styles: { fontSize: 10, font: "times", halign: "left" },
//         headStyles: { fillColor: [173, 216, 230] }
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }

// // Draw Ayurvedic Observation
// function drawAyurvedicExamination() {
//     if (!hasValidAyurvedicExamination()) return;

//     const obs = AyurvedicExaminations[0] || {};
//     const fields = [
//         { label: "Occupation", value: obs?.occupation },
//         { label: "Pincode", value: obs?.pincode },
//         { label: "Past History", value: obs?.ayurPastHistory },
//         { label: "Lab Investigation", value: obs?.lab_investigation },
//         { label: "Food & Drug Allergy", value: obs?.food_and_drug_allergy },
//         { label: "LMP", value: obs?.lmp },
//         { label: "EDD", value: obs?.edd }
//     ];

//     // Handle Prasavvedan
//     // if (isValidValue(obs?.prasavvedan_parikshayein)) {
//     //     const raw = obs.prasavvedan_parikshayein;
//     //     const safeDecode = (str) => {
//     //         try {
//     //             if (typeof str === 'string' && str.includes('\\u')) {
//     //                 const decoded = JSON.parse(`["${str}"]`.replace(/\\/g, '\\\\'));
//     //                 return decoded[0];
//     //             }
//     //             return str;
//     //         } catch {
//     //             return str;
//     //         }
//     //     };
//     //     if (typeof raw === 'object') {
//     //         const entry = Object.entries(raw)
//     //             .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//     //             .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(', ')}`)
//     //             .join(' | ');
//     //         if (entry) fields.push({ label: "Prasavvedan Parikshayein", value: entry });
//     //     }
//     // }
//     // ✅ Handle Prasavvedan
//     if (isValidValue(obs?.prasavvedan_parikshayein) && typeof obs.prasavvedan_parikshayein === 'object') {
//         const raw = obs.prasavvedan_parikshayein;
//         const safeDecode = (str) => {
//             try {
//                 if (typeof str === 'string' && str.includes('\\u')) {
//                     const decoded = JSON.parse(`["${str}"]`.replace(/\\/g, '\\\\'));
//                     return decoded[0];
//                 }
//                 return str;
//             } catch {
//                 return str;
//             }
//         };

//         const entry = Object.entries(raw)
//             .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//             .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(', ')}`)
//             .join(' | ');

//         if (entry) fields.push({ label: "प्रसववेदन परीक्षाएँ", value: entry });
//     }

//     // Habits
//     if (isValidValue(obs?.habits)) {
//         let habitData = {};
//         try {
//             habitData = typeof obs.habits === 'string' ? JSON.parse(obs.habits) : obs.habits;
//             const text = Object.entries(habitData)
//                 .filter(([_, v]) => isValidValue(v))
//                 .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${Array.isArray(v) ? v.join(', ') : v}`)
//                 .join(' | ');
//             if (text) fields.push({ label: "Habits", value: text });
//         } catch (e) {
//             console.warn("Error parsing habits:", e);
//         }
//     }

//     // Personal History
//     if (isValidValue(obs?.personal_history)) {
//         let personalData = {};
//         try {
//             personalData = typeof obs.personal_history === 'string' ? JSON.parse(obs.personal_history) : obs.personal_history;
//             const text = Object.entries(personalData)
//                 .filter(([_, v]) => isValidValue(v))
//                 .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${Array.isArray(v) ? v.join(', ') : v}`)
//                 .join(' | ');
//             if (text) fields.push({ label: "Personal History", value: text });
//         } catch (e) {
//             console.warn("Error parsing personal history:", e);
//         }
//     }

//     const validFields = fields.filter(f => isValidValue(f.value));
//     if (validFields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Ayurvedic Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];
//     for (let i = 0; i < validFields.length; i += 2) {
//         const row = [];
//         row.push({ content: validFields[i].label, styles: { fontStyle: "bold" } });
//         row.push(validFields[i].value);
//         if (validFields[i + 1]) {
//             row.push({ content: validFields[i + 1].label, styles: { fontStyle: "bold" } });
//             row.push(validFields[i + 1].value);
//         } else {
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
//         headStyles: { fillColor: [144, 238, 144] }
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }

// // ===== Build First Page =====
// drawBorder();
// drawHeader();
// drawPatientAndDoctorDetails();
// drawBillingDetails();
// drawSignature();

// // ===== Add Observation Page Conditionally =====
// if (hasValidPatientExamination() || hasValidAyurvedicExamination()) {
//     pdf.addPage();
//     drawHeader();
//     drawPatientAndDoctorDetails();

//     if (hasValidPatientExamination()) drawPatientExamination();
//     if (hasValidAyurvedicExamination()) drawAyurvedicExamination();

//     drawBorder();
//     drawSignature();
// }


//         // ====== Conditionally Add Patient Examination Page ======
//         const hasPatientExam = Array.isArray(patientExaminations) && patientExaminations.length > 0;

//         if (hasPatientExam) {
//             pdf.addPage();
//             drawHeader();
//             drawPatientAndDoctorDetails();
//             drawPatientExamination();
//             drawAyurvedicExamination();
//             drawBorder();
//             drawSignature();
//         }

//         // ====== Conditionally Add Prescription Page ======
//         const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;

//         if (hasPrescription) {
//             pdf.addPage();
//             drawHeader();
//             drawPatientAndDoctorDetails();

//             pdf.setFontSize(13);
//             pdf.text("Prescription:", marginLeft, y);
//             y += lineHeight;

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency", "Duration"]],
//                 body: healthDirectives.map((item, index) => [
//                     index + 1,
//                     item.medicine || "N/A",
//                     item.strength || "N/A",
//                     item.dosage || "N/A",
//                     item.timing || "N/A",
//                     item.frequency || "N/A",
//                     item.duration || "N/A"
//                 ]),
//                 theme: "grid",
//                 styles: { halign: "center", fontSize: 10, font: "times" },
//             });

//             drawBorder();
//             drawSignature();
//         }

//         // ====== Footer on all pages ======
//         const totalPages = pdf.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             pdf.setPage(i);
//             pdf.setFontSize(9);
//             pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
//         }

//         // Return appropriate output based on usage
//         if (isWhatsAppShare) {
//             console.log('Generating PDF blob for WhatsApp sharing...');
//             try {
//                 const blob = pdf.output('blob');
//                 console.log('PDF blob generated successfully, size:', blob.size);
                
//                 // Validate blob
//                 if (!blob || blob.size === 0) {
//                     throw new Error('Generated blob is empty or invalid');
//                 }
                
//                 return blob;
                
//             } catch (blobError) {
//                 console.error('Error generating PDF blob:', blobError);
//                 throw new Error(`PDF blob generation failed: ${blobError.message}`);
//             }
//         } 
//         else {
//             // Regular download
//             const filename = `${invoiceNo}-${patient_name}.pdf`;
//             pdf.save(filename);
//             return pdf;
//         }

//     } catch (error) {
//         console.error('Error in generatePDF function:', error);
//         throw new Error(`PDF generation failed: ${error.message}`);
//     }
// }

// // FIXED: Enhanced helper function to get PDF blob specifically for WhatsApp
// export function generatePDFBlob(
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
//     AyurvedicExaminations,
//     billId,
//     billIds,
//     billDate,
//     DeliveryDate,
//     totalAmount
// ) {
//     try {
//         console.log('Starting PDF blob generation...');
        
//         // Validate required parameters
//         if (!invoiceNo || !patient_name) {
//             throw new Error('Invoice number and patient name are required');
//         }

//         // FIXED: Properly call generatePDF with isWhatsAppShare = true
//         const blob = generatePDF(
//             grandTotal,
//             invoiceNo,
//             patient_name,
//             formData,
//             remainingAmount,
//             totalAmountWords,
//             descriptions,
//             doctorData,
//             clinicData,
//             healthDirectives,
//             patientExaminations,
//             AyurvedicExaminations,
//             billId,
//             billIds,
//             billDate,
//             DeliveryDate,
//             totalAmount,
//             true // isWhatsAppShare = true
//         );

//         // Additional validation
//         if (!blob) {
//             throw new Error('PDF generation returned null or undefined');
//         }

//         if (!(blob instanceof Blob)) {
//             throw new Error('PDF generation did not return a valid Blob object');
//         }

//         if (blob.size === 0) {
//             throw new Error('Generated PDF blob is empty');
//         }

//         console.log('PDF blob generated successfully for WhatsApp sharing');
//         return blob;

//     } catch (error) {
//         console.error('Error in generatePDFBlob:', error);
//         throw new Error(`PDF blob generation failed: ${error.message}`);
//     }
// }

// // Helper function to save PDF to device
// export function savePDF(
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
//     AyurvedicExaminations,
//     billId,
//     billIds,
//     billDate,
//     DeliveryDate,
//     totalAmount
// ) {
//     return generatePDF(
//         grandTotal,
//         invoiceNo,
//         patient_name,
//         formData,
//         remainingAmount,
//         totalAmountWords,
//         descriptions,
//         doctorData,
//         clinicData,
//         healthDirectives,
//         patientExaminations,
//         AyurvedicExaminations,
//         billId,
//         billIds,
//         billDate,
//         DeliveryDate,
//         totalAmount,
//         false // isWhatsAppShare = false
//     );
// }

// // FIXED: Enhanced WhatsApp sharing utility function
// export async function shareOnWhatsApp(
//     phoneNumber, 
//     pdfBlob, 
//     message = "Please find attached medical bill/prescription"
// ) {
//     try {
//         console.log('Starting WhatsApp sharing process...');
        
//         // Validate inputs
//         if (!phoneNumber || phoneNumber.trim() === '') {
//             throw new Error('Phone number is required for WhatsApp sharing');
//         }

//         if (!pdfBlob || !(pdfBlob instanceof Blob)) {
//             throw new Error('Valid PDF blob is required for sharing');
//         }

//         if (pdfBlob.size === 0) {
//             throw new Error('PDF blob is empty');
//         }

//         // Create a File object from the blob
//         const filename = `medical-bill-${Date.now()}.pdf`;
//         const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        
//         // Check if Web Share API is available and supports files
//         if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
//             console.log('Using Web Share API...');
//             await navigator.share({
//                 title: 'Medical Bill/Prescription',
//                 text: message,
//                 files: [file]
//             });
//             return { success: true, method: 'web-share-api' };
//         }
        
//         // Fallback: Create WhatsApp URL (without file attachment)
//         console.log('Using fallback method...');
        
//         // Clean phone number (remove spaces, dashes, etc.)
//         const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
//         const whatsappURL = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;
        
//         // Create download link for the PDF
//         const url = URL.createObjectURL(pdfBlob);
//         const downloadLink = document.createElement('a');
//         downloadLink.href = url;
//         downloadLink.download = filename;
//         downloadLink.style.display = 'none';
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
        
//         // Clean up
//         setTimeout(() => {
//             URL.revokeObjectURL(url);
//         }, 1000);
        
//         // Open WhatsApp
//         window.open(whatsappURL, '_blank');
        
//         return { 
//             success: true, 
//             method: 'fallback',
//             message: 'PDF downloaded and WhatsApp opened. Please attach the downloaded file manually.'
//         };
        
//     } catch (error) {
//         console.error('Error sharing on WhatsApp:', error);
//         return { 
//             success: false, 
//             error: error.message,
//             message: 'Failed to share on WhatsApp. Please try downloading the PDF manually.'
//         };
//     }
// }

// // FIXED: Enhanced utility function to share PDF with phone number validation
// export async function sharePDFOnWhatsApp(
//     phoneNumber,
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
//     AyurvedicExaminations,
//     billId,
//     billIds,
//     billDate,
//     DeliveryDate,
//     totalAmount,
//     customMessage = null
// ) {
//     try {
//         console.log('Starting sharePDFOnWhatsApp process...');
        
//         // Validate phone number
//         if (!phoneNumber || phoneNumber.trim() === '') {
//             throw new Error('Phone number is required for WhatsApp sharing');
//         }

//         // Validate required data
//         if (!invoiceNo || !patient_name) {
//             throw new Error('Invoice number and patient name are required');
//         }

//         console.log('Generating PDF blob...');
        
//         // FIXED: Generate PDF blob (this is synchronous, not async)
//         const pdfBlob = generatePDFBlob(
//             grandTotal,
//             invoiceNo,
//             patient_name,
//             formData,
//             remainingAmount,
//             totalAmountWords,
//             descriptions,
//             doctorData,
//             clinicData,
//             healthDirectives,
//             patientExaminations,
//             AyurvedicExaminations,
//             billId,
//             billIds,
//             billDate,
//             DeliveryDate,
//             totalAmount
//         );

//         console.log('PDF blob generated, proceeding to share...');

//         // Create custom message
//         const message = customMessage || 
//             `Hello ${patient_name || 'Patient'}, your medical bill/prescription (Bill No: ${billId || invoiceNo}) is ready. Please find the attached document.`;

//         // Share on WhatsApp
//         const result = await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//         return result;

//     } catch (error) {
//         console.error('Error in sharePDFOnWhatsApp:', error);
//         return {
//             success: false,
//             error: error.message,
//             message: `Failed to share PDF on WhatsApp: ${error.message}`
//         };
//     }
// }

// // BONUS: Simple download function for regular PDF download
// export function downloadPDF(
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
//     AyurvedicExaminations,
//     billId,
//     billIds,
//     billDate,
//     DeliveryDate,
//     totalAmount
// ) {
//     try {
//         return generatePDF(
//             grandTotal,
//             invoiceNo,
//             patient_name,
//             formData,
//             remainingAmount,
//             totalAmountWords,
//             descriptions,
//             doctorData,
//             clinicData,
//             healthDirectives,
//             patientExaminations,
//             AyurvedicExaminations,
//             billId,
//             billIds,
//             billDate,
//             DeliveryDate,
//             totalAmount,
//             false // isWhatsAppShare = false
//         );
//     } catch (error) {
//         console.error('Error downloading PDF:', error);
//         throw new Error(`PDF download failed: ${error.message}`);
//     }
// }

// ----------------------------------- 





import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
    billIds,
    billDate,
    DeliveryDate,
    totalAmount,
    isWhatsAppShare = false
) {
    try {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        registerDevnagariFont(pdf);

        const marginLeft = 15;
        let y = 20;
        const lineHeight = 7;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * marginLeft;
        const pageHeight = pdf.internal.pageSize.getHeight();


//        pdf.setFont("NotoSansDevanagari");
//   pdf.text("औषधाचे नाव: अश्वगंधा", 10, 20);



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
            // y += 1;
            y += lineHeight * 0;
        
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
            // pdf.text(`Bill No: ${billId}`, marginLeft, y);
            const billText =
  billId && billIds
    ? `Bill No: ${billId} || Previous: ${billIds}`
    : billId
    ? `Bill No: ${billId}`
    : billIds
    ? `Previous Bill No: ${billIds}`
    : '';
    if (billText) {
  pdf.text(billText, marginLeft, y);
}
            const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
            pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
             y += lineHeight * 1;
            //  pdf.text(`Follow-Up Date: ${formData.followup_date}`, marginLeft, y + lineHeight);
            if (isValidValue(formData?.followup_date)) {
  pdf.text(`Follow-Up Date: ${formData.followup_date}`, marginLeft, y + lineHeight);
  y += lineHeight; // increase y position after printing
} 
            y += lineHeight * 1;
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

// Validation Functions
function isValidValue(value) {
    if (!value) return false;
    if (typeof value === 'string') {
        const upper = value.trim().toUpperCase();
        return upper !== '' && upper !== 'NA' && upper !== 'N/A';
    }
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
}

function hasValidPatientExamination() {
    if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
    const data = patientExaminations[0] || {};
    return [
        data?.bp, data?.pulse, data?.height, data?.weight,
        data?.past_history, data?.complaints,
        data?.systemic_exam_general, data?.systemic_exam_pa
    ].some(isValidValue);
}

function hasValidAyurvedicExamination() {
    if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
    const obs = AyurvedicExaminations[0] || {};
    return [
        obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
        obs?.prasavvedan_parikshayein, obs?.habits,
        obs?.lab_investigation, obs?.personal_history,
        obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
    ].some(isValidValue);
}

// Draw Medical Observation
// function drawPatientExamination() {
//     if (!hasValidPatientExamination()) return;

//     const data = patientExaminations[0] || {};
//     const fields = [
//         { label: "BP", value: data?.bp },
//         { label: "Pulse", value: data?.pulse },
//         { label: "Height", value: data?.height },
//         { label: "Weight", value: data?.weight },
//         { label: "Past History", value: data?.past_history },
//         { label: "Complaints", value: data?.complaints },
//         { label: "Systemic Examination", value: data?.systemic_exam_general },
//         { label: "Diagnosis", value: data?.systemic_exam_pa }
//     ].filter(f => isValidValue(f.value));

//     if (fields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Medical Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];
//     for (let i = 0; i < fields.length; i += 2) {
//         const row = [];
//         row.push({ content: fields[i].label, styles: { fontStyle: "bold" } });
//         row.push(fields[i].value);
//         if (fields[i + 1]) {
//             row.push({ content: fields[i + 1].label, styles: { fontStyle: "bold" } });
//             row.push(fields[i + 1].value);
//         } else {
//             row.push("", "");
//         }
//         bodyData.push(row);
//     }

//     pdf.autoTable({
//         startY: y,
//         head: [["Field", "Value", "Field", "Value"]],
//         body: bodyData,
//         theme: "grid",
//         styles: { fontSize: 10, font: "times", halign: "left" },
//         headStyles: { fillColor: [173, 216, 230] }
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }
function drawPatientExamination() {
  if (!hasValidPatientExamination()) return;

  const data = patientExaminations[0] || {};
  const fields = [
    { label: "BP", value: data?.bp },
    { label: "Pulse", value: data?.pulse },
    { label: "Height", value: data?.height },
    { label: "Weight", value: data?.weight },
    { label: "Past History", value: data?.past_history },
    { label: "Complaints", value: data?.complaints },
    { label: "Systemic Examination", value: data?.systemic_exam_general },
    { label: "Diagnosis", value: data?.systemic_exam_pa },
  ].filter((f) => isValidValue(f.value));

  if (fields.length === 0) return;

  pdf.setFont("helvetica");
  pdf.setFontSize(12);
  pdf.text("Medical Observation:", marginLeft, y);
  y += 2;

  const bodyData = [];
  for (let i = 0; i < fields.length; i += 2) {
    const row = [
      { content: fields[i].label, styles: { fontStyle: "bold" } },
      fields[i].value,
    ];
    if (fields[i + 1]) {
      row.push({ content: fields[i + 1].label, styles: { fontStyle: "bold" } });
      row.push(fields[i + 1].value);
    } else {
      row.push("", "");
    }
    bodyData.push(row);
  }

  autoTable(pdf, {
    startY: y,
    head: [["Field", "Value", "Field", "Value"]],
    body: bodyData,
    theme: "grid",
    styles: {
      fontSize: 9.5,
      font: "helvetica",
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
      halign: "left",
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [210, 233, 255],
      textColor: [0, 0, 0],
      fontSize: 10,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
    },
  });

  y = pdf.lastAutoTable.finalY + 5;
}


// Draw Ayurvedic Observation
// function drawAyurvedicExamination() {
//     if (!hasValidAyurvedicExamination()) return;

//     const obs = AyurvedicExaminations[0] || {};
//     const fields = [
//         { label: "Occupation", value: obs?.occupation },
//         { label: "Pincode", value: obs?.pincode },
//         { label: "Past History", value: obs?.ayurPastHistory },
//         { label: "Lab Investigation", value: obs?.lab_investigation },
//         { label: "Food & Drug Allergy", value: obs?.food_and_drug_allergy },
//         { label: "LMP", value: obs?.lmp },
//         { label: "EDD", value: obs?.edd }
//     ];

//     // Handle Prasavvedan
//     // if (isValidValue(obs?.prasavvedan_parikshayein)) {
//     //     const raw = obs.prasavvedan_parikshayein;
//     //     const safeDecode = (str) => {
//     //         try {
//     //             if (typeof str === 'string' && str.includes('\\u')) {
//     //                 const decoded = JSON.parse(`["${str}"]`.replace(/\\/g, '\\\\'));
//     //                 return decoded[0];
//     //             }
//     //             return str;
//     //         } catch {
//     //             return str;
//     //         }
//     //     };
//     //     if (typeof raw === 'object') {
//     //         const entry = Object.entries(raw)
//     //             .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//     //             .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(', ')}`)
//     //             .join(' | ');
//     //         if (entry) fields.push({ label: "Prasavvedan Parikshayein", value: entry });
//     //     }
//     // }
//    registerDevnagariFont(pdf); // you must call this before using the font
// pdf.setFont("helvetica"); // default

// if (isValidValue(obs?.prasavvedan_parikshayein)) {
//   const raw = obs.prasavvedan_parikshayein;

//   const safeDecode = (str) => {
//     try {
//       if (typeof str === "string" && str.includes("\\u")) {
//         return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//       }
//       return str;
//     } catch {
//       return str;
//     }
//   };

//   if (typeof raw === "object") {
//     const entries = Object.entries(raw)
//       .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//       .map(([k, v]) => {
//         const label = k.charAt(0).toUpperCase() + k.slice(1); // e.g. Nadi
//         const value = v.map(safeDecode).join(", ");           // e.g. क्षीण
//         return { label, value };
//       });

//     // 👇 Prepare table with 2 entries per row (4 columns: Label1, Value1, Label2, Value2)
//     const tableRows = [];
//     for (let i = 0; i < entries.length; i += 2) {
//       const left = entries[i];
//       const right = entries[i + 1] || { label: "", value: "" };
//       tableRows.push([
//         { content: left.label, styles: { fontStyle: "bold" } },
//         { content: left.value, styles: { font: "NotoSansDevanagari" } },
//         { content: right.label, styles: { fontStyle: "bold" } },
//         { content: right.value, styles: { font: "NotoSansDevanagari" } },
//       ]);
//     }

//     // 🟢 Print table in PDF
//     autoTable(pdf, {
//       startY: y, // current Y position
//       head: [["Prasavvedan", "Parikshayein", "", ""]],
//       body: tableRows,
//       styles: {
//         fontSize: 10,
//         cellPadding: 2,
//         valign: "middle",
//       },
//       headStyles: {
//         fillColor: [230, 247, 255],
//         textColor: [0, 0, 0],
//         halign: "center",
//         fontStyle: "bold"
//       },
//       columnStyles: {
//         1: { font: "NotoSansDevanagari" },
//         3: { font: "NotoSansDevanagari" }
//       }
//     });

//     y = pdf.lastAutoTable.finalY + 10; // move cursor below the table
//   }
// }

//     // Habits
//     if (isValidValue(obs?.habits)) {
//         let habitData = {};
//         try {
//             habitData = typeof obs.habits === 'string' ? JSON.parse(obs.habits) : obs.habits;
//             const text = Object.entries(habitData)
//                 .filter(([_, v]) => isValidValue(v))
//                 .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${Array.isArray(v) ? v.join(', ') : v}`)
//                 .join(' | ');
//             if (text) fields.push({ label: "Habits", value: text });
//         } catch (e) {
//             console.warn("Error parsing habits:", e);
//         }
//     }

//     // Personal History
//     if (isValidValue(obs?.personal_history)) {
//         let personalData = {};
//         try {
//             personalData = typeof obs.personal_history === 'string' ? JSON.parse(obs.personal_history) : obs.personal_history;
//             const text = Object.entries(personalData)
//                 .filter(([_, v]) => isValidValue(v))
//                 .map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${Array.isArray(v) ? v.join(', ') : v}`)
//                 .join(' | ');
//             if (text) fields.push({ label: "Personal History", value: text });
//         } catch (e) {
//             console.warn("Error parsing personal history:", e);
//         }
//     }

//     const validFields = fields.filter(f => isValidValue(f.value));
//     if (validFields.length === 0) return;

//     pdf.setFontSize(13);
//     pdf.text("Ayurvedic Observation:", marginLeft, y);
//     y += lineHeight;

//     const bodyData = [];
//     for (let i = 0; i < validFields.length; i += 2) {
//         const row = [];
//         row.push({ content: validFields[i].label, styles: { fontStyle: "bold" } });
//         row.push(validFields[i].value);
//         if (validFields[i + 1]) {
//             row.push({ content: validFields[i + 1].label, styles: { fontStyle: "bold" } });
//             row.push(validFields[i + 1].value);
//         } else {
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
//         headStyles: { fillColor: [144, 238, 144] }
//     });

//     y = pdf.autoTable.previous.finalY + lineHeight;
// }
function drawAyurvedicExamination() {
  if (!hasValidAyurvedicExamination()) return;

  const obs = AyurvedicExaminations[0] || {};
  const fields = [
    { label: "Occupation", value: obs?.occupation },
    { label: "Pincode", value: obs?.pincode },
    { label: "Past History", value: obs?.ayurPastHistory },
    { label: "Investigation", value: obs?.lab_investigation },
    { label: "Food & Drug Allergy", value: obs?.food_and_drug_allergy },
    { label: "LMP", value: obs?.lmp },
    { label: "EDD", value: obs?.edd },
  ];

  registerDevnagariFont(pdf);

  if (isValidValue(obs?.prasavvedan_parikshayein)) {
    const raw = obs.prasavvedan_parikshayein;
    const safeDecode = (str) => {
      try {
        if (typeof str === "string" && str.includes("\\u")) {
          return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
        }
        return str;
      } catch {
        return str;
      }
    };

    if (typeof raw === "object") {
      const prasavText = Object.entries(raw)
        .filter(([_, v]) => Array.isArray(v) && v.length > 0)
        .map(([k, v]) => {
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          const decoded = v.map(safeDecode).join(", ");
          return `${label}: ${decoded}`;
        })
        .join(" | ");

      if (prasavText) {
        fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
      }
    }
  }

  if (isValidValue(obs?.habits)) {
    try {
      const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
      const text = Object.entries(habitData)
        .filter(([_, v]) => isValidValue(v))
        .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ");
      if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
    } catch (e) {
      console.warn("Error parsing habits:", e);
    }
  }

  if (isValidValue(obs?.personal_history)) {
    try {
      const personalData = typeof obs.personal_history === "string"
        ? JSON.parse(obs.personal_history)
        : obs.personal_history;
      const text = Object.entries(personalData)
        .filter(([_, v]) => isValidValue(v))
        .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ");
      if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
    } catch (e) {
      console.warn("Error parsing personal history:", e);
    }
  }

  const validFields = fields.filter(f => isValidValue(f.value));
  if (validFields.length === 0) return;

  pdf.setFont("helvetica");
  pdf.setFontSize(12);
  pdf.text("Ayurvedic Observation:", marginLeft, y);
  y += 2;

  const fullRowFields = validFields.filter(f => f.isFullWidth);
  const normalFields = validFields.filter(f => !f.isFullWidth);

  const bodyData = [];
  for (let i = 0; i < normalFields.length; i += 2) {
    const row = [
      { content: normalFields[i].label, styles: { fontStyle: "bold" } },
      normalFields[i].value,
    ];
    if (normalFields[i + 1]) {
      row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
      row.push(normalFields[i + 1].value);
    } else {
      row.push("", "");
    }
    bodyData.push(row);
  }

  if (bodyData.length > 0) {
    autoTable(pdf, {
      startY: y,
      head: [["Field", "Value", "Field", "Value"]],
      body: bodyData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 },
        halign: "left",
        font: "helvetica",
      },
      headStyles: {
        fillColor: [144, 238, 144],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: "bold",
      },
    });

    y = pdf.lastAutoTable.finalY + 5;
  }

  fullRowFields.forEach(field => {
    const boxWidth = 180;
    const boxX = marginLeft;
    const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";

    const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
    const boxHeight = wrapped.length * 5 + 8;

    pdf.setDrawColor(180);
    pdf.setLineWidth(0.2);
    pdf.setFillColor(248, 248, 248);
    pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

    pdf.setFont("helvetica");
    pdf.setFontSize(10);
    pdf.setTextColor(40);
    pdf.text(`${field.label}:`, boxX + 4, y + 6);

    pdf.setFont(contentFont);
    pdf.setFontSize(9);
    pdf.setTextColor(60);
    pdf.text(wrapped, boxX + 5, y + 11);

    y += boxHeight + 3;
  });

  function formatKey(str) {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}





// ===== Build First Page =====
drawBorder();
drawHeader();
drawPatientAndDoctorDetails();
drawBillingDetails();
// drawSignature();

// ===== Add Observation Page Conditionally =====
if (hasValidPatientExamination() || hasValidAyurvedicExamination()) {
    pdf.addPage();
    drawHeader();
    drawPatientAndDoctorDetails();

    if (hasValidPatientExamination()) drawPatientExamination();
    if (hasValidAyurvedicExamination()) drawAyurvedicExamination();

    drawBorder();
    // drawSignature();
}


        // ====== Conditionally Add Patient Examination Page ======
        // const hasPatientExam = Array.isArray(patientExaminations) && patientExaminations.length > 0;

        // if (hasPatientExam) {
        //     pdf.addPage();
        //     drawHeader();
        //     drawPatientAndDoctorDetails();
        //     drawPatientExamination();
        //     drawAyurvedicExamination();
        //     drawBorder();
        //     drawSignature();
        // }

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

// FIXED: Enhanced helper function to get PDF blob specifically for WhatsApp
export function generatePDFBlob(
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
    billIds,
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

        // FIXED: Properly call generatePDF with isWhatsAppShare = true
        const blob = generatePDF(
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
            billIds,
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
    billIds,
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
        billIds,
        billDate,
        DeliveryDate,
        totalAmount,
        false // isWhatsAppShare = false
    );
}

// FIXED: Enhanced WhatsApp sharing utility function
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

// FIXED: Enhanced utility function to share PDF with phone number validation
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
    billIds,
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
        
        // FIXED: Generate PDF blob (this is synchronous, not async)
        const pdfBlob = generatePDFBlob(
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
            billIds,
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

// BONUS: Simple download function for regular PDF download
export function downloadPDF(
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
    billIds,
    billDate,
    DeliveryDate,
    totalAmount
) {
    try {
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
            billIds,
            billDate,
            DeliveryDate,
            totalAmount,
            false // isWhatsAppShare = false
        );
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error(`PDF download failed: ${error.message}`);
    }
}


















































