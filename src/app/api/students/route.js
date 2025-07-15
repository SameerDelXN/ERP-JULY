import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Student from '@/models/student';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const newStudent = await Student.create(body);
    return NextResponse.json({ success: true, data: newStudent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET method to fetch all students
export async function GET() {
  await connectDB();

  try {
    const students = await Student.find();
    return NextResponse.json({ success: true, data: students }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch students', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    await Student.deleteMany({});
    return Response.json({ success: true, message: 'All students deleted successfully.' });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
