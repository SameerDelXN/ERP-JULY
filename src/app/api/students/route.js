import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Fetching students from database...");
    await connectToDatabase();

    const students = await Student.find({}); // fetch all students
    console.log(`Found ${students.length} students in database`);
    
    // Log first student details for debugging
    if (students.length > 0) {
      console.log("First student:", {
        studentId: students[0].studentId,
        fullName: students[0].fullName,
        email: students[0].email,
        prn: students[0].prn
      });
    }
    
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('[GET_STUDENTS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
