import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generateFeeReceiptPDF(receiptData) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = new Readable({ read() {} });

  doc.on('data', chunk => stream.push(chunk));
  doc.on('end', () => stream.push(null));

  doc.fontSize(18).text('College Name', { align: 'center' });
  doc.fontSize(14).text('Fee Receipt', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12)
    .text(`Receipt No: ${receiptData.receiptNumber}`)
    .text(`Date: ${new Date(receiptData.date).toLocaleDateString()}`)
    .text(`Academic Year: ${receiptData.academicYear}`)
    .moveDown();

  doc.text(`Student Name: ${receiptData.student.name}`)
    .text(`Course: ${receiptData.student.course}`)
    .text(`Roll Number: ${receiptData.student.rollNumber}`)
    .moveDown();

  doc.text(`Amount Paid: ₹${receiptData.amountPaid}`)
    .text(`Payment Mode: ${receiptData.paymentMode}`)
    .text(`Remarks: ${receiptData.remarks || '-'}`)
    .moveDown();

  doc.text('--- Thank You ---', { align: 'center' });

  doc.end();

  return stream;
}
