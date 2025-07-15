//get route to fetch particular student detail through id 
import { connectToDatabase } from '../../../lib/mongodb';
import studentSchema from '../../../models/studentSchema'; // adjust the import path if needed
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    // Fetch student by _id or studentId, exclude admissionId
    const studentData = isValidObjectId
      ? await studentSchema.findOne({ $or: [{ _id: id }, { studentId: id }] }, { admissionId: 0 })
      : await studentSchema.findOne({ studentId: id }, { admissionId: 0 });

    if (!studentData) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(studentData, { status: 200 });
  } catch (error) {
    console.error('[GET_STUDENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


