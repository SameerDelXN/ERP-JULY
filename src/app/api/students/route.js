import { connectToDatabase } from '@/app/lib/mongodb';
import studentSchema from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    await connectToDatabase();

    const total = await studentSchema.countDocuments();

    const students = await studentSchema.find()
    
    return NextResponse.json({
      count: total,
      data: students,
    }, { status: 200 });

  } catch (error) {
    console.error('[GET_ALL_STUDENTS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
