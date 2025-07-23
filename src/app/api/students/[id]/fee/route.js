// /app/api/students/[id]/fee/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import  Student  from '@/models/student';
import { FeeStructure } from '@/models/feeStructure';

export async function GET(_, context ) {
  const studentId = context.params.id;
  console.log('➡️ Student ID from URL:', studentId);
  await connectDB();

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    const feeStructure = await FeeStructure.findOne({
      course: student.course || 'B.E.',
      category: student.category,
      class: student.class,
      department: student.department
    });

    if (!feeStructure) {
      return NextResponse.json({ success: false, message: 'Applicable fee structure not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        course: student.course,
        class: student.class,
        category: student.category,
        department: student.department
      },
      feeStructure: {
        fee: feeStructure.fee,
        totalFee: feeStructure.totalFee
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// PUT update student
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const body = await req.json();
    const student = await Student.findByIdAndUpdate(params.id, body, { new: true });
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 400 });
  }
}

// DELETE student
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const student = await Student.findByIdAndDelete(params.id);
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed', details: error.message }, { status: 400 });
  }
}