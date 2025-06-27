// src/app/api/teachers/[id]/dashboard/route.js

import { connectToDatabase } from '../../../../lib/mongodb';
import academicSchema from '../../../../models/academicSchema';
import teacherSchema from '../../../../models/teacherSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { _id } = params;

    if (!_id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing teacher ID' }, { status: 400 });
    }

    // Get teacher details
    const teacher = await teacherSchema.findById(_id).select('-password');
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Get all academic records where this teacher is teaching a subject
    const academicRecords = await academicSchema.find({
      'divisions.subjects.teacher': id,
    }).lean();

    // Format the data to only show relevant divisions/subjects
    const teachingSubjects = [];

    for (const record of academicRecords) {
      for (const division of record.divisions) {
        const matchingSubjects = division.subjects.filter(
          (subj) => subj.teacher.toString() === id
        );

        if (matchingSubjects.length > 0) {
          teachingSubjects.push({
            year: record.year,
            division: division.name,
            subjects: matchingSubjects.map((s) => s.name),
          });
        }
      }
    }

    return NextResponse.json({
      teacher,
      assignments: teachingSubjects,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
