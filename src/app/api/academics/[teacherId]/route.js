// app/api/teacher/assign/[teacherId]/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import teacherSchema from '../../../models/teacherSchema';

export async function POST(req, { params }) {
  try {
    await connectToDatabase();

    const { teacherId } = params;
    const body = await req.json();
    const { subjects, assignedDivisions } = body;

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required in URL' }, { status: 400 });
    }

    if (!Array.isArray(subjects) || !Array.isArray(assignedDivisions)) {
      return NextResponse.json({ error: 'subjects and assignedDivisions must be arrays' }, { status: 400 });
    }

    const teacher = await teacherSchema.findOne({ teacherId });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Update fields
    teacher.subjects = subjects;
    teacher.assignedDivisions = assignedDivisions;

    await teacher.save();

    return NextResponse.json({ message: 'Subjects and divisions assigned successfully', teacher }, { status: 200 });
  } catch (error) {
    console.error('Assignment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
