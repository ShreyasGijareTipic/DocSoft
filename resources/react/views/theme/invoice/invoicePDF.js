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
    totalAmount,
    isWhatsAppShare = false
) {
    try {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const marginLeft = 15;
        const lineHeight = 7;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * marginLeft;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const headerHeight = 120; // Fixed header height
        const footerHeight = 40; // Fixed footer height
        const contentStartY = headerHeight + 10;
        const contentEndY = pageHeight - footerHeight;

        pdf.setFont("times", "normal");

        function drawBorder() {
            pdf.setDrawColor(0);
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
        }

        function drawFixedHeader() {
            let y = 10;
            const logoSize = 40;
            const leftMargin = marginLeft;
            const rightMargin = pageWidth - marginLeft;

            // Clinic Logo
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

            // Clinic Name (Center)
            pdf.setFontSize(16);
            pdf.setFont("times", "bold");
            pdf.text(clinicData?.clinic_name || "Clinic Name", pageWidth / 2, y + 7, { align: "center" });

            // Clinic Registration (Right)
            pdf.setFontSize(10);
            pdf.setFont("times", "normal");
            pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 5, { align: "right" });

            // Clinic Address (Right)
            const addressText = `Address: ${clinicData?.clinic_address || "N/A"}`;
            const addressLines = pdf.splitTextToSize(addressText, 50);
            addressLines.forEach((line, index) => {
                pdf.text(line, rightMargin, y + 10 + index * 5, { align: "right" });
            });

            const addressHeight = addressLines.length * 5;
            pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 10 + addressHeight, { align: "right" });

            y += logoSize + 5;

            // Separator line
            pdf.setDrawColor(0);
            pdf.setLineWidth(0.5);
            pdf.line(10, y, pageWidth - 10, y);
            y += 8;

            // Patient and Doctor Details Boxes
            const boxWidth = (contentWidth / 2) - 5;
            const patientBoxX = marginLeft;
            const doctorBoxX = marginLeft + boxWidth + 10;
            const lineSpacing = 5;

            // Patient Details Box
            pdf.setDrawColor(0);
            pdf.setFontSize(13);
            pdf.text("Patient Details:", patientBoxX + 3, y + 6);
            pdf.setFontSize(11);
            pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
            pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
            pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

            // Doctor Details Box
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

            // Draw boxes
            pdf.rect(doctorBoxX, y, boxWidth, boxHeight);
            pdf.rect(patientBoxX, y, boxWidth, boxHeight);
            y += boxHeight + lineHeight;

            // Bill Information
            pdf.setFontSize(12);
            pdf.text(`Bill No: ${billId || invoiceNo}`, marginLeft, y);
            
            // Handle date formatting properly
            let formattedDate = "Date Not Available";
            if (formData?.visit_date) {
                formattedDate = formData.visit_date.includes("-") ? 
                    formData.visit_date.split("-").reverse().join("-") : 
                    formData.visit_date;
            } else if (billDate) {
                formattedDate = billDate.includes("-") ? 
                    billDate.split("-").reverse().join("-") : 
                    billDate;
            }
            
            pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
            
            // Add delivery date if it's type 2 invoice
            if (formData?.InvoiceType === 2 && formData?.DeliveryDate) {
                const deliveryFormatted = formData.DeliveryDate.includes("-") ? 
                    formData.DeliveryDate.split("-").reverse().join("-") : 
                    formData.DeliveryDate;
                pdf.text(`Delivery Date: ${deliveryFormatted}`, marginLeft, y + lineHeight * 2);
            }

            return contentStartY;
        }

        function drawFixedFooter() {
            const footerY = pageHeight - 30;
            
            // Signature
            pdf.setFontSize(12);
            pdf.text("Authorized Signature", pageWidth - 50, footerY);
            
            // Computer generated text
            pdf.setFontSize(9);
            pdf.text("This bill is computer generated.", pageWidth / 2, pageHeight - 10, { align: "center" });
        }

        function addNewPageWithFixedElements() {
            pdf.addPage();
            drawBorder();
            drawFixedHeader();
            drawFixedFooter();
            return contentStartY;
        }

        function drawPatientExamination(startY) {
            if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) return startY;
        
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
        
            // Filter out N/A, null, undefined, or empty values
            const validFields = fields.filter(f => f.value && f.value !== "N/A" && f.value.toString().trim() !== "");
        
            if (validFields.length === 0) return startY;

            // Check if we need a new page
            const estimatedHeight = (validFields.length * 8) + 30; // Rough estimation
            if (startY + estimatedHeight > contentEndY) {
                startY = addNewPageWithFixedElements();
            }
        
            pdf.setFontSize(13);
            pdf.text("Medical Observation:", marginLeft, startY);
            startY += lineHeight;
        
            const bodyData = validFields.map(field => [
                { content: field.label, styles: { fontStyle: "bold", halign: "left" } },
                field.value
            ]);
        
            pdf.autoTable({
                startY: startY,
                head: [["Field", "Value"]],
                body: bodyData,
                theme: "grid",
                styles: { fontSize: 10, font: "times", halign: "left" },
                headStyles: { fillColor: [173, 216, 230] },
                margin: { top: contentStartY, bottom: footerHeight },
            });
        
            return pdf.autoTable.previous.finalY + lineHeight;
        }
        
        function drawBillingDetails(startY) {
            // Check if we need a new page
            const billingData = Array.isArray(descriptions) && descriptions.length > 0 ? descriptions : [];
            const estimatedHeight = (billingData.length * 8) + 50; // Rough estimation
            
            if (startY + estimatedHeight > contentEndY) {
                startY = addNewPageWithFixedElements();
            }

            pdf.setFontSize(13);
            pdf.text("Billing Details:", marginLeft, startY);
            startY += lineHeight;
            
            if (billingData.length === 0) {
                pdf.setFontSize(11);
                pdf.text("No billing items found.", marginLeft, startY);
                return startY + lineHeight * 2;
            }

            const tableData = billingData.map((product, index) => [
                index + 1,
                product.description || "N/A",
                product.quantity?.toString() || "0",
                `${parseFloat(product.price || 0).toFixed(2)} /-`,
                product.gst?.toString() || "0",
                `${parseFloat(product.total || 0).toFixed(2)} /-`
            ]);

            // Add grand total row
            tableData.push([
                "", 
                "", 
                billingData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toString(),
                billingData.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2),
                "Grand Total", 
                `${(parseFloat(totalAmount) || 0).toFixed(2)} /-`
            ]);

            pdf.autoTable({
                startY: startY,
                head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
                body: tableData,
                theme: "grid",
                styles: { halign: "center", fontSize: 10, font: "times" },
                headStyles: { fillColor: [144, 238, 144] }, // Light green
                footStyles: { fillColor: [255, 255, 0] }, // Yellow for total row
                margin: { top: contentStartY, bottom: footerHeight },
            });

            return pdf.autoTable.previous.finalY + lineHeight * 2;
        }

        function drawPrescription() {
            const hasPrescription = Array.isArray(healthDirectives) && healthDirectives.length > 0;
            if (!hasPrescription) return false;

            // Always create a new page for prescription
            const startY = addNewPageWithFixedElements();

            pdf.setFontSize(13);
            pdf.text("Prescription:", marginLeft, startY);

            const prescriptionData = healthDirectives.map((item, index) => [
                index + 1,
                item.medicine || "N/A",
                item.strength || "N/A",
                item.dosage || "N/A",
                item.timing || "N/A",
                item.frequency || "N/A",
                item.duration || "N/A"
            ]);

            pdf.autoTable({
                startY: startY + lineHeight,
                head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency", "Duration"]],
                body: prescriptionData,
                theme: "grid",
                styles: { halign: "center", fontSize: 10, font: "times" },
                headStyles: { fillColor: [173, 216, 230] }, // Light blue
                margin: { top: contentStartY, bottom: footerHeight },
            });

            return true;
        }

        // ====== Build PDF Content ======
        try {
            // First page setup
            drawBorder();
            let currentY = drawFixedHeader();
            drawFixedFooter();
            
            // Draw patient examination
            currentY = drawPatientExamination(currentY);
            
            // Draw billing details
            currentY = drawBillingDetails(currentY);
            
            // Draw prescription on separate page
            drawPrescription();

            // Return appropriate output based on usage
            if (isWhatsAppShare) {
                console.log('Generating PDF blob for WhatsApp sharing...');
                const blob = pdf.output('blob');
                console.log('PDF blob generated, size:', blob.size);
                return blob;
            } else {
                // Regular download
                const filename = `${invoiceNo}-${patient_name || 'Patient'}.pdf`;
                pdf.save(filename);
                return pdf;
            }

        } catch (pdfError) {
            console.error('Error during PDF generation:', pdfError);
            throw new Error('PDF generation failed: ' + pdfError.message);
        }

    } catch (error) {
        console.error('Error in generatePDF function:', error);
        throw error;
    }
}