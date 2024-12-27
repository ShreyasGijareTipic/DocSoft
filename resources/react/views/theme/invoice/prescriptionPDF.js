import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePDF(grandTotal, invoiceNo, patient_name, formDataa, remainingAmount, totalAmountWords, bills, descriptions, doctorData,patientExaminations) {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const marginLeft = 15; // Define left margin
    let y = 8; // Start Y position
    const lineHeight = 7; // Define consistent line height

    // Set font family to Times New Roman
    pdf.setFont("times", "normal");


    // Draw border for the page
    pdf.setDrawColor(0); // Set border color (black)
    pdf.setLineWidth(0.5); // Set border thickness
    pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10, "S");

    // Clinic logo
    const img = new Image();
    img.src = doctorData.logo;
    pdf.addImage(img, "PNG", marginLeft, y, 30, 30);
    y += 20; // Move Y position down after image

    // Clinic Name
    pdf.setFontSize(25);
    pdf.text(doctorData.clinic_name, pdf.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight * 2; // Add more space after title

    // Doctor Details
    pdf.setFontSize(13);
    pdf.text("Doctor Details:", pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight;

    pdf.setFontSize(11);
    pdf.text(`Doctor Name : ${doctorData.name} (${doctorData.education})`, pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight;
    pdf.text(`Registration No. : :${doctorData.registration_number}`, pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight;
    pdf.text(`Speciality :${doctorData.speciality}`, pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight;
    pdf.text(`Address :${doctorData.address}`, pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight;
    pdf.text(`Contact No. :${doctorData.mobile}`, pdf.internal.pageSize.getWidth() - 65, y);
    y += lineHeight * 2; // Add extra space after doctor details

    // Bill to section (Patient Details)
    pdf.setFontSize(13);
    pdf.text(`Bill to:`, marginLeft, y);
    y += lineHeight;

    pdf.setFontSize(11);
    pdf.text(`Patient Name    : ${formDataa.patient_name}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Patient Address : ${formDataa.patient_address}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Mobile Number    : ${formDataa.patient_contact}`, marginLeft, y);
    y += lineHeight;

    pdf.text(`Bill No: ${formDataa.id}`, 145, y - lineHeight * 2); // Align to right side for Bill No
    const formattedDate = formDataa.visit_date ? formDataa.visit_date.split("-").reverse().join("-") : "Date Not Available";
    pdf.text(`Bill Date: ${formattedDate}`, 145, y - lineHeight);



    pdf.setFontSize(13);
    pdf.text(`Medical Observation:`, marginLeft, y + 6);
    y += lineHeight;

    if (patientExaminations && patientExaminations.length > 0) {
        const exam = patientExaminations[0]; // Access the first patient examination record
        
        if (exam.bp) {
          pdf.setFontSize(11);
          pdf.text(`BP: ${exam.bp}`, marginLeft, y + 6);
          y += lineHeight;
        }
      
        if (exam.pulse) {
          pdf.text(`Pulse: ${exam.pulse}`, marginLeft, y + 6);
          y += lineHeight;
        }
      
        if (exam.past_history) {
          pdf.text(`Past History: ${exam.past_history}`, marginLeft, y + 6);
          y += lineHeight;
        }
      
        if (exam.complaints) {
          pdf.text(`Complaints: ${exam.complaints}`, marginLeft, y + 6);
          y += lineHeight;
        }
      
        if (exam.systemic_exam_general) {
          pdf.text(`Systemic Examination (General): ${exam.systemic_exam_general}`, marginLeft, y + 6);
          y += lineHeight;
        }
      
        if (exam.systemic_exam_pa) {
          pdf.text(`Diagnosis: ${exam.systemic_exam_pa}`, marginLeft, y + 6);
          y += lineHeight;
        }
      } else {
        // Optionally, you can add a placeholder text if no patient examination data exists
        pdf.text(`No patient examinations added.`, marginLeft, y + 6);
        y += lineHeight;
      }


    // Descriptions Table
    descriptions = descriptions || [];
    if (!Array.isArray(descriptions)) {
        console.error('Expected descriptions to be an array');
        return;
    }

    // Calculate Grand Total
    // const grandTotalValue = descriptions.reduce((acc, product) => acc + parseFloat(product.total || 0), 0).toFixed(2);
    // const grandTotalRow = ["", "", "", "", "Grand Total", `${grandTotalValue} /-`];

    pdf.autoTable({
        startY: y + lineHeight * 2, // Add extra space before the table
        head: [["Sr No", "Medicine", "Strength", "Dosage", "Timing", "Frequency","duration"]],
        body: [
            ...descriptions.map((product, index) => [
                index + 1,
                product.medicine,
                product.strength,
                product.dosage,
                product.timing,
                product.frequency,
                product.duration,
            ]),
            // grandTotalRow,
        ],
        theme: "grid",
        styles: { halign: "center", valign: "middle", fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0], font: "times" },
        columnStyles: {
            0: { halign: "center" }, // Serial No
            1: { halign: "left" },   // Description
            2: { halign: "center" }, // Quantity
            3: { halign: "center" }, // Price
            4: { halign: "center" }, // GST
            5: { halign: "center" }, // Total
            6: { halign: "center" }, // Tota
            7: { halign: "center" }, // Tota
        },
    });

    y = pdf.autoTable.previous.finalY + lineHeight;

    // Additional Details (like discount, payment mode, etc.)
    const additionalDetails = [];
    if (formDataa.discount > 0) {
        additionalDetails.push(["Discount:", `${formDataa.discount} %`]);
    }

    const amountPaid = parseFloat(formDataa.amountPaid) || 0;
    const remainingAmountValue = parseFloat(remainingAmount) || 0;
    
    pdf.autoTable({
        body: additionalDetails,
        startY: y,
        theme: "grid",
        styles: { halign: "left", valign: "middle", fontSize: 10, font: "times" },
        margin: { bottom: 30 },
    });

    y = pdf.autoTable.previous.finalY + lineHeight;

    // Footer (message at the bottom)
    const additionalMessage = "This bill has been computer-generated and is authorized.";
    pdf.setFontSize(10);
    pdf.text(additionalMessage, marginLeft, pdf.internal.pageSize.getHeight() - 10);

    pdf.save(`${invoiceNo}-${patient_name}.pdf`);
}

function InvoicePdf() {
    return <div></div>;
}

export default InvoicePdf;
