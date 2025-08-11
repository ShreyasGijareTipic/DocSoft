// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
//         registerDevnagariFont(pdf);

//         const marginLeft = 10;
//         let y = 10;
//         const lineHeight = 5;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(0);
//             pdf.setLineWidth(0.3);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
//         }

//         function drawHeader() {
//             const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(16);
//             pdf.setFont("times", "bold");
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//             pdf.setFontSize(9);
//             pdf.setFont("times", "normal");
//             pdf.text(`Address: ${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

//             pdf.setFontSize(9);
//             pdf.setFont("times", "bold");
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

//             y += logoSize + 5;
//             pdf.setDrawColor(0);
//             pdf.line(10, y - 5, pageWidth - 10, y - 5);
//         }

//  function drawPatientAndDoctorDetails() {
//     const boxWidth = (contentWidth / 2) - 5;
//     const patientBoxX = marginLeft;
//     const doctorBoxX = marginLeft + boxWidth + 10;

//     // Draw background boxes
//     pdf.setDrawColor(0);
//     pdf.setFillColor(245, 245, 245);
//     pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
//     pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

//     // Titles
//     pdf.setFontSize(11);
//     pdf.setFont("times", "bold");
//     pdf.text("Patient Details:", patientBoxX + 3, y + 5);
//     pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

//     // Content text
//     pdf.setFontSize(9);
//     pdf.setFont("times", "normal");
//     pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//     pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//     pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//     pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//     const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//     educationLines.forEach((line, index) => {
//         pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
//     });

//     const eduOffset = educationLines.length * 4;
//     pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//     pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//     y += 38;

//     // Highlighted Bill Info Line
//     // const billText = billId && billIds
//     //     ? `Bill No: ${billId} || Prev: ${billIds}`
//     //     : billId
//     //     ? `Bill No: ${billId}`
//     //     : billIds
//     //     ? `Prev Bill No: ${billIds}`
//     //     : '';

        

//     // if (billText) {
//     //     const billLineHeight = 6;
//     //     const billBoxWidth = contentWidth - 20;
//     //     pdf.setFillColor(220, 240, 255); // Light blue
//     //     pdf.rect(marginLeft, y - 5, billBoxWidth, billLineHeight + 3, "F");

//     //     pdf.setFontSize(10);
//     //     pdf.setTextColor(0);
//     //     pdf.text(billText, marginLeft + 2, y);
//     // }

//     // const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
//     // pdf.text(`Bill Date: ${formattedDate}`, marginLeft + 60, y);
//     // if (isValidValue(formData?.followup_date)) {
//     //     pdf.text(`Follow-Up: ${formData.followup_date}`, marginLeft + 120, y);
//     // }

//     // y += lineHeight;
//     // === Billed Info Row Styling ===
// const billLineHeight = 5;
// const billBoxHeight = billLineHeight + 4;

// // Background box
// pdf.setFillColor(245, 245, 245); // #f5f5f5
// pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD"); // 'F' fill, 'D' draw border

// // Set font
// pdf.setFontSize(10);
// pdf.setTextColor(0);
// pdf.setFont("times", "normal");

// // Text values
// const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
// const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";

// // Determine Bill Number Text
// const billText = billId && billIds
//     ? `Bill No: ${billId} (Prev: ${billIds})`
//     : billId
//     ? `Bill No: ${billId}`
//     : billIds
//     ? `Prev Bill No: ${billIds}`
//     : "";

// // Padding between fields (dynamic layout)
// const columnWidth = contentWidth / 3;
// pdf.text(billText, marginLeft + 2, y + 6);
// pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
// pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

// // Advance y
// y += billBoxHeight + 1;

// }



// function drawBillingDetails() {
//   y += 8;

//   // Heading
//   pdf.setFontSize(12);
//   pdf.setFont("times", "bold");
//   pdf.text("Billing Details", marginLeft, y);
//   y += 6; // tighter spacing

//   // Table
//   pdf.autoTable({
//     startY: y,
//     head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//     body: [
//       ...descriptions.map((product, index) => [
//         index + 1,
//         product.description || "N/A",
//         product.quantity?.toString() || "N/A",
//         `${parseFloat(product.price || 0).toFixed(2)}`,
//         product.gst?.toString() || "N/A",
//         `${parseFloat(product.total || 0).toFixed(2)}`
//       ]),
//       ["", "", "", "", "Grand Total", `${parseFloat(grandTotal || 0).toFixed(2)}`]
//     ],
//     theme: "grid",
//     headStyles: {
//       fillColor: [66, 139, 202],
//       textColor: [255, 255, 255],
//       fontSize: 9
//     },
//     styles: {
//       fontSize: 9,
//       font: "times",
//       cellPadding: 1.5,
//       halign: "center",
//       valign: "middle"
//     },
//     columnStyles: {
//       0: { halign: "center" },
//       1: { halign: "left" },
//       2: { halign: "right" },
//       3: { halign: "right" },
//       4: { halign: "right" },
//       5: { halign: "right" }
//     },
//     margin: { left: marginLeft },
//     tableWidth: contentWidth
//   });

//   // Update y after table
//   y = pdf.lastAutoTable.finalY + 5;
// }


//         function drawSignature() {
//             y = pdf.internal.pageSize.getHeight() - 20;
//             pdf.setFont("times", "italic");
//             pdf.text("Authorized Signature", pageWidth - 40, y);
//             pdf.line(pageWidth - 50, y + 2, pageWidth - 20, y + 2);
//         }

//         function isValidValue(value) {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 const upper = value.trim().toUpperCase();
//                 return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//             }
//             if (typeof value === 'object') return Object.keys(value).length > 0;
//             return true;
//         }

//         function hasValidPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//             const data = patientExaminations[0] || {};
//             return [
//                 data?.bp, data?.pulse, data?.height, data?.weight,
//                 data?.past_history, data?.complaints,
//                 data?.systemic_exam_general, data?.systemic_exam_pa
//             ].some(isValidValue);
//         }

//         function hasValidAyurvedicExamination() {
//             if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//             const obs = AyurvedicExaminations[0] || {};
//             return [
//                 obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//                 obs?.prasavvedan_parikshayein, obs?.habits,
//                 obs?.lab_investigation, obs?.personal_history,
//                 obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//             ].some(isValidValue);
//         }

//         // function drawPatientExamination() {
//         //     if (!hasValidPatientExamination()) return;

//         //     const data = patientExaminations[0] || {};
//         //     const fields = [
//         //         { label: "BP", value: data?.bp },
//         //         { label: "Pulse", value: data?.pulse },
//         //         { label: "Height", value: data?.height },
//         //         { label: "Weight", value: data?.weight },
//         //         { label: "Past History", value: data?.past_history },
//         //         { label: "Complaints", value: data?.complaints },
//         //         { label: "Systemic Exam", value: data?.systemic_exam_general },
//         //         { label: "Diagnosis", value: data?.systemic_exam_pa },
//         //     ].filter(f => isValidValue(f.value));

//         //     if (fields.length === 0) return;

//         //     pdf.setFont("helvetica");
//         //     pdf.setFontSize(11);
//         //     pdf.setFillColor(245, 245, 245);
//         //     pdf.rect(marginLeft, y - 1, contentWidth, 8, "F");
//         //     pdf.text("Medical Observation:", marginLeft + 2, y + 4);
//         //     y += 8;

//         //     const bodyData = [];
//         //     for (let i = 0; i < fields.length; i += 2) {
//         //         const row = [
//         //             { content: fields[i].label, styles: { fontStyle: "bold" } },
//         //             fields[i].value,
//         //         ];
//         //         if (fields[i + 1]) {
//         //             row.push({ content: fields[i + 1].label, styles: { fontStyle: "bold" } });
//         //             row.push(fields[i + 1].value);
//         //         } else {
//         //             row.push("", "");
//         //         }
//         //         bodyData.push(row);
//         //     }

//         //     autoTable(pdf, {
//         //         startY: y,
//         //         head: [["Field", "Value", "Field", "Value"]],
//         //         body: bodyData,
//         //         theme: "grid",
//         //         styles: { fontSize: 9, font: "helvetica", cellPadding: 2, halign: "left" },
//         //         headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0], fontSize: 9 },
//         //         columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 45 }, 2: { cellWidth: 35 }, 3: { cellWidth: 45 } },
//         //     });

//         //     y = pdf.lastAutoTable.finalY + 3;
//         // }
// function drawPatientExamination() {
//   if (!hasValidPatientExamination()) return;

//   const data = patientExaminations[0] || {};
//   pdf.setFont("helvetica");
//   pdf.setFontSize(10);

//    y += 6; 

//   const lightGrey = [245, 245, 245];
//   const labelFontStyle = "bold";
//   const valueFontStyle = "normal";
//   const sectionGap = 4;
//   const paddingX = 2;

//   // --- Small Fields (Inline Row: BP, Pulse, Height, Weight) ---
//   const smallFields = [
//     { label: "BP", value: data?.bp },
//     { label: "Pulse", value: data?.pulse },
//     { label: "Height", value: data?.height },
//     { label: "Weight", value: data?.weight },
//   ].filter(f => isValidValue(f.value));

//   if (smallFields.length > 0) {
//     const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//     pdf.setFillColor(...lightGrey);
//     pdf.setDrawColor(0); // black border
//     pdf.rect(marginLeft, y, contentWidth, 8, "FD"); // Fill + Draw border

//     pdf.setFont("helvetica", valueFontStyle);
//     pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//     y += 9;
//   }

//   // --- Long Fields (Full Width Box Sections) ---
//   const longFields = [
//     { label: "Past History", value: data?.past_history },
//     { label: "Complaints", value: data?.complaints },
//     { label: "Systemic Exam", value: data?.systemic_exam_general },
//     { label: "Diagnosis", value: data?.systemic_exam_pa },
//   ].filter(f => isValidValue(f.value));

//   longFields.forEach(field => {
//     const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//     const boxHeight = wrappedText.length * 5 + 8;

//     pdf.setFillColor(...lightGrey);
//     pdf.setDrawColor(0); // black border
//     pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD"); // Fill + Draw border

//     // Label
//     pdf.setFont("helvetica", labelFontStyle);
//     pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//     // Value (multiline)
//     pdf.setFont("helvetica", valueFontStyle);
//     wrappedText.forEach((line, i) => {
//       pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//     });

//     y += boxHeight + sectionGap;
//   });
// }




//         function drawAyurvedicExamination() {
//             if (!hasValidAyurvedicExamination()) return;

//             const obs = AyurvedicExaminations[0] || {};
//             const fields = [
//                 { label: "Occupation", value: obs?.occupation },
//                 { label: "Pincode", value: obs?.pincode },
//                 { label: "Past History", value: obs?.ayurPastHistory },
//                 { label: "Investigation", value: obs?.lab_investigation },
//                 { label: "Food Allergy", value: obs?.food_and_drug_allergy },
//                 { label: "LMP", value: obs?.lmp },
//                 { label: "EDD", value: obs?.edd },
//             ];

//             registerDevnagariFont(pdf);

//             if (isValidValue(obs?.prasavvedan_parikshayein)) {
//                 const raw = obs.prasavvedan_parikshayein;
//                 const safeDecode = (str) => {
//                     try {
//                         if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//                         return str;
//                     } catch { return str; }
//                 };
//                 if (typeof raw === "object") {
//                     const prasavText = Object.entries(raw)
//                         .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//                         .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
//                         .join(" | ");
//                     if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
//                 }
//             }

//             if (isValidValue(obs?.habits)) {
//                 try {
//                     const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
//                     const text = Object.entries(habitData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing habits:", e); }
//             }

//             if (isValidValue(obs?.personal_history)) {
//                 try {
//                     const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
//                     const text = Object.entries(personalData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing personal history:", e); }
//             }

//             const validFields = fields.filter(f => isValidValue(f.value));
//             if (validFields.length === 0) return;

//             pdf.setFont("helvetica");
//             pdf.setFontSize(11);
//             pdf.setFillColor(245, 245, 245);
//             pdf.rect(marginLeft, y - 1, contentWidth, 8, "F");
//             pdf.text("Ayurvedic Observation:", marginLeft + 2, y + 4);
//             y += 8;

//             const fullRowFields = validFields.filter(f => f.isFullWidth);
//             const normalFields = validFields.filter(f => !f.isFullWidth);

//             const bodyData = [];
//             for (let i = 0; i < normalFields.length; i += 2) {
//                 const row = [
//                     { content: normalFields[i].label, styles: { fontStyle: "bold" } },
//                     normalFields[i].value,
//                 ];
//                 if (normalFields[i + 1]) {
//                     row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
//                     row.push(normalFields[i + 1].value);
//                 } else {
//                     row.push("", "");
//                 }
//                 bodyData.push(row);
//             }

//             if (bodyData.length > 0) {
//                 autoTable(pdf, {
//                     startY: y,
//                     head: [["Field", "Value", "Field", "Value"]],
//                     body: bodyData,
//                     theme: "grid",
//                     styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
//                     headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
//                 });
//                 y = pdf.lastAutoTable.finalY + 3;
//             }

//             fullRowFields.forEach(field => {
//                 const boxWidth = 180;
//                 const boxX = marginLeft;
//                 const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
//                 const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
//                 const boxHeight = wrapped.length * 4 + 8;

//                 pdf.setDrawColor(150);
//                 pdf.setFillColor(240, 240, 240);
//                 pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica");
//                 pdf.setFontSize(9);
//                 pdf.text(`${field.label}:`, boxX + 3, y + 5);

//                 pdf.setFont(contentFont);
//                 pdf.text(wrapped, boxX + 3, y + 10);

//                 y += boxHeight + 3;
//             });
//         }

//         function formatKey(str) {
//             return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
//         }

//         drawBorder();
//         drawHeader();
//         drawPatientAndDoctorDetails();
//         drawBillingDetails();

