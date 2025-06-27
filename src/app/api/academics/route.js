// // hod functions can add yr, subjects, division

import { connectToDatabase } from '../../lib/mongodb';
import academicSchema from '../../models/academicSchema';
import teacherSchema from '../../models/teacherSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Validate year and divisions array
    if (!data.year || !Array.isArray(data.divisions)) {
      return NextResponse.json({ error: 'Missing year or divisions' }, { status: 400 });
    }

    // Loop through divisions and validate teacher existence for each subject
    for (const division of data.divisions) {
      if (!division.name || !Array.isArray(division.subjects)) {
        return NextResponse.json({ error: 'Each division must have a name and subjects' }, { status: 400 });
      }

      for (const subject of division.subjects) {
        if (!subject.name || !subject.teacher) {
          return NextResponse.json({ error: 'Each subject must have a name and teacher' }, { status: 400 });
        }

        const teacher = await teacherSchema.findById(subject.teacher);
        if (!teacher) {
          return NextResponse.json({ error: `Teacher not found for subject ${subject.name}` }, { status: 404 });
        }

        // Add teacher info directly (if you want to embed)
        subject.teacherId = teacher.teacherId;
        subject.teacherName = teacher.fullName;
      }
    }

    // Create and save academic document
    const newAcademic = new academicSchema(data);
    await newAcademic.save();

    return NextResponse.json(
      { message: 'Academic record created successfully', academic: newAcademic },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating academic record:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
