// GET /api/teachers/[id]/teaches

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import academicSchema from '../../../models/academicSchema';

export async function GET(_, { params }) {
  try {
    await connectToDatabase();

    const teacherId = params.id;

    const academicRecords = await academicSchema.find({});

    const results = [];

    for (const record of academicRecords) {
      const year = record.year;
      const timetables = record.timetable || [];

      for (const timetable of timetables) {
        const division = timetable.divisionName;
        const slots = timetable.slots || [];

        for (const slot of slots) {
          if (String(slot.teacher) === String(teacherId)) {
            results.push({
              subjectCode: slot.subjectCode,
              division,
              year
            });
          }
        }
      }
    }

    return NextResponse.json({ data: results }, { status: 200 });

  } catch (error) {
    console.error('Error fetching teacher subjects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