//         // if (hasValidPatientExamination() || hasValidAyurvedicExamination() || (Array.isArray(healthDirectives) && healthDirectives.length > 0)) {
//         //     pdf.addPage();
//         //      y = 10;
//         //     drawBorder();
//         //     drawHeader();
//         //     drawPatientAndDoctorDetails();
//         //     if (hasValidPatientExamination()) drawPatientExamination();
//         //     if (hasValidAyurvedicExamination()) drawAyurvedicExamination();
//         //     const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//         //     if (hasPrescription) {
//         //         pdf.setFontSize(12);
//         //         pdf.setFont("times", "bold");
//         //         pdf.setFillColor(245, 245, 245);
//         //         pdf.rect(marginLeft, y - 1, contentWidth, 8, "F");
//         //         pdf.text("Prescription:", marginLeft + 2, y + 4);
//         //         y += 8;
//         //         pdf.autoTable({
//         //             startY: y,
//         //             head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
//         //             body: healthDirectives.map((item, index) => [
//         //                 index + 1,
//         //                 item.medicine || "N/A",
//         //                 item.strength || "N/A",
//         //                 item.dosage || "N/A",
//         //                 item.timing || "N/A",
//         //                 item.frequency || "N/A",
//         //                 item.duration || "N/A"
//         //             ]),
//         //             theme: "grid",
//         //             headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255], fontSize: 9 },
//         //             styles: { halign: "center", fontSize: 9, font: "times", cellPadding: 1.5 },
//         //             columnStyles: {
//         //                 0: { cellWidth: 12 },
//         //                 1: { cellWidth: 35 },
//         //                 2: { cellWidth: 20 },
//         //                 3: { cellWidth: 20 },
//         //                 4: { cellWidth: 20 },
//         //                 5: { cellWidth: 20 },
//         //                 6: { cellWidth: 20 }
//         //             }
//         //         });
//         //     }
//         // }
          
//         if (
//   hasValidPatientExamination() ||
//   hasValidAyurvedicExamination() ||
//   (Array.isArray(healthDirectives) && healthDirectives.length > 0)
// ) {
//   pdf.addPage();
//   y = 10;

//   drawBorder();
//   drawHeader();
//   drawPatientAndDoctorDetails();

//   if (hasValidPatientExamination()) drawPatientExamination();
//   if (hasValidAyurvedicExamination()) drawAyurvedicExamination();

//   const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;

//   if (hasPrescription) {
//     // No Prescription header or extra box

//     pdf.autoTable({
//       startY: y,
//       head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
//       body: healthDirectives.map((item, index) => [
//         index + 1,
//         item.medicine || "N/A",
//         item.strength || "N/A",
//         item.dosage || "N/A",
//         item.timing || "N/A",
//         item.frequency || "N/A",
//         item.duration || "N/A"
//       ]),
//       theme: "grid",
//       margin: { left: marginLeft },           // Align left with content
//       tableWidth: contentWidth,               // Stretch to match diagnosis box
//       headStyles: {
//         fillColor: [66, 139, 202],
//         textColor: [255, 255, 255],
//         fontSize: 9,
//         halign: "center"
//       },
//       styles: {
//         fontSize: 9,
//         font: "times",
//         cellPadding: 1.5,
//         halign: "center",
//         valign: "middle"
//       }
//     });

//     // Update y to bottom of the table if you need to continue drawing
//     y = pdf.lastAutoTable.finalY + 5;
//   }
// }


//         const totalPages = pdf.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             pdf.setPage(i);
//             pdf.setFontSize(8);
//             pdf.setFont("times", "italic");
//             pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });
//         }

//         if (isWhatsAppShare) {
//             console.log('Generating PDF blob for WhatsApp...');
//             try {
//                 const blob = pdf.output('blob');
//                 if (!blob || blob.size === 0) throw new Error('Invalid blob');
//                 return blob;
//             } catch (blobError) {
//                 console.error('Blob error:', blobError);
//                 throw new Error(`Blob failed: ${blobError.message}`);
//             }
//         } else {
//             const filename = `${invoiceNo}-${patient_name}.pdf`;
//             pdf.save(filename);
//             return pdf;
//         }
//     } catch (error) {
//         console.error('PDF error:', error);
//         throw new Error(`Generation failed: ${error.message}`);
//     }
// }

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
//         if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, true);
//     } catch (error) {
//         console.error('Blob error:', error);
//         throw new Error(`Blob failed: ${error.message}`);
//     }
// }

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
//     return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
// }

// export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
//     try {
//         if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
//         const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
//         if (navigator.share && navigator.canShare({ files: [file] })) {
//             await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
//             return { success: true, method: 'web-share' };
//         }
//         const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
//         const url = URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = file.name;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
//         return { success: true, method: 'fallback', message: 'Download and attach manually' };
//     } catch (error) {
//         console.error('Share error:', error);
//         return { success: false, error: error.message, message: 'Share failed' };
//     }
// }

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
//         if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
//         const pdfBlob = generatePDFBlob(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount);
//         const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
//         return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//     } catch (error) {
//         console.error('SharePDF error:', error);
//         return { success: false, error: error.message, message: `Share failed: ${error.message}` };
//     }
// }

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
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
//     } catch (error) {
//         console.error('Download error:', error);
//         throw new Error(`Download failed: ${error.message}`);
//     }
// }





// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
//         registerDevnagariFont(pdf);

//         const marginLeft = 10;
//         let y = 10;
//         const lineHeight = 5;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(100, 100, 100);
//             pdf.setLineWidth(0.3);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
//         }

//         function drawHeader() {
//             const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(18);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`Address: ${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "bold");
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

//             y += logoSize + 8;
//             pdf.setDrawColor(150, 150, 150);
//             pdf.line(10, y - 5, pageWidth - 10, y - 5);
//         }

//         function drawPatientAndDoctorDetails() {

//                         const billLineHeight = 5;
//             const billBoxHeight = billLineHeight + 4;

//             pdf.setFillColor(240, 245, 255);
//             pdf.setDrawColor(0);
//             pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD");

//             pdf.setFontSize(10);
//             pdf.setTextColor(0);
//             pdf.setFont("times", "normal");

//             const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
//             const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";
//             const billText = billId && billIds
//                 ? `Bill No: ${billId} (Prev: ${billIds})`
//                 : billId
//                 ? `Bill No: ${billId}`
//                 : billIds
//                 ? `Prev Bill No: ${billIds}`
//                 : "";

//             const columnWidth = contentWidth / 3;
//             pdf.text(billText, marginLeft + 2, y + 6);
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
//             pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

// y += billBoxHeight + 5;






//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;

//             pdf.setDrawColor(0);
//             pdf.setFillColor(240, 245, 255);
//             pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
//             pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

//             pdf.setFontSize(12);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 5);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
//             });

//             const eduOffset = educationLines.length * 4;
//             pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             y += 38;



            
//         }

//         function isValidValue(value) {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 const upper = value.trim().toUpperCase();
//                 return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//             }
//             if (typeof value === 'object') return Object.keys(value).length > 0;
//             return true;
//         }

//         function hasValidPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//             const data = patientExaminations[0] || {};
//             return [
//                 data?.bp, data?.pulse, data?.height, data?.weight,
//                 data?.past_history, data?.complaints,
//                 data?.systemic_exam_general, data?.systemic_exam_pa
//             ].some(isValidValue);
//         }

//         function hasValidAyurvedicExamination() {
//             if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//             const obs = AyurvedicExaminations[0] || {};
//             return [
//                 obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//                 obs?.prasavvedan_parikshayein, obs?.habits,
//                 obs?.lab_investigation, obs?.personal_history,
//                 obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//             ].some(isValidValue);
//         }

//         // function drawPatientExamination() {
//         //     if (!hasValidPatientExamination()) return;

//         //     const data = patientExaminations[0] || {};
//         //     pdf.setFont("helvetica");
//         //     pdf.setFontSize(12);
//         //     pdf.setTextColor(0, 51, 102);
//         //     // pdf.text("Medical Observation:", marginLeft, y + 5);
//         //     y += 8;

//         //     const lightGrey = [245, 245, 255];
//         //     const labelFontStyle = "bold";
//         //     const valueFontStyle = "normal";
//         //     const sectionGap = 4;
//         //     const paddingX = 3;

//         //     const smallFields = [
//         //         { label: "BP", value: data?.bp },
//         //         { label: "Pulse", value: data?.pulse },
//         //         { label: "Height", value: data?.height },
//         //         { label: "Weight", value: data?.weight },
//         //     ].filter(f => isValidValue(f.value));

//         //     if (smallFields.length > 0) {
//         //         const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//         //         pdf.setFillColor(...lightGrey);
//         //         pdf.setDrawColor(150);
//         //         pdf.rect(marginLeft, y, contentWidth, 8, "FD");

//         //         pdf.setFont("helvetica", valueFontStyle);
//         //         pdf.setFontSize(10);
//         //         pdf.setTextColor(0);
//         //         pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//         //         y += 9;
//         //     }

//         //     const longFields = [
//         //         { label: "Past History", value: data?.past_history },
//         //         { label: "Complaints", value: data?.complaints },
//         //         { label: "Systemic Exam", value: data?.systemic_exam_general },
//         //         { label: "Diagnosis", value: data?.systemic_exam_pa },
//         //     ].filter(f => isValidValue(f.value));

//         //     longFields.forEach(field => {
//         //         const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//         //         const boxHeight = wrappedText.length * 5 + 8;

//         //         pdf.setFillColor(...lightGrey);
//         //         pdf.setDrawColor(150);
//         //         pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

//         //         pdf.setFont("helvetica", labelFontStyle);
//         //         pdf.setFontSize(10);
//         //         pdf.setTextColor(0, 51, 102);
//         //         pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//         //         pdf.setFont("helvetica", valueFontStyle);
//         //         pdf.setTextColor(0);
//         //         wrappedText.forEach((line, i) => {
//         //             pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//         //         });

//         //         y += boxHeight + sectionGap;
//         //     });
//         // }
//         function drawPatientExamination() {
//     if (!hasValidPatientExamination()) return;

//     const data = patientExaminations[0] || {};
//     pdf.setFont("helvetica");
//     pdf.setFontSize(12);
//     pdf.setTextColor(0, 51, 102);

//     const lightGrey = [245, 245, 255];
//     const labelFontStyle = "bold";
//     const valueFontStyle = "normal";
//     const sectionGap = 4;
//     const paddingX = 3;

//     const smallFields = [
//         { label: "BP", value: data?.bp },
//         { label: "Pulse", value: data?.pulse },
//         { label: "Height", value: data?.height },
//         { label: "Weight", value: data?.weight },
//     ].filter(f => isValidValue(f.value));

//     if (smallFields.length > 0) {
//         const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//         pdf.setFillColor(...lightGrey);
//         pdf.setDrawColor(150);
//         pdf.rect(marginLeft, y, contentWidth, 8, "FD");

//         pdf.setFont("helvetica", valueFontStyle);
//         pdf.setFontSize(10);
//         pdf.setTextColor(0);
//         pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//         y += 9;
//     }

//     const longFields = [
//         { label: "Past History", value: data?.past_history },
//         { label: "Complaints", value: data?.complaints },
//         { label: "Systemic Exam", value: data?.systemic_exam_general },
//         { label: "Diagnosis", value: data?.systemic_exam_pa },
//     ].filter(f => isValidValue(f.value));

//     longFields.forEach(field => {
//         const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//         const boxHeight = wrappedText.length * 5 + 8;

//         pdf.setFillColor(...lightGrey);
//         pdf.setDrawColor(150);
//         pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

//         pdf.setFont("helvetica", labelFontStyle);
//         pdf.setFontSize(10);
//         pdf.setTextColor(0, 51, 102);
//         pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//         pdf.setFont("helvetica", valueFontStyle);
//         pdf.setTextColor(0);
//         wrappedText.forEach((line, i) => {
//             pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//         });

//         y += boxHeight + sectionGap;
//     });
// }


//         function drawAyurvedicExamination() {
//             if (!hasValidAyurvedicExamination()) return;

//             const obs = AyurvedicExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);
//             // pdf.text("Ayurvedic Observation:", marginLeft, y + 5);
//             y += 8;

//             const fields = [
//                 { label: "Occupation", value: obs?.occupation },
//                 { label: "Pincode", value: obs?.pincode },
//                 { label: "Past History", value: obs?.ayurPastHistory },
//                 { label: "Investigation", value: obs?.lab_investigation },
//                 { label: "Food Allergy", value: obs?.food_and_drug_allergy },
//                 { label: "LMP", value: obs?.lmp },
//                 { label: "EDD", value: obs?.edd },
//             ];

//             registerDevnagariFont(pdf);

//             if (isValidValue(obs?.prasavvedan_parikshayein)) {
//                 const raw = obs.prasavvedan_parikshayein;
//                 const safeDecode = (str) => {
//                     try {
//                         if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//                         return str;
//                     } catch { return str; }
//                 };
//                 if (typeof raw === "object") {
//                     const prasavText = Object.entries(raw)
//                         .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//                         .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
//                         .join(" | ");
//                     if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
//                 }
//             }

//             if (isValidValue(obs?.habits)) {
//                 try {
//                     const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
//                     const text = Object.entries(habitData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing habits:", e); }
//             }

//             if (isValidValue(obs?.personal_history)) {
//                 try {
//                     const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
//                     const text = Object.entries(personalData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing personal history:", e); }
//             }

//             const validFields = fields.filter(f => isValidValue(f.value));
//             if (validFields.length === 0) return;

//             const fullRowFields = validFields.filter(f => f.isFullWidth);
//             const normalFields = validFields.filter(f => !f.isFullWidth);

//             const bodyData = [];
//             for (let i = 0; i < normalFields.length; i += 2) {
//                 const row = [
//                     { content: normalFields[i].label, styles: { fontStyle: "bold" } },
//                     normalFields[i].value,
//                 ];
//                 if (normalFields[i + 1]) {
//                     row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
//                     row.push(normalFields[i + 1].value);
//                 } else {
//                     row.push("", "");
//                 }
//                 bodyData.push(row);
//             }

