
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Student from '@/models/student';

export async function GET(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: student }, { status: 200 });
  } catch (error) {
    console.error('GET /students/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
