//GET handler to fetch teacher data name and subjects based on id to show on dashboard

import { connectToDatabase } from "../../../../lib/mongodb"
import academicSchema from "../../../../models/academicSchema"
import teacherSchema from "../../../../models/teacherSchema"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing teacher ID' }, { status: 400 });
    }

    // Get teacher details
    const teacher = await teacherSchema.findById(id).select('-password');
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Get academic records that reference the teacher
    const academicRecords = await academicSchema.find({
      'years.divisions.subjects.teacher': id,
    }).lean();

    const mySubjects = [];

    for (const record of academicRecords) {
      for (const yearObj of record.years) {
        const { year, semester, divisions } = yearObj;

        for (const division of divisions) {
          const subjectsTaught = division.subjects.filter(
            (subject) => subject.teacher.toString() === id
          );

          if (subjectsTaught.length > 0) {
            mySubjects.push({
              year,
              semester,
              division: division.name,
              subjects: subjectsTaught.map((s) => s.name),
            });
          }
        }
      }
    }

    return NextResponse.json(
      {
        teacher,
        mySubjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}