//             if (bodyData.length > 0) {
//                 autoTable(pdf, {
//                     startY: y,
//                     head: [["Field", "Value", "Field", "Value"]],
//                     body: bodyData,
//                     theme: "grid",
//                     styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
//                     headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
//                     margin: { left: marginLeft },
//                     tableWidth: contentWidth
//                 });
//                 y = pdf.lastAutoTable.finalY + 5;
//             }

//             fullRowFields.forEach(field => {
//                 const boxWidth = contentWidth;
//                 const boxX = marginLeft;
//                 const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
//                 const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
//                 const boxHeight = wrapped.length * 4 + 8;

//                 pdf.setDrawColor(150);
//                 pdf.setFillColor(245, 245, 255);
//                 pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", "bold");
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, boxX + 3, y + 5);

//                 pdf.setFont(contentFont, "normal");
//                 pdf.setTextColor(0);
//                 pdf.text(wrapped, boxX + 3, y + 10);

//                 y += boxHeight + 3;
//             });
//         }

 
//         function drawPrescription() {
//     const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//     if (!hasPrescription) return;

//     pdf.setFont("helvetica");
//     pdf.setFontSize(12);
//     pdf.setTextColor(0, 51, 102);
    
//     y += 8;

//     pdf.autoTable({
//         startY: y,
//         head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
//         body: healthDirectives.map((item, index) => [
//             index + 1,
//             item.medicine || "N/A",
//             item.strength || "N/A",
//             item.dosage || "N/A",
//             item.timing || "N/A",
//             item.frequency || "N/A",
//             item.duration || "N/A"
//         ]),
//         theme: "grid",
//         // margin: { left: 15, right: 15 }, // match diagnosis box
//         // tableWidth: 'auto',
//         margin: { left: marginLeft },  
//         tableWidth: contentWidth,
//         headStyles: {
//             fillColor: [66, 139, 202],
//             textColor: [255, 255, 255],
//             fontSize: 9,
//             halign: "center"
//         },
//         styles: {
//             fontSize: 9,
//             font: "times",
//             cellPadding: 2,
//             halign: "center",
//             valign: "middle"
//         },
//         // columnStyles optional here since tableWidth will auto adjust
//     });

//     y = pdf.lastAutoTable.finalY + 5;
// }


//         function drawBillingDetails() {
//             pdf.setFontSize(12);
//             pdf.setFont("helvetica", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Billing Details", marginLeft, y + 5);
//             y += 8;

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//                 body: [
//                     ...descriptions.map((product, index) => [
//                         index + 1,
//                         product.description || "N/A",
//                         product.quantity?.toString() || "N/A",
//                         `${parseFloat(product.price || 0).toFixed(2)}`,
//                         product.gst?.toString() || "N/A",
//                         `${parseFloat(product.total || 0).toFixed(2)}`
//                     ]),
//                     ["", "", "", "", "Grand Total", `${parseFloat(grandTotal || 0).toFixed(2)}`]
//                 ],
//                 theme: "grid",
//                 headStyles: {
//                     fillColor: [66, 139, 202],
//                     textColor: [255, 255, 255],
//                     fontSize: 9
//                 },
//                 styles: {
//                     fontSize: 9,
//                     font: "times",
//                     cellPadding: 2,
//                     halign: "center",
//                     valign: "middle"
//                 },
//                 columnStyles: {
//                     0: { halign: "center" },
//                     1: { halign: "left" },
//                     2: { halign: "right" },
//                     3: { halign: "right" },
//                     4: { halign: "right" },
//                     5: { halign: "right" }
//                 },
//                 margin: { left: marginLeft },
//                 tableWidth: contentWidth
//             });

//             y = pdf.lastAutoTable.finalY + 5;

//             // Add total amount in words
//             pdf.setFontSize(10);
//             pdf.setFont("helvetica", "italic");
//             pdf.setTextColor(0);
//             pdf.text(`Total Amount in Words: ${totalAmountWords || "N/A"}`, marginLeft, y + 5);
//             y += 8;

//             // Add remaining amount if applicable
//             if (isValidValue(remainingAmount)) {
//                 pdf.setFont("helvetica", "bold");
//                 pdf.setTextColor(200, 0, 0);
//                 pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
//                 y += 8;
//             }
//         }

//         function drawSignature() {
//             y = pageHeight - 20;
//             pdf.setFont("times", "italic");
//             pdf.setFontSize(10);
//             pdf.setTextColor(0);
//             pdf.text("Authorized Signature", pageWidth - 40, y);
//             pdf.line(pageWidth - 50, y + 2, pageWidth - 20, y + 2);
//         }

//         function formatKey(str) {
//             return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
//         }

//         // First page: Header, Patient/Doctor Details, Medical Observations, Prescription
//         drawBorder();
//         drawHeader();
//         drawPatientAndDoctorDetails();
//         if (hasValidPatientExamination()) drawPatientExamination();
//         if (hasValidAyurvedicExamination()) drawAyurvedicExamination();
//         drawPrescription();

//         // Second page: Billing Details
//         if (descriptions && descriptions.length > 0) {
//             pdf.addPage();
//             y = 10;
//             drawBorder();
//             drawHeader();
//             drawPatientAndDoctorDetails();
//             drawBillingDetails();
//         }

//         // Add signature and footer on all pages
//         const totalPages = pdf.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             pdf.setPage(i);
//             drawSignature();
//             pdf.setFontSize(8);
//             pdf.setFont("times", "italic");
//             pdf.setTextColor(100, 100, 100);
//             pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });
//             pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: "right" });
//         }

//         if (isWhatsAppShare) {
//             console.log('Generating PDF blob for WhatsApp...');
//             try {
//                 const blob = pdf.output('blob');
//                 if (!blob || blob.size === 0) throw new Error('Invalid blob');
//                 return blob;
//             } catch (blobError) {
//                 console.error('Blob error:', blobError);
//                 throw new Error(`Blob failed: ${blobError.message}`);
//             }
//         } else {
//             const filename = `${invoiceNo}-${patient_name}.pdf`;
//             pdf.save(filename);
//             return pdf;
//         }
//     } catch (error) {
//         console.error('PDF error:', error);
//         throw new Error(`Generation failed: ${error.message}`);
//     }
// }

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
//         if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, true);
//     } catch (error) {
//         console.error('Blob error:', error);
//         throw new Error(`Blob failed: ${error.message}`);
//     }
// }

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
//     return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
// }

// export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
//     try {
//         if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
//         const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
//         if (navigator.share && navigator.canShare({ files: [file] })) {
//             await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
//             return { success: true, method: 'web-share' };
//         }
//         const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
//         const url = URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = file.name;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
//         return { success: true, method: 'fallback', message: 'Download and attach manually' };
//     } catch (error) {
//         console.error('Share error:', error);
//         return { success: false, error: error.message, message: 'Share failed' };
//     }
// }

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
//         if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
//         const pdfBlob = generatePDFBlob(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount);
//         const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
//         return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//     } catch (error) {
//         console.error('SharePDF error:', error);
//         return { success: false, error: error.message, message: `Share failed: ${error.message}` };
//     }
// }

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
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
//     } catch (error) {
//         console.error('Download error:', error);
//         throw new Error(`Download failed: ${error.message}`);
//     }
// }

// ______________________________________________________________________________________________________ 

// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
//         registerDevnagariFont(pdf);

//         const marginLeft = 10;
//         let y = 10;
//         const lineHeight = 5;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(100, 100, 100);
//             pdf.setLineWidth(0.3);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
//         }

//         function drawHeader() {
//             const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(18);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "bold");
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

//             y += logoSize + 8;
//             pdf.setDrawColor(150, 150, 150);
//             pdf.line(10, y - 5, pageWidth - 10, y - 5);
//         }

//         function drawPatientAndDoctorDetails() {
//             const billLineHeight = 5;
//             const billBoxHeight = billLineHeight + 4;

//             pdf.setFillColor(240, 245, 255);
//             pdf.setDrawColor(0);
//             pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD");

//             pdf.setFontSize(10);
//             pdf.setTextColor(0);
//             pdf.setFont("times", "normal");

//             const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
//             const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";
//             const billText = billId && billIds
//                 ? `Bill No: ${billId} (Prev: ${billIds})`
//                 : billId
//                 ? `Bill No: ${billId}`
//                 : billIds
//                 ? `Prev Bill No: ${billIds}`
//                 : "";

//             const columnWidth = contentWidth / 3;
//             pdf.text(billText, marginLeft + 2, y + 6);
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
//             pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

//             y += billBoxHeight + 5;

//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;

//             pdf.setDrawColor(0);
//             pdf.setFillColor(240, 245, 255);
//             pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
//             pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

//             pdf.setFontSize(12);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 5);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
//             });

//             const eduOffset = educationLines.length * 4;
//             pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             y += 38;
//         }

//         function isValidValue(value) {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 const upper = value.trim().toUpperCase();
//                 return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//             }
//             if (typeof value === 'object') return Object.keys(value).length > 0;
//             return true;
//         }

//         function hasValidPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//             const data = patientExaminations[0] || {};
//             return [
//                 data?.bp, data?.pulse, data?.height, data?.weight,
//                 data?.past_history, data?.complaints,
//                 data?.systemic_exam_general, data?.systemic_exam_pa
//             ].some(isValidValue);
//         }

//         function hasValidAyurvedicExamination() {
//             if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//             const obs = AyurvedicExaminations[0] || {};
//             return [
//                 obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//                 obs?.prasavvedan_parikshayein, obs?.habits,
//                 obs?.lab_investigation, obs?.personal_history,
//                 obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//             ].some(isValidValue);
//         }

//         function drawPatientExamination() {
//             if (!hasValidPatientExamination()) return;

//             const data = patientExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);
//             // pdf.text("Medical Observation:", marginLeft, y + 5);
//             // y += 8;

//             const lightGrey = [245, 245, 255];
//             const labelFontStyle = "bold";
//             const valueFontStyle = "normal";
//             const sectionGap = 4;
//             const paddingX = 3;

//             const smallFields = [
//                 { label: "BP", value: data?.bp },
//                 { label: "Pulse", value: data?.pulse },
//                 { label: "Height", value: data?.height },
//                 { label: "Weight", value: data?.weight },
//             ].filter(f => isValidValue(f.value));

//             if (smallFields.length > 0) {
//                 const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, 8, "FD");

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0);
//                 pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//                 y += 9;
//             }

//             const longFields = [
//                 { label: "Past History", value: data?.past_history },
//                 { label: "Complaints", value: data?.complaints },
//                 { label: "Systemic Exam", value: data?.systemic_exam_general },
//                 { label: "Diagnosis", value: data?.systemic_exam_pa },
//             ].filter(f => isValidValue(f.value));

//             longFields.forEach(field => {
//                 const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//                 const boxHeight = wrappedText.length * 5 + 8;

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", labelFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setTextColor(0);
//                 wrappedText.forEach((line, i) => {
//                     pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//                 });

//                 y += boxHeight + sectionGap;
//             });
//         }

//         function drawAyurvedicExamination() {
//             if (!hasValidAyurvedicExamination()) return;

//             const obs = AyurvedicExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Ayurvedic Observation:", marginLeft, y + 5);
//             y += 8;

//             const fields = [
//                 { label: "Occupation", value: obs?.occupation },
//                 { label: "Pincode", value: obs?.pincode },
//                 { label: "Past History", value: obs?.ayurPastHistory },
//                 { label: "Investigation", value: obs?.lab_investigation },
//                 { label: "Food Allergy", value: obs?.food_and_drug_allergy },
//                 { label: "LMP", value: obs?.lmp },
//                 { label: "EDD", value: obs?.edd },
//             ];

//             registerDevnagariFont(pdf);

//             if (isValidValue(obs?.prasavvedan_parikshayein)) {
//                 const raw = obs.prasavvedan_parikshayein;
//                 const safeDecode = (str) => {
//                     try {
//                         if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//                         return str;
//                     } catch { return str; }
//                 };
//                 if (typeof raw === "object") {
//                     const prasavText = Object.entries(raw)
//                         .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//                         .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
//                         .join(" | ");
//                     if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
//                 }
//             }

//             if (isValidValue(obs?.habits)) {
//                 try {
//                     const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
//                     const text = Object.entries(habitData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing habits:", e); }
//             }

//             if (isValidValue(obs?.personal_history)) {
//                 try {
//                     const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
//                     const text = Object.entries(personalData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing personal history:", e); }
//             }

//             const validFields = fields.filter(f => isValidValue(f.value));
//             if (validFields.length === 0) return;

//             const fullRowFields = validFields.filter(f => f.isFullWidth);
//             const normalFields = validFields.filter(f => !f.isFullWidth);

//             const bodyData = [];
//             for (let i = 0; i < normalFields.length; i += 2) {
//                 const row = [
//                     { content: normalFields[i].label, styles: { fontStyle: "bold" } },
//                     normalFields[i].value,
//                 ];
//                 if (normalFields[i + 1]) {
//                     row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
//                     row.push(normalFields[i + 1].value);
//                 } else {
//                     row.push("", "");
//                 }
//                 bodyData.push(row);
//             }

//             if (bodyData.length > 0) {
//                 autoTable(pdf, {
//                     startY: y,
//                     head: [["Field", "Value", "Field", "Value"]],
//                     body: bodyData,
//                     theme: "grid",
//                     styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
//                     headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
//                     margin: { left: marginLeft },
//                     tableWidth: contentWidth
//                 });
//                 y = pdf.lastAutoTable.finalY + 5;
//             }

//             fullRowFields.forEach(field => {
//                 const boxWidth = contentWidth;
//                 const boxX = marginLeft;
//                 const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
//                 const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
//                 const boxHeight = wrapped.length * 4 + 8;

//                 pdf.setDrawColor(150);
//                 pdf.setFillColor(245, 245, 255);
//                 pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", "bold");
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, boxX + 3, y + 5);

