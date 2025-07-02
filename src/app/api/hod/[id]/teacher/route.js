// hod can view teachers of his/her department only 


import { connectToDatabase } from '../../../../lib/mongodb';
import teacherSchema from '../../../../models/teacherSchema';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const hodId = params.id;

    // ✅ Find HOD by ID and verify role
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json({ error: 'HOD not found or invalid role' }, { status: 404 });
    }

    const department = hod.department;

    // ✅ Find teachers in same department, excluding HODs and Admins
    const teachers = await teacherSchema.find({
      department,
      role: 'teacher',
    }).select('-password'); // Exclude password field

    return NextResponse.json({
      message: 'Teachers fetched successfully',
      department,
      teachers,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
