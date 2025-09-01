import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { FeeReceipt } from '@/models/feeReceipt';
import  Student  from '@/models/student';
import  {FeeStructure}  from '@/models/feeStructure';

export async function POST(req) {
  await connectDB();

  const { studentId, paymentMode, remarks } = await req.json();

  // Validate student
  const student = await Student.findById(studentId);
  console.log(student);
  if (!student) {
    return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
  }

  // Find fee structure by course and category
  const feeStructure = await FeeStructure.findOne({
    course: student.course,
    class: student.class, // FE, SE, TE
    category: student.category,
    // academicYear: student.academicYear || '2025-2026',
  });

  if (!feeStructure) {
    return NextResponse.json({ success: false, error: 'Fee structure not found' }, { status: 404 });
  }

  // Calculate total payable fee
  const total = feeStructure.total;
  //const discount = student.discount || 0;
  //const scholarship = student.scholarship || 0;
  const amountPaid = total //- discount - scholarship;
  if (!amountPaid || amountPaid < 0) {
      return NextResponse.json({ success: false, error: "Invalid amount calculation" }, { status: 400 });
  }

  
  // Generate a unique receipt number (simple logic)
  const count = await FeeReceipt.countDocuments();
  const receiptNumber = `REC2025-${String(count + 1).padStart(4, '0')}`;

  // Create receipt
  const newReceipt = await FeeReceipt.create({
    student: student._id,
    receiptNumber,
    amountPaid,
    paymentMode,
    remarks,
    academicYear: student.academicYear || '2025-2026'
  });

  return NextResponse.json({ success: true, receipt: newReceipt });
}