//                 pdf.setFont(contentFont, "normal");
//                 pdf.setTextColor(0);
//                 pdf.text(wrapped, boxX + 3, y + 10);

//                 y += boxHeight + 5;
//             });
//         }

//         // function drawPrescription() {
//         //     const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//         //     if (!hasPrescription) return;

//         //     pdf.setFont("helvetica");
//         //     pdf.setFontSize(9);
//         //     pdf.setTextColor(0);

//         //     autoTable(pdf, {
//         //         startY: y,
//         //         head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
//         //         body: healthDirectives.map((item, index) => [
//         //             index + 1,
//         //             item.medicine || "N/A",
//         //             item.strength || "N/A",
//         //             item.dosage || "N/A",
//         //             item.timing || "N/A",
//         //             item.frequency || "N/A",
//         //             item.duration || "N/A"
//         //         ]),
//         //         theme: "grid",
//         //         margin: { left: marginLeft },
//         //         tableWidth: contentWidth,
//         //         headStyles: {
//         //             fillColor: [66, 139, 202],
//         //             textColor: [255, 255, 255],
//         //             fontSize: 9,
//         //             halign: "center"
//         //         },
//         //         styles: {
//         //             fontSize: 9,
//         //             font: "times",
//         //             cellPadding: 2,
//         //             halign: "center",
//         //             valign: "middle"
//         //         },
//         //         columnStyles: {
//         //             0: { cellWidth: 15 },
//         //             1: { cellWidth: 40 },
//         //             2: { cellWidth: 25 },
//         //             3: { cellWidth: 25 },
//         //             4: { cellWidth: 25 },
//         //             5: { cellWidth: 25 },
//         //             6: { cellWidth: 25 }
//         //         },
//         //         didDrawPage: (data) => {
//         //             // Draw border on every page where table is rendered
//         //             drawBorder();
//         //             // Reset y for subsequent content on new pages
//         //             y = data.cursor.y + 5;
//         //         }
//         //     });

//         //     y = pdf.lastAutoTable.finalY + 5;
//         // }

//         // function drawBillingDetails() {
//         //     if (!descriptions || descriptions.length === 0) return;

//         //     pdf.setFontSize(12);
//         //     pdf.setFont("helvetica", "bold");
//         //     pdf.setTextColor(0, 51, 102);
//         //     pdf.text("Billing Details", marginLeft, y + 5);
//         //     y += 8;

//         //     pdf.autoTable({
//         //         startY: y,
//         //         head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//         //         body: [
//         //             ...descriptions.map((product, index) => [
//         //                 index + 1,
//         //                 product.description || "N/A",
//         //                 product.quantity?.toString() || "N/A",
//         //                 `${parseFloat(product.price || 0).toFixed(2)}`,
//         //                 product.gst?.toString() || "N/A",
//         //                 `${parseFloat(product.total || 0).toFixed(2)}`
//         //             ]),
//         //             ["", "", "", "", "Grand Total", `${parseFloat(grandTotal || 0).toFixed(2)}`]
//         //         ],
//         //         theme: "grid",
//         //         headStyles: {
//         //             fillColor: [66, 139, 202],
//         //             textColor: [255, 255, 255],
//         //             fontSize: 9
//         //         },
//         //         styles: {
//         //             fontSize: 9,
//         //             font: "times",
//         //             cellPadding: 2,
//         //             halign: "center",
//         //             valign: "middle"
//         //         },
//         //         columnStyles: {
//         //             0: { halign: "center" },
//         //             1: { halign: "left" },
//         //             2: { halign: "right" },
//         //             3: { halign: "right" },
//         //             4: { halign: "right" },
//         //             5: { halign: "right" }
//         //         },
//         //         margin: { left: marginLeft },
//         //         tableWidth: contentWidth,
//         //         didDrawPage: (data) => {
//         //             // Draw border on every page where table is rendered
//         //             drawBorder();
//         //             // Reset y for subsequent content on new pages
//         //             y = data.cursor.y + 5;
//         //         }
//         //     });

//         //     y = pdf.lastAutoTable.finalY + 5;

//         //     pdf.setFontSize(10);
//         //     pdf.setFont("helvetica", "italic");
//         //     pdf.setTextColor(0);
//         //     pdf.text(`Total Amount in Words: ${totalAmountWords || "N/A"}`, marginLeft, y + 5);
//         //     y += 8;

//         //     if (isValidValue(remainingAmount)) {
//         //         pdf.setFont("helvetica", "bold");
//         //         pdf.setTextColor(200, 0, 0);
//         //         pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
//         //         y += 8;
//         //     }
//         // }

//         // function drawSignature() {
//         //     // Ensure signature doesn't overlap with content
//         //     if (y > pageHeight - 30) {
//         //         pdf.addPage();
//         //         drawBorder();
//         //         y = 10;
//         //     }
//         //     y = pageHeight - 20;
//         //     pdf.setFont("times", "italic");
//         //     pdf.setFontSize(10);
//         //     pdf.setTextColor(0);
//         //     pdf.text("Authorized Signature", pageWidth - 40, y);
//         //     pdf.line(pageWidth - 50, y + 2, pageWidth - 20, y + 2);
//         // }

//         function drawPrescription() {
//     const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//     if (!hasPrescription) return;

//     pdf.setFont("helvetica");
//     pdf.setFontSize(9);
//     pdf.setTextColor(0);

//     autoTable(pdf, {
//         startY: y,
//         head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
//         body: healthDirectives.map((item, index) => [
//             index + 1,
//             item.medicine || "N/A",
//             item.strength || "N/A",
//             item.dosage || "N/A",
//             item.timing || "N/A",
//             item.frequency || "N/A",
//             item.duration || "N/A"
//         ]),
//         theme: "grid",
//         margin: { left: marginLeft },         // same as Diagnosis box
//         tableWidth: contentWidth,             // same width as Diagnosis box
//         headStyles: {
//             fillColor: [66, 139, 202],
//             textColor: [255, 255, 255],
//             fontSize: 9,
//             halign: "center"
//         },
//         styles: {
//             fontSize: 9,
//             font: "times",
//             cellPadding: 2,
//             halign: "center",
//             valign: "middle"
//         },
//         didDrawPage: (data) => {
//             drawBorder();
//             y = data.cursor.y + 5;
//         }
//     });

//     y = pdf.lastAutoTable.finalY + 5;
// }

//         function drawBillingDetails() {
//     if (!descriptions || descriptions.length === 0) return;

//     // Set heading
//     pdf.setFontSize(12);
//     pdf.setFont("helvetica", "bold");
//     pdf.setTextColor(0, 51, 102);
//     pdf.text("Billing Details", marginLeft, y + 5);
//     y += 8;

//     // Manually calculate total from all line items (excluding the Grand Total row)
//     const calculatedTotal = descriptions.reduce((acc, product) => {
//         const total = parseFloat(product.total || 0);
//         return acc + total;
//     }, 0);

//     // Prepare body rows for the table
//     const bodyRows = descriptions.map((product, index) => [
//         index + 1,
//         product.description || "N/A",
//         product.quantity?.toString() || "N/A",
//         `${parseFloat(product.price || 0).toFixed(2)}`,
//         product.gst?.toString() || "N/A",
//         `${parseFloat(product.total || 0).toFixed(2)}`
//     ]);

//     // Append Grand Total row
//     bodyRows.push(["", "", "", "", "Grand Total", `${calculatedTotal.toFixed(2)}`]);

//     pdf.autoTable({
//         startY: y,
//         head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//         body: bodyRows,
//         theme: "grid",
//         headStyles: {
//             fillColor: [66, 139, 202],
//             textColor: [255, 255, 255],
//             fontSize: 9
//         },
//         styles: {
//             fontSize: 9,
//             font: "times",
//             cellPadding: 2,
//             halign: "center",
//             valign: "middle"
//         },
//         columnStyles: {
//             0: { halign: "center" },
//             1: { halign: "left" },
//             2: { halign: "right" },
//             3: { halign: "right" },
//             4: { halign: "right" },
//             5: { halign: "right" }
//         },
//         margin: { left: marginLeft },
//         tableWidth: contentWidth,
//         didDrawPage: (data) => {
//             drawBorder();
//             y = data.cursor.y + 5;
//         }
//     });

//     y = pdf.lastAutoTable.finalY + 5;

//     // Show total value (again) below table for confirmation
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "bold");
//     pdf.setTextColor(0);
//     pdf.text(`Total : Rs ${calculatedTotal.toFixed(2)}`, marginLeft, y + 5);
//     y += 8;

//     // Show total amount in words
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "italic");
//     pdf.setTextColor(0);
//     // pdf.text(`Total Amount in Words: ${totalAmountWords || "N/A"}`, marginLeft, y + 5);
//     y += 8;

//     // Show remaining amount
//     if (isValidValue(remainingAmount)) {
//         pdf.setFont("helvetica", "bold");
//         pdf.setTextColor(200, 0, 0);
//         pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
//         y += 8;
//     }
// }




//         function drawSignature() {
//     // Move to bottom if not enough space
//     if (y > pageHeight - 30) {
//         pdf.addPage();
//         drawBorder();
//         y = 10;
//     }

//     y = pageHeight - 20;
//      const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }
//     const signatureText = "Authorized Signature";
//     const textWidth = pdf.getTextWidth(signatureText);
//     const lineWidth = textWidth + 10; // Slightly longer than text
//     const xPosition = pageWidth - lineWidth - 20; // Right-align with 20px padding
// //     const ySignature = pageHeight - 20; // Bottom padding for signature
// // const logoHeight = 30;
// // const logoWidth = 30;
// // const spacing = 5; // Space between logo and signature

// // // Calculate right-aligned X position for both logo and signature
// // const textWidth = pdf.getTextWidth("Authorized Signature");
// // const lineWidth = textWidth + 10;
// // const xRightAligned = pageWidth - lineWidth - 20; // 20px padding from right

// // // Show logo above the signature
// // if (doctorData?.sign) {
// //   try {
// //     const img = new Image();
// //     img.crossOrigin = "anonymous";
// //     img.src = doctorData?.sign;

// //     img.onload = () => {
// //       // Draw the logo above the signature
// //       const yLogo = ySignature - logoHeight - spacing;
// //       pdf.addImage(img, "PNG", xRightAligned, yLogo, logoWidth, logoHeight);

// //       // Draw the signature text below the logo
// //       pdf.setFontSize(10);
// //       pdf.text("Authorized Signature", xRightAligned + 5, ySignature);

// //       // Optional: Draw line above the signature
// //       pdf.setLineWidth(0.3);
// //       pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

// //       // Save PDF after image loads
// //     //   pdf.save("final.pdf");

// //        const filename = `${invoiceNo}-${patient_name}.pdf`;
// //             pdf.save(filename);
// //     };
// //   } catch (err) {
// //     console.warn("Logo could not be added:", err);
// //   }
// // } else {
// //   // If logo not found, just draw the signature
// //   pdf.setFontSize(10);
// //   pdf.text("Authorized Signature", xRightAligned + 5, ySignature);
// //   pdf.setLineWidth(0.3);
// //   pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

// //   // Save directly
// // //   pdf.save("final.pdf");
// //    const filename = `${invoiceNo}-${patient_name}.pdf`;
// //             pdf.save(filename);
// // }


//     // Draw line ABOVE the text
//     const lineY = y - 5;
//     pdf.setDrawColor(0);
//     pdf.line(xPosition, lineY, xPosition + lineWidth, lineY); 
//     // pdf.line(xRightAligned, lineY, xRightAligned + lineWidth, lineY);

//     // Draw text
//     pdf.setFont("times", "italic");
//     pdf.setFontSize(10);
//     pdf.setTextColor(0);
//     pdf.text(signatureText, xPosition + 5, y); 
//     // pdf.text(textWidth, xRightAligned + 5, y); 

// }




//         function formatKey(str) {
//             return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
//         }

//         // Single page: Header, Patient/Doctor Details, Medical Observations, Prescription, Billing
//         drawBorder();
//         drawHeader();
//         drawPatientAndDoctorDetails();
//         if (hasValidPatientExamination()) drawPatientExamination();
//         if (hasValidAyurvedicExamination()) drawAyurvedicExamination();
//         drawPrescription();
//         drawBillingDetails();

//         // Add signature and footer on all pages
//         const totalPages = pdf.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             pdf.setPage(i);
//             drawSignature();
//             pdf.setFontSize(8);
//             pdf.setFont("times", "italic");
//             pdf.setTextColor(100, 100, 100);
//             pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });
//             pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: "right" });
//         }

//         if (isWhatsAppShare) {
//             console.log('Generating PDF blob for WhatsApp...');
//             try {
//                 const blob = pdf.output('blob');
//                 if (!blob || blob.size === 0) throw new Error('Invalid blob');
//                 return blob;
//             } catch (blobError) {
//                 console.error('Blob error:', blobError);
//                 throw new Error(`Blob failed: ${blobError.message}`);
//             }
//         } else {
//             const filename = `${invoiceNo}-${patient_name}.pdf`;
//             pdf.save(filename);
//             return pdf;
//         }
//     } catch (error) {
//         console.error('PDF error:', error);
//         throw new Error(`Generation failed: ${error.message}`);
//     }
// }
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
//         if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, true);
//     } catch (error) {
//         console.error('Blob error:', error);
//         throw new Error(`Blob failed: ${error.message}`);
//     }
// }

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
//     return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
// }

// export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
//     try {
//         if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
//         const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
//         if (navigator.share && navigator.canShare({ files: [file] })) {
//             await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
//             return { success: true, method: 'web-share' };
//         }
//         const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
//         const url = URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = file.name;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
//         return { success: true, method: 'fallback', message: 'Download and attach manually' };
//     } catch (error) {
//         console.error('Share error:', error);
//         return { success: false, error: error.message, message: 'Share failed' };
//     }
// }

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
//         if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
//         const pdfBlob = generatePDFBlob(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount);
//         const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
//         return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//     } catch (error) {
//         console.error('SharePDF error:', error);
//         return { success: false, error: error.message, message: `Share failed: ${error.message}` };
//     }
// }

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
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
//     } catch (error) {
//         console.error('Download error:', error);
//         throw new Error(`Download failed: ${error.message}`);
//     }
// }

