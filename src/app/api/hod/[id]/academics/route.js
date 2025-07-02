//hod can view academics of his/her department only 

import { connectToDatabase } from '../../../lib/mongodb';
import teacherSchema from '../../../models/teacherSchema';
import academicSchema from '../../../models/academicSchema';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const hodId = params.id;

    // ✅ Find the HOD by ID and validate role
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return NextResponse.json({ error: 'HOD not found or invalid role' }, { status: 404 });
    }

    const department = hod.department;

    // ✅ Get all academic data for the department
    const academics = await academicSchema.find({ department });

    return NextResponse.json({
      message: 'Academic data fetched successfully',
      department,
      academics,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching academic data for HOD:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
