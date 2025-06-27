// src/app/api/teachers/[id]/dashboard/route.js

import { connectToDatabase } from '../../../../lib/mongodb';
import academicSchema from '../../../../models/academicSchema';
import teacherSchema from '../../../../models/teacherSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing teacher ID' }, { status: 400 });
    }

    // Fetch teacher details
    const teacher = await teacherSchema.findById(id).select('-password');
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Fetch all academic records where this teacher is assigned
    const academicRecords = await academicSchema.find({
      'divisions.subjects.teacher': id,
    }).lean();

    const assignments = [];

    for (const record of academicRecords) {
      for (const division of record.divisions) {
        const subjectsTaught = division.subjects.filter(
          (subject) => subject.teacher.toString() === id
        );

        if (subjectsTaught.length > 0) {
          assignments.push({
            year: record.year,
            division: division.name,
            subjects: subjectsTaught.map((s) => s.name),
          });
        }
      }
    }

    return NextResponse.json(
      {
        teacher,
        assignments,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