// ________________________________________________________________________________________________________________________________________________________ 










// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
//         registerDevnagariFont(pdf);

//         const marginLeft = 10;
//         let y = 10;
//         const lineHeight = 5;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const footerHeight = 40; // Reserve space for signature and footer text

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(100, 100, 100);
//             pdf.setLineWidth(0.3);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
//         }

//         function drawHeader() {
//             const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(18);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "bold");
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

//             y += logoSize + 8;
//             pdf.setDrawColor(150, 150, 150);
//             pdf.line(10, y - 5, pageWidth - 10, y - 5);
//         }

//         function drawPatientAndDoctorDetails() {
//             const billLineHeight = 5;
//             const billBoxHeight = billLineHeight + 4;

//             pdf.setFillColor(240, 245, 255);
//             pdf.setDrawColor(0);
//             pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD");

//             pdf.setFontSize(10);
//             pdf.setTextColor(0);
//             pdf.setFont("times", "normal");

//             const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
//             const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";
//             const billText = billId && billIds
//                 ? `Bill No: ${billId} (Prev: ${billIds})`
//                 : billId
//                 ? `Bill No: ${billId}`
//                 : billIds
//                 ? `Prev Bill No: ${billIds}`
//                 : "";

//             const columnWidth = contentWidth / 3;
//             pdf.text(billText, marginLeft + 2, y + 6);
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
//             pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

//             y += billBoxHeight + 5;

//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;

//             pdf.setDrawColor(0);
//             pdf.setFillColor(240, 245, 255);
//             pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
//             pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

//             pdf.setFontSize(12);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 5);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
//             });

//             const eduOffset = educationLines.length * 4;
//             pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             y += 38;
//         }

//         function isValidValue(value) {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 const upper = value.trim().toUpperCase();
//                 return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//             }
//             if (typeof value === 'object') return Object.keys(value).length > 0;
//             return true;
//         }

//         function hasValidPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//             const data = patientExaminations[0] || {};
//             return [
//                 data?.bp, data?.pulse, data?.height, data?.weight,
//                 data?.past_history, data?.complaints,
//                 data?.systemic_exam_general, data?.systemic_exam_pa
//             ].some(isValidValue);
//         }

//         function hasValidAyurvedicExamination() {
//             if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//             const obs = AyurvedicExaminations[0] || {};
//             return [
//                 obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//                 obs?.prasavvedan_parikshayein, obs?.habits,
//                 obs?.lab_investigation, obs?.personal_history,
//                 obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//             ].some(isValidValue);
//         }

//         function checkPageBreak(requiredSpace) {
//             if (y + requiredSpace > pageHeight - footerHeight) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = 15; // Reset y position for new page
//                 return true;
//             }
//             return false;
//         }

//         function drawPatientExamination() {
//             if (!hasValidPatientExamination()) return;

//             const data = patientExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);

//             const lightGrey = [245, 245, 255];
//             const labelFontStyle = "bold";
//             const valueFontStyle = "normal";
//             const sectionGap = 4;
//             const paddingX = 3;

//             const smallFields = [
//                 { label: "BP", value: data?.bp },
//                 { label: "Pulse", value: data?.pulse },
//                 { label: "Height", value: data?.height },
//                 { label: "Weight", value: data?.weight },
//             ].filter(f => isValidValue(f.value));

//             if (smallFields.length > 0) {
//                 checkPageBreak(15);
                
//                 const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, 8, "FD");

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0);
//                 pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//                 y += 9;
//             }

//             const longFields = [
//                 { label: "Past History", value: data?.past_history },
//                 { label: "Complaints", value: data?.complaints },
//                 { label: "Systemic Exam", value: data?.systemic_exam_general },
//                 { label: "Diagnosis", value: data?.systemic_exam_pa },
//             ].filter(f => isValidValue(f.value));

//             longFields.forEach(field => {
//                 const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//                 const boxHeight = wrappedText.length * 5 + 8;

//                 checkPageBreak(boxHeight + 5);

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", labelFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setTextColor(0);
//                 wrappedText.forEach((line, i) => {
//                     pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//                 });

//                 y += boxHeight + sectionGap;
//             });
//         }

//         function drawAyurvedicExamination() {
//             if (!hasValidAyurvedicExamination()) return;

//             checkPageBreak(20);

//             const obs = AyurvedicExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Ayurvedic Observation:", marginLeft, y + 5);
//             y += 8;

//             const fields = [
//                 { label: "Occupation", value: obs?.occupation },
//                 { label: "Pincode", value: obs?.pincode },
//                 { label: "Past History", value: obs?.ayurPastHistory },
//                 { label: "Investigation", value: obs?.lab_investigation },
//                 { label: "Food Allergy", value: obs?.food_and_drug_allergy },
//                 { label: "LMP", value: obs?.lmp },
//                 { label: "EDD", value: obs?.edd },
//             ];

//             registerDevnagariFont(pdf);

//             if (isValidValue(obs?.prasavvedan_parikshayein)) {
//                 const raw = obs.prasavvedan_parikshayein;
//                 const safeDecode = (str) => {
//                     try {
//                         if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//                         return str;
//                     } catch { return str; }
//                 };
//                 if (typeof raw === "object") {
//                     const prasavText = Object.entries(raw)
//                         .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//                         .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
//                         .join(" | ");
//                     if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
//                 }
//             }

//             if (isValidValue(obs?.habits)) {
//                 try {
//                     const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
//                     const text = Object.entries(habitData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing habits:", e); }
//             }

//             if (isValidValue(obs?.personal_history)) {
//                 try {
//                     const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
//                     const text = Object.entries(personalData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing personal history:", e); }
//             }

//             const validFields = fields.filter(f => isValidValue(f.value));
//             if (validFields.length === 0) return;

//             const fullRowFields = validFields.filter(f => f.isFullWidth);
//             const normalFields = validFields.filter(f => !f.isFullWidth);

//             const bodyData = [];
//             for (let i = 0; i < normalFields.length; i += 2) {
//                 const row = [
//                     { content: normalFields[i].label, styles: { fontStyle: "bold" } },
//                     normalFields[i].value,
//                 ];
//                 if (normalFields[i + 1]) {
//                     row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
//                     row.push(normalFields[i + 1].value);
//                 } else {
//                     row.push("", "");
//                 }
//                 bodyData.push(row);
//             }

//             if (bodyData.length > 0) {
//                 checkPageBreak(50);
                
//                 autoTable(pdf, {
//                     startY: y,
//                     head: [["Field", "Value", "Field", "Value"]],
//                     body: bodyData,
//                     theme: "grid",
//                     styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
//                     headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
//                     margin: { left: marginLeft },
//                     tableWidth: contentWidth,
//                     didDrawPage: (data) => {
//                         drawBorder();
//                     }
//                 });
//                 y = pdf.lastAutoTable.finalY + 5;
//             }

//             fullRowFields.forEach(field => {
//                 const boxWidth = contentWidth;
//                 const boxX = marginLeft;
//                 const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
//                 const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
//                 const boxHeight = wrapped.length * 4 + 8;

//                 checkPageBreak(boxHeight + 5);

//                 pdf.setDrawColor(150);
//                 pdf.setFillColor(245, 245, 255);
//                 pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", "bold");
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, boxX + 3, y + 5);

//                 pdf.setFont(contentFont, "normal");
//                 pdf.setTextColor(0);
//                 pdf.text(wrapped, boxX + 3, y + 10);

//                 y += boxHeight + 5;
//             });
//         }

//         function drawPrescription() {
//             const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//             if (!hasPrescription) return;

//             checkPageBreak(50);

//             pdf.setFont("helvetica");
//             pdf.setFontSize(9);
//             pdf.setTextColor(0);

//             autoTable(pdf, {
//                 startY: y,
//                 head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
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
//                 margin: { left: marginLeft },
//                 tableWidth: contentWidth,
//                 headStyles: {
//                     fillColor: [66, 139, 202],
//                     textColor: [255, 255, 255],
//                     fontSize: 9,
//                     halign: "center"
//                 },
//                 styles: {
//                     fontSize: 9,
//                     font: "times",
//                     cellPadding: 2,
//                     halign: "center",
//                     valign: "middle"
//                 },
//                 didDrawPage: (data) => {
//                     drawBorder();
//                 }
//             });

//             y = pdf.lastAutoTable.finalY + 5;
//         }

//         function drawBillingDetails() {
//             if (!descriptions || descriptions.length === 0) return;

//             checkPageBreak(50);

//             pdf.setFontSize(12);
//             pdf.setFont("helvetica", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Billing Details", marginLeft, y + 5);
//             y += 8;

//             const calculatedTotal = descriptions.reduce((acc, product) => {
//                 const total = parseFloat(product.total || 0);
//                 return acc + total;
//             }, 0);

//             const bodyRows = descriptions.map((product, index) => [
//                 index + 1,
//                 product.description || "N/A",
//                 product.quantity?.toString() || "N/A",
//                 `${parseFloat(product.price || 0).toFixed(2)}`,
//                 product.gst?.toString() || "N/A",
//                 `${parseFloat(product.total || 0).toFixed(2)}`
//             ]);

//             bodyRows.push(["", "", "", "", "Grand Total", `${calculatedTotal.toFixed(2)}`]);

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//                 body: bodyRows,
//                 theme: "grid",
//                 headStyles: {
//                     fillColor: [66, 139, 202],
//                     textColor: [255, 255, 255],
//                     fontSize: 9
//                 },
//                 styles: {
//                     fontSize: 9,
//                     font: "times",
//                     cellPadding: 2,
//                     halign: "center",
//                     valign: "middle"
//                 },
//                 columnStyles: {
//                     0: { halign: "center" },
//                     1: { halign: "left" },
//                     2: { halign: "right" },
//                     3: { halign: "right" },
//                     4: { halign: "right" },
//                     5: { halign: "right" }
//                 },
//                 margin: { left: marginLeft },
//                 tableWidth: contentWidth,
//                 didDrawPage: (data) => {
//                     drawBorder();
//                 }
//             });

//             y = pdf.lastAutoTable.finalY + 5;

//             pdf.setFontSize(10);
//             pdf.setFont("helvetica", "bold");
//             pdf.setTextColor(0);
//             pdf.text(`Total : Rs ${calculatedTotal.toFixed(2)}`, marginLeft, y + 5);
//             y += 8;

//             pdf.setFontSize(10);
//             pdf.setFont("helvetica", "italic");
//             pdf.setTextColor(0);
//             y += 8;

//             if (isValidValue(remainingAmount)) {
//                 pdf.setFont("helvetica", "bold");
//                 pdf.setTextColor(200, 0, 0);
//                 pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
//                 y += 8;
//             }
//         }

        // function drawSignatureAndFooter() {
        //     // Ensure we have enough space for signature and footer, if not move to new page
        //     if (y > pageHeight - footerHeight) {
        //         pdf.addPage();
        //         drawBorder();
        //         y = pageHeight - footerHeight + 5; // Position from bottom
        //     }

        //     const ySignature = pageHeight - 25; // Position signature 25mm from bottom
        //     const logoHeight = 30;
        //     const logoWidth = 30;
        //     const spacing = 5;

        //     const textWidth = pdf.getTextWidth("Authorized Signature");
        //     const lineWidth = textWidth + 10;
        //     const xRightAligned = pageWidth - lineWidth - 20;

        //     // Draw signature with logo if available
        //     if (doctorData?.sign) {
        //         try {
        //             const img = new Image();
        //             img.crossOrigin = "anonymous";
        //             img.src = doctorData?.sign;

        //             img.onload = () => {
        //                 const yLogo = ySignature - logoHeight - spacing;
        //                 pdf.addImage(img, "PNG", xRightAligned, yLogo, logoWidth, logoHeight);

        //                 pdf.setFontSize(10);
        //                 pdf.setFont("times", "italic");
        //                 pdf.setTextColor(0);
        //                 pdf.text("Authorized Signature", xRightAligned + 5, ySignature);

        //                 pdf.setLineWidth(0.3);
        //                 pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

        //                 // Add footer text
        //                 pdf.setFontSize(8);
        //                 pdf.setFont("times", "italic");
        //                 pdf.setTextColor(100, 100, 100);
        //                 pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

        //                 // Save or return PDF
        //                 finalizePDF();
        //             };
        //         } catch (err) {
        //             console.warn("Logo could not be added:", err);
        //             drawSignatureOnly();
        //         }
        //     } else {
        //         drawSignatureOnly();
        //     }

        //     function drawSignatureOnly() {
        //         pdf.setFontSize(10);
        //         pdf.setFont("times", "italic");
        //         pdf.setTextColor(0);
        //         pdf.text("Authorized Signature", xRightAligned + 5, ySignature);
                
        //         pdf.setLineWidth(0.3);
        //         pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

        //         // Add footer text
        //         pdf.setFontSize(8);
        //         pdf.setFont("times", "italic");
        //         pdf.setTextColor(100, 100, 100);
        //         pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

        //         // Save or return PDF
        //         finalizePDF();
        //     }
        // }

//         function finalizePDF() {
//             // Add page numbers to all pages
//             const totalPages = pdf.internal.getNumberOfPages();
//             for (let i = 1; i <= totalPages; i++) {
//                 pdf.setPage(i);
//                 pdf.setFontSize(8);
//                 pdf.setFont("times", "italic");
//                 pdf.setTextColor(100, 100, 100);
//                 pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: "right" });
//             }

