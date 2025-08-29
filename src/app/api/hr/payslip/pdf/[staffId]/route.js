
// /app/api/hr/payslip/pdf/[staffId]/route.js

import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
//import connectDB from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import { Payslip } from '@/models/payroll';
import mongoose from 'mongoose';
import PayslipPdf from '@/components/payslipPdf';
import Staff from '@/models/staff';

export async function GET(req, context) {
  const staffParam = context.params.staffId;
 
  await connectDB();
 
  try {
    let staff;
 
    // 1️⃣ If it's a valid ObjectId, try to find staff by _id
    if (mongoose.Types.ObjectId.isValid(staffParam)) {
      staff = await Staff.findById(staffParam);
    }
 
    // 2️⃣ If not found by _id, try finding by custom staffId (like STF010)
    if (!staff) {
      staff = await Staff.findOne({ staffId: staffParam });
    }
 
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }
 
    // 3️⃣ Find latest payslip using staff._id
    const payslip = await Payslip.findOne({ staffId: staff._id })
      .sort({ dateOfIssue: -1 })
      .populate('staffId')
      .lean();
 
    if (!payslip) {
      return NextResponse.json({ success: false, message: 'No payslip found' }, { status: 404 });
    }
 
    // 🧾 Log actual data being rendered
    console.log('🧾 Payslip used for PDF generation:', JSON.stringify(payslip, null, 2));
 
    const stream = await renderToStream(<PayslipPdf payslip={payslip} />);
 
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Payslip-${payslip.month}-${payslip.staffId.name}.pdf"`
      }
    });
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
 
export async function POST(req, context) {
  const staffParam = context.params.staffId;
  await connectDB();
  try {
    const { month, year } = await req.json();
    if (!month || !year) {
      return NextResponse.json({ success: false, message: 'Month and year are required.' }, { status: 400 });
    }
    let staff;
    if (mongoose.Types.ObjectId.isValid(staffParam)) {
      staff = await Staff.findById(staffParam);
    }
    if (!staff) {
      staff = await Staff.findOne({ staffId: staffParam });
    }
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }
    // Find payslip for this staff, month, and year
    const payslip = await Payslip.findOne({ staffId: staff._id, month, year }).populate('staffId').lean();
    if (!payslip) {
      return NextResponse.json({ success: false, message: 'No payslip found for this period' }, { status: 404 });
    }
    const stream = await renderToStream(<PayslipPdf payslip={payslip} />);
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Payslip-${payslip.month}-${payslip.staffId.name}.pdf"`
      }
    });
  } catch (error) {
    console.error('❌ PDF POST generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
 
