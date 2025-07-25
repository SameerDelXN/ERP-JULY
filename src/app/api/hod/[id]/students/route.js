import { Types } from 'mongoose';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/mongodb';
import attendanceSchema from '../../../../models/attendanceSchema';
import studentSchema from '../../../../models/studentSchema';
import teacherSchema from '../../../../models/teacherSchema';
import academicSchema from '../../../../models/academicSchema';
import userSchema from '../../../../models/userSchema'; // Assuming HOD is in 'User' model
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid HOD ID' }, { status: 400 });
    }

    // Step 1: Get HOD's department from User model
    const hod = await teacherSchema.findById(id).lean();

    if (!hod || !hod.department) {
      return NextResponse.json({ message: 'HOD or department not found' }, { status: 404 });
    }

    // Step 2: Use department name to find academic document
    const academicDoc = await academicSchema.findOne({ department: hod.department })
      .populate({
        path: 'years.divisions.students',
        model: studentSchema,
        select: 'fullName studentId email',
      })
      .lean();

    if (!academicDoc) {
      return NextResponse.json({ message: 'No academic data found for this department' }, { status: 404 });
    }

    // Step 3: Fetch attendance records
    const attendanceRecords = await attendanceSchema.find({
      department: academicDoc.department,
    }).lean();

    // Step 4: Transform data
    const transformed = {
      years: academicDoc.years.map((year) => ({
        year: year.year,
        semester: year.semester,
        divisions: year.divisions.map((division) => ({
          division: division.name,
          students: (division.students || []).map((stu) => ({
            id: stu._id,
            name: stu.fullName || 'Unnamed',
            roll: stu.studentId || 'N/A',
            email: stu.email || '',
            attendance: buildStudentAttendance(
              attendanceRecords,
              year.year,
              year.semester,
              division.name,
              stu._id
            ),
          })),
        })),
      })),
    };

    return NextResponse.json(transformed, { status: 200 });

  } catch (error) {
    console.error('Error fetching academic data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ➤ Build subject-wise attendance percentages
function buildStudentAttendance(attendanceRecords, year, semester, division, studentId) {
  const subjectMap = {};

  attendanceRecords
    .filter(record =>
      record.year === year &&
      record.semester === semester &&
      record.division === division
    )
    .forEach(record => {
      const subject = record.subject || 'Unknown Subject';
      const studentEntry = record.students.find(s => s.studentId?.toString() === studentId.toString());
      if (!studentEntry) return;

      if (!subjectMap[subject]) subjectMap[subject] = { total: 0, present: 0 };

      subjectMap[subject].total += 1;
      if (studentEntry.isPresent) {
        subjectMap[subject].present += 1;
      }
    });

  const percentageMap = {};
  for (const subject in subjectMap) {
    const { total, present } = subjectMap[subject];
    percentageMap[subject] = total > 0 ? Math.round((present / total) * 100) : 0;
  }

  return percentageMap;
}
