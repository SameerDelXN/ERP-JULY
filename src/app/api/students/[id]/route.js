//get and put route to fetch particular student detail through id and also update it 
 
import { connectToDatabase } from '../../../lib/mongodb';
import studentSchema from '../../../models/studentSchema'; // adjust the import path if needed
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } =await params;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    // Fetch student by _id or studentId, exclude admissionId
    // const studentData = isValidObjectId
    //   ? await studentSchema.findOne({ $or: [{ _id: id }, { studentId: id }] }, { admissionId: 0 })
    //   : await studentSchema.findOne({ studentId: id }, { admissionId: 0 });

    const studentData = isValidObjectId
      ? await studentSchema.findOne({ $or: [{ _id: id }, { studentId: id }] })
      : await studentSchema.findOne({ studentId: id });

    if (!studentData) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(studentData, { status: 200 });
  } catch (error) {
    console.error('[GET_STUDENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  await connectToDatabase();

  const { id } = params; // MongoDB _id or studentId, depending on what you're using
  const data = await req.json();

  try {
    const updatedStudent = await studentSchema.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Error updating student', error }, { status: 500 });
  }
}