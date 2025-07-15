import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Payslip } from '@/models/payroll';
import { Staff } from '@/models/staff';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';

export async function GET(_, { params }) {
  console.log(params);
  
  await connectDB();

  try {
    const payslip = await Payslip.findById(params.id).populate('staffId');

    if (!payslip) {
      return NextResponse.json({ success: false, error: 'Payslip not found' }, { status: 404 });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Header
    doc.fontSize(20).text('Salary Payslip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${payslip.staffId.name}`);
    doc.text(`Month: ${payslip.month}`);
    doc.text(`Department: ${payslip.staffId.department}`);
    doc.moveDown();

    // Salary details
    doc.text(`Base Salary: ₹${payslip.baseSalary}`);
    doc.text(`Allowances: ₹${payslip.allowances}`);
    doc.text(`Deductions: ₹${payslip.deductions}`);
    doc.text(`Net Salary: ₹${payslip.netSalary}`);

    doc.end();
    const pdfBuffer = await getStream.buffer(doc);

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Payslip-${payslip.month}.pdf"`,
      },
    });

  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ success: false, error: 'PDF generation failed' }, { status: 500 });
  }
}