//             if (isWhatsAppShare) {
//                 console.log('Generating PDF blob for WhatsApp...');
//                 try {
//                     const blob = pdf.output('blob');
//                     if (!blob || blob.size === 0) throw new Error('Invalid blob');
//                     return blob;
//                 } catch (blobError) {
//                     console.error('Blob error:', blobError);
//                     throw new Error(`Blob failed: ${blobError.message}`);
//                 }
//             } else {
//                 const filename = `${invoiceNo}-${patient_name}.pdf`;
//                 pdf.save(filename);
//                 return pdf;
//             }
//         }

//         function formatKey(str) {
//             return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
//         }

//         // Generate PDF content
//         drawBorder();
//         drawHeader();
//         drawPatientAndDoctorDetails();
//         if (hasValidPatientExamination()) drawPatientExamination();
//         if (hasValidAyurvedicExamination()) drawAyurvedicExamination();
//         drawPrescription();
//         drawBillingDetails();
        
//         // Draw signature and footer at the end
//         drawSignatureAndFooter();

//     } catch (error) {
//         console.error('PDF error:', error);
//         throw new Error(`Generation failed: ${error.message}`);
//     }
// }

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
//         if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, true);
//     } catch (error) {
//         console.error('Blob error:', error);
//         throw new Error(`Blob failed: ${error.message}`);
//     }
// }

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
//     return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
// }

// export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
//     try {
//         if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
//         const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
//         if (navigator.share && navigator.canShare({ files: [file] })) {
//             await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
//             return { success: true, method: 'web-share' };
//         }
//         const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
//         const url = URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = file.name;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
//         return { success: true, method: 'fallback', message: 'Download and attach manually' };
//     } catch (error) {
//         console.error('Share error:', error);
//         return { success: false, error: error.message, message: 'Share failed' };
//     }
// }

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
//         if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
//         const pdfBlob = generatePDFBlob(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount);
//         const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
//         return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//     } catch (error) {
//         console.error('SharePDF error:', error);
//         return { success: false, error: error.message, message: `Share failed: ${error.message}` };
//     }
// }

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
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
//     } catch (error) {
//         console.error('Download error:', error);
//         throw new Error(`Download failed: ${error.message}`);
//     }
// }





















// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

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
//         registerDevnagariFont(pdf);

//         const marginLeft = 10;
//         let y = 10;
//         const lineHeight = 5;
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const contentWidth = pageWidth - 2 * marginLeft;
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const footerHeight = 40; // Reserve space for signature and footer text

//         pdf.setFont("times", "normal");

//         function drawBorder() {
//             pdf.setDrawColor(100, 100, 100);
//             pdf.setLineWidth(0.3);
//             pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
//         }

//         function drawHeader() {
//             const logoSize = 30;
//             const rightMargin = pageWidth - marginLeft;

//             if (clinicData?.logo) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = clinicData.logo;
//                     pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
//                 } catch (imgError) {
//                     console.warn('Logo could not be added:', imgError);
//                 }
//             }

//             pdf.setFontSize(18);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

//             pdf.setFontSize(10);
//             pdf.setFont("times", "bold");
//             pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

//             pdf.setFont("times", "normal");
//             pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

//             y += logoSize + 8;
//             pdf.setDrawColor(150, 150, 150);
//             pdf.line(10, y - 5, pageWidth - 10, y - 5);
//         }

//         function drawPatientAndDoctorDetails() {
//             const billLineHeight = 5;
//             const billBoxHeight = billLineHeight + 4;

//             pdf.setFillColor(240, 245, 255);
//             pdf.setDrawColor(0);
//             pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD");

//             pdf.setFontSize(10);
//             pdf.setTextColor(0);
//             pdf.setFont("times", "normal");

//             const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
//             const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";
//             const billText = billId && billIds
//                 ? `Bill No: ${billId} (Prev: ${billIds})`
//                 : billId
//                 ? `Bill No: ${billId}`
//                 : billIds
//                 ? `Prev Bill No: ${billIds}`
//                 : "";

//             const columnWidth = contentWidth / 3;
//             pdf.text(billText, marginLeft + 2, y + 6);
//             pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
//             pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

//             y += billBoxHeight + 5;

//             const boxWidth = (contentWidth / 2) - 5;
//             const patientBoxX = marginLeft;
//             const doctorBoxX = marginLeft + boxWidth + 10;

//             pdf.setDrawColor(0);
//             pdf.setFillColor(240, 245, 255);
//             pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
//             pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

//             pdf.setFontSize(12);
//             pdf.setFont("times", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Patient Details:", patientBoxX + 3, y + 5);
//             pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

//             pdf.setFontSize(10);
//             pdf.setFont("times", "normal");
//             pdf.setTextColor(0, 0, 0);
//             pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//             pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//             pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//             pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

//             const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
//             educationLines.forEach((line, index) => {
//                 pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
//             });

//             const eduOffset = educationLines.length * 4;
//             pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
//             pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

//             y += 38;
//         }

//         function isValidValue(value) {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 const upper = value.trim().toUpperCase();
//                 return upper !== '' && upper !== 'NA' && upper !== 'N/A';
//             }
//             if (typeof value === 'object') return Object.keys(value).length > 0;
//             return true;
//         }

//         function hasValidPatientExamination() {
//             if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return false;
//             const data = patientExaminations[0] || {};
//             return [
//                 data?.bp, data?.pulse, data?.height, data?.weight,
//                 data?.past_history, data?.complaints,
//                 data?.systemic_exam_general, data?.systemic_exam_pa
//             ].some(isValidValue);
//         }

//         function hasValidAyurvedicExamination() {
//             if (!Array.isArray(AyurvedicExaminations) || AyurvedicExaminations.length === 0) return false;
//             const obs = AyurvedicExaminations[0] || {};
//             return [
//                 obs?.occupation, obs?.pincode, obs?.ayurPastHistory,
//                 obs?.prasavvedan_parikshayein, obs?.habits,
//                 obs?.lab_investigation, obs?.personal_history,
//                 obs?.food_and_drug_allergy, obs?.lmp, obs?.edd
//             ].some(isValidValue);
//         }

//         function checkPageBreak(requiredSpace) {
//             if (y + requiredSpace > pageHeight - footerHeight) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = 15; // Reset y position for new page
//                 return true;
//             }
//             return false;
//         }

//         function drawPatientExamination() {
//             if (!hasValidPatientExamination()) return;

//             const data = patientExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);

//             const lightGrey = [245, 245, 255];
//             const labelFontStyle = "bold";
//             const valueFontStyle = "normal";
//             const sectionGap = 4;
//             const paddingX = 3;

//             const smallFields = [
//                 { label: "BP", value: data?.bp },
//                 { label: "Pulse", value: data?.pulse },
//                 { label: "Height", value: data?.height },
//                 { label: "Weight", value: data?.weight },
//             ].filter(f => isValidValue(f.value));

//             if (smallFields.length > 0) {
//                 checkPageBreak(15);
                
//                 const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, 8, "FD");

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0);
//                 pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
//                 y += 9;
//             }

//             const longFields = [
//                 { label: "Past History", value: data?.past_history },
//                 { label: "Complaints", value: data?.complaints },
//                 { label: "Systemic Exam", value: data?.systemic_exam_general },
//                 { label: "Diagnosis", value: data?.systemic_exam_pa },
//             ].filter(f => isValidValue(f.value));

//             longFields.forEach(field => {
//                 const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
//                 const boxHeight = wrappedText.length * 5 + 8;

//                 checkPageBreak(boxHeight + 5);

//                 pdf.setFillColor(...lightGrey);
//                 pdf.setDrawColor(150);
//                 pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", labelFontStyle);
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

//                 pdf.setFont("helvetica", valueFontStyle);
//                 pdf.setTextColor(0);
//                 wrappedText.forEach((line, i) => {
//                     pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
//                 });

//                 y += boxHeight + sectionGap;
//             });
//         }

//         function drawAyurvedicExamination() {
//             if (!hasValidAyurvedicExamination()) return;

//             checkPageBreak(20);

//             const obs = AyurvedicExaminations[0] || {};
//             pdf.setFont("helvetica");
//             pdf.setFontSize(12);
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Medicine Details:", marginLeft, y + 5);
//             y += 8;

//             const fields = [
//                 { label: "Occupation", value: obs?.occupation },
//                 { label: "Pincode", value: obs?.pincode },
//                 { label: "Past History", value: obs?.ayurPastHistory },
//                 { label: "Investigation", value: obs?.lab_investigation },
//                 { label: "Food Allergy", value: obs?.food_and_drug_allergy },
//                 { label: "LMP", value: obs?.lmp },
//                 { label: "EDD", value: obs?.edd },
//             ];

//             registerDevnagariFont(pdf);

//             if (isValidValue(obs?.prasavvedan_parikshayein)) {
//                 const raw = obs.prasavvedan_parikshayein;
//                 const safeDecode = (str) => {
//                     try {
//                         if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
//                         return str;
//                     } catch { return str; }
//                 };
//                 if (typeof raw === "object") {
//                     const prasavText = Object.entries(raw)
//                         .filter(([_, v]) => Array.isArray(v) && v.length > 0)
//                         .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
//                         .join(" | ");
//                     if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
//                 }
//             }

//             if (isValidValue(obs?.habits)) {
//                 try {
//                     const habitData = typeof obs.habits === "string" ? JSON.parse(obs.habits) : obs.habits;
//                     const text = Object.entries(habitData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Habits", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing habits:", e); }
//             }

//             if (isValidValue(obs?.personal_history)) {
//                 try {
//                     const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
//                     const text = Object.entries(personalData)
//                         .filter(([_, v]) => isValidValue(v))
//                         .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
//                         .join(" | ");
//                     if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
//                 } catch (e) { console.warn("Error parsing personal history:", e); }
//             }

//             const validFields = fields.filter(f => isValidValue(f.value));
//             if (validFields.length === 0) return;

//             const fullRowFields = validFields.filter(f => f.isFullWidth);
//             const normalFields = validFields.filter(f => !f.isFullWidth);

//             const bodyData = [];
//             for (let i = 0; i < normalFields.length; i += 2) {
//                 const row = [
//                     { content: normalFields[i].label, styles: { fontStyle: "bold" } },
//                     normalFields[i].value,
//                 ];
//                 if (normalFields[i + 1]) {
//                     row.push({ content: normalFields[i + 1].label, styles: { fontStyle: "bold" } });
//                     row.push(normalFields[i + 1].value);
//                 } else {
//                     row.push("", "");
//                 }
//                 bodyData.push(row);
//             }

//             if (bodyData.length > 0) {
//                 checkPageBreak(50);
                
//                 autoTable(pdf, {
//                     startY: y,
//                     head: [["Field", "Value", "Field", "Value"]],
//                     body: bodyData,
//                     theme: "grid",
//                     styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
//                     headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
//                     margin: { left: marginLeft },
//                     tableWidth: contentWidth,
//                     didDrawPage: (data) => {
//                         drawBorder();
//                     }
//                 });
//                 y = pdf.lastAutoTable.finalY + 5;
//             }

//             fullRowFields.forEach(field => {
//                 const boxWidth = contentWidth;
//                 const boxX = marginLeft;
//                 const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
//                 const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
//                 const boxHeight = wrapped.length * 4 + 8;

//                 checkPageBreak(boxHeight + 5);

//                 pdf.setDrawColor(150);
//                 pdf.setFillColor(245, 245, 255);
//                 pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

//                 pdf.setFont("helvetica", "bold");
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(0, 51, 102);
//                 pdf.text(`${field.label}:`, boxX + 3, y + 5);

//                 pdf.setFont(contentFont, "normal");
//                 pdf.setTextColor(0);
//                 pdf.text(wrapped, boxX + 3, y + 10);

//                 y += boxHeight + 5;
//             });
//         }

//         function drawPrescription() {
//             const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
//             if (!hasPrescription) return;

//             checkPageBreak(50);

//             pdf.setFont("helvetica");
//             pdf.setFontSize(9);
//             pdf.setTextColor(0);

//             autoTable(pdf, {
//                 startY: y,
//                 head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
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
//                 margin: { left: marginLeft },
//                 tableWidth: contentWidth,
//                 headStyles: {
//                     fillColor: [66, 139, 202],
//                     textColor: [255, 255, 255],
//                     fontSize: 9,
//                     halign: "center"
//                 },
//                 styles: {
//                     fontSize: 9,
//                     font: "times",
//                     cellPadding: 2,
//                     halign: "center",
//                     valign: "middle"
//                 },
//                 didDrawPage: (data) => {
//                     drawBorder();
//                 }
//             });

//             y = pdf.lastAutoTable.finalY + 5;
//         }

//         function drawBillingDetails() {
//             if (!descriptions || descriptions.length === 0) return;

//             checkPageBreak(50);

//             pdf.setFontSize(12);
//             pdf.setFont("helvetica", "bold");
//             pdf.setTextColor(0, 51, 102);
//             pdf.text("Billing Details", marginLeft, y + 5);
//             y += 8;

//             const calculatedTotal = descriptions.reduce((acc, product) => {
//                 const total = parseFloat(product.total || 0);
//                 return acc + total;
//             }, 0);

//             const bodyRows = descriptions.map((product, index) => [
//                 index + 1,
//                 product.description || "N/A",
//                 product.quantity?.toString() || "N/A",
//                 `${parseFloat(product.price || 0).toFixed(2)}`,
//                 product.gst?.toString() || "N/A",
//                 `${parseFloat(product.total || 0).toFixed(2)}`
//             ]);

//             bodyRows.push(["", "", "", "", "Grand Total", `${calculatedTotal.toFixed(2)}`]);

//             pdf.autoTable({
//                 startY: y,
//                 head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
//                 body: bodyRows,
//                 theme: "grid",
//                 headStyles: {
//                     fillColor: [66, 139, 202],
//                     textColor: [255, 255, 255],
//                     fontSize: 9
//                 },
//                 styles: {
//                     fontSize: 9,
//                     font: "times",
//                     cellPadding: 2,
//                     halign: "center",
//                     valign: "middle"
//                 },
//                 columnStyles: {
//                     0: { halign: "center" },
//                     1: { halign: "left" },
//                     2: { halign: "right" },
//                     3: { halign: "right" },
//                     4: { halign: "right" },
//                     5: { halign: "right" }
//                 },
//                 margin: { left: marginLeft },
//                 tableWidth: contentWidth,
//                 didDrawPage: (data) => {
//                     drawBorder();
//                 }
//             });

