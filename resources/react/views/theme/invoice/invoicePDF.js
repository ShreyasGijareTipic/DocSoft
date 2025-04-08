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
    let y = 20;
    const lineHeight = 7;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * marginLeft;
    const pageHeight = pdf.internal.pageSize.getHeight();
    

    pdf.setFont("times", "normal");


    function drawBorder() {
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.5);
        pdf.rect(5, 5, pageWidth - 10, pageHeight - 10); // Draw rectangle border
    }


    function drawHeader() {
        y = 10;
        const logoSize = 40;
        const leftMargin = marginLeft;
        const rightMargin = pageWidth - marginLeft;
    
        // Clinic Logo (Left Side)
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
    
        // Move Contact below wrapped address
        pdf.text(`Contact: ${clinicData?.clinic_mobile || "N/A"}`, rightMargin, y + 10 + addressHeight, { align: "right" });
    
        // Draw line below header
        y += logoSize + addressHeight ;
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.5);
        pdf.line(10, y, pageWidth - 10, y);
        y += 8;
    }
    

    function drawPatientAndDoctorDetails() {
        const boxWidth = (contentWidth / 2) - 5;
        const patientBoxX = marginLeft;
        const doctorBoxX = marginLeft + boxWidth + 10;
        const lineSpacing = 5;
    
        // Patient Details
        pdf.setDrawColor(0);
        pdf.setFontSize(13);
        pdf.text("Patient Details:", patientBoxX + 3, y + 6);
        pdf.setFontSize(11);
        pdf.text(`Name: ${formData?.patient_name || "N/A"}`, patientBoxX + 3, y + 12);
        pdf.text(`Address: ${formData?.patient_address || "N/A"}`, patientBoxX + 3, y + 18);
        pdf.text(`Mobile: ${formData?.patient_contact || "N/A"}`, patientBoxX + 3, y + 24);
        // Fixed height patient box
    
        // Doctor Details
        pdf.setFontSize(13);
        pdf.text("Doctor Details:", doctorBoxX + 3, y + 6);
        pdf.setFontSize(11);
        pdf.text(`Doctor Name: ${doctorData?.name || "N/A"}`, doctorBoxX + 3, y + 12);
    
        // ✅ Wrap Education
        const educationLines = pdf.splitTextToSize(`Education: ${doctorData?.education || "N/A"}`, boxWidth - 6);
        educationLines.forEach((line, index) => {
            pdf.text(line, doctorBoxX + 3, y + 18 + index * lineSpacing);
        });
    
        const eduOffset = educationLines.length * lineSpacing;
        let boxHeight = 12 + eduOffset + 15; // Adjust height dynamically
    
        // Add Reg No and Specialty below wrapped education
        pdf.text(`Reg No.: ${doctorData?.registration_number || "N/A"}`, doctorBoxX + 3, y + 18 + eduOffset);
        pdf.text(`Specialty: ${doctorData?.speciality || "N/A"}`, doctorBoxX + 3, y + 24 + eduOffset);
    
        pdf.rect(doctorBoxX, y, boxWidth, boxHeight); // Doctor box with dynamic height
        pdf.rect(patientBoxX, y, boxWidth,boxHeight); 
        console.log(boxHeight)
        y += boxHeight + lineHeight;
    
        // Bill No and Bill Date
        pdf.setFontSize(12);
        pdf.text(`Bill No: ${billId}`, marginLeft, y);
        const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
        pdf.text(`Bill Date: ${formattedDate}`, marginLeft, y + lineHeight);
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
