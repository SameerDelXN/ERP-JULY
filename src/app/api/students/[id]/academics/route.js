//get route to fetch academic details of particular student

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import academicSchema from '../../../../models/academicSchema';
import studentSchema from '../../../../models/studentSchema';
import teacherSchema from '../../../../models/teacherSchema';
import attendanceSchema from '../../../../models/attendanceSchema';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    await connectToDatabase();

    const studentExists = await studentSchema.findById(id);
    if (!studentExists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentObjectId = new mongoose.Types.ObjectId(id);

    // === Academic Data ===
    const academicData = await academicSchema.findOne({
      "years.divisions.students": studentObjectId,
    }).lean();

    let filteredAcademic = null;

    if (academicData) {
      let matchedYear = null;
      let matchedDivision = null;

      for (const year of academicData.years) {
        for (const division of year.divisions) {
          if (division.students.some((stu) => stu.toString() === id)) {
            matchedYear = {
              year: year.year,
              semester: year.semester,
              divisions: [division],
              _id: year._id,
            };
            matchedDivision = division;
            break;
          }
        }
        if (matchedYear) break;
      }

      if (matchedYear && matchedDivision) {
        const resolvedSubjects = await Promise.all(
          matchedDivision.subjects.map(async (subject) => {
            let teacherName = "Not Assigned";
            if (subject.teacher) {
              const teacher = await teacherSchema.findById(subject.teacher).lean();
              if (teacher) teacherName = teacher.fullName;
            }
            return { ...subject, teacherName };
          })
        );

        const resolvedTimetable = await Promise.all(
          matchedDivision.timetable.map(async (slot) => {
            let teacherName = "Not Assigned";
            if (slot.teacher) {
              const teacher = await teacherSchema.findById(slot.teacher).lean();
              if (teacher) teacherName = teacher.fullName;
            }
            return { ...slot, teacherName };
          })
        );

        matchedDivision.subjects = resolvedSubjects;
        matchedDivision.timetable = resolvedTimetable;

        filteredAcademic = {
          _id: academicData._id,
          department: academicData.department,
          years: [
            {
              ...matchedYear,
              divisions: [
                {
                  ...matchedDivision,
                  subjects: resolvedSubjects,
                  timetable: resolvedTimetable,
                },
              ],
            },
          ],
        };
      }
    }

    // === Attendance Data ===
    const attendanceRecords = await attendanceSchema.find({
      "students.studentId": studentObjectId,
    })
      .populate("teacher", "fullName")
      .sort({ date: -1 });

    const attendance = attendanceRecords.map((record) => {
      const studentEntry = record.students.find(
        (s) => s.studentId.toString() === id
      );

      return {
        date: record.date,
        subject: record.subject,
        teacherName: record.teacher?.fullName || "N/A",
        topicName: record.topicName,
        isPresent: studentEntry?.isPresent ?? false,
      };
    });

    return NextResponse.json(
      {
        academic: filteredAcademic ?? {},
        attendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
