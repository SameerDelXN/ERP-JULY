import { connectToDatabase } from '../../lib/mongodb';
import studentSchema from '../../models/studentSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    const students = await studentSchema.find({}); // fetch all students
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('[GET_STUDENTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