//             y = pdf.lastAutoTable.finalY + 5;

//             pdf.setFontSize(10);
//             pdf.setFont("helvetica", "bold");
//             pdf.setTextColor(0);
//             pdf.text(`Total : Rs ${calculatedTotal.toFixed(2)}`, marginLeft, y + 5);
//             y += 8;

//             pdf.setFontSize(10);
//             pdf.setFont("helvetica", "italic");
//             pdf.setTextColor(0);
//             y += 8;

//             if (isValidValue(remainingAmount)) {
//                 pdf.setFont("helvetica", "bold");
//                 pdf.setTextColor(200, 0, 0);
//                 pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
//                 y += 8;
//             }
//         }

//         function drawSignatureAndFooter() {
//             // Ensure we have enough space for signature and footer, if not move to new page
//             if (y > pageHeight - footerHeight) {
//                 pdf.addPage();
//                 drawBorder();
//                 y = pageHeight - footerHeight + 5; // Position from bottom
//             }

//             const ySignature = pageHeight - 25; // Position signature 25mm from bottom
//             const logoHeight = 30;
//             const logoWidth = 30;
//             const spacing = 5;

//             const textWidth = pdf.getTextWidth("Authorized Signature");
//             const lineWidth = textWidth + 10;
//             const xRightAligned = pageWidth - lineWidth - 20;

//             // Draw signature with logo if available
//             if (doctorData?.sign) {
//                 try {
//                     const img = new Image();
//                     img.crossOrigin = "anonymous";
//                     img.src = doctorData?.sign;

//                     img.onload = () => {
//                         const yLogo = ySignature - logoHeight - spacing;
//                         pdf.addImage(img, "PNG", xRightAligned, yLogo, logoWidth, logoHeight);

//                         pdf.setFontSize(10);
//                         pdf.setFont("times", "italic");
//                         pdf.setTextColor(0);
//                         pdf.text("Authorized Signature", xRightAligned + 5, ySignature);

//                         pdf.setLineWidth(0.3);
//                         pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

//                         // Add footer text
//                         pdf.setFontSize(8);
//                         pdf.setFont("times", "italic");
//                         pdf.setTextColor(100, 100, 100);
//                         pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

//                         // Save or return PDF
//                         finalizePDF();
//                     };
//                 } catch (err) {
//                     console.warn("Logo could not be added:", err);
//                     drawSignatureOnly();
//                 }
//             } else {
//                 drawSignatureOnly();
//             }

//             function drawSignatureOnly() {
//                 pdf.setFontSize(10);
//                 pdf.setFont("times", "italic");
//                 pdf.setTextColor(0);
//                 pdf.text("Authorized Signature", xRightAligned + 5, ySignature);
                
//                 pdf.setLineWidth(0.3);
//                 pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

//                 // Add footer text
//                 pdf.setFontSize(8);
//                 pdf.setFont("times", "italic");
//                 pdf.setTextColor(100, 100, 100);
//                 pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

//                 // Save or return PDF
//                 finalizePDF();
//             }
//         }

//        const finalizePDF = async () => {
//             // Add page numbers to all pages
//             const totalPages = pdf.internal.getNumberOfPages();
//             for (let i = 1; i <= totalPages; i++) {
//                 pdf.setPage(i);
//                 pdf.setFontSize(8);
//                 pdf.setFont("times", "italic");
//                 pdf.setTextColor(100, 100, 100);
//                 pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: "right" });
//             }

//             // if (isWhatsAppShare) {
//             //     console.log('Generating PDF blob for WhatsApp...');
//             //     try {
//             //         const blob = await pdf.output('blob');
//             //         if (!blob || blob.size === 0) throw new Error('Invalid blob');
//             //         return blob;
//             //     } catch (blobError) {
//             //         console.error('Blob error:', blobError);
//             //         throw new Error(`Blob failed: ${blobError.message}`);
//             //     }
//             // } else {
//             //     const filename = `${invoiceNo}-${patient_name}.pdf`;
//             //     pdf.save(filename);
//             //     return pdf;
//             // }
//             if (isWhatsAppShare) {
//     console.log('Generating PDF blob for WhatsApp...');
//     try {
//         const blob =  pdf.output('blob'); // ✅ Await is important here
//         if (!blob || blob.size === 0) throw new Error('Invalid blob');
//         return blob;
//     } catch (blobError) {
//         console.error('Blob error:', blobError);
//         throw new Error(`Blob failed: ${blobError.message}`);
//     }
// }

//         }

//         function formatKey(str) {
//             return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
//         }

//         // Generate PDF content
//         drawBorder();
//         drawHeader();
//         drawPatientAndDoctorDetails();
//         if (hasValidPatientExamination()) drawPatientExamination();
//         if (hasValidAyurvedicExamination()) drawAyurvedicExamination();
//         drawPrescription();
//         drawBillingDetails();
        
//         // Draw signature and footer at the end
//         drawSignatureAndFooter();

//     } catch (error) {
//         console.error('PDF error:', error);
//         throw new Error(`Generation failed: ${error.message}`);
//     }
// }

// // Rest of the export functions remain the same...
// export function  generatePDFBlob(
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
//         if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, true);
//     } catch (error) {
//         console.error('Blob error:', error);
//         throw new Error(`Blob failed: ${error.message}`);
//     }
// }




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
//     return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
// }

// export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
//     try {
//         if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
//         const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
//         if (navigator.share && navigator.canShare({ files: [file] })) {
//             await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
//             return { success: true, method: 'web-share' };
//         }
//         const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
//         const url = URL.createObjectURL(pdfBlob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = file.name;
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
//         return { success: true, method: 'fallback', message: 'Download and attach manually' };
//     } catch (error) {
//         console.error('Share error:', error);
//         return { success: false, error: error.message, message: 'Share failed' };
//     }
// }

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
//         if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
//         const pdfBlob = generatePDFBlob(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount);
//         const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
//         return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
//     } catch (error) {
//         console.error('SharePDF error:', error);
//         return { success: false, error: error.message, message: `Share failed: ${error.message}` };
//     }
// }

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
//         return generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, descriptions, doctorData, clinicData, healthDirectives, patientExaminations, AyurvedicExaminations, billId, billIds, billDate, DeliveryDate, totalAmount, false);
//     } catch (error) {
//         console.error('Download error:', error);
//         throw new Error(`Download failed: ${error.message}`);
//     }
// }















import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { registerDevnagariFont } from "../../../../react/views/theme/invoice/NotoSansDevanagari";

