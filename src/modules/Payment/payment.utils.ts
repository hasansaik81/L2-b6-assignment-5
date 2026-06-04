// import PDFDocument from 'pdfkit';

// interface InvoiceData {
//     invoiceId: string;
//     studentName: string;
//     studentEmail: string;
//     tutorName: string;
//     sessionName: string; // Course ba Session er nam
//     amount: number;
//     transactionId: string;
//     paymentDate: string;
// }

// export const generateInvoicePdf = async (data: InvoiceData): Promise<Buffer> => {
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument({
//                 size: 'A4',
//                 margin: 50,
//             });

//             const chunks: Buffer[] = [];

//             doc.on('data', (chunk) => {
//                 chunks.push(chunk);
//             });

//             doc.on('end', () => {
//                 resolve(Buffer.concat(chunks));
//             });

//             doc.on('error', (error) => {
//                 reject(error);
//             });

//             // --- Header & Branding ---
//             doc.fillColor('#2c3e50').fontSize(24).font('Helvetica-Bold').text('PAYMENT INVOICE', {
//                 align: 'right',
//             });

//             doc.moveDown(0.5);
//             doc.fillColor('#444444')
//                 .fontSize(14)
//                 .font('Helvetica-Bold')
//                 .text('SkillBridge Learning Platform', { align: 'left' });
            
//             doc.fontSize(10).font('Helvetica').text('Level up your skills with experts', { align: 'left' });
//             doc.text('support@skillbridge.com | www.skillbridge.com');

//             doc.moveDown(1);

//             // Horizontal line
//             doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').stroke();
//             doc.moveDown(1);

//             // --- Invoice & Student Info ---
//             const topSectionY = doc.y;

//             // Invoice Details (Left Side)
//             doc.fontSize(11).font('Helvetica-Bold').text('Invoice Information');
//             doc.fontSize(10).font('Helvetica')
//                 .text(`Invoice ID: ${data.invoiceId}`)
//                 .text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`)
//                 .text(`Transaction ID: ${data.transactionId}`);

//             // Student Details (Right Side - Positioning)
//             doc.text('Student Information', 350, topSectionY, { font: 'Helvetica-Bold' });
//             doc.fontSize(10).font('Helvetica')
//                 .text(`Name: ${data.studentName}`, 350)
//                 .text(`Email: ${data.studentEmail}`, 350);

//             doc.moveDown(2);

//             // --- Course/Session Details ---
//             doc.fontSize(11).font('Helvetica-Bold').text('Learning Details', 50);
//             doc.moveTo(50, doc.y + 2).lineTo(545, doc.y + 2).stroke();
            
//             doc.moveDown(0.8);
//             doc.fontSize(10).font('Helvetica')
//                 .text(`Tutor: ${data.tutorName}`)
//                 .text(`Session/Course: ${data.sessionName}`);

//             doc.moveDown(2);

//             // --- Payment Summary Table ---
//             const tableTop = doc.y;
//             doc.fontSize(11).font('Helvetica-Bold').text('Payment Summary');
//             doc.moveDown(0.5);

//             // Table Header Background
//             doc.rect(50, doc.y, 495, 20).fill('#f9f9f9');
//             doc.fillColor('#2c3e50').fontSize(10).font('Helvetica-Bold');
//             doc.text('Description', 60, doc.y + 5);
//             doc.text('Amount (USD)', 450, doc.y - 10, { align: 'right', width: 80 });

//             doc.moveDown(1);

//             // Table Body
//             doc.fillColor('#444444').font('Helvetica');
//             const rowY = doc.y + 5;
//             doc.text(`Enrollment fee for ${data.sessionName}`, 60, rowY);
//             doc.text(`${data.amount.toFixed(2)}`, 450, rowY, { align: 'right', width: 80 });

//             doc.moveDown(1);
//             doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').stroke();
            
//             // Total Row
//             doc.moveDown(0.5);
//             doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold');
//             doc.text('Grand Total:', 350, doc.y);
//             doc.text(`$${data.amount.toFixed(2)}`, 450, doc.y - 12, { align: 'right', width: 80 });

//             // --- Footer ---
//             const footerY = 750;
//             doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor('#eeeeee').stroke();

//             doc.fontSize(9).font('Helvetica').fillColor('#7f8c8d').text(
//                 'SkillBridge is an online platform connecting learners with world-class tutors.',
//                 50, footerY + 15, { align: 'center', width: 495 }
//             );

//             doc.text('This is an auto-generated invoice. No signature required.', { align: 'center' });
//             doc.fillColor('#3498db').text('Securely processed by Stripe', { align: 'center', link: 'https://stripe.com' });

//             // Finalize PDF
//             doc.end();
//         } catch (error) {
//             reject(error);
//         }
//     });
// };




import PDFDocument from "pdfkit";

interface InvoiceData {
  invoiceId: string;
  studentName: string;
  studentEmail: string;
  tutorName: string;
  bookingDate: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}

export const generateInvoicePdf = async (
  data: InvoiceData
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // HEADER
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("SKILLBRIDGE INVOICE", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(11)
        .font("Helvetica")
        .text("SkillBridge Learning Platform", {
          align: "center",
        });

      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();

      // Invoice Info
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Invoice Information");

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Invoice ID: ${data.invoiceId}`)
        .text(`Transaction ID: ${data.transactionId}`)
        .text(
          `Payment Date: ${new Date(
            data.paymentDate
          ).toLocaleDateString()}`
        );

      doc.moveDown();

      // Student Info
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Student Information");

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Student Name: ${data.studentName}`)
        .text(`Student Email: ${data.studentEmail}`);

      doc.moveDown();

      // Tutor Info
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Tutor Information");

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Tutor Name: ${data.tutorName}`);

      doc.moveDown();

      // Booking Info
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Booking Details");

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Booking Date: ${new Date(
            data.bookingDate
          ).toLocaleDateString()}`
        );

      doc.moveDown();

      // Amount
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Payment Summary");

      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Session Fee: ${data.amount} USD`);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Total Paid: ${data.amount} USD`);

      doc.moveDown(2);

      // Footer
      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          "Thank you for using SkillBridge platform.",
          {
            align: "center",
          }
        );

      doc.text(
        "This invoice was generated automatically after successful payment.",
        {
          align: "center",
        }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};