
// /app/api/hr/payslip/pdf/[staffId]/route.js

import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import connectDB from '@/lib/mongoose';
import { Payslip } from '@/models/payroll';
import mongoose from 'mongoose';
import PayslipPdf from '@/components/payslipPdf';
import Staff from '@/models/staff';

export async function GET(req, context) {
  //const { params } = await context; // ✅ Await context
  const staffId = context.params.staffId;

  await connectDB();


  try {
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return NextResponse.json({ success: false, message: 'Invalid staffId' }, { status: 400 });
    }

    const payslip = await Payslip.findOne({ staffId })
      .sort({ dateOfIssue: -1 })
      .populate('staffId')
      .lean();

    // 🔍 Log the actual payslip document passed to the PDF
    console.log('🧾 Payslip used for PDF generation:', JSON.stringify(payslip, null, 2));


    if (!payslip) {
      return NextResponse.json({ success: false, message: 'No payslip found' }, { status: 404 });
    }

    const stream = await renderToStream(<PayslipPdf payslip={payslip} />);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Payslip-${payslip.month}-${payslip.staffId.name}.pdf"`
      }
    });
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    console.error('PDF generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


