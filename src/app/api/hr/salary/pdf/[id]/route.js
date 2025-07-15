import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Salary from '@/models/payroll';
import PDFDocument from 'pdfkit';
import getStream from 'get-stream';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
  await connectDB();

  try {
    const salaryId = params.id;

    const salary = await Salary.findById(salaryId).populate('staffId');
    if (!salary) {
      return NextResponse.json({ success: false, error: 'Salary record not found' }, { status: 404 });
    }

    // Path to font
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Italic-VariableFont_wdth,wght.ttf');
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ success: false, error: 'Font file is missing' }, { status: 500 });
    }

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.registerFont('Roboto', fontPath).font('Roboto');

    const bufferPromise = getStream.buffer(doc); // use directly instead of doc.pipe()

    doc.fontSize(20).text('Salary Payslip', { align: 'center' }).moveDown();

    // Staff details
    doc.fontSize(12).text(`Name: ${salary.staffId.name}`);
    doc.text(`Designation: ${salary.staffId.designation}`);
    doc.text(`Department: ${salary.staffId.department}`);
    doc.text(`Email: ${salary.staffId.email}`);
    doc.text(`Phone: ${salary.staffId.phone}`);
    doc.moveDown();

    // Salary details
    const base = salary.baseSalary || 0;
    const allow = salary.allowances || 0;
    const deduct = salary.deductions || 0;
    const net = base + allow - deduct;

    doc.text(`Base Salary: ₹${base}`);
    doc.text(`Allowances: ₹${allow}`);
    doc.text(`Deductions: ₹${deduct}`);
    doc.text(`Net Salary: ₹${net}`);
    doc.end();

    const buffer = await bufferPromise;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="salary_${salary.staffId.name || 'payslip'}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF Generation Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to generate salary PDF' }, { status: 500 });
  }
}