export async function generatePDF(
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
    babyPadiatricExamination,
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

        const marginLeft = 10;
        let y = 10;
        const lineHeight = 5;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * marginLeft;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const footerHeight = 40;

        pdf.setFont("times", "normal");

        function drawBorder() {
            pdf.setDrawColor(100, 100, 100);
            pdf.setLineWidth(0.3);
            pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, "S");
        }

        function drawHeader() {
            const logoSize = 30;
            const rightMargin = pageWidth - marginLeft;

            if (clinicData?.logo) {
                try {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = clinicData.logo;
                    pdf.addImage(img, "PNG", marginLeft, y, logoSize, logoSize);
                } catch (imgError) {
                    console.warn('Logo could not be added:', imgError);
                }
            }

            pdf.setFontSize(18);
            pdf.setFont("times", "bold");
            pdf.setTextColor(0, 51, 102);
            pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

            pdf.setFontSize(10);
            pdf.setFont("times", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${clinicData?.clinic_address || "N/A"}`, pageWidth / 2, y + 15, { align: "center" });

            pdf.setFontSize(10);
            pdf.setFont("times", "bold");
            pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 2, { align: "right" });

            pdf.setFont("times", "normal");
            pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 9, { align: "right" });

            y += logoSize + 8;
            pdf.setDrawColor(150, 150, 150);
            pdf.line(10, y - 5, pageWidth - 10, y - 5);
        }

        function drawPatientAndDoctorDetails() {
            const billLineHeight = 5;
            const billBoxHeight = billLineHeight + 4;

            pdf.setFillColor(240, 245, 255);
            pdf.setDrawColor(0);
            pdf.rect(marginLeft, y, contentWidth, billBoxHeight, "FD");

            pdf.setFontSize(10);
            pdf.setTextColor(0);
            pdf.setFont("times", "normal");

            const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "N/A";
            const followUpDate = isValidValue(formData?.followup_date) ? formData.followup_date : "N/A";
            const billText = billId && billIds
                ? `Bill No: ${billId} (Prev: ${billIds})`
                : billId
                ? `Bill No: ${billId}`
                : billIds
                ? `Prev Bill No: ${billIds}`
                : "";

            const columnWidth = contentWidth / 3;
            pdf.text(billText, marginLeft + 2, y + 6);
            pdf.text(`Bill Date: ${formattedDate}`, marginLeft + columnWidth + 2, y + 6);
            pdf.text(`Follow-Up: ${followUpDate}`, marginLeft + columnWidth * 2 + 2, y + 6);

            y += billBoxHeight + 5;

            const boxWidth = (contentWidth / 2) - 5;
            const patientBoxX = marginLeft;
            const doctorBoxX = marginLeft + boxWidth + 10;

            pdf.setDrawColor(0);
            pdf.setFillColor(240, 245, 255);
            pdf.rect(patientBoxX, y, boxWidth, 30, "FD");
            pdf.rect(doctorBoxX, y, boxWidth, 30, "FD");

            pdf.setFontSize(12);
            pdf.setFont("times", "bold");
            pdf.setTextColor(0, 51, 102);
            pdf.text("Patient Details:", patientBoxX + 3, y + 5);
            pdf.text("Doctor Details:", doctorBoxX + 3, y + 5);

            pdf.setFontSize(10);
            pdf.setFont("times", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
            pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
            pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

            pdf.text(`Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);

            const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
            educationLines.forEach((line, index) => {
                pdf.text(line, doctorBoxX + 3, y + 18 + index * 4);
            });

            const eduOffset = educationLines.length * 4;
            pdf.text(`Reg No: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
            pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);

            y += 38;
        }

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

        function hasValidBabyPediatricExamination() {
            if (!Array.isArray(babyPadiatricExamination) || babyPadiatricExamination.length === 0) return false;
            const obs = babyPadiatricExamination[0] || {};
            return [
                obs?.weightBaby, obs?.heightBaby, obs?.headCircumference,
                obs?.temperature, obs?.heartRate,
                obs?.respiratoryRate, obs?.vaccinationsGiven,
                obs?.milestonesAchieved, obs?.remarks
            ].some(isValidValue);
        }

        function checkPageBreak(requiredSpace) {
            if (y + requiredSpace > pageHeight - footerHeight) {
                pdf.addPage();
                drawBorder();
                y = 15;
                return true;
            }
            return false;
        }

        function drawPatientExamination() {
            if (!hasValidPatientExamination()) return;

            const data = patientExaminations[0] || {};
            pdf.setFont("helvetica");
            pdf.setFontSize(12);
            pdf.setTextColor(0, 51, 102);

            const lightGrey = [245, 245, 255];
            const labelFontStyle = "bold";
            const valueFontStyle = "normal";
            const sectionGap = 4;
            const paddingX = 3;

            const smallFields = [
                { label: "BP", value: data?.bp },
                { label: "Pulse", value: data?.pulse },
                { label: "Height", value: data?.height },
                { label: "Weight", value: data?.weight },
            ].filter(f => isValidValue(f.value));

            if (smallFields.length > 0) {
                checkPageBreak(15);
                const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

                pdf.setFillColor(...lightGrey);
                pdf.setDrawColor(150);
                pdf.rect(marginLeft, y, contentWidth, 8, "FD");

                pdf.setFont("helvetica", valueFontStyle);
                pdf.setFontSize(10);
                pdf.setTextColor(0);
                pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
                y += 9;
            }

            const longFields = [
                { label: "Past History", value: data?.past_history },
                { label: "Complaints", value: data?.complaints },
                { label: "Systemic Exam", value: data?.systemic_exam_general },
                { label: "Diagnosis", value: data?.systemic_exam_pa },
            ].filter(f => isValidValue(f.value));

            longFields.forEach(field => {
                const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
                const boxHeight = wrappedText.length * 5 + 8;

                checkPageBreak(boxHeight + 5);

                pdf.setFillColor(...lightGrey);
                pdf.setDrawColor(150);
                pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

                pdf.setFont("helvetica", labelFontStyle);
                pdf.setFontSize(10);
                pdf.setTextColor(0, 51, 102);
                pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

                pdf.setFont("helvetica", valueFontStyle);
                pdf.setTextColor(0);
                wrappedText.forEach((line, i) => {
                    pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
                });

                y += boxHeight + sectionGap;
            });
        }

        function drawAyurvedicExamination() {
            if (!hasValidAyurvedicExamination()) return;

            checkPageBreak(20);

            const obs = AyurvedicExaminations[0] || {};
            pdf.setFont("helvetica");
            pdf.setFontSize(12);
            pdf.setTextColor(0, 51, 102);
            pdf.text("Medical Details:", marginLeft, y + 5);
            y += 8;

            const fields = [
                { label: "Occupation", value: obs?.occupation },
                { label: "Pincode", value: obs?.pincode },
                { label: "Past History", value: obs?.ayurPastHistory },
                { label: "Investigation", value: obs?.lab_investigation },
                { label: "Food Allergy", value: obs?.food_and_drug_allergy },
                { label: "LMP", value: obs?.lmp },
                { label: "EDD", value: obs?.edd },
            ];

            registerDevnagariFont(pdf);

            if (isValidValue(obs?.prasavvedan_parikshayein)) {
                const raw = obs.prasavvedan_parikshayein;
                const safeDecode = (str) => {
                    try {
                        if (typeof str === "string" && str.includes("\\u")) return JSON.parse(`["${str}"]`.replace(/\\/g, "\\\\"))[0];
                        return str;
                    } catch { return str; }
                };
                if (typeof raw === "object") {
                    const prasavText = Object.entries(raw)
                        .filter(([_, v]) => Array.isArray(v) && v.length > 0)
                        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v.map(safeDecode).join(", ")}`)
                        .join(" | ");
                    if (prasavText) fields.push({ label: "Ashtvidh Parikshayein", value: prasavText, isFullWidth: true });
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
                } catch (e) { console.warn("Error parsing habits:", e); }
            }

            if (isValidValue(obs?.personal_history)) {
                try {
                    const personalData = typeof obs.personal_history === "string" ? JSON.parse(obs.personal_history) : obs.personal_history;
                    const text = Object.entries(personalData)
                        .filter(([_, v]) => isValidValue(v))
                        .map(([k, v]) => `${formatKey(k)}: ${Array.isArray(v) ? v.join(", ") : v}`)
                        .join(" | ");
                    if (text) fields.push({ label: "Personal History", value: text, isFullWidth: true });
                } catch (e) { console.warn("Error parsing personal history:", e); }
            }

            const validFields = fields.filter(f => isValidValue(f.value));
            if (validFields.length === 0) return;

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
                checkPageBreak(50);
                autoTable(pdf, {
                    startY: y,
                    head: [["Field", "Value", "Field", "Value"]],
                    body: bodyData,
                    theme: "grid",
                    styles: { fontSize: 9, cellPadding: 2, halign: "left", font: "helvetica" },
                    headStyles: { fillColor: [144, 238, 144], textColor: [0, 0, 0], fontSize: 9 },
                    margin: { left: marginLeft },
                    tableWidth: contentWidth,
                    didDrawPage: (data) => {
                        drawBorder();
                    }
                });
                y = pdf.lastAutoTable.finalY + 5;
            }

            fullRowFields.forEach(field => {
                const boxWidth = contentWidth;
                const boxX = marginLeft;
                const contentFont = field.label === "Ashtvidh Parikshayein" ? "NotoSansDevanagari" : "helvetica";
                const wrapped = pdf.splitTextToSize(field.value, boxWidth - 10);
                const boxHeight = wrapped.length * 4 + 8;

                checkPageBreak(boxHeight + 5);

                pdf.setDrawColor(150);
                pdf.setFillColor(245, 245, 255);
                pdf.rect(boxX, y, boxWidth, boxHeight, "FD");

                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(10);
                pdf.setTextColor(0, 51, 102);
                pdf.text(`${field.label}:`, boxX + 3, y + 5);

                pdf.setFont(contentFont, "normal");
                pdf.setTextColor(0);
                pdf.text(wrapped, boxX + 3, y + 10);

                y += boxHeight + 5;
            });
        }

        function drawBabyPediatricExamination() {
    if (!hasValidBabyPediatricExamination()) return;

    const data = babyPadiatricExamination[0] || {};
    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 51, 102);

    const lightGrey = [245, 245, 255];
    const labelFontStyle = "bold";
    const valueFontStyle = "normal";
    const sectionGap = 4;
    const paddingX = 3;

    // Small inline fields (single row)
    const smallFields = [
        { label: "Weight", value: data?.weightBaby },
        { label: "Height", value: data?.heightBaby },
        { label: "Head Circumference", value: data?.headCircumference },
        { label: "Temperature", value: data?.temperature },
        { label: "Heart Rate", value: data?.heartRate },
        { label: "Respiratory Rate", value: data?.respiratoryRate },
    ].filter(f => isValidValue(f.value));

    if (smallFields.length > 0) {
        checkPageBreak(15);
        const smallFieldText = smallFields.map(f => `${f.label}: ${f.value}`).join("  |  ");

        pdf.setFillColor(...lightGrey);
        pdf.setDrawColor(150);
        pdf.rect(marginLeft, y, contentWidth, 8, "FD");

        pdf.setFont("helvetica", valueFontStyle);
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text(smallFieldText, marginLeft + paddingX, y + 5);
        y += 9;
    }

    // Long text fields
    const longFields = [
        { label: "Vaccinations Given", value: data?.vaccinationsGiven },
        { label: "Milestones Achieved", value: data?.milestonesAchieved },
        { label: "Remarks", value: data?.remarks },
    ].filter(f => isValidValue(f.value));

    longFields.forEach(field => {
        const wrappedText = pdf.splitTextToSize(field.value, contentWidth - 2 * paddingX);
        const boxHeight = wrappedText.length * 5 + 8;

        checkPageBreak(boxHeight + 5);

        pdf.setFillColor(...lightGrey);
        pdf.setDrawColor(150);
        pdf.rect(marginLeft, y, contentWidth, boxHeight, "FD");

        pdf.setFont("helvetica", labelFontStyle);
        pdf.setFontSize(10);
        pdf.setTextColor(0, 51, 102);
        pdf.text(`${field.label}:`, marginLeft + paddingX, y + 5);

        pdf.setFont("helvetica", valueFontStyle);
        pdf.setTextColor(0);
        wrappedText.forEach((line, i) => {
            pdf.text(line, marginLeft + paddingX, y + 10 + i * 5);
        });

        y += boxHeight + sectionGap;
    });
}


        function drawPrescription() {
            const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
            if (!hasPrescription) return;

            checkPageBreak(50);

            pdf.setFont("helvetica");
            pdf.setFontSize(9);
            pdf.setTextColor(0);

            autoTable(pdf, {
                startY: y,
                head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Freq", "Duration"]],
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
                margin: { left: marginLeft },
                tableWidth: contentWidth,
                headStyles: {
                    fillColor: [66, 139, 202],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    halign: "center"
                },
                styles: {
                    fontSize: 9,
                    font: "times",
                    cellPadding: 2,
                    halign: "center",
                    valign: "middle"
                },
                didDrawPage: (data) => {
                    drawBorder();
                }
            });

            y = pdf.lastAutoTable.finalY + 5;
        }

        function drawBillingDetails() {
            if (!descriptions || descriptions.length === 0) return;

            checkPageBreak(50);

            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0, 51, 102);
            pdf.text("Billing Details", marginLeft, y + 5);
            y += 8;

            const calculatedTotal = descriptions.reduce((acc, product) => {
                const total = parseFloat(product.total || 0);
                return acc + total;
            }, 0);

            const bodyRows = descriptions.map((product, index) => [
                index + 1,
                product.description || "N/A",
                product.quantity?.toString() || "N/A",
                `${parseFloat(product.price || 0).toFixed(2)}`,
                product.gst?.toString() || "N/A",
                `${parseFloat(product.total || 0).toFixed(2)}`
            ]);

            bodyRows.push(["", "", "", "", "Grand Total", `${calculatedTotal.toFixed(2)}`]);

            pdf.autoTable({
                startY: y,
                head: [["Sr No", "Description", "Qty", "Price (Rs)", "GST (%)", "Total (Rs)"]],
                body: bodyRows,
                theme: "grid",
                headStyles: {
                    fillColor: [66, 139, 202],
                    textColor: [255, 255, 255],
                    fontSize: 9
                },
                styles: {
                    fontSize: 9,
                    font: "times",
                    cellPadding: 2,
                    halign: "center",
                    valign: "middle"
                },
                columnStyles: {
                    0: { halign: "center" },
                    1: { halign: "left" },
                    2: { halign: "right" },
                    3: { halign: "right" },
                    4: { halign: "right" },
                    5: { halign: "right" }
                },
                margin: { left: marginLeft },
                tableWidth: contentWidth,
                didDrawPage: (data) => {
                    drawBorder();
                }
            });

            y = pdf.lastAutoTable.finalY + 5;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(0);
            pdf.text(`Total: Rs ${calculatedTotal.toFixed(2)}`, marginLeft, y + 5);
            y += 8;

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "italic");
            pdf.setTextColor(0);
            pdf.text(`Total Amount in Words: ${totalAmountWords || "N/A"}`, marginLeft, y + 5);
            y += 8;

            if (isValidValue(remainingAmount)) {
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(200, 0, 0);
                pdf.text(`Remaining Amount: Rs ${parseFloat(remainingAmount || 0).toFixed(2)}`, marginLeft, y + 5);
                y += 8;
            }
        }

        async function drawSignatureAndFooter() {
            if (y > pageHeight - footerHeight) {
                pdf.addPage();
                drawBorder();
                y = pageHeight - footerHeight + 5;
            }

            const ySignature = pageHeight - 25;
            const logoHeight = 15;
            const logoWidth = 30;
            const spacing = 5;

            const textWidth = pdf.getTextWidth("Authorized Signature");
            const lineWidth = textWidth + 10;
            const xRightAligned = pageWidth - lineWidth - 20;

            const drawSignatureOnly = () => {
                pdf.setFontSize(10);
                pdf.setFont("times", "italic");
                pdf.setTextColor(0);
                pdf.text("Authorized Signature", xRightAligned + 5, ySignature);

                pdf.setLineWidth(0.3);
                pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

                // Add footer text
                pdf.setFontSize(8);
                pdf.setFont("times", "italic");
                pdf.setTextColor(100, 100, 100);
                pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });
            };

            if (doctorData?.sign) {
                try {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = doctorData.sign;

                    await new Promise((resolve, reject) => {
                        img.onload = () => {
                            const yLogo = ySignature - logoHeight - spacing;
                            pdf.addImage(img, "PNG", xRightAligned, yLogo, logoWidth, logoHeight);

                            pdf.setFontSize(10);
                            pdf.setFont("times", "italic");
                            pdf.setTextColor(0);
                            pdf.text("Authorized Signature", xRightAligned + 5, ySignature);

                            pdf.setLineWidth(0.3);
                            pdf.line(xRightAligned, ySignature - 5, xRightAligned + lineWidth, ySignature - 5);

                            // Add footer text
                            pdf.setFontSize(8);
                            pdf.setFont("times", "italic");
                            pdf.setTextColor(100, 100, 100);
                            pdf.text("Computer Generated Bill. Contact for queries.", pageWidth / 2, pageHeight - 10, { align: "center" });

                            resolve();
                        };
                        img.onerror = (err) => {
                            console.warn("Signature image could not be loaded:", err);
                            drawSignatureOnly();
                            resolve();
                        };
                    });
                } catch (err) {
                    console.warn("Signature image could not be added:", err);
                    drawSignatureOnly();
                }
            } else {
                drawSignatureOnly();
            }

            // Add page numbers to all pages
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setFont("times", "italic");
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: "right" });
            }

            if (isWhatsAppShare) {
                console.log('Generating PDF blob for WhatsApp...');
                const blob = pdf.output('blob');
                if (!blob || blob.size === 0) throw new Error('Invalid blob');
                return blob;
            } else {
                const filename = `${invoiceNo}-${patient_name}.pdf`;
                pdf.save(filename);
                return pdf;
            }
        }

        function formatKey(str) {
            return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        }

        // Generate PDF content
        drawBorder();
        drawHeader();
        drawPatientAndDoctorDetails();
        if (hasValidPatientExamination()) drawPatientExamination();
        if (hasValidAyurvedicExamination()) drawAyurvedicExamination(); 
        if (hasValidBabyPediatricExamination())drawBabyPediatricExamination();
        drawPrescription();
        drawBillingDetails();

        // Draw signature and footer, await completion
        return await drawSignatureAndFooter();
    } catch (error) {
        console.error('PDF error:', error);
        throw new Error(`Generation failed: ${error.message}`);
    }
}

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
    babyPadiatricExamination,
    billId,
    billIds,
    billDate,
    DeliveryDate,
    totalAmount
) {
    try {
        if (!invoiceNo || !patient_name) throw new Error('Required fields missing');
        return await generatePDF(
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
            babyPadiatricExamination,
            billId,
            billIds,
            billDate,
            DeliveryDate,
            totalAmount,
            true
        );
    } catch (error) {
        console.error('Blob error:', error);
        throw new Error(`Blob failed: ${error.message}`);
    }
}

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
    babyPadiatricExamination,
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
            babyPadiatricExamination,
            billId,
            billIds,
            billDate,
            DeliveryDate,
            totalAmount,
            false
        );
    } catch (error) {
        console.error('Save PDF error:', error);
        throw new Error(`Save failed: ${error.message}`);
    }
}

export async function shareOnWhatsApp(phoneNumber, pdfBlob, message = "Medical bill/prescription attached") {
    try {
        if (!phoneNumber || !pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) throw new Error('Invalid input');
        const file = new File([pdfBlob], `bill-${Date.now()}.pdf`, { type: 'application/pdf' });
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'Medical Bill', text: message, files: [file] });
            return { success: true, method: 'web-share' };
        }
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        return { success: true, method: 'fallback', message: 'Download and attach manually' };
    } catch (error) {
        console.error('Share error:', error);
        return { success: false, error: error.message, message: 'Share failed' };
    }
}

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
    babyPadiatricExamination,
    billId,
    billIds,
    billDate,
    DeliveryDate,
    totalAmount,
    customMessage = null
) {
    try {
        if (!phoneNumber || !invoiceNo || !patient_name) throw new Error('Required fields missing');
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
            babyPadiatricExamination,
            billId,
            billIds,
            billDate,
            DeliveryDate,
            totalAmount
        );
        const message = customMessage || `Hello ${patient_name || 'Patient'}, your bill (No: ${billId || invoiceNo}) is ready.`;
        return await shareOnWhatsApp(phoneNumber, pdfBlob, message);
    } catch (error) {
        console.error('SharePDF error:', error);
        return { success: false, error: error.message, message: `Share failed: ${error.message}` };
    }
}

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
    babyPadiatricExamination,
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
            babyPadiatricExamination,
            billId,
            billIds,
            billDate,
            DeliveryDate,
            totalAmount,
            false
        );
    } catch (error) {
        console.error('Download error:', error);
        throw new Error(`Download failed: ${error.message}`);
    }
}














































































































