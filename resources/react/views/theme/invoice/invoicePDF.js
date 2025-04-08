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
    billId, 
    billDate,
    DeliveryDate,
    totalAmount
) {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const marginLeft = 15;
    let y = 10;
    const lineHeight = 7;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * marginLeft;
    const pageHeight = pdf.internal.pageSize.getHeight();
    

    pdf.setFont("times", "normal");


    function drawBorder() {
        pdf.setDrawColor(0); // Black color border
        pdf.setLineWidth(0.5); // Medium thickness
        pdf.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle border
    }


function drawHeader() {
    y = 10;

    const logoSize = 20;
    const leftMargin = marginLeft;
    const rightMargin = pageWidth - marginLeft;
    // const headerHeight = 30; 

    // for (let i = 0; i < headerHeight; i++) {
    //     let shade = Math.floor(30 + (i / headerHeight) * 100); // Darker at top, lighter at bottom
    //     pdf.setFillColor(0, 0, shade); // RGB for dark blue shades
    //     pdf.rect(10, y + i, pageWidth - 20, 1, "F"); // Drawing thin strips for gradient
    // }


    // Clinic Logo (Left Side)
    if (clinicData?.logo) {
        const img = new Image();
        img.src = clinicData.logo;
        pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
    }

    // Clinic Name (Centered)
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 7, { align: "center" });

    // Registration Number (Right-Aligned)
    pdf.setFontSize(10);
    pdf.setFont("times", "normal");
    pdf.text(`Reg No: ${clinicData?.clinic_registration_no || "N/A"}`, rightMargin, y + 5, { align: "right" });

    // Address (Right-Aligned, Below Reg No)
    pdf.text(`Address: ${clinicData?.clinic_address || "N/A"}`, rightMargin, y + 10, { align: "right" });

    // Contact Details (Right-Aligned, Below Address)
    pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 15, { align: "right" });

    // Draw a separator line
    y += 25;
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(10, y, pageWidth - 10, y);
    y += 8;
}













    function drawPatientAndDoctorDetails() {
        const boxWidth = (contentWidth / 2) - 5;
        const boxHeight = 30;
        const patientBoxX = marginLeft;
        const doctorBoxX = marginLeft + boxWidth + 10;

        // Patient Details
        pdf.setDrawColor(0);
        pdf.rect(patientBoxX, y, boxWidth, boxHeight);

        pdf.setFontSize(13);
        pdf.text("Patient Details:", patientBoxX + 3, y + 6);
        pdf.setFontSize(11);
        pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
        pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
        pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

        // Doctor Details
        pdf.rect(doctorBoxX, y, boxWidth, boxHeight);

        pdf.setFontSize(13);
        pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
        pdf.setFontSize(11);
        pdf.text(`Doctor Name:${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);
        pdf.text(`Education: ${doctorData?.education || "N/A"}`, doctorBoxX + 3, y + 18);
        pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 23);
        pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 28);

        y += boxHeight + lineHeight;

        

        // Bill No (left-aligned)
        pdf.setFontSize(12);

// Bill No (First Line)
pdf.text(`Bill No: ${billId}`, marginLeft, y);

// Bill Date (Below Bill No)
const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight); 

// Move Y position down for next content
y += lineHeight * 3;

        
    }
    function drawPatientExamination() {
        pdf.setFontSize(13);
        pdf.text("Medical Observation:", marginLeft, y);
        y += lineHeight;
    
        if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) {
            pdf.text("No patient examination data available", marginLeft, y);
            y += lineHeight * 2;
            return;
        }
    
        const patientData = patientExaminations[0] || {}; // Ensure it's an object
    
        // Table structure to match your image
        pdf.autoTable({
            startY: y,
            body: [
                [{ content: "BP", styles: { fontStyle: "bold", halign: "center" } }, patientData?.bp ?? "N/A",
                 { content: "Pulse", styles: { fontStyle: "bold", halign: "center" } }, patientData?.pulse ?? "N/A"],
    
                [{ content: "Past History", styles: { fontStyle: "bold", halign: "center" } }, patientData?.past_history ?? "N/A",
                 { content: "Complaints", styles: { fontStyle: "bold", halign: "center" } }, patientData?.complaints ?? "N/A"],
    
                [{ content: "Systemic Examination", styles: { fontStyle: "bold", halign: "center" } }, patientData?.systemic_exam_general ?? "N/A",
                 { content: "Diagnosis", styles: { fontStyle: "bold", halign: "center" } }, patientData?.systemic_exam_pa ?? "N/A"]
            ],
            theme: "grid",
            styles: { fontSize: 10, font: "times", halign: "center" },
        });
    
        y = pdf.autoTable.previous.finalY + lineHeight;
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

    // Generate PDF Content
    drawBorder();
    drawHeader();
    drawPatientAndDoctorDetails();
    drawPatientExamination();
    drawBillingDetails();
    drawSignature();
    

    // Add a new page for prescription
    pdf.addPage();
    drawHeader();
    drawPatientAndDoctorDetails();

    pdf.setFontSize(13);
    pdf.text("Prescription:", marginLeft, y);
    y += lineHeight;

    if (Array.isArray(healthDirectives) && healthDirectives.length > 0) {
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
    } else {
        pdf.text("No prescriptions available.", marginLeft, y);
    }
    drawBorder();
    drawSignature();

    // Footer for all pages
    pdf.setFontSize(9);
    pdf.text("This bill is computer generated.", pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });

    pdf.save(`${invoiceNo}-${patient_name}.pdf`);
}





























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
//     billDate,
//     DeliveryDate,
//     totalAmount
// ) {
//     const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     const marginLeft = 15;
//     let y = 10;
//     const lineHeight = 7;
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const contentWidth = pageWidth - 2 * marginLeft;

//     pdf.setFont("times", "normal");

//     function drawBackgroundLogo() {
//         if (clinicData?.logo) {
//             const img = new Image();
//             img.src = clinicData.logo;
//             pdf.addImage(img, "PNG", pageWidth / 4, pageHeight / 3, 100, 100, "", "FAST");
//             pdf.setDrawColor(255, 255, 255); // Make it faint
//         }
//     }

//     function drawBorder() {
//         pdf.setDrawColor(0);
//         pdf.setLineWidth(1);
//         pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);
//     }

//     function drawHeader() {
//         y = 10;

//         // Add a colored background for header
//         pdf.setFillColor(200, 230, 255); // Light blue
//         pdf.rect(10, y, pageWidth - 20, 20, "F");

//         if (clinicData?.logo) {
//             const img = new Image();
//             img.src = clinicData.logo;
//             pdf.addImage(img, "PNG", marginLeft, y + 2, 16, 16);
//         }

//         pdf.setFontSize(16);
//         pdf.setFont("times", "bold");
//         pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 8, { align: "center" });

//         pdf.setFontSize(10);
//         pdf.text(`Reg No.: ${clinicData?.clinic_registration_no || "N/A"}`, pageWidth - 20, y + 8, { align: "right" });

//         y += 12;
//         pdf.setFontSize(9);
//         pdf.text(`Address: ${clinicData?.clinic_address || "N/A"}`, marginLeft + 20, y);
//         pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, pageWidth - 20, y, { align: "right" });

//         y += lineHeight;

//         pdf.setDrawColor(0);
//         pdf.setLineWidth(0.5);
//         pdf.line(10, y, pageWidth - 10, y);
//         y += lineHeight;
//     }

//     function drawPatientAndDoctorDetails() {
//         const boxWidth = (contentWidth / 2) - 5;
//         const boxHeight = 30;
//         const patientBoxX = marginLeft;
//         const doctorBoxX = marginLeft + boxWidth + 10;

//         // Patient Details
//         pdf.setDrawColor(0);
//         pdf.rect(patientBoxX, y, boxWidth, boxHeight);

//         pdf.setFontSize(13);
//         pdf.text("Patient Details:", patientBoxX + 3, y + 6);
//         pdf.setFontSize(11);
//         pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
//         pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
//         pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);

//         // Doctor Details
//         pdf.rect(doctorBoxX, y, boxWidth, boxHeight);

//         pdf.setFontSize(13);
//         pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
//         pdf.setFontSize(11);
//         pdf.text(`Doctor Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);
//         pdf.text(`Education: ${doctorData?.education || "N/A"}`, doctorBoxX + 3, y + 18);
//         pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 23);
//         pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 28);

//         y += boxHeight + lineHeight;

//         pdf.setFontSize(12);
//         pdf.text(`Bill No: ${billId}`, marginLeft, y);
//         const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
//         pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
//         y += lineHeight * 3;
//     }

//     function drawPatientExamination() {
//         pdf.setFontSize(13);
//         pdf.text("Medical Observation:", marginLeft, y);
//         y += lineHeight;

//         if (!Array.isArray(patientExaminations) || patientExaminations.length === 0) {
//             pdf.text("No patient examination data available", marginLeft, y);
//             y += lineHeight * 2;
//             return;
//         }

//         const patientData = patientExaminations[0] || {};

//         pdf.autoTable({
//             startY: y,
//             body: [
//                 [{ content: "BP", styles: { fontStyle: "bold", halign: "center" } }, patientData?.bp ?? "N/A",
//                  { content: "Pulse", styles: { fontStyle: "bold", halign: "center" } }, patientData?.pulse ?? "N/A"],

//                 [{ content: "Past History", styles: { fontStyle: "bold", halign: "center" } }, patientData?.past_history ?? "N/A",
//                  { content: "Complaints", styles: { fontStyle: "bold", halign: "center" } }, patientData?.complaints ?? "N/A"],

//                 [{ content: "Systemic Examination", styles: { fontStyle: "bold", halign: "center" } }, patientData?.systemic_exam_general ?? "N/A",
//                  { content: "Diagnosis", styles: { fontStyle: "bold", halign: "center" } }, patientData?.systemic_exam_pa ?? "N/A"]
//             ],
//             theme: "grid",
//             styles: { fontSize: 10, font: "times", halign: "center" },
//         });

//         y = pdf.autoTable.previous.finalY + lineHeight;
//     }

//     function drawSignature() {
//         y = pdf.internal.pageSize.getHeight() - 30;
//         pdf.text("Authorized Signature", pageWidth - 50, y);
//     }

//     // Generate PDF Content
//     drawBorder();
//     drawBackgroundLogo();
//     drawHeader();
//     drawPatientAndDoctorDetails();
//     drawPatientExamination();
//     drawSignature();

//     // Footer
//     pdf.setFontSize(9);
//     pdf.text("This bill is computer generated.", pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });

//     pdf.save(`${invoiceNo}-${patient_name}.pdf`);
// }









//     function drawHeader() {
//         y = 10;

//         if (clinicData?.logo) {
//             const img = new Image();
//             img.src = clinicData.logo;
//             pdf.addImage(img, "PNG", marginLeft, y, 17, 17);
//         } 

//         pdf.setFontSize(20);
//         pdf.text(clinicData?.clinic_name || "N/A", pageWidth / 2, y + 10, { align: "center" });

//         pdf.setFontSize(11);
//         // Format and wrap the address text
// const addressText = pdf.splitTextToSize(
//     `Address: ${clinicData?.clinic_address || "N/A"}`,
//     pageWidth - marginLeft - 80 // Ensures it doesn't exceed page width
// );

// // Display registration number and contact
// pdf.text(
//     `Reg No.: ${clinicData?.clinic_registration_no || "N/A"} | Contact: ${clinicData?.clinic_mobile || "N/A"}`,
//     pageWidth - 80,
//     y + 5
// );

// // Display the formatted address below
// pdf.text(addressText, pageWidth - 80, y + 15);

// // Adjust y position dynamically based on the address height
// y += 15 + (addressText.length * 5);


//         pdf.setDrawColor(0);
//         pdf.setLineWidth(0.5);
//         pdf.line(10, y, pageWidth - 10, y);
//         y += lineHeight * 2;
//     }

