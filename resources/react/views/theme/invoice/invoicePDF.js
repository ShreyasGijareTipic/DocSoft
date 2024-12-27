import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePDF(grandTotal, invoiceNo, patient_name, formData, remainingAmount, totalAmountWords, bills, descriptions, doctorData) {
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
    pdf.text(`Patient Name    : ${formData.patient_name}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Patient Address : ${formData.patient_address}`, marginLeft, y);
    y += lineHeight;
    pdf.text(`Mobile Number    : ${formData.patient_contact}`, marginLeft, y);
    y += lineHeight;

    pdf.text(`Bill No: ${formData.id}`, 145, y - lineHeight * 2); // Align to right side for Bill No
    const formattedDate = formData.visit_date ? formData.visit_date.split("-").reverse().join("-") : "Date Not Available";
    pdf.text(`Bill Date: ${formattedDate}`, 145, y - lineHeight);

    // Descriptions Table
    descriptions = descriptions || [];
    if (!Array.isArray(descriptions)) {
        console.error('Expected descriptions to be an array');
        return;
    }

    // Calculate Grand Total
    const grandTotalValue = descriptions.reduce((acc, product) => acc + parseFloat(product.total || 0), 0).toFixed(2);
    const grandTotalRow = ["", "", "", "", "Grand Total", `${grandTotalValue} /-`];

    pdf.autoTable({
        startY: y + lineHeight * 2, // Add extra space before the table
        head: [["Sr No", "Description", "Quantity", "Price (Rs)", "GST", "Total (Rs)"]],
        body: [
            ...descriptions.map((product, index) => [
                index + 1,
                product.description,
                product.quantity,
                `${parseFloat(product.price).toFixed(2)} /-`,
                product.gst,
                `${parseFloat(product.total).toFixed(2)} /-`
            ]),
            grandTotalRow,
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
        },
    });

    y = pdf.autoTable.previous.finalY + lineHeight;

    // Additional Details (like discount, payment mode, etc.)
    const additionalDetails = [];
    if (formData.discount > 0) {
        additionalDetails.push(["Discount:", `${formData.discount} %`]);
    }

    const amountPaid = parseFloat(formData.amountPaid) || 0;
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

    pdf.save(`${patient_name}.pdf`);
}

function InvoicePdf() {
    return <div></div>;
}

export default InvoicePdf;
