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
    totalAmount
) {
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
            const img = new Image();
            img.src = clinicData.logo;
            pdf.addImage(img, "PNG", leftMargin, y, logoSize, logoSize);
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




// function drawAyurvedicExamination() {
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

    // ====== Build First Page ======
    drawBorder();
    drawHeader();
    drawPatientAndDoctorDetails();
    // drawPatientExamination();
    // drawAyurvedicExamination();
    drawBillingDetails();
    drawSignature();


    

        // ====== Conditionally Add Patient Examination Page ======
const hasPatientExam = Array.isArray(patientExaminations) && patientExaminations.length > 0;

if (hasPatientExam) {
    pdf.addPage();
    drawHeader();
    drawPatientAndDoctorDetails();

    
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

    pdf.save(`${invoiceNo}-${patient_name}.pdf`);
}
